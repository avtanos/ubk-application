'use client';

import { useState, useEffect } from 'react';
import DirectorLayout from '@/components/layout/DirectorLayout';
import MetricCard from '@/components/ui/MetricCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function MonitoringPage() {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock data for monitoring
  const monitoringMetrics = [
    {
      title: language === 'ru' ? 'Активные получатели' : 'Активдүү алуучулар',
      value: '1,234',
      change: {
        value: '+8%',
        type: 'positive' as const
      },
      icon: 'ri-user-heart-line',
      color: 'green'
    },
    {
      title: language === 'ru' ? 'Средняя сумма пособия' : 'Орточо жөлөкпул суммасы',
      value: '4,200 сом',
      change: {
        value: '+5%',
        type: 'positive' as const
      },
      icon: 'ri-money-dollar-circle-line',
      color: 'blue'
    },
    {
      title: language === 'ru' ? 'Время обработки' : 'Иштетүү убактысы',
      value: '12 дней',
      change: {
        value: '-15%',
        type: 'positive' as const
      },
      icon: 'ri-time-line',
      color: 'purple'
    },
    {
      title: language === 'ru' ? 'Процент отказов' : 'Четке кагылган пайыз',
      value: '12.5%',
      change: {
        value: '-2%',
        type: 'positive' as const
      },
      icon: 'ri-close-circle-line',
      color: 'red'
    }
  ];

  const performanceData = [
    { month: 'Янв', applications: 120, approved: 95, rejected: 25, avgTime: 15 },
    { month: 'Фев', applications: 135, approved: 110, rejected: 25, avgTime: 14 },
    { month: 'Мар', applications: 150, approved: 125, rejected: 25, avgTime: 13 },
    { month: 'Апр', applications: 140, approved: 115, rejected: 25, avgTime: 12 },
    { month: 'Май', applications: 160, approved: 130, rejected: 30, avgTime: 11 },
    { month: 'Июн', applications: 180, approved: 145, rejected: 35, avgTime: 10 }
  ];

  const regionPerformance = [
    { region: 'Чуйская обл.', applications: 450, approved: 380, rejected: 70, avgTime: 10, efficiency: 84 },
    { region: 'Ошская обл.', applications: 380, approved: 320, rejected: 60, avgTime: 12, efficiency: 84 },
    { region: 'Нарынская обл.', applications: 320, approved: 280, rejected: 40, avgTime: 11, efficiency: 88 },
    { region: 'Баткенская обл.', applications: 280, approved: 240, rejected: 40, avgTime: 13, efficiency: 86 },
    { region: 'Иссык-Кульская обл.', applications: 250, approved: 210, rejected: 40, avgTime: 12, efficiency: 84 },
    { region: 'Джалал-Абадская обл.', applications: 220, approved: 180, rejected: 40, avgTime: 14, efficiency: 82 },
    { region: 'Таласская обл.', applications: 180, approved: 150, rejected: 30, avgTime: 11, efficiency: 83 }
  ];

  const specialistPerformance = [
    { name: 'Айжан Кыдырова', region: 'Чуйская обл.', applications: 45, approved: 38, rejected: 7, avgTime: 9, efficiency: 84 },
    { name: 'Марат Беков', region: 'Ошская обл.', applications: 42, approved: 36, rejected: 6, avgTime: 10, efficiency: 86 },
    { name: 'Гүлнара Осмонова', region: 'Нарынская обл.', applications: 38, approved: 34, rejected: 4, avgTime: 8, efficiency: 89 },
    { name: 'Айбек Кыдыров', region: 'Баткенская обл.', applications: 35, approved: 30, rejected: 5, avgTime: 11, efficiency: 86 },
    { name: 'Нургуль Асанова', region: 'Иссык-Кульская обл.', applications: 32, approved: 28, rejected: 4, avgTime: 10, efficiency: 88 },
    { name: 'Эркин Садыков', region: 'Джалал-Абадская обл.', applications: 28, approved: 24, rejected: 4, avgTime: 12, efficiency: 86 }
  ];

  const budgetData = [
    { month: 'Янв', budget: 5000000, spent: 4200000, remaining: 800000 },
    { month: 'Фев', budget: 5000000, spent: 4500000, remaining: 500000 },
    { month: 'Мар', budget: 5000000, spent: 4800000, remaining: 200000 },
    { month: 'Апр', budget: 5000000, spent: 4600000, remaining: 400000 },
    { month: 'Май', budget: 5000000, spent: 4900000, remaining: 100000 },
    { month: 'Июн', budget: 5000000, spent: 5000000, remaining: 0 }
  ];

  const filteredRegionData = selectedRegion === 'all' 
    ? regionPerformance 
    : regionPerformance.filter(region => region.region === selectedRegion);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyBg = (efficiency: number) => {
    if (efficiency >= 90) return 'bg-green-100';
    if (efficiency >= 80) return 'bg-yellow-100';
    return 'bg-red-100';
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
    <DirectorLayout currentPage="monitoring">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ru' ? 'Мониторинг системы' : 'Системанын мониторинги'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'ru' 
                  ? 'Контроль эффективности работы системы УБК' 
                  : 'УБК системасынын иштөө эффективдүүлүгүн көзөмөлдөө'
                }
              </p>
            </div>
            <div className="flex space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">{language === 'ru' ? 'Неделя' : 'Жума'}</option>
                <option value="month">{language === 'ru' ? 'Месяц' : 'Ай'}</option>
                <option value="quarter">{language === 'ru' ? 'Квартал' : 'Чейрек'}</option>
                <option value="year">{language === 'ru' ? 'Год' : 'Жыл'}</option>
              </select>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{language === 'ru' ? 'Все регионы' : 'Бардык аймактар'}</option>
                {regionPerformance.map(region => (
                  <option key={region.region} value={region.region}>{region.region}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {monitoringMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              icon={<i className={metric.icon}></i>}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'ru' ? 'Динамика показателей' : 'Көрсөткүчтөрдүн динамикасы'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name={language === 'ru' ? 'Заявлений' : 'Арыздар'}
                />
                <Line 
                  type="monotone" 
                  dataKey="approved" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name={language === 'ru' ? 'Утверждено' : 'Бектирилди'}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name={language === 'ru' ? 'Ср. время (дни)' : 'Орт. убакыт (күн)'}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Regional Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'ru' ? 'Эффективность по регионам' : 'Аймактар боюнча эффективдүүлүк'}
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
                    {language === 'ru' ? 'Ср. время' : 'Орт. убакыт'}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {language === 'ru' ? 'Эффективность' : 'Эффективдүүлүк'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRegionData.map((region, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{region.region}</td>
                    <td className="py-3 px-4">{region.applications}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">{region.approved}</td>
                    <td className="py-3 px-4 text-red-600 font-semibold">{region.rejected}</td>
                    <td className="py-3 px-4">{region.avgTime} {language === 'ru' ? 'дней' : 'күн'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEfficiencyBg(region.efficiency)} ${getEfficiencyColor(region.efficiency)}`}>
                        {region.efficiency}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Specialist Performance */}
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
                {specialistPerformance.map((specialist, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{specialist.name}</td>
                    <td className="py-3 px-4 text-gray-600">{specialist.region}</td>
                    <td className="py-3 px-4">{specialist.applications}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">{specialist.approved}</td>
                    <td className="py-3 px-4">{specialist.avgTime} {language === 'ru' ? 'дней' : 'күн'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEfficiencyBg(specialist.efficiency)} ${getEfficiencyColor(specialist.efficiency)}`}>
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
    </DirectorLayout>
  );
}
