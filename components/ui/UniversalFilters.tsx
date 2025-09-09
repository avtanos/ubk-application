'use client';

import { useState } from 'react';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'number' | 'daterange';
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
}

interface UniversalFiltersProps {
  title: string;
  filters: FilterConfig[];
  onFiltersChange: (filters: Record<string, any>) => void;
  onClearFilters: () => void;
  initialFilters?: Record<string, any>;
}

export default function UniversalFilters({
  title,
  filters,
  onFiltersChange,
  onClearFilters,
  initialFilters = {}
}: UniversalFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  const renderFilterInput = (filter: FilterConfig) => {
    const value = activeFilters[filter.key] || '';

    switch (filter.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value || undefined)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Все</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'text':
        return (
          <input
            type="text"
            placeholder={filter.placeholder || 'Введите значение'}
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value || undefined)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value || undefined)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            placeholder={filter.placeholder || '0'}
            min={filter.min}
            max={filter.max}
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'daterange':
        return (
          <div className="flex gap-2">
            <input
              type="date"
              placeholder="От"
              value={value?.from || ''}
              onChange={(e) => handleFilterChange(filter.key, { ...value, from: e.target.value || undefined })}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              placeholder="До"
              value={value?.to || ''}
              onChange={(e) => handleFilterChange(filter.key, { ...value, to: e.target.value || undefined })}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getFilterDisplayValue = (filter: FilterConfig) => {
    const value = activeFilters[filter.key];
    if (!value) return null;

    switch (filter.type) {
      case 'select':
        const option = filter.options?.find(opt => opt.value === value);
        return option ? option.label : value;
      case 'daterange':
        const from = value.from ? new Date(value.from).toLocaleDateString('ru-RU') : '';
        const to = value.to ? new Date(value.to).toLocaleDateString('ru-RU') : '';
        return from && to ? `${from} - ${to}` : from || to;
      default:
        return value;
    }
  };

  const getFilterColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-3 md:p-4 mb-4 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2">
        <h3 className="text-base md:text-lg font-semibold text-neutral-900">{title}</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs md:text-sm text-red-600 hover:text-red-700 font-medium"
            >
              <span className="hidden sm:inline">Очистить фильтры</span>
              <span className="sm:hidden">Очистить</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <span className="hidden sm:inline">{isExpanded ? 'Скрыть' : 'Показать'} фильтры</span>
            <span className="sm:hidden">{isExpanded ? 'Скрыть' : 'Фильтры'}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {filters.map(filter => (
            <div key={filter.key}>
              <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1">
                {filter.label}
              </label>
              {renderFilterInput(filter)}
            </div>
          ))}
        </div>
      )}

      {/* Активные фильтры */}
      {hasActiveFilters && (
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-neutral-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs md:text-sm text-neutral-600">Активные фильтры:</span>
            {filters.map((filter, index) => {
              const displayValue = getFilterDisplayValue(filter);
              if (!displayValue) return null;

              return (
                <span
                  key={filter.key}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFilterColor(index)}`}
                >
                  <span className="hidden sm:inline">{filter.label}: {displayValue}</span>
                  <span className="sm:hidden">{displayValue}</span>
                  <button
                    onClick={() => handleFilterChange(filter.key, undefined)}
                    className="ml-1 hover:opacity-75"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
