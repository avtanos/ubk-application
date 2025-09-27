'use client';

import { useState } from 'react';
import MobileOptimizedModal from './MobileOptimizedModal';
import AccessibleButton from './AccessibleButton';
import invoiceService from '@/lib/api/invoiceService';
import { InvoiceData } from '@/lib/api/paymentService';

interface InvoiceSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData;
  selectedPayments: any[];
  onSubmitSuccess: () => void;
}

export default function InvoiceSubmissionModal({ 
  isOpen, 
  onClose, 
  invoiceData,
  selectedPayments,
  onSubmitSuccess 
}: InvoiceSubmissionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    region: 'Бишкек',
    departmentName: invoiceData.departmentName,
    notes: ''
  });

  const regions = [
    'Бишкек',
    'Ош',
    'Нарын',
    'Баткен',
    'Джалал-Абад',
    'Иссык-Куль',
    'Талас',
    'Чуй'
  ];

  const handleSubmit = async () => {
    if (!formData.region || !formData.departmentName) {
      setError('Заполните все обязательные поля');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await invoiceService.submitInvoiceForApproval(
        invoiceData,
        1, // TODO: Получать из контекста пользователя
        formData.region,
        formData.departmentName,
        formData.notes
      );

      if (result.success) {
        onSubmitSuccess();
        handleClose();
      } else {
        setError(result.error || 'Ошибка отправки накладной');
      }
    } catch (error) {
      setError('Ошибка отправки накладной');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      region: 'Бишкек',
      departmentName: invoiceData.departmentName,
      notes: ''
    });
    setError(null);
    onClose();
  };

  const totalAmount = selectedPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <MobileOptimizedModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Отправка накладной на утверждение" 
      size="lg"
    >
      <div className="space-y-6">
        {/* Информация о накладной */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Сводная ведомость №8
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <div><strong>Количество выплат:</strong> {selectedPayments.length}</div>
            <div><strong>Общая сумма:</strong> {totalAmount.toLocaleString('ru-KG')} сом</div>
            <div><strong>Управление:</strong> {invoiceData.departmentName}</div>
            <div><strong>Дата валютирования:</strong> {new Date(invoiceData.valueDate).toLocaleDateString('ru-RU')}</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Форма отправки */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Регион *
            </label>
            <select
              value={formData.region}
              onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              {regions.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Наименование управления *
            </label>
            <input
              type="text"
              value={formData.departmentName}
              onChange={(e) => setFormData(prev => ({ ...prev, departmentName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Примечания
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Дополнительная информация для директора..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Предупреждение */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <i className="ri-alert-line text-yellow-600 mr-2 mt-0.5"></i>
            <div className="text-sm text-yellow-800">
              <strong>Внимание:</strong> После отправки накладная будет передана директору на утверждение. 
              Вы не сможете изменить данные до получения решения.
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-neutral-200">
          <AccessibleButton
            onClick={handleClose}
            variant="ghost"
            size="md"
            disabled={isLoading}
            className="sm:w-auto w-full"
          >
            Отмена
          </AccessibleButton>
          <AccessibleButton 
            onClick={handleSubmit}
            variant="primary"
            size="md"
            disabled={isLoading || !formData.region || !formData.departmentName}
            className="sm:w-auto w-full"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-line animate-spin mr-2"></i>
                Отправка...
              </>
            ) : (
              <>
                <i className="ri-send-plane-line mr-2"></i>
                Отправить на утверждение
              </>
            )}
          </AccessibleButton>
        </div>
      </div>
    </MobileOptimizedModal>
  );
}
