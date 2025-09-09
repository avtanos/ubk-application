'use client';

import { useState } from 'react';

export interface BulkAction {
  key: string;
  label: string;
  icon: string;
  color: string;
  enabled: (selectedItems: any[]) => boolean;
  confirmMessage?: string;
}

interface UniversalBulkActionsProps<T> {
  title: string;
  selectedItems: T[];
  onBulkAction: (action: string, itemIds: string[], notes?: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  totalItems: number;
  isAllSelected: boolean;
  actions: BulkAction[];
  getItemId: (item: T) => string;
  getItemDisplayName?: (item: T) => string;
  calculateTotal?: (items: T[]) => number;
  totalLabel?: string;
}

export default function UniversalBulkActions<T>({
  title,
  selectedItems,
  onBulkAction,
  onSelectAll,
  onDeselectAll,
  totalItems,
  isAllSelected,
  actions,
  getItemId,
  getItemDisplayName,
  calculateTotal,
  totalLabel = 'Общая сумма'
}: UniversalBulkActionsProps<T>) {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkNotes, setBulkNotes] = useState('');

  const handleBulkAction = (action: string) => {
    setBulkAction(action);
    setShowBulkModal(true);
  };

  const confirmBulkAction = () => {
    if (bulkAction && selectedItems.length > 0) {
      const itemIds = selectedItems.map(getItemId);
      onBulkAction(bulkAction, itemIds, bulkNotes);
      setShowBulkModal(false);
      setBulkAction('');
      setBulkNotes('');
    }
  };

  const getActionButtonClass = (action: BulkAction) => {
    const baseClass = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    return `${baseClass} ${action.color}`;
  };

  const getTotalAmount = () => {
    if (calculateTotal) {
      return calculateTotal(selectedItems);
    }
    return 0;
  };

  const getActionByKey = (key: string) => {
    return actions.find(action => action.key === key);
  };

  if (selectedItems.length === 0) {
    return (
      <div className="bg-neutral-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">
              Выберите элементы для массовых операций
            </span>
            <button
              onClick={onSelectAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Выбрать все ({totalItems})
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
                Выбрано: {selectedItems.length} из {totalItems}
              </span>
            </div>
            {calculateTotal && (
              <div className="text-sm text-neutral-600">
                {totalLabel}: <span className="font-semibold text-green-600">
                  {getTotalAmount().toLocaleString()} сом
                </span>
              </div>
            )}
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
          {actions.map(action => (
            <button
              key={action.key}
              onClick={() => handleBulkAction(action.key)}
              disabled={!action.enabled(selectedItems)}
              className={getActionButtonClass(action)}
            >
              <i className={`${action.icon} mr-2`}></i>
              {action.label}
            </button>
          ))}
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
                Вы собираетесь выполнить действие <strong>&ldquo;{getActionByKey(bulkAction)?.label}&rdquo;</strong> для {selectedItems.length} элементов.
              </p>
              {calculateTotal && (
                <p className="text-sm text-neutral-600">
                  {totalLabel}: <span className="font-semibold text-green-600">
                    {getTotalAmount().toLocaleString()} сом
                  </span>
                </p>
              )}
              {getActionByKey(bulkAction)?.confirmMessage && (
                <p className="text-sm text-orange-600 mt-2">
                  {getActionByKey(bulkAction)?.confirmMessage}
                </p>
              )}
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
                className={`px-4 py-2 rounded-lg font-medium text-white ${getActionByKey(bulkAction)?.color || 'bg-neutral-600'}`}
              >
                <i className={`${getActionByKey(bulkAction)?.icon || 'ri-more-line'} mr-2`}></i>
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
