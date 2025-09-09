'use client';

import { useState } from 'react';

interface Registry {
  id: string;
  name: string;
  totalAmount: number;
  recordsCount: number;
  status: string;
}

interface RegistryBulkActionsProps {
  selectedRegistries: Registry[];
  onBulkAction: (action: string, registryIds: string[]) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  totalRegistries: number;
  isAllSelected: boolean;
}

export default function RegistryBulkActions({
  selectedRegistries,
  onBulkAction,
  onSelectAll,
  onDeselectAll,
  totalRegistries,
  isAllSelected
}: RegistryBulkActionsProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ action: string; registryIds: string[] } | null>(null);

  const handleBulkAction = (action: string) => {
    if (selectedRegistries.length === 0) return;
    
    const registryIds = selectedRegistries.map(r => r.id);
    
    // Для критических действий показываем подтверждение
    if (action === 'delete' || action === 'archive') {
      setPendingAction({ action, registryIds });
      setShowConfirmModal(true);
    } else {
      onBulkAction(action, registryIds);
    }
  };

  const confirmAction = () => {
    if (pendingAction) {
      onBulkAction(pendingAction.action, pendingAction.registryIds);
      setPendingAction(null);
    }
    setShowConfirmModal(false);
  };

  const cancelAction = () => {
    setPendingAction(null);
    setShowConfirmModal(false);
  };

  const getTotalAmount = () => {
    return selectedRegistries.reduce((sum, registry) => sum + registry.totalAmount, 0);
  };

  const getTotalRecords = () => {
    return selectedRegistries.reduce((sum, registry) => sum + registry.recordsCount, 0);
  };

  const getActionButton = (action: string, label: string, icon: string, color: string, enabled: boolean = true) => {
    return (
      <button
        onClick={() => handleBulkAction(action)}
        disabled={!enabled || selectedRegistries.length === 0}
        className={`${color} ${!enabled || selectedRegistries.length === 0 ? 'opacity-50 cursor-not-allowed' : ''} px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
      >
        <i className={`${icon} mr-2`}></i>
        {label}
      </button>
    );
  };

  if (selectedRegistries.length === 0) {
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
              {isAllSelected ? 'Снять выделение со всех' : `Выбрать все реестры (${totalRegistries})`}
            </span>
          </div>
          <span className="text-sm text-neutral-500">Выберите реестры для массовых операций</span>
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
              Выбрано реестров: {selectedRegistries.length} из {totalRegistries}
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
              <span><span className="font-medium">Записей:</span> {getTotalRecords().toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {getActionButton('export', 'Экспорт', 'ri-download-line', 'bg-green-600 hover:bg-green-700 text-white')}
            {getActionButton('merge', 'Объединить', 'ri-merge-cells-line', 'bg-blue-600 hover:bg-blue-700 text-white')}
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
                ? 'Вы уверены, что хотите удалить выбранные реестры? Это действие нельзя отменить.'
                : 'Вы уверены, что хотите архивировать выбранные реестры?'
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
