'use client';

import { useState } from 'react';

interface BulkPaymentFormProps {
  onSubmit: (formData: any) => void;
}

export default function BulkPaymentForm({ onSubmit }: BulkPaymentFormProps) {
  const [formData, setFormData] = useState({
    paymentCount: '',
    totalAmount: '',
    bankName: 'ОАО "Демир Банк"',
    scheduledDate: '',
    priority: 'normal',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      paymentCount: parseInt(formData.paymentCount),
      totalAmount: parseFloat(formData.totalAmount)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Количество выплат *</label>
          <input
            type="number"
            name="paymentCount"
            value={formData.paymentCount}
            onChange={handleChange}
            className="form-input"
            placeholder="0"
            min="1"
            required
          />
        </div>

        <div>
          <label className="form-label">Общая сумма (сом) *</label>
          <input
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            className="form-input"
            placeholder="0"
            min="0"
            step="0.01"
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

        <div>
          <label className="form-label">Планируемая дата</label>
          <input
            type="date"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Приоритет</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-select"
          >
            <option value="low">Низкий</option>
            <option value="normal">Обычный</option>
            <option value="high">Высокий</option>
          </select>
        </div>
      </div>

      <div>
        <label className="form-label">Примечания</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Дополнительная информация..."
        />
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
          className="btn-success"
        >
          <i className="ri-play-circle-line mr-2"></i>
          Запустить массовую выплату
        </button>
      </div>
    </form>
  );
}
