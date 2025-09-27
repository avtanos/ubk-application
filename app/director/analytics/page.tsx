'use client';

import { useState, useEffect } from 'react';
import DirectorLayout from '@/components/layout/DirectorLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

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
      id: 'invoices',
      name: language === 'ru' ? 'Накладные' : 'Накладнойлор',
      icon: 'ri-file-paper-line',
      color: 'green'
    },
    {
      id: 'payments',
      name: language === 'ru' ? 'Платежи' : 'Төлөмдөр',
      icon: 'ri-bank-card-line',
      color: 'orange'
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
    { month: 'Янв', applications: 120, approved: 95, rejected: 25, inReview: 15, draft: 8, paymentProcessing: 12 },
    { month: 'Фев', applications: 135, approved: 110, rejected: 25, inReview: 12, draft: 6, paymentProcessing: 15 },
    { month: 'Мар', applications: 150, approved: 125, rejected: 25, inReview: 18, draft: 10, paymentProcessing: 18 },
    { month: 'Апр', applications: 140, approved: 115, rejected: 25, inReview: 16, draft: 7, paymentProcessing: 16 },
    { month: 'Май', applications: 160, approved: 130, rejected: 30, inReview: 20, draft: 9, paymentProcessing: 20 },
    { month: 'Июн', applications: 180, approved: 145, rejected: 35, inReview: 22, draft: 12, paymentProcessing: 25 }
  ];


  const invoicesTrend = [
    { month: 'Янв', total: 8, pending: 2, approved: 5, rejected: 1 },
    { month: 'Фев', total: 10, pending: 3, approved: 6, rejected: 1 },
    { month: 'Мар', total: 12, pending: 2, approved: 8, rejected: 2 },
    { month: 'Апр', total: 9, pending: 1, approved: 7, rejected: 1 },
    { month: 'Май', total: 11, pending: 2, approved: 8, rejected: 1 },
    { month: 'Июн', total: 13, pending: 3, approved: 9, rejected: 1 }
  ];

  const paymentsTrend = [
    { month: 'Янв', total: 95, completed: 90, pending: 5, failed: 0 },
    { month: 'Фев', total: 110, completed: 105, pending: 4, failed: 1 },
    { month: 'Мар', total: 125, completed: 120, pending: 4, failed: 1 },
    { month: 'Апр', total: 115, completed: 110, pending: 4, failed: 1 },
    { month: 'Май', total: 130, completed: 125, pending: 4, failed: 1 },
    { month: 'Июн', total: 145, completed: 140, pending: 4, failed: 1 }
  ];

  const getChartData = () => {
    switch (selectedMetric) {
      case 'applications':
        return applicationsTrend.map(item => ({
          month: item.month,
          value: item.applications,
          approved: item.approved,
          rejected: item.rejected,
          inReview: item.inReview,
          draft: item.draft,
          paymentProcessing: item.paymentProcessing
        }));
      case 'invoices':
        return invoicesTrend.map(item => ({
          month: item.month,
          value: item.total,
          pending: item.pending,
          approved: item.approved,
          rejected: item.rejected
        }));
      case 'payments':
        return paymentsTrend.map(item => ({
          month: item.month,
          value: item.total,
          completed: item.completed,
          pending: item.pending,
          failed: item.failed
        }));
      case 'amounts':
        return applicationsTrend.map(item => ({
          month: item.month,
          value: item.approved * 1200 // Сумма только по одобренным заявлениям
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
      case 'invoices':
        return {
          type: 'bar',
          dataKey: 'value',
          color: '#10B981',
          name: language === 'ru' ? 'Накладные' : 'Накладнойлор'
        };
      case 'payments':
        return {
          type: 'area',
          dataKey: 'value',
          color: '#F59E0B',
          name: language === 'ru' ? 'Платежи' : 'Төлөмдөр'
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
                <Line 
                  type="monotone" 
                  dataKey="inReview" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name={language === 'ru' ? 'На рассмотрении' : 'Карап жатат'}
                />
                <Line 
                  type="monotone" 
                  dataKey="draft" 
                  stroke="#6B7280" 
                  strokeWidth={2}
                  name={language === 'ru' ? 'Черновик' : 'Долбоор'}
                />
                <Line 
                  type="monotone" 
                  dataKey="paymentProcessing" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name={language === 'ru' ? 'Обработка платежа' : 'Төлөмдү иштетүү'}
                />
              </>
            )}
            {selectedMetric === 'invoices' && (
              <>
                <Bar dataKey="pending" fill="#F59E0B" name={language === 'ru' ? 'Ожидают утверждения' : 'Бектириүү күтүүдө'} />
                <Bar dataKey="approved" fill="#10B981" name={language === 'ru' ? 'Утверждено' : 'Бектирилди'} />
                <Bar dataKey="rejected" fill="#EF4444" name={language === 'ru' ? 'Отклонено' : 'Четке кагылды'} />
              </>
            )}
            {selectedMetric === 'payments' && (
              <>
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10B981" 
                  fill="#10B981"
                  fillOpacity={0.3}
                  name={language === 'ru' ? 'Завершено' : 'Аякталды'}
                />
                <Area 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="#F59E0B" 
                  fill="#F59E0B"
                  fillOpacity={0.3}
                  name={language === 'ru' ? 'В обработке' : 'Иштетүүдө'}
                />
                <Area 
                  type="monotone" 
                  dataKey="failed" 
                  stroke="#EF4444" 
                  fill="#EF4444"
                  fillOpacity={0.3}
                  name={language === 'ru' ? 'Неудачные' : 'Ийгиликсиз'}
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
            <XAxis dataKey="month" />
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



      </div>
    </DirectorLayout>
  );
}
