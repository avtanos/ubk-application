'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import ReconciliationBulkActions from '@/components/ui/ReconciliationBulkActions';
import Modal from '@/components/ui/Modal';
import AutoReconciliationForm from '@/components/ui/AutoReconciliationForm';
import DiscrepancyViewForm from '@/components/ui/DiscrepancyViewForm';

export default function ReconciliationPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReconciliations, setSelectedReconciliations] = useState<any[]>([]);
  const [showAutoReconciliationModal, setShowAutoReconciliationModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCheckDiscrepanciesModal, setShowCheckDiscrepanciesModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<any>(null);

  // Функции для массовых действий
  const handleSelectReconciliation = (reconciliation: any, checked: boolean) => {
    if (checked) {
      setSelectedReconciliations([...selectedReconciliations, reconciliation]);
    } else {
      setSelectedReconciliations(selectedReconciliations.filter(r => r.id !== reconciliation.id));
    }
  };

  const handleSelectAll = () => {
    setSelectedReconciliations([...reconciliations]);
  };

  const handleDeselectAll = () => {
    setSelectedReconciliations([]);
  };

  const handleBulkAction = (action: string, reconciliationIds: string[]) => {
    switch (action) {
      case 'export':
        console.log('Экспорт сверок:', reconciliationIds);
        alert(`Экспорт ${reconciliationIds.length} сверок...`);
        break;
      case 'rerun':
        console.log('Повторный запуск сверок:', reconciliationIds);
        alert(`Повторный запуск ${reconciliationIds.length} сверок...`);
        break;
      case 'approve':
        console.log('Утверждение сверок:', reconciliationIds);
        alert(`Утверждение ${reconciliationIds.length} сверок...`);
        break;
      case 'cancel':
        console.log('Отмена сверок:', reconciliationIds);
        alert(`Отмена ${reconciliationIds.length} сверок...`);
        break;
    }
    
    // Очищаем выбор после действия
    setSelectedReconciliations([]);
  };

  // Функции для быстрых действий
  const handleAutoReconciliation = () => {
    setShowAutoReconciliationModal(true);
  };

  const handleScheduleReconciliations = () => {
    setShowScheduleModal(true);
  };

  const handleCheckDiscrepancies = () => {
    setShowCheckDiscrepanciesModal(true);
  };

  const handleExportReport = () => {
    setShowExportModal(true);
  };

  // Функции для действий с расхождениями
  const handleViewDiscrepancy = (discrepancy: any) => {
    setSelectedDiscrepancy(discrepancy);
    setShowDiscrepancyModal(true);
  };

  const handleResolveDiscrepancy = (discrepancy: any) => {
    console.log('Разрешение расхождения:', discrepancy.id);
    alert(`Расхождение ${discrepancy.id} разрешено`);
  };

  // Обработчики для форм
  const handleAutoReconciliationSubmit = (formData: any) => {
    console.log('Автоматическая сверка:', formData);
    alert(`Запуск автоматической сверки для банков: ${formData.banks.join(', ')}`);
    setShowAutoReconciliationModal(false);
  };




  const handleDiscrepancyAction = (formData: any) => {
    console.log('Действие с расхождением:', formData);
    alert(`Действие "${formData.action}" применено к расхождению ${formData.discrepancyId}`);
    setShowDiscrepancyModal(false);
    setSelectedDiscrepancy(null);
  };

  const metrics = [
    {
      title: 'Всего сверок',
      value: '156',
      change: '+8%',
      changeType: 'positive' as const,
      icon: <i className="ri-check-double-line"></i>
    },
    {
      title: 'Успешных',
      value: '142',
      change: '+12%',
      changeType: 'positive' as const,
      icon: <i className="ri-check-line"></i>
    },
    {
      title: 'С расхождениями',
      value: '14',
      change: '-3%',
      changeType: 'negative' as const,
      icon: <i className="ri-error-warning-line"></i>
    },
    {
      title: 'В процессе',
      value: '8',
      change: '+2%',
      changeType: 'positive' as const,
      icon: <i className="ri-loader-line"></i>
    }
  ];

  const reconciliations = [
    {
      id: 'REC-001',
      bankName: 'ОАО "Демир Банк"',
      period: '2024-01-01 - 2024-01-15',
      status: 'completed',
      totalTransactions: 1245,
      matchedTransactions: 1240,
      unmatchedTransactions: 5,
      discrepancyAmount: 25000,
      lastRun: '2024-01-15 18:00',
      operator: 'Айжан Кыдырова'
    },
    {
      id: 'REC-002',
      bankName: 'ОАО "РСК Банк"',
      period: '2024-01-01 - 2024-01-15',
      status: 'completed',
      totalTransactions: 890,
      matchedTransactions: 885,
      unmatchedTransactions: 5,
      discrepancyAmount: 15000,
      lastRun: '2024-01-15 17:30',
      operator: 'Айжан Кыдырова'
    },
    {
      id: 'REC-003',
      bankName: 'ОАО "Айыл Банк"',
      period: '2024-01-01 - 2024-01-15',
      status: 'in_progress',
      totalTransactions: 567,
      matchedTransactions: 520,
      unmatchedTransactions: 47,
      discrepancyAmount: 0,
      lastRun: '2024-01-15 16:45',
      operator: 'Система'
    },
    {
      id: 'REC-004',
      bankName: 'ОАО "Демир Банк"',
      period: '2023-12-16 - 2023-12-31',
      status: 'discrepancy',
      totalTransactions: 1156,
      matchedTransactions: 1140,
      unmatchedTransactions: 16,
      discrepancyAmount: 45000,
      lastRun: '2023-12-31 18:00',
      operator: 'Айжан Кыдырова'
    }
  ];

  const columns = [
    {
      key: 'select',
      label: 'Выбор',
      render: (value: any, row: any) => (
        <input
          type="checkbox"
          checked={selectedReconciliations.some(r => r.id === row.id)}
          onChange={(e) => handleSelectReconciliation(row, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
        />
      )
    },
    {
      key: 'id',
      label: 'ID сверки',
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600">{value}</span>
      )
    },
    {
      key: 'bankName',
      label: 'Банк'
    },
    {
      key: 'period',
      label: 'Период'
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value: string) => (
                <StatusBadge
          status={
            value === 'completed' ? 'success' :
            value === 'in_progress' ? 'warning' :
            value === 'discrepancy' ? 'error' : 'info'
          }
        >
          {value === 'completed' ? 'Завершена' :
           value === 'in_progress' ? 'В процессе' :
           value === 'discrepancy' ? 'Расхождения' : 'Ожидает'}
        </StatusBadge>
      )
    },
    {
      key: 'totalTransactions',
      label: 'Всего транзакций',
      render: (value: number) => (
        <span className="font-semibold">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'matchedTransactions',
      label: 'Совпало',
      render: (value: number) => (
        <span className="font-semibold text-green-600">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'unmatchedTransactions',
      label: 'Не совпало',
      render: (value: number) => (
        <span className="font-semibold text-red-600">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'discrepancyAmount',
      label: 'Сумма расхождений',
      render: (value: number) => (
        <span className="font-semibold text-orange-600">{value.toLocaleString()} сом</span>
      )
    }
  ];

  const discrepancies = [
    {
      id: 'DISC-001',
      reconciliationId: 'REC-001',
      transactionId: 'TXN-001',
      bankAmount: 50000,
      systemAmount: 50000,
      difference: 0,
      status: 'resolved',
      description: 'Незначительное расхождение в комиссии',
      resolvedBy: 'Айжан Кыдырова',
      resolvedDate: '2024-01-15 18:30'
    },
    {
      id: 'DISC-002',
      reconciliationId: 'REC-001',
      transactionId: 'TXN-002',
      bankAmount: 75000,
      systemAmount: 75000,
      difference: 0,
      status: 'pending',
      description: 'Транзакция не найдена в банковской выписке',
      resolvedBy: null,
      resolvedDate: null
    },
    {
      id: 'DISC-003',
      reconciliationId: 'REC-002',
      transactionId: 'TXN-003',
      bankAmount: 60000,
      systemAmount: 60000,
      difference: 0,
      status: 'investigating',
      description: 'Дублирование транзакции',
      resolvedBy: 'Айжан Кыдырова',
      resolvedDate: null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Сверка</h1>
          <p className="text-neutral-600 mt-1">Сверка банковских операций с системными данными</p>
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
          <button 
            onClick={handleAutoReconciliation}
            className="btn-primary"
          >
            <i className="ri-play-line mr-2"></i>
            Запустить сверку
          </button>
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
            changeType={metric.changeType}
            icon={metric.icon}
          />
        ))}
      </div>



      {/* Reconciliations Table */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">История сверок</h3>
          <p className="text-neutral-600 mt-1">Все выполненные сверки с результатами</p>
        </div>
        
        {/* Mass Actions */}
        <ReconciliationBulkActions
          selectedReconciliations={selectedReconciliations}
          onBulkAction={handleBulkAction}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          totalReconciliations={reconciliations.length}
          isAllSelected={selectedReconciliations.length === reconciliations.length && reconciliations.length > 0}
        />
        
        <DataTable
          data={reconciliations}
          columns={columns}
          searchable={true}
          sortable={true}
        />
      </div>

      {/* Discrepancies */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Расхождения</h3>
          <p className="text-neutral-600 mt-1">Требуют внимания и разрешения</p>
        </div>
        <div className="space-y-4">
          {discrepancies.map((discrepancy) => (
            <div key={discrepancy.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-neutral-900">Расхождение {discrepancy.id}</h4>
                    <StatusBadge 
                      status={
                        discrepancy.status === 'resolved' ? 'success' :
                        discrepancy.status === 'investigating' ? 'warning' : 'error'
                      }
                      text={
                        discrepancy.status === 'resolved' ? 'Разрешено' :
                        discrepancy.status === 'investigating' ? 'Расследуется' : 'Ожидает'
                      }
                    />
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-3">{discrepancy.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">ID сверки:</span>
                      <p className="font-mono text-blue-600">{discrepancy.reconciliationId}</p>
                    </div>
                    <div>
                      <span className="text-neutral-600">ID транзакции:</span>
                      <p className="font-mono text-green-600">{discrepancy.transactionId}</p>
                    </div>
                    <div>
                      <span className="text-neutral-600">Сумма в банке:</span>
                      <p className="text-neutral-900">{discrepancy.bankAmount.toLocaleString()} сом</p>
                    </div>
                    <div>
                      <span className="text-neutral-600">Сумма в системе:</span>
                      <p className="text-neutral-900">{discrepancy.systemAmount.toLocaleString()} сом</p>
                    </div>
                  </div>
                  
                  {discrepancy.resolvedBy && (
                    <div className="mt-3">
                      <span className="text-neutral-600 text-sm">Разрешено:</span>
                      <span className="ml-2 text-sm font-medium text-neutral-900">
                        {discrepancy.resolvedBy} - {discrepancy.resolvedDate}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button 
                    onClick={() => handleViewDiscrepancy(discrepancy)}
                    className="btn-primary text-sm"
                  >
                    <i className="ri-eye-line mr-1"></i>
                    Просмотр
                  </button>
                  {discrepancy.status !== 'resolved' && (
                    <button 
                      onClick={() => handleResolveDiscrepancy(discrepancy)}
                      className="btn-success text-sm"
                    >
                      <i className="ri-check-line mr-1"></i>
                      Разрешить
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <button 
              onClick={handleAutoReconciliation}
              className="w-full btn-primary text-left"
            >
              <i className="ri-play-circle-line mr-2"></i>
              Запустить автоматическую сверку
            </button>
            <button 
              onClick={handleScheduleReconciliations}
              className="w-full btn-secondary text-left"
            >
              <i className="ri-calendar-line mr-2"></i>
              Настроить расписание сверок
            </button>
            <button 
              onClick={handleCheckDiscrepancies}
              className="w-full btn-warning text-left"
            >
              <i className="ri-error-warning-line mr-2"></i>
              Проверить расхождения
            </button>
            <button 
              onClick={handleExportReport}
              className="w-full btn-info text-left"
            >
              <i className="ri-download-line mr-2"></i>
              Экспорт отчета сверки
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Статистика сверок</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Сверок сегодня</span>
              <span className="font-semibold text-blue-600">3 сверки</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Успешных</span>
              <span className="font-semibold text-green-600">2 сверки</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">С расхождениями</span>
              <span className="font-semibold text-orange-600">1 сверка</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Среднее время</span>
              <span className="font-semibold text-purple-600">15 минут</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showAutoReconciliationModal}
        onClose={() => setShowAutoReconciliationModal(false)}
        title="Автоматическая сверка"
        size="large"
      >
        <AutoReconciliationForm onSubmit={handleAutoReconciliationSubmit} />
      </Modal>

      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Настройка расписания сверок"
        size="large"
      >
        <div className="p-4">
          <p className="text-neutral-600">Форма настройки расписания сверок будет реализована позже.</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="btn-secondary"
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCheckDiscrepanciesModal}
        onClose={() => setShowCheckDiscrepanciesModal(false)}
        title="Проверка расхождений"
        size="large"
      >
        <div className="p-4">
          <p className="text-neutral-600">Форма проверки расхождений будет реализована позже.</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowCheckDiscrepanciesModal(false)}
              className="btn-secondary"
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт отчета сверки"
        size="large"
      >
        <div className="p-4">
          <p className="text-neutral-600">Форма экспорта отчета будет реализована позже.</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowExportModal(false)}
              className="btn-secondary"
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDiscrepancyModal}
        onClose={() => {
          setShowDiscrepancyModal(false);
          setSelectedDiscrepancy(null);
        }}
        title="Просмотр расхождения"
        size="large"
      >
        <DiscrepancyViewForm 
          discrepancy={selectedDiscrepancy} 
          onSubmit={handleDiscrepancyAction} 
        />
      </Modal>
    </div>
  );
}
