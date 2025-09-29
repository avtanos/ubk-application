'use client';

import MetricCard from '@/components/ui/MetricCard';

export default function AdminDashboard() {


  const metrics = [
    {
      title: 'Всего пользователей',
      value: '156',
      change: { value: '+8 за месяц', type: 'positive' as const },
      icon: <i className="ri-user-line text-4xl text-blue-600"></i>
    },
    {
      title: 'Активных ролей',
      value: '4',
      change: { value: 'Специалист, Бухгалтер, Директор, Админ', type: 'neutral' as const },
      icon: <i className="ri-shield-user-line text-4xl text-green-600"></i>
    },
    {
      title: 'Аудит записей',
      value: '2,847',
      change: { value: '+156 за день', type: 'positive' as const },
      icon: <i className="ri-file-search-line text-4xl text-yellow-600"></i>
    },
    {
      title: 'Системных событий',
      value: '1,234',
      change: { value: '+45 за час', type: 'positive' as const },
      icon: <i className="ri-settings-3-line text-4xl text-purple-600"></i>
    }
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Админ панель</h1>
          <p className="text-neutral-600 mt-1">Управление пользователями, ролями и аудит системы</p>
        </div>
      </div>

      {/* Metrics Cards */}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card">
          <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-line text-2xl text-blue-600"></i>
                </div>
                    <div>
              <h3 className="text-lg font-semibold text-neutral-900">Пользователи</h3>
              <p className="text-sm text-neutral-600">Управление пользователями системы</p>
                    </div>
                  </div>
                </div>

                <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-shield-user-line text-2xl text-green-600"></i>
            </div>
                    <div>
              <h3 className="text-lg font-semibold text-neutral-900">Роли и права</h3>
              <p className="text-sm text-neutral-600">Настройка ролей и разрешений</p>
                    </div>
                  </div>
                </div>

                <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-search-line text-2xl text-yellow-600"></i>
                    </div>
                    <div>
              <h3 className="text-lg font-semibold text-neutral-900">Аудит</h3>
              <p className="text-sm text-neutral-600">Просмотр журнала действий</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}