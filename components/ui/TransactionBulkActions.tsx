'use client';

import { useState } from 'react';

interface Transaction {
  id: string;
  paymentId: string;
  applicant: string;
  amount: number;
  status: string;
  bankName: string;
}

interface TransactionBulkActionsProps {
  selectedTransactions: Transaction[];
  onBulkAction: (action: string, transactionIds: string[]) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  totalTransactions: number;
  isAllSelected: boolean;
}

export default function TransactionBulkActions({
  selectedTransactions,
  onBulkAction,
  onSelectAll,
  onDeselectAll,
  totalTransactions,
  isAllSelected
}: TransactionBulkActionsProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ action: string; transactionIds: string[] } | null>(null);

  const handleBulkAction = (action: string) => {
    if (selectedTransactions.length === 0) return;
    
    const transactionIds = selectedTransactions.map(t => t.id);
    
    // Для критических действий показываем подтверждение
    if (action === 'cancel' || action === 'retry') {
      setPendingAction({ action, transactionIds });
      setShowConfirmModal(true);
    } else {
      onBulkAction(action, transactionIds);
    }
  };

  const confirmAction = () => {
    if (pendingAction) {
      onBulkAction(pendingAction.action, pendingAction.transactionIds);
      setPendingAction(null);
    }
    setShowConfirmModal(false);
  };

  const cancelAction = () => {
    setPendingAction(null);
    setShowConfirmModal(false);
  };

  const getTotalAmount = () => {
    return selectedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const getStatusCounts = () => {
    const counts = selectedTransactions.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const getActionButton = (action: string, label: string, icon: string, color: string, enabled: boolean = true) => {
    return (
      <button
        onClick={() => handleBulkAction(action)}
        disabled={!enabled || selectedTransactions.length === 0}
        className={`${color} ${!enabled || selectedTransactions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''} px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
      >
        <i className={`${icon} mr-2`}></i>
        {label}
      </button>
    );
  };

  if (selectedTransactions.length === 0) {
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
              {isAllSelected ? 'Снять выделение со всех' : `Выбрать все транзакции (${totalTransactions})`}
            </span>
          </div>
          <span className="text-sm text-neutral-500">Выберите транзакции для массовых операций</span>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

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
              Выбрано транзакций: {selectedTransactions.length} из {totalTransactions}
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
            <div className="flex gap-6">
              <span><span className="font-medium">Общая сумма:</span> {getTotalAmount().toLocaleString()} сом</span>
              {Object.entries(statusCounts).map(([status, count]) => (
                <span key={status}>
                  <span className="font-medium">
                    {status === 'completed' ? 'Завершено' :
                     status === 'processing' ? 'В обработке' :
                     status === 'pending' ? 'Ожидает' : 'Ошибка'}:
                  </span> {count}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            {getActionButton('export', 'Экспорт', 'ri-download-line', 'bg-green-600 hover:bg-green-700 text-white')}
            {getActionButton('retry', 'Повторить', 'ri-refresh-line', 'bg-blue-600 hover:bg-blue-700 text-white')}
            {getActionButton('approve', 'Утвердить', 'ri-check-line', 'bg-green-600 hover:bg-green-700 text-white')}
            {getActionButton('cancel', 'Отменить', 'ri-close-circle-line', 'bg-red-600 hover:bg-red-700 text-white')}
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
              {pendingAction?.action === 'cancel' 
                ? 'Вы уверены, что хотите отменить выбранные транзакции? Это действие нельзя отменить.'
                : 'Вы уверены, что хотите повторить выбранные транзакции?'
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
                  pendingAction?.action === 'cancel' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
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
