'use client';

import { useState } from 'react';

interface RetryFailedPaymentsFormProps {
  onSubmit: (formData: any) => void;
}

export default function RetryFailedPaymentsForm({ onSubmit }: RetryFailedPaymentsFormProps) {
  const [formData, setFormData] = useState({
    failedCount: '',
    retryDelay: '30',
    maxRetries: '3',
    bankName: 'ОАО "Демир Банк"',
    autoRetry: false,
    notifyOnSuccess: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      failedCount: parseInt(formData.failedCount),
      retryDelay: parseInt(formData.retryDelay),
      maxRetries: parseInt(formData.maxRetries)
    });
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
          <label className="form-label">Количество неудачных выплат *</label>
          <input
            type="number"
            name="failedCount"
            value={formData.failedCount}
            onChange={handleChange}
            className="form-input"
            placeholder="0"
            min="1"
            required
          />
        </div>

        <div>
          <label className="form-label">Задержка между попытками (мин) *</label>
          <input
            type="number"
            name="retryDelay"
            value={formData.retryDelay}
            onChange={handleChange}
            className="form-input"
            placeholder="30"
            min="1"
            max="1440"
            required
          />
        </div>

        <div>
          <label className="form-label">Максимум попыток *</label>
          <input
            type="number"
            name="maxRetries"
            value={formData.maxRetries}
            onChange={handleChange}
            className="form-input"
            placeholder="3"
            min="1"
            max="10"
            required
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
        <h4 className="font-medium text-neutral-900">Настройки повтора</h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="autoRetry"
            checked={formData.autoRetry}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Автоматический повтор при ошибках
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="notifyOnSuccess"
            checked={formData.notifyOnSuccess}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Уведомлять о успешных повторах
          </label>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-start">
          <i className="ri-error-warning-line text-yellow-600 text-lg mr-3 mt-0.5"></i>
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">Внимание</h4>
            <p className="text-sm text-yellow-700">
              Повтор неудачных выплат будет выполнен с указанными параметрами. 
              Убедитесь, что все данные корректны перед запуском.
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
          className="btn-warning"
        >
          <i className="ri-refresh-line mr-2"></i>
          Повторить неудачные выплаты
        </button>
      </div>
    </form>
  );
}
