'use client';

import React from 'react';
import { DirectoryItem, getDirectory } from '@/lib/directories';

interface DirectorySelectProps {
  directoryName: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export const DirectorySelect: React.FC<DirectorySelectProps> = ({
  directoryName,
  value,
  onChange,
  placeholder = 'Выберите значение',
  disabled = false,
  required = false,
  className = '',
  label,
  error
}) => {
  const directory = getDirectory(directoryName);
  const selectedItem = directory.find(item => item.id === value);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent 
          transition-all duration-200 bg-white text-neutral-900
          ${error ? 'border-red-500' : 'border-neutral-300'}
          ${disabled ? 'bg-neutral-100 cursor-not-allowed' : 'hover:border-neutral-400'}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {directory.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {selectedItem && (
        <p className="text-xs text-neutral-500">
          Код: {selectedItem.code || selectedItem.id}
        </p>
      )}
    </div>
  );
};

// Компонент для множественного выбора
interface DirectoryMultiSelectProps {
  directoryName: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
  error?: string;
  maxSelections?: number;
}

export const DirectoryMultiSelect: React.FC<DirectoryMultiSelectProps> = ({
  directoryName,
  values,
  onChange,
  placeholder = 'Выберите значения',
  disabled = false,
  required = false,
  className = '',
  label,
  error,
  maxSelections
}) => {
  const directory = getDirectory(directoryName);
  const selectedItems = directory.filter(item => values.includes(item.id));

  const handleToggle = (itemId: string) => {
    if (disabled) return;
    
    const newValues = values.includes(itemId)
      ? values.filter(id => id !== itemId)
      : [...values, itemId];
    
    if (maxSelections && newValues.length > maxSelections) {
      return; // Не добавляем, если превышен лимит
    }
    
    onChange(newValues);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {maxSelections && (
            <span className="text-xs text-neutral-500 ml-2">
              (максимум {maxSelections})
            </span>
          )}
        </label>
      )}
      
      <div className="border border-neutral-300 rounded-lg p-3 bg-white">
        <div className="max-h-48 overflow-y-auto space-y-2">
          {directory.map((item) => (
            <label
              key={item.id}
              className={`
                flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors
                ${values.includes(item.id) 
                  ? 'bg-brand-red/10 text-brand-red' 
                  : 'hover:bg-neutral-50'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              <input
                type="checkbox"
                checked={values.includes(item.id)}
                onChange={() => handleToggle(item.id)}
                disabled={disabled || (maxSelections && values.length >= maxSelections && !values.includes(item.id))}
                className="w-4 h-4 text-brand-red border-neutral-300 rounded focus:ring-brand-red"
              />
              <span className="flex-1 text-sm">{item.name}</span>
              {item.code && (
                <span className="text-xs text-neutral-500">{item.code}</span>
              )}
            </label>
          ))}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {selectedItems.length > 0 && (
        <div className="text-xs text-neutral-500">
          Выбрано: {selectedItems.map(item => item.name).join(', ')}
        </div>
      )}
    </div>
  );
};

// Компонент для поиска в справочнике
interface DirectorySearchProps {
  directoryName: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
  error?: string;
  searchPlaceholder?: string;
}

export const DirectorySearch: React.FC<DirectorySearchProps> = ({
  directoryName,
  value,
  onChange,
  placeholder = 'Выберите значение',
  disabled = false,
  required = false,
  className = '',
  label,
  error,
  searchPlaceholder = 'Поиск...'
}) => {
  const directory = getDirectory(directoryName);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [filteredItems, setFilteredItems] = React.useState(directory);

  const selectedItem = directory.find(item => item.id === value);

  React.useEffect(() => {
    const filtered = directory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredItems(filtered);
  }, [searchTerm, directory]);

  const handleSelect = (item: DirectoryItem) => {
    onChange(item.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div
          className={`
            w-full px-4 py-3 border rounded-lg cursor-pointer flex items-center justify-between
            transition-all duration-200 bg-white text-neutral-900
            ${error ? 'border-red-500' : 'border-neutral-300'}
            ${disabled ? 'bg-neutral-100 cursor-not-allowed' : 'hover:border-neutral-400'}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={selectedItem ? 'text-neutral-900' : 'text-neutral-500'}>
            {selectedItem ? selectedItem.name : placeholder}
          </span>
          <svg
            className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="p-3 border-b border-neutral-200">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-brand-red focus:border-transparent"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0"
                    onClick={() => handleSelect(item)}
                  >
                    <div className="font-medium text-neutral-900">{item.name}</div>
                    {item.code && (
                      <div className="text-sm text-neutral-500">Код: {item.code}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-neutral-500 text-center">
                  Ничего не найдено
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {selectedItem && (
        <p className="text-xs text-neutral-500">
          Код: {selectedItem.code || selectedItem.id}
        </p>
      )}
    </div>
  );
};
