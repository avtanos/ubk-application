'use client';

import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';

export default function RolesPage() {

  const metrics = [
    {
      title: 'Всего ролей',
      value: '4',
      change: '0',
      changeType: 'neutral' as const,
      icon: <i className="ri-shield-user-line"></i>
    },
    {
      title: 'Активных ролей',
      value: '4',
      change: '0',
      changeType: 'neutral' as const,
      icon: <i className="ri-shield-check-line"></i>
    },
    {
      title: 'Пользователей с ролями',
      value: '134',
      change: '+8%',
      changeType: 'positive' as const,
      icon: <i className="ri-user-line"></i>
    },
    {
      title: 'Разрешений',
      value: '24',
      change: '+2',
      changeType: 'positive' as const,
      icon: <i className="ri-key-line"></i>
    }
  ];

  const roles = [
    {
      id: 'ROLE-001',
      name: 'Администратор',
      description: 'Полный доступ ко всем функциям системы',
      status: 'active',
      usersCount: 8,
      permissionsCount: 24,
      createdAt: '2023-01-01',
      color: 'red'
    },
    {
      id: 'ROLE-002',
      name: 'Бухгалтер',
      description: 'Управление финансовыми операциями и выплатами',
      status: 'active',
      usersCount: 34,
      permissionsCount: 18,
      createdAt: '2023-01-01',
      color: 'green'
    },
    {
      id: 'ROLE-003',
      name: 'Специалист',
      description: 'Обработка заявлений и работа с документами',
      status: 'active',
      usersCount: 89,
      permissionsCount: 12,
      createdAt: '2023-01-01',
      color: 'blue'
    },
    {
      id: 'ROLE-004',
      name: 'Директор',
      description: 'Контроль и утверждение решений',
      status: 'active',
      usersCount: 3,
      permissionsCount: 10,
      createdAt: '2023-03-15',
      color: 'yellow'
    }
  ];

  const permissions = [
    { id: 'PERM-001', name: 'Просмотр заявок', category: 'Заявки', description: 'Возможность просматривать заявки' },
    { id: 'PERM-002', name: 'Создание заявок', category: 'Заявки', description: 'Возможность создавать новые заявки' },
    { id: 'PERM-003', name: 'Редактирование заявок', category: 'Заявки', description: 'Возможность редактировать заявки' },
    { id: 'PERM-004', name: 'Удаление заявок', category: 'Заявки', description: 'Возможность удалять заявки' },
    { id: 'PERM-005', name: 'Просмотр выплат', category: 'Выплаты', description: 'Возможность просматривать выплаты' },
    { id: 'PERM-006', name: 'Создание выплат', category: 'Выплаты', description: 'Возможность создавать выплаты' },
    { id: 'PERM-007', name: 'Управление пользователями', category: 'Пользователи', description: 'Возможность управлять пользователями' },
    { id: 'PERM-008', name: 'Системные настройки', category: 'Система', description: 'Доступ к системным настройкам' }
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Роли и права</h1>
          <p className="text-neutral-600 mt-1">Просмотр ролей пользователей и прав доступа</p>
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

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  role.color === 'red' ? 'bg-red-100' :
                  role.color === 'green' ? 'bg-green-100' :
                  role.color === 'blue' ? 'bg-blue-100' :
                  role.color === 'yellow' ? 'bg-yellow-100' :
                  role.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <i className={`ri-shield-user-line text-lg ${
                    role.color === 'red' ? 'text-red-600' :
                    role.color === 'green' ? 'text-green-600' :
                    role.color === 'blue' ? 'text-blue-600' :
                    role.color === 'yellow' ? 'text-yellow-600' :
                    role.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                  }`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{role.name}</h3>
                  <p className="text-sm text-neutral-600">{role.description}</p>
                </div>
              </div>
              <StatusBadge 
                status={role.status === 'active' ? 'success' : 'warning'}
                text={role.status === 'active' ? 'Активна' : 'Неактивна'}
              />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">ID роли:</span>
                <span className="font-mono text-blue-600">{role.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Пользователей:</span>
                <span className="font-semibold text-green-600">{role.usersCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Разрешений:</span>
                <span className="font-semibold text-blue-600">{role.permissionsCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Создана:</span>
                <span>{role.createdAt}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Permissions Management */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Управление разрешениями</h3>
          <p className="text-neutral-600 mt-1">Все доступные разрешения в системе</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {permissions.map((permission) => (
            <div key={permission.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-neutral-900">{permission.name}</h4>
                  <p className="text-sm text-neutral-600">{permission.description}</p>
                </div>
                <StatusBadge status="info" text={permission.category} />
              </div>
              <div className="flex justify-between text-xs text-neutral-600">
                <span>ID: {permission.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}
