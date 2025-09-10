'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import MetricCard from '@/components/ui/MetricCard';
import ApplicationDetailsModal from '@/components/ui/ApplicationDetailsModal';
import DecisionModal from '@/components/ui/DecisionModal';
import TestDataLoader from '@/components/ui/TestDataLoader';
import { applicationService } from '@/lib/api/applicationService';
import { Application, ApplicationStatus, ApplicationFilters } from '@/lib/types';

export default function QueuePage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ApplicationFilters>({
    status: ['SUBMITTED', 'UNDER_REVIEW']
  });
  const [stats, setStats] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [currentApplicationId, setCurrentApplicationId] = useState<number>(0);

  useEffect(() => {
    loadApplications();
    loadStats();
  }, [filters]);

  // Слушаем события отправки новых заявок
  useEffect(() => {
    const handleApplicationSubmitted = () => {
      loadApplications();
      loadStats();
    };

    window.addEventListener('applicationSubmitted', handleApplicationSubmitted);
    
    return () => {
      window.removeEventListener('applicationSubmitted', handleApplicationSubmitted);
    };
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      
      // Загружаем заявки из localStorage для демонстрации
      const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      
      // Фильтруем заявки по статусу
      let filteredApplications = storedApplications;
      if (filters.status && filters.status.length > 0) {
        filteredApplications = storedApplications.filter((app: any) => 
          filters.status!.includes(app.status)
        );
      }
      
      // Сортируем по дате создания (новые сверху)
      filteredApplications.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setApplications(filteredApplications);
      
      // Также пытаемся загрузить с сервера (если API доступен)
      try {
        const response = await applicationService.getApplications(filters, 1, 50);
        if (response.success && response.data) {
          // Объединяем данные с сервера с локальными данными
          const serverApplications = response.data.data;
          const combinedApplications = [...filteredApplications, ...serverApplications];
          setApplications(combinedApplications);
        }
      } catch (serverError) {
        console.log('Сервер недоступен, используем только локальные данные');
      }
      
    } catch (error) {
      console.error('Ошибка при загрузке заявлений:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Рассчитываем статистику из локальных данных
      const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      
      const stats = {
        total: storedApplications.length,
        submitted: storedApplications.filter((app: any) => app.status === 'SUBMITTED').length,
        underReview: storedApplications.filter((app: any) => app.status === 'UNDER_REVIEW').length,
        approved: storedApplications.filter((app: any) => app.status === 'APPROVED').length,
        rejected: storedApplications.filter((app: any) => app.status === 'REJECTED').length,
        pending: storedApplications.filter((app: any) => app.status === 'PENDING').length
      };
      
      setStats(stats);
      
      // Также пытаемся загрузить статистику с сервера
      try {
        const response = await applicationService.getApplicationStats();
        if (response.success && response.data) {
          // Объединяем статистику
          setStats({
            total: stats.total + (response.data.total || 0),
            submitted: stats.submitted + (response.data.submitted || 0),
            underReview: stats.underReview + (response.data.underReview || 0),
            approved: stats.approved + (response.data.approved || 0),
            rejected: stats.rejected + (response.data.rejected || 0),
            pending: stats.pending + (response.data.pending || 0)
          });
        }
      } catch (serverError) {
        console.log('Сервер недоступен, используем только локальную статистику');
      }
      
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error);
    }
  };

  const handleStatusUpdate = async (applicationId: number, newStatus: ApplicationStatus) => {
    try {
      // Обновляем в localStorage
      const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const updatedApplications = storedApplications.map((app: any) => 
        app.id === applicationId 
          ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
          : app
      );
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
      
      // Обновляем локальное состояние
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
            : app
        )
      );
      
      // Обновляем статистику
      loadStats();
      
      // Также пытаемся обновить на сервере
      try {
        const response = await applicationService.updateApplicationStatus(
          applicationId, 
          newStatus, 
          1 // userId
        );
        console.log('Статус обновлен на сервере:', response);
      } catch (serverError) {
        console.log('Сервер недоступен, статус обновлен только локально');
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

  const handleDecisionClick = (applicationId: number) => {
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

  const metrics = stats && typeof stats === 'object' ? [
    {
      title: 'Всего в очереди',
      value: ((stats.submitted || 0) + (stats.underReview || 0)).toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: <i className="ri-file-list-3-line text-4xl text-blue-600"></i>
    },
    {
      title: 'Высокий приоритет',
      value: applications.filter(app => (app as any).priority === 'HIGH' || (app as any).priority === 'URGENT').length.toString(),
      change: '+5%',
      changeType: 'positive' as const,
      icon: <i className="ri-alarm-warning-line text-4xl text-red-600"></i>
    },
    {
      title: 'Средний приоритет',
      value: applications.filter(app => (app as any).priority === 'MEDIUM').length.toString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: <i className="ri-time-line text-4xl text-yellow-600"></i>
    },
    {
      title: 'Низкий приоритет',
      value: applications.filter(app => (app as any).priority === 'LOW').length.toString(),
      change: '-2%',
      changeType: 'negative' as const,
      icon: <i className="ri-calendar-line text-4xl text-green-600"></i>
    }
  ] : [];

  const columns = [
    {
      key: 'applicationNumber',
      label: '№ заявки',
      render: (value: string) => (
        <span className="font-mono text-sm font-medium text-blue-600">{value}</span>
      )
    },
    {
      key: 'applicant.fullName',
      label: 'Заявитель',
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
          <select 
            value={value}
            onChange={(e) => handlePriorityChange(row.id, e.target.value as any)}
            className={`text-sm border border-neutral-300 rounded px-2 py-1 ${priorityColor[value as keyof typeof priorityColor] || 'text-gray-600 bg-gray-100'}`}
          >
            <option value="LOW">Низкий</option>
            <option value="MEDIUM">Средний</option>
            <option value="HIGH">Высокий</option>
            <option value="URGENT">Срочный</option>
          </select>
        );
      }
    },
    {
      key: 'riskScore',
      label: 'Риск',
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
    {
      key: 'actions',
      label: 'Действия',
      render: (value: any, row: Application) => (
        <div className="flex space-x-2">
          {row.status === 'SUBMITTED' && (
            <button 
              onClick={() => handleStatusUpdate(row.id, 'UNDER_REVIEW')}
              className="btn-primary text-sm px-3 py-1"
              title="Взять заявку в работу"
            >
              <i className="ri-play-line mr-1"></i>
              Взять в работу
            </button>
          )}
          {row.status === 'UNDER_REVIEW' && (
            <button 
              onClick={() => handleDecisionClick(row.id)}
              className="btn-danger text-sm px-3 py-1"
              title="Принять решение по заявке"
            >
              <i className="ri-check-line mr-1"></i>
              Решение
            </button>
          )}
          <button 
            onClick={() => handleViewDetails(row)}
            className="btn-secondary text-sm px-3 py-1"
            title="Просмотреть детали заявки"
          >
            <i className="ri-eye-line mr-1"></i>
            Детали
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Очередь заявок</h1>
          <p className="text-neutral-600 mt-1">Управление очередью заявлений на семейные пособия</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={loadApplications}
            className="btn-secondary"
            disabled={loading}
          >
            <i className={`ri-refresh-line mr-2 ${loading ? 'animate-spin' : ''}`}></i>
            {loading ? 'Обновление...' : 'Обновить очередь'}
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('applications');
              loadApplications();
            }}
            className="btn-danger"
            title="Очистить все заявки (только для демонстрации)"
          >
            <i className="ri-delete-bin-line mr-2"></i>
            Очистить
          </button>
        </div>
      </div>

      {/* Test Data Loader */}
      <TestDataLoader onDataLoaded={loadApplications} />

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

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Фильтры и поиск</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Статус заявки
            </label>
            <select 
              value={filters.status?.join(',') || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                status: e.target.value ? e.target.value.split(',') as ApplicationStatus[] : undefined
              }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все статусы</option>
              <option value="submitted">Поданы</option>
              <option value="under_review">На рассмотрении</option>
              <option value="submitted,under_review">В очереди</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Поиск по заявителю
            </label>
            <input
              type="text"
              placeholder="Введите имя заявителя..."
              value={filters.search || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Дата подачи
            </label>
            <input
              type="date"
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                dateFrom: e.target.value ? new Date(e.target.value) : undefined 
              }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Заявки в очереди</h3>
          <p className="text-neutral-600 mt-1">Упорядочены по приоритету и времени подачи</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <DataTable
            data={applications}
            columns={columns}
            searchable={true}
            sortable={true}
            emptyMessage="Нет заявлений в очереди"
          />
        )}
      </div>

      {/* Queue Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <button 
              onClick={() => {
                const nextApp = applications.find(app => app.status === 'submitted');
                if (nextApp) {
                  handleStatusUpdate(nextApp.id, 'under_review');
                }
              }}
              className="w-full btn-primary text-left"
            >
              <i className="ri-play-circle-line mr-2"></i>
              Начать обработку следующей заявки
            </button>
            <button className="w-full btn-secondary text-left">
              <i className="ri-pause-circle-line mr-2"></i>
              Приостановить обработку
            </button>
            <button 
              onClick={loadApplications}
              className="w-full btn-warning text-left"
            >
              <i className="ri-refresh-line mr-2"></i>
              Пересортировать очередь
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Статистика обработки</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Обработано сегодня</span>
              <span className="font-semibold text-green-600">
                {stats?.approved || 0} заявок
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Среднее время обработки</span>
              <span className="font-semibold text-blue-600">2.5 часа</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Заявок в работе</span>
              <span className="font-semibold text-orange-600">
                {applications.filter(app => app.status === 'under_review').length} заявок
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Прогноз завершения</span>
              <span className="font-semibold text-purple-600">18:30</span>
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
      />

      <DecisionModal
        isOpen={isDecisionModalOpen}
        onClose={handleCloseDecisionModal}
        applicationId={currentApplicationId}
        onSaveDecision={handleSaveDecision}
      />
    </div>
  );
}