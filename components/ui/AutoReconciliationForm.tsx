'use client';

import { useState } from 'react';

interface AutoReconciliationFormProps {
  onSubmit: (formData: any) => void;
}

export default function AutoReconciliationForm({ onSubmit }: AutoReconciliationFormProps) {
  const [formData, setFormData] = useState({
    banks: [] as string[],
    period: '30d',
    dateFrom: '',
    dateTo: '',
    autoResolve: false,
    notifications: true,
    priority: 'normal'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        banks: [...formData.banks, value]
      });
    } else {
      setFormData({
        ...formData,
        banks: formData.banks.filter(bank => bank !== value)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Выберите банки</h4>
        
        <div className="space-y-2">
          {[
            { value: 'demir', label: 'ОАО "Демир Банк"' },
            { value: 'rsk', label: 'ОАО "РСК Банк"' },
            { value: 'ayil', label: 'ОАО "Айыл Банк"' }
          ].map((bank) => (
            <div key={bank.value} className="flex items-center">
              <input
                type="checkbox"
                id={bank.value}
                value={bank.value}
                checked={formData.banks.includes(bank.value)}
                onChange={handleBankChange}
                className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={bank.value} className="ml-2 text-sm text-neutral-700">
                {bank.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label">Период сверки</label>
        <select
          name="period"
          value={formData.period}
          onChange={handleChange}
          className="form-select"
        >
          <option value="7d">Последние 7 дней</option>
          <option value="30d">Последние 30 дней</option>
          <option value="90d">Последние 90 дней</option>
          <option value="custom">Произвольный период</option>
        </select>
      </div>

      {formData.period === 'custom' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Дата от</label>
            <input
              type="date"
              name="dateFrom"
              value={formData.dateFrom}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Дата до</label>
            <input
              type="date"
              name="dateTo"
              value={formData.dateTo}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>
      )}

      <div>
        <label className="form-label">Приоритет</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="form-select"
        >
          <option value="low">Низкий</option>
          <option value="normal">Обычный</option>
          <option value="high">Высокий</option>
        </select>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Дополнительные настройки</h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="autoResolve"
            checked={formData.autoResolve}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Автоматически разрешать простые расхождения
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="notifications"
            checked={formData.notifications}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Уведомления о завершении сверки
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={() => onSubmit({})}
          className="btn-secondary"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          <i className="ri-play-line mr-2"></i>
          Запустить сверку
        </button>
      </div>
    </form>
  );
}
