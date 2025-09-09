'use client';

import { useState } from 'react';

interface AutoRegistriesFormProps {
  onSubmit: (formData: any) => void;
}

export default function AutoRegistriesForm({ onSubmit }: AutoRegistriesFormProps) {
  const [formData, setFormData] = useState({
    schedule: 'monthly',
    startDate: '',
    endDate: '',
    template: 'default',
    autoApprove: false,
    notifications: true,
    emailNotifications: '',
    namePattern: 'Реестр выплат за {month} {year}',
    includeWeekends: false,
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
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

  const handleWorkingDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        workingDays: [...formData.workingDays, day]
      });
    } else {
      setFormData({
        ...formData,
        workingDays: formData.workingDays.filter(d => d !== day)
      });
    }
  };

  const days = [
    { key: 'monday', label: 'Понедельник' },
    { key: 'tuesday', label: 'Вторник' },
    { key: 'wednesday', label: 'Среда' },
    { key: 'thursday', label: 'Четверг' },
    { key: 'friday', label: 'Пятница' },
    { key: 'saturday', label: 'Суббота' },
    { key: 'sunday', label: 'Воскресенье' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">Расписание создания</label>
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
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Дата начала</label>
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
      </div>

      <div>
        <label className="form-label">Шаблон реестра</label>
        <select
          name="template"
          value={formData.template}
          onChange={handleChange}
          className="form-select"
        >
          <option value="default">Стандартный шаблон</option>
          <option value="monthly">Ежемесячный шаблон</option>
          <option value="weekly">Еженедельный шаблон</option>
          <option value="special">Специальный шаблон</option>
        </select>
      </div>

      <div>
        <label className="form-label">Шаблон названия</label>
        <input
          type="text"
          name="namePattern"
          value={formData.namePattern}
          onChange={handleChange}
          className="form-input"
          placeholder="Реестр выплат за {month} {year}"
        />
        <p className="text-xs text-neutral-500 mt-1">
          Доступные переменные: {'{month}'}, {'{year}'}, {'{week}'}, {'{day}'}
        </p>
      </div>

      <div>
        <label className="form-label">Рабочие дни</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {days.map(day => (
            <div key={day.key} className="flex items-center">
              <input
                type="checkbox"
                id={day.key}
                checked={formData.workingDays.includes(day.key)}
                onChange={(e) => handleWorkingDayChange(day.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={day.key} className="ml-2 text-sm text-neutral-700">
                {day.label}
              </label>
            </div>
          ))}
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
            Автоматическое утверждение реестров
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
            Включить уведомления
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="includeWeekends"
            checked={formData.includeWeekends}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Включать выходные дни
          </label>
        </div>
      </div>

      {formData.notifications && (
        <div>
          <label className="form-label">Email для уведомлений</label>
          <input
            type="email"
            name="emailNotifications"
            value={formData.emailNotifications}
            onChange={handleChange}
            className="form-input"
            placeholder="admin@example.com"
          />
        </div>
      )}

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
          <i className="ri-calendar-line mr-2"></i>
          Настроить автоматические реестры
        </button>
      </div>
    </form>
  );
}
