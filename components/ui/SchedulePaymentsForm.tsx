'use client';

import { useState } from 'react';

interface SchedulePaymentsFormProps {
  onSubmit: (formData: any) => void;
}

export default function SchedulePaymentsForm({ onSubmit }: SchedulePaymentsFormProps) {
  const [formData, setFormData] = useState({
    schedule: 'daily',
    time: '09:00',
    startDate: '',
    endDate: '',
    bankName: 'ОАО "Демир Банк"',
    autoApprove: false,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Расписание *</label>
          <select
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="daily">Ежедневно</option>
            <option value="weekly">Еженедельно</option>
            <option value="monthly">Ежемесячно</option>
            <option value="custom">Произвольное</option>
          </select>
        </div>

        <div>
          <label className="form-label">Время выполнения *</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Дата начала *</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Дата окончания</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Банк</label>
          <select
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="form-select"
          >
            <option value='ОАО "Демир Банк"'>ОАО &ldquo;Демир Банк&rdquo;</option>
            <option value='ОАО "РСК Банк"'>ОАО &ldquo;РСК Банк&rdquo;</option>
            <option value='ОАО "Айыл Банк"'>ОАО &ldquo;Айыл Банк&rdquo;</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Дополнительные настройки</h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="autoApprove"
            checked={formData.autoApprove}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Автоматическое утверждение выплат
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
            Уведомления о выполнении
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
          <i className="ri-calendar-line mr-2"></i>
          Настроить расписание
        </button>
      </div>
    </form>
  );
}
