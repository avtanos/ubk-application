'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';

export default function SystemPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const metrics = [
    {
      title: 'Статус системы',
      value: 'Онлайн',
      change: '99.9%',
      changeType: 'positive' as const,
      icon: <i className="ri-server-line"></i>
    },
    {
      title: 'Активных пользователей',
      value: '142',
      change: '+8%',
      changeType: 'positive' as const,
      icon: <i className="ri-user-line"></i>
    },
    {
      title: 'Использование CPU',
      value: '45%',
      change: '+2%',
      changeType: 'positive' as const,
      icon: <i className="ri-cpu-line"></i>
    },
    {
      title: 'Использование памяти',
      value: '67%',
      change: '+5%',
      changeType: 'positive' as const,
      icon: <i className="ri-database-line"></i>
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Обзор системы', icon: <i className="ri-dashboard-line"></i> },
    { id: 'performance', label: 'Производительность', icon: <i className="ri-speed-line"></i> },
    { id: 'services', label: 'Сервисы', icon: <i className="ri-service-line"></i> },
    { id: 'logs', label: 'Логи системы', icon: <i className="ri-file-text-line"></i> }
  ];

  const services = [
    {
      name: 'Web Server',
      status: 'running',
      uptime: '15 дней',
      cpu: '25%',
      memory: '512 MB',
      port: '3000'
    },
    {
      name: 'Database',
      status: 'running',
      uptime: '15 дней',
      cpu: '35%',
      memory: '1.2 GB',
      port: '5432'
    },
    {
      name: 'Redis Cache',
      status: 'running',
      uptime: '15 дней',
      cpu: '15%',
      memory: '256 MB',
      port: '6379'
    },
    {
      name: 'File Storage',
      status: 'running',
      uptime: '15 дней',
      cpu: '10%',
      memory: '128 MB',
      port: '9000'
    },
    {
      name: 'Email Service',
      status: 'stopped',
      uptime: '0 дней',
      cpu: '0%',
      memory: '0 MB',
      port: '587'
    }
  ];

  const systemLogs = [
    {
      timestamp: '2024-01-15 14:30:15',
      level: 'INFO',
      service: 'Web Server',
      message: 'Server started successfully on port 3000'
    },
    {
      timestamp: '2024-01-15 14:25:30',
      level: 'WARN',
      service: 'Database',
      message: 'High memory usage detected: 85%'
    },
    {
      timestamp: '2024-01-15 14:20:45',
      level: 'ERROR',
      service: 'Email Service',
      message: 'Failed to send email: Connection timeout'
    },
    {
      timestamp: '2024-01-15 14:15:20',
      level: 'INFO',
      service: 'Redis Cache',
      message: 'Cache cleared successfully'
    },
    {
      timestamp: '2024-01-15 14:10:10',
      level: 'INFO',
      service: 'File Storage',
      message: 'File uploaded: document_001.pdf'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Информация о системе</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">Версия системы:</span>
              <span className="font-semibold">v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Время работы:</span>
              <span className="font-semibold">15 дней 8 часов</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Последнее обновление:</span>
              <span className="font-semibold">2024-01-01</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Следующее обновление:</span>
              <span className="font-semibold">2024-02-01</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Ресурсы системы</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>CPU</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Память</span>
                <span>67%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Диск</span>
                <span>34%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '34%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Производительность</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-neutral-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-neutral-900">Время отклика</h4>
              <i className="ri-time-line text-blue-600"></i>
            </div>
            <p className="text-2xl font-bold text-blue-600">245ms</p>
            <p className="text-sm text-neutral-600">Среднее время</p>
          </div>
          <div className="p-4 border border-neutral-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-neutral-900">Запросов в секунду</h4>
              <i className="ri-speed-line text-green-600"></i>
            </div>
            <p className="text-2xl font-bold text-green-600">1,247</p>
            <p className="text-sm text-neutral-600">Пиковая нагрузка</p>
          </div>
          <div className="p-4 border border-neutral-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-neutral-900">Ошибок</h4>
              <i className="ri-error-warning-line text-red-600"></i>
            </div>
            <p className="text-2xl font-bold text-red-600">0.1%</p>
            <p className="text-sm text-neutral-600">Процент ошибок</p>
          </div>
          <div className="p-4 border border-neutral-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-neutral-900">Доступность</h4>
              <i className="ri-check-line text-green-600"></i>
            </div>
            <p className="text-2xl font-bold text-green-600">99.9%</p>
            <p className="text-sm text-neutral-600">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Сервисы системы</h3>
          <p className="text-neutral-600 mt-1">Статус и производительность сервисов</p>
        </div>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">{service.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600">
                      <span>Порт: {service.port}</span>
                      <span>Время работы: {service.uptime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">{service.cpu}</p>
                    <p className="text-xs text-neutral-600">CPU</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">{service.memory}</p>
                    <p className="text-xs text-neutral-600">Память</p>
                  </div>
                  <div className="flex space-x-2">
                    <StatusBadge 
                      status={service.status === 'running' ? 'success' : 'error'}
                      text={service.status === 'running' ? 'Работает' : 'Остановлен'}
                    />
                    <button className="btn-secondary text-sm">
                      <i className="ri-settings-line mr-1"></i>
                      Настройки
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Логи системы</h3>
          <p className="text-neutral-600 mt-1">Последние события системы</p>
        </div>
        <div className="space-y-3">
          {systemLogs.map((log, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                log.level === 'ERROR' ? 'bg-red-500' :
                log.level === 'WARN' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-mono text-neutral-600">{log.timestamp}</span>
                  <StatusBadge 
                    status={
                      log.level === 'ERROR' ? 'error' :
                      log.level === 'WARN' ? 'warning' : 'success'
                    }
                    text={log.level}
                  />
                  <span className="text-sm font-semibold text-blue-600">{log.service}</span>
                </div>
                <p className="text-sm text-neutral-900 mt-1">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Система</h1>
          <p className="text-neutral-600 mt-1">Мониторинг и управление системой</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <i className="ri-refresh-line mr-2"></i>
            Обновить данные
          </button>
          <button className="btn-primary">
            <i className="ri-settings-3-line mr-2"></i>
            Системные настройки
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

      {/* System Tabs */}
      <div className="card">
        <div className="border-b border-neutral-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'performance' && renderPerformance()}
          {activeTab === 'services' && renderServices()}
          {activeTab === 'logs' && renderLogs()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              <i className="ri-restart-line mr-2"></i>
              Перезапустить систему
            </button>
            <button className="w-full btn-secondary text-left">
              <i className="ri-download-line mr-2"></i>
              Скачать логи
            </button>
            <button className="w-full btn-warning text-left">
              <i className="ri-settings-3-line mr-2"></i>
              Настройки производительности
            </button>
            <button className="w-full btn-info text-left">
              <i className="ri-information-line mr-2"></i>
              Системная информация
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Статус системы</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Все сервисы</span>
              <StatusBadge status="success" text="Работают" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">База данных</span>
              <StatusBadge status="success" text="Подключена" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Кэш</span>
              <StatusBadge status="success" text="Активен" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Файловое хранилище</span>
              <StatusBadge status="success" text="Доступно" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
