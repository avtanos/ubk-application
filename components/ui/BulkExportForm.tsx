'use client';

import { useState } from 'react';

interface BulkExportFormProps {
  onSubmit: (formData: any) => void;
}

export default function BulkExportForm({ onSubmit }: BulkExportFormProps) {
  const [formData, setFormData] = useState({
    format: 'excel',
    period: '30d',
    dateFrom: '',
    dateTo: '',
    reportTypes: [] as string[],
    statusFilter: 'all',
    includeCharts: true,
    includeDetails: true,
    compressFiles: false,
    emailNotification: '',
    scheduleExport: false
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

  const handleReportTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        reportTypes: [...formData.reportTypes, value]
      });
    } else {
      setFormData({
        ...formData,
        reportTypes: formData.reportTypes.filter(type => type !== value)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">Формат экспорта</label>
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
          <option value="zip">ZIP архив</option>
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

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Типы отчетов</h4>
        
        <div className="space-y-2">
          {[
            { value: 'financial_report', label: 'Финансовый отчет' },
            { value: 'payments_summary', label: 'Сводка платежей' },
            { value: 'applications_summary', label: 'Сводка заявлений' },
            { value: 'risk_analysis', label: 'Анализ рисков' },
            { value: 'performance_report', label: 'Отчет производительности' },
            { value: 'audit_report', label: 'Аудит отчет' }
          ].map((type) => (
            <div key={type.value} className="flex items-center">
              <input
                type="checkbox"
                id={type.value}
                value={type.value}
                checked={formData.reportTypes.includes(type.value)}
                onChange={handleReportTypeChange}
                className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={type.value} className="ml-2 text-sm text-neutral-700">
                {type.label}
              </label>
            </div>
          ))}
        </div>
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
          <option value="completed">Завершенные</option>
          <option value="generating">В генерации</option>
          <option value="failed">Неудачные</option>
        </select>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Содержимое отчетов</h4>
        
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

        <div className="flex items-center">
          <input
            type="checkbox"
            name="compressFiles"
            checked={formData.compressFiles}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Сжать файлы в архив
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
          <p>• Экспорт займет от 2 до 10 минут в зависимости от количества отчетов</p>
          <p>• Файлы будут доступны для скачивания в течение 24 часов</p>
          <p>• При указании email файлы будут отправлены автоматически</p>
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
          Экспортировать отчеты
        </button>
      </div>
    </form>
  );
}
