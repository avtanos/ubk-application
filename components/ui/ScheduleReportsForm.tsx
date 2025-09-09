'use client';

import { useState } from 'react';

interface ScheduleReportsFormProps {
  onSubmit: (formData: any) => void;
}

export default function ScheduleReportsForm({ onSubmit }: ScheduleReportsFormProps) {
  const [formData, setFormData] = useState({
    schedule: 'monthly',
    reportTypes: [] as string[],
    time: '09:00',
    dayOfWeek: 'monday',
    dayOfMonth: '1',
    recipients: [] as string[],
    emailNotification: '',
    autoGenerate: true,
    includeCharts: true,
    includeDetails: true,
    format: 'excel'
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

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        recipients: [...formData.recipients, value]
      });
    } else {
      setFormData({
        ...formData,
        recipients: formData.recipients.filter(recipient => recipient !== value)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">Расписание</label>
        <select
          name="schedule"
          value={formData.schedule}
          onChange={handleChange}
          className="form-select"
        >
          <option value="daily">Ежедневно</option>
          <option value="weekly">Еженедельно</option>
          <option value="monthly">Ежемесячно</option>
          <option value="quarterly">Ежеквартально</option>
          <option value="yearly">Ежегодно</option>
        </select>
      </div>

      {formData.schedule === 'weekly' && (
        <div>
          <label className="form-label">День недели</label>
          <select
            name="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={handleChange}
            className="form-select"
          >
            <option value="monday">Понедельник</option>
            <option value="tuesday">Вторник</option>
            <option value="wednesday">Среда</option>
            <option value="thursday">Четверг</option>
            <option value="friday">Пятница</option>
            <option value="saturday">Суббота</option>
            <option value="sunday">Воскресенье</option>
          </select>
        </div>
      )}

      {formData.schedule === 'monthly' && (
        <div>
          <label className="form-label">День месяца</label>
          <select
            name="dayOfMonth"
            value={formData.dayOfMonth}
            onChange={handleChange}
            className="form-select"
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="form-label">Время генерации</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="form-input"
        />
      </div>

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

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Получатели</h4>
        
        <div className="space-y-2">
          {[
            { value: 'admin', label: 'Администратор' },
            { value: 'accountant', label: 'Бухгалтер' },
            { value: 'manager', label: 'Менеджер' },
            { value: 'director', label: 'Директор' }
          ].map((recipient) => (
            <div key={recipient.value} className="flex items-center">
              <input
                type="checkbox"
                id={recipient.value}
                value={recipient.value}
                checked={formData.recipients.includes(recipient.value)}
                onChange={handleRecipientChange}
                className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={recipient.value} className="ml-2 text-sm text-neutral-700">
                {recipient.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label">Дополнительный email</label>
        <input
          type="email"
          name="emailNotification"
          value={formData.emailNotification}
          onChange={handleChange}
          className="form-input"
          placeholder="admin@example.com"
        />
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Настройки отчетов</h4>
        
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
          className="btn-warning"
        >
          <i className="ri-calendar-line mr-2"></i>
          Настроить расписание
        </button>
      </div>
    </form>
  );
}
