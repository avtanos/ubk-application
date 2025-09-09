'use client';

import { useState } from 'react';

interface CreatePaymentFormProps {
  onSubmit: (formData: any) => void;
}

export default function CreatePaymentForm({ onSubmit }: CreatePaymentFormProps) {
  const [formData, setFormData] = useState({
    applicant: '',
    amount: '',
    type: 'Единовременная выплата',
    bankAccount: '',
    bankName: 'ОАО "Демир Банк"',
    scheduledDate: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
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
          <label className="form-label">Получатель *</label>
          <input
            type="text"
            name="applicant"
            value={formData.applicant}
            onChange={handleChange}
            className="form-input"
            placeholder="ФИО получателя"
            required
          />
        </div>

        <div>
          <label className="form-label">Сумма выплаты (сом) *</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-input"
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="form-label">Тип выплаты</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Единовременная выплата">Единовременная выплата</option>
            <option value="Ежемесячное пособие">Ежемесячное пособие</option>
            <option value="Дополнительная выплата">Дополнительная выплата</option>
          </select>
        </div>

        <div>
          <label className="form-label">Банк</label>
          <select
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="form-select"
          >
            <option value='ОАО Демир Банк"'>ОАО &ldquo;Демир Банк&rdquo;</option>
            <option value='ОАО "РСК Банк"'>ОАО &ldquo;РСК Банк&rdquo;</option>
            <option value='ОАО "Айыл Банк"'>ОАО &ldquo;Айыл Банк&rdquo;</option>
          </select>
        </div>

        <div>
          <label className="form-label">Номер счета *</label>
          <input
            type="text"
            name="bankAccount"
            value={formData.bankAccount}
            onChange={handleChange}
            className="form-input"
            placeholder="****1234"
            required
          />
        </div>

        <div>
          <label className="form-label">Планируемая дата выплаты</label>
          <input
            type="date"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleChange}
            className="form-input"
          />
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
          className="btn-primary"
        >
          <i className="ri-add-line mr-2"></i>
          Создать выплату
        </button>
      </div>
    </form>
  );
}
