'use client';

import { useState, useEffect } from 'react';
import DirectorLayout from '@/components/layout/DirectorLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export default function AnalyticsPage() {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('applications');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const metrics = [
    {
      id: 'applications',
      name: language === 'ru' ? 'Заявлений' : 'Арыздар',
      icon: 'ri-file-list-line',
      color: 'blue'
    },
    {
      id: 'approvals',
      name: language === 'ru' ? 'Утверждений' : 'Бектирүүлөр',
      icon: 'ri-checkbox-circle-line',
      color: 'green'
    },
    {
      id: 'rejections',
      name: language === 'ru' ? 'Отказов' : 'Четке кагылгандар',
      icon: 'ri-close-circle-line',
      color: 'red'
    },
    {
      id: 'amounts',
      name: language === 'ru' ? 'Суммы выплат' : 'Төлөм суммалары',
      icon: 'ri-money-dollar-circle-line',
      color: 'purple'
    }
  ];

  // Mock data for analytics
  const applicationsTrend = [
    { month: 'Янв', applications: 120, approved: 95, rejected: 25, pending: 15 },
    { month: 'Фев', applications: 135, approved: 110, rejected: 25, pending: 12 },
    { month: 'Мар', applications: 150, approved: 125, rejected: 25, pending: 18 },
    { month: 'Апр', applications: 140, approved: 115, rejected: 25, pending: 16 },
    { month: 'Май', applications: 160, approved: 130, rejected: 30, pending: 20 },
    { month: 'Июн', applications: 180, approved: 145, rejected: 35, pending: 22 }
  ];

  const regionalComparison = [
    { region: 'Чуйская обл.', applications: 450, approved: 380, rejected: 70, amount: 4500000, efficiency: 84 },
    { region: 'Ошская обл.', applications: 380, approved: 320, rejected: 60, amount: 3800000, efficiency: 84 },
    { region: 'Нарынская обл.', applications: 320, approved: 280, rejected: 40, amount: 3200000, efficiency: 88 },
    { region: 'Баткенская обл.', applications: 280, approved: 240, rejected: 40, amount: 2800000, efficiency: 86 },
    { region: 'Иссык-Кульская обл.', applications: 250, approved: 210, rejected: 40, amount: 2500000, efficiency: 84 },
    { region: 'Джалал-Абадская обл.', applications: 220, approved: 180, rejected: 40, amount: 2200000, efficiency: 82 },
    { region: 'Таласская обл.', applications: 180, approved: 150, rejected: 30, amount: 1800000, efficiency: 83 }
  ];

  const demographicAnalysis = [
    { ageGroup: language === 'ru' ? '0-3 года' : '0-3 жыл', count: 320, percentage: 26 },
    { ageGroup: language === 'ru' ? '4-7 лет' : '4-7 жыл', count: 450, percentage: 36 },
    { ageGroup: language === 'ru' ? '8-12 лет' : '8-12 жыл', count: 280, percentage: 23 },
    { ageGroup: language === 'ru' ? '13-16 лет' : '13-16 жыл', count: 184, percentage: 15 }
  ];

  const efficiencyTrend = [
    { month: 'Янв', efficiency: 79, avgTime: 15, satisfaction: 85 },
    { month: 'Фев', efficiency: 81, avgTime: 14, satisfaction: 87 },
    { month: 'Мар', efficiency: 83, avgTime: 13, satisfaction: 89 },
    { month: 'Апр', efficiency: 85, avgTime: 12, satisfaction: 91 },
    { month: 'Май', efficiency: 87, avgTime: 11, satisfaction: 93 },
    { month: 'Июн', efficiency: 88, avgTime: 10, satisfaction: 95 }
  ];

  const budgetAnalysis = [
    { month: 'Янв', budget: 5000000, spent: 4200000, utilization: 84 },
    { month: 'Фев', budget: 5000000, spent: 4500000, utilization: 90 },
    { month: 'Мар', budget: 5000000, spent: 4800000, utilization: 96 },
    { month: 'Апр', budget: 5000000, spent: 4600000, utilization: 92 },
    { month: 'Май', budget: 5000000, spent: 4900000, utilization: 98 },
    { month: 'Июн', budget: 5000000, spent: 5000000, utilization: 100 }
  ];

  const getChartData = () => {
    switch (selectedMetric) {
      case 'applications':
        return applicationsTrend.map(item => ({
          month: item.month,
          value: item.applications,
          approved: item.approved,
          rejected: item.rejected
        }));
      case 'approvals':
        return applicationsTrend.map(item => ({
          month: item.month,
          value: item.approved
        }));
      case 'rejections':
        return applicationsTrend.map(item => ({
          month: item.month,
          value: item.rejected
        }));
      case 'amounts':
        return regionalComparison.map(item => ({
          region: item.region,
          value: item.amount
        }));
      default:
        return applicationsTrend;
    }
  };

  const getChartConfig = () => {
    switch (selectedMetric) {
      case 'applications':
        return {
          type: 'line',
          dataKey: 'value',
          color: '#3B82F6',
          name: language === 'ru' ? 'Заявлений' : 'Арыздар'
        };
      case 'approvals':
        return {
          type: 'area',
          dataKey: 'value',
          color: '#10B981',
          name: language === 'ru' ? 'Утверждено' : 'Бектирилди'
        };
      case 'rejections':
        return {
          type: 'bar',
          dataKey: 'value',
          color: '#EF4444',
          name: language === 'ru' ? 'Отказано' : 'Четке кагылды'
        };
      case 'amounts':
        return {
          type: 'bar',
          dataKey: 'value',
          color: '#8B5CF6',
          name: language === 'ru' ? 'Суммы выплат' : 'Төлөм суммалары'
        };
      default:
        return {
          type: 'line',
          dataKey: 'value',
          color: '#3B82F6',
          name: 'Value'
        };
    }
  };

  const renderChart = () => {
    const data = getChartData();
    const config = getChartConfig();

    if (config.type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={config.dataKey} 
              stroke={config.color} 
              strokeWidth={3}
              name={config.name}
            />
            {selectedMetric === 'applications' && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="approved" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name={language === 'ru' ? 'Утверждено' : 'Бектирилди'}
                />
                <Line 
                  type="monotone" 
                  dataKey="rejected" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name={language === 'ru' ? 'Отказано' : 'Четке кагылды'}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (config.type === 'area') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey={config.dataKey} 
              stroke={config.color} 
              fill={config.color}
              fillOpacity={0.3}
              name={config.name}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (config.type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedMetric === 'amounts' ? 'region' : 'month'} angle={selectedMetric === 'amounts' ? -45 : 0} textAnchor={selectedMetric === 'amounts' ? 'end' : 'middle'} height={selectedMetric === 'amounts' ? 100 : 60} />
            <YAxis />
            <Tooltip formatter={(value) => selectedMetric === 'amounts' ? `${(value as number).toLocaleString()} сом` : value} />
            <Legend />
            <Bar dataKey={config.dataKey} fill={config.color} name={config.name} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return null;
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
    <DirectorLayout currentPage="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ru' ? 'Аналитика' : 'Аналитика'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'ru' 
                  ? 'Глубокий анализ данных и трендов программы УБК' 
                  : 'УБК программасынын маалыматтарын жана тенденцияларын терең анализ'
                }
              </p>
            </div>
            <div className="flex space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="3months">{language === 'ru' ? '3 месяца' : '3 ай'}</option>
                <option value="6months">{language === 'ru' ? '6 месяцев' : '6 ай'}</option>
                <option value="year">{language === 'ru' ? 'Год' : 'Жыл'}</option>
                <option value="all">{language === 'ru' ? 'Все время' : 'Бардык убакыт'}</option>
              </select>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{language === 'ru' ? 'Все регионы' : 'Бардык аймактар'}</option>
                {regionalComparison.map(region => (
                  <option key={region.region} value={region.region}>{region.region}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'ru' ? 'Выберите метрику для анализа' : 'Анализ үчүн метриканы тандаңыз'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedMetric === metric.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <i className={`${metric.icon} text-2xl text-${metric.color}-600`}></i>
                  <div className="text-left">
                    <div className="font-medium">{metric.name}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {metrics.find(m => m.id === selectedMetric)?.name} - {language === 'ru' ? 'Динамика' : 'Динамика'}
          </h3>
          {renderChart()}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Efficiency Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'ru' ? 'Тренд эффективности' : 'Эффективдүүлүктүн тенденциясы'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={efficiencyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name={language === 'ru' ? 'Эффективность (%)' : 'Эффективдүүлүк (%)'}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name={language === 'ru' ? 'Ср. время (дни)' : 'Орт. убакыт (күн)'}
                />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name={language === 'ru' ? 'Удовлетворенность (%)' : 'Канааттандыруу (%)'}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Regional Comparison */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'ru' ? 'Сравнение по регионам' : 'Аймактар боюнча салыштыруу'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#3B82F6" name={language === 'ru' ? 'Заявлений' : 'Арыздар'} />
                <Bar dataKey="approved" fill="#10B981" name={language === 'ru' ? 'Утверждено' : 'Бектирилди'} />
                <Bar dataKey="rejected" fill="#EF4444" name={language === 'ru' ? 'Отказано' : 'Четке кагылды'} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Demographic Analysis */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'ru' ? 'Демографический анализ' : 'Демографиялык анализ'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demographicAnalysis}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ ageGroup, percentage }) => `${ageGroup} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {demographicAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'ru' ? 'Ключевые инсайты' : 'Негизги инсайттар'}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <i className="ri-trending-up-line text-2xl text-green-600"></i>
                <h4 className="font-semibold text-green-800">
                  {language === 'ru' ? 'Рост эффективности' : 'Эффективдүүлүктүн өсүшү'}
                </h4>
              </div>
              <p className="text-sm text-green-700">
                {language === 'ru' 
                  ? 'Эффективность обработки заявлений выросла на 9% за последние 6 месяцев'
                  : 'Арыздарды иштетүүнүн эффективдүүлүгү акыркы 6 айда 9% өстү'
                }
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <i className="ri-user-heart-line text-2xl text-blue-600"></i>
                <h4 className="font-semibold text-blue-800">
                  {language === 'ru' ? 'Увеличение охвата' : 'Камтуунун кеңейиши'}
                </h4>
              </div>
              <p className="text-sm text-blue-700">
                {language === 'ru' 
                  ? 'Количество получателей пособия увеличилось на 15% по сравнению с прошлым годом'
                  : 'Жөлөкпул алуучулардын саны өткөн жылга салыштырганда 15% өстү'
                }
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <i className="ri-time-line text-2xl text-yellow-600"></i>
                <h4 className="font-semibold text-yellow-800">
                  {language === 'ru' ? 'Сокращение времени' : 'Убакытты кыскартуу'}
                </h4>
              </div>
              <p className="text-sm text-yellow-700">
                {language === 'ru' 
                  ? 'Среднее время обработки заявления сократилось с 15 до 10 дней'
                  : 'Арызды иштетүүнүн орточо убактысы 15 күндөн 10 күнгө кыскарды'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </DirectorLayout>
  );
}
