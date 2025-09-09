'use client';

import { useState } from 'react';
import MobileOptimizedModal from './MobileOptimizedModal';
import StatusBadge from './StatusBadge';
import { Application, FamilyMember, Income, Document, InspectionResult } from '@/lib/types';

interface ApplicationDetailsModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationDetailsModal({ application, isOpen, onClose }: ApplicationDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'family' | 'income' | 'documents' | 'inspection' | 'history'>('overview');

  if (!application) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'submitted': 'Подана',
      'under_review': 'На рассмотрении',
      'approved': 'Одобрена',
      'rejected': 'Отклонена',
      'payment_processing': 'Обработка платежа',
      'paid': 'Оплачена'
    };
    return statusMap[status] || status;
  };

  const getPriorityText = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      'low': 'Низкий',
      'medium': 'Средний',
      'high': 'Высокий',
      'urgent': 'Срочный'
    };
    return priorityMap[priority] || priority;
  };

  const getRelationshipText = (relationship: string) => {
    const relationshipMap: { [key: string]: string } = {
      'spouse': 'Супруг(а)',
      'child': 'Ребенок',
      'parent': 'Родитель',
      'sibling': 'Брат/Сестра',
      'other': 'Другое'
    };
    return relationshipMap[relationship] || relationship;
  };

  const getIncomeTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'salary': 'Заработная плата',
      'business': 'Предпринимательство',
      'agriculture': 'Сельское хозяйство',
      'education': 'Образование',
      'bank_deposits': 'Банковские депозиты',
      'social_benefits': 'Социальные пособия',
      'rental': 'Аренда',
      'other': 'Прочее'
    };
    return typeMap[type] || type;
  };

  const getDocumentTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'passport': 'Паспорт',
      'birth_certificate': 'Свидетельство о рождении',
      'marriage_certificate': 'Свидетельство о браке',
      'income_certificate': 'Справка о доходах',
      'employment_certificate': 'Справка с места работы',
      'bank_statement': 'Банковская выписка',
      'property_document': 'Документ на недвижимость',
      'medical_certificate': 'Медицинская справка',
      'other': 'Прочее'
    };
    return typeMap[type] || type;
  };

  const getDocumentStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'uploaded': 'Загружено',
      'verified': 'Проверено',
      'rejected': 'Отклонено',
      'expired': 'Истекло'
    };
    return statusMap[status] || status;
  };

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: 'ri-eye-line' },
    { id: 'family', label: 'Семья', icon: 'ri-group-line' },
    { id: 'income', label: 'Доходы', icon: 'ri-money-dollar-circle-line' },
    { id: 'documents', label: 'Документы', icon: 'ri-file-text-line' },
    { id: 'inspection', label: 'Проверка', icon: 'ri-search-eye-line' },
    { id: 'history', label: 'История', icon: 'ri-history-line' }
  ];

  return (
    <MobileOptimizedModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Заявка ${application.id}`} 
      size="xl" 
      mobileFullscreen={true}
    >
      <div className="space-y-4 md:space-y-6">
        {/* Header Info */}
        <div className="bg-neutral-50 rounded-lg p-3 md:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2 text-sm md:text-base">Основная информация</h3>
              <div className="space-y-1 text-xs md:text-sm">
                <p className="break-words"><span className="font-medium">Заявитель:</span> {application.applicantName}</p>
                <p className="break-all"><span className="font-medium">ИИН:</span> {application.applicantId}</p>
                <p><span className="font-medium">Телефон:</span> {application.phone}</p>
                {application.email && (
                  <p className="break-words"><span className="font-medium">Email:</span> {application.email}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2 text-sm md:text-base">Статус</h3>
              <div className="space-y-1 text-xs md:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium">Статус:</span>
                  <StatusBadge status={application.status as any}>
                    {getStatusText(application.status)}
                  </StatusBadge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium">Приоритет:</span>
                  <StatusBadge status={application.priority === 'high' ? 'high-risk' : application.priority === 'medium' ? 'medium-risk' : 'low-risk'}>
                    {getPriorityText(application.priority)}
                  </StatusBadge>
                </div>
                <p><span className="font-medium">Риск:</span> {application.riskScore}%</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2 text-sm md:text-base">Даты</h3>
              <div className="space-y-1 text-xs md:text-sm">
                <p><span className="font-medium">Подана:</span> {formatDate(application.submittedAt)}</p>
                {application.reviewedAt && (
                  <p><span className="font-medium">Рассмотрена:</span> {formatDate(application.reviewedAt)}</p>
                )}
                {application.approvedAt && (
                  <p><span className="font-medium">Одобрена:</span> {formatDate(application.approvedAt)}</p>
                )}
                {application.rejectedAt && (
                  <p><span className="font-medium">Отклонена:</span> {formatDate(application.rejectedAt)}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 sticky top-0 bg-white z-10">
          <nav className="flex overflow-x-auto space-x-1 md:space-x-2" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                className={`py-3 px-3 md:px-4 border-b-2 font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2 whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <i className={`${tab.icon} text-sm md:text-base`}></i>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.charAt(0)}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h4 className="font-semibold text-neutral-900 mb-3">Адрес</h4>
                  <p className="text-sm text-neutral-600">{application.address}</p>
                </div>
                <div className="card">
                  <h4 className="font-semibold text-neutral-900 mb-3">Платеж</h4>
                  <div className="space-y-2 text-sm">
                    {application.paymentAmount && (
                      <p><span className="font-medium">Сумма:</span> {application.paymentAmount.toLocaleString()} сом</p>
                    )}
                    {application.paymentStatus && (
                      <p><span className="font-medium">Статус:</span> {application.paymentStatus}</p>
                    )}
                  </div>
                </div>
              </div>
              {application.notes && (
                <div className="card">
                  <h4 className="font-semibold text-neutral-900 mb-3">Примечания</h4>
                  <p className="text-sm text-neutral-600">{application.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'family' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left Panel - Applicant Info */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                  <div className="text-center">
                    {/* Avatar */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <i className="ri-user-line text-2xl md:text-3xl text-blue-600"></i>
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-base md:text-lg font-semibold text-neutral-900 mb-3 md:mb-4">
                      {application.applicantName}
                    </h3>
                    
                    {/* Details */}
                    <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-id-card-line text-neutral-500 text-sm"></i>
                        <span className="text-neutral-700 break-all">ПИН: {application.applicantId}</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-map-pin-line text-neutral-500 text-sm"></i>
                        <span className="text-neutral-700">Бишкек</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-calendar-line text-neutral-500 text-sm"></i>
                        <span className="text-neutral-700">Подана: {application.submittedAt.toLocaleDateString('ru-RU')}</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-time-line text-neutral-500 text-sm"></i>
                        <span className="text-neutral-700">Обновлено: {new Date().toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Family Composition */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                  <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">
                    Состав семьи с детьми до 16 лет
                  </h4>
                  
                              <div className="space-y-3 md:space-y-4">
                    {application.familyMembers.map((member) => {
                      const age = new Date().getFullYear() - member.birthDate.getFullYear();
                      const isChild = age < 16;
                      const relationshipText = getRelationshipText(member.relationship);
                      
                      return (
                        <div 
                          key={member.id} 
                          className={`border border-neutral-200 rounded-lg p-3 md:p-4 ${
                            isChild ? 'bg-yellow-50' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center space-x-3 md:space-x-4">
                            {/* Avatar */}
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isChild ? 'bg-yellow-100' : 'bg-blue-100'
                            }`}>
                              {isChild ? (
                                <i className="ri-bear-smile-line text-lg md:text-xl text-yellow-600"></i>
                              ) : (
                                <i className="ri-user-line text-lg md:text-xl text-blue-600"></i>
                              )}
                            </div>
                            
                            {/* Member Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="min-w-0">
                                  <h5 className="font-semibold text-neutral-900 text-sm md:text-base truncate">{member.name}</h5>
                                  <p className="text-xs md:text-sm text-neutral-600">
                                    {relationshipText} {age} лет
                                  </p>
                                </div>
                                
                                <div className="text-left sm:text-right">
                                  <p className="text-xs md:text-sm font-medium text-neutral-900">
                                    {member.income ? `${member.income.toLocaleString()} сом` : '0 сом'}
                                  </p>
                                  <p className="text-xs text-neutral-500">месячный доход</p>
                                </div>
                              </div>
                              
                              {/* Child Badge */}
                              {isChild && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    РЕБЕНОК ДО 16
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                            </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'income' && (
            <div className="space-y-4 md:space-y-6">
              {/* Источники дохода */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-3 md:mb-4">Источники дохода</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700">Тип</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700">Сумма</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden sm:table-cell">Источник</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden md:table-cell">Период</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700">Регулярный</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-100">
                        <td className="py-2 md:py-3">Заработная плата</td>
                        <td className="py-2 md:py-3 font-medium">25 000 сом</td>
                        <td className="py-2 md:py-3 hidden sm:table-cell">ООО &ldquo;Торговый дом&rdquo;</td>
                        <td className="py-2 md:py-3 hidden md:table-cell">2025-01</td>
                        <td className="py-2 md:py-3">
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                            Да
                            </span>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 8-категорийный анализ доходов */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">8-категорийный анализ доходов</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {/* I. Трудовая деятельность */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <h5 className="font-semibold text-blue-900 text-sm md:text-base">I. Трудовая деятельность</h5>
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-blue-900 mb-2">18 000 сом</div>
                    <div className="text-xs md:text-sm text-blue-700 mb-2 md:mb-3">
                      <p>• Заработная плата наемных работников</p>
                      <p>• Пенсии и пособия</p>
                      <p>• Государственные выплаты</p>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">45% от общего дохода</div>
                  </div>

                  {/* II. Образование */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <h5 className="font-semibold text-green-900 text-sm md:text-base">II. Образование</h5>
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-green-900 mb-2">2 500 сом</div>
                    <div className="text-xs md:text-sm text-green-700 mb-2 md:mb-3">
                      <p>• Стипендии</p>
                      <p>• Образовательные гранты</p>
                      <p>• Доходы от обучения</p>
                    </div>
                    <div className="text-xs text-green-600 font-medium">6% от общего дохода</div>
                  </div>

                  {/* III. Предпринимательская деятельность */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-purple-900">III. Предпринимательская деятельность</h5>
                    </div>
                    <div className="text-2xl font-bold text-purple-900 mb-2">8 000 сом</div>
                    <div className="text-sm text-purple-700 mb-3">
                      <p>• Доходы ИП</p>
                      <p>• Патентные доходы</p>
                      <p>• Лицензионные платежи</p>
                    </div>
                    <div className="text-xs text-purple-600 font-medium">20% от общего дохода</div>
                  </div>

                  {/* IV. Сельское хозяйство */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-yellow-900">IV. Сельское хозяйство</h5>
                    </div>
                    <div className="text-2xl font-bold text-yellow-900 mb-2">4 500 сом</div>
                    <div className="text-sm text-yellow-700 mb-3">
                      <p>• Орошаемое земледелие</p>
                      <p>• Богарное земледелие</p>
                      <p>• Продажа урожая</p>
                    </div>
                    <div className="text-xs text-yellow-600 font-medium">11% от общего дохода</div>
                  </div>

                  {/* V. Землепользование */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-orange-900">V. Землепользование</h5>
                    </div>
                    <div className="text-2xl font-bold text-orange-900 mb-2">1 200 сом</div>
                    <div className="text-sm text-orange-700 mb-3">
                      <p>• Аренда земли</p>
                      <p>• Продажа земли</p>
                      <p>• Доходы от недвижимости</p>
                    </div>
                    <div className="text-xs text-orange-600 font-medium">3% от общего дохода</div>
                  </div>

                  {/* VI. Животноводство */}
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-pink-900">VI. Животноводство</h5>
                    </div>
                    <div className="text-2xl font-bold text-pink-900 mb-2">3 800 сом</div>
                    <div className="text-sm text-pink-700 mb-3">
                      <p>• Продажа скота</p>
                      <p>• Молочная продукция</p>
                      <p>• Птицеводство</p>
                    </div>
                    <div className="text-xs text-pink-600 font-medium">10% от общего дохода</div>
                  </div>

                  {/* VII. Банковские услуги */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-slate-900">VII. Банковские услуги</h5>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-2">800 сом</div>
                    <div className="text-sm text-slate-700 mb-3">
                      <p>• Депозитные проценты</p>
                      <p>• Инвестиционные доходы</p>
                      <p>• Дивиденды</p>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">2% от общего дохода</div>
                  </div>

                  {/* VIII. Прочие доходы */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-900">VIII. Прочие доходы</h5>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">1 200 сом</div>
                    <div className="text-sm text-gray-700 mb-3">
                      <p>• Алименты</p>
                      <p>• Семейная помощь</p>
                      <p>• Разовые доходы</p>
                    </div>
                    <div className="text-xs text-gray-600 font-medium">3% от общего дохода</div>
                  </div>
                </div>
              </div>

              {/* Расчет ССДС и сравнение с ГМД */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Общий семейный доход */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h5 className="font-semibold text-blue-900 mb-3">Общий семейный доход</h5>
                  <div className="text-3xl font-bold text-blue-900 mb-2">40 000 сом</div>
                  <p className="text-sm text-blue-700">Сумма всех 8 категорий доходов</p>
                </div>

                {/* ССДС */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h5 className="font-semibold text-purple-900 mb-3">ССДС</h5>
                  <div className="text-3xl font-bold text-purple-900 mb-2">10 000 сом</div>
                  <p className="text-sm text-purple-700">40 000 ÷ 4 человек = доход на душу населения</p>
                </div>

                {/* Сравнение с порогом ГМД */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h5 className="font-semibold text-red-900 mb-3">Сравнение с порогом ГМД</h5>
                  <div className="text-sm text-red-700 mb-3">Порог ГМД: 4 500 сом</div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">✗ НЕ ПОДХОДИТ</div>
                    <div className="text-lg font-semibold text-red-700">5 500 сом выше порога</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="card">
                <h4 className="font-semibold text-neutral-900 mb-4">Документы</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {application.documents.map((doc) => (
                    <div key={doc.id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-neutral-900">{getDocumentTypeText(doc.type)}</h5>
                        <StatusBadge status={doc.status === 'verified' ? 'success' : doc.status === 'rejected' ? 'danger' : 'warning'}>
                          {getDocumentStatusText(doc.status)}
                        </StatusBadge>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{doc.name}</p>
                      <div className="text-xs text-neutral-500 space-y-1">
                        <p>Загружен: {formatDate(doc.uploadedAt)}</p>
                        <p>Загрузил: {doc.uploadedBy}</p>
                        {doc.verifiedAt && (
                          <p>Проверен: {formatDate(doc.verifiedAt)}</p>
                        )}
                        {doc.verifiedBy && (
                          <p>Проверил: {doc.verifiedBy}</p>
                        )}
                      </div>
                      {doc.notes && (
                        <p className="text-sm text-neutral-600 mt-2 italic">{doc.notes}</p>
                      )}
                      <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                        <i className="ri-download-line mr-1"></i>
                        Скачать
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inspection' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center space-x-3">
                <i className="ri-check-line text-2xl text-green-600"></i>
                <h4 className="text-xl font-semibold text-neutral-900">Комплексная проверка внешних данных</h4>
              </div>

              {/* Verification Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tunduk */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-check-line text-green-600"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-green-900">Tunduk</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-600"></i>
                      <button className="text-sm text-green-700 hover:text-green-800 font-medium">
                        Обновить
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-green-700 mb-3">
                    Последняя проверка: 2025-01-21 10:30
                  </div>
                  <div className="text-sm text-green-800 mb-4">
                    Данные: Личность подтверждена, ПИН валиден
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <i className="ri-check-line"></i>
                    <span>Данные подтверждены и актуальны</span>
                  </div>
                </div>

                {/* Центр занятости */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-briefcase-line text-green-600"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-green-900">Центр занятости</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-600"></i>
                      <button className="text-sm text-green-700 hover:text-green-800 font-medium">
                        Обновить
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-green-700 mb-3">
                    Последняя проверка: 2025-01-20 15:45
                  </div>
                  <div className="text-sm text-green-800 mb-4">
                    Данные: Статус безработного, пособие не получает
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <i className="ri-check-line"></i>
                    <span>Данные подтверждены и актуальны</span>
                  </div>
                </div>

                {/* Налоговая служба */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <i className="ri-file-text-line text-orange-600"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-orange-900">Налоговая служба</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-error-warning-line text-orange-600"></i>
                      <button className="text-sm text-orange-700 hover:text-orange-800 font-medium">
                        Обновить
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-orange-700 mb-3">
                    Последняя проверка: 2025-01-19 09:15
                  </div>
                  <div className="text-sm text-orange-800 mb-4">
                    Данные: Задолженность по налогам отсутствует, ИП не зарегистрирован
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-orange-700">
                    <i className="ri-error-warning-line"></i>
                    <span>Обнаружены расхождения, требует внимания</span>
                  </div>
                </div>

                {/* Госкадастр */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-home-line text-green-600"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-green-900">Госкадастр</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-600"></i>
                      <button className="text-sm text-green-700 hover:text-green-800 font-medium">
                        Обновить
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-green-700 mb-3">
                    Последняя проверка: 2025-01-18 14:20
                  </div>
                  <div className="text-sm text-green-800 mb-4">
                    Данные: Собственность: 1 квартира 65 м²
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <i className="ri-check-line"></i>
                    <span>Данные подтверждены и актуальны</span>
                  </div>
                </div>

                {/* Банковская система */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-bank-line text-green-600"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-green-900">Банковская система</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-600"></i>
                      <button className="text-sm text-green-700 hover:text-green-800 font-medium">
                        Обновить
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-green-700 mb-3">
                    Последняя проверка: 2025-01-17 11:00
                  </div>
                  <div className="text-sm text-green-800 mb-4">
                    Данные: 2 счета, общий остаток 45,000 сом
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <i className="ri-check-line"></i>
                    <span>Данные подтверждены и актуальны</span>
                  </div>
                  </div>
                  
                {/* Медкомиссия */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-hospital-line text-green-600"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-green-900">Медкомиссия</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-600"></i>
                      <button className="text-sm text-green-700 hover:text-green-800 font-medium">
                        Обновить
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-green-700 mb-3">
                    Последняя проверка: 2025-01-16 13:30
                  </div>
                  <div className="text-sm text-green-800 mb-4">
                    Данные: Инвалидность не установлена
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <i className="ri-check-line"></i>
                    <span>Данные подтверждены и актуальны</span>
                  </div>
                    </div>

                {/* Служба пробации */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-shield-check-line text-green-600"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-green-900">Служба пробации</h5>
                        </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-600"></i>
                      <button className="text-sm text-green-700 hover:text-green-800 font-medium">
                        Обновить
                      </button>
                        </div>
                      </div>
                  <div className="text-sm text-green-700 mb-3">
                    Последняя проверка: 2025-01-15 16:45
                  </div>
                  <div className="text-sm text-green-800 mb-4">
                    Данные: Судимость отсутствует
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <i className="ri-check-line"></i>
                    <span>Данные подтверждены и актуальны</span>
                    </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="card">
                <h4 className="font-semibold text-neutral-900 mb-4">История изменений</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">Заявка подана</p>
                      <p className="text-sm text-neutral-600">{formatDate(application.submittedAt)}</p>
                    </div>
                  </div>
                  
                  {application.reviewedAt && (
                    <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">Взято на рассмотрение</p>
                        <p className="text-sm text-neutral-600">{formatDate(application.reviewedAt)}</p>
                        {application.reviewedBy && (
                          <p className="text-sm text-neutral-500">Специалист: {application.reviewedBy}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {application.approvedAt && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">Заявка одобрена</p>
                        <p className="text-sm text-neutral-600">{formatDate(application.approvedAt)}</p>
                        {application.approvedBy && (
                          <p className="text-sm text-neutral-500">Специалист: {application.approvedBy}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {application.rejectedAt && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">Заявка отклонена</p>
                        <p className="text-sm text-neutral-600">{formatDate(application.rejectedAt)}</p>
                        {application.rejectedBy && (
                          <p className="text-sm text-neutral-500">Специалист: {application.rejectedBy}</p>
                        )}
                        {application.rejectionReason && (
                          <p className="text-sm text-neutral-600 mt-1">Причина: {application.rejectionReason}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileOptimizedModal>
  );
}
