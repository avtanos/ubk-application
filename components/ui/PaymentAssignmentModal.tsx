'use client';

import { useState, useEffect } from 'react';
import MobileOptimizedModal from './MobileOptimizedModal';
import AccessibleButton from './AccessibleButton';
import paymentService from '@/lib/api/paymentService';
import { BenefitAssignment, Application } from '@/lib/types-updated';
import { PaymentRecord } from '@/lib/api/paymentService';

interface PaymentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onPaymentAssigned: (payment: PaymentRecord, assignment: BenefitAssignment) => void;
}

export default function PaymentAssignmentModal({ 
  isOpen, 
  onClose, 
  application, 
  onPaymentAssigned 
}: PaymentAssignmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);
  const [bankAccount, setBankAccount] = useState('');
  const [bankCode, setBankCode] = useState('KICB');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && application) {
      calculateBenefitAmount();
      loadPaymentRequisites();
    }
  }, [isOpen, application]);

  const calculateBenefitAmount = async () => {
    try {
      const result = await paymentService.calculateBenefitAmount(application.id);
      if (result.success && result.data) {
        setCalculatedAmount(result.data.totalAmount);
      } else {
        // Fallback calculation if API is not available
        setCalculatedAmount(application.paymentAmount || 3000);
      }
    } catch (error) {
      console.error('Ошибка расчета суммы пособия:', error);
      setCalculatedAmount(application.paymentAmount || 3000);
    }
  };

  const loadPaymentRequisites = async () => {
    try {
      const result = await paymentService.getPaymentRequisites(application.id);
      if (result.success && result.data && result.data.length > 0) {
        const requisites = result.data[0];
        setBankAccount(requisites.bankAccount || '');
        setBankCode(requisites.bankCode || 'KICB');
      }
    } catch (error) {
      console.error('Ошибка загрузки реквизитов:', error);
    }
  };

  const handleAssignPayment = async () => {
    if (!bankAccount.trim()) {
      setError('Необходимо указать банковский счет');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Создаем назначение пособия
      const assignmentResult = await paymentService.createBenefitAssignment({
        applicationId: application.id,
        benefitType: 'MONTHLY_ALLOWANCE',
        categoryCode: 'BASIC',
        periodFrom: new Date().toISOString().split('T')[0],
        decision: 'APPROVED',
        assignedAmount: calculatedAmount,
        currentAmount: calculatedAmount,
        assignmentDate: new Date().toISOString().split('T')[0],
        effectiveDate: scheduledDate,
        assignedBy: 1 // TODO: Получать из контекста пользователя
      });

      if (!assignmentResult.success) {
        throw new Error(assignmentResult.error || 'Ошибка создания назначения');
      }

      // 2. Создаем выплату
      const paymentResult = await paymentService.createPayment({
        applicationId: application.id,
        applicantName: application.applicant?.fullName || 'Заявитель',
        amount: calculatedAmount,
        bankCode,
        bankAccount,
        scheduledDate,
        notes,
        createdBy: 1 // TODO: Получать из контекста пользователя
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Ошибка создания выплаты');
      }

      onPaymentAssigned(paymentResult.data!, assignmentResult.data!);
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setBankAccount('');
    setNotes('');
    setError(null);
    onClose();
  };

  const bankOptions = [
    { code: 'KICB', name: 'ЗАО «КИКБ»' },
    { code: 'DEMIR_BANK', name: 'ОАО "Демир Банк"' },
    { code: 'RSK_BANK', name: 'ОАО "РСК Банк"' },
    { code: 'AIYL_BANK', name: 'ОАО "Айыл Банк"' },
    { code: 'DOS_KREDOBANK', name: 'ДосКредоБанк' }
  ];

  return (
    <MobileOptimizedModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Назначение выплаты" 
      size="lg"
    >
      <div className="space-y-6">
        {/* Информация о заявке */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Заявка одобрена
          </h3>
          <div className="text-sm text-green-700 space-y-1">
            <div><strong>Заявитель:</strong> {application.applicant?.fullName}</div>
            <div><strong>ПИН:</strong> {application.applicant?.pin}</div>
            <div><strong>Номер заявки:</strong> {application.applicationNumber}</div>
          </div>
        </div>

        {/* Расчет суммы */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">
            Расчет пособия
          </h4>
          <div className="text-2xl font-bold text-blue-900">
            {calculatedAmount.toLocaleString('ru-KG')} сом
          </div>
          <div className="text-sm text-blue-700 mt-1">
            Базовая сумма с учетом коэффициентов
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Форма выплаты */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Банк *
            </label>
            <select
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              {bankOptions.map(bank => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Банковский счет *
            </label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="Номер банковского счета"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата выплаты
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Примечания
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Дополнительная информация..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
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
            onClick={handleAssignPayment}
            variant="success"
            size="md"
            disabled={isLoading || !bankAccount.trim()}
            className="sm:w-auto w-full"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-line animate-spin mr-2"></i>
                Назначение...
              </>
            ) : (
              <>
                <i className="ri-money-dollar-circle-line mr-2"></i>
                Назначить выплату
              </>
            )}
          </AccessibleButton>
        </div>
      </div>
    </MobileOptimizedModal>
  );
}
