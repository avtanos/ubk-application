'use client';

import { useState } from 'react';

interface Report {
  id: string;
  title: string;
  type: string;
  status: string;
  generatedAt: Date;
  generatedBy: string;
}

interface ReportBulkActionsProps {
  selectedReports: Report[];
  onBulkAction: (action: string, reportIds: string[]) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  totalReports: number;
  isAllSelected: boolean;
}

export default function ReportBulkActions({
  selectedReports,
  onBulkAction,
  onSelectAll,
  onDeselectAll,
  totalReports,
  isAllSelected
}: ReportBulkActionsProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ action: string; reportIds: string[] } | null>(null);

  const handleBulkAction = (action: string) => {
    if (selectedReports.length === 0) return;
    
    const reportIds = selectedReports.map(r => r.id);
    
    // Для критических действий показываем подтверждение
    if (action === 'delete' || action === 'archive') {
      setPendingAction({ action, reportIds });
      setShowConfirmModal(true);
    } else {
      onBulkAction(action, reportIds);
    }
  };

  const confirmAction = () => {
    if (pendingAction) {
      onBulkAction(pendingAction.action, pendingAction.reportIds);
      setPendingAction(null);
    }
    setShowConfirmModal(false);
  };

  const cancelAction = () => {
    setPendingAction(null);
    setShowConfirmModal(false);
  };

  const getStatusCounts = () => {
    const counts = selectedReports.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const getActionButton = (action: string, label: string, icon: string, color: string, enabled: boolean = true) => {
    return (
      <button
        onClick={() => handleBulkAction(action)}
        disabled={!enabled || selectedReports.length === 0}
        className={`${color} ${!enabled || selectedReports.length === 0 ? 'opacity-50 cursor-not-allowed' : ''} px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
      >
        <i className={`${icon} mr-2`}></i>
        {label}
      </button>
    );
  };

  if (selectedReports.length === 0) {
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
              {isAllSelected ? 'Снять выделение со всех' : `Выбрать все отчеты (${totalReports})`}
            </span>
          </div>
          <span className="text-sm text-neutral-500">Выберите отчеты для массовых операций</span>
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
              Выбрано отчетов: {selectedReports.length} из {totalReports}
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
              {Object.entries(statusCounts).map(([status, count]) => (
                <span key={status}>
                  <span className="font-medium">
                    {status === 'completed' ? 'Готово' :
                     status === 'generating' ? 'Генерируется' :
                     status === 'failed' ? 'Ошибка' : status}:
                  </span> {count}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            {getActionButton('download', 'Скачать', 'ri-download-line', 'bg-green-600 hover:bg-green-700 text-white')}
            {getActionButton('export', 'Экспорт', 'ri-file-export-line', 'bg-blue-600 hover:bg-blue-700 text-white')}
            {getActionButton('archive', 'Архивировать', 'ri-archive-line', 'bg-orange-600 hover:bg-orange-700 text-white')}
            {getActionButton('delete', 'Удалить', 'ri-delete-bin-line', 'bg-red-600 hover:bg-red-700 text-white')}
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
                ? 'Вы уверены, что хотите удалить выбранные отчеты? Это действие нельзя отменить.'
                : 'Вы уверены, что хотите архивировать выбранные отчеты?'
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
