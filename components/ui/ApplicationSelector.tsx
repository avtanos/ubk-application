'use client';

import { useState, useEffect } from 'react';
import { Application } from '@/lib/types';

interface ApplicationSelectorProps {
  onSelect: (application: Application) => void;
  onCancel: () => void;
  applications: Application[];
  loading?: boolean;
}

export default function ApplicationSelector({ 
  onSelect, 
  onCancel, 
  applications, 
  loading = false 
}: ApplicationSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredApplications, setFilteredApplications] = useState<Application[]>(applications);

  useEffect(() => {
    if (searchTerm) {
      const filtered = applications.filter(app => 
        app.applicant?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicant?.pin?.includes(searchTerm)
      );
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications(applications);
    }
  }, [searchTerm, applications]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'UNDER_REVIEW': return 'text-blue-600 bg-blue-100';
      case 'INSPECTION_ASSIGNED': return 'text-orange-600 bg-orange-100';
      case 'INSPECTION_IN_PROGRESS': return 'text-purple-600 bg-purple-100';
      case 'INSPECTION_COMPLETED': return 'text-green-600 bg-green-100';
      case 'APPROVED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Ожидает';
      case 'UNDER_REVIEW': return 'На рассмотрении';
      case 'INSPECTION_ASSIGNED': return 'Назначена проверка';
      case 'INSPECTION_IN_PROGRESS': return 'Проверка в процессе';
      case 'INSPECTION_COMPLETED': return 'Проверка завершена';
      case 'APPROVED': return 'Одобрено';
      case 'REJECTED': return 'Отклонено';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'URGENT': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Выберите заявку для планирования проверки
        </h3>
        
        {/* Поиск */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Поиск по ФИО, номеру заявки или ПИН..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full form-input"
          />
        </div>
      </div>

      {/* Список заявок */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <i className="ri-search-line text-4xl text-neutral-400 mb-4"></i>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Заявки не найдены
              </h3>
              <p className="text-neutral-600">
                Нет заявок, соответствующих поисковому запросу
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application.id}
                onClick={() => onSelect(application)}
                className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-neutral-900">
                        {application.applicant?.fullName || 'Не указано'}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusLabel(application.status)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(application.priority)}`}>
                        {getPriorityLabel(application.priority)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-neutral-600">
                      <div>
                        <span className="font-medium">№ заявки:</span>
                        <span className="ml-2 font-mono text-blue-600">{application.applicationNumber}</span>
                      </div>
                      <div>
                        <span className="font-medium">ПИН:</span>
                        <span className="ml-2 font-mono">{application.applicant?.pin || 'Не указан'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Дата подачи:</span>
                        <span className="ml-2">{new Date(application.submittedAt).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <div>
                        <span className="font-medium">Оценка риска:</span>
                        <span className="ml-2">{application.riskScore}/100</span>
                      </div>
                    </div>

                    {application.addresses && application.addresses.length > 0 && (
                      <div className="mt-2 text-sm text-neutral-600">
                        <span className="font-medium">Адрес:</span>
                        <span className="ml-2">
                          {application.addresses[0].street}, {application.addresses[0].house}
                          {application.addresses[0].flat && `, кв. ${application.addresses[0].flat}`}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <i className="ri-arrow-right-line text-neutral-400"></i>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Кнопки действий */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button
          onClick={onCancel}
          className="btn-secondary"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
