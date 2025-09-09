'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import TransactionBulkActions from '@/components/ui/TransactionBulkActions';
import Modal from '@/components/ui/Modal';
import RefreshStatusesForm from '@/components/ui/RefreshStatusesForm';
import SearchTransactionForm from '@/components/ui/SearchTransactionForm';
import CheckErrorsForm from '@/components/ui/CheckErrorsForm';
import ExportReportForm from '@/components/ui/ExportReportForm';

export default function TransactionsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedTransactions, setSelectedTransactions] = useState<any[]>([]);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showErrorCheckModal, setShowErrorCheckModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Функции для массовых действий
  const handleSelectTransaction = (transaction: any, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, transaction]);
    } else {
      setSelectedTransactions(selectedTransactions.filter(t => t.id !== transaction.id));
    }
  };

  const handleSelectAll = () => {
    setSelectedTransactions([...transactions]);
  };

  const handleDeselectAll = () => {
    setSelectedTransactions([]);
  };

  const handleBulkAction = (action: string, transactionIds: string[]) => {
    switch (action) {
      case 'export':
        console.log('Экспорт транзакций:', transactionIds);
        alert(`Экспорт ${transactionIds.length} транзакций...`);
        break;
      case 'retry':
        console.log('Повтор транзакций:', transactionIds);
        alert(`Повтор ${transactionIds.length} транзакций...`);
        break;
      case 'approve':
        console.log('Утверждение транзакций:', transactionIds);
        alert(`Утверждение ${transactionIds.length} транзакций...`);
        break;
      case 'cancel':
        console.log('Отмена транзакций:', transactionIds);
        alert(`Отмена ${transactionIds.length} транзакций...`);
        break;
    }
    
    // Очищаем выбор после действия
    setSelectedTransactions([]);
  };

  // Функции для быстрых действий
  const handleRefreshStatuses = () => {
    setShowRefreshModal(true);
  };

  const handleSearchTransaction = () => {
    setShowSearchModal(true);
  };

  const handleCheckErrors = () => {
    setShowErrorCheckModal(true);
  };

  const handleExportReport = () => {
    setShowExportModal(true);
  };

  const handleRefreshAllStatuses = (formData: any) => {
    console.log('Обновление статусов:', formData);
    alert(`Обновление статусов транзакций: ${formData.scope}`);
    setShowRefreshModal(false);
  };

  const handleSearchTransactionById = (formData: any) => {
    console.log('Поиск транзакции:', formData);
    alert(`Поиск транзакции: ${formData.transactionId}`);
    setShowSearchModal(false);
  };

  const handleCheckTransactionErrors = (formData: any) => {
    console.log('Проверка ошибок:', formData);
    alert(`Проверка ошибок: ${formData.scope}`);
    setShowErrorCheckModal(false);
  };

  const handleExportTransactionReport = (formData: any) => {
    console.log('Экспорт отчета:', formData);
    alert(`Экспорт отчета: ${formData.format} за период ${formData.period}`);
    setShowExportModal(false);
  };

  const metrics = [
    {
      title: 'Всего транзакций',
      value: '8,456',
      change: { value: '+15%', type: 'positive' as const },
      icon: <i className="ri-exchange-line"></i>
    },
    {
      title: 'Успешных',
      value: '8,123',
      change: { value: '+14%', type: 'positive' as const },
      icon: <i className="ri-check-line"></i>
    },
    {
      title: 'Неудачных',
      value: '333',
      change: { value: '+8%', type: 'positive' as const },
      icon: <i className="ri-close-line"></i>
    },
    {
      title: 'В обработке',
      value: '156',
      change: { value: '+5%', type: 'positive' as const },
      icon: <i className="ri-loader-line"></i>
    }
  ];

  const transactions = [
    {
      id: 'TXN-001',
      paymentId: 'PAY-001',
      applicant: 'Айбек Кыдыров',
      amount: 50000,
      type: 'Выплата',
      status: 'completed',
      bankName: 'ОАО "Демир Банк"',
      transactionDate: '2024-01-15 14:30:15',
      reference: 'REF123456789'
    },
    {
      id: 'TXN-002',
      paymentId: 'PAY-002',
      applicant: 'Нургуль Асанова',
      amount: 75000,
      type: 'Выплата',
      status: 'processing',
      bankName: 'ОАО "РСК Банк"',
      transactionDate: '2024-01-15 14:25:30',
      reference: 'REF123456790'
    },
    {
      id: 'TXN-003',
      paymentId: 'PAY-003',
      applicant: 'Марат Беков',
      amount: 60000,
      type: 'Выплата',
      status: 'completed',
      bankName: 'ОАО "Айыл Банк"',
      transactionDate: '2024-01-15 14:20:45',
      reference: 'REF123456791'
    },
    {
      id: 'TXN-004',
      paymentId: 'PAY-004',
      applicant: 'Айгуль Токтосунова',
      amount: 80000,
      type: 'Выплата',
      status: 'failed',
      bankName: 'ОАО "Демир Банк"',
      transactionDate: '2024-01-15 14:15:20',
      reference: 'REF123456792'
    },
    {
      id: 'TXN-005',
      paymentId: 'PAY-005',
      applicant: 'Эркин Садыков',
      amount: 45000,
      type: 'Выплата',
      status: 'pending',
      bankName: 'ОАО "РСК Банк"',
      transactionDate: '2024-01-15 14:10:10',
      reference: 'REF123456793'
    }
  ];

  const columns = [
    {
      key: 'select',
      label: 'Выбор',
      render: (value: any, row: any) => (
        <input
          type="checkbox"
          checked={selectedTransactions.some(t => t.id === row.id)}
          onChange={(e) => handleSelectTransaction(row, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
        />
      )
    },
    {
      key: 'id',
      label: 'ID транзакции',
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600">{value}</span>
      )
    },
    {
      key: 'paymentId',
      label: 'ID выплаты',
      render: (value: string) => (
        <span className="font-mono text-sm text-green-600">{value}</span>
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
      label: 'Тип'
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
          {value === 'completed' ? 'Завершена' :
           value === 'processing' ? 'В обработке' :
           value === 'pending' ? 'Ожидает' : 'Ошибка'}
        </StatusBadge>
      )
    },
    {
      key: 'bankName',
      label: 'Банк'
    },
    {
      key: 'transactionDate',
      label: 'Дата транзакции'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Транзакции</h1>
          <p className="text-neutral-600 mt-1">Мониторинг банковских транзакций</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Последние 7 дней</option>
            <option value="30d">Последние 30 дней</option>
            <option value="90d">Последние 90 дней</option>
            <option value="1y">Последний год</option>
          </select>
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



      {/* Transactions Table */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Список транзакций</h3>
          <p className="text-neutral-600 mt-1">Все транзакции с возможностью фильтрации и поиска</p>
        </div>
        
        {/* Mass Actions */}
        <TransactionBulkActions
          selectedTransactions={selectedTransactions}
          onBulkAction={handleBulkAction}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          totalTransactions={transactions.length}
          isAllSelected={selectedTransactions.length === transactions.length && transactions.length > 0}
        />
        
        <DataTable
          data={transactions}
          columns={columns}
        />
      </div>

      {/* Bank Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Статистика по банкам</h3>
          <div className="space-y-4">
            {[
              { bank: 'ОАО "Демир Банк"', transactions: 3456, success: 94.2, amount: 125000000 },
              { bank: 'ОАО "РСК Банк"', transactions: 2890, success: 96.1, amount: 98000000 },
              { bank: 'ОАО "Айыл Банк"', transactions: 2110, success: 92.8, amount: 75000000 }
            ].map((bank, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900">{bank.bank}</p>
                  <p className="text-sm text-neutral-600">{bank.transactions} транзакций</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">{bank.success}%</p>
                  <p className="text-xs text-neutral-600">{bank.amount.toLocaleString()} сом</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <button 
              onClick={handleRefreshStatuses}
              className="w-full btn-primary text-left"
            >
              <i className="ri-refresh-line mr-2"></i>
              Обновить статусы
            </button>
            <button 
              onClick={handleSearchTransaction}
              className="w-full btn-secondary text-left"
            >
              <i className="ri-search-line mr-2"></i>
              Поиск транзакции
            </button>
            <button 
              onClick={handleCheckErrors}
              className="w-full btn-warning text-left"
            >
              <i className="ri-error-warning-line mr-2"></i>
              Проверить ошибки
            </button>
            <button 
              onClick={handleExportReport}
              className="w-full btn-info text-left"
            >
              <i className="ri-download-line mr-2"></i>
              Экспорт отчета
            </button>
          </div>
        </div>
      </div>

      {/* Refresh Statuses Modal */}
      <Modal
        isOpen={showRefreshModal}
        onClose={() => setShowRefreshModal(false)}
        title="Обновить статусы транзакций"
        size="lg"
      >
        <RefreshStatusesForm onSubmit={handleRefreshAllStatuses} />
      </Modal>

      {/* Search Transaction Modal */}
      <Modal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        title="Поиск транзакции"
        size="lg"
      >
        <SearchTransactionForm onSubmit={handleSearchTransactionById} />
      </Modal>

      {/* Check Errors Modal */}
      <Modal
        isOpen={showErrorCheckModal}
        onClose={() => setShowErrorCheckModal(false)}
        title="Проверить ошибки транзакций"
        size="lg"
      >
        <CheckErrorsForm onSubmit={handleCheckTransactionErrors} />
      </Modal>

      {/* Export Report Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт отчета по транзакциям"
        size="lg"
      >
        <ExportReportForm onSubmit={handleExportTransactionReport} />
      </Modal>
    </div>
  );
}
