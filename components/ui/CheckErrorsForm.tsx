'use client';

import { useState } from 'react';

interface CheckErrorsFormProps {
  onSubmit: (formData: any) => void;
}

export default function CheckErrorsForm({ onSubmit }: CheckErrorsFormProps) {
  const [formData, setFormData] = useState({
    scope: 'all',
    errorType: 'all',
    bankFilter: 'all',
    dateRange: '7d',
    autoFix: false,
    notifications: true,
    generateReport: true
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
        <label className="form-label">Область проверки</label>
        <select
          name="scope"
          value={formData.scope}
          onChange={handleChange}
          className="form-select"
        >
          <option value="all">Все транзакции</option>
          <option value="failed">Только неудачные</option>
          <option value="processing">Только в обработке</option>
          <option value="pending">Только ожидающие</option>
          <option value="today">За сегодня</option>
          <option value="week">За неделю</option>
        </select>
      </div>

      <div>
        <label className="form-label">Тип ошибок</label>
        <select
          name="errorType"
          value={formData.errorType}
          onChange={handleChange}
          className="form-select"
        >
          <option value="all">Все типы ошибок</option>
          <option value="network">Сетевые ошибки</option>
          <option value="bank">Ошибки банка</option>
          <option value="validation">Ошибки валидации</option>
          <option value="timeout">Таймауты</option>
          <option value="balance">Недостаток средств</option>
          <option value="account">Ошибки счета</option>
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
        <label className="form-label">Период проверки</label>
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
            name="autoFix"
            checked={formData.autoFix}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Автоматическое исправление простых ошибок
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
            Уведомления о найденных ошибках
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="generateReport"
            checked={formData.generateReport}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Создать отчет об ошибках
          </label>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">Информация о проверке</h4>
        <div className="text-sm text-yellow-800">
          <p>• Проверка займет от 1 до 5 минут в зависимости от количества транзакций</p>
          <p>• Будут проверены статусы, суммы, реквизиты и логи транзакций</p>
          <p>• При обнаружении ошибок будет создан детальный отчет</p>
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
          <i className="ri-error-warning-line mr-2"></i>
          Проверить ошибки
        </button>
      </div>
    </form>
  );
}
