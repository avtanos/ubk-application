'use client';

import { useState } from 'react';
import { Payment } from '@/lib/types';

interface BulkPaymentActionsProps {
  selectedPayments: Payment[];
  onBulkAction: (action: string, paymentIds: string[]) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  totalPayments: number;
  isAllSelected: boolean;
}

export default function BulkPaymentActions({
  selectedPayments,
  onBulkAction,
  onSelectAll,
  onDeselectAll,
  totalPayments,
  isAllSelected
}: BulkPaymentActionsProps) {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkNotes, setBulkNotes] = useState('');

  const handleBulkAction = (action: string) => {
    setBulkAction(action);
    setShowBulkModal(true);
  };

  const confirmBulkAction = () => {
    if (bulkAction && selectedPayments.length > 0) {
      onBulkAction(bulkAction, selectedPayments.map(p => p.id));
      setShowBulkModal(false);
      setBulkAction('');
      setBulkNotes('');
    }
  };

  const getActionButtonColor = (action: string) => {
    switch (action) {
      case 'confirm': return 'bg-green-600 hover:bg-green-700 text-white';
      case 'cancel': return 'bg-red-600 hover:bg-red-700 text-white';
      case 'suspend': return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'export': return 'bg-blue-600 hover:bg-blue-700 text-white';
      default: return 'bg-neutral-600 hover:bg-neutral-700 text-white';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'confirm': return 'Подтвердить выплаты';
      case 'cancel': return 'Отменить выплаты';
      case 'suspend': return 'Приостановить выплаты';
      case 'export': return 'Экспортировать';
      default: return action;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'confirm': return 'ri-check-line';
      case 'cancel': return 'ri-close-line';
      case 'suspend': return 'ri-pause-line';
      case 'export': return 'ri-download-line';
      default: return 'ri-more-line';
    }
  };

  const canPerformAction = (action: string) => {
    if (selectedPayments.length === 0) return false;
    
    switch (action) {
      case 'confirm':
        return selectedPayments.some(p => p.status === 'pending' || p.status === 'processing');
      case 'cancel':
        return selectedPayments.some(p => p.status === 'pending' || p.status === 'processing');
      case 'suspend':
        return selectedPayments.some(p => p.status === 'completed');
      case 'export':
        return true;
      default:
        return false;
    }
  };

  const getTotalAmount = () => {
    return selectedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  };

  if (selectedPayments.length === 0) {
    return (
      <div className="bg-neutral-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">
              Выберите выплаты для массовых операций
            </span>
            <button
              onClick={onSelectAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Выбрать все ({totalPayments})
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={isAllSelected ? onDeselectAll : onSelectAll}
                className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-neutral-900">
                Выбрано: {selectedPayments.length} из {totalPayments}
              </span>
            </div>
            <div className="text-sm text-neutral-600">
              Общая сумма: <span className="font-semibold text-green-600">
                {getTotalAmount().toLocaleString()} сом
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onDeselectAll}
              className="text-sm text-neutral-600 hover:text-neutral-700 font-medium"
            >
              Снять выделение
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleBulkAction('confirm')}
            disabled={!canPerformAction('confirm')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getActionButtonColor('confirm')}`}
          >
            <i className={`${getActionIcon('confirm')} mr-2`}></i>
            {getActionLabel('confirm')}
          </button>

          <button
            onClick={() => handleBulkAction('cancel')}
            disabled={!canPerformAction('cancel')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getActionButtonColor('cancel')}`}
          >
            <i className={`${getActionIcon('cancel')} mr-2`}></i>
            {getActionLabel('cancel')}
          </button>

          <button
            onClick={() => handleBulkAction('suspend')}
            disabled={!canPerformAction('suspend')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getActionButtonColor('suspend')}`}
          >
            <i className={`${getActionIcon('suspend')} mr-2`}></i>
            {getActionLabel('suspend')}
          </button>

          <button
            onClick={() => handleBulkAction('export')}
            disabled={!canPerformAction('export')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getActionButtonColor('export')}`}
          >
            <i className={`${getActionIcon('export')} mr-2`}></i>
            {getActionLabel('export')}
          </button>
        </div>
      </div>

      {/* Модальное окно подтверждения массового действия */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Подтверждение массового действия
              </h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-neutral-700 mb-2">
                Вы собираетесь выполнить действие <strong>&ldquo;{getActionLabel(bulkAction)}&rdquo;</strong> для {selectedPayments.length} выплат.
              </p>
              <p className="text-sm text-neutral-600">
                Общая сумма: <span className="font-semibold text-green-600">
                  {getTotalAmount().toLocaleString()} сом
                </span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Примечание (необязательно)
              </label>
              <textarea
                value={bulkNotes}
                onChange={(e) => setBulkNotes(e.target.value)}
                placeholder="Введите примечание к массовому действию..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-700 font-medium"
              >
                Отмена
              </button>
              <button
                onClick={confirmBulkAction}
                className={`px-4 py-2 rounded-lg font-medium text-white ${getActionButtonColor(bulkAction)}`}
              >
                <i className={`${getActionIcon(bulkAction)} mr-2`}></i>
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
