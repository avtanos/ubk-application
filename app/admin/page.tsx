'use client';

import { useState, useEffect } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import UniversalFilters, { FilterConfig } from '@/components/ui/UniversalFilters';
import UniversalBulkActions, { BulkAction } from '@/components/ui/UniversalBulkActions';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: 'ri-dashboard-line' },
    { id: 'analytics', name: 'Аналитика', icon: 'ri-bar-chart-line' },
    { id: 'payments', name: 'Выплаты', icon: 'ri-money-dollar-circle-line' },
    { id: 'settings', name: 'Настройки', icon: 'ri-settings-line' }
  ];

  const metrics = [
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
      title: 'Выплачено сом',
      value: '19.4M',
      change: { value: '+8% за месяц', type: 'positive' as const },
      icon: <i className="ri-money-dollar-circle-line text-4xl text-yellow-600"></i>
    },
    {
      title: 'Семей получают',
      value: '8,420',
      change: { value: '+156 новых', type: 'positive' as const },
      icon: <i className="ri-team-line text-4xl text-purple-600"></i>
    },
    {
      title: 'Специалистов',
      value: '47',
      change: { value: 'Активных', type: 'neutral' as const },
      icon: <i className="ri-user-settings-line text-4xl text-red-600"></i>
    }
  ];

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

  const payments = [
    {
      id: 'PAY-001',
      family: 'Гүлнара Осмонова',
      amount: 4140,
      date: '2025-01-20',
      status: 'paid',
      region: 'Нарын'
    },
    {
      id: 'PAY-002',
      family: 'Жамиля Турдубекова',
      amount: 3880,
      date: '2025-01-20',
      status: 'paid',
      region: 'Баткен'
    },
    {
      id: 'PAY-003',
      family: 'Асель Маматова',
      amount: 2400,
      date: '2025-01-20',
      status: 'processing',
      region: 'Ош'
    },
    {
      id: 'PAY-004',
      family: 'Бурул Эркебекова',
      amount: 1380,
      date: '2025-01-20',
      status: 'paid',
      region: 'Бишкек'
    },
    {
      id: 'PAY-005',
      family: 'Айжан Абдуллаева',
      amount: 3600,
      date: '2025-01-20',
      status: 'suspended',
      region: 'Чуй'
    }
  ];

  const [filteredPayments, setFilteredPayments] = useState(payments);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filtered = [...payments];

    if (filters.status) {
      filtered = filtered.filter(payment => payment.status === filters.status);
    }

    if (filters.region) {
      filtered = filtered.filter(payment => payment.region === filters.region);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(payment => 
        new Date(payment.date) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(payment => 
        new Date(payment.date) <= toDate
      );
    }

    if (filters.family) {
      filtered = filtered.filter(payment => 
        payment.family.toLowerCase().includes(filters.family.toLowerCase())
      );
    }

    if (filters.amountMin !== undefined) {
      filtered = filtered.filter(payment => 
        payment.amount >= filters.amountMin
      );
    }

    if (filters.amountMax !== undefined) {
      filtered = filtered.filter(payment => 
        payment.amount <= filters.amountMax
      );
    }

    setFilteredPayments(filtered);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleSelectPayment = (payment: any, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(prev => [...prev, payment]);
    } else {
      setSelectedUsers(prev => prev.filter(p => p.id !== payment.id));
    }
  };

  const handleSelectAll = () => {
    setSelectedUsers([...filteredPayments]);
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  const handleBulkAction = async (action: string, paymentIds: string[], notes?: string) => {
    try {
      switch (action) {
        case 'approve':
          console.log('Одобрение выплат:', paymentIds);
          break;
        case 'reject':
          console.log('Отклонение выплат:', paymentIds);
          break;
        case 'export':
          const selectedData = payments.filter(p => paymentIds.includes(p.id));
          console.log('Экспорт выплат:', selectedData);
          break;
      }
      
      setSelectedUsers([]);
    } catch (error) {
      console.error('Ошибка при массовом действии:', error);
    }
  };

  // Конфигурация фильтров для выплат
  const paymentFilterConfig: FilterConfig[] = [
    {
      key: 'status',
      label: 'Статус',
      type: 'select',
      options: [
        { value: 'paid', label: 'Выплачено' },
        { value: 'pending', label: 'Ожидает' },
        { value: 'processing', label: 'В обработке' },
        { value: 'suspended', label: 'Приостановлено' }
      ]
    },
    {
      key: 'region',
      label: 'Регион',
      type: 'select',
      options: [
        { value: 'Бишкек', label: 'Бишкек' },
        { value: 'Чуй', label: 'Чуй' },
        { value: 'Ош', label: 'Ош' },
        { value: 'Нарын', label: 'Нарын' },
        { value: 'Баткен', label: 'Баткен' },
        { value: 'Иссык-Куль', label: 'Иссык-Куль' }
      ]
    },
    {
      key: 'dateFrom',
      label: 'Дата от',
      type: 'date'
    },
    {
      key: 'dateTo',
      label: 'Дата до',
      type: 'date'
    },
    {
      key: 'family',
      label: 'Семья',
      type: 'text',
      placeholder: 'Введите фамилию'
    },
    {
      key: 'amountMin',
      label: 'Сумма от (сом)',
      type: 'number',
      placeholder: '0'
    },
    {
      key: 'amountMax',
      label: 'Сумма до (сом)',
      type: 'number',
      placeholder: '1000000'
    }
  ];

  // Конфигурация массовых действий для выплат
  const paymentBulkActions: BulkAction[] = [
    {
      key: 'approve',
      label: 'Одобрить выплаты',
      icon: 'ri-check-line',
      color: 'bg-green-600 hover:bg-green-700 text-white',
      enabled: (items) => items.some(item => item.status === 'pending' || item.status === 'processing')
    },
    {
      key: 'reject',
      label: 'Отклонить выплаты',
      icon: 'ri-close-line',
      color: 'bg-red-600 hover:bg-red-700 text-white',
      enabled: (items) => items.some(item => item.status === 'pending' || item.status === 'processing')
    },
    {
      key: 'export',
      label: 'Экспортировать',
      icon: 'ri-download-line',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      enabled: (items) => items.length > 0
    }
  ];

  const paymentColumns = [
    {
      key: 'select',
      label: 'Выбор',
      render: (value: any, row: any) => (
        <input
          type="checkbox"
          checked={selectedUsers.some(p => p.id === row.id)}
          onChange={(e) => handleSelectPayment(row, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
        />
      )
    },
    {
      key: 'id',
      label: 'ID Платежа',
      render: (value: string) => (
        <span className="font-mono text-sm font-medium text-neutral-900">{value}</span>
      )
    },
    {
      key: 'family',
      label: 'Семья',
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-neutral-900">{value}</div>
          <div className="text-sm text-neutral-500">{row.region}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Сумма',
      render: (value: number) => (
        <span className="font-semibold text-green-600">{value.toLocaleString()} сом</span>
      )
    },
    {
      key: 'date',
      label: 'Дата',
      render: (value: string) => (
        <span className="text-sm text-neutral-600">{value}</span>
      )
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value: string) => (
        <StatusBadge status={value as any}>
          {value === 'paid' ? 'Выплачено' : 
           value === 'processing' ? 'Обработка' : 'Приостановлено'}
        </StatusBadge>
      )
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <button className="btn-secondary text-sm px-3 py-1">
            Детали
          </button>
          {row.status === 'processing' && (
            <button className="btn-success text-sm px-3 py-1">
              Подтвердить
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Системное управление</h1>
          <p className="text-neutral-600 mt-1">Управление системой, аналитика и настройки</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

      {/* Tab Navigation */}
      <div className="card">
        <div className="border-b border-neutral-200">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-red text-brand-red'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-900">
                Обзор системы
              </h3>

              {/* Charts Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="card">
                  <h4 className="text-lg font-semibold mb-4">
                    Динамика по месяцам
                  </h4>
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

                <div className="card">
                  <h4 className="text-lg font-semibold mb-4">
                    По регионам
                  </h4>
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

              {/* KPI Cards */}
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Загруженность</p>
                      <p className="text-2xl font-bold text-neutral-900">78%</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-dashboard-line text-2xl text-blue-600"></i>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Эффективность</p>
                      <p className="text-2xl font-bold text-neutral-900">92%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="ri-check-line text-2xl text-green-600"></i>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">SLA</p>
                      <p className="text-2xl font-bold text-neutral-900">96%</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <i className="ri-time-line text-2xl text-yellow-600"></i>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Автоматизация</p>
                      <p className="text-2xl font-bold text-neutral-900">85%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="ri-robot-line text-2xl text-purple-600"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-900">
                Аналитика и отчеты
              </h3>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="card">
                  <h4 className="text-lg font-semibold mb-4">
                    Объем выплат
                  </h4>
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

                <div className="card">
                  <h4 className="text-lg font-semibold mb-4">
                    Распределение типов пособий
                  </h4>
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
              </div>

              <div className="card">
                <h4 className="text-lg font-semibold mb-4">
                  Ключевые показатели
                </h4>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">2,347</div>
                    <div className="text-sm text-neutral-600">Средний размер пособия</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">77.7%</div>
                    <div className="text-sm text-neutral-600">Процент одобрений</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">3.2</div>
                    <div className="text-sm text-neutral-600">Среднее время обработки (дни)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">14,230</div>
                    <div className="text-sm text-neutral-600">Детей получают пособие</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Управление выплатами
                </h3>
                <div className="flex space-x-3">
                  <button className="btn-secondary">
                    <i className="ri-download-line mr-2"></i>
                    Экспорт
                  </button>
                  <button className="btn-primary">
                    <i className="ri-money-dollar-circle-line mr-2"></i>
                    Массовая выплата
                  </button>
                </div>
              </div>

              {/* Фильтры */}
              <UniversalFilters
                title="Фильтры выплат"
                filters={paymentFilterConfig}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />

              {/* Массовые операции */}
              <UniversalBulkActions
                title="Массовые операции"
                selectedItems={selectedUsers}
                onBulkAction={handleBulkAction}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                totalItems={filteredPayments.length}
                isAllSelected={selectedUsers.length === filteredPayments.length && filteredPayments.length > 0}
                actions={paymentBulkActions}
                getItemId={(payment) => payment.id}
                getItemDisplayName={(payment) => payment.family}
                calculateTotal={(payments) => payments.reduce((sum, payment) => sum + payment.amount, 0)}
                totalLabel="Общая сумма выплат"
              />

              <DataTable
                columns={paymentColumns}
                data={filteredPayments}
                emptyMessage="Нет выплат для отображения"
              />
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-900">
                Системные настройки
              </h3>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="card">
                  <h4 className="font-semibold text-neutral-900 mb-4">
                    Общие параметры
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Базовая ставка пособия (сом)</label>
                      <input type="number" defaultValue={1200} className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Порог ГМД (сом)</label>
                      <input type="number" defaultValue={6000} className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Максимальный возраст ребенка (лет)</label>
                      <input type="number" defaultValue={16} className="form-input" />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h4 className="font-semibold text-neutral-900 mb-4">
                    Региональные коэффициенты
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Горные районы</label>
                      <input type="number" step="0.05" defaultValue={1.15} className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Приграничные зоны</label>
                      <input type="number" step="0.05" defaultValue={1.20} className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Приграничная надбавка (сом)</label>
                      <input type="number" defaultValue={1000} className="form-input" />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h4 className="font-semibold text-neutral-900 mb-4">
                    Уведомления
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-700">Email уведомления</span>
                      <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-brand-red focus:ring-brand-red" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-700">Push уведомления</span>
                      <input type="checkbox" className="rounded border-neutral-300 text-brand-red focus:ring-brand-red" />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h4 className="font-semibold text-neutral-900 mb-4">
                    Безопасность
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-700">Логирование действий</span>
                      <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-brand-red focus:ring-brand-red" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-700">Автоматическое резервное копирование</span>
                      <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-brand-red focus:ring-brand-red" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn-primary">
                  <i className="ri-save-line mr-2"></i>
                  Сохранить настройки
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}