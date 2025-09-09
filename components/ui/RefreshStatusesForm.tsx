'use client';

import { useState } from 'react';

interface RefreshStatusesFormProps {
  onSubmit: (formData: any) => void;
}

export default function RefreshStatusesForm({ onSubmit }: RefreshStatusesFormProps) {
  const [formData, setFormData] = useState({
    scope: 'all',
    statusFilter: 'all',
    bankFilter: 'all',
    dateRange: '7d',
    autoRefresh: false,
    notifications: true
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">Область обновления</label>
        <select
          name="scope"
          value={formData.scope}
          onChange={handleChange}
          className="form-select"
        >
          <option value="all">Все транзакции</option>
          <option value="pending">Только ожидающие</option>
          <option value="processing">Только в обработке</option>
          <option value="failed">Только неудачные</option>
          <option value="today">За сегодня</option>
        </select>
      </div>

      <div>
        <label className="form-label">Фильтр по статусу</label>
        <select
          name="statusFilter"
          value={formData.statusFilter}
          onChange={handleChange}
          className="form-select"
        >
          <option value="all">Все статусы</option>
          <option value="pending">Ожидающие</option>
          <option value="processing">В обработке</option>
          <option value="completed">Завершенные</option>
          <option value="failed">Неудачные</option>
        </select>
      </div>

      <div>
        <label className="form-label">Фильтр по банку</label>
        <select
          name="bankFilter"
          value={formData.bankFilter}
          onChange={handleChange}
          className="form-select"
        >
          <option value="all">Все банки</option>
          <option value="demir">ОАО &ldquo;Демир Банк&rdquo;</option>
          <option value="rsk">ОАО &ldquo;РСК Банк&rdquo;</option>
          <option value="ayil">ОАО &ldquo;Айыл Банк&rdquo;</option>
        </select>
      </div>

      <div>
        <label className="form-label">Период</label>
        <select
          name="dateRange"
          value={formData.dateRange}
          onChange={handleChange}
          className="form-select"
        >
          <option value="1d">Последние 24 часа</option>
          <option value="7d">Последние 7 дней</option>
          <option value="30d">Последние 30 дней</option>
          <option value="90d">Последние 90 дней</option>
        </select>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Дополнительные настройки</h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="autoRefresh"
            checked={formData.autoRefresh}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Автоматическое обновление каждые 5 минут
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
            Уведомления об изменениях статусов
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
          <i className="ri-refresh-line mr-2"></i>
          Обновить статусы
        </button>
      </div>
    </form>
  );
}
