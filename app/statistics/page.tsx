'use client';

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MetricCard from '@/components/ui/MetricCard';

export default function StatisticsPage() {
  const monthlyData = [
    { month: 'Янв', applications: 145, approved: 112, payments: 1890000 },
    { month: 'Фев', applications: 167, approved: 128, payments: 2140000 },
    { month: 'Мар', applications: 189, approved: 145, payments: 2430000 },
    { month: 'Апр', applications: 203, approved: 156, payments: 2670000 },
    { month: 'Май', applications: 234, approved: 178, payments: 2890000 },
    { month: 'Июн', applications: 247, approved: 189, payments: 3120000 }
  ];

  const regionData = [
    { name: 'Бишкек', applications: 450, approved: 340, payments: 5670000 },
    { name: 'Ош', applications: 380, approved: 295, payments: 4890000 },
    { name: 'Нарын', applications: 120, approved: 98, payments: 1650000 },
    { name: 'Баткен', applications: 95, approved: 78, payments: 1340000 },
    { name: 'Джалал-Абад', applications: 290, approved: 225, payments: 3780000 },
    { name: 'Иссык-Куль', applications: 85, approved: 67, payments: 1120000 },
    { name: 'Талас', applications: 75, approved: 58, payments: 980000 }
  ];

  const benefitTypes = [
    { name: 'Базовое пособие', value: 68, color: '#EF4444' },
    { name: 'Горные районы', value: 18, color: '#F59E0B' },
    { name: 'Приграничные', value: 14, color: '#10B981' }
  ];

  const kpiMetrics = [
    {
      title: 'Всего заявок',
      value: '1,495',
      change: { value: '+12% за месяц', type: 'positive' as const },
      icon: <i className="ri-file-list-3-line text-4xl text-blue-600"></i>
    },
    {
      title: 'Одобрено',
      value: '1,161',
      change: { value: '77.7%', type: 'positive' as const },
      icon: <i className="ri-check-line text-4xl text-green-600"></i>
    },
    {
      title: 'Выплачено',
      value: '19.4M',
      change: { value: '+8% за месяц', type: 'positive' as const },
      icon: <i className="ri-money-dollar-circle-line text-4xl text-yellow-600"></i>
    },
    {
      title: 'Семей получают',
      value: '8,420',
      change: { value: '+156 новых', type: 'positive' as const },
      icon: <i className="ri-team-line text-4xl text-purple-600"></i>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Статистика</h1>
        <p className="text-neutral-600 mt-1">Аналитика и отчеты по программе семейных пособий</p>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Динамика по месяцам
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="applications" stackId="1" stroke="#EF4444" fill="#EF4444" name="Заявки" />
              <Area type="monotone" dataKey="approved" stackId="2" stroke="#10B981" fill="#10B981" name="Одобрено" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            По регионам
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="approved" fill="#EF4444" name="Одобрено" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Trends */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Объем выплат
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: any) => [`${(value / 1000000).toFixed(1)}M сом`, 'Выплаты']} />
            <Legend />
            <Line type="monotone" dataKey="payments" stroke="#F59E0B" strokeWidth={3} name="Выплаты" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Benefit Types Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Распределение типов пособий
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={benefitTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {benefitTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Ключевые показатели
          </h3>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-900">
                  Средний размер пособия
                </span>
                <span className="text-xl font-bold text-blue-600">2,347 сом</span>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-green-900">
                  Процент одобрений
                </span>
                <span className="text-xl font-bold text-green-600">77.7%</span>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-yellow-900">
                  Среднее время обработки
                </span>
                <span className="text-xl font-bold text-yellow-600">3.2 дня</span>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-purple-900">
                  Детей получают пособие
                </span>
                <span className="text-xl font-bold text-purple-600">14,230</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
