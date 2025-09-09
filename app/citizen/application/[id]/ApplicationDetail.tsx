
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockApplications, mockFamilies } from '@/lib/mockData';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface ApplicationDetailProps {
  applicationId: string;
}

export default function ApplicationDetail({ applicationId }: ApplicationDetailProps) {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const application = mockApplications.find(app => app.id === applicationId);
  const family = mockFamilies.find(f => f.familyHead === application?.familyHead);
  
  const t = translations[language as keyof typeof translations];

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

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application not found</h1>
          <Link href="/citizen" className="text-red-600 hover:text-red-700">
            Return to Citizen Portal
          </Link>
        </div>
      </div>
    );
  }

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

  const timeline = [
    {
      date: '2024-01-15',
      status: 'submitted',
      title: language === 'ru' ? 'Заявка подана' : 'Арыз берилди',
      description: language === 'ru' ? 'Заявление успешно отправлено на рассмотрение' : 'Арыз ийгиликтүү карап чыгууга жөнөтүлдү'
    },
    {
      date: '2024-01-16',
      status: 'inReview',
      title: language === 'ru' ? 'Начато рассмотрение' : 'Карап чыгуу башталды',
      description: language === 'ru' ? 'Специалист начал проверку документов' : 'Адис документтерди текшере баштады'
    },
    {
      date: '2024-01-18',
      status: application.status === 'approved' ? 'approved' : 'inReview',
      title: application.status === 'approved' 
        ? (language === 'ru' ? 'Заявка одобрена' : 'Арыз бекитилди')
        : (language === 'ru' ? 'Дополнительная проверка' : 'Кошумча текшерүү'),
      description: application.status === 'approved'
        ? (language === 'ru' ? 'Все требования выполнены, пособие назначено' : 'Бардык талаптар аткарылды, жөлөкпул дайындалды')
        : (language === 'ru' ? 'Требуется дополнительная верификация доходов' : 'Кирешелерди кошумча текшерүү талап кылынат')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-red-600">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/citizen" className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <i className="ri-government-line text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Детали заявки' : 'Арыз чоо-жайы'}
                  </h1>
                  <p className="text-sm text-gray-600">{application.id}</p>
                </div>
              </Link>
            </div>
            
            <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Application Status Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === 'ru' ? 'Статус заявки' : 'Арыздын абалы'}
                  </h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {getStatusText(application.status)}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      {language === 'ru' ? 'Основная информация' : 'Негизги маалымат'}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'ru' ? 'Номер заявки:' : 'Арыз номери:'}
                        </span>
                        <span className="font-medium">{application.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'ru' ? 'Дата подачи:' : 'Берген күнү:'}
                        </span>
                        <span className="font-medium">{application.submissionDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'ru' ? 'Регион:' : 'Аймак:'}
                        </span>
                        <span className="font-medium">{application.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'ru' ? 'Специалист:' : 'Адис:'}
                        </span>
                        <span className="font-medium">{application.specialist}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      {language === 'ru' ? 'Расчет пособия' : 'Жөлөкпулду эсептөө'}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'ru' ? 'Детей до 16:' : '16га чейинки балдар:'}
                        </span>
                        <span className="font-medium">{application.childrenCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'ru' ? 'Базовая ставка:' : 'Негизги ставка:'}
                        </span>
                        <span className="font-medium">1,200 сом</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'ru' ? 'Коэффициент:' : 'Коэффициент:'}
                        </span>
                        <span className="font-medium">
                          {family?.regionalCoefficient || 1.0}x
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold">
                          {language === 'ru' ? 'Итого в месяц:' : 'Айына жалпы:'}
                        </span>
                        <span className="font-bold text-lg text-green-600" suppressHydrationWarning={true}>
                          {application.monthlyBenefit.toLocaleString()} сом
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Family Composition */}
                {family && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-4">
                      {language === 'ru' ? 'Состав семьи' : 'Үй-бүлөнүн курамы'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {family.members.map((member, index) => (
                        <div key={`family-member-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-600">
                              {member.relation}, {member.age} {language === 'ru' ? 'лет' : 'жаш'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium" suppressHydrationWarning={true}>{member.income.toLocaleString()} сом</div>
                            <div className="text-xs text-gray-500">
                              {language === 'ru' ? 'в месяц' : 'айына'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'ru' ? 'История заявки' : 'Арыздын тарыхы'}
                </h3>
                
                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <div key={`timeline-${index}`} className="flex">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <span className="text-sm text-gray-500">{item.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ru' ? 'Действия' : 'Аракеттер'}
                </h3>
                
                <div className="space-y-3">
                  <button className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                    <i className="ri-download-line mr-2"></i>
                    {language === 'ru' ? 'Скачать справку' : 'Справканы жүктөө'}
                  </button>
                  
                  <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                    <i className="ri-file-copy-line mr-2"></i>
                    {language === 'ru' ? 'Дублировать заявку' : 'Арызды көчүрүү'}
                  </button>
                  
                  <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                    <i className="ri-message-line mr-2"></i>
                    {language === 'ru' ? 'Связаться со специалистом' : 'Адис менен байланышуу'}
                  </button>
                </div>
              </div>

              {/* Payment History */}
              {application.status === 'approved' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? 'История выплат' : 'Төлөмдөрдүн тарыхы'}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium text-green-800">
                          {language === 'ru' ? 'Январь 2024' : '2024 Январь'}
                        </div>
                        <div className="text-sm text-green-600">
                          {language === 'ru' ? 'Выплачено' : 'Төлөнгөн'}
                        </div>
                      </div>
                      <div className="font-bold text-green-700" suppressHydrationWarning={true}>
                        {application.monthlyBenefit.toLocaleString()} сом
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <div className="font-medium text-yellow-800">
                          {language === 'ru' ? 'Февраль 2024' : '2024 Февраль'}
                        </div>
                        <div className="text-sm text-yellow-600">
                          {language === 'ru' ? 'Обработка' : 'Иштетилүүдө'}
                        </div>
                      </div>
                      <div className="font-bold text-yellow-700" suppressHydrationWarning={true}>
                        {application.monthlyBenefit.toLocaleString()} сом
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ru' ? 'Контактная информация' : 'Байланыш маалыматы'}
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <i className="ri-phone-line w-5 h-5 text-gray-400 mr-3 flex items-center justify-center"></i>
                    <span>+996 312 123-456</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-mail-line w-5 h-5 text-gray-400 mr-3 flex items-center justify-center"></i>
                    <span>support@family-card.kg</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-time-line w-5 h-5 text-gray-400 mr-3 flex items-center justify-center"></i>
                    <span>
                      {language === 'ru' ? 'Пн-Пт: 9:00-18:00' : 'Дүй-Жум: 9:00-18:00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}