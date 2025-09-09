'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MetricCard from '@/components/ui/MetricCard';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import ApplicationDetailsModal from '@/components/ui/ApplicationDetailsModal';
import DecisionModal from '@/components/ui/DecisionModal';
import UniversalFilters, { FilterConfig } from '@/components/ui/UniversalFilters';
import UniversalBulkActions, { BulkAction } from '@/components/ui/UniversalBulkActions';
import { applicationService } from '@/lib/api/applicationService';
import { Application, ApplicationStatus } from '@/lib/types';

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [currentApplicationId, setCurrentApplicationId] = useState<string>('');
  const [selectedApplications, setSelectedApplications] = useState<Application[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, filters]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Загружаем статистику
      const statsResponse = await applicationService.getApplicationStats();
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      // Загружаем заявления для таблицы
      const applicationsResponse = await applicationService.getApplications({}, 1, 10);
      if (applicationsResponse.success && applicationsResponse.data) {
        setApplications(applicationsResponse.data.data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];

    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(app => 
        app.createdAt && new Date(app.createdAt) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(app => 
        app.createdAt && new Date(app.createdAt) <= toDate
      );
    }

    if (filters.applicantName) {
      filtered = filtered.filter(app => 
        app.applicantName.toLowerCase().includes(filters.applicantName.toLowerCase())
      );
    }

    if (filters.amountMin !== undefined) {
      filtered = filtered.filter(app => 
        app.requestedAmount && app.requestedAmount >= filters.amountMin
      );
    }

    if (filters.amountMax !== undefined) {
      filtered = filtered.filter(app => 
        app.requestedAmount && app.requestedAmount <= filters.amountMax
      );
    }

    setFilteredApplications(filtered);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleSelectApplication = (application: Application, isSelected: boolean) => {
    if (isSelected) {
      setSelectedApplications(prev => [...prev, application]);
    } else {
      setSelectedApplications(prev => prev.filter(app => app.id !== application.id));
    }
  };

  const handleSelectAll = () => {
    setSelectedApplications([...filteredApplications]);
  };

  const handleDeselectAll = () => {
    setSelectedApplications([]);
  };

  const handleBulkAction = async (action: string, applicationIds: string[], notes?: string) => {
    try {
      switch (action) {
        case 'approve':
          for (const id of applicationIds) {
            await applicationService.updateApplicationStatus(id, 'approved', 'Нурбек Жумабеков');
          }
          break;
        case 'reject':
          for (const id of applicationIds) {
            await applicationService.updateApplicationStatus(id, 'rejected', 'Нурбек Жумабеков');
          }
          break;
        case 'pending':
          for (const id of applicationIds) {
            await applicationService.updateApplicationStatus(id, 'pending', 'Нурбек Жумабеков');
          }
          break;
        case 'export':
          const selectedData = applications.filter(app => applicationIds.includes(app.id));
          console.log('Экспорт заявлений:', selectedData);
          break;
      }
      
      // Обновляем данные
      await loadDashboardData();
      setSelectedApplications([]);
    } catch (error) {
      console.error('Ошибка при массовом действии:', error);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      const response = await applicationService.updateApplicationStatus(
        applicationId, 
        newStatus, 
        'Нурбек Жумабеков'
      );
      
      if (response.success) {
        // Обновляем локальное состояние
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        );
        // Перезагружаем статистику
        loadDashboardData();
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleDecisionClick = (applicationId: string) => {
    setCurrentApplicationId(applicationId);
    setIsDecisionModalOpen(true);
  };

  const handleCloseDecisionModal = () => {
    setIsDecisionModalOpen(false);
    setCurrentApplicationId('');
  };

  const handleSaveDecision = async (decision: 'approved' | 'rejected', reason?: string, comment?: string) => {
    try {
      const newStatus: ApplicationStatus = decision === 'approved' ? 'approved' : 'rejected';
      await applicationService.updateApplicationStatus(
        currentApplicationId, 
        newStatus, 
        'Нурбек Жумабеков',
        comment
      );
      
      // Обновляем локальное состояние
      setApplications(prev => prev.map(app => 
        app.id === currentApplicationId 
          ? { ...app, status: newStatus }
          : app
      ));
      
      console.log(`Решение по заявке ${currentApplicationId}: ${decision}`, { reason, comment });
    } catch (error) {
      console.error('Ошибка при сохранении решения:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  const metrics = stats ? [
    {
      title: 'В очереди',
      value: stats.byStatus.submitted.toString(),
      change: { value: '+2 за неделю', type: 'positive' as const },
      icon: <i className="ri-file-list-3-line text-4xl text-blue-600"></i>
    },
    {
      title: 'На рассмотрении',
      value: stats.byStatus.under_review.toString(),
      change: { value: '+1 за неделю', type: 'positive' as const },
      icon: <i className="ri-time-line text-4xl text-yellow-600"></i>
    },
    {
      title: 'Одобрено сегодня',
      value: stats.byStatus.approved.toString(),
      change: { value: '+5 за неделю', type: 'positive' as const },
      icon: <i className="ri-check-line text-4xl text-green-600"></i>
    },
    {
      title: 'Высокий риск',
      value: applications.filter(app => app.riskScore > 50).length.toString(),
      change: { value: '+1 за неделю', type: 'negative' as const },
      icon: <i className="ri-alert-line text-4xl text-red-600"></i>
    }
  ] : [];

  // Конфигурация фильтров
  const filterConfig: FilterConfig[] = [
    {
      key: 'status',
      label: 'Статус',
      type: 'select',
      options: [
        { value: 'pending', label: 'Ожидает' },
        { value: 'approved', label: 'Одобрено' },
        { value: 'rejected', label: 'Отклонено' },
        { value: 'processing', label: 'В обработке' }
      ]
    },
    {
      key: 'dateFrom',
      label: 'Дата от',
      type: 'date'
    },
    {
      key: 'dateTo',
      label: 'Дата до',
      type: 'date'
    },
    {
      key: 'applicantName',
      label: 'Имя заявителя',
      type: 'text',
      placeholder: 'Введите имя'
    },
    {
      key: 'amountMin',
      label: 'Сумма от (сом)',
      type: 'number',
      placeholder: '0'
    },
    {
      key: 'amountMax',
      label: 'Сумма до (сом)',
      type: 'number',
      placeholder: '1000000'
    }
  ];

  // Конфигурация массовых действий
  const bulkActions: BulkAction[] = [
    {
      key: 'approve',
      label: 'Одобрить заявки',
      icon: 'ri-check-line',
      color: 'bg-green-600 hover:bg-green-700 text-white',
      enabled: (items) => items.some(item => item.status === 'pending' || item.status === 'processing')
    },
    {
      key: 'reject',
      label: 'Отклонить заявки',
      icon: 'ri-close-line',
      color: 'bg-red-600 hover:bg-red-700 text-white',
      enabled: (items) => items.some(item => item.status === 'pending' || item.status === 'processing')
    },
    {
      key: 'pending',
      label: 'Вернуть в ожидание',
      icon: 'ri-time-line',
      color: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      enabled: (items) => items.some(item => item.status === 'approved' || item.status === 'rejected')
    },
    {
      key: 'export',
      label: 'Экспортировать',
      icon: 'ri-download-line',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      enabled: (items) => items.length > 0
    }
  ];

  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
          onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
          className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
        />
      ),
      render: (value: any, row: Application) => (
        <input
          type="checkbox"
          checked={selectedApplications.some(app => app.id === row.id)}
          onChange={(e) => handleSelectApplication(row, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
        />
      )
    },
    {
      key: 'id',
      label: '№ заявки',
      render: (value: string) => (
        <span className="font-mono text-sm font-medium text-neutral-900">{value}</span>
      )
    },
    {
      key: 'applicantName',
      label: 'Заявитель',
      render: (value: string) => (
        <span className="font-medium text-neutral-900">{value}</span>
      )
    },
    {
      key: 'priority',
      label: 'Приоритет',
      render: (value: string) => (
        <StatusBadge 
          status={value === 'high' ? 'high-risk' : value === 'medium' ? 'medium-risk' : 'low-risk'}
        >
          {value === 'high' ? 'Высокий' : value === 'medium' ? 'Средний' : 'Низкий'}
        </StatusBadge>
      )
    },
    {
      key: 'riskScore',
      label: 'Риск',
      render: (value: number) => (
        <span className={`text-sm font-medium ${
          value > 50 ? 'text-red-600' : value > 25 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {value}%
        </span>
      )
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value: string) => {
        const statusMap: { [key: string]: string } = {
          'submitted': 'Подана',
          'under_review': 'На рассмотрении',
          'approved': 'Одобрена',
          'rejected': 'Отклонена',
          'payment_processing': 'Обработка платежа',
          'paid': 'Оплачена'
        };
        return (
          <StatusBadge status={value as any}>
            {statusMap[value] || value}
          </StatusBadge>
        );
      }
    },
    {
      key: 'submittedAt',
      label: 'Дата подачи',
      render: (value: Date) => (
        <span className="text-sm text-neutral-600">
          {value.toLocaleDateString('ru-RU')}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (value: any, row: Application) => (
        <div className="flex space-x-2">
          {row.status === 'submitted' && (
            <button 
              onClick={() => handleStatusUpdate(row.id, 'under_review')}
              className="btn-primary text-sm px-3 py-1"
            >
              Взять в работу
            </button>
          )}
          {row.status === 'under_review' && (
            <button 
              onClick={() => handleDecisionClick(row.id)}
              className="btn-danger text-sm px-3 py-1"
            >
              Решение
            </button>
          )}
          <button 
            onClick={() => handleViewDetails(row)}
            className="btn-secondary text-sm px-3 py-1"
          >
            Детали
          </button>
          <button 
            // onClick={() => handleCalcDetails(row)}
            className="btn-secondary text-sm px-3 py-1"
          >
            Калькулятор
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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


      {/* Applications Table */}
      <div className="card">
        <div className="flex mb-4 md:mb-6">
          <div> <h3 className="text-base md:text-lg font-semibold text-neutral-900">Приоритетная очередь заявок</h3>
          <p className="text-xs md:text-sm text-neutral-600 mt-1">Управление заявлениями на семейные пособия</p>
           </div>
           <div className='justify-end flex ml-auto'>
            
             <Link href="/citizen/calculator" className="btn-secondary text-sm md:text-base">
          <i className="ri-calculator-line mr-2"></i>
          <span className="hidden sm:inline">Калькулятор пособия</span>
          <span className="sm:hidden">Калькулятор</span>
        </Link>
        
        </div>
         
        </div>
        

        {/* Фильтры */}
        <UniversalFilters
          title="Фильтры заявлений"
          filters={filterConfig}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Массовые операции */}
        <UniversalBulkActions
          title="Массовые операции"
          selectedItems={selectedApplications}
          onBulkAction={handleBulkAction}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          totalItems={filteredApplications.length}
          isAllSelected={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
          actions={bulkActions}
          getItemId={(app) => app.id}
          getItemDisplayName={(app) => app.applicantName}
          calculateTotal={(apps) => apps.reduce((sum, app) => sum + (app.requestedAmount || 0), 0)}
          totalLabel="Общая сумма заявок"
        />

        <DataTable
          columns={columns}
          data={filteredApplications}
          emptyMessage="Нет заявок для отображения"
        />
      </div>

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
      />

      {/* Decision Modal */}
      <DecisionModal
        isOpen={isDecisionModalOpen}
        onClose={handleCloseDecisionModal}
        applicationId={currentApplicationId}
        onSaveDecision={handleSaveDecision}
      />
    </div>
  );
}
