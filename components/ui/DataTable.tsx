'use client';

import { ReactNode } from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
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
}

export default function DataTable({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = 'Нет данных для отображения',
  className = '',
  searchable = false,
  sortable = false
}: DataTableProps) {
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
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="table-header-cell">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-body">
            {data.map((row, index) => (
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
        {data.map((row, index) => (
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
    </div>
  );
}
