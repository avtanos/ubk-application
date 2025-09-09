'use client';

import { useState } from 'react';

interface Payment {
  id: string;
  applicant: string;
  amount: number;
  status: string;
}

interface PaymentBulkActionsProps {
  selectedPayments: Payment[];
  onBulkAction: (action: string, paymentIds: string[]) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  totalPayments: number;
  isAllSelected: boolean;
}

export default function PaymentBulkActions({
  selectedPayments,
  onBulkAction,
  onSelectAll,
  onDeselectAll,
  totalPayments,
  isAllSelected
}: PaymentBulkActionsProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ action: string; paymentIds: string[] } | null>(null);

  const handleBulkAction = (action: string) => {
    if (selectedPayments.length === 0) return;
    
    const paymentIds = selectedPayments.map(p => p.id);
    
    // Для критических действий показываем подтверждение
    if (action === 'delete' || action === 'cancel') {
      setPendingAction({ action, paymentIds });
      setShowConfirmModal(true);
    } else {
      onBulkAction(action, paymentIds);
    }
  };

  const confirmAction = () => {
    if (pendingAction) {
      onBulkAction(pendingAction.action, pendingAction.paymentIds);
      setPendingAction(null);
    }
    setShowConfirmModal(false);
  };

  const cancelAction = () => {
    setPendingAction(null);
    setShowConfirmModal(false);
  };

  const getTotalAmount = () => {
    return selectedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getActionButton = (action: string, label: string, icon: string, color: string, enabled: boolean = true) => {
    return (
      <button
        onClick={() => handleBulkAction(action)}
        disabled={!enabled || selectedPayments.length === 0}
        className={`${color} ${!enabled || selectedPayments.length === 0 ? 'opacity-50 cursor-not-allowed' : ''} px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
      >
        <i className={`${icon} mr-2`}></i>
        {label}
      </button>
    );
  };

  if (selectedPayments.length === 0) {
    return (
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => e.target.checked ? onSelectAll() : onDeselectAll()}
              className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-600">
              {isAllSelected ? 'Снять выделение со всех' : `Выбрать все выплаты (${totalPayments})`}
            </span>
          </div>
          <span className="text-sm text-neutral-500">Выберите выплаты для массовых операций</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => e.target.checked ? onSelectAll() : onDeselectAll()}
              className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-blue-900">
              Выбрано выплат: {selectedPayments.length} из {totalPayments}
            </span>
          </div>
          <button
            onClick={onDeselectAll}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Снять выделение
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-blue-800">
            <span className="font-medium">Общая сумма:</span> {getTotalAmount().toLocaleString()} сом
          </div>
          
          <div className="flex gap-2">
            {getActionButton('process', 'Обработать', 'ri-play-line', 'bg-green-600 hover:bg-green-700 text-white')}
            {getActionButton('approve', 'Утвердить', 'ri-check-line', 'bg-blue-600 hover:bg-blue-700 text-white')}
            {getActionButton('export', 'Экспорт', 'ri-download-line', 'bg-purple-600 hover:bg-purple-700 text-white')}
            {getActionButton('cancel', 'Отменить', 'ri-close-line', 'bg-red-600 hover:bg-red-700 text-white')}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Подтверждение действия
            </h3>
            <p className="text-neutral-600 mb-6">
              {pendingAction?.action === 'delete' 
                ? 'Вы уверены, что хотите удалить выбранные выплаты? Это действие нельзя отменить.'
                : 'Вы уверены, что хотите отменить выбранные выплаты?'
              }
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelAction}
                className="px-4 py-2 text-neutral-600 border border-neutral-300 rounded-lg hover:bg-neutral-50"
              >
                Отмена
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white rounded-lg ${
                  pendingAction?.action === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
