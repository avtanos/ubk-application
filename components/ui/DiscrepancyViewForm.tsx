'use client';

import { useState } from 'react';

interface DiscrepancyViewFormProps {
  discrepancy: any;
  onSubmit: (formData: any) => void;
}

export default function DiscrepancyViewForm({ discrepancy, onSubmit }: DiscrepancyViewFormProps) {
  const [formData, setFormData] = useState({
    resolution: '',
    notes: '',
    action: 'resolve'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, discrepancyId: discrepancy.id });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  if (!discrepancy) return null;

  return (
    <div className="space-y-6">
      {/* Информация о расхождении */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <h4 className="font-semibold text-neutral-900 mb-3">Информация о расхождении</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-neutral-600">ID расхождения:</span>
            <p className="font-mono text-blue-600">{discrepancy.id}</p>
          </div>
          <div>
            <span className="text-neutral-600">ID сверки:</span>
            <p className="font-mono text-green-600">{discrepancy.reconciliationId}</p>
          </div>
          <div>
            <span className="text-neutral-600">ID транзакции:</span>
            <p className="font-mono text-purple-600">{discrepancy.transactionId}</p>
          </div>
          <div>
            <span className="text-neutral-600">Статус:</span>
            <p className="text-orange-600 font-medium">
              {discrepancy.status === 'resolved' ? 'Разрешено' :
               discrepancy.status === 'investigating' ? 'Расследуется' : 'Ожидает'}
            </p>
          </div>
        </div>
      </div>

      {/* Суммы */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-neutral-900 mb-3">Суммы</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-neutral-600">Сумма в банке:</span>
            <p className="text-lg font-semibold text-neutral-900">
              {discrepancy.bankAmount.toLocaleString()} сом
            </p>
          </div>
          <div>
            <span className="text-neutral-600">Сумма в системе:</span>
            <p className="text-lg font-semibold text-neutral-900">
              {discrepancy.systemAmount.toLocaleString()} сом
            </p>
          </div>
          <div>
            <span className="text-neutral-600">Разница:</span>
            <p className={`text-lg font-semibold ${discrepancy.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
              {discrepancy.difference.toLocaleString()} сом
            </p>
          </div>
        </div>
      </div>

      {/* Описание */}
      <div>
        <h4 className="font-semibold text-neutral-900 mb-2">Описание</h4>
        <p className="text-neutral-600 bg-neutral-50 p-3 rounded-lg">
          {discrepancy.description}
        </p>
      </div>

      {/* История разрешения */}
      {discrepancy.resolvedBy && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-neutral-900 mb-2">История разрешения</h4>
          <p className="text-sm text-neutral-600">
            <span className="font-medium">Разрешено:</span> {discrepancy.resolvedBy}
          </p>
          <p className="text-sm text-neutral-600">
            <span className="font-medium">Дата:</span> {discrepancy.resolvedDate}
          </p>
        </div>
      )}

      {/* Форма действий */}
      {discrepancy.status !== 'resolved' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Действие</label>
            <select
              name="action"
              value={formData.action}
              onChange={handleChange}
              className="form-select"
            >
              <option value="resolve">Разрешить расхождение</option>
              <option value="investigate">Отправить на расследование</option>
              <option value="ignore">Игнорировать</option>
            </select>
          </div>

          <div>
            <label className="form-label">Причина разрешения</label>
            <select
              name="resolution"
              value={formData.resolution}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Выберите причину</option>
              <option value="commission">Разница в комиссии</option>
              <option value="timing">Временная разница</option>
              <option value="duplicate">Дублирование транзакции</option>
              <option value="error">Ошибка в данных</option>
              <option value="other">Другое</option>
            </select>
          </div>

          <div>
            <label className="form-label">Примечания</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              rows={3}
              placeholder="Дополнительные комментарии..."
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
              <i className="ri-check-line mr-2"></i>
              Применить действие
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
