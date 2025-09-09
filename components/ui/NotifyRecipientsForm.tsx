'use client';

import { useState } from 'react';

interface NotifyRecipientsFormProps {
  onSubmit: (formData: any) => void;
}

export default function NotifyRecipientsForm({ onSubmit }: NotifyRecipientsFormProps) {
  const [formData, setFormData] = useState({
    recipientCount: '',
    notificationType: 'payment_status',
    message: '',
    channels: [] as string[],
    language: 'ru',
    schedule: 'immediate'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      recipientCount: parseInt(formData.recipientCount)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleChannelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        channels: [...formData.channels, value]
      });
    } else {
      setFormData({
        ...formData,
        channels: formData.channels.filter(channel => channel !== value)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Количество получателей *</label>
          <input
            type="number"
            name="recipientCount"
            value={formData.recipientCount}
            onChange={handleChange}
            className="form-input"
            placeholder="0"
            min="1"
            required
          />
        </div>

        <div>
          <label className="form-label">Тип уведомления *</label>
          <select
            name="notificationType"
            value={formData.notificationType}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="payment_status">Статус выплаты</option>
            <option value="payment_success">Успешная выплата</option>
            <option value="payment_failed">Неудачная выплата</option>
            <option value="payment_scheduled">Запланированная выплата</option>
            <option value="custom">Произвольное сообщение</option>
          </select>
        </div>

        <div>
          <label className="form-label">Язык уведомления</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="form-select"
          >
            <option value="ru">Русский</option>
            <option value="ky">Кыргызча</option>
          </select>
        </div>

        <div>
          <label className="form-label">Время отправки</label>
          <select
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            className="form-select"
          >
            <option value="immediate">Немедленно</option>
            <option value="scheduled">По расписанию</option>
            <option value="business_hours">В рабочие часы</option>
          </select>
        </div>
      </div>

      <div>
        <label className="form-label">Каналы уведомления *</label>
        <div className="space-y-2 mt-2">
          {[
            { value: 'sms', label: 'SMS' },
            { value: 'email', label: 'Email' },
            { value: 'push', label: 'Push-уведомления' },
            { value: 'call', label: 'Звонок' }
          ].map((channel) => (
            <div key={channel.value} className="flex items-center">
              <input
                type="checkbox"
                id={channel.value}
                value={channel.value}
                checked={formData.channels.includes(channel.value)}
                onChange={handleChannelChange}
                className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={channel.value} className="ml-2 text-sm text-neutral-700">
                {channel.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label">Сообщение</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="form-textarea"
          rows={4}
          placeholder="Введите текст уведомления (опционально)..."
        />
        <p className="text-xs text-neutral-500 mt-1">
          Если оставить пустым, будет использовано стандартное сообщение
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <i className="ri-information-line text-blue-600 text-lg mr-3 mt-0.5"></i>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Информация</h4>
            <p className="text-sm text-blue-700">
              Уведомления будут отправлены всем получателям выбранными каналами связи. 
              Убедитесь, что у получателей указаны актуальные контактные данные.
            </p>
          </div>
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
          <i className="ri-notification-line mr-2"></i>
          Отправить уведомления
        </button>
      </div>
    </form>
  );
}
