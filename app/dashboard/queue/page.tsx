'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import MetricCard from '@/components/ui/MetricCard';
import ApplicationDetailsModal from '@/components/ui/ApplicationDetailsModal';
import DecisionModal from '@/components/ui/DecisionModal';
import { applicationService } from '@/lib/api/applicationService';
import { Application, ApplicationStatus, ApplicationFilters } from '@/lib/types';

export default function QueuePage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ApplicationFilters>({
    status: ['submitted', 'under_review']
  });
  const [stats, setStats] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [currentApplicationId, setCurrentApplicationId] = useState<string>('');

  useEffect(() => {
    loadApplications();
    loadStats();
  }, [filters]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getApplications(filters, 1, 50);
      if (response.success && response.data) {
        setApplications(response.data.data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке заявлений:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await applicationService.getApplicationStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error);
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
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        );
        loadStats(); // Обновляем статистику
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
    }
  };

  const handlePriorityChange = (applicationId: string, newPriority: 'low' | 'medium' | 'high' | 'urgent') => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, priority: newPriority }
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

  const metrics = stats ? [
    {
      title: 'Всего в очереди',
      value: (stats.byStatus.submitted + stats.byStatus.under_review).toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: <i className="ri-file-list-3-line text-4xl text-blue-600"></i>
    },
    {
      title: 'Высокий приоритет',
      value: applications.filter(app => app.priority === 'high' || app.priority === 'urgent').length.toString(),
      change: '+5%',
      changeType: 'positive' as const,
      icon: <i className="ri-alarm-warning-line text-4xl text-red-600"></i>
    },
    {
      title: 'Средний приоритет',
      value: applications.filter(app => app.priority === 'medium').length.toString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: <i className="ri-time-line text-4xl text-yellow-600"></i>
    },
    {
      title: 'Низкий приоритет',
      value: applications.filter(app => app.priority === 'low').length.toString(),
      change: '-2%',
      changeType: 'negative' as const,
      icon: <i className="ri-calendar-line text-4xl text-green-600"></i>
    }
  ] : [];

  const columns = [
    {
      key: 'id',
      label: '№ заявки',
      render: (value: string) => (
        <span className="font-mono text-sm font-medium text-blue-600">{value}</span>
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
      render: (value: string, row: Application) => (
        <select 
          value={value}
          onChange={(e) => handlePriorityChange(row.id, e.target.value as any)}
          className="text-sm border border-neutral-300 rounded px-2 py-1"
        >
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
          <option value="urgent">Срочный</option>
        </select>
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
          'rejected': 'Отклонена'
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
          >
            <i className="ri-refresh-line mr-2"></i>
            Обновить очередь
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
                {stats?.byStatus.approved || 0} заявок
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