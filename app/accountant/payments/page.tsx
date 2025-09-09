'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import PaymentBulkActions from '@/components/ui/PaymentBulkActions';
import CreatePaymentForm from '@/components/ui/CreatePaymentForm';
import BulkPaymentForm from '@/components/ui/BulkPaymentForm';
import SchedulePaymentsForm from '@/components/ui/SchedulePaymentsForm';
import RetryFailedPaymentsForm from '@/components/ui/RetryFailedPaymentsForm';
import NotifyRecipientsForm from '@/components/ui/NotifyRecipientsForm';

export default function PaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState<any[]>([]);
  const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
  const [showBulkPaymentModal, setShowBulkPaymentModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRetryModal, setShowRetryModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);

  const metrics = [
    {
      title: 'Всего выплат',
      value: '2,847',
      change: { value: '+12%', type: 'positive' as const },
      icon: <i className="ri-money-dollar-circle-line"></i>
    },
    {
      title: 'В обработке',
      value: '156',
      change: { value: '+8%', type: 'positive' as const },
      icon: <i className="ri-loader-line"></i>
    },
    {
      title: 'Выплачено',
      value: '2,456',
      change: { value: '+15%', type: 'positive' as const },
      icon: <i className="ri-check-line"></i>
    },
    {
      title: 'Отклонено',
      value: '235',
      change: { value: '-3%', type: 'negative' as const },
      icon: <i className="ri-close-line"></i>
    }
  ];

  const payments = [
    {
      id: 'PAY-001',
      applicant: 'Айбек Кыдыров',
      amount: 50000,
      type: 'Единовременная выплата',
      status: 'pending',
      createdDate: '2024-01-15',
      scheduledDate: '2024-01-16',
      bankAccount: '****1234',
      bankName: 'ОАО "Демир Банк"'
    },
    {
      id: 'PAY-002',
      applicant: 'Нургуль Асанова',
      amount: 75000,
      type: 'Единовременная выплата',
      status: 'processing',
      createdDate: '2024-01-15',
      scheduledDate: '2024-01-16',
      bankAccount: '****5678',
      bankName: 'ОАО "РСК Банк"'
    },
    {
      id: 'PAY-003',
      applicant: 'Марат Беков',
      amount: 60000,
      type: 'Единовременная выплата',
      status: 'completed',
      createdDate: '2024-01-14',
      scheduledDate: '2024-01-15',
      bankAccount: '****9012',
      bankName: 'ОАО "Айыл Банк"'
    },
    {
      id: 'PAY-004',
      applicant: 'Айгуль Токтосунова',
      amount: 80000,
      type: 'Единовременная выплата',
      status: 'failed',
      createdDate: '2024-01-14',
      scheduledDate: '2024-01-15',
      bankAccount: '****3456',
      bankName: 'ОАО "Демир Банк"'
    },
    {
      id: 'PAY-005',
      applicant: 'Эркин Садыков',
      amount: 45000,
      type: 'Единовременная выплата',
      status: 'pending',
      createdDate: '2024-01-13',
      scheduledDate: '2024-01-16',
      bankAccount: '****7890',
      bankName: 'ОАО "РСК Банк"'
    }
  ];

  // Функции для массовых действий
  const handleSelectPayment = (payment: any, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPayments(prev => [...prev, payment]);
    } else {
      setSelectedPayments(prev => prev.filter(p => p.id !== payment.id));
    }
  };

  const handleSelectAll = () => {
    setSelectedPayments([...payments]);
  };

  const handleDeselectAll = () => {
    setSelectedPayments([]);
  };

  const handleBulkAction = (action: string, paymentIds: string[]) => {
    console.log(`Выполнение массового действия: ${action} для выплат:`, paymentIds);
    
    switch (action) {
      case 'process':
        // Логика обработки выплат
        alert(`Обработка ${paymentIds.length} выплат...`);
        break;
      case 'approve':
        // Логика утверждения выплат
        alert(`Утверждение ${paymentIds.length} выплат...`);
        break;
      case 'export':
        // Логика экспорта
        alert(`Экспорт ${paymentIds.length} выплат...`);
        break;
      case 'cancel':
        // Логика отмены выплат
        alert(`Отмена ${paymentIds.length} выплат...`);
        break;
    }
    
    // Очищаем выбор после действия
    setSelectedPayments([]);
  };

  const columns = [
    {
      key: 'select',
      label: 'Выбор',
      render: (value: any, row: any) => (
        <input
          type="checkbox"
          checked={selectedPayments.some(p => p.id === row.id)}
          onChange={(e) => handleSelectPayment(row, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
        />
      )
    },
    {
      key: 'id',
      label: 'ID выплаты',
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600">{value}</span>
      )
    },
    {
      key: 'applicant',
      label: 'Получатель'
    },
    {
      key: 'amount',
      label: 'Сумма',
      render: (value: number) => (
        <span className="font-semibold text-green-600">{value.toLocaleString()} сом</span>
      )
    },
    {
      key: 'type',
      label: 'Тип выплаты'
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value: string) => (
                <StatusBadge
          status={
            value === 'completed' ? 'success' :
            value === 'processing' ? 'warning' :
            value === 'pending' ? 'info' : 'error'
          }
        >
          {value === 'completed' ? 'Выплачено' :
           value === 'processing' ? 'В обработке' :
           value === 'pending' ? 'Ожидает' : 'Ошибка'}
        </StatusBadge>
      )
    },
    {
      key: 'scheduledDate',
      label: 'Дата выплаты'
    },
    {
      key: 'bankName',
      label: 'Банк'
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewPayment(row)}
            className="btn-primary text-xs px-3 py-1"
          >
            <i className="ri-eye-line mr-1"></i>
            Просмотр
          </button>
          {row.status === 'pending' && (
            <button className="btn-success text-xs px-3 py-1">
              <i className="ri-play-line mr-1"></i>
              Выплатить
            </button>
          )}
        </div>
      )
    }
  ];

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };


  const handleCreatePaymentSubmit = (formData: any) => {
    console.log('Создание выплаты:', formData);
    alert(`Создана выплата: ${formData.applicant} на сумму ${formData.amount} сом`);
    setShowCreatePaymentModal(false);
  };

  // Обработчики для быстрых действий
  const handleBulkPayment = () => {
    setShowBulkPaymentModal(true);
  };

  const handleSchedulePayments = () => {
    setShowScheduleModal(true);
  };

  const handleRetryFailed = () => {
    setShowRetryModal(true);
  };

  const handleNotifyRecipients = () => {
    setShowNotifyModal(true);
  };

  const handleBulkPaymentSubmit = (formData: any) => {
    console.log('Массовая выплата:', formData);
    alert(`Массовая выплата: ${formData.paymentCount} выплат на сумму ${formData.totalAmount} сом`);
    setShowBulkPaymentModal(false);
  };

  const handleSchedulePaymentsSubmit = (formData: any) => {
    console.log('Планирование выплат:', formData);
    alert(`Планирование выплат: ${formData.schedule}`);
    setShowScheduleModal(false);
  };

  const handleRetryFailedSubmit = (formData: any) => {
    console.log('Повтор неудачных выплат:', formData);
    alert(`Повтор ${formData.failedCount} неудачных выплат`);
    setShowRetryModal(false);
  };

  const handleNotifyRecipientsSubmit = (formData: any) => {
    console.log('Уведомление получателей:', formData);
    alert(`Уведомления отправлены ${formData.recipientCount} получателям`);
    setShowNotifyModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Управление выплатами</h1>
          <p className="text-neutral-600 mt-1">Обработка и контроль выплат по заявкам</p>
        </div>

      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
          />
        ))}
      </div>



      {/* Payments Table */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Список выплат</h3>
          <p className="text-neutral-600 mt-1">Все выплаты с возможностью фильтрации и поиска</p>
        </div>
        
        {/* Mass Actions */}
        <PaymentBulkActions
          selectedPayments={selectedPayments}
          onBulkAction={handleBulkAction}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          totalPayments={payments.length}
          isAllSelected={selectedPayments.length === payments.length && payments.length > 0}
        />
        
        <DataTable
          data={payments}
          columns={columns}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <button 
              onClick={handleBulkPayment}
              className="w-full btn-success text-left"
            >
              <i className="ri-play-circle-line mr-2"></i>
              Массовая выплата
            </button>
            <button 
              onClick={handleSchedulePayments}
              className="w-full btn-secondary text-left"
            >
              <i className="ri-calendar-line mr-2"></i>
              Планировать выплаты
            </button>
            <button 
              onClick={handleRetryFailed}
              className="w-full btn-warning text-left"
            >
              <i className="ri-refresh-line mr-2"></i>
              Повторить неудачные
            </button>
            <button 
              onClick={handleNotifyRecipients}
              className="w-full btn-info text-left"
            >
              <i className="ri-notification-line mr-2"></i>
              Уведомить получателей
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Статистика выплат</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Выплат сегодня</span>
              <span className="font-semibold text-green-600">23 выплаты</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Сумма сегодня</span>
              <span className="font-semibold text-blue-600">1,250,000 сом</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Успешность</span>
              <span className="font-semibold text-green-600">94.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Среднее время</span>
              <span className="font-semibold text-purple-600">2.3 часа</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Детали выплаты"
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-6">
            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Информация о выплате</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">ID выплаты:</span>
                    <span className="font-mono text-blue-600">{selectedPayment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Получатель:</span>
                    <span>{selectedPayment.applicant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Сумма:</span>
                    <span className="font-semibold text-green-600">{selectedPayment.amount.toLocaleString()} сом</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Тип выплаты:</span>
                    <span>{selectedPayment.type}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Банковские реквизиты</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Банк:</span>
                    <span>{selectedPayment.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Счет:</span>
                    <span className="font-mono">{selectedPayment.bankAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Дата создания:</span>
                    <span>{selectedPayment.createdDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Планируемая дата:</span>
                    <span>{selectedPayment.scheduledDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Статус выплаты</h3>
              <div className="flex items-center space-x-3">
                                <StatusBadge
                  status={
                    selectedPayment.status === 'completed' ? 'success' :
                    selectedPayment.status === 'processing' ? 'warning' :
                    selectedPayment.status === 'pending' ? 'info' : 'error'
                  }
                >
                  {selectedPayment.status === 'completed' ? 'Выплачено' :
                   selectedPayment.status === 'processing' ? 'В обработке' :
                   selectedPayment.status === 'pending' ? 'Ожидает' : 'Ошибка'}
                </StatusBadge>
                <span className="text-sm text-neutral-600">
                  {selectedPayment.status === 'completed' ? 'Выплата успешно завершена' :
                   selectedPayment.status === 'processing' ? 'Выплата обрабатывается банком' :
                   selectedPayment.status === 'pending' ? 'Ожидает обработки' : 'Ошибка при выплате'}
                </span>
              </div>
            </div>

            {/* Payment History */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">История операций</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <i className="ri-file-add-line text-blue-600"></i>
                    <span className="text-sm">Создана выплата</span>
                  </div>
                  <span className="text-xs text-neutral-600">{selectedPayment.createdDate}</span>
                </div>
                {selectedPayment.status === 'processing' && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="ri-loader-line text-yellow-600"></i>
                      <span className="text-sm">Отправлена в банк</span>
                    </div>
                    <span className="text-xs text-neutral-600">2024-01-15 10:30</span>
                  </div>
                )}
                {selectedPayment.status === 'completed' && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="ri-check-line text-green-600"></i>
                      <span className="text-sm">Выплата завершена</span>
                    </div>
                    <span className="text-xs text-neutral-600">2024-01-15 14:45</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-neutral-200">
              {selectedPayment.status === 'pending' && (
                <button className="btn-success">
                  <i className="ri-play-line mr-2"></i>
                  Выплатить
                </button>
              )}
              {selectedPayment.status === 'failed' && (
                <button className="btn-warning">
                  <i className="ri-refresh-line mr-2"></i>
                  Повторить выплату
                </button>
              )}
              <button className="btn-secondary">
                <i className="ri-edit-line mr-2"></i>
                Редактировать
              </button>
              <button className="btn-info">
                <i className="ri-download-line mr-2"></i>
                Скачать документы
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Payment Modal */}
      <Modal
        isOpen={showCreatePaymentModal}
        onClose={() => setShowCreatePaymentModal(false)}
        title="Создать выплату"
        size="large"
      >
        <CreatePaymentForm onSubmit={handleCreatePaymentSubmit} />
      </Modal>

      {/* Bulk Payment Modal */}
      <Modal
        isOpen={showBulkPaymentModal}
        onClose={() => setShowBulkPaymentModal(false)}
        title="Массовая выплата"
        size="large"
      >
        <BulkPaymentForm onSubmit={handleBulkPaymentSubmit} />
      </Modal>

      {/* Schedule Payments Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Планирование выплат"
        size="large"
      >
        <SchedulePaymentsForm onSubmit={handleSchedulePaymentsSubmit} />
      </Modal>

      {/* Retry Failed Payments Modal */}
      <Modal
        isOpen={showRetryModal}
        onClose={() => setShowRetryModal(false)}
        title="Повтор неудачных выплат"
        size="large"
      >
        <RetryFailedPaymentsForm onSubmit={handleRetryFailedSubmit} />
      </Modal>

      {/* Notify Recipients Modal */}
      <Modal
        isOpen={showNotifyModal}
        onClose={() => setShowNotifyModal(false)}
        title="Уведомление получателей"
        size="large"
      >
        <NotifyRecipientsForm onSubmit={handleNotifyRecipientsSubmit} />
      </Modal>
    </div>
  );
}
