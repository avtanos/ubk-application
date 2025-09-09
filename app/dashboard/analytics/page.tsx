'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const metrics = [
    {
      title: 'Всего заявок',
      value: '2,847',
      change: '+12%',
      changeType: 'positive' as const,
      icon: <i className="ri-file-list-3-line"></i>
    },
    {
      title: 'Одобрено',
      value: '2,156',
      change: '+8%',
      changeType: 'positive' as const,
      icon: <i className="ri-check-line"></i>
    },
    {
      title: 'В обработке',
      value: '456',
      change: '+15%',
      changeType: 'positive' as const,
      icon: <i className="ri-loader-line"></i>
    },
    {
      title: 'Отклонено',
      value: '235',
      change: '-3%',
      changeType: 'negative' as const,
      icon: <i className="ri-close-line"></i>
    }
  ];

  const applicationsData = [
    { month: 'Янв', applications: 240, approved: 180, rejected: 25 },
    { month: 'Фев', applications: 280, approved: 210, rejected: 30 },
    { month: 'Мар', applications: 320, approved: 250, rejected: 35 },
    { month: 'Апр', applications: 290, approved: 220, rejected: 28 },
    { month: 'Май', applications: 350, approved: 280, rejected: 40 },
    { month: 'Июн', applications: 380, approved: 300, rejected: 45 }
  ];

  const statusData = [
    { name: 'Одобрено', value: 2156, color: '#10b981' },
    { name: 'В обработке', value: 456, color: '#f59e0b' },
    { name: 'Отклонено', value: 235, color: '#ef4444' }
  ];

  const processingTimeData = [
    { day: 'Пн', avgTime: 2.5 },
    { day: 'Вт', avgTime: 2.8 },
    { day: 'Ср', avgTime: 2.2 },
    { day: 'Чт', avgTime: 3.1 },
    { day: 'Пт', avgTime: 2.9 },
    { day: 'Сб', avgTime: 2.4 },
    { day: 'Вс', avgTime: 2.6 }
  ];

  const specialistPerformance = [
    { name: 'Нурбек Жумабеков', processed: 145, avgTime: 2.3, accuracy: 94 },
    { name: 'Айгуль Токтосунова', processed: 132, avgTime: 2.5, accuracy: 92 },
    { name: 'Марат Беков', processed: 128, avgTime: 2.8, accuracy: 89 },
    { name: 'Айжан Кыдырова', processed: 115, avgTime: 2.4, accuracy: 96 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Аналитика</h1>
          <p className="text-neutral-600 mt-1">Анализ эффективности обработки заявлений</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Последние 7 дней</option>
            <option value="30d">Последние 30 дней</option>
            <option value="90d">Последние 90 дней</option>
            <option value="1y">Последний год</option>
          </select>
          <button className="btn-secondary">
            <i className="ri-download-line mr-2"></i>
            Экспорт отчета
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Trend */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Динамика заявок</h3>
            <p className="text-neutral-600 mt-1">Количество заявок по месяцам</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} name="Заявки" />
              <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="Одобрено" />
              <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} name="Отклонено" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Распределение статусов</h3>
            <p className="text-neutral-600 mt-1">Текущее состояние заявок</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processing Time */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Время обработки</h3>
            <p className="text-neutral-600 mt-1">Среднее время обработки по дням недели</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processingTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgTime" fill="#8b5cf6" name="Часы" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Specialist Performance */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Производительность специалистов</h3>
            <p className="text-neutral-600 mt-1">Обработано заявок за период</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={specialistPerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="processed" fill="#06b6d4" name="Обработано" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Ключевые показатели</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Среднее время обработки</span>
              <span className="font-semibold text-blue-600">2.6 часа</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Процент одобрения</span>
              <span className="font-semibold text-green-600">75.7%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Заявок в день</span>
              <span className="font-semibold text-purple-600">95 заявок</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Точность проверки</span>
              <span className="font-semibold text-orange-600">92.8%</span>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Лучшие специалисты</h3>
          <div className="space-y-3">
            {specialistPerformance.slice(0, 3).map((specialist, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900">{specialist.name}</p>
                  <p className="text-sm text-neutral-600">{specialist.processed} заявок</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">{specialist.accuracy}%</p>
                  <p className="text-xs text-neutral-600">{specialist.avgTime}ч</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Тенденции</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Рост заявок</p>
                <p className="text-xs text-neutral-600">+12% за месяц</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Улучшение времени</p>
                <p className="text-xs text-neutral-600">-0.3ч за неделю</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Стабильная точность</p>
                <p className="text-xs text-neutral-600">92.8% без изменений</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Рост отклонений</p>
                <p className="text-xs text-neutral-600">+2% за неделю</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export and Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Отчеты и экспорт</h3>
            <p className="text-neutral-600 mt-1">Генерация детальных отчетов</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn-primary">
            <i className="ri-file-chart-line mr-2"></i>
            Ежедневный отчет
          </button>
          <button className="btn-secondary">
            <i className="ri-calendar-line mr-2"></i>
            Еженедельный отчет
          </button>
          <button className="btn-warning">
            <i className="ri-bar-chart-line mr-2"></i>
            Месячный отчет
          </button>
          <button className="btn-info">
            <i className="ri-download-line mr-2"></i>
            Экспорт данных
          </button>
        </div>
      </div>
    </div>
  );
}
