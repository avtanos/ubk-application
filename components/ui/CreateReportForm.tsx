'use client';

import { useState } from 'react';

interface CreateReportFormProps {
  onSubmit: (formData: any) => void;
}

export default function CreateReportForm({ onSubmit }: CreateReportFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'financial_report',
    description: '',
    period: 'monthly',
    dateFrom: '',
    dateTo: '',
    format: 'excel',
    includeCharts: true,
    includeDetails: true,
    emailNotification: '',
    autoGenerate: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">Название отчета</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          placeholder="Введите название отчета"
          required
        />
      </div>

      <div>
        <label className="form-label">Тип отчета</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="form-select"
        >
          <option value="financial_report">Финансовый отчет</option>
          <option value="payments_summary">Сводка платежей</option>
          <option value="applications_summary">Сводка заявлений</option>
          <option value="risk_analysis">Анализ рисков</option>
          <option value="performance_report">Отчет производительности</option>
          <option value="audit_report">Аудит отчет</option>
        </select>
      </div>

      <div>
        <label className="form-label">Описание</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Описание назначения отчета..."
        />
      </div>

      <div>
        <label className="form-label">Период</label>
        <select
          name="period"
          value={formData.period}
          onChange={handleChange}
          className="form-select"
        >
          <option value="daily">Ежедневно</option>
          <option value="weekly">Еженедельно</option>
          <option value="monthly">Ежемесячно</option>
          <option value="quarterly">Ежеквартально</option>
          <option value="yearly">Ежегодно</option>
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
        <label className="form-label">Формат отчета</label>
        <select
          name="format"
          value={formData.format}
          onChange={handleChange}
          className="form-select"
        >
          <option value="excel">Excel (.xlsx)</option>
          <option value="pdf">PDF (.pdf)</option>
          <option value="csv">CSV (.csv)</option>
          <option value="json">JSON (.json)</option>
        </select>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Содержимое отчета</h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="includeCharts"
            checked={formData.includeCharts}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Включить графики и диаграммы
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="includeDetails"
            checked={formData.includeDetails}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Включить детальную информацию
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Дополнительные настройки</h4>
        
        <div>
          <label className="form-label">Email для уведомления</label>
          <input
            type="email"
            name="emailNotification"
            value={formData.emailNotification}
            onChange={handleChange}
            className="form-input"
            placeholder="admin@example.com"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="autoGenerate"
            checked={formData.autoGenerate}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Автоматическая генерация по расписанию
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
          <i className="ri-add-line mr-2"></i>
          Создать отчет
        </button>
      </div>
    </form>
  );
}
