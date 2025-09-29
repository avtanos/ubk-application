'use client';

import { useState, useEffect } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import InvoiceExportModal from '@/components/ui/InvoiceExportModal';
import InvoiceSubmissionModal from '@/components/ui/InvoiceSubmissionModal';

export default function RegistriesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<any[]>([]);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSendToDirectorModal, setShowSendToDirectorModal] = useState(false);
  const [showDuplicateCheckModal, setShowDuplicateCheckModal] = useState(false);
  const [showInvoiceExportModal, setShowInvoiceExportModal] = useState(false);
  const [showInvoiceSubmissionModal, setShowInvoiceSubmissionModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [selectedDuplicates, setSelectedDuplicates] = useState<any[]>([]);
  const [selectedDuplicate, setSelectedDuplicate] = useState<any>(null);
  const [showDuplicateDetailsModal, setShowDuplicateDetailsModal] = useState(false);

  // Функции для работы с накладными

  const handleSelectAllInvoices = () => {
    setSelectedInvoices([...invoices]);
  };

  const handleDeselectAllInvoices = () => {
    setSelectedInvoices([]);
  };

  const handleBulkInvoiceAction = (action: string, invoiceIds: string[]) => {
    switch (action) {
      case 'approve':
        console.log('Утверждение накладных:', invoiceIds);
        alert(`Утверждение ${invoiceIds.length} накладных...`);
        break;
      case 'reject':
        console.log('Отклонение накладных:', invoiceIds);
        alert(`Отклонение ${invoiceIds.length} накладных...`);
        break;
      case 'send_to_director':
        console.log('Отправка накладных директору:', invoiceIds);
        alert(`Отправка ${invoiceIds.length} накладных директору...`);
        break;
      case 'export':
        console.log('Экспорт накладных:', invoiceIds);
        alert(`Экспорт ${invoiceIds.length} накладных...`);
        break;
    }
    
    setSelectedInvoices([]);
  };

  const handleCreateInvoice = () => {
    setShowCreateInvoiceModal(true);
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleApproveInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowApproveModal(true);
  };

  const handleRejectInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowRejectModal(true);
  };

  const handleSendToDirector = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowSendToDirectorModal(true);
  };

  const handleApproveSubmit = (formData: any) => {
    console.log('Утверждение накладной:', formData);
    alert(`Накладная ${formData.invoiceId} утверждена`);
    setShowApproveModal(false);
    setSelectedInvoice(null);
  };

  const handleRejectSubmit = (formData: any) => {
    console.log('Отклонение накладной:', formData);
    alert(`Накладная ${formData.invoiceId} отклонена: ${formData.reason}`);
    setShowRejectModal(false);
    setSelectedInvoice(null);
  };

  const handleSendToDirectorSubmit = (formData: any) => {
    console.log('Отправка накладной директору:', formData);
    alert(`Накладная ${formData.invoiceId} отправлена директору`);
    setShowSendToDirectorModal(false);
    setSelectedInvoice(null);
  };

  const handleStartDuplicateScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Имитация процесса сканирования накладных на дубликаты
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setScanProgress(i);
    }
    
    setIsScanning(false);
    setDuplicates(mockInvoiceDuplicates);
  };

  const handleViewDuplicateDetails = (duplicate: any) => {
    setSelectedDuplicate(duplicate);
    setShowDuplicateDetailsModal(true);
  };

  const handleSelectAllDuplicates = () => {
    setSelectedDuplicates([...duplicates]);
  };

  const handleDeselectAllDuplicates = () => {
    setSelectedDuplicates([]);
  };

  const handleBulkDuplicateAction = (action: string, duplicateIds: string[]) => {
    console.log(`Bulk action ${action} on duplicates:`, duplicateIds);
    // Здесь можно добавить логику для массовых действий с дубликатами
    switch (action) {
      case 'resolve':
        alert(`Разрешено ${duplicateIds.length} дубликатов`);
        break;
      case 'cancel':
        alert(`Отменено ${duplicateIds.length} дубликатов`);
        break;
      case 'export':
        alert(`Экспорт ${duplicateIds.length} дубликатов`);
        break;
    }
    setSelectedDuplicates([]);
  };


  const handleExportInvoice = () => {
    if (selectedInvoices.length === 0) {
      alert('Выберите накладные для экспорта');
      return;
    }
    setShowInvoiceExportModal(true);
  };

  const handleSubmitInvoice = () => {
    if (selectedInvoices.length === 0) {
      alert('Выберите накладные для отправки на утверждение');
      return;
    }
    setShowInvoiceSubmissionModal(true);
  };

  const handleInvoiceExportComplete = () => {
    setShowInvoiceExportModal(false);
    setSelectedInvoices([]);
    console.log('Накладная успешно экспортирована');
  };

  const handleInvoiceSubmissionComplete = () => {
    setShowInvoiceSubmissionModal(false);
    setSelectedInvoices([]);
    console.log('Накладная отправлена на утверждение');
  };

  // Мокап данные для накладных
  const invoices = [
    {
      id: 'INV-2024-001',
      invoiceNumber: 'НК-2024-001',
      period: 'Январь 2024',
      status: 'draft',
      totalAmount: 2500000,
      applicationsCount: 125,
      createdDate: '2024-01-15',
      createdBy: 'Айжан Кыдырова',
      lastModified: '2024-01-15 14:30',
      approvedBy: null,
      approvedDate: null,
      sentToDirector: false,
      directorApproved: false,
      duplicateCheck: 'pending',
      notes: 'Ежемесячная накладная за январь'
    },
    {
      id: 'INV-2024-002',
      invoiceNumber: 'НК-2024-002',
      period: 'Декабрь 2023',
      status: 'approved',
      totalAmount: 2300000,
      applicationsCount: 118,
      createdDate: '2023-12-31',
      createdBy: 'Айжан Кыдырова',
      lastModified: '2024-01-02 10:15',
      approvedBy: 'Айжан Кыдырова',
      approvedDate: '2024-01-02 10:15',
      sentToDirector: true,
      directorApproved: true,
      duplicateCheck: 'completed',
      notes: 'Накладная за декабрь - утверждена директором'
    },
    {
      id: 'INV-2024-003',
      invoiceNumber: 'НК-2024-003',
      period: 'Февраль 2024',
      status: 'pending_approval',
      totalAmount: 2800000,
      applicationsCount: 142,
      createdDate: '2024-02-15',
      createdBy: 'Айжан Кыдырова',
      lastModified: '2024-02-15 16:45',
      approvedBy: null,
      approvedDate: null,
      sentToDirector: false,
      directorApproved: false,
      duplicateCheck: 'in_progress',
      notes: 'Накладная за февраль - ожидает проверки дубликатов'
    },
    {
      id: 'INV-2024-004',
      invoiceNumber: 'НК-2024-004',
      period: 'Март 2024',
      status: 'rejected',
      totalAmount: 1900000,
      applicationsCount: 95,
      createdDate: '2024-03-15',
      createdBy: 'Айжан Кыдырова',
      lastModified: '2024-03-16 09:20',
      approvedBy: null,
      approvedDate: null,
      sentToDirector: false,
      directorApproved: false,
      duplicateCheck: 'failed',
      notes: 'Накладная отклонена - обнаружены критические дубликаты'
    },
    {
      id: 'INV-2024-005',
      invoiceNumber: 'НК-2024-005',
      period: 'Апрель 2024',
      status: 'sent_to_director',
      totalAmount: 3200000,
      applicationsCount: 168,
      createdDate: '2024-04-15',
      createdBy: 'Айжан Кыдырова',
      lastModified: '2024-04-16 11:30',
      approvedBy: 'Айжан Кыдырова',
      approvedDate: '2024-04-16 11:30',
      sentToDirector: true,
      directorApproved: false,
      duplicateCheck: 'completed',
      notes: 'Накладная отправлена директору на утверждение'
    }
  ];

  // Мокап данные для дубликатов в накладных
  const mockInvoiceDuplicates = [
    {
      id: 'INV-DUP-001',
      invoiceId: 'INV-2024-001',
      invoiceName: 'Накладная за январь 2024',
      invoiceNumber: 'НК-2024-001',
      applicantName: 'Айбек Кыдыров',
      applicantPin: '12345678901234',
      applicationId: 'APP-2024-001',
      duplicatePayments: [
        { 
          id: 'PAY-001', 
          amount: 50000, 
          date: '2024-01-15', 
          status: 'completed',
          bankTransactionId: 'TXN-001'
        },
        { 
          id: 'PAY-045', 
          amount: 50000, 
          date: '2024-01-16', 
          status: 'completed',
          bankTransactionId: 'TXN-045'
        }
      ],
      totalDuplicateAmount: 100000,
      severity: 'high',
      detectedDate: '2024-01-17',
      status: 'pending'
    },
    {
      id: 'INV-DUP-002',
      invoiceId: 'INV-2024-003',
      invoiceName: 'Накладная за февраль 2024',
      invoiceNumber: 'НК-2024-003',
      applicantName: 'Нургуль Асанова',
      applicantPin: '12345678901235',
      applicationId: 'APP-2024-002',
      duplicatePayments: [
        { 
          id: 'PAY-002', 
          amount: 75000, 
          date: '2024-02-14', 
          status: 'completed',
          bankTransactionId: 'TXN-002'
        },
        { 
          id: 'PAY-067', 
          amount: 75000, 
          date: '2024-02-15', 
          status: 'processing',
          bankTransactionId: 'TXN-067'
        }
      ],
      totalDuplicateAmount: 150000,
      severity: 'medium',
      detectedDate: '2024-02-16',
      status: 'investigating'
    }
  ];

  const metrics = [
    {
      title: 'Утвержденных выплат',
      value: '2,456',
      change: { value: '+12%', type: 'positive' as const },
      icon: <i className="ri-money-dollar-circle-line"></i>
    },
    {
      title: 'Разрешенных дубликатов',
      value: '15',
      change: { value: '+3%', type: 'positive' as const },
      icon: <i className="ri-check-line"></i>
    },
    {
      title: 'Создано накладных',
      value: invoices.length.toString(),
      change: { value: '+2', type: 'positive' as const },
      icon: <i className="ri-file-list-3-line"></i>
    },
    {
      title: 'Отправлено директору',
      value: invoices.filter(i => i.status === 'sent_to_director').length.toString(),
      change: { value: '+1', type: 'positive' as const },
      icon: <i className="ri-send-plane-line"></i>
    }
  ];

  // Колонки для таблицы накладных
  const invoiceColumns = [
    {
      key: 'invoiceNumber',
      label: 'Номер накладной',
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600">{value}</span>
      )
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
            value === 'approved' ? 'success' :
            value === 'pending_approval' ? 'warning' :
            value === 'sent_to_director' ? 'info' :
            value === 'rejected' ? 'error' : 'secondary'
          }
        >
          {value === 'approved' ? 'Утверждена' :
           value === 'pending_approval' ? 'На утверждении' :
           value === 'sent_to_director' ? 'Отправлена директору' :
           value === 'rejected' ? 'Отклонена' : 'Черновик'}
        </StatusBadge>
      )
    },
    {
      key: 'totalAmount',
      label: 'Общая сумма',
      render: (value: number) => (
        <span className="font-semibold text-green-600">{value.toLocaleString()} сом</span>
      )
    },
    {
      key: 'applicationsCount',
      label: 'Заявок',
      render: (value: number) => (
        <span className="font-semibold">{value}</span>
      )
    },
    {
      key: 'duplicateCheck',
      label: 'Проверка дубликатов',
      render: (value: string) => (
        <StatusBadge
          status={
            value === 'completed' ? 'success' :
            value === 'in_progress' ? 'warning' :
            value === 'failed' ? 'error' : 'secondary'
          }
        >
          {value === 'completed' ? 'Завершена' :
           value === 'in_progress' ? 'В процессе' :
           value === 'failed' ? 'Ошибка' : 'Ожидает'}
        </StatusBadge>
      )
    }
  ];

  // Инициализация данных
  useEffect(() => {
    setDuplicates(mockInvoiceDuplicates);
  }, []);

  // Колонки для таблицы дубликатов в накладных
  const duplicateColumns = [
    {
      key: 'id',
      label: 'ID дубликата',
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600">{value}</span>
      )
    },
    {
      key: 'invoiceName',
      label: 'Накладная',
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500 font-mono">{row.invoiceId}</div>
        </div>
      )
    },
    {
      key: 'applicantName',
      label: 'Заявитель',
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500 font-mono">{row.applicantPin}</div>
        </div>
      )
    },
    {
      key: 'duplicatePayments',
      label: 'Количество дубликатов',
      render: (value: any[]) => (
        <span className="font-semibold text-red-600">{value.length}</span>
      )
    },
    {
      key: 'totalDuplicateAmount',
      label: 'Сумма дубликатов',
      render: (value: number) => (
        <span className="font-semibold text-red-600">{value.toLocaleString()} сом</span>
      )
    },
    {
      key: 'severity',
      label: 'Критичность',
      render: (value: string) => (
        <StatusBadge
          status={
            value === 'critical' ? 'error' :
            value === 'high' ? 'error' :
            value === 'medium' ? 'warning' : 'info'
          }
        >
          {value === 'critical' ? 'Критический' :
           value === 'high' ? 'Высокий' :
           value === 'medium' ? 'Средний' : 'Низкий'}
        </StatusBadge>
      )
    }
  ];

  // Инициализация данных
  useEffect(() => {
    setDuplicates(mockInvoiceDuplicates);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Накладные</h1>
          <p className="text-neutral-600 mt-1">Формирование накладных из утвержденных выплат и разрешенных дубликатов</p>
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
            onClick={handleCreateInvoice}
            className="btn-primary"
          >
            <i className="ri-add-line mr-2"></i>
            Создать накладную
          </button>
          <button 
            onClick={handleStartDuplicateScan}
            disabled={isScanning}
            className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <i className="ri-loader-line animate-spin mr-2"></i>
                Сканирование... {scanProgress}%
              </>
            ) : (
              <>
                <i className="ri-search-line mr-2"></i>
                Проверить дубликаты
              </>
            )}
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
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {isScanning && (
        <div className="card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Сканирование накладных на дубликаты</h3>
            <p className="text-neutral-600">Проверка выплат в накладных на наличие дубликатов...</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {scanProgress}% завершено
          </div>
        </div>
      )}

      {/* Duplicates in Invoices Table */}
      {duplicates.length > 0 && (
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Дубликаты в накладных</h3>
            <p className="text-neutral-600 mt-1">Обнаруженные дублирующиеся выплаты в накладных</p>
          </div>
          
          {/* Bulk Actions for Duplicates */}
          {selectedDuplicates.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-red-900">
                    Выбрано дубликатов: {selectedDuplicates.length} из {duplicates.length}
                  </span>
                  <button
                    onClick={handleDeselectAllDuplicates}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Снять выделение
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-red-800">
                  <span className="font-medium">Общая сумма дубликатов:</span> {selectedDuplicates.reduce((sum, duplicate) => sum + duplicate.totalDuplicateAmount, 0).toLocaleString()} сом
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkDuplicateAction('resolve', selectedDuplicates.map(d => d.id))}
                    className="btn-success text-sm"
                  >
                    <i className="ri-check-line mr-1"></i>
                    Разрешить все
                  </button>
                  <button
                    onClick={() => handleBulkDuplicateAction('cancel', selectedDuplicates.map(d => d.id))}
                    className="btn-danger text-sm"
                  >
                    <i className="ri-close-line mr-1"></i>
                    Отменить все
                  </button>
                  <button
                    onClick={() => handleBulkDuplicateAction('export', selectedDuplicates.map(d => d.id))}
                    className="btn-secondary text-sm"
                  >
                    <i className="ri-download-line mr-1"></i>
                    Экспорт
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <DataTable
            data={duplicates}
            columns={duplicateColumns}
            searchable={true}
            sortable={true}
            selectable={true}
            selectedItems={selectedDuplicates}
            onSelectionChange={setSelectedDuplicates}
            actions={[
              {
                label: 'Детали',
                icon: 'ri-eye-line',
                onClick: handleViewDuplicateDetails,
                className: 'btn-primary text-sm'
              }
            ]}
          />
        </div>
      )}

      {/* Invoices Table */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Накладные</h3>
          <p className="text-neutral-600 mt-1">Список накладных для проверки и направления директору</p>
        </div>
        
        {/* Bulk Actions */}
        {selectedInvoices.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  Выбрано накладных: {selectedInvoices.length} из {invoices.length}
                </span>
                <button
                  onClick={handleDeselectAllInvoices}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Снять выделение
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Общая сумма:</span> {selectedInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0).toLocaleString()} сом
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkInvoiceAction('approve', selectedInvoices.map(i => i.id))}
                  className="btn-success text-sm"
                >
                  <i className="ri-check-line mr-1"></i>
                  Утвердить все
                </button>
                <button
                  onClick={() => handleBulkInvoiceAction('export', selectedInvoices.map(i => i.id))}
                  className="btn-secondary text-sm"
                >
                  <i className="ri-download-line mr-1"></i>
                  Экспорт
                </button>
                <button
                  onClick={handleExportInvoice}
                  disabled={selectedInvoices.length === 0}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="ri-file-download-line mr-2"></i>
                  Выгрузить накладную (№8)
                </button>
                <button
                  onClick={handleSubmitInvoice}
                  disabled={selectedInvoices.length === 0}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="ri-send-plane-line mr-2"></i>
                  Отправить на утверждение
                </button>
              </div>
            </div>
          </div>
        )}

        <DataTable
          data={invoices}
          columns={invoiceColumns}
          searchable={true}
          sortable={true}
          selectable={true}
          selectedItems={selectedInvoices}
          onSelectionChange={setSelectedInvoices}
          actions={[
            {
              label: 'Просмотр',
              icon: 'ri-eye-line',
              onClick: handleViewInvoice,
              className: 'btn-primary text-sm'
            }
          ]}
        />
      </div>


      {/* Invoice Details Modal */}
      <Modal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        title="Детали накладной"
        size="large"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Информация о накладной</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Номер накладной:</span>
                    <span className="font-mono text-blue-600">{selectedInvoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Период:</span>
                    <span>{selectedInvoice.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Создатель:</span>
                    <span>{selectedInvoice.createdBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Дата создания:</span>
                    <span>{new Date(selectedInvoice.createdDate).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Статистика</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Статус:</span>
                    <StatusBadge 
                      status={
                        selectedInvoice.status === 'approved' ? 'success' :
                        selectedInvoice.status === 'pending_approval' ? 'warning' :
                        selectedInvoice.status === 'sent_to_director' ? 'info' :
                        selectedInvoice.status === 'rejected' ? 'error' : 'secondary'
                      }
                    >
                      {selectedInvoice.status === 'approved' ? 'Утверждена' :
                       selectedInvoice.status === 'pending_approval' ? 'На утверждении' :
                       selectedInvoice.status === 'sent_to_director' ? 'Отправлена директору' :
                       selectedInvoice.status === 'rejected' ? 'Отклонена' : 'Черновик'}
                    </StatusBadge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Количество заявок:</span>
                    <span className="font-semibold">{selectedInvoice.applicationsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Общая сумма:</span>
                    <span className="font-semibold text-green-600">{selectedInvoice.totalAmount.toLocaleString()} сом</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Проверка дубликатов:</span>
                    <StatusBadge
                      status={
                        selectedInvoice.duplicateCheck === 'completed' ? 'success' :
                        selectedInvoice.duplicateCheck === 'in_progress' ? 'warning' :
                        selectedInvoice.duplicateCheck === 'failed' ? 'error' : 'secondary'
                      }
                    >
                      {selectedInvoice.duplicateCheck === 'completed' ? 'Завершена' :
                       selectedInvoice.duplicateCheck === 'in_progress' ? 'В процессе' :
                       selectedInvoice.duplicateCheck === 'failed' ? 'Ошибка' : 'Ожидает'}
                    </StatusBadge>
                  </div>
                </div>
              </div>
            </div>

            {/* Director Status */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Статус у директора</h3>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-neutral-600">Отправлено директору:</span>
                    <span className={`ml-2 font-semibold ${selectedInvoice.sentToDirector ? 'text-green-600' : 'text-gray-400'}`}>
                      {selectedInvoice.sentToDirector ? 'Да' : 'Нет'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600">Утверждено директором:</span>
                    <span className={`ml-2 font-semibold ${selectedInvoice.directorApproved ? 'text-green-600' : 'text-gray-400'}`}>
                      {selectedInvoice.directorApproved ? 'Да' : 'Нет'}
                    </span>
                  </div>
                </div>
                {selectedInvoice.approvedBy && (
                  <div className="mt-2 text-sm text-neutral-600">
                    Утверждено: {selectedInvoice.approvedBy} - {selectedInvoice.approvedDate}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {selectedInvoice.notes && (
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Примечания</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-700">{selectedInvoice.notes}</p>
                </div>
              </div>
            )}

          </div>
        )}
      </Modal>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={showCreateInvoiceModal}
        onClose={() => setShowCreateInvoiceModal(false)}
        title="Создать новую накладную"
        size="large"
      >
        <div className="p-6">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            console.log('Создание накладной:', {
              invoiceNumber: formData.get('invoiceNumber'),
              period: formData.get('period'),
              departmentName: formData.get('departmentName'),
              purpose: formData.get('purpose'),
              companyAccount: formData.get('companyAccount'),
              valueDate: formData.get('valueDate'),
              notes: formData.get('notes')
            });
            alert('Накладная успешно создана');
            setShowCreateInvoiceModal(false);
          }}>
            <div className="space-y-6">
              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Номер накладной *
                  </label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="НК-2024-XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Период накладной *
                  </label>
                  <select
                    name="period"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Выберите период</option>
                    <option value="Январь 2024">Январь 2024</option>
                    <option value="Февраль 2024">Февраль 2024</option>
                    <option value="Март 2024">Март 2024</option>
                    <option value="Апрель 2024">Апрель 2024</option>
                    <option value="Май 2024">Май 2024</option>
                    <option value="Июнь 2024">Июнь 2024</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Наименование организации *
                </label>
                <input
                  type="text"
                  name="departmentName"
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Управление социального развития по Октябрьскому административному району города Бишкек"
                  defaultValue="Управление социального развития по Октябрьскому административному району города Бишкек"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Назначение платежа *
                </label>
                <textarea
                  name="purpose"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="На зачисление денежных средств на карточные счета получателей уй булоого комок в ЗАО «КИКБ»"
                  defaultValue="На зачисление денежных средств на карточные счета получателей уй булоого комок в ЗАО «КИКБ»"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Счет организации *
                  </label>
                  <input
                    type="text"
                    name="companyAccount"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1280190090000142"
                    defaultValue="1280190090000142"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Дата валютирования *
                  </label>
                  <input
                    type="date"
                    name="valueDate"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Примечания
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Дополнительная информация о накладной..."
                />
              </div>

              {/* Информация о подписантах */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-neutral-900 mb-4">Подписанты</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Руководитель
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="Дурусалиев Т.Б."
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Главный бухгалтер
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="Эгембаева Д.Н."
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCreateInvoiceModal(false)}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <i className="ri-add-line mr-2"></i>
                Создать накладную
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Approve Invoice Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Утверждение накладной"
        size="medium"
      >
        {selectedInvoice && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Утверждение накладной {selectedInvoice.invoiceNumber}
              </h3>
              <p className="text-neutral-600">
                Период: {selectedInvoice.period}
              </p>
              <p className="text-neutral-600">
                Сумма: {selectedInvoice.totalAmount.toLocaleString()} сом
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleApproveSubmit({
                invoiceId: selectedInvoice.id,
                comment: formData.get('comment')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Комментарий к утверждению
                  </label>
                  <textarea
                    name="comment"
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Опишите причину утверждения..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  className="btn-secondary"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn-success"
                >
                  <i className="ri-check-line mr-2"></i>
                  Утвердить накладную
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Send to Director Modal */}
      <Modal
        isOpen={showSendToDirectorModal}
        onClose={() => setShowSendToDirectorModal(false)}
        title="Отправка накладной директору"
        size="medium"
      >
        {selectedInvoice && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Отправка накладной {selectedInvoice.invoiceNumber} директору
              </h3>
              <p className="text-neutral-600">
                Период: {selectedInvoice.period}
              </p>
              <p className="text-neutral-600">
                Сумма: {selectedInvoice.totalAmount.toLocaleString()} сом
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSendToDirectorSubmit({
                invoiceId: selectedInvoice.id,
                message: formData.get('message')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Сообщение директору
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Дополнительная информация для директора..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSendToDirectorModal(false)}
                  className="btn-secondary"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn-info"
                >
                  <i className="ri-send-plane-line mr-2"></i>
                  Отправить директору
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Invoice Export Modal */}
      <InvoiceExportModal
        isOpen={showInvoiceExportModal}
        onClose={() => setShowInvoiceExportModal(false)}
        selectedPayments={selectedInvoices.map(invoice => ({
          id: invoice.id,
          applicantName: `Накладная ${invoice.invoiceNumber}`,
          bankAccount: 'N/A',
          amount: invoice.totalAmount
        }))}
        onExportComplete={handleInvoiceExportComplete}
      />

      {/* Invoice Submission Modal */}
      <InvoiceSubmissionModal
        isOpen={showInvoiceSubmissionModal}
        onClose={() => setShowInvoiceSubmissionModal(false)}
        invoiceData={{
          id: `INV-${Date.now()}`,
          departmentName: 'Управление социального развития по Октябрьскому административному району города Бишкек',
          purpose: 'На зачисление денежных средств на карточные счета получателей уй булоого комок в ЗАО «КИКБ»',
          companyAccount: '1280190090000142',
          valueDate: new Date().toISOString().split('T')[0],
          totalAmount: selectedInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0),
          payments: selectedInvoices.map((invoice, index) => ({
            number: index + 1,
            fullName: `Накладная ${invoice.invoiceNumber}`,
            accountNumber: 'N/A',
            amount: invoice.totalAmount
          })),
          headName: 'Дурусалиев Т.Б.',
          accountantName: 'Эгембаева Д.Н.'
        }}
        selectedPayments={selectedInvoices.map(invoice => ({
          id: invoice.id,
          applicantName: `Накладная ${invoice.invoiceNumber}`,
          bankAccount: 'N/A',
          amount: invoice.totalAmount
        }))}
        onSubmitSuccess={handleInvoiceSubmissionComplete}
      />

      {/* Duplicate Details Modal */}
      <Modal
        isOpen={showDuplicateDetailsModal}
        onClose={() => setShowDuplicateDetailsModal(false)}
        title="Детали дубликата"
        size="large"
      >
        {selectedDuplicate && (
          <div className="p-6">
            <div className="space-y-6">
              {/* Основная информация о дубликате */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-4">Информация о дубликате</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-neutral-600">ID дубликата:</span>
                      <p className="text-sm text-neutral-900 font-mono">{selectedDuplicate.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-600">Накладная:</span>
                      <p className="text-sm text-neutral-900">{selectedDuplicate.invoiceName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-600">Заявитель:</span>
                      <p className="text-sm text-neutral-900">{selectedDuplicate.applicantName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-600">ПИН заявителя:</span>
                      <p className="text-sm text-neutral-900 font-mono">{selectedDuplicate.applicantPin}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-600">Общая сумма дубликатов:</span>
                      <p className="text-sm text-neutral-900 font-semibold text-red-600">
                        {selectedDuplicate.totalDuplicateAmount.toLocaleString()} сом
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-600">Серьезность:</span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        selectedDuplicate.severity === 'high' ? 'bg-red-100 text-red-800' :
                        selectedDuplicate.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedDuplicate.severity === 'high' ? 'Высокая' :
                         selectedDuplicate.severity === 'medium' ? 'Средняя' : 'Низкая'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-600">Статус:</span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        selectedDuplicate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedDuplicate.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedDuplicate.status === 'pending' ? 'Ожидает' :
                         selectedDuplicate.status === 'resolved' ? 'Разрешен' : 'Отменен'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-600">Дата обнаружения:</span>
                      <p className="text-sm text-neutral-900">
                        {new Date(selectedDuplicate.detectedDate).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-4">Дублирующиеся выплаты</h4>
                  <div className="space-y-3">
                    {selectedDuplicate.duplicatePayments.map((payment: any, index: number) => (
                      <div key={payment.id} className="border border-neutral-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-neutral-600">
                            Выплата #{index + 1}
                          </span>
                          <span className="text-sm font-semibold text-red-600">
                            {payment.amount.toLocaleString()} сом
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-neutral-500">ID: {payment.id}</p>
                          <p className="text-xs text-neutral-500">Дата: {payment.date}</p>
                          <p className="text-xs text-neutral-500">Статус: {payment.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
