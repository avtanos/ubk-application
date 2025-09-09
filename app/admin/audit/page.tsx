'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';

export default function AuditPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const metrics = [
    {
      title: 'Всего событий',
      value: '8,456',
      change: '+15%',
      changeType: 'positive' as const,
      icon: <i className="ri-file-search-line"></i>
    },
    {
      title: 'Входов в систему',
      value: '2,847',
      change: '+12%',
      changeType: 'positive' as const,
      icon: <i className="ri-login-circle-line"></i>
    },
    {
      title: 'Изменений данных',
      value: '1,234',
      change: '+8%',
      changeType: 'positive' as const,
      icon: <i className="ri-edit-line"></i>
    },
    {
      title: 'Подозрительных действий',
      value: '23',
      change: '-3%',
      changeType: 'negative' as const,
      icon: <i className="ri-alarm-warning-line"></i>
    }
  ];

  const auditLogs = [
    {
      id: 'AUDIT-001',
      timestamp: '2024-01-15 14:30:15',
      user: 'Нурбек Жумабеков',
      action: 'Вход в систему',
      resource: 'Система',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Успешный вход в систему'
    },
    {
      id: 'AUDIT-002',
      timestamp: '2024-01-15 14:25:30',
      user: 'Айжан Кыдырова',
      action: 'Создание выплаты',
      resource: 'PAY-001',
      status: 'success',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Создана выплата для Айбека Кыдырова на сумму 50,000 сом'
    },
    {
      id: 'AUDIT-003',
      timestamp: '2024-01-15 14:20:45',
      user: 'Алмаз Джумабеков',
      action: 'Изменение роли пользователя',
      resource: 'USR-004',
      status: 'success',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Изменена роль пользователя Айгуль Токтосунова на "Специалист"'
    },
    {
      id: 'AUDIT-004',
      timestamp: '2024-01-15 14:15:20',
      user: 'Неизвестный',
      action: 'Попытка входа',
      resource: 'Система',
      status: 'failed',
      ipAddress: '192.168.1.200',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Неудачная попытка входа с неверным паролем'
    },
    {
      id: 'AUDIT-005',
      timestamp: '2024-01-15 14:10:10',
      user: 'Марат Беков',
      action: 'Экспорт данных',
      resource: 'Отчет по заявкам',
      status: 'success',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Экспортирован отчет по заявкам за январь 2024'
    }
  ];

  const columns = [
    {
      key: 'id',
      label: 'ID события',
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600">{value}</span>
      )
    },
    {
      key: 'timestamp',
      label: 'Время'
    },
    {
      key: 'user',
      label: 'Пользователь'
    },
    {
      key: 'action',
      label: 'Действие'
    },
    {
      key: 'resource',
      label: 'Ресурс'
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value: string) => (
        <StatusBadge 
          status={value === 'success' ? 'success' : 'error'}
          text={value === 'success' ? 'Успешно' : 'Ошибка'}
        />
      )
    },
    {
      key: 'ipAddress',
      label: 'IP адрес',
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      )
    }
  ];

  const suspiciousActivities = [
    {
      id: 'SUSP-001',
      timestamp: '2024-01-15 13:45:30',
      user: 'Неизвестный',
      action: 'Множественные попытки входа',
      severity: 'high',
      ipAddress: '192.168.1.200',
      details: '5 неудачных попыток входа за 10 минут',
      status: 'investigating'
    },
    {
      id: 'SUSP-002',
      timestamp: '2024-01-15 12:30:15',
      user: 'Айгуль Токтосунова',
      action: 'Необычная активность',
      severity: 'medium',
      ipAddress: '192.168.1.104',
      details: 'Доступ к данным вне рабочего времени',
      status: 'resolved'
    },
    {
      id: 'SUSP-003',
      timestamp: '2024-01-15 11:20:45',
      user: 'Марат Беков',
      action: 'Массовый экспорт данных',
      severity: 'medium',
      ipAddress: '192.168.1.103',
      details: 'Экспорт большого объема данных',
      status: 'investigating'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Аудит</h1>
          <p className="text-neutral-600 mt-1">Мониторинг действий пользователей и безопасности</p>
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
            Экспорт логов
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

      {/* Suspicious Activities */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Подозрительные действия</h3>
          <p className="text-neutral-600 mt-1">События, требующие внимания</p>
        </div>
        <div className="space-y-4">
          {suspiciousActivities.map((activity) => (
            <div key={activity.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-neutral-900">{activity.action}</h4>
                    <StatusBadge 
                      status={activity.severity === 'high' ? 'error' : 'warning'}
                      text={activity.severity === 'high' ? 'Высокий риск' : 'Средний риск'}
                    />
                    <StatusBadge 
                      status={activity.status === 'resolved' ? 'success' : 'warning'}
                      text={activity.status === 'resolved' ? 'Разрешено' : 'Расследуется'}
                    />
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-3">{activity.details}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">ID события:</span>
                      <p className="font-mono text-blue-600">{activity.id}</p>
                    </div>
                    <div>
                      <span className="text-neutral-600">Пользователь:</span>
                      <p className="text-neutral-900">{activity.user}</p>
                    </div>
                    <div>
                      <span className="text-neutral-600">IP адрес:</span>
                      <p className="font-mono text-neutral-900">{activity.ipAddress}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-neutral-600 text-sm">Время:</span>
                    <span className="ml-2 text-sm font-medium text-neutral-900">{activity.timestamp}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button className="btn-primary text-sm">
                    <i className="ri-eye-line mr-1"></i>
                    Просмотр
                  </button>
                  {activity.status === 'investigating' && (
                    <button className="btn-success text-sm">
                      <i className="ri-check-line mr-1"></i>
                      Разрешить
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Журнал аудита</h3>
          <p className="text-neutral-600 mt-1">Все события системы за выбранный период</p>
        </div>
        <DataTable
          data={auditLogs}
          columns={columns}
          searchable={true}
          sortable={true}
        />
      </div>

      {/* Security Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Статистика безопасности</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Успешных входов</span>
              <span className="font-semibold text-green-600">2,847</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Неудачных попыток</span>
              <span className="font-semibold text-red-600">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Подозрительных действий</span>
              <span className="font-semibold text-orange-600">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Блокировок</span>
              <span className="font-semibold text-red-600">8</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              <i className="ri-search-line mr-2"></i>
              Поиск по логам
            </button>
            <button className="w-full btn-secondary text-left">
              <i className="ri-download-line mr-2"></i>
              Экспорт отчета
            </button>
            <button className="w-full btn-warning text-left">
              <i className="ri-alarm-warning-line mr-2"></i>
              Настроить алерты
            </button>
            <button className="w-full btn-info text-left">
              <i className="ri-settings-3-line mr-2"></i>
              Настройки аудита
            </button>
          </div>
        </div>
      </div>

      {/* Activity Types */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Типы активности</h3>
          <p className="text-neutral-600 mt-1">Распределение событий по типам</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: 'Входы в систему', count: 2847, color: 'blue' },
            { type: 'Изменения данных', count: 1234, color: 'green' },
            { type: 'Экспорт данных', count: 567, color: 'yellow' },
            { type: 'Системные события', count: 456, color: 'purple' }
          ].map((activity, index) => (
            <div key={index} className="p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-neutral-900">{activity.type}</h4>
                <div className={`w-3 h-3 rounded-full ${
                  activity.color === 'blue' ? 'bg-blue-500' :
                  activity.color === 'green' ? 'bg-green-500' :
                  activity.color === 'yellow' ? 'bg-yellow-500' : 'bg-purple-500'
                }`}></div>
              </div>
              <p className="text-2xl font-bold text-neutral-900">{activity.count.toLocaleString()}</p>
              <p className="text-sm text-neutral-600">событий</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
