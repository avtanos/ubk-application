
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockApplications } from '@/lib/mockData';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import MetricCard from '@/components/ui/MetricCard';
import NavigationTabs from '@/components/ui/NavigationTabs';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import ScheduleInspectionForm from '@/components/ui/ScheduleInspectionForm';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ApplicationStatus } from '@/lib/types';
import inspectionService from '@/lib/api/inspectionService';

export default function SpecialistDashboard() {
  const [language, setLanguage] = useState('ru');
  const [activeTab, setActiveTab] = useState('queue');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug effect for modal states
  useEffect(() => {
    console.log('Modal states changed:', { showCalendarModal, showScheduleModal });
  }, [showCalendarModal, showScheduleModal]);

  const t = translations[language as keyof typeof translations];

  // Debug log
  console.log('SpecialistDashboard render:', { activeTab, showCalendarModal, showScheduleModal });

  // Enhanced application data with priority and risk scoring
  const enhancedApplications = mockApplications.map(app => ({
    ...app,
    familyHead: app.applicantName,
    childrenCount: app.familyMembers.filter(member => member.relationship === 'child').length,
    region: app.address.split(',')[0] || 'Бишкек',
    submissionDate: new Date().toLocaleDateString('ru-RU'),
    priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    riskScore: Math.floor(Math.random() * 100),
    processingTime: Math.floor(Math.random() * 10) + 1,
    duplicateRisk: Math.random() > 0.9,
    externalChecksComplete: Math.random() > 0.3,
    documentsComplete: Math.random() > 0.2
  }));

  const filteredApplications = enhancedApplications.filter(app => {
    const matchesSearch = (app.familyHead || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || app.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      case 'risk':
        return b.riskScore - a.riskScore;
      case 'date':
      default:
        return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
    }
  });

  const handleInspectionClick = (applicationId: string) => {
    setSelectedApplication(applicationId);
    setShowInspectionModal(true);
  };

  const handleScheduleInspection = async (applicationId: string) => {
    const application = enhancedApplications.find(app => app.id === applicationId);
    setSelectedApplication(application);
    setShowScheduleModal(true);
  };

  const handleScheduleInspectionSubmit = async (formData: any) => {
    try {
      await inspectionService.createInspection({
        ...formData,
        applicationId: selectedApplication?.id || 0
      });
      setShowScheduleModal(false);
      setSelectedApplication(null);
      // Обновить статус заявления
      // await updateApplicationStatus(selectedApplication, 'INSPECTION_ASSIGNED');
    } catch (error) {
      console.error('Ошибка создания проверки:', error);
    }
  };


  const handleDecisionClick = (applicationId: string) => {
    setSelectedApplication(applicationId);
    setShowDecisionModal(true);
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'transfer') => {
    if (selectedApplications.length === 0) {
      alert(language === 'ru' ? 'Выберите заявки для обработки' : 'Иштетүү үчүн арыздарды тандаңыз');
      return;
    }

    setShowBulkModal(true);
  };

  const processBulkAction = async (action: 'approve' | 'reject', reason: string = '') => {
    setIsProcessing(true);

    // Имитация обработки заявок
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Здесь была бы реальная обработка заявок
    console.log(`Bulk ${action} for applications:`, selectedApplications, 'Reason:', reason);

    setSelectedApplications([]);
    setShowBulkModal(false);
    setIsProcessing(false);

    alert(language === 'ru'
      ? `Успешно обработано ${selectedApplications.length} заявок`
      : `${selectedApplications.length} арыз ийгиликтүү иштетилди`);
  };

  const toggleApplicationSelection = (applicationId: string) => {
    setSelectedApplications(prev =>
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      inReview: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paymentProcessing: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      ru: {
        draft: 'Черновик',
        submitted: 'Подана',
        inReview: 'На рассмотрении',
        approved: 'Одобрена',
        rejected: 'Отклонена',
        paymentProcessing: 'Обработка платежа'
      },
      ky: {
        draft: 'Долбоор',
        submitted: 'Берилди',
        inReview: 'Карап жатат',
        approved: 'Бекитилди',
        rejected: 'Четке кагылды',
        paymentProcessing: 'Төлөмдү иштетүү'
      }
    };
    return statusTexts[language as keyof typeof statusTexts]?.[status as keyof typeof statusTexts.ru] || status;
  };

  const tabs = [
    { id: 'queue', label: language === 'ru' ? 'Очередь заявок' : 'Арыздардын кезеги', icon: <i className="ri-file-list-3-line"></i> },
    { id: 'review', label: language === 'ru' ? 'Детальный обзор' : 'Деталдуу көрүү', icon: <i className="ri-search-eye-line"></i> },
    { id: 'inspections', label: language === 'ru' ? 'Выездные проверки' : 'Талаага чыгуу', icon: <i className="ri-car-line"></i> },
    { id: 'bulk', label: language === 'ru' ? 'Массовая обработка' : 'Массалык иштетүү', icon: <i className="ri-stack-line"></i> },
    { id: 'analytics', label: language === 'ru' ? 'Аналитика' : 'Аналитика', icon: <i className="ri-bar-chart-line"></i> }
  ];

  const mockInspections = [
    {
      id: 'INS-001',
      familyHead: 'Айжан Абдуллаева',
      address: 'г. Бишкек, ул. Манаса 45',
      scheduledDate: '2024-01-25',
      status: 'scheduled',
      inspector: 'Нурбек Жумабеков',
      priority: 'high',
      estimatedDuration: '2 hours'
    },
    {
      id: 'INS-002',
      familyHead: 'Гүлнара Осмонова',
      address: 'Нарын, с. Ак-Талаа',
      scheduledDate: '2024-01-26',
      status: 'completed',
      inspector: 'Айгүл Касымова',
      priority: 'medium',
      estimatedDuration: '1.5 hours'
    }
  ];

  // Analytics data
  const performanceData = [
    { month: 'Янв', processed: 145, approved: 112, rejected: 23, avgTime: 3.2 },
    { month: 'Фев', processed: 167, approved: 128, rejected: 28, avgTime: 2.8 },
    { month: 'Мар', processed: 189, approved: 145, rejected: 31, avgTime: 3.1 },
    { month: 'Апр', processed: 203, approved: 156, rejected: 35, avgTime: 2.9 },
    { month: 'Май', processed: 234, approved: 178, rejected: 42, avgTime: 3.3 },
    { month: 'Июн', processed: 247, approved: 189, rejected: 45, avgTime: 3.0 }
  ];

  const riskDistribution = [
    { name: language === 'ru' ? 'Низкий риск' : 'Төмөнкү тобокелдик', value: 65, color: '#10B981' },
    { name: language === 'ru' ? 'Средний риск' : 'Орточо тобокелдик', value: 25, color: '#F59E0B' },
    { name: language === 'ru' ? 'Высокий риск' : 'Жогорку тобокелдик', value: 10, color: '#EF4444' }
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="ri-government-line text-2xl text-white"></i>
          </div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="container-responsive py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                <div className="w-16 h-16 bg-brand-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <i className="ri-government-line text-3xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">{t.specialistDashboard}</h1>
                  <p className="text-sm text-neutral-600 font-medium">
                    {language === 'ru' ? 'Расширенная рабочая панель специалиста' : 'Кеңейтилген адистин жумуш панели'}
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <Link href="/citizen/calculator" className="border border-red-600 text-red-600 bg-white px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center whitespace-nowrap">
                <i className="ri-calculator-line mr-2"></i>
                Калькулятор пособия
              </Link>
              <Link href="/citizen/new-application" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center whitespace-nowrap">
                <i className="ri-file-add-line mr-2"></i>
                Форма заявки
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-red-600"></i>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900">Нурбек Жумабеков</p>
                  <p className="text-xs text-neutral-600">Специалист</p>
                </div>
              </div>
              <LanguageSwitcher 
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container-responsive py-8">
        {/* Enhanced Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title={language === 'ru' ? 'В очереди' : 'Кезекте'}
            value="12"
            change={{ value: '+3 за день', type: 'positive' }}
            icon={<i className="ri-file-list-3-line text-4xl text-blue-600"></i>}
          />
          <MetricCard
            title={language === 'ru' ? 'На рассмотрении' : 'Карап жатат'}
            value="8"
            change={{ value: '-2 за день', type: 'negative' }}
            icon={<i className="ri-time-line text-4xl text-yellow-600"></i>}
          />
          <MetricCard
            title={language === 'ru' ? 'Одобрено сегодня' : 'Бүгүн бекитилди'}
            value="45"
            change={{ value: '+12 за день', type: 'positive' }}
            icon={<i className="ri-check-line text-4xl text-green-600"></i>}
          />
          <MetricCard
            title={language === 'ru' ? 'Проверки завтра' : 'Эртең текшерүүлөр'}
            value="3"
            change={{ value: 'Запланировано', type: 'neutral' }}
            icon={<i className="ri-car-line text-4xl text-red-600"></i>}
          />
          <MetricCard
            title={language === 'ru' ? 'Дней среднее' : 'Күн орточо'}
            value="2.8"
            change={{ value: '-0.3 дня', type: 'positive' }}
            icon={<i className="ri-speed-line text-4xl text-purple-600"></i>}
          />
          <MetricCard
            title={language === 'ru' ? 'Высокий риск' : 'Жогорку тобокелдик'}
            value="4"
            change={{ value: '-1 за неделю', type: 'positive' }}
            icon={<i className="ri-alert-line text-4xl text-orange-600"></i>}
          />
        </div>

        {/* Main Content */}
        <div className="card">
          {/* Tab Navigation */}
          <div className="mb-6">
            <NavigationTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Enhanced Application Queue */}
            {activeTab === 'queue' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Приоритизированная очередь заявок' : 'Приоритеттүү арыздардын кезеги'}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="text"
                        placeholder={language === 'ru' ? 'Поиск по имени или ID...' : 'Ысым же ID боюнча издөө...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-64"
                      />
                    </div>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-8"
                    >
                      <option value="all">{language === 'ru' ? 'Все статусы' : 'Бардык абалдар'}</option>
                      <option value="submitted">{language === 'ru' ? 'Поданные' : 'Берилгендер'}</option>
                      <option value="inReview">{language === 'ru' ? 'На рассмотрении' : 'Карап жатат'}</option>
                    </select>

                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-8"
                    >
                      <option value="all">{language === 'ru' ? 'Все приоритеты' : 'Бардык приоритеттер'}</option>
                      <option value="high">{language === 'ru' ? 'Высокий' : 'Жогорку'}</option>
                      <option value="medium">{language === 'ru' ? 'Средний' : 'Орточо'}</option>
                      <option value="low">{language === 'ru' ? 'Низкий' : 'Төмөнкү'}</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-8"
                    >
                      <option value="date">{language === 'ru' ? 'По дате' : 'Күн боюнча'}</option>
                      <option value="priority">{language === 'ru' ? 'По приоритету' : 'Приоритет боюнча'}</option>
                      <option value="risk">{language === 'ru' ? 'По риску' : 'Тобокелдик боюнча'}</option>
                    </select>

                    {selectedApplications.length > 0 && (
                      <button
                        onClick={() => handleBulkAction('approve')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-stack-line mr-2"></i>
                        {language === 'ru' ? `Массовые действия (${selectedApplications.length})` : `Массалык аракеттер (${selectedApplications.length})`}
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedApplications(sortedApplications.map(app => app.id));
                              } else {
                                setSelectedApplications([]);
                              }
                            }}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Заявка' : 'Арыз'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Заявитель' : 'Арыз берүүчү'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Приоритет' : 'Приоритет'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Риск' : 'Тобокелдик'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Статус' : 'Абал'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Время' : 'Убакыт'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Действия' : 'Аракеттер'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedApplications.map((application) => (
                        <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <input
                              type="checkbox"
                              checked={selectedApplications.includes(application.id)}
                              onChange={() => toggleApplicationSelection(application.id)}
                              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{application.id}</div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              <span>{application.childrenCount} {language === 'ru' ? 'детей' : 'бала'}</span>
                              {application.duplicateRisk && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                                  {language === 'ru' ? 'Дубликат?' : 'Кайталануу?'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{application.familyHead}</div>
                            <div className="text-sm text-gray-500">{application.region}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(application.priority)}`}>
                              {application.priority === 'high' ? (language === 'ru' ? 'Высокий' : 'Жогорку') :
                                application.priority === 'medium' ? (language === 'ru' ? 'Средний' : 'Орточо') :
                                  (language === 'ru' ? 'Низкий' : 'Төмөнкү')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className={`font-semibold ${getRiskColor(application.riskScore)}`}>
                              {application.riskScore}%
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              {getStatusText(application.status)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-700">{application.processingTime} {language === 'ru' ? 'дней' : 'күн'}</div>
                            <div className="text-xs text-gray-500">{application.submissionDate}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {application.status === 'pending' && (
                                <button
                                  onClick={() => handleDecisionClick(application.id)}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 whitespace-nowrap cursor-pointer"
                                >
                                  {language === 'ru' ? 'Решение' : 'Чечим'}
                                </button>
                              )}
                              {application.status === 'pending' && application.riskScore > 70 && (application as any).homeVisitRequired && (
                                <button
                                  onClick={() => handleScheduleInspection(application.id)}
                                  className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 whitespace-nowrap cursor-pointer"
                                >
                                  {language === 'ru' ? 'Назначить проверку' : 'Текшерүү тапшыр'}
                                </button>
                              )}
                              <button
                                onClick={() => handleInspectionClick(application.id)}
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-200 whitespace-nowrap cursor-pointer"
                              >
                                {language === 'ru' ? 'Детали' : 'Деталдар'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {activeTab === 'queue' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    {language === 'ru' ? 'Массовые операции' : 'Массалык операциялар'}
                  </h3>
                  <div className="text-sm text-gray-600">
                    {language === 'ru' ? 'Выбрано:' : 'Тандалды:'} {selectedApplications.length}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    disabled={selectedApplications.length === 0}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <i className="ri-check-line mr-2"></i>
                    {language === 'ru' ? `Массовое одобрение (${selectedApplications.length} заявок)` : `Массалык бекитүү (${selectedApplications.length} арыз)`}
                  </button>

                  <button
                    onClick={() => handleBulkAction('reject')}
                    disabled={selectedApplications.length === 0}
                    className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <i className="ri-close-line mr-2"></i>
                    {language === 'ru' ? 'Массовое отклонение' : 'Массалык четке кагуу'}
                  </button>

                  <button
                    onClick={() => handleBulkAction('transfer')}
                    disabled={selectedApplications.length === 0}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <i className="ri-share-forward-line mr-2"></i>
                    {language === 'ru' ? 'Передать другому' : 'Башкага өткөрүү'}
                  </button>
                </div>
              </div>
            )}

            {/* Detailed Review Interface */}
            {activeTab === 'review' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'ru' ? 'Детальная оценка семьи с внешними данными' : 'Тышкы маалыматтар менен үй-бүлөнү деталдуу баалоо'}
                </h3>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Family Assessment */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <i className="ri-team-line mr-3 text-blue-600"></i>
                        {language === 'ru' ? 'Состав семьи' : 'Үй-бүлөнүн курамы'}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <div className="font-medium">Айжан Сулайманова</div>
                            <div className="text-sm text-gray-600">Мать, 32 года</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">15,000 сом</div>
                            <div className="text-xs text-gray-500">Зарплата</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <div className="font-medium">Азиза Сулайманова</div>
                            <div className="text-sm text-gray-600">Дочь, 12 лет</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-600">0 сом</div>
                            <div className="text-xs text-gray-500">Ребенок</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <i className="ri-money-dollar-circle-line mr-3 text-green-600"></i>
                        {language === 'ru' ? 'Анализ доходов' : 'Кирешелерди талдоо'}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Общий доход' : 'Жалпы киреше'}</div>
                          <div className="text-2xl font-bold text-gray-900" suppressHydrationWarning={true}>15,000 сом</div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'На человека' : 'Адамга'}</div>
                          <div className="text-2xl font-bold text-gray-900" suppressHydrationWarning={true}>7,500 сом</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <i className="ri-file-text-line mr-3 text-purple-600"></i>
                        {language === 'ru' ? 'Статус документов' : 'Документтердин абалы'}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{language === 'ru' ? 'Паспорт главы семьи' : 'Үй-бүлө башчысынын паспорту'}</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {language === 'ru' ? 'Проверен' : 'Текшерилди'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{language === 'ru' ? 'Справки о доходах' : 'Кирешелер жөнүндө справкалар'}</span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            {language === 'ru' ? 'Требует проверки' : 'Текшерүү талап кылынат'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{language === 'ru' ? 'Свидетельства о рождении' : 'Туулган күбөлүктөр'}</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {language === 'ru' ? 'Проверен' : 'Текшерилди'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* External Data Panel */}
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4 text-blue-900">
                        {language === 'ru' ? 'Внешние данные' : 'Тышкы маалыматтар'}
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">Tunduk</span>
                            <i className="ri-check-line text-green-600"></i>
                          </div>
                          <div className="text-xs text-gray-600">
                            {language === 'ru' ? 'Личность подтверждена' : 'Жеке маалымат ырасталды'}
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{language === 'ru' ? 'Налоговая' : 'Салык кызматы'}</span>
                            <i className="ri-check-line text-green-600"></i>
                          </div>
                          <div className="text-xs text-gray-600">
                            {language === 'ru' ? 'Доходы: 15,000 сом/мес' : 'Кирешелер: 15,000 сом/ай'}
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{language === 'ru' ? 'Банки' : 'Банктар'}</span>
                            <i className="ri-alert-line text-yellow-600"></i>
                          </div>
                          <div className="text-xs text-gray-600">
                            {language === 'ru' ? 'Депозиты: 45,000 сом' : 'Депозиттер: 45,000 сом'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4 text-green-900">
                        {language === 'ru' ? 'Расчет пособия' : 'Жөлөкпулду эсептөө'}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">{language === 'ru' ? 'Детей до 16:' : '16га чейинки балдар:'}</span>
                          <span className="font-semibold">1</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{language === 'ru' ? 'Базовая ставка:' : 'Негизги ставка:'}</span>
                          <span className="font-semibold">1,200 сом</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{language === 'ru' ? 'Коэффициент:' : 'Коэффициент:'}</span>
                          <span className="font-semibold">1.0x</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between">
                            <span className="font-semibold">{language === 'ru' ? 'Итого:' : 'Жалпы:'}</span>
                            <span className="font-bold text-green-600" suppressHydrationWarning={true}>0 сом</span>
                          </div>
                          <div className="text-xs text-red-600 mt-1">
                            {language === 'ru' ? 'Превышен порог ГМД' : 'ГМКнын босогосу ашты'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Field Inspections */}
            {activeTab === 'inspections' && (
              <div>
                {/* Debug info */}
                <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-sm rounded">
                  Debug: activeTab = {activeTab}, showCalendarModal = {showCalendarModal.toString()}, showScheduleModal = {showScheduleModal.toString()}
                </div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Планирование и управление выездными проверками' : 'Талаага чыгуу текшерүүлөрүн пландаштыруу жана башкаруу'}
                  </h3>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => {
                        console.log('Calendar button clicked');
                        setShowCalendarModal(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 inline-flex items-center whitespace-nowrap cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <i className="ri-calendar-2-line mr-2"></i>
                      {language === 'ru' ? 'Календарь проверок' : 'Текшерүүлөрдүн календары'}
                    </button>
                    <button 
                      onClick={() => {
                        console.log('Schedule button clicked');
                        setShowScheduleModal(true);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 active:bg-red-800 inline-flex items-center whitespace-nowrap cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <i className="ri-calendar-line mr-2"></i>
                      {language === 'ru' ? 'Запланировать проверку' : 'Текшерүү пландаштыруу'}
                    </button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-blue-900">{language === 'ru' ? 'Запланировано' : 'Пландаштырылды'}</h4>
                      <i className="ri-calendar-line text-2xl text-blue-600"></i>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">5</div>
                    <div className="text-sm text-blue-700">{language === 'ru' ? 'на эту неделю' : 'бул жумага'}</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-green-900">{language === 'ru' ? 'Завершено' : 'Аткарылды'}</h4>
                      <i className="ri-check-line text-2xl text-green-600"></i>
                    </div>
                    <div className="text-3xl font-bold text-green-600">12</div>
                    <div className="text-sm text-green-700">{language === 'ru' ? 'в этом месяце' : 'бул айда'}</div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-yellow-900">{language === 'ru' ? 'Среднее время' : 'Орточо убакыт'}</h4>
                      <i className="ri-time-line text-2xl text-yellow-600"></i>
                    </div>
                    <div className="text-3xl font-bold text-yellow-600">1.8</div>
                    <div className="text-sm text-yellow-700">{language === 'ru' ? 'часа на проверку' : 'саат текшерүүгө'}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockInspections.map((inspection) => (
                    <div key={inspection.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-gray-900">{inspection.id}</h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              inspection.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {inspection.status === 'completed'
                              ? (language === 'ru' ? 'Завершено' : 'Аткарылды')
                              : (language === 'ru' ? 'Запланировано' : 'Пландаштырылды')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inspection.priority)}`}>
                            {inspection.priority === 'high' ? (language === 'ru' ? 'Высокий' : 'Жогорку') :
                              inspection.priority === 'medium' ? (language === 'ru' ? 'Средний' : 'Орточо') :
                                (language === 'ru' ? 'Низкий' : 'Төмөнкү')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm transition-colors whitespace-nowrap cursor-pointer">
                            <i className="ri-map-pin-line mr-1"></i>
                            {language === 'ru' ? 'Маршрут' : 'Багыт'}
                          </button>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors whitespace-nowrap cursor-pointer">
                            <i className="ri-edit-line mr-1"></i>
                            {language === 'ru' ? 'Редактировать' : 'Түзөтүү'}
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            {language === 'ru' ? 'Семья:' : 'Үй-бүлө:'}
                          </span>
                          <br />
                          <span className="text-gray-900">{inspection.familyHead}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            {language === 'ru' ? 'Адрес:' : 'Дарек:'}
                          </span>
                          <br />
                          <span className="text-gray-900">{inspection.address}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            {language === 'ru' ? 'Дата и время:' : 'Күн жана убакыт:'}
                          </span>
                          <br />
                          <span className="text-gray-900">{inspection.scheduledDate}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            {language === 'ru' ? 'Длительность:' : 'Узактыгы:'}
                          </span>
                          <br />
                          <span className="text-gray-900">{inspection.estimatedDuration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bulk Processing */}
            {activeTab === 'bulk' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'ru' ? 'Эффективная обработка множественных заявок' : 'Көптөгөн арыздарды эффективдүү иштетүү'}
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <i className="ri-stack-line mr-3 text-blue-600"></i>
                      {language === 'ru' ? 'Массовые операции' : 'Массалык операциялар'}
                    </h4>
                    <div className="space-y-4">
                      <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                        <i className="ri-check-line mr-2"></i>
                        {language === 'ru' ? 'Массовое одобрение (12 заявок)' : 'Массалык бекитүү (12 арыз)'}
                      </button>

                      <button className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                        <i className="ri-close-line mr-2"></i>
                        {language === 'ru' ? 'Массовое отклонение (3 заявки)' : 'Массалык четке кагуу (3 арыз)'}
                      </button>

                      <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                        <i className="ri-file-transfer-line mr-2"></i>
                        {language === 'ru' ? 'Передать другому специалисту' : 'Башка адиске өткөрүү'}
                      </button>

                      <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                        <i className="ri-calendar-check-line mr-2"></i>
                        {language === 'ru' ? 'Запланировать проверки (8 заявок)' : 'Текшерүүлөрдү пландаштыруу (8 арыз)'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <i className="ri-filter-line mr-3 text-green-600"></i>
                      {language === 'ru' ? 'Умные фильтры' : 'Акылдуу чыпкалар'}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm">{language === 'ru' ? 'Низкий риск + полные документы' : 'Төмөнкү тобокелдик + толук документтер'}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">15</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm">{language === 'ru' ? 'Превышение ГМД' : 'ГМКны ашуу'}</span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">7</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm">{language === 'ru' ? 'Требуют проверки документов' : 'Документтерди текшерүү талап кылынат'}</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">23</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm">{language === 'ru' ? 'Возможные дубликаты' : 'Мүмкүн болгон кайталануулар'}</span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">4</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-lg p-6 border">
                  <h4 className="text-lg font-semibold mb-4">
                    {language === 'ru' ? 'Статистика обработки' : 'Иштетүү статистикасы'}
                  </h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">247</div>
                      <div className="text-sm text-gray-600">{language === 'ru' ? 'Обработано за месяц' : 'Айда иштетилди'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">189</div>
                      <div className="text-sm text-gray-600">{language === 'ru' ? 'Одобрено' : 'Бекитилди'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">45</div>
                      <div className="text-sm text-gray-600">{language === 'ru' ? 'Отклонено' : 'Четке кагылды'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">2.8</div>
                      <div className="text-sm text-gray-600">{language === 'ru' ? 'Дней среднее' : 'Күн орточо'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Dashboard */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">
                  {language === 'ru' ? 'Показатели производительности и управление нагрузкой' : 'Өндүрүмдүүлүк көрсөткүчтөрү жана жүктү башкаруу'}
                </h3>

                {/* Performance Charts */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg p-6 border">
                    <h4 className="text-lg font-semibold mb-4">
                      {language === 'ru' ? 'Динамика обработки заявок' : 'Арыздарды иштетүү динамикасы'}
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="processed" stroke="#EF4444" name={language === 'ru' ? 'Обработано' : 'Иштетилди'} />
                        <Line type="monotone" dataKey="approved" stroke="#10B981" name={language === 'ru' ? 'Одобрено' : 'Бекитилди'} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg p-6 border">
                    <h4 className="text-lg font-semibold mb-4">
                      {language === 'ru' ? 'Распределение рисков' : 'Тобокелдиктердин бөлүштүрүлүшү'}
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={riskDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Processing Time Analysis */}
                <div className="bg-white rounded-lg p-6 border">
                  <h4 className="text-lg font-semibold mb-4">
                    {language === 'ru' ? 'Анализ времени обработки' : 'Иштетүү убакытын талдоо'}
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgTime" fill="#F59E0B" name={language === 'ru' ? 'Среднее время (дни)' : 'Орточо убакыт (күн)'} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Key Performance Indicators */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">{language === 'ru' ? 'Нагрузка' : 'Жүк'}</h4>
                      <i className="ri-dashboard-line text-2xl opacity-80"></i>
                    </div>
                    <div className="text-3xl font-bold mb-2">85%</div>
                    <div className="text-blue-100">{language === 'ru' ? 'от максимальной' : 'максималдуудан'}</div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">{language === 'ru' ? 'Эффективность' : 'Эффективдүүлүк'}</h4>
                      <i className="ri-speed-line text-2xl opacity-80"></i>
                    </div>
                    <div className="text-3xl font-bold mb-2">92%</div>
                    <div className="text-green-100">{language === 'ru' ? 'качество решений' : 'чечимдердин сапаты'}</div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">{language === 'ru' ? 'Соблюдение SLA' : 'SLA сактоо'}</h4>
                      <i className="ri-time-line text-2xl opacity-80"></i>
                    </div>
                    <div className="text-3xl font-bold mb-2">96%</div>
                    <div className="text-yellow-100">{language === 'ru' ? 'в срок' : 'мөөнөтүндө'}</div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>

        {/* Decision Modal */}
        {showDecisionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Принятие решения по заявке' : 'Арыз боюнча чечим кабыл алуу'}
                  </h3>
                  <button
                    onClick={() => setShowDecisionModal(false)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer"
                  >
                    <i className="ri-close-line text-gray-600"></i>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-4">
                    {language === 'ru' ? 'Инструменты принятия решений' : 'Чечим кабыл алуу куралдары'}
                  </h4>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <button className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                      <i className="ri-check-line mr-2 text-xl"></i>
                      <div className="text-left">
                        <div className="font-semibold">{language === 'ru' ? 'Одобрить' : 'Бекитүү'}</div>
                        <div className="text-sm opacity-90">{language === 'ru' ? 'Все требования выполнены' : 'Бардык талаптар аткарылды'}</div>
                      </div>
                    </button>

                    <button className="bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                      <i className="ri-close-line mr-2 text-xl"></i>
                      <div className="text-left">
                        <div className="font-semibold">{language === 'ru' ? 'Отклонить' : 'Четке кагуу'}</div>
                        <div className="text-sm opacity-90">{language === 'ru' ? 'С указанием причины' : 'Себебин көрсөтүү менен'}</div>
                      </div>
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h5 className="font-semibold mb-3">{language === 'ru' ? 'Коды причин отклонения:' : 'Четке кагуу себептеринин коддору:'}</h5>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <input type="radio" name="reason" value="income_exceeded" className="text-red-600" />
                        <span>{language === 'ru' ? 'R001: Превышение ГМД' : 'R001: ГМКны ашуу'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" name="reason" value="incomplete_docs" className="text-red-600" />
                        <span>{language === 'ru' ? 'R002: Неполные документы' : 'R002: Толук эмес документтер'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" name="reason" value="false_info" className="text-red-600" />
                        <span>{language === 'ru' ? 'R003: Ложная информация' : 'R003: Жалган маалымат'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" name="reason" value="duplicate" className="text-red-600" />
                        <span>{language === 'ru' ? 'R004: Дублирование' : 'R004: Кайталануу'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ru' ? 'Комментарий специалиста:' : 'Адистин комментарийи:'}
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={language === 'ru' ? 'Дополнительные комментарии...' : 'Кошумча комментарийлер...'}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDecisionModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                  >
                    {language === 'ru' ? 'Отмена' : 'Жокко чыгаруу'}
                  </button>
                  <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 whitespace-nowrap cursor-pointer">
                    {language === 'ru' ? 'Сохранить решение' : 'Чечимди сактоо'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Action Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {language === 'ru' ? 'Подтверждение массовой операции' : 'Массалык операцияны ырастоо'}
                </h3>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <i className="ri-information-line text-blue-600 mr-2"></i>
                    <span className="font-semibold text-blue-800">
                      {language === 'ru' ? 'Выбранные заявки:' : 'Тандалган арыздар:'}
                    </span>
                  </div>
                  <div className="text-sm text-blue-700">
                    {selectedApplications.length} {language === 'ru' ? 'заявок будет обработано' : 'арыз иштетилет'}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ru' ? 'Причина решения:' : 'Чечимдин себеби:'}
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'ru' ? 'Введите причину...' : 'Себебин киргизиңиз...'}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                  >
                    {language === 'ru' ? 'Отмена' : 'Жокко чыгаруу'}
                  </button>
                  <button
                    onClick={() => processBulkAction('approve')}
                    disabled={isProcessing}
                    className={`flex-1 px-4 py-3 rounded-lg whitespace-nowrap cursor-pointer ${isProcessing ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                    {isProcessing ? (
                      <>
                        <i className="ri-loader-4-line mr-2 animate-spin"></i>
                        {language === 'ru' ? 'Обработка...' : 'Иштетилүүдө...'}
                      </>
                    ) : (
                      <>
                        <i className="ri-check-line mr-2"></i>
                        {language === 'ru' ? 'Одобрить все' : 'Баарын бекитүү'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inspection Modal - Enhanced */}
        {showInspectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Комплексная проверка заявки' : 'Арыздын комплекстүү текшерүүсү'}
                  </h3>
                  <button
                    onClick={() => setShowInspectionModal(false)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer"
                  >
                    <i className="ri-close-line text-gray-600"></i>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* External System Checks */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      {language === 'ru' ? 'Статус внешних интеграций' : 'Тышкы интеграциялардын абалы'}
                    </h4>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <i className="ri-shield-check-line text-green-600"></i>
                          </div>
                          <div>
                            <h5 className="font-semibold">Tunduk</h5>
                            <p className="text-sm text-gray-600">
                              {language === 'ru' ? 'Государственная система идентификации' : 'Мамлекеттик идентификация системасы'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {language === 'ru' ? 'Проверено' : 'Текшерилди'}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">2 мин назад</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <i className="ri-money-dollar-circle-line text-blue-600"></i>
                          </div>
                          <div>
                            <h5 className="font-semibold">
                              {language === 'ru' ? 'Налоговая служба' : 'Салык кызматы'}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {language === 'ru' ? 'Проверка доходов и налоговых обязательств' : 'Кирешелерди жана салык милдеттерин текшерүү'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {language === 'ru' ? 'Проверено' : 'Текшерилди'}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">5 мин назад</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                            <i className="ri-briefcase-line text-yellow-600"></i>
                          </div>
                          <div>
                            <h5 className="font-semibold">
                              {language === 'ru' ? 'Центр занятости' : 'Жумуш борбору'}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {language === 'ru' ? 'Проверка статуса занятости' : 'Жумуш абалын текшерүү'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            {language === 'ru' ? 'Обработка' : 'Иштетилүүдө'}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">Ожидание...</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <i className="ri-bank-line text-purple-600"></i>
                          </div>
                          <div>
                            <h5 className="font-semibold">
                              {language === 'ru' ? 'Банковская система' : 'Банк системасы'}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {language === 'ru' ? 'Проверка банковских счетов и депозитов' : 'Банк эсептерин жана депозиттерин текшерүү'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {language === 'ru' ? 'Проверено' : 'Текшерилди'}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">1 мин назад</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment & Results */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      {language === 'ru' ? 'Оценка рисков и результаты' : 'Тобокелдиктерди баалоо жана жыйынтыктар'}
                    </h4>

                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                            <i className="ri-alert-line text-white text-sm"></i>
                          </div>
                          <h5 className="font-semibold text-red-800">
                            {language === 'ru' ? 'Высокий риск обнаружен' : 'Жогорку тобокелдик табылды'}
                          </h5>
                        </div>
                        <ul className="text-sm text-red-700 space-y-1 ml-11">
                          <li>• {language === 'ru' ? 'Доход на человека превышает ГМД (7,500 > 6,000 сом)' : 'Адамга киреше ГМКны ашат (7,500 > 6,000 сом)'}</li>
                          <li>• {language === 'ru' ? 'Обнаружены банковские депозиты: 45,000 сом' : 'Банк депозиттери табылды: 45,000 сом'}</li>
                          <li>• {language === 'ru' ? 'Несоответствие заявленных и фактических доходов' : 'Көрсөтүлгөн жана чыныгы кирешелердин дал келбестиги'}</li>
                        </ul>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mr-3">
                            <i className="ri-error-warning-line text-white text-sm"></i>
                          </div>
                          <h5 className="font-semibold text-yellow-800">
                            {language === 'ru' ? 'Требует внимания' : 'Көңүл буруу талап кылынат'}
                          </h5>
                        </div>
                        <ul className="text-sm text-yellow-700 space-y-1 ml-11">
                          <li>• {language === 'ru' ? 'Справка о доходах устарела (3+ месяца)' : 'Кирешелер жөнүндө справка эскирген (3+ ай)'}</li>
                          <li>• {language === 'ru' ? 'Требуется обновление семейного состава' : 'Үй-бүлөлүк курамды жаңылоо талап кылынат'}</li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-800 mb-3">
                          {language === 'ru' ? 'Рекомендуемые действия:' : 'Сунушталган аракеттер:'}
                        </h5>
                        <div className="space-y-2">
                          <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm whitespace-nowrap cursor-pointer">
                            {language === 'ru' ? 'Отклонить: Превышение ГМД' : 'Четке кагуу: ГМКны ашуу'}
                          </button>
                          <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm whitespace-nowrap cursor-pointer">
                            {language === 'ru' ? 'Запросить дополнительные документы' : 'Кошумча документтерди суроо'}
                          </button>
                          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap cursor-pointer">
                            {language === 'ru' ? 'Назначить выездную проверку' : 'Талаага чыгуу текшерүүсүн дайындоо'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowInspectionModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                  >
                    {language === 'ru' ? 'Закрыть' : 'Жабуу'}
                  </button>
                  <button
                    onClick={() => {
                      setShowInspectionModal(false);
                      setShowDecisionModal(true);
                    }}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 whitespace-nowrap cursor-pointer"
                  >
                    {language === 'ru' ? 'Принять решение' : 'Чечим кабыл алуу'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Modal */}
        {showCalendarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Календарь проверок' : 'Текшерүүлөрдүн календары'}
                  </h3>
                  <button
                    onClick={() => setShowCalendarModal(false)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer"
                  >
                    <i className="ri-close-line text-gray-600"></i>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Calendar View */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-4">
                      {language === 'ru' ? 'Календарь на январь 2025' : '2025-жылдын январь айынын календары'}
                    </h4>
                    <div className="grid grid-cols-7 gap-1 text-sm">
                      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                        <div key={day} className="p-2 text-center font-medium text-gray-600">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 31 }, (_, i) => {
                        const day = i + 1;
                        const hasInspection = [3, 7, 12, 15, 18, 22, 25, 28].includes(day);
                        return (
                          <div
                            key={day}
                            className={`p-2 text-center cursor-pointer rounded ${
                              hasInspection
                                ? 'bg-red-100 text-red-700 font-semibold'
                                : 'hover:bg-gray-200'
                            }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inspections List */}
                  <div>
                    <h4 className="font-semibold mb-4">
                      {language === 'ru' ? 'Запланированные проверки' : 'Пландаштырылган текшерүүлөр'}
                    </h4>
                    <div className="space-y-3">
                      {[
                        { date: '3 января', time: '10:00', address: 'ул. Чуй 123, кв. 45', status: 'planned' },
                        { date: '7 января', time: '14:00', address: 'ул. Московская 67, кв. 12', status: 'completed' },
                        { date: '12 января', time: '09:00', address: 'ул. Ленина 89, кв. 34', status: 'planned' },
                        { date: '15 января', time: '11:00', address: 'ул. Советская 45, кв. 78', status: 'planned' },
                      ].map((inspection, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{inspection.date}</div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              inspection.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {inspection.status === 'completed'
                                ? (language === 'ru' ? 'Завершено' : 'Аткарылды')
                                : (language === 'ru' ? 'Запланировано' : 'Пландаштырылды')}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            <i className="ri-time-line mr-1"></i>
                            {inspection.time}
                          </div>
                          <div className="text-sm text-gray-600">
                            <i className="ri-map-pin-line mr-1"></i>
                            {inspection.address}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCalendarModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                  >
                    {language === 'ru' ? 'Закрыть' : 'Жабуу'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Запланировать проверку' : 'Текшерүү пландаштыруу'}
                  </h3>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer"
                  >
                    <i className="ri-close-line text-gray-600"></i>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Application Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ru' ? 'Выберите заявку' : 'Арызды тандаңыз'}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="">{language === 'ru' ? 'Выберите заявку...' : 'Арызды тандаңыз...'}</option>
                      <option value="APP-001">APP-001 - Айжан Абдуллаева</option>
                      <option value="APP-002">APP-002 - Талант Абдуллаев</option>
                      <option value="APP-003">APP-003 - Азиза Абдуллаева</option>
                    </select>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ru' ? 'Дата проверки' : 'Текшерүү күнү'}
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ru' ? 'Время проверки' : 'Текшерүү убактысы'}
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  {/* Inspector Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ru' ? 'Ответственный инспектор' : 'Жооптуу инспектор'}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="">{language === 'ru' ? 'Выберите инспектора...' : 'Инспекторду тандаңыз...'}</option>
                      <option value="inspector1">Нурбек Жумабеков</option>
                      <option value="inspector2">Айжан Токтобаева</option>
                      <option value="inspector3">Талант Абдуллаев</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ru' ? 'Примечания' : 'Эскертүүлөр'}
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={language === 'ru' ? 'Дополнительные заметки...' : 'Кошумча эскертүүлөр...'}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                  >
                    {language === 'ru' ? 'Отмена' : 'Жокко чыгаруу'}
                  </button>
                  <button
                    onClick={() => {
                      setShowScheduleModal(false);
                      // Здесь можно добавить логику сохранения
                    }}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 whitespace-nowrap cursor-pointer"
                  >
                    {language === 'ru' ? 'Запланировать' : 'Пландаштыруу'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Schedule Inspection Modal */}
        <Modal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          title={language === 'ru' ? 'Планирование выездной проверки' : 'Текшерүүнү пландоо'}
          size="large"
        >
          {selectedApplication && (
            <ScheduleInspectionForm
              applicationId={selectedApplication.id}
              applicantName={selectedApplication.applicantName || ''}
              address={selectedApplication.address || ''}
              onSubmit={handleScheduleInspectionSubmit}
              onCancel={() => {
                setShowScheduleModal(false);
                setSelectedApplication(null);
              }}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
