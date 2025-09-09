'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function BudgetPage() {
  const [selectedYear, setSelectedYear] = useState('2024');

  const metrics = [
    {
      title: 'Общий бюджет',
      value: '500,000,000',
      change: { value: '+5%', type: 'positive' as const },
      icon: <i className="ri-wallet-line"></i>
    },
    {
      title: 'Использовано',
      value: '312,500,000',
      change: { value: '+12%', type: 'positive' as const },
      icon: <i className="ri-money-dollar-circle-line"></i>
    },
    {
      title: 'Остаток',
      value: '187,500,000',
      change: { value: '-8%', type: 'negative' as const },
      icon: <i className="ri-pie-chart-line"></i>
    },
    {
      title: 'Процент использования',
      value: '62.5%',
      change: { value: '+7%', type: 'positive' as const },
      icon: <i className="ri-percent-line"></i>
    }
  ];

  const budgetData = [
    { month: 'Янв', budget: 41666667, spent: 25000000, remaining: 16666667 },
    { month: 'Фев', budget: 41666667, spent: 28000000, remaining: 13666667 },
    { month: 'Мар', budget: 41666667, spent: 32000000, remaining: 9666667 },
    { month: 'Апр', budget: 41666667, spent: 29000000, remaining: 12666667 },
    { month: 'Май', budget: 41666667, spent: 35000000, remaining: 6666667 },
    { month: 'Июн', budget: 41666667, spent: 38000000, remaining: 3666667 }
  ];

  const categoryData = [
    { name: 'Единовременные выплаты', value: 250000000, color: '#3b82f6' },
    { name: 'Административные расходы', value: 45000000, color: '#10b981' },
    { name: 'Техническое обеспечение', value: 17500000, color: '#f59e0b' },
    { name: 'Резервный фонд', value: 187500000, color: '#ef4444' }
  ];

  const regionData = [
    { region: 'Бишкек', budget: 150000000, spent: 95000000, percentage: 63.3 },
    { region: 'Ош', budget: 100000000, spent: 62000000, percentage: 62.0 },
    { region: 'Джалал-Абад', budget: 80000000, spent: 48000000, percentage: 60.0 },
    { region: 'Иссык-Куль', budget: 70000000, spent: 42000000, percentage: 60.0 },
    { region: 'Талас', budget: 50000000, spent: 31000000, percentage: 62.0 },
    { region: 'Нарын', budget: 50000000, spent: 34500000, percentage: 69.0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Бюджет</h1>
          <p className="text-neutral-600 mt-1">Управление и мониторинг бюджета программы</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
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
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Budget Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Budget Usage */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Использование бюджета по месяцам</h3>
            <p className="text-neutral-600 mt-1">Динамика расходования средств</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [value.toLocaleString(), '']} />
              <Bar dataKey="budget" fill="#e5e7eb" name="Бюджет" />
              <Bar dataKey="spent" fill="#3b82f6" name="Потрачено" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget by Category */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Распределение бюджета</h3>
            <p className="text-neutral-600 mt-1">По категориям расходов</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value.toLocaleString(), '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Budget */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Бюджет по регионам</h3>
          <p className="text-neutral-600 mt-1">Распределение и использование средств по регионам</p>
        </div>
        <div className="space-y-4">
          {regionData.map((region, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-neutral-900">{region.region}</h4>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">{region.percentage}%</p>
                  <p className="text-xs text-neutral-600">использовано</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-neutral-600">Бюджет:</span>
                  <p className="font-semibold">{region.budget.toLocaleString()} сом</p>
                </div>
                <div>
                  <span className="text-neutral-600">Потрачено:</span>
                  <p className="font-semibold text-blue-600">{region.spent.toLocaleString()} сом</p>
                </div>
                <div>
                  <span className="text-neutral-600">Остаток:</span>
                  <p className="font-semibold text-green-600">{(region.budget - region.spent).toLocaleString()} сом</p>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>Прогресс использования</span>
                  <span>{region.percentage}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      region.percentage > 80 ? 'bg-red-500' :
                      region.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${region.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Forecast */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Прогноз бюджета</h3>
          <p className="text-neutral-600 mt-1">Прогнозирование расходов на основе текущих трендов</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={budgetData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [value.toLocaleString(), '']} />
            <Line type="monotone" dataKey="budget" stroke="#e5e7eb" strokeWidth={2} name="Бюджет" />
            <Line type="monotone" dataKey="spent" stroke="#3b82f6" strokeWidth={2} name="Потрачено" />
            <Line type="monotone" dataKey="remaining" stroke="#10b981" strokeWidth={2} name="Остаток" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Budget Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Предупреждения</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <i className="ri-alarm-warning-line text-yellow-600"></i>
              <div>
                <p className="text-sm font-medium text-yellow-800">Превышение бюджета в Нарыне</p>
                <p className="text-xs text-yellow-600">Использовано 69% от бюджета</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <i className="ri-information-line text-blue-600"></i>
              <div>
                <p className="text-sm font-medium text-blue-800">Резервный фонд</p>
                <p className="text-xs text-blue-600">37.5% бюджета в резерве</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <i className="ri-check-line text-green-600"></i>
              <div>
                <p className="text-sm font-medium text-green-800">Бюджет в норме</p>
                <p className="text-xs text-green-600">Общее использование 62.5%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              <i className="ri-add-line mr-2"></i>
              Добавить статью расходов
            </button>
            <button className="w-full btn-secondary text-left">
              <i className="ri-edit-line mr-2"></i>
              Редактировать бюджет
            </button>
            <button className="w-full btn-warning text-left">
              <i className="ri-calendar-line mr-2"></i>
              Планировать расходы
            </button>
            <button className="w-full btn-info text-left">
              <i className="ri-download-line mr-2"></i>
              Экспорт бюджета
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
