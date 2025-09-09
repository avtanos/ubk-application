'use client';

import { useState, useEffect } from 'react';
import DirectorLayout from '@/components/layout/DirectorLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ReportsPage() {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [selectedReport, setSelectedReport] = useState('summary');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const reportTypes = [
    {
      id: 'summary',
      name: language === 'ru' ? 'Сводный отчет' : 'Жыйынтык отчет',
      description: language === 'ru' ? 'Общая статистика по программе УБК' : 'УБК программасы боюнча жалпы статистика',
      icon: 'ri-file-chart-line'
    },
    {
      id: 'regional',
      name: language === 'ru' ? 'Отчет по регионам' : 'Аймактар боюнча отчет',
      description: language === 'ru' ? 'Детализация по областям и районам' : 'Облустар жана райондор боюнча деталдаштыруу',
      icon: 'ri-map-pin-line'
    },
    {
      id: 'financial',
      name: language === 'ru' ? 'Финансовый отчет' : 'Каржылык отчет',
      description: language === 'ru' ? 'Расходы и использование бюджета' : 'Чыгымдар жана бюджетти колдонуу',
      icon: 'ri-money-dollar-circle-line'
    },
    {
      id: 'performance',
      name: language === 'ru' ? 'Отчет по эффективности' : 'Эффективдүүлүк боюнча отчет',
      description: language === 'ru' ? 'Показатели работы специалистов' : 'Адистердин иш көрсөткүчтөрү',
      icon: 'ri-bar-chart-line'
    },
    {
      id: 'demographics',
      name: language === 'ru' ? 'Демографический отчет' : 'Демографиялык отчет',
      description: language === 'ru' ? 'Анализ получателей по категориям' : 'Алуучулардын категориялар боюнча анализ',
      icon: 'ri-user-line'
    }
  ];

  // Mock data for reports
  const summaryData = {
    totalApplications: 2456,
    approvedApplications: 1234,
    rejectedApplications: 156,
    pendingApplications: 89,
    totalAmount: 15200000,
    averageAmount: 4200,
    averageProcessingTime: 12,
    efficiency: 88.5
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

  const performanceData = [
    { specialist: 'Айжан Кыдырова', region: 'Чуйская обл.', applications: 45, approved: 38, rejected: 7, avgTime: 9, efficiency: 84 },
    { specialist: 'Марат Беков', region: 'Ошская обл.', applications: 42, approved: 36, rejected: 6, avgTime: 10, efficiency: 86 },
    { specialist: 'Гүлнара Осмонова', region: 'Нарынская обл.', applications: 38, approved: 34, rejected: 4, avgTime: 8, efficiency: 89 },
    { specialist: 'Айбек Кыдыров', region: 'Баткенская обл.', applications: 35, approved: 30, rejected: 5, avgTime: 11, efficiency: 86 },
    { specialist: 'Нургуль Асанова', region: 'Иссык-Кульская обл.', applications: 32, approved: 28, rejected: 4, avgTime: 10, efficiency: 88 },
    { specialist: 'Эркин Садыков', region: 'Джалал-Абадская обл.', applications: 28, approved: 24, rejected: 4, avgTime: 12, efficiency: 86 }
  ];

  const demographicData = [
    { category: language === 'ru' ? 'Семьи с 1 ребенком' : '1 балалуу үй-бүлөлөр', count: 320, percentage: 26 },
    { category: language === 'ru' ? 'Семьи с 2 детьми' : '2 балалуу үй-бүлөлөр', count: 450, percentage: 36 },
    { category: language === 'ru' ? 'Семьи с 3 детьми' : '3 балалуу үй-бүлөлөр', count: 280, percentage: 23 },
    { category: language === 'ru' ? 'Семьи с 4+ детьми' : '4+ балалуу үй-бүлөлөр', count: 184, percentage: 15 }
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
      case 'summary':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{summaryData.totalApplications.toLocaleString()}</div>
                <div className="text-sm text-blue-800">{language === 'ru' ? 'Всего заявлений' : 'Жалпы арыздар'}</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{summaryData.approvedApplications.toLocaleString()}</div>
                <div className="text-sm text-green-800">{language === 'ru' ? 'Утверждено' : 'Бектирилди'}</div>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{summaryData.rejectedApplications.toLocaleString()}</div>
                <div className="text-sm text-red-800">{language === 'ru' ? 'Отказано' : 'Четке кагылды'}</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{summaryData.totalAmount.toLocaleString()} сом</div>
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
                    <span>{language === 'ru' ? 'Утверждено' : 'Бектирилди'}</span>
                    <span className="font-semibold text-green-600">{summaryData.approvedApplications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Отказано' : 'Четке кагылды'}</span>
                    <span className="font-semibold text-red-600">{summaryData.rejectedApplications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Ожидают утверждения' : 'Бектириүү күтүүдө'}</span>
                    <span className="font-semibold text-yellow-600">{summaryData.pendingApplications}</span>
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
                    <span className="font-semibold">{summaryData.averageAmount.toLocaleString()} сом</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Среднее время обработки' : 'Орточо иштетүү убактысы'}</span>
                    <span className="font-semibold">{summaryData.averageProcessingTime} {language === 'ru' ? 'дней' : 'күн'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Общая эффективность' : 'Жалпы эффективдүүлүк'}</span>
                    <span className="font-semibold text-green-600">{summaryData.efficiency}%</span>
                  </div>
                </div>
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

      case 'financial':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ru' ? 'Финансовые показатели' : 'Финансылык көрсөткүчтөр'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">15.2M сом</div>
                  <div className="text-sm text-blue-800">{language === 'ru' ? 'Общая сумма выплат' : 'Жалпы төлөм суммасы'}</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">4,200 сом</div>
                  <div className="text-sm text-green-800">{language === 'ru' ? 'Средняя сумма пособия' : 'Орточо жөлөкпул суммасы'}</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">1,234</div>
                  <div className="text-sm text-purple-800">{language === 'ru' ? 'Активных получателей' : 'Активдүү алуучулар'}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ru' ? 'Эффективность специалистов' : 'Адистердин эффективдүүлүгү'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Специалист' : 'Адис'}
                      </th>
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
                        {language === 'ru' ? 'Ср. время' : 'Орт. убакыт'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {language === 'ru' ? 'Эффективность' : 'Эффективдүүлүк'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((specialist, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{specialist.specialist}</td>
                        <td className="py-3 px-4 text-gray-600">{specialist.region}</td>
                        <td className="py-3 px-4">{specialist.applications}</td>
                        <td className="py-3 px-4 text-green-600 font-semibold">{specialist.approved}</td>
                        <td className="py-3 px-4">{specialist.avgTime} {language === 'ru' ? 'дней' : 'күн'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            specialist.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                            specialist.efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {specialist.efficiency}%
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

      case 'demographics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ru' ? 'Распределение по количеству детей' : 'Балдардын саны боюнча бөлүштүрүү'}
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={demographicData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {demographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
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
