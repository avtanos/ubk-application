'use client';

import { useState, useEffect } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import InvoiceApprovalModal from '@/components/ui/InvoiceApprovalModal';
import invoiceService, { InvoiceSubmission, InvoiceFilters } from '@/lib/api/invoiceService';
import DirectorLayout from '@/components/layout/DirectorLayout';

export default function DirectorInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceSubmission[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceSubmission | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0,
    byRegion: []
  });

  // Демонстрационные данные
  const mockInvoices: InvoiceSubmission[] = [
    {
      id: 'INV-001',
      invoiceData: {
        id: 'INV-001',
        departmentName: 'Управление социального развития по Октябрьскому административному району города Бишкек',
        purpose: 'На зачисление денежных средств на карточные счета получателей уй булоого комок в ЗАО «КИКБ»',
        companyAccount: '1280190090000142',
        valueDate: '2025-01-25',
        totalAmount: 63600,
        payments: [
          { number: 1, fullName: 'Гүлнара Осмонова', accountNumber: '1234567890123456', amount: 4140 },
          { number: 2, fullName: 'Жамиля Турдубекова', accountNumber: '2345678901234567', amount: 3880 },
          { number: 3, fullName: 'Асель Маматова', accountNumber: '3456789012345678', amount: 2400 }
        ],
        headName: 'Дурусалиев Т.Б.',
        accountantName: 'Эгембаева Д.Н.'
      },
      submittedBy: 1,
      submittedAt: '2025-01-20T10:00:00Z',
      status: 'PENDING',
      region: 'Бишкек',
      departmentName: 'Управление социального развития по Октябрьскому административному району города Бишкек',
      totalAmount: 63600,
      paymentCount: 3,
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-01-20T10:00:00Z'
    },
    {
      id: 'INV-002',
      invoiceData: {
        id: 'INV-002',
        departmentName: 'Управление социального развития по Ошской области',
        purpose: 'На зачисление денежных средств на карточные счета получателей уй булоого комок в ЗАО «КИКБ»',
        companyAccount: '1280190090000142',
        valueDate: '2025-01-25',
        totalAmount: 45000,
        payments: [
          { number: 1, fullName: 'Айжан Абдуллаева', accountNumber: '4567890123456789', amount: 3600 },
          { number: 2, fullName: 'Бурул Эркебекова', accountNumber: '5678901234567890', amount: 1380 }
        ],
        headName: 'Абдыраимов А.К.',
        accountantName: 'Токтобекова С.М.'
      },
      submittedBy: 2,
      submittedAt: '2025-01-19T14:30:00Z',
      status: 'APPROVED',
      region: 'Ош',
      departmentName: 'Управление социального развития по Ошской области',
      totalAmount: 45000,
      paymentCount: 2,
      approvedBy: 1,
      approvedAt: '2025-01-21T09:15:00Z',
      createdAt: '2025-01-19T14:30:00Z',
      updatedAt: '2025-01-21T09:15:00Z'
    },
    {
      id: 'INV-003',
      invoiceData: {
        id: 'INV-003',
        departmentName: 'Управление социального развития по Нарынской области',
        purpose: 'На зачисление денежных средств на карточные счета получателей уй булоого комок в ЗАО «КИКБ»',
        companyAccount: '1280190090000142',
        valueDate: '2025-01-25',
        totalAmount: 32000,
        payments: [
          { number: 1, fullName: 'Нургул Кыдырбекова', accountNumber: '6789012345678901', amount: 2800 }
        ],
        headName: 'Мамбетов К.А.',
        accountantName: 'Асанова Г.Т.'
      },
      submittedBy: 3,
      submittedAt: '2025-01-18T16:45:00Z',
      status: 'REJECTED',
      region: 'Нарын',
      departmentName: 'Управление социального развития по Нарынской области',
      totalAmount: 32000,
      paymentCount: 1,
      rejectedBy: 1,
      rejectedAt: '2025-01-20T11:20:00Z',
      rejectionReason: 'Неверные данные получателей',
      createdAt: '2025-01-18T16:45:00Z',
      updatedAt: '2025-01-20T11:20:00Z'
    }
  ];

  useEffect(() => {
    loadInvoices();
    loadStats();
  }, [filters]);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const result = await invoiceService.getInvoicesForDirector(filters, 1, 50);
      if (result.success && result.data) {
        setInvoices(result.data.data);
      } else {
        // Fallback to mock data
        setInvoices(mockInvoices);
      }
    } catch (error) {
      setInvoices(mockInvoices);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await invoiceService.getInvoiceStats();
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        // Fallback to mock stats
        setStats({
          total: mockInvoices.length,
          pending: mockInvoices.filter(i => i.status === 'PENDING').length,
          approved: mockInvoices.filter(i => i.status === 'APPROVED').length,
          rejected: mockInvoices.filter(i => i.status === 'REJECTED').length,
          totalAmount: mockInvoices.reduce((sum, i) => sum + i.totalAmount, 0),
          byRegion: [
            { region: 'Бишкек', count: 1, amount: 63600 },
            { region: 'Ош', count: 1, amount: 45000 },
            { region: 'Нарын', count: 1, amount: 32000 }
          ]
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const handleApproveInvoice = (invoice: InvoiceSubmission) => {
    setSelectedInvoice(invoice);
    setShowApprovalModal(true);
  };

  const handleApprovalComplete = () => {
    loadInvoices();
    loadStats();
    setShowApprovalModal(false);
    setSelectedInvoice(null);
  };

  const handleBulkApprove = async () => {
    if (selectedInvoices.length === 0) return;
    
    try {
      const result = await invoiceService.bulkApproveInvoices(
        selectedInvoices,
        1, // TODO: Получать из контекста директора
        'Массовое утверждение'
      );
      
      if (result.success) {
        alert(`Утверждено ${result.data.approved} накладных`);
        loadInvoices();
        loadStats();
        setSelectedInvoices([]);
      } else {
        alert('Ошибка массового утверждения');
      }
    } catch (error) {
      alert('Ошибка массового утверждения');
    }
  };

  const handleBulkReject = async () => {
    if (selectedInvoices.length === 0) return;
    
    const reason = prompt('Причина отклонения:');
    if (!reason) return;
    
    try {
      const result = await invoiceService.bulkRejectInvoices(
        selectedInvoices,
        1, // TODO: Получать из контекста директора
        reason,
        'Массовое отклонение'
      );
      
      if (result.success) {
        alert(`Отклонено ${result.data.rejected} накладных`);
        loadInvoices();
        loadStats();
        setSelectedInvoices([]);
      } else {
        alert('Ошибка массового отклонения');
      }
    } catch (error) {
      alert('Ошибка массового отклонения');
    }
  };

  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    setSelectedInvoices(invoices.map(invoice => invoice.id));
  };

  const handleDeselectAll = () => {
    setSelectedInvoices([]);
  };

  const columns = [
    {
      key: 'select',
      label: '',
      render: (value: any, row: InvoiceSubmission) => (
        <input
          type="checkbox"
          checked={selectedInvoices.includes(row.id)}
          onChange={() => toggleInvoiceSelection(row.id)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      )
    },
    {
      key: 'id',
      label: 'ID накладной'
    },
    {
      key: 'region',
      label: 'Регион'
    },
    {
      key: 'departmentName',
      label: 'Управление',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'paymentCount',
      label: 'Кол-во выплат'
    },
    {
      key: 'totalAmount',
      label: 'Сумма',
      render: (value: number) => `${value.toLocaleString('ru-KG')} сом`
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value: string) => (
        <StatusBadge 
          status={value === 'PENDING' ? 'warning' : value === 'APPROVED' ? 'success' : 'error'}
          text={value === 'PENDING' ? 'На рассмотрении' : value === 'APPROVED' ? 'Утверждена' : 'Отклонена'}
        />
      )
    },
    {
      key: 'submittedAt',
      label: 'Дата отправки',
      render: (value: string) => new Date(value).toLocaleDateString('ru-RU')
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (value: any, row: InvoiceSubmission) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleApproveInvoice(row)}
            className="btn-primary text-xs px-3 py-1"
          >
            <i className="ri-eye-line mr-1"></i>
            Рассмотреть
          </button>
        </div>
      )
    }
  ];

  const metrics = [
    {
      title: 'Всего накладных',
      value: stats.total.toString(),
      change: { value: '+5%', type: 'positive' as const },
      icon: <i className="ri-file-list-line"></i>
    },
    {
      title: 'На рассмотрении',
      value: stats.pending.toString(),
      change: { value: '+2%', type: 'positive' as const },
      icon: <i className="ri-time-line"></i>
    },
    {
      title: 'Утверждено',
      value: stats.approved.toString(),
      change: { value: '+8%', type: 'positive' as const },
      icon: <i className="ri-check-line"></i>
    },
    {
      title: 'Отклонено',
      value: stats.rejected.toString(),
      change: { value: '-1%', type: 'negative' as const },
      icon: <i className="ri-close-line"></i>
    }
  ];

  return (
    <DirectorLayout currentPage="invoices">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Управление накладными</h1>
          <p className="text-neutral-600 mt-1">Утверждение накладных со всей республики</p>
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

      {/* Mass Actions */}
      {selectedInvoices.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-900">
                Выбрано накладных: {selectedInvoices.length} из {invoices.length}
              </span>
              <button
                onClick={handleDeselectAll}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Снять выделение
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkApprove}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <i className="ri-check-line mr-2"></i>
                Утвердить выбранные
              </button>
              <button
                onClick={handleBulkReject}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <i className="ri-close-line mr-2"></i>
                Отклонить выбранные
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Накладные на утверждение</h3>
          <p className="text-neutral-600 mt-1">Все накладные с возможностью фильтрации и поиска</p>
        </div>
        
        <DataTable
          data={invoices}
          columns={columns}
        />
      </div>

      {/* Approval Modal */}
      {selectedInvoice && (
        <InvoiceApprovalModal
          isOpen={showApprovalModal}
          onClose={() => setShowApprovalModal(false)}
          invoice={selectedInvoice}
          onApprovalComplete={handleApprovalComplete}
        />
      )}
      </div>
    </DirectorLayout>
  );
}
