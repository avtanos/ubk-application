'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface PaymentDetailsClientProps {
  paymentId: string;
}

export default function PaymentDetailsClient({ paymentId }: PaymentDetailsClientProps) {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // Имитация загрузки данных
    setTimeout(() => {
      setPayment({
        id: paymentId,
        family: 'Гүлнара Осмонова',
        amount: 4140,
        date: '2025-01-20',
        status: 'processing',
        region: 'Нарын',
        children: 3,
        familyMembers: [
          { name: 'Гүлнара Осмонова', age: 28, relation: 'mother', income: 12000 },
          { name: 'Айжан Осмонова', age: 8, relation: 'child', income: 0 },
          { name: 'Нурлан Осмонов', age: 12, relation: 'child', income: 0 },
          { name: 'Айнура Осмонова', age: 14, relation: 'child', income: 0 }
        ],
        documents: [
          { name: 'Паспорт Гүлнары Осмоновой', status: 'verified', date: '2025-01-15' },
          { name: 'Свидетельство о рождении Айжан', status: 'verified', date: '2025-01-15' },
          { name: 'Справка о доходах', status: 'pending', date: '2025-01-18' },
          { name: 'Справка о составе семьи', status: 'verified', date: '2025-01-15' }
        ],
        bankDetails: {
          bank: 'Кыргызстан Национальный Банк',
          account: '1234567890123456',
          cardNumber: '**** **** **** 1234'
        },
        calculation: {
          baseAmount: 3600,
          regionalCoefficient: 1.15,
          totalAmount: 4140,
          perCapitaIncome: 3000
        },
        history: [
          { date: '2025-01-20 14:30', action: 'Создана выплата', user: 'Система' },
          { date: '2025-01-20 15:45', action: 'Проверена специалистом', user: 'Нурбек Жумабеков' },
          { date: '2025-01-20 16:20', action: 'Отправлена в банк', user: 'Айгүл Касымова' }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, [paymentId]);


  const getStatusColor = (status: string) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      ru: {
        paid: 'Выплачено',
        processing: 'В обработке',
        suspended: 'Приостановлено',
        pending: 'Ожидает'
      },
      ky: {
        paid: 'Төлөнгөн',
        processing: 'Иштетилүүдө',
        suspended: 'Токтотулган',
        pending: 'Күтүүдө'
      }
    };
    return statusTexts[language as keyof typeof statusTexts]?.[status as keyof typeof statusTexts.ru] || status;
  };

  const getDocumentStatusColor = (status: string) => {
    const colors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDocumentStatusText = (status: string) => {
    const statusTexts = {
      ru: {
        verified: 'Проверен',
        pending: 'Ожидает проверки',
        rejected: 'Отклонен'
      },
      ky: {
        verified: 'Текшерилди',
        pending: 'Текшерүү күтүүдө',
        rejected: 'Четке кагылды'
      }
    };
    return statusTexts[language as keyof typeof statusTexts]?.[status as keyof typeof statusTexts.ru] || status;
  };

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="ri-government-line text-2xl text-white"></i>
          </div>
          <div className="text-gray-600">
            {isLoading ? 'Загрузка...' : 'Loading...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-red-600">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/accountant" className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <i className="ri-government-line text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Детали выплаты' : 'Төлөмдүн чоо-жайы'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? 'Подробная информация о выплате' : 'Төлөм жөнүндө деталдуу маалымат'}
                  </p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Payment Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'ru' ? 'Выплата' : 'Төлөм'} {payment.id}
              </h2>
              <p className="text-gray-600">
                {language === 'ru' ? 'Семья' : 'Үй-бүлө'}: {payment.family}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 mb-2" suppressHydrationWarning={true}>
                {payment.amount.toLocaleString()} сом
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                {getStatusText(payment.status)}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {language === 'ru' ? 'Дата выплаты' : 'Төлөм күнү'}
              </div>
              <div className="font-semibold">{payment.date}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {language === 'ru' ? 'Регион' : 'Аймак'}
              </div>
              <div className="font-semibold">{payment.region}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {language === 'ru' ? 'Количество детей' : 'Балдардын саны'}
              </div>
              <div className="font-semibold">{payment.children}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {language === 'ru' ? 'Доход на человека' : 'Адамга киреше'}
              </div>
              <div className="font-semibold">{payment.calculation.perCapitaIncome.toLocaleString()} сом</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Family Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-team-line mr-3 text-blue-600"></i>
                {language === 'ru' ? 'Состав семьи' : 'Үй-бүлөнүн курамы'}
              </h3>
              <div className="space-y-3">
                {payment.familyMembers.map((member: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-600">
                        {member.relation === 'mother' ? (language === 'ru' ? 'Мать' : 'Эне') :
                         member.relation === 'father' ? (language === 'ru' ? 'Отец' : 'Ата') :
                         member.relation === 'child' ? (language === 'ru' ? 'Ребенок' : 'Бала') : member.relation}, {member.age} {language === 'ru' ? 'лет' : 'жаш'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900" suppressHydrationWarning={true}>
                        {member.income.toLocaleString()} сом
                      </div>
                      <div className="text-xs text-gray-500">
                        {language === 'ru' ? 'доход' : 'киреше'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-calculator-line mr-3 text-green-600"></i>
                {language === 'ru' ? 'Расчет пособия' : 'Жөлөкпулду эсептөө'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    {language === 'ru' ? 'Базовая сумма (3 ребенка × 1200 сом)' : 'Негизги сумма (3 бала × 1200 сом)'}
                  </span>
                  <span className="font-semibold">{payment.calculation.baseAmount.toLocaleString()} сом</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    {language === 'ru' ? 'Региональный коэффициент' : 'Аймактык коэффициент'}
                  </span>
                  <span className="font-semibold">{payment.calculation.regionalCoefficient}x</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      {language === 'ru' ? 'Итого пособие' : 'Жалпы жөлөкпул'}
                    </span>
                    <span className="text-2xl font-bold text-green-600" suppressHydrationWarning={true}>
                      {payment.calculation.totalAmount.toLocaleString()} сом
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-file-text-line mr-3 text-purple-600"></i>
                {language === 'ru' ? 'Документы' : 'Документтер'}
              </h3>
              <div className="space-y-3">
                {payment.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <i className="ri-file-text-line text-gray-600"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{doc.name}</div>
                        <div className="text-sm text-gray-500">{doc.date}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(doc.status)}`}>
                      {getDocumentStatusText(doc.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-bank-line mr-3 text-blue-600"></i>
                {language === 'ru' ? 'Банковские реквизиты' : 'Банк реквизиттери'}
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Банк' : 'Банк'}
                  </div>
                  <div className="font-medium">{payment.bankDetails.bank}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Номер счета' : 'Эсептин номери'}
                  </div>
                  <div className="font-medium font-mono">{payment.bankDetails.account}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Номер карты' : 'Картанын номери'}
                  </div>
                  <div className="font-medium font-mono">{payment.bankDetails.cardNumber}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-time-line mr-3 text-yellow-600"></i>
                {language === 'ru' ? 'История операций' : 'Операциялардын тарыхы'}
              </h3>
              <div className="space-y-3">
                {payment.history.map((item: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{item.action}</div>
                      <div className="text-xs text-gray-500">{item.date}</div>
                      <div className="text-xs text-gray-400">{item.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-settings-line mr-3 text-gray-600"></i>
                {language === 'ru' ? 'Действия' : 'Аракеттер'}
              </h3>
              <div className="space-y-3">
                {payment.status === 'processing' && (
                  <Link href={`/accountant/payment/${payment.id}/confirm`}>
                    <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                      <i className="ri-check-line mr-2"></i>
                      {language === 'ru' ? 'Подтвердить выплату' : 'Төлөмдү ырастоо'}
                    </button>
                  </Link>
                )}
                <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                  <i className="ri-download-line mr-2"></i>
                  {language === 'ru' ? 'Экспорт в PDF' : 'PDF экспорт'}
                </button>
                <button className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                  <i className="ri-printer-line mr-2"></i>
                  {language === 'ru' ? 'Печать' : 'Басып чыгаруу'}
                </button>
                {payment.status === 'processing' && (
                  <button className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                    <i className="ri-close-line mr-2"></i>
                    {language === 'ru' ? 'Приостановить' : 'Токтотуу'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
