'use client';

import { useState, useEffect } from 'react';
import MobileOptimizedModal from './MobileOptimizedModal';
import StatusBadge from './StatusBadge';
import IncomeAnalysisModal from './IncomeAnalysisModal';
import ExternalDataViewer from './ExternalDataViewer';
import { Application, FamilyMember, Income, Document, InspectionResult } from '@/lib/types';
import { externalApiService } from '@/lib/externalApiService';
import { calculateBenefit, calculatePerCapitaIncome } from '@/lib/benefitCalculator';

interface ApplicationDetailsModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationDetailsModal({ application, isOpen, onClose }: ApplicationDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'applicant' | 'family' | 'identity' | 'addresses' | 'income' | 'property' | 'compensations' | 'inspection' | 'external' | 'history'>('applicant');
  const [isIncomeAnalysisOpen, setIsIncomeAnalysisOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [externalData, setExternalData] = useState<any>(null);
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);
  const [benefitCalculation, setBenefitCalculation] = useState<any>(null);

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
    }
  }, [isOpen, application]);

  const loadExternalData = async () => {
    if (!application) return;
    
    setIsLoadingExternal(true);
    try {
      const applicantPin = (application as any).applicantPin || (application as any).formData?.applicant?.pin;
      if (applicantPin) {
        const data = await externalApiService.getAllDataByPIN(applicantPin);
        setExternalData(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки внешних данных:', error);
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
      
      const calculation = calculateBenefit(
        familyMembers,
        monthlyIncomes,
        landPlots,
        livestock
      );
      
      setBenefitCalculation(calculation);
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

  // Функция экспорта анализа доходов
  const exportIncomeAnalysis = async () => {
    try {
      // Импортируем функцию анализа доходов
      const { analyzeApplicationIncome } = await import('@/lib/incomeAnalysis');
      
      // Получаем данные анализа
      const analysisResult = analyzeApplicationIncome(application);
      
      // Формируем данные для экспорта
      const exportData = {
        applicationId: application.id,
        applicantName: (application as any).applicantName || (application as any).formData?.applicant?.fullName || 'Не указан',
        analysisDate: new Date().toLocaleDateString('ru-RU'),
        totalIncome: analysisResult.totalIncome,
        familySize: analysisResult.analysis.familySize,
        perCapitaIncome: analysisResult.analysis.perCapitaIncome,
        stability: analysisResult.analysis.stability,
        diversification: analysisResult.analysis.diversification,
        gmdThreshold: 4500,
        categories: analysisResult.categories.map((cat: any) => ({
          name: cat.name,
          amount: cat.amount,
          percentage: cat.percentage,
          subcategories: cat.subcategories
        })),
        recommendations: analysisResult.analysis.recommendations
      };

      // Создаем CSV контент
      let csvContent = '8-категорийный анализ доходов\n\n';
      csvContent += `Заявка: ${exportData.applicationId}\n`;
      csvContent += `Заявитель: ${exportData.applicantName}\n`;
      csvContent += `Дата анализа: ${exportData.analysisDate}\n\n`;
      
      csvContent += 'ОБЩИЕ ПОКАЗАТЕЛИ\n';
      csvContent += `Общий доход семьи,сом,${exportData.totalIncome}\n`;
      csvContent += `Размер семьи,человек,${exportData.familySize}\n`;
      csvContent += `ССДС,сом,${exportData.perCapitaIncome}\n`;
      csvContent += `Стабильность,${exportData.stability}\n`;
      csvContent += `Диверсификация,${exportData.diversification}\n`;
      csvContent += `Порог ГМД,сом,${exportData.gmdThreshold}\n\n`;
      
      csvContent += 'КАТЕГОРИИ ДОХОДОВ\n';
      csvContent += 'Категория,Сумма (сом),Процент,Подкатегории\n';
      exportData.categories.forEach((cat: any) => {
        csvContent += `"${cat.name}","${cat.amount}","${cat.percentage}%","${cat.subcategories.join('; ')}"\n`;
      });
      
      csvContent += '\nРЕКОМЕНДАЦИИ\n';
      exportData.recommendations.forEach((rec: any, index: number) => {
        csvContent += `${index + 1}.,${rec}\n`;
      });

      // Создаем и скачиваем файл
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `income_analysis_${application.id}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Показываем уведомление об успехе
      alert('Анализ доходов успешно экспортирован в CSV файл');
    } catch (error) {
      console.error('Ошибка при экспорте анализа:', error);
      alert('Ошибка при экспорте анализа. Попробуйте еще раз.');
    }
  };

  const tabs = [
    { id: 'applicant', label: 'Заявитель', icon: 'ri-user-line' },
    { id: 'family', label: 'Семья', icon: 'ri-group-line' },
    { id: 'identity', label: 'Документы', icon: 'ri-id-card-line' },
    { id: 'addresses', label: 'Адреса и контакты', icon: 'ri-map-pin-line' },
    { id: 'income', label: 'Все доходы', icon: 'ri-money-dollar-circle-line' },
    { id: 'inspection', label: 'Проверка', icon: 'ri-search-eye-line' },
    { id: 'external', label: 'Внешние данные', icon: 'ri-database-2-line' },
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
                                    {member.monthlyIncome ? `${member.monthlyIncome.toLocaleString()} сом` : '0 сом'}
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
            <div className="space-y-4 md:space-y-6">
              {/* Расчет пособия */}
              {benefitCalculation && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 md:p-6">
                  <h4 className="text-base md:text-lg font-semibold text-blue-900 mb-4">Расчет пособия</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Среднедушевой доход</div>
                      <div className="text-xl font-bold text-blue-900">
                        {benefitCalculation.perCapitaIncome.toLocaleString()} сом
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
                          <button
                            onClick={() => {
                              exportIncomeAnalysis();
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          >
                            <i className="ri-download-line mr-3"></i>
                            Экспорт анализа
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Категории доходов */}
                {benefitCalculation && benefitCalculation.incomeBreakdown && (
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
                          {amount.toLocaleString()} сом
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
                        {benefitCalculation.totalIncome.toLocaleString()} сом
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
                          <td className="py-2 md:py-3 font-medium">{income.amount ? income.amount.toLocaleString() : '0'} сом</td>
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





          {activeTab === 'external' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className="ri-database-2-line text-2xl text-blue-600"></i>
                  <h4 className="text-xl font-semibold text-neutral-900">Внешние данные</h4>
                </div>
                <button
                  onClick={loadExternalData}
                  disabled={isLoadingExternal}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <i className={`ri-refresh-line ${isLoadingExternal ? 'animate-spin' : ''}`}></i>
                  <span>{isLoadingExternal ? 'Загрузка...' : 'Обновить'}</span>
                </button>
              </div>

              {isLoadingExternal ? (
                <div className="text-center py-8">
                  <i className="ri-loader-4-line text-4xl text-blue-500 animate-spin mb-4"></i>
                  <p className="text-gray-600">Загрузка внешних данных...</p>
                </div>
              ) : externalData ? (
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

          {activeTab === 'inspection' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center space-x-3">
                <i className="ri-check-line text-2xl text-green-600"></i>
                <h4 className="text-xl font-semibold text-neutral-900">Комплексная проверка внешних данных</h4>
              </div>

              {/* Verification Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* МСЭК */}
                <div className={`border rounded-lg p-6 ${externalData?.msek?.isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${externalData?.msek?.isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                        <i className={`${externalData?.msek?.isSuccess ? 'ri-check-line text-green-600' : 'ri-error-warning-line text-red-600'}`}></i>
                      </div>
                      <h5 className={`text-lg font-semibold ${externalData?.msek?.isSuccess ? 'text-green-900' : 'text-red-900'}`}>МСЭК</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className={`${externalData?.msek?.isSuccess ? 'ri-check-line text-green-600' : 'ri-error-warning-line text-red-600'}`}></i>
                      <button 
                        onClick={loadExternalData}
                        className="text-sm hover:opacity-80 font-medium"
                      >
                        Обновить
                      </button>
                    </div>
                  </div>
                  <div className={`text-sm mb-3 ${externalData?.msek?.isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    {externalData?.msek?.timestamp ? `Проверка: ${new Date(externalData.msek.timestamp).toLocaleString()}` : 'Не проверено'}
                  </div>
                  <div className={`text-sm mb-4 ${externalData?.msek?.isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                    {externalData?.msek?.isSuccess 
                      ? `Данные: ${externalData.msek.data ? 'Инвалидность найдена' : 'Инвалидность не установлена'}`
                      : `Ошибка: ${externalData?.msek?.errorMessage || 'Сервис недоступен'}`
                    }
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${externalData?.msek?.isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    <i className={`${externalData?.msek?.isSuccess ? 'ri-check-line' : 'ri-error-warning-line'}`}></i>
                    <span>{externalData?.msek?.isSuccess ? 'Данные подтверждены' : 'Требует внимания'}</span>
                  </div>
                </div>

                {/* ГРС: Паспорт */}
                <div className={`border rounded-lg p-6 ${externalData?.grsPassport?.isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${externalData?.grsPassport?.isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                        <i className={`${externalData?.grsPassport?.isSuccess ? 'ri-check-line text-green-600' : 'ri-error-warning-line text-red-600'}`}></i>
                      </div>
                      <h5 className={`text-lg font-semibold ${externalData?.grsPassport?.isSuccess ? 'text-green-900' : 'text-red-900'}`}>ГРС: Паспорт</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className={`${externalData?.grsPassport?.isSuccess ? 'ri-check-line text-green-600' : 'ri-error-warning-line text-red-600'}`}></i>
                      <button 
                        onClick={loadExternalData}
                        className="text-sm hover:opacity-80 font-medium"
                      >
                        Обновить
                      </button>
                    </div>
                  </div>
                  <div className={`text-sm mb-3 ${externalData?.grsPassport?.isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    {externalData?.grsPassport?.timestamp ? `Проверка: ${new Date(externalData.grsPassport.timestamp).toLocaleString()}` : 'Не проверено'}
                  </div>
                  <div className={`text-sm mb-4 ${externalData?.grsPassport?.isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                    {externalData?.grsPassport?.isSuccess 
                      ? `Данные: ${externalData.grsPassport.data ? 'Паспортные данные найдены' : 'Данные не найдены'}`
                      : `Ошибка: ${externalData?.grsPassport?.errorMessage || 'Сервис недоступен'}`
                    }
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${externalData?.grsPassport?.isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    <i className={`${externalData?.grsPassport?.isSuccess ? 'ri-check-line' : 'ri-error-warning-line'}`}></i>
                    <span>{externalData?.grsPassport?.isSuccess ? 'Данные подтверждены' : 'Требует внимания'}</span>
                  </div>
                </div>

                {/* СФ: Пенсия */}
                <div className={`border rounded-lg p-6 ${externalData?.sfPension?.isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${externalData?.sfPension?.isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                        <i className={`${externalData?.sfPension?.isSuccess ? 'ri-check-line text-green-600' : 'ri-error-warning-line text-red-600'}`}></i>
                      </div>
                      <h5 className={`text-lg font-semibold ${externalData?.sfPension?.isSuccess ? 'text-green-900' : 'text-red-900'}`}>СФ: Пенсия</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className={`${externalData?.sfPension?.isSuccess ? 'ri-check-line text-green-600' : 'ri-error-warning-line text-red-600'}`}></i>
                      <button 
                        onClick={loadExternalData}
                        className="text-sm hover:opacity-80 font-medium"
                      >
                        Обновить
                      </button>
                    </div>
                  </div>
                  <div className={`text-sm mb-3 ${externalData?.sfPension?.isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    {externalData?.sfPension?.timestamp ? `Проверка: ${new Date(externalData.sfPension.timestamp).toLocaleString()}` : 'Не проверено'}
                  </div>
                  <div className={`text-sm mb-4 ${externalData?.sfPension?.isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                    {externalData?.sfPension?.isSuccess 
                      ? `Данные: ${externalData.sfPension.data ? 'Пенсия найдена' : 'Пенсия не назначена'}`
                      : `Ошибка: ${externalData?.sfPension?.errorMessage || 'Сервис недоступен'}`
                    }
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${externalData?.sfPension?.isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    <i className={`${externalData?.sfPension?.isSuccess ? 'ri-check-line' : 'ri-error-warning-line'}`}></i>
                    <span>{externalData?.sfPension?.isSuccess ? 'Данные подтверждены' : 'Требует внимания'}</span>
                  </div>
                </div>

                {/* Ветеринария */}
                <div className={`border rounded-lg p-6 ${externalData?.veterinary?.isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${externalData?.veterinary?.isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                        <i className={`${externalData?.veterinary?.isSuccess ? 'ri-check-line text-green-600' : 'ri-error-warning-line text-red-600'}`}></i>
                      </div>
                      <h5 className={`text-lg font-semibold ${externalData?.veterinary?.isSuccess ? 'text-green-900' : 'text-red-900'}`}>Ветеринария</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className={`${externalData?.veterinary?.isSuccess ? 'ri-check-line text-green-600' : 'ri-error-warning-line text-red-600'}`}></i>
                      <button 
                        onClick={loadExternalData}
                        className="text-sm hover:opacity-80 font-medium"
                      >
                        Обновить
                      </button>
                    </div>
                  </div>
                  <div className={`text-sm mb-3 ${externalData?.veterinary?.isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    {externalData?.veterinary?.timestamp ? `Проверка: ${new Date(externalData.veterinary.timestamp).toLocaleString()}` : 'Не проверено'}
                  </div>
                  <div className={`text-sm mb-4 ${externalData?.veterinary?.isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                    {externalData?.veterinary?.isSuccess 
                      ? `Данные: ${externalData.veterinary.data ? 'Животные найдены' : 'Животные не зарегистрированы'}`
                      : `Ошибка: ${externalData?.veterinary?.errorMessage || 'Сервис недоступен'}`
                    }
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${externalData?.veterinary?.isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    <i className={`${externalData?.veterinary?.isSuccess ? 'ri-check-line' : 'ri-error-warning-line'}`}></i>
                    <span>{externalData?.veterinary?.isSuccess ? 'Данные подтверждены' : 'Требует внимания'}</span>
                  </div>
                </div>

                {/* ИСРТ: Занятость */}
                <div className={`border rounded-lg p-6 ${externalData?.isrtEmployment?.isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${externalData?.isrtEmployment?.isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                        <i className={`${externalData?.isrtEmployment?.isSuccess ? 'ri-check-line text-green-600' : 'ri-error-warning-line text-red-600'}`}></i>
                      </div>
                      <h5 className={`text-lg font-semibold ${externalData?.isrtEmployment?.isSuccess ? 'text-green-900' : 'text-red-900'}`}>ИСРТ: Занятость</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className={`${externalData?.isrtEmployment?.isSuccess ? 'ri-check-line text-green-600' : 'ri-error-warning-line text-red-600'}`}></i>
                      <button 
                        onClick={loadExternalData}
                        className="text-sm hover:opacity-80 font-medium"
                      >
                        Обновить
                      </button>
                    </div>
                  </div>
                  <div className={`text-sm mb-3 ${externalData?.isrtEmployment?.isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    {externalData?.isrtEmployment?.timestamp ? `Проверка: ${new Date(externalData.isrtEmployment.timestamp).toLocaleString()}` : 'Не проверено'}
                  </div>
                  <div className={`text-sm mb-4 ${externalData?.isrtEmployment?.isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                    {externalData?.isrtEmployment?.isSuccess 
                      ? `Данные: ${externalData.isrtEmployment.data ? 'Статус занятости найден' : 'Данные не найдены'}`
                      : `Ошибка: ${externalData?.isrtEmployment?.errorMessage || 'Сервис недоступен'}`
                    }
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${externalData?.isrtEmployment?.isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    <i className={`${externalData?.isrtEmployment?.isSuccess ? 'ri-check-line' : 'ri-error-warning-line'}`}></i>
                    <span>{externalData?.isrtEmployment?.isSuccess ? 'Данные подтверждены' : 'Требует внимания'}</span>
                  </div>
                </div>

                {/* ГНС: ИП */}
                <div className={`border rounded-lg p-6 ${externalData?.gnsIndividualEntrepreneur?.isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${externalData?.gnsIndividualEntrepreneur?.isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                        <i className={`${externalData?.gnsIndividualEntrepreneur?.isSuccess ? 'ri-check-line text-green-600' : 'ri-error-warning-line text-red-600'}`}></i>
                      </div>
                      <h5 className={`text-lg font-semibold ${externalData?.gnsIndividualEntrepreneur?.isSuccess ? 'text-green-900' : 'text-red-900'}`}>ГНС: ИП</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className={`${externalData?.gnsIndividualEntrepreneur?.isSuccess ? 'ri-check-line text-green-600' : 'ri-error-warning-line text-red-600'}`}></i>
                      <button 
                        onClick={loadExternalData}
                        className="text-sm hover:opacity-80 font-medium"
                      >
                        Обновить
                      </button>
                    </div>
                  </div>
                  <div className={`text-sm mb-3 ${externalData?.gnsIndividualEntrepreneur?.isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    {externalData?.gnsIndividualEntrepreneur?.timestamp ? `Проверка: ${new Date(externalData.gnsIndividualEntrepreneur.timestamp).toLocaleString()}` : 'Не проверено'}
                  </div>
                  <div className={`text-sm mb-4 ${externalData?.gnsIndividualEntrepreneur?.isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                    {externalData?.gnsIndividualEntrepreneur?.isSuccess 
                      ? `Данные: ${externalData.gnsIndividualEntrepreneur.data ? 'ИП найден' : 'ИП не зарегистрирован'}`
                      : `Ошибка: ${externalData?.gnsIndividualEntrepreneur?.errorMessage || 'Сервис недоступен'}`
                    }
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${externalData?.gnsIndividualEntrepreneur?.isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    <i className={`${externalData?.gnsIndividualEntrepreneur?.isSuccess ? 'ri-check-line' : 'ri-error-warning-line'}`}></i>
                    <span>{externalData?.gnsIndividualEntrepreneur?.isSuccess ? 'Данные подтверждены' : 'Требует внимания'}</span>
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

      {/* Модальное окно анализа доходов */}
      <IncomeAnalysisModal
        isOpen={isIncomeAnalysisOpen}
        onClose={() => setIsIncomeAnalysisOpen(false)}
        application={application}
      />
    </MobileOptimizedModal>
  );
}
