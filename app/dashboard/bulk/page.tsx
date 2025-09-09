'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';

export default function BulkPage() {
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);

  const metrics = [
    {
      title: 'Готово к обработке',
      value: '156',
      change: '+8%',
      changeType: 'positive' as const,
      icon: <i className="ri-file-copy-line"></i>
    },
    {
      title: 'В процессе',
      value: '23',
      change: '+3%',
      changeType: 'positive' as const,
      icon: <i className="ri-loader-line"></i>
    },
    {
      title: 'Обработано',
      value: '1,247',
      change: '+15%',
      changeType: 'positive' as const,
      icon: <i className="ri-check-line"></i>
    },
    {
      title: 'Ошибки',
      value: '12',
      change: '-2%',
      changeType: 'negative' as const,
      icon: <i className="ri-error-warning-line"></i>
    }
  ];

  const bulkOperations = [
    {
      id: 'BULK-001',
      name: 'Массовое одобрение заявок',
      type: 'approval',
      status: 'completed',
      applicationsCount: 45,
      processedCount: 45,
      errorCount: 0,
      startTime: '2024-01-15 09:00',
      endTime: '2024-01-15 09:15',
      operator: 'Нурбек Жумабеков'
    },
    {
      id: 'BULK-002',
      name: 'Обновление статусов',
      type: 'status_update',
      status: 'in_progress',
      applicationsCount: 78,
      processedCount: 34,
      errorCount: 2,
      startTime: '2024-01-15 10:30',
      endTime: null,
      operator: 'Айгуль Токтосунова'
    },
    {
      id: 'BULK-003',
      name: 'Экспорт данных',
      type: 'export',
      status: 'scheduled',
      applicationsCount: 156,
      processedCount: 0,
      errorCount: 0,
      startTime: '2024-01-15 14:00',
      endTime: null,
      operator: 'Нурбек Жумабеков'
    },
    {
      id: 'BULK-004',
      name: 'Отправка уведомлений',
      type: 'notification',
      status: 'failed',
      applicationsCount: 89,
      processedCount: 23,
      errorCount: 66,
      startTime: '2024-01-15 11:00',
      endTime: '2024-01-15 11:05',
      operator: 'Айгуль Токтосунова'
    }
  ];

  const applications = [
    {
      id: 'APP-001',
      applicant: 'Айбек Кыдыров',
      type: 'Первичная заявка',
      status: 'pending',
      selected: false
    },
    {
      id: 'APP-002',
      applicant: 'Нургуль Асанова',
      type: 'Дополнительные документы',
      status: 'pending',
      selected: false
    },
    {
      id: 'APP-003',
      applicant: 'Марат Беков',
      type: 'Первичная заявка',
      status: 'pending',
      selected: false
    },
    {
      id: 'APP-004',
      applicant: 'Айгуль Токтосунова',
      type: 'Пересмотр решения',
      status: 'pending',
      selected: false
    },
    {
      id: 'APP-005',
      applicant: 'Эркин Садыков',
      type: 'Первичная заявка',
      status: 'pending',
      selected: false
    }
  ];

  const handleSelectApplication = (appId: string) => {
    setSelectedApplications(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map(app => app.id));
    }
  };

  const handleBulkOperation = (operation: any) => {
    setSelectedOperation(operation);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Массовая обработка</h1>
          <p className="text-neutral-600 mt-1">Выполнение операций с множественными заявками</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <i className="ri-history-line mr-2"></i>
            История операций
          </button>
          <button className="btn-primary">
            <i className="ri-settings-3-line mr-2"></i>
            Настройки
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

      {/* Bulk Operations History */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">История массовых операций</h3>
          <p className="text-neutral-600 mt-1">Последние выполненные операции</p>
        </div>
        
        <div className="space-y-4">
          {bulkOperations.map((operation) => (
            <div key={operation.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-neutral-900">{operation.name}</h4>
                    <StatusBadge 
                      status={
                        operation.status === 'completed' ? 'success' :
                        operation.status === 'in_progress' ? 'warning' :
                        operation.status === 'scheduled' ? 'info' : 'error'
                      }
                      text={
                        operation.status === 'completed' ? 'Завершено' :
                        operation.status === 'in_progress' ? 'В процессе' :
                        operation.status === 'scheduled' ? 'Запланировано' : 'Ошибка'
                      }
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">ID операции:</span>
                      <p className="font-mono text-blue-600">{operation.id}</p>
                    </div>
                    <div>
                      <span className="text-neutral-600">Заявок:</span>
                      <p className="text-neutral-900">{operation.processedCount}/{operation.applicationsCount}</p>
                    </div>
                    <div>
                      <span className="text-neutral-600">Ошибок:</span>
                      <p className="text-neutral-900">{operation.errorCount}</p>
                    </div>
                    <div>
                      <span className="text-neutral-600">Оператор:</span>
                      <p className="text-neutral-900">{operation.operator}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-neutral-600 text-sm">Время выполнения:</span>
                    <span className="ml-2 text-sm font-medium text-neutral-900">
                      {operation.startTime} - {operation.endTime || 'В процессе'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {operation.status === 'in_progress' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-neutral-600 mb-1">
                        <span>Прогресс</span>
                        <span>{Math.round((operation.processedCount / operation.applicationsCount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${(operation.processedCount / operation.applicationsCount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button 
                    onClick={() => handleBulkOperation(operation)}
                    className="btn-primary text-sm"
                  >
                    <i className="ri-eye-line mr-1"></i>
                    Детали
                  </button>
                  {operation.status === 'failed' && (
                    <button className="btn-warning text-sm">
                      <i className="ri-refresh-line mr-1"></i>
                      Повторить
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Applications Selection */}
      <div className="card">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Выбор заявок для обработки</h3>
              <p className="text-neutral-600 mt-1">Выберите заявки для массовых операций</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-neutral-600">
                Выбрано: {selectedApplications.length} из {applications.length}
              </span>
              <button 
                onClick={handleSelectAll}
                className="btn-secondary text-sm"
              >
                {selectedApplications.length === applications.length ? 'Снять все' : 'Выбрать все'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50">
              <input
                type="checkbox"
                checked={selectedApplications.includes(app.id)}
                onChange={() => handleSelectApplication(app.id)}
                className="rounded"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm text-blue-600">{app.id}</span>
                  <span className="font-medium">{app.applicant}</span>
                  <span className="text-sm text-neutral-600">{app.type}</span>
                  <StatusBadge status="warning" text="В ожидании" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Массовые операции</h3>
          <div className="space-y-3">
            <button 
              className="w-full btn-success text-left"
              disabled={selectedApplications.length === 0}
            >
              <i className="ri-check-line mr-2"></i>
              Одобрить выбранные заявки
            </button>
            <button 
              className="w-full btn-warning text-left"
              disabled={selectedApplications.length === 0}
            >
              <i className="ri-edit-line mr-2"></i>
              Требуют доработки
            </button>
            <button 
              className="w-full btn-error text-left"
              disabled={selectedApplications.length === 0}
            >
              <i className="ri-close-line mr-2"></i>
              Отклонить выбранные заявки
            </button>
            <button 
              className="w-full btn-secondary text-left"
              disabled={selectedApplications.length === 0}
            >
              <i className="ri-download-line mr-2"></i>
              Экспорт выбранных заявок
            </button>
            <button 
              className="w-full btn-info text-left"
              disabled={selectedApplications.length === 0}
            >
              <i className="ri-notification-line mr-2"></i>
              Отправить уведомления
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Статистика операций</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Операций сегодня</span>
              <span className="font-semibold text-blue-600">8 операций</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Обработано заявок</span>
              <span className="font-semibold text-green-600">1,247 заявок</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Успешность</span>
              <span className="font-semibold text-green-600">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Среднее время</span>
              <span className="font-semibold text-purple-600">12 минут</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operation Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Детали операции"
        size="large"
      >
        {selectedOperation && (
          <div className="space-y-6">
            {/* Operation Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Информация об операции</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">ID операции:</span>
                    <span className="font-mono text-blue-600">{selectedOperation.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Название:</span>
                    <span>{selectedOperation.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Оператор:</span>
                    <span>{selectedOperation.operator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Время начала:</span>
                    <span>{selectedOperation.startTime}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Результаты</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Всего заявок:</span>
                    <span>{selectedOperation.applicationsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Обработано:</span>
                    <span className="text-green-600">{selectedOperation.processedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Ошибок:</span>
                    <span className="text-red-600">{selectedOperation.errorCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Статус:</span>
                    <StatusBadge 
                      status={
                        selectedOperation.status === 'completed' ? 'success' :
                        selectedOperation.status === 'in_progress' ? 'warning' :
                        selectedOperation.status === 'scheduled' ? 'info' : 'error'
                      }
                      text={
                        selectedOperation.status === 'completed' ? 'Завершено' :
                        selectedOperation.status === 'in_progress' ? 'В процессе' :
                        selectedOperation.status === 'scheduled' ? 'Запланировано' : 'Ошибка'
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            {selectedOperation.status === 'in_progress' && (
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Прогресс выполнения</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс</span>
                    <span>{Math.round((selectedOperation.processedCount / selectedOperation.applicationsCount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-blue-500"
                      style={{ width: `${(selectedOperation.processedCount / selectedOperation.applicationsCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Details */}
            {selectedOperation.errorCount > 0 && (
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Ошибки выполнения</h3>
                <div className="space-y-2">
                  {['APP-001: Недостаточно документов', 'APP-003: Некорректные данные'].map((error, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <i className="ri-error-warning-line text-red-600"></i>
                        <span className="text-sm text-red-800">{error}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-neutral-200">
              {selectedOperation.status === 'failed' && (
                <button className="btn-warning">
                  <i className="ri-refresh-line mr-2"></i>
                  Повторить операцию
                </button>
              )}
              <button className="btn-secondary">
                <i className="ri-download-line mr-2"></i>
                Экспорт логов
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
