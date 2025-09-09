'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';

export default function InspectionsPage() {
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const metrics = [
    {
      title: 'Запланировано',
      value: '18',
      change: '+5%',
      changeType: 'positive' as const,
      icon: <i className="ri-calendar-line"></i>
    },
    {
      title: 'В процессе',
      value: '6',
      change: '+2%',
      changeType: 'positive' as const,
      icon: <i className="ri-car-line"></i>
    },
    {
      title: 'Завершено',
      value: '142',
      change: '+12%',
      changeType: 'positive' as const,
      icon: <i className="ri-check-line"></i>
    },
    {
      title: 'Отменено',
      value: '8',
      change: '-1%',
      changeType: 'negative' as const,
      icon: <i className="ri-close-line"></i>
    }
  ];

  const inspections = [
    {
      id: 'INS-001',
      applicant: 'Айбек Кыдыров',
      address: 'ул. Чуй, 123, Бишкек',
      scheduledDate: '2024-01-16',
      scheduledTime: '10:00',
      status: 'scheduled',
      inspector: 'Нурбек Жумабеков',
      type: 'Первичная проверка',
      priority: 'high'
    },
    {
      id: 'INS-002',
      applicant: 'Нургуль Асанова',
      address: 'ул. Московская, 45, Бишкек',
      scheduledDate: '2024-01-16',
      scheduledTime: '14:00',
      status: 'in_progress',
      inspector: 'Айгуль Токтосунова',
      type: 'Повторная проверка',
      priority: 'medium'
    },
    {
      id: 'INS-003',
      applicant: 'Марат Беков',
      address: 'ул. Ленина, 78, Бишкек',
      scheduledDate: '2024-01-17',
      scheduledTime: '09:00',
      status: 'scheduled',
      inspector: 'Нурбек Жумабеков',
      type: 'Первичная проверка',
      priority: 'high'
    },
    {
      id: 'INS-004',
      applicant: 'Айгуль Токтосунова',
      address: 'ул. Ибраимова, 12, Бишкек',
      scheduledDate: '2024-01-15',
      scheduledTime: '16:00',
      status: 'completed',
      inspector: 'Айгуль Токтосунова',
      type: 'Первичная проверка',
      priority: 'low'
    },
    {
      id: 'INS-005',
      applicant: 'Эркин Садыков',
      address: 'ул. Ахунбаева, 34, Бишкек',
      scheduledDate: '2024-01-18',
      scheduledTime: '11:00',
      status: 'scheduled',
      inspector: 'Нурбек Жумабеков',
      type: 'Повторная проверка',
      priority: 'medium'
    }
  ];

  const handleViewInspection = (inspection: any) => {
    setSelectedInspection(inspection);
    setShowModal(true);
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
          <button className="btn-secondary">
            <i className="ri-calendar-line mr-2"></i>
            Календарь проверок
          </button>
          <button className="btn-primary">
            <i className="ri-add-line mr-2"></i>
            Запланировать проверку
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

      {/* Inspections List */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Список проверок</h3>
          <p className="text-neutral-600 mt-1">Упорядочены по дате и приоритету</p>
        </div>
        
        <div className="space-y-4">
          {inspections.map((inspection) => (
            <div key={inspection.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-neutral-900">{inspection.applicant}</h4>
                    <StatusBadge 
                      status={
                        inspection.status === 'scheduled' ? 'info' :
                        inspection.status === 'in_progress' ? 'warning' :
                        inspection.status === 'completed' ? 'success' : 'error'
                      }
                      text={
                        inspection.status === 'scheduled' ? 'Запланировано' :
                        inspection.status === 'in_progress' ? 'В процессе' :
                        inspection.status === 'completed' ? 'Завершено' : 'Отменено'
                      }
                    />
                    <StatusBadge 
                      status={inspection.priority === 'high' ? 'error' : inspection.priority === 'medium' ? 'warning' : 'success'}
                      text={inspection.priority === 'high' ? 'Высокий' : inspection.priority === 'medium' ? 'Средний' : 'Низкий'}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">ID проверки:</span>
                      <p className="font-mono text-blue-600">{inspection.id}</p>
                    </div>
                    <div>
                      <span className="text-neutral-600">Адрес:</span>
                      <p className="text-neutral-900">{inspection.address}</p>
                    </div>
                    <div>
                      <span className="text-neutral-600">Дата и время:</span>
                      <p className="text-neutral-900">{inspection.scheduledDate} в {inspection.scheduledTime}</p>
                    </div>
                    <div>
                      <span className="text-neutral-600">Инспектор:</span>
                      <p className="text-neutral-900">{inspection.inspector}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-neutral-600 text-sm">Тип проверки:</span>
                    <span className="ml-2 text-sm font-medium text-neutral-900">{inspection.type}</span>
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
                  {inspection.status === 'scheduled' && (
                    <button className="btn-success text-sm">
                      <i className="ri-play-line mr-1"></i>
                      Начать
                    </button>
                  )}
                  {inspection.status === 'in_progress' && (
                    <button className="btn-warning text-sm">
                      <i className="ri-pause-line mr-1"></i>
                      Приостановить
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
            <button className="w-full btn-primary text-left">
              <i className="ri-calendar-check-line mr-2"></i>
              Запланировать новую проверку
            </button>
            <button className="w-full btn-secondary text-left">
              <i className="ri-route-line mr-2"></i>
              Оптимизировать маршруты
            </button>
            <button className="w-full btn-warning text-left">
              <i className="ri-notification-line mr-2"></i>
              Отправить уведомления
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Статистика проверок</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Проверок сегодня</span>
              <span className="font-semibold text-blue-600">4 проверки</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Среднее время проверки</span>
              <span className="font-semibold text-green-600">1.5 часа</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Успешных проверок</span>
              <span className="font-semibold text-green-600">89%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Следующая проверка</span>
              <span className="font-semibold text-purple-600">10:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inspection Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Детали проверки"
        size="large"
      >
        {selectedInspection && (
          <div className="space-y-6">
            {/* Inspection Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Информация о проверке</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">ID проверки:</span>
                    <span className="font-mono text-blue-600">{selectedInspection.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Заявитель:</span>
                    <span>{selectedInspection.applicant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Адрес:</span>
                    <span>{selectedInspection.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Дата и время:</span>
                    <span>{selectedInspection.scheduledDate} в {selectedInspection.scheduledTime}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Детали проверки</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Инспектор:</span>
                    <span>{selectedInspection.inspector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Тип проверки:</span>
                    <span>{selectedInspection.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Приоритет:</span>
                    <StatusBadge 
                      status={selectedInspection.priority === 'high' ? 'error' : selectedInspection.priority === 'medium' ? 'warning' : 'success'}
                      text={selectedInspection.priority === 'high' ? 'Высокий' : selectedInspection.priority === 'medium' ? 'Средний' : 'Низкий'}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Статус:</span>
                    <StatusBadge 
                      status={
                        selectedInspection.status === 'scheduled' ? 'info' :
                        selectedInspection.status === 'in_progress' ? 'warning' :
                        selectedInspection.status === 'completed' ? 'success' : 'error'
                      }
                      text={
                        selectedInspection.status === 'scheduled' ? 'Запланировано' :
                        selectedInspection.status === 'in_progress' ? 'В процессе' :
                        selectedInspection.status === 'completed' ? 'Завершено' : 'Отменено'
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inspection Checklist */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Чек-лист проверки</h3>
              <div className="space-y-2">
                {[
                  'Проверка документов на жилье',
                  'Осмотр жилого помещения',
                  'Проверка условий проживания',
                  'Фотофиксация',
                  'Интервью с заявителем',
                  'Проверка соседей'
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{item}</span>
                    </div>
                    <StatusBadge status="warning" text="Не выполнено" />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-neutral-200">
              <button className="btn-success">
                <i className="ri-check-line mr-2"></i>
                Завершить проверку
              </button>
              <button className="btn-warning">
                <i className="ri-edit-line mr-2"></i>
                Редактировать
              </button>
              <button className="btn-error">
                <i className="ri-close-line mr-2"></i>
                Отменить проверку
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
