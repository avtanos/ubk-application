'use client';

import { useState, useEffect } from 'react';
import DirectorLayout from '@/components/layout/DirectorLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';

export default function DirectorDashboard() {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    setIsClient(true);
  }, []);


  const regionalData = [
    { region: 'Чуйская обл.', applications: 450, approved: 380, rejected: 70, inReview: 25, draft: 15, paymentProcessing: 35 },
    { region: 'Ошская обл.', applications: 380, approved: 320, rejected: 60, inReview: 20, draft: 12, paymentProcessing: 28 },
    { region: 'Нарынская обл.', applications: 320, approved: 280, rejected: 40, inReview: 15, draft: 10, paymentProcessing: 22 },
    { region: 'Баткенская обл.', applications: 280, approved: 240, rejected: 40, inReview: 18, draft: 8, paymentProcessing: 20 },
    { region: 'Иссык-Кульская обл.', applications: 250, approved: 210, rejected: 40, inReview: 12, draft: 6, paymentProcessing: 18 },
    { region: 'Джалал-Абадская обл.', applications: 220, approved: 180, rejected: 40, inReview: 10, draft: 5, paymentProcessing: 15 },
    { region: 'Таласская обл.', applications: 180, approved: 150, rejected: 30, inReview: 8, draft: 4, paymentProcessing: 12 }
  ];

  // Mock data for applications awaiting approval
  const applications = [
    {
      id: 'APP-2025-001',
      applicant: 'Айгуль Токтосунова',
      region: 'Чуйская обл.',
      children: 3,
      amount: 3600,
      status: 'inReview',
      submissionDate: '2025-01-15',
      specialist: 'Айжан Кыдырова',
      income: 25000,
      familySize: 5,
      documents: ['Паспорт', 'Свидетельства о рождении', 'Справка о доходах'],
      verificationResults: {
        incomeVerified: true,
        propertyVerified: true,
        familyVerified: true,
        documentsComplete: true
      },
      priority: 'high',
      daysWaiting: 3
    },
    {
      id: 'APP-2025-002',
      applicant: 'Нурбек Жумабеков',
      region: 'Нарынская обл.',
      children: 4,
      amount: 6480,
      status: 'inReview',
      submissionDate: '2025-01-14',
      specialist: 'Марат Беков',
      income: 18000,
      familySize: 6,
      documents: ['Паспорт', 'Свидетельства о рождении', 'Справка о доходах'],
      verificationResults: {
        incomeVerified: true,
        propertyVerified: true,
        familyVerified: true,
        documentsComplete: true
      },
      priority: 'medium',
      daysWaiting: 2
    },
    {
      id: 'APP-2025-003',
      applicant: 'Марат Беков',
      region: 'Ошская обл.',
      children: 2,
      amount: 2400,
      status: 'inReview',
      submissionDate: '2025-01-13',
      specialist: 'Гүлнара Осмонова',
      income: 22000,
      familySize: 4,
      documents: ['Паспорт', 'Свидетельства о рождении', 'Справка о доходах'],
      verificationResults: {
        incomeVerified: true,
        propertyVerified: true,
        familyVerified: true,
        documentsComplete: true
      },
      priority: 'low',
      daysWaiting: 1
    },
    {
      id: 'APP-2025-004',
      applicant: 'Гүлнара Осмонова',
      region: 'Баткенская обл.',
      children: 3,
      amount: 5400,
      status: 'inReview',
      submissionDate: '2025-01-12',
      specialist: 'Айбек Кыдыров',
      income: 15000,
      familySize: 5,
      documents: ['Паспорт', 'Свидетельства о рождении', 'Справка о доходах'],
      verificationResults: {
        incomeVerified: true,
        propertyVerified: true,
        familyVerified: true,
        documentsComplete: true
      },
      priority: 'high',
      daysWaiting: 4
    },
    {
      id: 'APP-2025-005',
      applicant: 'Эркин Садыков',
      region: 'Иссык-Кульская обл.',
      children: 1,
      amount: 1800,
      status: 'inReview',
      submissionDate: '2025-01-11',
      specialist: 'Нургуль Асанова',
      income: 28000,
      familySize: 3,
      documents: ['Паспорт', 'Свидетельства о рождении', 'Справка о доходах'],
      verificationResults: {
        incomeVerified: true,
        propertyVerified: true,
        familyVerified: true,
        documentsComplete: true
      },
      priority: 'low',
      daysWaiting: 5
    }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleMakeDecision = (application: any, decision: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setDecision(decision);
    setShowDecisionModal(true);
  };

  const handleConfirmDecision = () => {
    if (decision === 'reject' && !rejectionReason.trim()) {
      alert(language === 'ru' ? 'Укажите причину отказа' : 'Четке кагылган себептин көрсөтүңүз');
      return;
    }

    // Here you would make API call to update application status
    console.log('Decision:', decision, 'Application:', selectedApplication?.id, 'Reason:', rejectionReason);
    
    // Close modals and reset state
    setShowDecisionModal(false);
    setShowDetailsModal(false);
    setSelectedApplication(null);
    setDecision(null);
    setRejectionReason('');
    
    alert(language === 'ru' ? 'Решение принято' : 'Чечим кабыл алынды');
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

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600">{value}</span>
      )
    },
    {
      key: 'applicant',
      label: language === 'ru' ? 'Заявитель' : 'Арыз берүүчү'
    },
    {
      key: 'region',
      label: language === 'ru' ? 'Регион' : 'Аймак'
    },
    {
      key: 'children',
      label: language === 'ru' ? 'Дети' : 'Балдар',
      render: (value: number) => (
        <span className="font-semibold">{value}</span>
      )
    },
    {
      key: 'amount',
      label: language === 'ru' ? 'Сумма' : 'Сумма',
      render: (value: number) => (
        <span className="font-semibold text-green-600">
          {value.toLocaleString()} сом
        </span>
      )
    },
    {
      key: 'submissionDate',
      label: language === 'ru' ? 'Дата подачи' : 'Берген күнү'
    },
    {
      key: 'specialist',
      label: language === 'ru' ? 'Специалист' : 'Адис'
    },
    {
      key: 'priority',
      label: language === 'ru' ? 'Приоритет' : 'Приоритет',
      render: (value: string) => {
        const priorityColors = {
          high: 'bg-red-100 text-red-800',
          medium: 'bg-yellow-100 text-yellow-800',
          low: 'bg-green-100 text-green-800'
        };
        const priorityTexts = {
          ru: { high: 'Высокий', medium: 'Средний', low: 'Низкий' },
          ky: { high: 'Жогору', medium: 'Орто', low: 'Төмөн' }
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[value as keyof typeof priorityColors]}`}>
            {priorityTexts[language as keyof typeof priorityTexts]?.[value as keyof typeof priorityTexts.ru] || value}
          </span>
        );
      }
    },
    {
      key: 'daysWaiting',
      label: language === 'ru' ? 'Дней ожидания' : 'Күтүү күндөрү',
      render: (value: number) => (
        <span className={`font-semibold ${value > 3 ? 'text-red-600' : value > 1 ? 'text-yellow-600' : 'text-green-600'}`}>
          {value} {language === 'ru' ? 'дн.' : 'күн'}
        </span>
      )
    },
    {
      key: 'actions',
      label: language === 'ru' ? 'Действия' : 'Аракеттер',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 whitespace-nowrap"
          >
            {language === 'ru' ? 'Детали' : 'Деталдар'}
          </button>
        </div>
      )
    }
  ];


  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="ri-government-line text-2xl text-white"></i>
          </div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <DirectorLayout currentPage="main">
      <div className="space-y-6">


        {/* Regional Comparison Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'ru' ? 'Сравнение по регионам' : 'Аймактар боюнча салыштыруу'}
            </h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">{language === 'ru' ? 'Неделя' : 'Жума'}</option>
              <option value="month">{language === 'ru' ? 'Месяц' : 'Ай'}</option>
              <option value="quarter">{language === 'ru' ? 'Квартал' : 'Чейрек'}</option>
              <option value="year">{language === 'ru' ? 'Год' : 'Жыл'}</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#3B82F6" name={language === 'ru' ? 'Заявлений' : 'Арыздар'} />
              <Bar dataKey="approved" fill="#10B981" name={language === 'ru' ? 'Одобрено' : 'Бекитилди'} />
              <Bar dataKey="rejected" fill="#EF4444" name={language === 'ru' ? 'Отклонено' : 'Четке кагылды'} />
              <Bar dataKey="inReview" fill="#F59E0B" name={language === 'ru' ? 'На рассмотрении' : 'Карап жатат'} />
              <Bar dataKey="draft" fill="#6B7280" name={language === 'ru' ? 'Черновик' : 'Долбоор'} />
              <Bar dataKey="paymentProcessing" fill="#8B5CF6" name={language === 'ru' ? 'Обработка платежа' : 'Төлөмдү иштетүү'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={language === 'ru' ? 'Поиск по заявителю или ID...' : 'Арыз берүүчү же ID боюнча издөө...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{language === 'ru' ? 'Все статусы' : 'Бардык абалдар'}</option>
                <option value="draft">{language === 'ru' ? 'Черновик' : 'Долбоор'}</option>
                <option value="submitted">{language === 'ru' ? 'Подана' : 'Берилди'}</option>
                <option value="inReview">{language === 'ru' ? 'На рассмотрении' : 'Карап жатат'}</option>
                <option value="approved">{language === 'ru' ? 'Одобрена' : 'Бекитилди'}</option>
                <option value="rejected">{language === 'ru' ? 'Отклонена' : 'Четке кагылды'}</option>
                <option value="paymentProcessing">{language === 'ru' ? 'Обработка платежа' : 'Төлөмдү иштетүү'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <DataTable
            data={filteredApplications}
            columns={columns}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Application Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={language === 'ru' ? 'Детали заявления' : 'Арыздын деталдары'}
          size="lg"
        >
          {selectedApplication && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {language === 'ru' ? 'Основная информация' : 'Негизги маалымат'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ru' ? 'ID заявления:' : 'Арыз ID:'}</span>
                      <span className="font-mono text-blue-600">{selectedApplication.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ru' ? 'Заявитель:' : 'Арыз берүүчү:'}</span>
                      <span>{selectedApplication.applicant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ru' ? 'Регион:' : 'Аймак:'}</span>
                      <span>{selectedApplication.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ru' ? 'Количество детей:' : 'Балдардын саны:'}</span>
                      <span className="font-semibold">{selectedApplication.children}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ru' ? 'Размер семьи:' : 'Үй-бүлөнүн көлөмү:'}</span>
                      <span>{selectedApplication.familySize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ru' ? 'Доход семьи:' : 'Үй-бүлөнүн кирешеси:'}</span>
                      <span>{selectedApplication.income.toLocaleString()} сом</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {language === 'ru' ? 'Расчет пособия' : 'Жөлөкпул эсептөөсү'}
            </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ru' ? 'Базовая сумма:' : 'Негизги сумма:'}</span>
                      <span>1200 сом</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ru' ? 'Количество детей:' : 'Балдардын саны:'}</span>
                      <span>{selectedApplication.children}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ru' ? 'Районный коэффициент:' : 'Райондук коэффициент:'}</span>
                      <span>1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ru' ? 'Дополнительный коэффициент:' : 'Кошумча коэффициент:'}</span>
                      <span>1.0</span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-600">
                      <span>{language === 'ru' ? 'Итого в месяц:' : 'Айына жалпы:'}</span>
                      <span>{selectedApplication.amount.toLocaleString()} сом</span>
                    </div>
                  </div>
                </div>
          </div>

              {/* Verification Results */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {language === 'ru' ? 'Результаты проверки' : 'Текшерүүнүн натыйжалары'}
              </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <i className="ri-check-line text-2xl text-green-600 mb-2"></i>
                    <div className="text-sm font-medium text-green-800">
                      {language === 'ru' ? 'Доходы проверены' : 'Кирешелер текшерилди'}
                    </div>
            </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <i className="ri-check-line text-2xl text-green-600 mb-2"></i>
                    <div className="text-sm font-medium text-green-800">
                      {language === 'ru' ? 'Имущество проверено' : 'Мүлк текшерилди'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <i className="ri-check-line text-2xl text-green-600 mb-2"></i>
                    <div className="text-sm font-medium text-green-800">
                      {language === 'ru' ? 'Семья проверена' : 'Үй-бүлө текшерилди'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <i className="ri-check-line text-2xl text-green-600 mb-2"></i>
                    <div className="text-sm font-medium text-green-800">
                      {language === 'ru' ? 'Документы полные' : 'Документтер толук'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {language === 'ru' ? 'Приложенные документы' : 'Тиркеме документтер'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedApplication.documents.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <i className="ri-file-text-line text-blue-600"></i>
                      <span className="text-sm">{doc}</span>
                </div>
              ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {language === 'ru' ? 'Закрыть' : 'Жабуу'}
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Decision Modal */}
        <Modal
          isOpen={showDecisionModal}
          onClose={() => setShowDecisionModal(false)}
          title={decision === 'approve' 
            ? (language === 'ru' ? 'Утверждение заявления' : 'Арызды бекитүү')
            : (language === 'ru' ? 'Отказ в заявлении' : 'Арызга четке кагуу')
          }
          size="md"
        >
          {selectedApplication && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{selectedApplication.applicant}</div>
                <div className="text-sm text-gray-600">
                  {selectedApplication.id} • {selectedApplication.region} • {selectedApplication.children} {language === 'ru' ? 'детей' : 'бала'}
                </div>
                <div className="text-lg font-semibold text-green-600 mt-2">
                  {selectedApplication.amount.toLocaleString()} сом/месяц
                </div>
              </div>

              {decision === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ru' ? 'Причина отказа' : 'Четке кагылган себеп'}
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={language === 'ru' ? 'Укажите причину отказа...' : 'Четке кагылган себептин көрсөтүңүз...'}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowDecisionModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {language === 'ru' ? 'Отмена' : 'Жокко чыгаруу'}
                </button>
                <button
                  onClick={handleConfirmDecision}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    decision === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {decision === 'approve' 
                    ? (language === 'ru' ? 'Утвердить' : 'Бектирүү')
                    : (language === 'ru' ? 'Отказать' : 'Четке кагуу')
                  }
                </button>
          </div>
        </div>
          )}
        </Modal>

      </div>
    </DirectorLayout>
  );
}
