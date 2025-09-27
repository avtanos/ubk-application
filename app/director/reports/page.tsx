'use client';

import { useState, useEffect } from 'react';
import DirectorLayout from '@/components/layout/DirectorLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [selectedReport, setSelectedReport] = useState('applications');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const reportTypes = [
    {
      id: 'applications',
      name: language === 'ru' ? 'Отчет по заявлениям' : 'Арыздар боюнча отчет',
      description: language === 'ru' ? 'Статистика по заявлениям и их обработке' : 'Арыздар жана аларды иштетүү боюнча статистика',
      icon: 'ri-file-list-3-line'
    },
    {
      id: 'payments',
      name: language === 'ru' ? 'Отчет по платежам' : 'Төлөмдөр боюнча отчет',
      description: language === 'ru' ? 'Сводка по всем выплатам за период' : 'Мерзүм боюнча бардык төлөмдөр боюнча жыйынтык',
      icon: 'ri-bank-card-line'
    },
    {
      id: 'invoices',
      name: language === 'ru' ? 'Отчет по накладным' : 'Накладнойлор боюнча отчет',
      description: language === 'ru' ? 'Статистика по накладным и их утверждению' : 'Накладнойлор жана аларды бекитүү боюнча статистика',
      icon: 'ri-file-paper-line'
    },
    {
      id: 'regional',
      name: language === 'ru' ? 'Отчет по регионам' : 'Аймактар боюнча отчет',
      description: language === 'ru' ? 'Детализация по областям и районам' : 'Облустар жана райондор боюнча деталдаштыруу',
      icon: 'ri-map-pin-line'
    },
  ];

  // Mock data for reports
  const applicationsData = {
    totalApplications: 2456,
    approvedApplications: 1234,
    rejectedApplications: 156,
    pendingApplications: 89,
    inReviewApplications: 67,
    draftApplications: 45,
    paymentProcessingApplications: 234,
    totalAmount: 15200000,
    averageAmount: 4200,
    averageProcessingTime: 12,
    efficiency: 88.5
  };

  const paymentsData = {
    totalPayments: 1234,
    completedPayments: 1150,
    pendingPayments: 84,
    failedPayments: 12,
    totalAmount: 15200000,
    averageAmount: 12300,
    paymentMethods: {
      bankTransfer: 1100,
      cash: 134
    }
  };

  const invoicesData = {
    totalInvoices: 45,
    pendingInvoices: 12,
    approvedInvoices: 28,
    rejectedInvoices: 5,
    totalAmount: 15200000,
    averageAmount: 337778,
    byRegion: [
      { region: 'Чуйская обл.', count: 12, amount: 4500000 },
      { region: 'Ошская обл.', count: 10, amount: 3800000 },
      { region: 'Нарынская обл.', count: 8, amount: 3200000 },
      { region: 'Баткенская обл.', count: 7, amount: 2800000 },
      { region: 'Иссык-Кульская обл.', count: 5, amount: 2500000 },
      { region: 'Джалал-Абадская обл.', count: 2, amount: 2200000 },
      { region: 'Таласская обл.', count: 1, amount: 1800000 }
    ]
  };

  const regionalData = [
    { region: 'Чуйская обл.', applications: 450, approved: 380, rejected: 70, amount: 4500000, efficiency: 84 },
    { region: 'Ошская обл.', applications: 380, approved: 320, rejected: 60, amount: 3800000, efficiency: 84 },
    { region: 'Нарынская обл.', applications: 320, approved: 280, rejected: 40, amount: 3200000, efficiency: 88 },
    { region: 'Баткенская обл.', applications: 280, approved: 240, rejected: 40, amount: 2800000, efficiency: 86 },
    { region: 'Иссык-Кульская обл.', applications: 250, approved: 210, rejected: 40, amount: 2500000, efficiency: 84 },
    { region: 'Джалал-Абадская обл.', applications: 220, approved: 180, rejected: 40, amount: 2200000, efficiency: 82 },
    { region: 'Таласская обл.', applications: 180, approved: 150, rejected: 30, amount: 1800000, efficiency: 83 }
  ];

  const financialData = [
    { month: 'Янв', budget: 5000000, spent: 4200000, remaining: 800000 },
    { month: 'Фев', budget: 5000000, spent: 4500000, remaining: 500000 },
    { month: 'Мар', budget: 5000000, spent: 4800000, remaining: 200000 },
    { month: 'Апр', budget: 5000000, spent: 4600000, remaining: 400000 },
    { month: 'Май', budget: 5000000, spent: 4900000, remaining: 100000 },
    { month: 'Июн', budget: 5000000, spent: 5000000, remaining: 0 }
  ];



  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    alert(language === 'ru' ? 'Отчет сгенерирован' : 'Отчет түзүлдү');
  };

  const handleExportReport = (format: 'excel' | 'pdf') => {
    alert(language === 'ru' 
      ? `Экспорт в ${format.toUpperCase()} начат` 
      : `${format.toUpperCase()} форматында экспорт башталды`
    );
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'applications':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{applicationsData.totalApplications.toLocaleString()}</div>
                <div className="text-sm text-blue-800">{language === 'ru' ? 'Всего заявлений' : 'Жалпы арыздар'}</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{applicationsData.approvedApplications.toLocaleString()}</div>
                <div className="text-sm text-green-800">{language === 'ru' ? 'Утверждено' : 'Бектирилди'}</div>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{applicationsData.rejectedApplications.toLocaleString()}</div>
                <div className="text-sm text-red-800">{language === 'ru' ? 'Отказано' : 'Четке кагылды'}</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{applicationsData.totalAmount.toLocaleString()} сом</div>
                <div className="text-sm text-purple-800">{language === 'ru' ? 'Общая сумма' : 'Жалпы сумма'}</div>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ru' ? 'Статистика по статусам' : 'Статустар боюнча статистика'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Черновик' : 'Долбоор'}</span>
                    <span className="font-semibold text-gray-600">{applicationsData.draftApplications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Подана' : 'Берилди'}</span>
                    <span className="font-semibold text-blue-600">{applicationsData.pendingApplications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'На рассмотрении' : 'Карап жатат'}</span>
                    <span className="font-semibold text-yellow-600">{applicationsData.inReviewApplications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Утверждено' : 'Бектирилди'}</span>
                    <span className="font-semibold text-green-600">{applicationsData.approvedApplications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Отказано' : 'Четке кагылды'}</span>
                    <span className="font-semibold text-red-600">{applicationsData.rejectedApplications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Обработка платежа' : 'Төлөмдү иштетүү'}</span>
                    <span className="font-semibold text-purple-600">{applicationsData.paymentProcessingApplications}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ru' ? 'Ключевые показатели' : 'Негизги көрсөткүчтөр'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Средняя сумма пособия' : 'Орточо жөлөкпул суммасы'}</span>
                    <span className="font-semibold">{applicationsData.averageAmount.toLocaleString()} сом</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Среднее время обработки' : 'Орточо иштетүү убактысы'}</span>
                    <span className="font-semibold">{applicationsData.averageProcessingTime} {language === 'ru' ? 'дней' : 'күн'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Общая эффективность' : 'Жалпы эффективдүүлүк'}</span>
                    <span className="font-semibold text-green-600">{applicationsData.efficiency}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{paymentsData.totalPayments.toLocaleString()}</div>
                <div className="text-sm text-blue-800">{language === 'ru' ? 'Всего платежей' : 'Жалпы төлөмдөр'}</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{paymentsData.completedPayments.toLocaleString()}</div>
                <div className="text-sm text-green-800">{language === 'ru' ? 'Завершено' : 'Аякталды'}</div>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{paymentsData.pendingPayments.toLocaleString()}</div>
                <div className="text-sm text-yellow-800">{language === 'ru' ? 'В обработке' : 'Иштетүүдө'}</div>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{paymentsData.failedPayments.toLocaleString()}</div>
                <div className="text-sm text-red-800">{language === 'ru' ? 'Неудачные' : 'Ийгиликсиз'}</div>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ru' ? 'Финансовые показатели' : 'Финансылык көрсөткүчтөр'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Общая сумма выплат' : 'Жалпы төлөм суммасы'}</span>
                    <span className="font-semibold text-green-600">{paymentsData.totalAmount.toLocaleString()} сом</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Средняя сумма платежа' : 'Орточо төлөм суммасы'}</span>
                    <span className="font-semibold">{paymentsData.averageAmount.toLocaleString()} сом</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ru' ? 'Способы оплаты' : 'Төлөм ыкмалары'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Банковский перевод' : 'Банктык которуу'}</span>
                    <span className="font-semibold text-blue-600">{paymentsData.paymentMethods.bankTransfer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Наличные' : 'Накта акча'}</span>
                    <span className="font-semibold text-green-600">{paymentsData.paymentMethods.cash}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'invoices':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{invoicesData.totalInvoices.toLocaleString()}</div>
                <div className="text-sm text-blue-800">{language === 'ru' ? 'Всего накладных' : 'Жалпы накладнойлор'}</div>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{invoicesData.pendingInvoices.toLocaleString()}</div>
                <div className="text-sm text-yellow-800">{language === 'ru' ? 'Ожидают утверждения' : 'Бектириүү күтүүдө'}</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{invoicesData.approvedInvoices.toLocaleString()}</div>
                <div className="text-sm text-green-800">{language === 'ru' ? 'Утверждено' : 'Бектирилди'}</div>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{invoicesData.rejectedInvoices.toLocaleString()}</div>
                <div className="text-sm text-red-800">{language === 'ru' ? 'Отклонено' : 'Четке кагылды'}</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ru' ? 'Накладные по регионам' : 'Аймактар боюнча накладнойлор'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Регион' : 'Аймак'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Количество' : 'Саны'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Сумма' : 'Сумма'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicesData.byRegion.map((region, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{region.region}</td>
                        <td className="py-3 px-4">{region.count}</td>
                        <td className="py-3 px-4 font-semibold text-green-600">
                          {region.amount.toLocaleString()} сом
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'regional':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ru' ? 'Данные по регионам' : 'Аймактар боюнча маалыматтар'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Регион' : 'Аймак'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Заявлений' : 'Арыздар'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Утверждено' : 'Бектирилди'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Отказано' : 'Четке кагылды'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Сумма выплат' : 'Төлөм суммасы'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Эффективность' : 'Эффективдүүлүк'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalData.map((region, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{region.region}</td>
                        <td className="py-3 px-4">{region.applications}</td>
                        <td className="py-3 px-4 text-green-600 font-semibold">{region.approved}</td>
                        <td className="py-3 px-4 text-red-600 font-semibold">{region.rejected}</td>
                        <td className="py-3 px-4 font-semibold text-green-600">
                          {region.amount.toLocaleString()} сом
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            region.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                            region.efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {region.efficiency}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );




      default:
        return null;
    }
  };

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
    <DirectorLayout currentPage="reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ru' ? 'Отчетность' : 'Отчеттуулук'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'ru' 
                  ? 'Формирование и экспорт отчетов по программе УБК' 
                  : 'УБК программасы боюнча отчетторду түзүү жана экспорттоо'
                }
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleExportReport('excel')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <i className="ri-file-excel-line mr-2"></i>
                Excel
              </button>
              <button
                onClick={() => handleExportReport('pdf')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <i className="ri-file-pdf-line mr-2"></i>
                PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Report Types */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ru' ? 'Типы отчетов' : 'Отчеттун түрлөрү'}
              </h3>
              <div className="space-y-2">
                {reportTypes.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedReport === report.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <i className={`${report.icon} text-lg`}></i>
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <div className="text-xs text-gray-500">{report.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {reportTypes.find(r => r.id === selectedReport)?.name}
                </h3>
                <div className="flex space-x-3">
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
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        {language === 'ru' ? 'Генерация...' : 'Түзүлүүдө...'}
                      </>
                    ) : (
                      <>
                        <i className="ri-refresh-line mr-2"></i>
                        {language === 'ru' ? 'Обновить' : 'Жаңылоо'}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {renderReportContent()}
            </div>
          </div>
        </div>
      </div>
    </DirectorLayout>
  );
}
