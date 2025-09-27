'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const metrics = [
    {
      title: 'Всего заявок',
      value: '2,456',
      change: '+8%',
      changeType: 'positive' as const,
      icon: <i className="ri-file-list-3-line"></i>
    },
    {
      title: 'Одобрено',
      value: '1,234',
      change: '+5%',
      changeType: 'positive' as const,
      icon: <i className="ri-check-line"></i>
    },
    {
      title: 'На рассмотрении',
      value: '234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: <i className="ri-eye-line"></i>
    },
    {
      title: 'Отказано',
      value: '156',
      change: '-3%',
      changeType: 'negative' as const,
      icon: <i className="ri-close-line"></i>
    }
  ];

  const applicationsData = [
    { month: 'Янв', applications: 240, approved: 180, rejected: 25, inReview: 20, draft: 15 },
    { month: 'Фев', applications: 280, approved: 210, rejected: 30, inReview: 25, draft: 15 },
    { month: 'Мар', applications: 320, approved: 250, rejected: 35, inReview: 20, draft: 15 },
    { month: 'Апр', applications: 290, approved: 220, rejected: 28, inReview: 22, draft: 20 },
    { month: 'Май', applications: 350, approved: 280, rejected: 40, inReview: 15, draft: 15 },
    { month: 'Июн', applications: 380, approved: 300, rejected: 45, inReview: 20, draft: 15 }
  ];

  const statusData = [
    { name: 'Одобрено', value: 1234, color: '#10b981' },
    { name: 'На рассмотрении', value: 234, color: '#f59e0b' },
    { name: 'Обработка платежа', value: 156, color: '#8b5cf6' },
    { name: 'Черновик', value: 89, color: '#6b7280' },
    { name: 'Отклонено', value: 156, color: '#ef4444' }
  ];

  const inspectionData = [
    { day: 'Пн', scheduled: 8, completed: 7, pending: 1 },
    { day: 'Вт', scheduled: 12, completed: 10, pending: 2 },
    { day: 'Ср', scheduled: 6, completed: 6, pending: 0 },
    { day: 'Чт', scheduled: 15, completed: 12, pending: 3 },
    { day: 'Пт', scheduled: 9, completed: 8, pending: 1 },
    { day: 'Сб', scheduled: 4, completed: 4, pending: 0 },
    { day: 'Вс', scheduled: 2, completed: 2, pending: 0 }
  ];

  const bulkProcessingData = [
    { operation: 'Одобрить', count: 45, success: 42, failed: 3 },
    { operation: 'Отклонить', count: 12, success: 12, failed: 0 },
    { operation: 'Назначить проверку', count: 28, success: 25, failed: 3 },
    { operation: 'Отправить на доработку', count: 18, success: 18, failed: 0 }
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
              <Line type="monotone" dataKey="inReview" stroke="#f59e0b" strokeWidth={2} name="На рассмотрении" />
              <Line type="monotone" dataKey="draft" stroke="#6b7280" strokeWidth={2} name="Черновик" />
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
        {/* Field Inspections */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Выездные проверки</h3>
            <p className="text-neutral-600 mt-1">Запланированные и выполненные проверки по дням недели</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inspectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scheduled" fill="#3b82f6" name="Запланировано" />
              <Bar dataKey="completed" fill="#10b981" name="Выполнено" />
              <Bar dataKey="pending" fill="#f59e0b" name="Ожидает" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bulk Processing */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Массовая обработка</h3>
            <p className="text-neutral-600 mt-1">Статистика массовых операций за период</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bulkProcessingData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="operation" type="category" width={140} />
              <Tooltip />
              <Bar dataKey="success" fill="#10b981" name="Успешно" />
              <Bar dataKey="failed" fill="#ef4444" name="Ошибки" />
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
              <span className="font-semibold text-blue-600">2.5 часа</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Процент одобрения</span>
              <span className="font-semibold text-green-600">50.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Заявок в день</span>
              <span className="font-semibold text-purple-600">82 заявки</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Проведено проверок</span>
              <span className="font-semibold text-orange-600">49</span>
            </div>
          </div>
        </div>

        {/* Bulk Operations Summary */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Массовые операции</h3>
          <div className="space-y-3">
            {bulkProcessingData.map((operation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900">{operation.operation}</p>
                  <p className="text-sm text-neutral-600">{operation.count} операций</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">{operation.success} успешно</p>
                  <p className="text-xs text-neutral-600">{operation.failed} ошибок</p>
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
                <p className="text-xs text-neutral-600">+8% за месяц</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Улучшение времени</p>
                <p className="text-xs text-neutral-600">-0.1ч за неделю</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Рост проверок</p>
                <p className="text-xs text-neutral-600">+15% за месяц</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Стабильная точность</p>
                <p className="text-xs text-neutral-600">92.8% без изменений</p>
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
