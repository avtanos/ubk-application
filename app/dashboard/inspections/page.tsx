'use client';

import { useState, useEffect } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import InspectionDetailsModal from '@/components/ui/InspectionDetailsModal';
import InspectionCalendar from '@/components/ui/InspectionCalendar';
import { Inspection, InspectionStatus, InspectionType, Priority, Application } from '@/lib/types';
import inspectionService from '@/lib/api/inspectionService';
import { mockApplications, mockInspections, mockInspectionStats } from '@/lib/mockData';

export default function InspectionsPage() {
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filters, setFilters] = useState({
    status: [] as InspectionStatus[],
    type: [] as InspectionType[],
    priority: [] as Priority[],
    search: ''
  });

  const [metrics, setMetrics] = useState([
    {
      title: 'Назначено',
      value: '0',
      change: '+0%',
      changeType: 'positive' as const,
      icon: <i className="ri-calendar-line"></i>
    },
    {
      title: 'В процессе',
      value: '0',
      change: '+0%',
      changeType: 'positive' as const,
      icon: <i className="ri-car-line"></i>
    },
    {
      title: 'Завершено',
      value: '0',
      change: '+0%',
      changeType: 'positive' as const,
      icon: <i className="ri-check-line"></i>
    },
    {
      title: 'Отменено',
      value: '0',
      change: '+0%',
      changeType: 'negative' as const,
      icon: <i className="ri-close-line"></i>
    }
  ]);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadInspections();
    loadMetrics();
  }, []);

  const loadInspections = async () => {
    try {
      setLoading(true);
      // Используем тестовые данные вместо API
      setInspections(mockInspections);
    } catch (error) {
      console.error('Ошибка загрузки проверок:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      // Используем тестовые данные вместо API
      setMetrics([
        {
          title: 'Назначено',
          value: mockInspectionStats.assigned.toString(),
          change: '+0%',
          changeType: 'positive' as const,
          icon: <i className="ri-calendar-line"></i>
        },
        {
          title: 'В процессе',
          value: mockInspectionStats.inProgress.toString(),
          change: '+0%',
          changeType: 'positive' as const,
          icon: <i className="ri-car-line"></i>
        },
        {
          title: 'Завершено',
          value: mockInspectionStats.completed.toString(),
          change: '+0%',
          changeType: 'positive' as const,
          icon: <i className="ri-check-line"></i>
        },
        {
          title: 'Отменено',
          value: mockInspectionStats.cancelled.toString(),
          change: '+0%',
          changeType: 'negative' as const,
          icon: <i className="ri-close-line"></i>
        }
      ]);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  // Обработчики событий
  const handleViewInspection = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setShowModal(true);
  };

  const handleStatusChange = async (inspectionId: number, status: InspectionStatus) => {
    try {
      await inspectionService.updateInspectionStatus(inspectionId, status);
      await loadInspections();
      await loadMetrics();
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const handleStartInspection = async (inspectionId: number) => {
    try {
      // Обновляем статус в тестовых данных
      setInspections(prev => prev.map(inspection => 
        inspection.id === inspectionId 
          ? { ...inspection, status: 'IN_PROGRESS' as const, updatedAt: new Date().toISOString() }
          : inspection
      ));
      await loadMetrics();
    } catch (error) {
      console.error('Ошибка начала проверки:', error);
    }
  };

  const handleCompleteInspection = async (inspectionId: number) => {
    try {
      // Обновляем статус в тестовых данных
      setInspections(prev => prev.map(inspection => 
        inspection.id === inspectionId 
          ? { ...inspection, status: 'COMPLETED' as const, updatedAt: new Date().toISOString() }
          : inspection
      ));
      await loadMetrics();
    } catch (error) {
      console.error('Ошибка завершения проверки:', error);
    }
  };

  const handleCancelInspection = async (inspectionId: number) => {
    try {
      // Обновляем статус в тестовых данных
      setInspections(prev => prev.map(inspection => 
        inspection.id === inspectionId 
          ? { ...inspection, status: 'CANCELLED' as const, updatedAt: new Date().toISOString() }
          : inspection
      ));
      await loadMetrics();
    } catch (error) {
      console.error('Ошибка отмены проверки:', error);
    }
  };


  const getStatusColor = (status: InspectionStatus) => {
    switch (status) {
      case 'ASSIGNED': return 'info';
      case 'PREPARATION': return 'warning';
      case 'IN_PROGRESS': return 'warning';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      case 'REPEAT': return 'info';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status: InspectionStatus) => {
    switch (status) {
      case 'ASSIGNED': return 'Назначена';
      case 'PREPARATION': return 'Подготовка';
      case 'IN_PROGRESS': return 'В процессе';
      case 'COMPLETED': return 'Завершена';
      case 'CANCELLED': return 'Отменена';
      case 'REPEAT': return 'Повторная';
      default: return status;
    }
  };

  const getTypeLabel = (type: InspectionType) => {
    switch (type) {
      case 'PRIMARY': return 'Первичная проверка';
      case 'REPEAT': return 'Повторная проверка';
      case 'COMPLAINT': return 'Проверка по жалобе';
      default: return type;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      case 'URGENT': return 'error';
      default: return 'neutral';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'LOW': return 'Низкий';
      case 'MEDIUM': return 'Средний';
      case 'HIGH': return 'Высокий';
      case 'URGENT': return 'Срочный';
      default: return priority;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Выездные проверки</h1>
          <p className="text-neutral-600 mt-1">Планирование и управление выездными проверками</p>
        </div>
        <div className="flex space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-list-line mr-2"></i>
              Список
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-calendar-line mr-2"></i>
              Календарь
            </button>
          </div>
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

      {/* Main Content */}
      {viewMode === 'list' ? (
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Список проверок</h3>
            <p className="text-neutral-600 mt-1">Упорядочены по дате и приоритету</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {inspections.length === 0 ? (
                <div className="text-center py-8">
                  <i className="ri-search-line text-4xl text-neutral-400 mb-4"></i>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Проверки не найдены
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    Нет проверок, соответствующих выбранным фильтрам
                  </p>
                </div>
              ) : (
                inspections.map((inspection) => (
                  <div key={inspection.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-neutral-900">
                            {inspection.application?.applicant?.fullName || 'Не указано'}
                          </h4>
                          <StatusBadge 
                            status={getStatusColor(inspection.status)}
                            text={getStatusLabel(inspection.status)}
                          />
                          <StatusBadge 
                            status={getPriorityColor(inspection.priority)}
                            text={getPriorityLabel(inspection.priority)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-neutral-600">ID проверки:</span>
                            <p className="font-mono text-blue-600">{inspection.inspectionNumber}</p>
                          </div>
                          <div>
                            <span className="text-neutral-600">Адрес:</span>
                            <p className="text-neutral-900">{inspection.address}</p>
                          </div>
                          <div>
                            <span className="text-neutral-600">Дата и время:</span>
                            <p className="text-neutral-900">
                              {inspection.scheduledDate ? new Date(inspection.scheduledDate).toLocaleDateString('ru-RU') : 'Не указана'} 
                              {inspection.scheduledTime && ` в ${inspection.scheduledTime}`}
                            </p>
                          </div>
                          <div>
                            <span className="text-neutral-600">Инспектор:</span>
                            <p className="text-neutral-900">{inspection.inspectorName}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <span className="text-neutral-600 text-sm">Тип проверки:</span>
                          <span className="ml-2 text-sm font-medium text-neutral-900">
                            {getTypeLabel(inspection.type)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button 
                          onClick={() => handleViewInspection(inspection)}
                          className="btn-primary text-sm"
                        >
                          <i className="ri-eye-line mr-1"></i>
                          Просмотр
                        </button>
                        {inspection.status === 'ASSIGNED' && (
                          <button 
                            onClick={() => handleStartInspection(inspection.id)}
                            className="btn-success text-sm"
                          >
                            <i className="ri-play-line mr-1"></i>
                            Начать
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <InspectionCalendar 
          inspections={inspections}
          onInspectionClick={handleViewInspection}
        />
      )}


      {/* Inspection Details Modal */}
      <InspectionDetailsModal
        inspection={selectedInspection}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onStatusChange={handleStatusChange}
        onStartInspection={handleStartInspection}
        onCompleteInspection={handleCompleteInspection}
        onCancelInspection={handleCancelInspection}
        onViewReport={(inspectionId) => {
          const inspection = inspections.find(i => i.id === inspectionId);
          if (inspection) {
            setSelectedInspection(inspection);
            setShowModal(true);
          }
        }}
        onEditInspection={(inspectionId) => {
          console.log('Edit inspection:', inspectionId);
        }}
      />

    </div>
  );
}
