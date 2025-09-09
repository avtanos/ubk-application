'use client';

import { useState } from 'react';

interface SearchTransactionFormProps {
  onSubmit: (formData: any) => void;
}

export default function SearchTransactionForm({ onSubmit }: SearchTransactionFormProps) {
  const [formData, setFormData] = useState({
    searchType: 'transactionId',
    transactionId: '',
    paymentId: '',
    applicantName: '',
    bankName: '',
    amount: '',
    dateFrom: '',
    dateTo: '',
    status: 'all'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">Тип поиска</label>
        <select
          name="searchType"
          value={formData.searchType}
          onChange={handleChange}
          className="form-select"
        >
          <option value="transactionId">По ID транзакции</option>
          <option value="paymentId">По ID выплаты</option>
          <option value="applicant">По имени получателя</option>
          <option value="bank">По банку</option>
          <option value="amount">По сумме</option>
          <option value="date">По дате</option>
          <option value="advanced">Расширенный поиск</option>
        </select>
      </div>

      {formData.searchType === 'transactionId' && (
        <div>
          <label className="form-label">ID транзакции</label>
          <input
            type="text"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            className="form-input"
            placeholder="Например: TXN-001"
            required
          />
        </div>
      )}

      {formData.searchType === 'paymentId' && (
        <div>
          <label className="form-label">ID выплаты</label>
          <input
            type="text"
            name="paymentId"
            value={formData.paymentId}
            onChange={handleChange}
            className="form-input"
            placeholder="Например: PAY-001"
            required
          />
        </div>
      )}

      {formData.searchType === 'applicant' && (
        <div>
          <label className="form-label">Имя получателя</label>
          <input
            type="text"
            name="applicantName"
            value={formData.applicantName}
            onChange={handleChange}
            className="form-input"
            placeholder="Введите имя получателя"
            required
          />
        </div>
      )}

      {formData.searchType === 'bank' && (
        <div>
          <label className="form-label">Банк</label>
          <select
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Выберите банк</option>
            <option value="demir">ОАО &ldquo;Демир Банк&rdquo;</option>
            <option value="rsk">ОАО &ldquo;РСК Банк&rdquo;</option>
            <option value="ayil">ОАО &ldquo;Айыл Банк&rdquo;</option>
          </select>
        </div>
      )}

      {formData.searchType === 'amount' && (
        <div>
          <label className="form-label">Сумма (сом)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-input"
            placeholder="Введите сумму"
            required
          />
        </div>
      )}

      {formData.searchType === 'date' && (
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

      {formData.searchType === 'advanced' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">ID транзакции</label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                className="form-input"
                placeholder="TXN-001"
              />
            </div>
            <div>
              <label className="form-label">ID выплаты</label>
              <input
                type="text"
                name="paymentId"
                value={formData.paymentId}
                onChange={handleChange}
                className="form-input"
                placeholder="PAY-001"
              />
            </div>
          </div>
          
          <div>
            <label className="form-label">Имя получателя</label>
            <input
              type="text"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleChange}
              className="form-input"
              placeholder="Введите имя"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Банк</label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Все банки</option>
                <option value="demir">ОАО &ldquo;Демир Банк&rdquo;</option>
                <option value="rsk">ОАО &ldquo;РСК Банк&rdquo;</option>
                <option value="ayil">ОАО &ldquo;Айыл Банк&rdquo;</option>
              </select>
            </div>
            <div>
              <label className="form-label">Статус</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="all">Все статусы</option>
                <option value="pending">Ожидающие</option>
                <option value="processing">В обработке</option>
                <option value="completed">Завершенные</option>
                <option value="failed">Неудачные</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Дата от</label>
              <input
                type="date"
                name="dateFrom"
                value={formData.dateFrom}
                onChange={handleChange}
                className="form-input"
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
              />
            </div>
          </div>
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
          className="btn-primary"
        >
          <i className="ri-search-line mr-2"></i>
          Найти транзакцию
        </button>
      </div>
    </form>
  );
}
