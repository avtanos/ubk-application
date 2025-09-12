'use client';

import { ReactNode, useState, useMemo } from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: { value: string; label: string }[];
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export default function DataTable({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = 'Нет данных для отображения',
  className = '',
  searchable = false,
  sortable = false,
  filterable = false
}: DataTableProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Фильтрация данных
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Применяем фильтры
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        filtered = filtered.filter(row => {
          const cellValue = row[key];
          if (cellValue === null || cellValue === undefined) return false;
          
          const stringValue = cellValue.toString().toLowerCase();
          const filterValue = value.toLowerCase();
          
          return stringValue.includes(filterValue);
        });
      }
    });

    // Применяем сортировку
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, filters, sortConfig]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSort = (key: string) => {
    if (!sortable) return;
    
    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const clearFilters = () => {
    setFilters({});
  };
  if (loading) {
    return (
      <div className={`table-container ${className}`}>
        <div className="p-8 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-neutral-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`table-container ${className}`}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="ri-database-2-line text-4xl"></i>
          </div>
          <h3 className="empty-state-title">Нет данных</h3>
          <p className="empty-state-description">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="table">
          <thead className="table-header">
            {/* Header Row */}
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="table-header-cell">
                  <div className="flex items-center space-x-2">
                    <span 
                      className={sortable && column.sortable ? 'cursor-pointer hover:text-blue-600' : ''}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      {column.label}
                    </span>
                    {sortable && column.sortable && (
                      <div className="flex flex-col">
                        <i className={`ri-arrow-up-s-line text-xs ${
                          sortConfig?.key === column.key && sortConfig.direction === 'asc' 
                            ? 'text-blue-600' 
                            : 'text-gray-400'
                        }`}></i>
                        <i className={`ri-arrow-down-s-line text-xs -mt-1 ${
                          sortConfig?.key === column.key && sortConfig.direction === 'desc' 
                            ? 'text-blue-600' 
                            : 'text-gray-400'
                        }`}></i>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
            {/* Filter Row */}
            {filterable && (
              <tr className="bg-gray-50">
                {columns.map((column) => (
                  <td key={`filter-${column.key}`} className="table-cell p-2">
                    {column.filterable !== false ? (
                      <div className="w-full">
                        {column.filterType === 'select' && column.filterOptions ? (
                          <select
                            value={filters[column.key] || ''}
                            onChange={(e) => handleFilterChange(column.key, e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Все</option>
                            {column.filterOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : column.filterType === 'date' ? (
                          <input
                            type="date"
                            value={filters[column.key] || ''}
                            onChange={(e) => handleFilterChange(column.key, e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : column.filterType === 'number' ? (
                          <input
                            type="number"
                            placeholder="Число..."
                            value={filters[column.key] || ''}
                            onChange={(e) => handleFilterChange(column.key, e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <input
                            type="text"
                            placeholder="Поиск..."
                            value={filters[column.key] || ''}
                            onChange={(e) => handleFilterChange(column.key, e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="h-8"></div>
                    )}
                  </td>
                ))}
              </tr>
            )}
          </thead>
          <tbody className="table-body">
            {filteredData.map((row, index) => (
              <tr key={index} className="table-row">
                {columns.map((column) => (
                  <td key={column.key} className="table-cell">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredData.map((row, index) => (
          <div key={index} className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-b-0">
                <span className="text-sm font-medium text-neutral-600">{column.label}:</span>
                <div className="text-sm text-neutral-900 text-right">
                  {column.render 
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Filter Controls */}
      {filterable && Object.keys(filters).some(key => filters[key]) && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Показано {filteredData.length} из {data.length} записей
          </div>
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
          >
            Очистить фильтры
          </button>
        </div>
      )}
    </div>
  );
}
