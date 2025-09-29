'use client';

import { useState, useEffect } from 'react';
import MobileOptimizedModal from './MobileOptimizedModal';
import StatusBadge from './StatusBadge';
import IncomeAnalysisModal from './IncomeAnalysisModal';
import ExternalDataViewer from './ExternalDataViewer';
import ScheduleInspectionForm from './ScheduleInspectionForm';
import { Application, FamilyMember, Income, Document, InspectionResult, StudentEducation } from '@/lib/types';
import { externalApiService } from '@/lib/externalApiService';
import { calculateBenefit, calculatePerCapitaIncome } from '@/lib/benefitCalculator';
import { mockIncomeData } from '@/lib/mockData';
import StudentListView from './StudentListView';

interface ApplicationDetailsModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationDetailsModal({ application, isOpen, onClose }: ApplicationDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'applicant' | 'family' | 'identity' | 'addresses' | 'income' | 'inspection' | 'history'>('applicant');
  const [isIncomeAnalysisOpen, setIsIncomeAnalysisOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [externalData, setExternalData] = useState<any>(null);
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);
  const [benefitCalculation, setBenefitCalculation] = useState<any>(null);
  const [homeVisitRequired, setHomeVisitRequired] = useState<boolean | undefined>(undefined);
  const [isScheduleInspectionOpen, setIsScheduleInspectionOpen] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // Закрытие выпадающего меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Загрузка внешних данных при открытии модального окна
  useEffect(() => {
    if (isOpen && application) {
      loadExternalData();
      calculateBenefitData();
      // Инициализируем состояние homeVisitRequired
      setHomeVisitRequired((application as any).homeVisitRequired);
      // Инициализируем данные о членах семьи
      setFamilyMembers((application as any).familyMembers || []);
    }
  }, [isOpen, application]);

  const loadExternalData = async () => {
    if (!application) return;
    
    setIsLoadingExternal(true);
    try {
      const applicantPin = (application as any).applicantPin || (application as any).formData?.applicant?.pin;
      console.log('Загружаем внешние данные для ПИН:', applicantPin);
      console.log('Данные заявки:', application);
      
      if (applicantPin) {
        const data = await externalApiService.getAllDataByPIN(applicantPin);
        console.log('Получены внешние данные:', data);
        setExternalData(data);
      } else {
        // Если ПИН не найден, используем тестовый ПИН для демонстрации
        console.log('ПИН не найден, используем тестовый ПИН для демонстрации');
        const data = await externalApiService.getAllDataByPIN('12345678901234');
        setExternalData(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки внешних данных:', error);
      // Устанавливаем данные об ошибке вместо null
      setExternalData({
        error: 'Ошибка загрузки внешних данных',
        errorMessage: error instanceof Error ? error.message : 'Неизвестная ошибка',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoadingExternal(false);
    }
  };

  const calculateBenefitData = () => {
    if (!application) return;
    
    try {
      const familyMembers = getFamilyMembers();
      const incomes = getIncomes();
      const landPlots = getLandPlots();
      const livestock = getLivestock();
      
      // Преобразуем данные в формат для калькулятора
      const monthlyIncomes = incomes.map((income: any) => ({
        [income.type || income.incomeTypeCode || 'other']: income.amount || 0
      }));
      
      // Суммируем доходы за месяц
      const totalIncome = monthlyIncomes.reduce((total, monthIncomes) => {
        return total + Object.values(monthIncomes).reduce((sum: number, income: any) => sum + income, 0);
      }, 0);
      
      // Преобразуем членов семьи в нужный формат с учетом студентов
      const formattedFamilyMembers = familyMembers.map((member: any) => ({
        name: member.fullName || 'Не указано',
        age: member.age || 0,
        relation: member.relation || member.type || 'other',
        income: member.monthlyIncome || 0,
        isStudent: member.isStudent || false,
        educationData: member.educationData ? {
          scholarshipAmount: member.educationData.scholarshipAmount || 0,
          tuitionFeeYearly: member.educationData.tuitionFeeYearly || 0,
          tuitionFeeMonthly: member.educationData.tuitionFeeMonthly || 0,
          fundingSource: member.educationData.fundingSource || 'parents',
          isFullTime: member.educationData.isFullTime || false
        } : undefined
      }));
      
      // Преобразуем земельные участки
      const formattedLandPlots = landPlots.map((plot: any) => ({
        type: plot.type || 'household',
        area: plot.area || 0
      }));
      
      // Преобразуем скот
      const formattedLivestock = {
        cows: livestock.cows || 0,
        heifers: livestock.heifers || 0,
        bulls: livestock.bulls || 0,
        horses: livestock.horses || 0,
        sheep: livestock.sheep || 0,
        goats: livestock.goats || 0,
        pigs: livestock.pigs || 0,
        poultry: livestock.poultry || 0,
        other: livestock.other || 0
      };
      
      // Используем регион по умолчанию
      const regionId = 'bishkek'; // или получать из данных заявки
      
      const calculation = calculateBenefit(
        formattedFamilyMembers,
        regionId,
        totalIncome,
        formattedLandPlots,
        formattedLivestock
      );
      
      // Устанавливаем расчет или значения по умолчанию
      setBenefitCalculation(calculation || {
        perCapitaIncome: 0,
        totalIncome: totalIncome,
        incomeBreakdown: {},
        familySize: formattedFamilyMembers.length,
        isEligible: false,
        benefitAmount: 0
      });
    } catch (error) {
      console.error('Ошибка расчета пособия:', error);
    }
  };


  if (!application) return null;

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return '-';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return '-';
      return dateObj.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Ошибка форматирования даты:', error);
      return '-';
    }
  };

  const getStatusText = (status: string) => {
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
    return statusMap[status] || status;
  };

  const getPriorityText = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      'LOW': 'Низкий',
      'MEDIUM': 'Средний',
      'HIGH': 'Высокий',
      'URGENT': 'Срочный'
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

  // Вспомогательные функции для безопасного доступа к данным
  const getApplicantData = () => {
    if ((application as any).formData?.applicant) {
      return (application as any).formData.applicant;
    }
    return {
      fullName: (application as any).applicantName || 'Не указано',
      pin: (application as any).applicantPin || 'Не указан',
      gender: 'Не указан',
      birthDate: '',
      citizenship: 'Не указано',
      nationality: 'Не указана',
      education: 'Не указано',
      maritalStatus: 'Не указано',
      documentType: 'Не указан',
      documentSeries: 'Не указана',
      documentNumber: 'Не указан',
      documentIssueDate: '',
      passportIssuingAuthority: 'Не указан',
      documentExpiryDate: ''
    };
  };

  const getTuData = () => {
    return (application as any).formData?.tuData || {
      additionalIds: [],
      addresses: [],
      contacts: [],
      specialCompensations: [],
      socialAuthority: {
        municipalAuthority: '',
        applicantType: '',
        category: '',
        disabilityCategory: '',
        msekRefNumber: '',
        msekIssueDate: '',
        dsuRefNumber: '',
        dsuIssueDate: ''
      },
      categories: {
        forChild: false,
        forFamilyWithChild: false,
        forMinor: false,
        forIncapacitated: false
      },
      paymentRequisites: {
        personalAccount: '',
        bankAccount: '',
        cardAccount: '',
        bankCode: '',
        paymentType: ''
      }
    };
  };

  const getFamilyMembers = () => {
    return (application as any).formData?.familyMembers || [];
  };

  const getIncomes = () => {
    return (application as any).formData?.incomes || [];
  };

  const getLandPlots = () => {
    return (application as any).formData?.landPlots || [];
  };

  const getLivestock = () => {
    return (application as any).formData?.livestock || [];
  };

  const getVehicles = () => {
    return (application as any).formData?.vehicles || [];
  };

  const getPaymentRequisites = () => {
    return (application as any).formData?.paymentRequisites || {
      personalAccount: '',
      bankAccount: '',
      cardAccount: '',
      bankCode: '',
      paymentType: ''
    };
  };

  const getCategories = () => {
    return (application as any).formData?.categories || {
      forChild: false,
      forMinor: false,
      forIncapacitated: false
    };
  };

  // Функции для планирования проверки
  const handleScheduleInspection = () => {
    setIsScheduleInspectionOpen(true);
  };

  const handleScheduleInspectionSubmit = (inspectionData: any) => {
    console.log('Планирование проверки для заявки:', application?.id, inspectionData);
    // Здесь можно добавить вызов API для создания проверки
    setIsScheduleInspectionOpen(false);
    // Показываем уведомление об успехе
    alert('Проверка успешно запланирована!');
  };

  const handleCancelSchedule = () => {
    setIsScheduleInspectionOpen(false);
  };


  const tabs = [
    { id: 'applicant', label: 'Заявитель', icon: 'ri-user-line' },
    { id: 'family', label: 'Семья', icon: 'ri-group-line' },
    { id: 'identity', label: 'Документы', icon: 'ri-id-card-line' },
    { id: 'addresses', label: 'Адреса и контакты', icon: 'ri-map-pin-line' },
    { id: 'income', label: 'Все доходы', icon: 'ri-money-dollar-circle-line' },
    { id: 'inspection', label: 'Проверка', icon: 'ri-search-eye-line' },
    { id: 'history', label: 'История', icon: 'ri-history-line' }
  ];

  return (
    <MobileOptimizedModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Заявка ${application.id}`} 
      size="full" 
      mobileFullscreen={true}
    >
      <div className="space-y-4 md:space-y-6">
        {/* Header Info */}
        <div className="bg-neutral-50 rounded-lg p-3 md:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2 text-sm md:text-base">Основная информация</h3>
              <div className="space-y-1 text-xs md:text-sm">
                <p className="break-words"><span className="font-medium">Заявитель:</span> {(application as any).applicantName || (application as any).formData?.applicant?.fullName || 'Не указан'}</p>
                <p className="break-all"><span className="font-medium">ПИН:</span> {(application as any).applicantPin || (application as any).formData?.applicant?.pin || 'Не указан'}</p>
                {((application as any).applicantPhone || ((application as any).formData?.tuData?.contacts && (application as any).formData.tuData.contacts.length > 0)) && (
                  <p><span className="font-medium">Контакты:</span> {(application as any).applicantPhone || (application as any).formData?.tuData?.contacts?.map((c: any) => c.value).join(', ') || 'Не указаны'}</p>
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
                  <StatusBadge status={application.priority === 'HIGH' ? 'high-risk' : application.priority === 'MEDIUM' ? 'medium-risk' : 'low-risk'}>
                    {getPriorityText(application.priority)}
                  </StatusBadge>
                </div>
                <p><span className="font-medium">Риск:</span> {application.riskScore}%</p>
                <p><span className="font-medium">Тип заявления:</span> {((application as any).applicationType === 'REPEAT' ? 'Повторное' : 'Первичное') || 'Не указан'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2 text-sm md:text-base">Адрес и даты</h3>
              <div className="space-y-1 text-xs md:text-sm">
                {((application as any).formData?.tuData?.addresses && (application as any).formData.tuData.addresses.length > 0) && (
                  <div>
                    <span className="font-medium">Адрес:</span>
                    {((application as any).formData?.tuData?.addresses || []).map((addr: any, index: number) => (
                      <div key={index} className="ml-2">
                        {addr.type === 'REG' ? 'Регистрация' : 'Фактический'}: {addr.street}, {addr.house}{addr.flat && `, кв. ${addr.flat}`}
                      </div>
                    ))}
                  </div>
                )}
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

          {activeTab === 'applicant' && (
            <div className="space-y-6">
              {/* Основная информация заявителя */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">Основная информация заявителя</h4>
                {(() => {
                  const applicantData = getApplicantData();
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-neutral-700">ФИО</label>
                          <p className="text-sm text-neutral-900">{applicantData.fullName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">ПИН</label>
                          <p className="text-sm text-neutral-900 font-mono">{applicantData.pin}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Пол</label>
                          <p className="text-sm text-neutral-900">{applicantData.gender}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Дата рождения</label>
                          <p className="text-sm text-neutral-900">{applicantData.birthDate ? formatDate(applicantData.birthDate) : 'Не указана'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Гражданство</label>
                          <p className="text-sm text-neutral-900">{applicantData.citizenship}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Национальность</label>
                          <p className="text-sm text-neutral-900">{applicantData.nationality}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Образование</label>
                          <p className="text-sm text-neutral-900">{applicantData.education}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Семейное положение</label>
                          <p className="text-sm text-neutral-900">{applicantData.maritalStatus}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Категория заявителя</label>
                          <p className="text-sm text-neutral-900">{applicantData.applicantCategory || 'Не указана'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Орган соцзащиты</label>
                          <p className="text-sm text-neutral-900">{applicantData.socialProtectionAuthority || 'Не указан'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Документ удостоверения личности */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">Документ удостоверения личности</h4>
                {(() => {
                  const applicantData = getApplicantData();
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Тип документа</label>
                          <p className="text-sm text-neutral-900">{applicantData.documentType}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Серия</label>
                          <p className="text-sm text-neutral-900 font-mono">{applicantData.documentSeries}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Номер</label>
                          <p className="text-sm text-neutral-900 font-mono">{applicantData.documentNumber}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Дата выдачи</label>
                          <p className="text-sm text-neutral-900">{applicantData.documentIssueDate ? formatDate(applicantData.documentIssueDate) : 'Не указана'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Орган выдачи</label>
                          <p className="text-sm text-neutral-900">{applicantData.passportIssuingAuthority}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Дата истечения</label>
                          <p className="text-sm text-neutral-900">{applicantData.documentExpiryDate ? formatDate(applicantData.documentExpiryDate) : 'Не указана'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
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
                      {(application as any).applicantName || (application as any).formData?.applicant?.fullName || 'Заявитель'}
                    </h3>
                    
                    {/* Details */}
                    <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-id-card-line text-neutral-500 text-sm"></i>
                        <span className="text-neutral-700 break-all">ПИН: {(application as any).applicantId}</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-map-pin-line text-neutral-500 text-sm"></i>
                        <span className="text-neutral-700">Бишкек</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-calendar-line text-neutral-500 text-sm"></i>
                        <span className="text-neutral-700">Подана: {formatDate((application as any).submittedAt)}</span>
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
                    {getFamilyMembers().map((member: any, index: number) => {
                      const birthDate = member.birthDate ? new Date(member.birthDate) : new Date();
                      const age = member.age || (new Date().getFullYear() - birthDate.getFullYear());
                      const isChild = age < 16;
                      const relationshipText = getRelationshipText(member.relation || member.type || 'other');
                      
                      return (
                        <div 
                          key={member.id || index} 
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
                                  <h5 className="font-semibold text-neutral-900 text-sm md:text-base truncate">{member.fullName || 'Не указано'}</h5>
                                  <p className="text-xs md:text-sm text-neutral-600">
                                    {relationshipText} {age} лет
                                  </p>
                                  {member.pin && (
                                    <p className="text-xs text-neutral-500 mt-1">
                                      ПИН: {member.pin}
                                    </p>
                                  )}
                                  {member.occupation && (
                                    <p className="text-xs text-neutral-500 mt-1">
                                      Род занятий: {member.occupation}
                                    </p>
                                  )}
                                </div>
                                
                                <div className="text-left sm:text-right">
                                  <p className="text-xs md:text-sm font-medium text-neutral-900">
                                    {member.monthlyIncome ? `${Number(member.monthlyIncome).toLocaleString()} сом` : '0 сом'}
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
                    {getFamilyMembers().length === 0 && (
                      <div className="text-center text-neutral-500 py-8">
                        <i className="ri-group-line text-4xl mb-2"></i>
                        <p>Нет данных о членах семьи</p>
                      </div>
                    )}
                            </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'identity' && (
            <div className="space-y-6">
              {/* Дополнительные удостоверения */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">Дополнительные удостоверения</h4>
                {(() => {
                  const tuData = getTuData();
                  const additionalIds = tuData.additionalIds || [];
                  
                  if (additionalIds.length > 0) {
                    return (
                      <div className="space-y-4">
                        {additionalIds.map((id: any, index: number) => (
                          <div key={index} className="border border-neutral-200 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Тип удостоверения</label>
                                  <p className="text-sm text-neutral-900">{id.type || 'Не указан'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Серия</label>
                                  <p className="text-sm text-neutral-900 font-mono">{id.series || 'Не указана'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Номер</label>
                                  <p className="text-sm text-neutral-900 font-mono">{id.number || 'Не указан'}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Орган выдачи</label>
                                  <p className="text-sm text-neutral-900">{id.issuingAuthority || 'Не указан'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Дата выдачи</label>
                                  <p className="text-sm text-neutral-900">{id.issueDate ? formatDate(id.issueDate) : 'Не указана'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Дата истечения</label>
                                  <p className="text-sm text-neutral-900">{id.expiryDate ? formatDate(id.expiryDate) : 'Не указана'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center text-neutral-500 py-8">
                        <i className="ri-id-card-line text-4xl mb-2"></i>
                        <p>Нет дополнительных удостоверений</p>
                      </div>
                    );
                  }
                })()}
              </div>

            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              {/* Адреса регистрации и проживания */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">Адреса регистрации и проживания</h4>
                {(() => {
                  const tuData = getTuData();
                  const addresses = tuData.addresses || [];
                  
                  if (addresses.length > 0) {
                    return (
                      <div className="space-y-4">
                        {addresses.map((addr: any, index: number) => (
                          <div key={index} className="border border-neutral-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-neutral-900">
                                {addr.type === 'REG' ? 'Адрес регистрации' : 'Фактический адрес'}
                              </h5>
                              {addr.isPrimary && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Основной</span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Улица</label>
                                  <p className="text-sm text-neutral-900">{addr.street || 'Не указана'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Дом</label>
                                  <p className="text-sm text-neutral-900">{addr.house || 'Не указан'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Квартира</label>
                                  <p className="text-sm text-neutral-900">{addr.flat || 'Не указана'}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Регион</label>
                                  <p className="text-sm text-neutral-900">{addr.regionCode || 'Не указан'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Район</label>
                                  <p className="text-sm text-neutral-900">{addr.raionCode || 'Не указан'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Населенный пункт</label>
                                  <p className="text-sm text-neutral-900">{addr.localityCode || 'Не указан'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Почтовый индекс</label>
                                  <p className="text-sm text-neutral-900">{addr.postalCode || 'Не указан'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center text-neutral-500 py-8">
                        <i className="ri-map-pin-line text-4xl mb-2"></i>
                        <p>Нет адресов</p>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Контактная информация */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">Контактная информация</h4>
                {(() => {
                  const tuData = getTuData();
                  const contacts = tuData.contacts || [];
                  
                  if (contacts.length > 0) {
                    return (
                      <div className="space-y-4">
                        {contacts.map((contact: any, index: number) => (
                          <div key={index} className="border border-neutral-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-neutral-900">
                                {contact.type === 'mobile' ? 'Мобильный телефон' : 
                                 contact.type === 'home' ? 'Домашний телефон' :
                                 contact.type === 'email' ? 'Email' : 'Другой контакт'}
                              </h5>
                              {contact.isPrimary && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Основной</span>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium text-neutral-700">Значение</label>
                              <p className="text-sm text-neutral-900 font-mono">{contact.value || 'Не указано'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center text-neutral-500 py-8">
                        <i className="ri-phone-line text-4xl mb-2"></i>
                        <p>Нет контактной информации</p>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          )}


          {activeTab === 'income' && (
            <div className="space-y-6">
              {/* VIII. Совокупный доход и расчет ССДС */}
              {benefitCalculation && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 md:p-6">
                  <h4 className="text-base md:text-lg font-semibold text-blue-900 mb-4">
                    VIII. Совокупный доход и расчет ССДС
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Среднедушевой доход (ССДС)</div>
                      <div className="text-xl font-bold text-blue-900">
                        {benefitCalculation?.perCapitaIncome ? Number(benefitCalculation.perCapitaIncome).toLocaleString() : '0'} сом
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Порог ГМД</div>
                      <div className="text-xl font-bold text-green-900">6,000 сом</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Статус</div>
                      <div className={`text-xl font-bold ${benefitCalculation.perCapitaIncome < 6000 ? 'text-green-900' : 'text-red-900'}`}>
                        {benefitCalculation.perCapitaIncome < 6000 ? 'Право на пособие' : 'Превышен порог ГМД'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* I. Основной доход семьи */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">
                  I. Основной доход семьи
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700">Тип дохода</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700">Сумма</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden sm:table-cell">Источник</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden md:table-cell">Период</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden lg:table-cell">ПИН получателя</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden lg:table-cell">ФИО получателя</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700">Регулярный</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockIncomeData.primaryIncome.map((income: any, index: number) => (
                        <tr key={income.id || index} className="border-b border-neutral-100">
                          <td className="py-2 md:py-3">{getIncomeTypeText(income.type)}</td>
                          <td className="py-2 md:py-3 font-medium">{income.amount ? Number(income.amount).toLocaleString() : '0'} сом</td>
                          <td className="py-2 md:py-3 hidden sm:table-cell">{income.source || '-'}</td>
                          <td className="py-2 md:py-3 hidden md:table-cell">{income.period || '-'}</td>
                          <td className="py-2 md:py-3 hidden lg:table-cell font-mono text-xs">{income.recipientPin || '-'}</td>
                          <td className="py-2 md:py-3 hidden lg:table-cell">{income.recipientFullName || '-'}</td>
                          <td className="py-2 md:py-3">
                            <span className={`px-2 py-1 text-xs rounded ${income.periodicity === 'M' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {income.periodicity === 'M' ? 'Да' : 'Нет'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* II. Обучение (студенты, учащиеся) */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">
                  II. Обучение (студенты, учащиеся)
                </h4>
                <StudentListView familyMembers={familyMembers} />
                
                {/* Информация о расчете с учетом студентов */}
                {benefitCalculation && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-blue-900 mb-3">
                      Расчет пособия с учетом обучающихся
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Доходы студентов:</span>
                        <p className="font-medium text-blue-900">
                          {benefitCalculation.studentIncome ? 
                            `${benefitCalculation.studentIncome.toLocaleString()} сом/мес` : 
                            '0 сом/мес'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700">Расходы на обучение:</span>
                        <p className="font-medium text-blue-900">
                          {benefitCalculation.studentExpenses ? 
                            `${benefitCalculation.studentExpenses.toLocaleString()} сом/мес` : 
                            '0 сом/мес'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700">Студенты в составе семьи:</span>
                        <p className="font-medium text-blue-900">
                          {benefitCalculation.eligibleStudents || 0} чел.
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700">Общий состав семьи:</span>
                        <p className="font-medium text-blue-900">
                          {benefitCalculation.totalFamilyMembers || 0} чел.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* III. Иные доходы семьи */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">
                  III. Иные доходы семьи
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700">Тип дохода</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700">Сумма</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden sm:table-cell">Источник</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden md:table-cell">Период</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden lg:table-cell">ПИН получателя</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden lg:table-cell">ФИО получателя</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700">Регулярный</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockIncomeData.otherIncome.map((income: any, index: number) => (
                        <tr key={income.id || index} className="border-b border-neutral-100">
                          <td className="py-2 md:py-3">{getIncomeTypeText(income.type)}</td>
                          <td className="py-2 md:py-3 font-medium">{income.amount ? Number(income.amount).toLocaleString() : '0'} сом</td>
                          <td className="py-2 md:py-3 hidden sm:table-cell">{income.source || '-'}</td>
                          <td className="py-2 md:py-3 hidden md:table-cell">{income.period || '-'}</td>
                          <td className="py-2 md:py-3 hidden lg:table-cell font-mono text-xs">{income.recipientPin || '-'}</td>
                          <td className="py-2 md:py-3 hidden lg:table-cell">{income.recipientFullName || '-'}</td>
                          <td className="py-2 md:py-3">
                            <span className={`px-2 py-1 text-xs rounded ${income.periodicity === 'M' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {income.periodicity === 'M' ? 'Да' : 'Нет'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* IV. Предпринимательство */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">
                  IV. Предпринимательство
                </h4>
                <div className="space-y-4">
                  {mockIncomeData.entrepreneurship.map((business: any, index: number) => (
                    <div key={business.id || index} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-neutral-900">{business.businessName}</h5>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {business.businessType === 'INDIVIDUAL' ? 'ИП' : 
                           business.businessType === 'TRADE' ? 'Торговля' : 
                           business.businessType}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-500">Регистрационный номер:</span>
                          <p className="font-medium">{business.registrationNumber || business.patentNumber || '-'}</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Лицензия:</span>
                          <p className="font-medium">{business.licenseNumber || '-'}</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Адрес:</span>
                          <p className="font-medium">{business.businessAddress || '-'}</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Владелец:</span>
                          <p className="font-medium">{business.ownerFullName || '-'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-green-50 rounded-lg p-3">
                          <h6 className="font-medium text-green-900 mb-1">Задекларированный доход</h6>
                          <div className="text-lg font-bold text-green-900">
                            {business.declaredIncome ? Number(business.declaredIncome).toLocaleString() : '0'} сом/мес
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <h6 className="font-medium text-blue-900 mb-1">Нормативный доход</h6>
                          <div className="text-lg font-bold text-blue-900">
                            {business.normativeIncome ? Number(business.normativeIncome).toLocaleString() : '0'} сом/мес
                          </div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <h6 className="font-medium text-yellow-900 mb-1">Уплачено налогов</h6>
                          <div className="text-lg font-bold text-yellow-900">
                            {business.taxAmount ? Number(business.taxAmount).toLocaleString() : '0'} сом/мес
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* V. Земельные участки */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">
                  V. Земельные участки
                </h4>
                <div className="space-y-4">
                  {mockIncomeData.landPlots.map((plot: any, index: number) => (
                    <div key={plot.id || index} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-neutral-900">
                          {plot.type === 'irrigated' ? 'Орошаемый участок' : 'Богарный участок'}
                        </h5>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {plot.ownershipType === 'OWNED' ? 'Собственность' : 'Аренда'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-500">Площадь:</span>
                          <p className="font-medium">{plot.area} га</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Местоположение:</span>
                          <p className="font-medium">{plot.location}</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Использование:</span>
                          <p className="font-medium">{plot.usage}</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Владелец:</span>
                          <p className="font-medium">{plot.ownerFullName}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-green-50 rounded-lg p-3">
                          <h6 className="font-medium text-green-900 mb-1">Нормативный доход</h6>
                          <div className="text-lg font-bold text-green-900">
                            {plot.normativeIncome ? Number(plot.normativeIncome).toLocaleString() : '0'} сом/мес
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <h6 className="font-medium text-blue-900 mb-1">Фактический доход</h6>
                          <div className="text-lg font-bold text-blue-900">
                            {plot.actualIncome ? Number(plot.actualIncome).toLocaleString() : '0'} сом/мес
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VI. Подсобное хозяйство (животные, птица, пчёлы) */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">
                  VI. Подсобное хозяйство (животные, птица, пчёлы)
                </h4>
                <div className="space-y-4">
                  {mockIncomeData.livestock.details.map((animal: any, index: number) => (
                    <div key={animal.id || index} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-neutral-900">
                          {animal.type === 'cow' ? 'Крупный рогатый скот' :
                           animal.type === 'sheep' ? 'Мелкий рогатый скот' :
                           animal.type === 'poultry' ? 'Птица' :
                           animal.type === 'bees' ? 'Пчёлы' : animal.type}
                        </h5>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {animal.count} голов
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-500">Количество:</span>
                          <p className="font-medium">{animal.count} голов</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Возраст:</span>
                          <p className="font-medium">{animal.age}</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Продуктивность:</span>
                          <p className="font-medium">{animal.productivity}</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Владелец:</span>
                          <p className="font-medium">{animal.ownerFullName}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="bg-green-50 rounded-lg p-3">
                          <h6 className="font-medium text-green-900 mb-1">Месячный доход</h6>
                          <div className="text-lg font-bold text-green-900">
                            {animal.monthlyIncome ? Number(animal.monthlyIncome).toLocaleString() : '0'} сом/мес
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VII. Банковские вклады и сбережения */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">
                  VII. Банковские вклады и сбережения
                </h4>
                <div className="space-y-4">
                  {mockIncomeData.bankDeposits.map((deposit: any, index: number) => (
                    <div key={deposit.id || index} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-neutral-900">
                          {deposit.depositType === 'SAVINGS' ? 'Сберегательный вклад' :
                           deposit.depositType === 'TERM' ? 'Срочный вклад' :
                           deposit.depositType === 'CURRENT' ? 'Текущий счет' :
                           deposit.depositType === 'INVESTMENT' ? 'Инвестиционный вклад' : deposit.depositType}
                        </h5>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {deposit.bankCode}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-500">Номер счета:</span>
                          <p className="font-medium font-mono">{deposit.accountNumber}</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Сумма вклада:</span>
                          <p className="font-medium">{deposit.depositAmount ? Number(deposit.depositAmount).toLocaleString() : '0'} сом</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Процентная ставка:</span>
                          <p className="font-medium">{deposit.interestRate}% годовых</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Владелец:</span>
                          <p className="font-medium">{deposit.ownerFullName}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-green-50 rounded-lg p-3">
                          <h6 className="font-medium text-green-900 mb-1">Ежемесячные проценты</h6>
                          <div className="text-lg font-bold text-green-900">
                            {deposit.monthlyInterest ? Number(deposit.monthlyInterest).toLocaleString() : '0'} сом/мес
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <h6 className="font-medium text-blue-900 mb-1">Дата открытия</h6>
                          <div className="text-lg font-bold text-blue-900">
                            {deposit.openingDate ? new Date(deposit.openingDate).toLocaleDateString('ru-RU') : '-'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8-категорийный анализ доходов */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h4 className="text-base md:text-lg font-semibold text-neutral-900">8-категорийный анализ доходов</h4>
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <i className="ri-bar-chart-line"></i>
                      <span>Анализ</span>
                      <i className="ri-arrow-down-s-line ml-1"></i>
                    </button>
                    
                    {/* Выпадающее меню */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setIsIncomeAnalysisOpen(true);
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          >
                            <i className="ri-bar-chart-line mr-3"></i>
                            Показать анализ
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Категории доходов */}
                {benefitCalculation && benefitCalculation.incomeBreakdown && Object.keys(benefitCalculation.incomeBreakdown).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {Object.entries(benefitCalculation.incomeBreakdown).map(([category, amount]: [string, any]) => (
                      <div key={category} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{category}</h5>
                          <span className="text-sm text-gray-600">
                            {((amount / benefitCalculation.totalIncome) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-lg font-bold text-blue-900">
                          {amount ? Number(amount).toLocaleString() : '0'} сом
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Общая статистика */}
                {benefitCalculation && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-medium text-blue-900 mb-2">Общий доход семьи</h5>
                      <div className="text-2xl font-bold text-blue-900">
                        {benefitCalculation?.totalIncome ? Number(benefitCalculation.totalIncome).toLocaleString() : '0'} сом
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h5 className="font-medium text-green-900 mb-2">Размер семьи</h5>
                      <div className="text-2xl font-bold text-green-900">
                        {benefitCalculation.familySize} чел.
                      </div>
                    </div>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700">Тип</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700">Сумма</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden sm:table-cell">Источник</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden md:table-cell">Период</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden lg:table-cell">ПИН получателя</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700 hidden lg:table-cell">ФИО получателя</th>
                        <th className="text-left py-2 md:py-3 font-medium text-neutral-700">Регулярный</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getIncomes().map((income: any, index: number) => (
                        <tr key={income.id || index} className="border-b border-neutral-100">
                          <td className="py-2 md:py-3">{income.type || income.incomeTypeCode || 'Не указан'}</td>
                          <td className="py-2 md:py-3 font-medium">{income.amount ? Number(income.amount).toLocaleString() : '0'} сом</td>
                          <td className="py-2 md:py-3 hidden sm:table-cell">{income.source || income.sourceRef || '-'}</td>
                          <td className="py-2 md:py-3 hidden md:table-cell">{income.period || '-'}</td>
                          <td className="py-2 md:py-3 hidden lg:table-cell font-mono text-xs">{income.recipientPin || '-'}</td>
                          <td className="py-2 md:py-3 hidden lg:table-cell">{income.recipientFullName || '-'}</td>
                          <td className="py-2 md:py-3">
                            <span className={`px-2 py-1 text-xs rounded ${income.periodicity === 'M' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {income.periodicity === 'M' ? 'Да' : 'Нет'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {getIncomes().length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-4 text-center text-neutral-500">Нет данных о доходах</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>


              {/* Платежные реквизиты */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">Платежные реквизиты</h4>
                {(() => {
                  const paymentRequisites = getPaymentRequisites();
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Код банка</label>
                          <p className="text-sm text-neutral-900 font-mono">{paymentRequisites.bankCode || 'Не указан'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Лицевой счет</label>
                          <p className="text-sm text-neutral-900 font-mono">{paymentRequisites.personalAccount || 'Не указан'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Банковский счет</label>
                          <p className="text-sm text-neutral-900 font-mono">{paymentRequisites.bankAccount || 'Не указан'}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Карточный счет</label>
                          <p className="text-sm text-neutral-900 font-mono">{paymentRequisites.cardAccount || 'Не указан'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Тип платежа</label>
                          <p className="text-sm text-neutral-900">{paymentRequisites.paymentType || 'Не указан'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Орган соцзащиты и категории */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">Орган соцзащиты и категории</h4>
                {(() => {
                  const tuData = getTuData();
                  const socialAuthority = tuData.socialAuthority || {};
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Муниципальный орган</label>
                          <p className="text-sm text-neutral-900">{socialAuthority.municipalAuthority || 'Не указан'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Тип заявителя</label>
                          <p className="text-sm text-neutral-900">{socialAuthority.applicantType || 'Не указан'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Категория</label>
                          <p className="text-sm text-neutral-900">{socialAuthority.category || 'Не указана'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Категория инвалидности</label>
                          <p className="text-sm text-neutral-900">{socialAuthority.disabilityCategory || 'Не указана'}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Номер справки МСЭК</label>
                          <p className="text-sm text-neutral-900 font-mono">{socialAuthority.msekRefNumber || 'Не указан'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Дата выдачи справки МСЭК</label>
                          <p className="text-sm text-neutral-900">{socialAuthority.msekIssueDate ? formatDate(socialAuthority.msekIssueDate) : 'Не указана'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Номер справки ДСУ</label>
                          <p className="text-sm text-neutral-900 font-mono">{socialAuthority.dsuRefNumber || 'Не указан'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Дата выдачи справки ДСУ</label>
                          <p className="text-sm text-neutral-900">{socialAuthority.dsuIssueDate ? formatDate(socialAuthority.dsuIssueDate) : 'Не указана'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Категории заявителей */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">Категории заявителей</h4>
                {(() => {
                  const categories = getCategories();
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" checked={categories.forChild || false} readOnly className="rounded" />
                          <label className="text-sm text-neutral-700">Для ребенка</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" checked={categories.forFamilyWithChild || false} readOnly className="rounded" />
                          <label className="text-sm text-neutral-700">Для семьи с ребенком</label>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" checked={categories.forMinor || false} readOnly className="rounded" />
                          <label className="text-sm text-neutral-700">Для несовершеннолетнего</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" checked={categories.forIncapacitated || false} readOnly className="rounded" />
                          <label className="text-sm text-neutral-700">Для недееспособного</label>
                        </div>
                      </div>
                    </div>
                  );
                })()}
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

              {/* Требуется ли визит на дом */}
              <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
                <h4 className="text-base md:text-lg font-semibold text-neutral-900 mb-4 md:mb-6">Выездная проверка</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-neutral-700">Требуется ли визит на дом? (нужное подчеркнуть):</label>
                    <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name="homeVisitRequired" 
                          value="yes"
                          checked={homeVisitRequired === true}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setHomeVisitRequired(true);
                              // Обновляем заявку с homeVisitRequired: true
                              const updatedApplication = { ...application, homeVisitRequired: true };
                              // Здесь можно добавить вызов API для сохранения изменений
                              console.log('Заявка помечена для выездной проверки:', updatedApplication);
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-neutral-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-neutral-900">ДА</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name="homeVisitRequired" 
                          value="no"
                          checked={homeVisitRequired === false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setHomeVisitRequired(false);
                              // Обновляем заявку с homeVisitRequired: false
                              const updatedApplication = { ...application, homeVisitRequired: false };
                              // Здесь можно добавить вызов API для сохранения изменений
                              console.log('Заявка НЕ требует выездной проверки:', updatedApplication);
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-neutral-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-neutral-900">НЕТ</span>
                  </div>
                  </div>
                </div>

                  {homeVisitRequired === true && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <i className="ri-information-line text-blue-600"></i>
                        <span className="text-sm font-medium text-blue-900">Требуется выездная проверка</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        Данная заявка требует проведения выездной проверки условий проживания семьи. 
                        Заявка будет отображена в разделе &quot;Выездные проверки&quot; для планирования визита.
                      </p>
                      <div className="mt-3">
                        <button
                          onClick={handleScheduleInspection}
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <i className="ri-calendar-line mr-2"></i>
                          Запланировать проверку
                        </button>
                      </div>
                  </div>
                  )}
                  </div>
                </div>

              {/* Внешние данные - используем тот же компонент что и в разделе "Внешние данные" */}
              {externalData && !externalData.error ? (
                <ExternalDataViewer language="ru" data={externalData} />
              ) : (
                <div className="text-center py-8">
                  <i className="ri-database-2-line text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600">Внешние данные не загружены</p>
                      <button 
                        onClick={loadExternalData}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                    Загрузить данные
                      </button>
                    </div>
              )}
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

      {/* Модальное окно анализа доходов */}
      <IncomeAnalysisModal
        isOpen={isIncomeAnalysisOpen}
        onClose={() => setIsIncomeAnalysisOpen(false)}
        application={application}
      />

      {/* Модальное окно планирования проверки */}
      {isScheduleInspectionOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Планирование выездной проверки</h3>
                <button
                  onClick={handleCancelSchedule}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              
              <ScheduleInspectionForm
                applicationId={application?.id || ''}
                applicantName={(application as any).applicantName || (application as any).formData?.applicant?.fullName || 'Не указан'}
                address={(() => {
                  const addresses = (application as any).formData?.tuData?.addresses || [];
                  if (addresses.length > 0) {
                    const addr = addresses[0];
                    return `${addr.street || ''}, ${addr.house || ''}${addr.flat ? `, кв. ${addr.flat}` : ''}`;
                  }
                  return 'Адрес не указан';
                })()}
                onSubmit={handleScheduleInspectionSubmit}
                onCancel={handleCancelSchedule}
              />
            </div>
          </div>
        </div>
      )}
    </MobileOptimizedModal>
  );
}
