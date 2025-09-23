'use client';

import { useState } from 'react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import InspectionChecklist from './InspectionChecklist';
import { Inspection, InspectionReport, InspectionStatus } from '@/lib/types';

interface InspectionDetailsModalProps {
  inspection: Inspection | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (inspectionId: number, status: InspectionStatus) => void;
  onStartInspection?: (inspectionId: number) => void;
  onCompleteInspection?: (inspectionId: number) => void;
  onCancelInspection?: (inspectionId: number) => void;
  onViewReport?: (inspectionId: number) => void;
  onEditInspection?: (inspectionId: number) => void;
}

export default function InspectionDetailsModal({
  inspection,
  isOpen,
  onClose,
  onStatusChange,
  onStartInspection,
  onCompleteInspection,
  onCancelInspection,
  onViewReport,
  onEditInspection
}: InspectionDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'checklist' | 'report'>('details');
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  if (!inspection) return null;

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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PRIMARY': return 'Первичная проверка';
      case 'REPEAT': return 'Повторная проверка';
      case 'COMPLAINT': return 'Проверка по жалобе';
      default: return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      case 'URGENT': return 'error';
      default: return 'neutral';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'Низкий';
      case 'MEDIUM': return 'Средний';
      case 'HIGH': return 'Высокий';
      case 'URGENT': return 'Срочный';
      default: return priority;
    }
  };

  const canStartInspection = inspection.status === 'ASSIGNED' || inspection.status === 'PREPARATION';
  const canCompleteInspection = inspection.status === 'IN_PROGRESS';
  const canCancelInspection = inspection.status !== 'COMPLETED' && inspection.status !== 'CANCELLED';
  const hasReport = inspection.report !== undefined;

  const handleStatusChange = (newStatus: InspectionStatus) => {
    if (onStatusChange) {
      onStatusChange(inspection.id, newStatus);
    }
  };

  const handleStartInspection = () => {
    if (onStartInspection) {
      onStartInspection(inspection.id);
    }
    handleStatusChange('IN_PROGRESS');
  };

  const handleCompleteInspection = () => {
    if (onCompleteInspection) {
      onCompleteInspection(inspection.id);
    }
    handleStatusChange('COMPLETED');
  };

  const handleCancelInspection = () => {
    if (onCancelInspection) {
      onCancelInspection(inspection.id);
    }
    handleStatusChange('CANCELLED');
  };

  const handleViewReport = () => {
    if (onViewReport) {
      onViewReport(inspection.id);
    }
  };

  const handleEditInspection = () => {
    if (onEditInspection) {
      onEditInspection(inspection.id);
    }
  };

  const renderDetailsTab = () => (
    <div className="space-y-6">
      {/* Основная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-neutral-900 mb-3">Информация о проверке</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">ID проверки:</span>
              <span className="font-mono text-blue-600">{inspection.inspectionNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Статус:</span>
              <StatusBadge 
                status={getStatusColor(inspection.status)}
                text={getStatusLabel(inspection.status)}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Тип:</span>
              <span>{getTypeLabel(inspection.type)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Приоритет:</span>
              <StatusBadge 
                status={getPriorityColor(inspection.priority)}
                text={getPriorityLabel(inspection.priority)}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Дата назначения:</span>
              <span>{new Date(inspection.assignedDate).toLocaleDateString('ru-RU')}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-neutral-900 mb-3">Планирование</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Запланированная дата:</span>
              <span>{inspection.scheduledDate ? new Date(inspection.scheduledDate).toLocaleDateString('ru-RU') : 'Не указана'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Время:</span>
              <span>{inspection.scheduledTime || 'Не указано'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Инспектор:</span>
              <span>{inspection.inspectorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">ID заявления:</span>
              <span className="font-mono text-blue-600">{inspection.applicationId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Адрес и заметки */}
      <div>
        <h3 className="font-semibold text-neutral-900 mb-3">Адрес проверки</h3>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <p className="text-sm text-neutral-700">{inspection.address}</p>
        </div>
      </div>

      {inspection.notes && (
        <div>
          <h3 className="font-semibold text-neutral-900 mb-3">Заметки</h3>
          <div className="p-3 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-700">{inspection.notes}</p>
          </div>
        </div>
      )}

      {/* Информация о заявлении */}
      {inspection.application && (
        <div>
          <h3 className="font-semibold text-neutral-900 mb-3">Информация о заявлении</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-600">Заявитель:</span>
              <p className="font-medium">{inspection.application.applicant?.fullName || 'Не указано'}</p>
            </div>
            <div>
              <span className="text-neutral-600">Статус заявления:</span>
              <p className="font-medium">{inspection.application.status}</p>
            </div>
            <div>
              <span className="text-neutral-600">Дата подачи:</span>
              <p className="font-medium">{new Date(inspection.application.submittedAt).toLocaleDateString('ru-RU')}</p>
            </div>
            <div>
              <span className="text-neutral-600">Оценка риска:</span>
              <p className="font-medium">{inspection.application.riskScore}/100</p>
            </div>
          </div>
        </div>
      )}

      {/* Действия */}
      <div className="border-t border-neutral-200 pt-4">
        <h3 className="font-semibold text-neutral-900 mb-3">Действия</h3>
        <div className="flex flex-wrap gap-2">
          {canStartInspection && (
            <button
              onClick={handleStartInspection}
              className="btn-success"
            >
              <i className="ri-play-line mr-2"></i>
              Начать проверку
            </button>
          )}

          {canCompleteInspection && (
            <button
              onClick={handleCompleteInspection}
              className="btn-primary"
            >
              <i className="ri-check-line mr-2"></i>
              Завершить проверку
            </button>
          )}

          {canCancelInspection && (
            <button
              onClick={handleCancelInspection}
              className="btn-error"
            >
              <i className="ri-close-line mr-2"></i>
              Отменить проверку
            </button>
          )}

          {hasReport && (
            <button
              onClick={handleViewReport}
              className="btn-secondary"
            >
              <i className="ri-file-text-line mr-2"></i>
              Просмотреть акт
            </button>
          )}

          <button
            onClick={handleEditInspection}
            className="btn-secondary"
          >
            <i className="ri-edit-line mr-2"></i>
            Редактировать
          </button>

          <button
            onClick={() => setShowScheduleForm(true)}
            className="btn-secondary"
          >
            <i className="ri-calendar-line mr-2"></i>
            Перенести
          </button>
        </div>
      </div>
    </div>
  );

  const renderChecklistTab = () => (
    <div>
      <InspectionChecklist
        inspectionId={inspection.id}
        onComplete={(completedItems) => {
          console.log('Checklist completed:', completedItems);
        }}
        onUpdate={(itemId, completed, notes) => {
          console.log('Checklist item updated:', { itemId, completed, notes });
        }}
      />
    </div>
  );

  const renderReportTab = () => (
    <div className="space-y-6">
      {hasReport ? (
        <div>
          <h3 className="font-semibold text-neutral-900 mb-4">Акт выездной проверки</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-neutral-600 text-sm">Номер акта:</span>
                <p className="font-mono text-blue-600">{inspection.report?.reportNumber}</p>
              </div>
              <div>
                <span className="text-neutral-600 text-sm">Дата составления:</span>
                <p>{inspection.report ? new Date(inspection.report.reportDate).toLocaleDateString('ru-RU') : 'Не указана'}</p>
              </div>
              <div>
                <span className="text-neutral-600 text-sm">Дата визита:</span>
                <p>{inspection.report ? new Date(inspection.report.visitDate).toLocaleDateString('ru-RU') : 'Не указана'}</p>
              </div>
              <div>
                <span className="text-neutral-600 text-sm">Время визита:</span>
                <p>{inspection.report?.visitTime || 'Не указано'}</p>
              </div>
            </div>

            <div>
              <span className="text-neutral-600 text-sm">Выводы специалиста:</span>
              <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                <p className="text-sm">
                  <strong>Соответствие критериям:</strong> {
                    inspection.report?.specialistConclusions.meetsCriteria === 'YES' ? 'Да' :
                    inspection.report?.specialistConclusions.meetsCriteria === 'NO' ? 'Нет' :
                    'Требуется дополнительная проверка'
                  }
                </p>
                {inspection.report?.specialistConclusions.rejectionReason && (
                  <p className="text-sm mt-2">
                    <strong>Причина отказа:</strong> {inspection.report.specialistConclusions.rejectionReason}
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleViewReport}
                className="btn-primary"
              >
                <i className="ri-eye-line mr-2"></i>
                Просмотреть полный акт
              </button>
              <button className="btn-secondary">
                <i className="ri-download-line mr-2"></i>
                Скачать PDF
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="ri-file-text-line text-4xl text-neutral-400 mb-4"></i>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Акт проверки не создан
          </h3>
          <p className="text-neutral-600 mb-4">
            Акт выездной проверки будет доступен после завершения проверки
          </p>
          {canCompleteInspection && (
            <button
              onClick={handleCompleteInspection}
              className="btn-primary"
            >
              <i className="ri-file-add-line mr-2"></i>
              Создать акт проверки
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Проверка ${inspection.inspectionNumber}`}
        size="large"
      >
        <div className="space-y-6">
          {/* Вкладки */}
          <div className="border-b border-neutral-200">
            <nav className="flex space-x-8">
              {[
                { id: 'details', label: 'Детали', icon: 'ri-information-line' },
                { id: 'checklist', label: 'Чек-лист', icon: 'ri-checkbox-circle-line' },
                { id: 'report', label: 'Акт проверки', icon: 'ri-file-text-line' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Содержимое вкладок */}
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'checklist' && renderChecklistTab()}
          {activeTab === 'report' && renderReportTab()}
        </div>
      </Modal>

      {/* Модальное окно переноса проверки */}
      {showScheduleForm && (
        <Modal
          isOpen={showScheduleForm}
          onClose={() => setShowScheduleForm(false)}
          title="Перенести проверку"
          size="medium"
        >
          <div className="space-y-4">
            <p className="text-neutral-600">
              Выберите новую дату и время для проверки
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Новая дата</label>
                <input
                  type="date"
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="form-label">Новое время</label>
                <input
                  type="time"
                  className="form-input"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowScheduleForm(false)}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  setShowScheduleForm(false);
                  // Логика переноса проверки
                }}
                className="btn-primary"
              >
                Перенести
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
