'use client';

import { useState, useEffect } from 'react';
import DirectorLayout from '@/components/layout/DirectorLayout';
import MetricCard from '@/components/ui/MetricCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DirectorDashboard() {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock data for director dashboard
  const keyMetrics = [
    {
      title: language === 'ru' ? 'Всего заявлений' : 'Жалпы арыздар',
      value: '2,456',
      change: {
        value: '+12%',
        type: 'positive' as const
      },
      icon: 'ri-file-list-line',
      color: 'blue'
    },
    {
      title: language === 'ru' ? 'Ожидают утверждения' : 'Бектириүү күтүүдө',
      value: '89',
      change: {
        value: '+5%',
        type: 'positive' as const
      },
      icon: 'ri-time-line',
      color: 'yellow'
    },
    {
      title: language === 'ru' ? 'Назначено пособий' : 'Жөлөкпул берилди',
      value: '1,234',
      change: {
        value: '+8%',
        type: 'positive' as const
      },
      icon: 'ri-checkbox-circle-line',
      color: 'green'
    },
    {
      title: language === 'ru' ? 'Общая сумма выплат' : 'Жалпы төлөм суммасы',
      value: '15.2M сом',
      change: {
        value: '+15%',
        type: 'positive' as const
      },
      icon: 'ri-money-dollar-circle-line',
      color: 'purple'
    }
  ];

  const monthlyData = [
    { month: 'Янв', applications: 120, approved: 95, rejected: 25, pending: 15 },
    { month: 'Фев', applications: 135, approved: 110, rejected: 25, pending: 12 },
    { month: 'Мар', applications: 150, approved: 125, rejected: 25, pending: 18 },
    { month: 'Апр', applications: 140, approved: 115, rejected: 25, pending: 16 },
    { month: 'Май', applications: 160, approved: 130, rejected: 30, pending: 20 },
    { month: 'Июн', applications: 180, approved: 145, rejected: 35, pending: 22 }
  ];

  const regionData = [
    { name: 'Чуйская обл.', applications: 450, approved: 380, amount: 4500000 },
    { name: 'Ошская обл.', applications: 380, approved: 320, amount: 3800000 },
    { name: 'Нарынская обл.', applications: 320, approved: 280, amount: 3200000 },
    { name: 'Баткенская обл.', applications: 280, approved: 240, amount: 2800000 },
    { name: 'Иссык-Кульская обл.', applications: 250, approved: 210, amount: 2500000 },
    { name: 'Джалал-Абадская обл.', applications: 220, approved: 180, amount: 2200000 },
    { name: 'Таласская обл.', applications: 180, approved: 150, amount: 1800000 }
  ];

  const statusDistribution = [
    { name: language === 'ru' ? 'Назначено' : 'Берилди', value: 1234, color: '#10B981' },
    { name: language === 'ru' ? 'Ожидает утверждения' : 'Бектириүү күтүүдө', value: 89, color: '#F59E0B' },
    { name: language === 'ru' ? 'Отказано' : 'Четке кагылды', value: 156, color: '#EF4444' },
    { name: language === 'ru' ? 'На проверке' : 'Текшерүүдө', value: 67, color: '#3B82F6' }
  ];

  const recentApplications = [
    {
      id: 'APP-2025-001',
      applicant: 'Айгуль Токтосунова',
      region: 'Чуйская обл.',
      children: 3,
      amount: 3600,
      status: 'pending_approval',
      date: '2025-01-15',
      specialist: 'Айжан Кыдырова'
    },
    {
      id: 'APP-2025-002',
      applicant: 'Нурбек Жумабеков',
      region: 'Нарынская обл.',
      children: 4,
      amount: 6480,
      status: 'pending_approval',
      date: '2025-01-14',
      specialist: 'Марат Беков'
    },
    {
      id: 'APP-2025-003',
      applicant: 'Марат Беков',
      region: 'Ошская обл.',
      children: 2,
      amount: 2400,
      status: 'pending_approval',
      date: '2025-01-13',
      specialist: 'Гүлнара Осмонова'
    },
    {
      id: 'APP-2025-004',
      applicant: 'Гүлнара Осмонова',
      region: 'Баткенская обл.',
      children: 3,
      amount: 5400,
      status: 'pending_approval',
      date: '2025-01-12',
      specialist: 'Айбек Кыдыров'
    },
    {
      id: 'APP-2025-005',
      applicant: 'Эркин Садыков',
      region: 'Иссык-Кульская обл.',
      children: 1,
      amount: 1800,
      status: 'pending_approval',
      date: '2025-01-11',
      specialist: 'Нургуль Асанова'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      in_review: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      ru: {
        pending_approval: 'Ожидает утверждения',
        approved: 'Утверждено',
        rejected: 'Отказано',
        in_review: 'На проверке'
      },
      ky: {
        pending_approval: 'Бектириүү күтүүдө',
        approved: 'Бектирилди',
        rejected: 'Четке кагылды',
        in_review: 'Текшерүүдө'
      }
    };
    return statusTexts[language as keyof typeof statusTexts]?.[status as keyof typeof statusTexts.ru] || status;
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
    <DirectorLayout currentPage="main">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ru' ? 'Панель мониторинга' : 'Мониторинг панели'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'ru' 
                  ? 'Ключевые показатели программы УБК' 
                  : 'УБК программасынын негизги көрсөткүчтөрү'
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {language === 'ru' ? 'Обновлено' : 'Жаңыланды'}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleString(language === 'ru' ? 'ru-RU' : 'ky-KG')}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              icon={<i className={metric.icon}></i>}
            />
          ))}
        </div>

        {/* Monthly Applications Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'ru' ? 'Динамика заявлений по месяцам' : 'Айлар боюнча арыздардын динамикасы'}
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData}>
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
                dataKey="rejected" 
                stroke="#EF4444" 
                strokeWidth={2}
                name={language === 'ru' ? 'Отказано' : 'Четке кагылды'}
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name={language === 'ru' ? 'Ожидают утверждения' : 'Бектириүү күтүүдө'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'ru' ? 'Распределение по статусам' : 'Статустар боюнча бөлүштүрүү'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Regional Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'ru' ? 'Распределение по регионам' : 'Аймактар боюнча бөлүштүрүү'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#3B82F6" name={language === 'ru' ? 'Заявлений' : 'Арыздар'} />
                <Bar dataKey="approved" fill="#10B981" name={language === 'ru' ? 'Утверждено' : 'Бектирилди'} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'ru' ? 'Последние заявления' : 'Акыркы арыздар'}
              </h3>
              <a 
                href="/director/approvals" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {language === 'ru' ? 'Все заявления' : 'Бардык арыздар'} →
              </a>
            </div>
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium text-gray-900 truncate">{app.applicant}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {getStatusText(app.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {app.id} • {app.region} • {app.children} {language === 'ru' ? 'детей' : 'бала'} • {app.specialist}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {app.amount.toLocaleString()} сом
                    </div>
                    <div className="text-xs text-gray-500">{app.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DirectorLayout>
  );
}
