'use client';

import { useState } from 'react';

interface ExportReportFormProps {
  onSubmit: (formData: any) => void;
}

export default function ExportReportForm({ onSubmit }: ExportReportFormProps) {
  const [formData, setFormData] = useState({
    reportType: 'transactions',
    format: 'excel',
    period: '30d',
    dateFrom: '',
    dateTo: '',
    statusFilter: 'all',
    bankFilter: 'all',
    includeDetails: true,
    includeStatistics: true,
    emailNotification: '',
    scheduleExport: false
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
        <label className="form-label">Тип отчета</label>
        <select
          name="reportType"
          value={formData.reportType}
          onChange={handleChange}
          className="form-select"
        >
          <option value="transactions">Отчет по транзакциям</option>
          <option value="summary">Сводный отчет</option>
          <option value="errors">Отчет об ошибках</option>
          <option value="statistics">Статистический отчет</option>
          <option value="bank">Отчет по банкам</option>
        </select>
      </div>

      <div>
        <label className="form-label">Формат экспорта</label>
        <select
          name="format"
          value={formData.format}
          onChange={handleChange}
          className="form-select"
        >
          <option value="excel">Excel (.xlsx)</option>
          <option value="csv">CSV (.csv)</option>
          <option value="pdf">PDF (.pdf)</option>
          <option value="json">JSON (.json)</option>
        </select>
      </div>

      <div>
        <label className="form-label">Период</label>
        <select
          name="period"
          value={formData.period}
          onChange={handleChange}
          className="form-select"
        >
          <option value="1d">Последние 24 часа</option>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Фильтр по статусу</label>
          <select
            name="statusFilter"
            value={formData.statusFilter}
            onChange={handleChange}
            className="form-select"
          >
            <option value="all">Все статусы</option>
            <option value="completed">Завершенные</option>
            <option value="processing">В обработке</option>
            <option value="pending">Ожидающие</option>
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
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Содержимое отчета</h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="includeDetails"
            checked={formData.includeDetails}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Включить детальную информацию по транзакциям
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="includeStatistics"
            checked={formData.includeStatistics}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Включить статистику и аналитику
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Уведомления</h4>
        
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
            name="scheduleExport"
            checked={formData.scheduleExport}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Настроить регулярный экспорт
          </label>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Информация об экспорте</h4>
        <div className="text-sm text-blue-800">
          <p>• Отчет будет сгенерирован в течение 2-5 минут</p>
          <p>• Файл будет доступен для скачивания в течение 24 часов</p>
          <p>• При указании email отчет будет отправлен автоматически</p>
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
          className="btn-info"
        >
          <i className="ri-download-line mr-2"></i>
          Экспортировать отчет
        </button>
      </div>
    </form>
  );
}
