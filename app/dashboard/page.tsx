'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MetricCard from '@/components/ui/MetricCard';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import ApplicationDetailsModal from '@/components/ui/ApplicationDetailsModal';
import DecisionModal from '@/components/ui/DecisionModal';
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
  const [activeTab, setActiveTab] = useState<'all' | 'queue'>('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Слушаем события отправки новых заявок
  useEffect(() => {
    const handleApplicationSubmitted = () => {
      loadDashboardData();
    };

    window.addEventListener('applicationSubmitted', handleApplicationSubmitted);
    
    return () => {
      window.removeEventListener('applicationSubmitted', handleApplicationSubmitted);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, filters, activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Загружаем заявки из localStorage для демонстрации
      let storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      
      // Если нет данных, загружаем тестовые данные автоматически
      if (storedApplications.length === 0) {
        const { loadTestApplications } = await import('@/lib/testData');
        loadTestApplications();
        storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      }
      
      // Сортируем по дате создания (новые сверху)
      storedApplications.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setApplications(storedApplications);
      
      // Рассчитываем статистику из локальных данных
      const stats = {
        total: storedApplications.length,
        submitted: storedApplications.filter((app: any) => app.status === 'SUBMITTED').length,
        underReview: storedApplications.filter((app: any) => app.status === 'UNDER_REVIEW').length,
        approved: storedApplications.filter((app: any) => app.status === 'APPROVED').length,
        rejected: storedApplications.filter((app: any) => app.status === 'REJECTED').length,
        pending: storedApplications.filter((app: any) => app.status === 'PENDING').length
      };
      
      setStats(stats);
      
      // Также пытаемся загрузить с сервера (если API доступен)
      try {
        const statsResponse = await applicationService.getApplicationStats();
        if (statsResponse.success && statsResponse.data) {
          // Объединяем статистику
          setStats({
            total: stats.total + (statsResponse.data.total || 0),
            submitted: stats.submitted + (statsResponse.data.submitted || 0),
            underReview: stats.underReview + (statsResponse.data.underReview || 0),
            approved: stats.approved + (statsResponse.data.approved || 0),
            rejected: stats.rejected + (statsResponse.data.rejected || 0),
            pending: stats.pending + (statsResponse.data.pending || 0)
          });
        }

        const applicationsResponse = await applicationService.getApplications({}, 1, 10);
        if (applicationsResponse.success && applicationsResponse.data) {
          // Объединяем данные с сервера с локальными данными
          const serverApplications = applicationsResponse.data.data;
          const combinedApplications = [...storedApplications, ...serverApplications];
          setApplications(combinedApplications);
        }
      } catch (serverError) {
        console.log('Сервер недоступен, используем только локальные данные');
      }
      
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];

    // Фильтр по вкладке
    if (activeTab === 'queue') {
      filtered = filtered.filter(app => 
        app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW'
      );
    }

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

  const handlePriorityChange = (applicationId: number, newPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') => {
    // Обновляем в localStorage
    const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    const updatedApplications = storedApplications.map((app: any) => 
      app.id === applicationId 
        ? { ...app, priority: newPriority, updatedAt: new Date().toISOString() }
        : app
    );
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    
    // Обновляем локальное состояние
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, priority: newPriority, updatedAt: new Date().toISOString() }
          : app
      )
    );
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

  const metrics = stats && typeof stats === 'object' ? (
    activeTab === 'queue' ? [
      {
        title: 'Высокий приоритет',
        value: applications.filter(app => app.priority === 'HIGH' || app.priority === 'URGENT').length.toString(),
        change: { value: '+2 за неделю', type: 'positive' as const },
        icon: <i className="ri-fire-line text-4xl text-red-600"></i>
      },
      {
        title: 'Средний приоритет',
        value: applications.filter(app => app.priority === 'MEDIUM').length.toString(),
        change: { value: '+1 за неделю', type: 'positive' as const },
        icon: <i className="ri-time-line text-4xl text-yellow-600"></i>
      },
      {
        title: 'Низкий приоритет',
        value: applications.filter(app => app.priority === 'LOW').length.toString(),
        change: { value: '-2 за неделю', type: 'negative' as const },
        icon: <i className="ri-calendar-line text-4xl text-green-600"></i>
      },
      {
        title: 'Всего в очереди',
        value: (stats.submitted + stats.underReview || 0).toString(),
        change: { value: '+3 за неделю', type: 'positive' as const },
        icon: <i className="ri-file-list-3-line text-4xl text-blue-600"></i>
      }
    ] : [
      {
        title: 'В очереди',
        value: (stats.submitted || 0).toString(),
        change: { value: '+2 за неделю', type: 'positive' as const },
        icon: <i className="ri-file-list-3-line text-4xl text-blue-600"></i>
      },
      {
        title: 'На рассмотрении',
        value: (stats.underReview || 0).toString(),
        change: { value: '+1 за неделю', type: 'positive' as const },
        icon: <i className="ri-time-line text-4xl text-yellow-600"></i>
      },
      {
        title: 'Одобрено сегодня',
        value: (stats.approved || 0).toString(),
        change: { value: '+5 за неделю', type: 'positive' as const },
        icon: <i className="ri-check-line text-4xl text-green-600"></i>
      },
      {
        title: 'Высокий риск',
        value: applications.filter(app => (app as any).riskScore > 50).length.toString(),
        change: { value: '+1 за неделю', type: 'negative' as const },
        icon: <i className="ri-alert-line text-4xl text-red-600"></i>
      }
    ]
  ) : [];


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
      filterable: false,
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
      filterable: true,
      filterType: 'text',
      render: (value: string) => (
        <span className="font-mono text-sm font-medium text-blue-600">{value}</span>
      )
    },
    {
      key: 'applicantName',
      label: 'Заявитель',
      filterable: true,
      filterType: 'text',
      render: (value: string, row: Application) => (
        <div>
          <div className="font-medium text-neutral-900">{row.applicantName || row.formData?.applicant?.fullName || 'Не указан'}</div>
          <div className="text-xs text-gray-500 font-mono">{row.applicantPin || row.formData?.applicant?.pin || 'ПИН не указан'}</div>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Приоритет',
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { value: 'LOW', label: 'Низкий' },
        { value: 'MEDIUM', label: 'Средний' },
        { value: 'HIGH', label: 'Высокий' },
        { value: 'URGENT', label: 'Срочный' }
      ],
      render: (value: string, row: Application) => {
        const priorityMap: { [key: string]: string } = {
          'LOW': 'Низкий',
          'MEDIUM': 'Средний', 
          'HIGH': 'Высокий',
          'URGENT': 'Срочный'
        };
        const priorityColor = {
          'LOW': 'text-green-600 bg-green-100',
          'MEDIUM': 'text-yellow-600 bg-yellow-100',
          'HIGH': 'text-orange-600 bg-orange-100',
          'URGENT': 'text-red-600 bg-red-100'
        };
        return (
          <span className={`text-sm px-2 py-1 rounded ${priorityColor[value as keyof typeof priorityColor] || 'text-gray-600 bg-gray-100'}`}>
            {priorityMap[value] || value}
          </span>
        );
      }
    },
    {
      key: 'riskScore',
      label: 'Риск',
      filterable: true,
      filterType: 'number',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            value > 70 ? 'bg-red-500' : value > 40 ? 'bg-yellow-500' : 'bg-green-500'
          }`}></div>
          <span className={`text-sm font-medium ${
            value > 70 ? 'text-red-600' : value > 40 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {value}%
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Статус',
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { value: 'DRAFT', label: 'Черновик' },
        { value: 'SUBMITTED', label: 'Подана' },
        { value: 'UNDER_REVIEW', label: 'На рассмотрении' },
        { value: 'PENDING_APPROVAL', label: 'На утверждении' },
        { value: 'APPROVED', label: 'Одобрена' },
        { value: 'REJECTED', label: 'Отклонена' },
        { value: 'PAYMENT_PROCESSING', label: 'Обработка платежа' },
        { value: 'PAID', label: 'Выплачено' },
        { value: 'CANCELLED', label: 'Отменено' },
        { value: 'TERMINATED', label: 'Прекращено' }
      ],
      render: (value: string) => {
        const statusMap: { [key: string]: string } = {
          'DRAFT': 'Черновик',
          'SUBMITTED': 'Подана',
          'UNDER_REVIEW': 'На рассмотрении',
          'PENDING_APPROVAL': 'На утверждении',
          'APPROVED': 'Одобрена',
          'REJECTED': 'Отклонена',
          'PAYMENT_PROCESSING': 'Обработка платежа',
          'PAID': 'Выплачено',
          'CANCELLED': 'Отменено',
          'TERMINATED': 'Прекращено'
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
      render: (value: any) => (
        <div className="text-sm">
          <div className="font-medium text-neutral-900">
            {value ? new Date(value).toLocaleDateString('ru-RU') : '-'}
          </div>
          {value && (
            <div className="text-xs text-gray-500">
              {new Date(value).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      )
    },
    ...(activeTab === 'queue' ? [{
      key: 'priorityEdit',
      label: 'Приоритет',
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { value: 'LOW', label: 'Низкий' },
        { value: 'MEDIUM', label: 'Средний' },
        { value: 'HIGH', label: 'Высокий' },
        { value: 'URGENT', label: 'Срочный' }
      ],
      render: (value: string, row: Application) => {
        const priorityMap: { [key: string]: { label: string; color: string } } = {
          'LOW': { label: 'Низкий', color: 'text-green-600 bg-green-100' },
          'MEDIUM': { label: 'Средний', color: 'text-yellow-600 bg-yellow-100' },
          'HIGH': { label: 'Высокий', color: 'text-orange-600 bg-orange-100' },
          'URGENT': { label: 'Срочный', color: 'text-red-600 bg-red-100' }
        };
        return (
          <select 
            value={value}
            onChange={(e) => handlePriorityChange(parseInt(row.id), e.target.value as any)}
            className={`text-sm border border-neutral-300 rounded px-2 py-1 ${priorityMap[value as keyof typeof priorityMap]?.color || 'text-gray-600 bg-gray-100'}`}
          >
            <option value="LOW">Низкий</option>
            <option value="MEDIUM">Средний</option>
            <option value="HIGH">Высокий</option>
            <option value="URGENT">Срочный</option>
          </select>
        );
      }
    }] : []),
    {
      key: 'actions',
      label: 'Действия',
      filterable: false,
      render: (value: any, row: Application) => (
        <div className="flex flex-wrap gap-1">
          {row.status === 'SUBMITTED' && (
            <button 
              onClick={() => handleStatusUpdate(row.id, 'UNDER_REVIEW')}
              className="btn-primary text-xs px-2 py-1"
              title="Взять заявку в работу"
            >
              Взять в работу
            </button>
          )}
          {row.status === 'UNDER_REVIEW' && (
            <button 
              onClick={() => handleDecisionClick(row.id)}
              className="btn-danger text-xs px-2 py-1"
              title="Принять решение по заявке"
            >
              Решение
            </button>
          )}
          {row.status === 'DRAFT' && (
            <button 
              onClick={() => handleStatusUpdate(row.id, 'SUBMITTED')}
              className="btn-secondary text-xs px-2 py-1"
              title="Отправить заявку на рассмотрение"
            >
              Отправить
            </button>
          )}
          <button 
            onClick={() => handleViewDetails(row)}
            className="btn-secondary text-xs px-2 py-1"
            title="Просмотреть детали заявки"
          >
            Детали
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-neutral-900">
              {activeTab === 'all' ? 'Все заявки' : 'Очередь заявок'}
            </h3>
            <p className="text-xs md:text-sm text-neutral-600 mt-1">
              {activeTab === 'all' 
                ? 'Управление всеми заявлениями на семейные пособия' 
                : 'Управление заявками в очереди на рассмотрение'
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Вкладки */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Все заявки
              </button>
              <button
                onClick={() => setActiveTab('queue')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'queue'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Очередь
              </button>
            </div>
          </div>
        </div>
        


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
          filterable={true}
          sortable={true}
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
