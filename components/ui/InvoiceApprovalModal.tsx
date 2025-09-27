'use client';

import { useState } from 'react';
import MobileOptimizedModal from './MobileOptimizedModal';
import AccessibleButton from './AccessibleButton';
import invoiceService from '@/lib/api/invoiceService';
import { InvoiceSubmission } from '@/lib/api/invoiceService';

interface InvoiceApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceSubmission;
  onApprovalComplete: () => void;
}

export default function InvoiceApprovalModal({ 
  isOpen, 
  onClose, 
  invoice,
  onApprovalComplete 
}: InvoiceApprovalModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const rejectionReasons = [
    'Неверные данные получателей',
    'Некорректная сумма выплат',
    'Отсутствуют необходимые документы',
    'Нарушение процедуры оформления',
    'Дублирование выплат',
    'Другое'
  ];

  const handleApprove = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await invoiceService.approveInvoice(
        invoice.id,
        1, // TODO: Получать из контекста директора
        notes
      );

      if (result.success) {
        onApprovalComplete();
        handleClose();
      } else {
        setError(result.error || 'Ошибка утверждения накладной');
      }
    } catch (error) {
      setError('Ошибка утверждения накладной');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      setError('Укажите причину отклонения');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await invoiceService.rejectInvoice(
        invoice.id,
        1, // TODO: Получать из контекста директора
        rejectionReason,
        notes
      );

      if (result.success) {
        onApprovalComplete();
        handleClose();
      } else {
        setError(result.error || 'Ошибка отклонения накладной');
      }
    } catch (error) {
      setError('Ошибка отклонения накладной');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAction(null);
    setNotes('');
    setRejectionReason('');
    setError(null);
    onClose();
  };

  const handleActionSelect = (selectedAction: 'APPROVE' | 'REJECT') => {
    setAction(selectedAction);
    if (selectedAction === 'APPROVE') {
      setRejectionReason('');
    }
  };

  return (
    <MobileOptimizedModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Утверждение накладной" 
      size="xl"
    >
      <div className="space-y-6">
        {/* Информация о накладной */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Сводная ведомость №8
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div><strong>ID:</strong> {invoice.id}</div>
              <div><strong>Регион:</strong> {invoice.region}</div>
              <div><strong>Управление:</strong> {invoice.departmentName}</div>
              <div><strong>Количество выплат:</strong> {invoice.paymentCount}</div>
            </div>
            <div>
              <div><strong>Общая сумма:</strong> {invoice.totalAmount.toLocaleString('ru-KG')} сом</div>
              <div><strong>Дата отправки:</strong> {new Date(invoice.submittedAt).toLocaleDateString('ru-RU')}</div>
              <div><strong>Статус:</strong> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  invoice.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.status === 'PENDING' ? 'На рассмотрении' :
                   invoice.status === 'APPROVED' ? 'Утверждена' : 'Отклонена'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Детали накладной */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Детали накладной</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">№</th>
                  <th className="text-left py-2">ФИО</th>
                  <th className="text-left py-2">Счет</th>
                  <th className="text-right py-2">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {invoice.invoiceData.payments.map((payment, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{payment.number}</td>
                    <td className="py-2">{payment.fullName}</td>
                    <td className="py-2 font-mono text-xs">{payment.accountNumber}</td>
                    <td className="py-2 text-right">{payment.amount.toLocaleString('ru-KG')} сом</td>
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-50">
                  <td colSpan={3} className="py-2 text-right">Итого:</td>
                  <td className="py-2 text-right">{invoice.totalAmount.toLocaleString('ru-KG')} сом</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Выбор действия */}
        {!action && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Выберите действие:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleActionSelect('APPROVE')}
                className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center justify-center mb-2">
                  <i className="ri-check-line text-2xl text-green-600"></i>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-800">Утвердить</div>
                  <div className="text-sm text-green-600">Одобрить накладную</div>
                </div>
              </button>

              <button
                onClick={() => handleActionSelect('REJECT')}
                className="p-4 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center justify-center mb-2">
                  <i className="ri-close-line text-2xl text-red-600"></i>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-red-800">Отклонить</div>
                  <div className="text-sm text-red-600">Отклонить накладную</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Форма утверждения */}
        {action === 'APPROVE' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Утверждение накладной</h4>
              <p className="text-sm text-green-700">
                Вы собираетесь утвердить накладную на сумму {invoice.totalAmount.toLocaleString('ru-KG')} сом 
                для {invoice.paymentCount} получателей в регионе {invoice.region}.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Комментарий (необязательно)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Дополнительные комментарии..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Форма отклонения */}
        {action === 'REJECT' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Отклонение накладной</h4>
              <p className="text-sm text-red-700">
                Вы собираетесь отклонить накладную. Укажите причину отклонения.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Причина отклонения *
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={isLoading}
                required
              >
                <option value="">Выберите причину</option>
                {rejectionReasons.map(reason => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дополнительные комментарии
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Подробное описание причин отклонения..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-neutral-200">
          {action && (
            <AccessibleButton
              onClick={() => setAction(null)}
              variant="ghost"
              size="md"
              disabled={isLoading}
              className="sm:w-auto w-full"
            >
              Назад
            </AccessibleButton>
          )}
          
          <AccessibleButton
            onClick={handleClose}
            variant="ghost"
            size="md"
            disabled={isLoading}
            className="sm:w-auto w-full"
          >
            Отмена
          </AccessibleButton>

          {action === 'APPROVE' && (
            <AccessibleButton 
              onClick={handleApprove}
              variant="success"
              size="md"
              disabled={isLoading}
              className="sm:w-auto w-full"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-line animate-spin mr-2"></i>
                  Утверждение...
                </>
              ) : (
                <>
                  <i className="ri-check-line mr-2"></i>
                  Утвердить накладную
                </>
              )}
            </AccessibleButton>
          )}

          {action === 'REJECT' && (
            <AccessibleButton 
              onClick={handleReject}
              variant="danger"
              size="md"
              disabled={isLoading || !rejectionReason}
              className="sm:w-auto w-full"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-line animate-spin mr-2"></i>
                  Отклонение...
                </>
              ) : (
                <>
                  <i className="ri-close-line mr-2"></i>
                  Отклонить накладную
                </>
              )}
            </AccessibleButton>
          )}
        </div>
      </div>
    </MobileOptimizedModal>
  );
}
