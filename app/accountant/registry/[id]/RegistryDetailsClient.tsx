'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface RegistryDetailsClientProps {
  registryId: string;
}

export default function RegistryDetailsClient({ registryId }: RegistryDetailsClientProps) {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [registry, setRegistry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // Имитация загрузки данных
    setTimeout(() => {
      setRegistry({
        id: registryId,
        month: 'Январь 2025',
        totalAmount: 12500000,
        recipients: 1250,
        status: 'completed',
        date: '2025-01-15',
        region: 'Нарынская область',
        payments: [
          { id: 'PAY-001', family: 'Гүлнара Осмонова', amount: 4140, children: 3, status: 'paid', date: '2025-01-20' },
          { id: 'PAY-002', family: 'Айгүл Касымова', amount: 3600, children: 2, status: 'paid', date: '2025-01-20' },
          { id: 'PAY-003', family: 'Нурбек Жумабеков', amount: 4800, children: 4, status: 'paid', date: '2025-01-20' },
          { id: 'PAY-004', family: 'Айнура Токтосунова', amount: 3000, children: 1, status: 'paid', date: '2025-01-20' },
          { id: 'PAY-005', family: 'Бакыт Калматов', amount: 5400, children: 5, status: 'paid', date: '2025-01-20' }
        ],
        statistics: {
          totalPayments: 1250,
          totalAmount: 12500000,
          averageAmount: 10000,
          byRegion: [
            { region: 'Нарын', count: 450, amount: 4500000 },
            { region: 'Ош', count: 380, amount: 3800000 },
            { region: 'Бишкек', count: 320, amount: 3200000 },
            { region: 'Чуй', count: 100, amount: 1000000 }
          ]
        }
      });
      setIsLoading(false);
    }, 1000);
  }, [registryId]);

  const t = translations[language as keyof typeof translations];

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      sent: 'bg-blue-100 text-blue-800',
      preparing: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      ru: {
        completed: 'Завершен',
        sent: 'Отправлен',
        preparing: 'Подготовка'
      },
      ky: {
        completed: 'Аякталды',
        sent: 'Жөнөтүлдү',
        preparing: 'Даярдоо'
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
                    {language === 'ru' ? 'Детали реестра' : 'Реестрдин чоо-жайы'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? 'Подробная информация о реестре выплат' : 'Төлөмдөрдүн реестри жөнүндө деталдуу маалымат'}
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
        {/* Registry Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'ru' ? 'Реестр' : 'Реестр'} {registry.id}
              </h2>
              <p className="text-gray-600">
                {language === 'ru' ? 'Период' : 'Мөөнөт'}: {registry.month}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 mb-2" suppressHydrationWarning={true}>
                {registry.totalAmount.toLocaleString()} сом
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registry.status)}`}>
                {getStatusText(registry.status)}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {language === 'ru' ? 'Общая сумма' : 'Жалпы сумма'}
              </div>
              <div className="font-semibold text-green-600" suppressHydrationWarning={true}>
                {registry.totalAmount.toLocaleString()} сом
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {language === 'ru' ? 'Количество получателей' : 'Алуучулардын саны'}
              </div>
              <div className="font-semibold">{registry.recipients}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {language === 'ru' ? 'Средняя выплата' : 'Орточо төлөм'}
              </div>
              <div className="font-semibold">{registry.statistics.averageAmount.toLocaleString()} сом</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {language === 'ru' ? 'Дата создания' : 'Түзүлгөн күнү'}
              </div>
              <div className="font-semibold">{registry.date}</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payments List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-list-check-2 mr-3 text-blue-600"></i>
                {language === 'ru' ? 'Список выплат' : 'Төлөмдөрдүн тизмеси'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'ID' : 'ID'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Семья' : 'Үй-бүлө'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Сумма' : 'Сумма'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Дети' : 'Балдар'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Статус' : 'Абал'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {registry.payments.map((payment: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{payment.id}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{payment.family}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-green-600" suppressHydrationWarning={true}>
                            {payment.amount.toLocaleString()} сом
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-700">{payment.children}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {language === 'ru' ? 'Выплачено' : 'Төлөнгөн'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-bar-chart-line mr-3 text-green-600"></i>
                {language === 'ru' ? 'Статистика по регионам' : 'Аймактар боюнча статистика'}
              </h3>
              <div className="space-y-3">
                {registry.statistics.byRegion.map((region: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{region.region}</div>
                      <div className="text-sm text-gray-600">
                        {region.count} {language === 'ru' ? 'получателей' : 'алуучу'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600" suppressHydrationWarning={true}>
                        {region.amount.toLocaleString()} сом
                      </div>
                      <div className="text-xs text-gray-500">
                        {((region.amount / registry.totalAmount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-information-line mr-3 text-blue-600"></i>
                {language === 'ru' ? 'Информация' : 'Маалымат'}
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Статус реестра' : 'Реестрдин абалы'}
                  </div>
                  <div className="font-medium">{getStatusText(registry.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Дата отправки' : 'Жөнөтүлгөн күнү'}
                  </div>
                  <div className="font-medium">{registry.date}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Регион' : 'Аймак'}
                  </div>
                  <div className="font-medium">{registry.region}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-settings-line mr-3 text-gray-600"></i>
                {language === 'ru' ? 'Действия' : 'Аракеттер'}
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                  <i className="ri-download-line mr-2"></i>
                  {language === 'ru' ? 'Экспорт в Excel' : 'Excel экспорт'}
                </button>
                <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                  <i className="ri-file-pdf-line mr-2"></i>
                  {language === 'ru' ? 'Экспорт в PDF' : 'PDF экспорт'}
                </button>
                <button className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                  <i className="ri-printer-line mr-2"></i>
                  {language === 'ru' ? 'Печать' : 'Басып чыгаруу'}
                </button>
                {registry.status === 'preparing' && (
                  <button className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                    <i className="ri-send-plane-line mr-2"></i>
                    {language === 'ru' ? 'Отправить в банк' : 'Банкка жөнөтүү'}
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
