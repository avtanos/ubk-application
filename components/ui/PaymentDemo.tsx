'use client';

import { useState } from 'react';
import PaymentAssignmentModal from './PaymentAssignmentModal';
import InvoiceExportModal from './InvoiceExportModal';
import { Application } from '@/lib/types-updated';
import { PaymentRecord } from '@/lib/api/paymentService';

// Демонстрационные данные
const demoApplication: Application = {
  id: 1,
  applicationNumber: 'APP-2025-001',
  applicantId: 1,
  status: 'APPROVED',
  priority: 'HIGH',
  riskScore: 15,
  submittedAt: '2025-01-12',
  reviewedAt: '2025-01-13',
  reviewedBy: 1,
  approvedAt: '2025-01-20',
  approvedBy: 1,
  paymentAmount: 4140,
  paymentStatus: 'PENDING',
  notes: 'Заявка одобрена. Семья соответствует критериям программы.',
  inspectionRequired: false,
  createdAt: '2025-01-12',
  updatedAt: '2025-01-20',
  applicant: {
    id: 1,
    pin: '12345678901234',
    fullName: 'Гүлнара Осмонова',
    genderCode: 'F',
    birthDate: '1985-03-15',
    age: 39,
    citizenshipCode: 'KG',
    language: 'ru',
    isActive: true,
    createdAt: '2025-01-12',
    updatedAt: '2025-01-12'
  }
};

const demoPayments = [
  {
    id: 1,
    applicationId: 1,
    applicantName: 'Гүлнара Осмонова',
    pin: '12345678901234',
    amount: 4140,
    status: 'PENDING',
    bankCode: 'KICB',
    bankAccount: '1234567890123456',
    scheduledDate: '2025-01-25',
    createdBy: 1,
    createdAt: '2025-01-20',
    updatedAt: '2025-01-20'
  },
  {
    id: 2,
    applicationId: 2,
    applicantName: 'Жамиля Турдубекова',
    pin: '23456789012345',
    amount: 3880,
    status: 'PENDING',
    bankCode: 'KICB',
    bankAccount: '2345678901234567',
    scheduledDate: '2025-01-25',
    createdBy: 1,
    createdAt: '2025-01-20',
    updatedAt: '2025-01-20'
  },
  {
    id: 3,
    applicationId: 3,
    applicantName: 'Асель Маматова',
    pin: '34567890123456',
    amount: 2400,
    status: 'PENDING',
    bankCode: 'KICB',
    bankAccount: '3456789012345678',
    scheduledDate: '2025-01-25',
    createdBy: 1,
    createdAt: '2025-01-20',
    updatedAt: '2025-01-20'
  }
];

export default function PaymentDemo() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState<any[]>([]);

  const handlePaymentAssigned = (payment: PaymentRecord, assignment: any) => {
    console.log('Выплата назначена:', payment);
    console.log('Назначение пособия:', assignment);
    alert(`Выплата назначена на сумму ${payment.amount} сом`);
    setShowPaymentModal(false);
  };

  const handleSelectPayment = (payment: any) => {
    setSelectedPayments(prev => 
      prev.find(p => p.id === payment.id) 
        ? prev.filter(p => p.id !== payment.id)
        : [...prev, payment]
    );
  };

  const handleExportInvoice = () => {
    if (selectedPayments.length === 0) {
      alert('Выберите выплаты для экспорта');
      return;
    }
    setShowInvoiceModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Демонстрация системы назначения выплат
        </h1>

        {/* Назначение выплаты */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            1. Назначение выплаты после одобрения заявки
          </h2>
          <p className="text-gray-600 mb-4">
            Специалист одобряет заявку и автоматически назначает выплату
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Назначить выплату
          </button>
        </div>

        {/* Выгрузка накладной */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            2. Выгрузка накладной (Сводная ведомость №8)
          </h2>
          <p className="text-gray-600 mb-4">
            Бухгалтер выбирает выплаты и выгружает накладную для банка
          </p>

          {/* Список выплат для выбора */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Выберите выплаты:</h3>
            <div className="space-y-2">
              {demoPayments.map(payment => (
                <label key={payment.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedPayments.some(p => p.id === payment.id)}
                    onChange={() => handleSelectPayment(payment)}
                    className="text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{payment.applicantName}</div>
                    <div className="text-sm text-gray-500">
                      {payment.amount.toLocaleString('ru-KG')} сом • {payment.bankAccount}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleExportInvoice}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Выгрузить накладную ({selectedPayments.length} выплат)
          </button>
        </div>

        {/* Информация о системе */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Функциональность системы:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Автоматическое назначение выплат после одобрения заявки</li>
            <li>• Расчет суммы пособия с учетом коэффициентов</li>
            <li>• Выбор банка и ввод реквизитов</li>
            <li>• Генерация накладной в формате "Сводная ведомость №8"</li>
            <li>• Экспорт в PDF и Excel форматы</li>
            <li>• Интеграция с банковскими системами</li>
          </ul>
        </div>
      </div>

      {/* Модальные окна */}
      <PaymentAssignmentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        application={demoApplication}
        onPaymentAssigned={handlePaymentAssigned}
      />

      <InvoiceExportModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        selectedPayments={selectedPayments}
        onExportComplete={() => {
          setShowInvoiceModal(false);
          setSelectedPayments([]);
          alert('Накладная успешно экспортирована');
        }}
      />
    </div>
  );
}
