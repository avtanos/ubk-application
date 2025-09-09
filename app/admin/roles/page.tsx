'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const metrics = [
    {
      title: 'Всего ролей',
      value: '8',
      change: '+1',
      changeType: 'positive' as const,
      icon: <i className="ri-shield-user-line"></i>
    },
    {
      title: 'Активных ролей',
      value: '6',
      change: '0',
      changeType: 'positive' as const,
      icon: <i className="ri-shield-check-line"></i>
    },
    {
      title: 'Пользователей с ролями',
      value: '156',
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
      name: 'Модератор',
      description: 'Просмотр и модерация заявлений',
      status: 'active',
      usersCount: 15,
      permissionsCount: 8,
      createdAt: '2023-03-15',
      color: 'yellow'
    },
    {
      id: 'ROLE-005',
      name: 'Аналитик',
      description: 'Доступ к отчетам и аналитике',
      status: 'active',
      usersCount: 6,
      permissionsCount: 6,
      createdAt: '2023-05-20',
      color: 'purple'
    },
    {
      id: 'ROLE-006',
      name: 'Гость',
      description: 'Ограниченный доступ для просмотра',
      status: 'inactive',
      usersCount: 0,
      permissionsCount: 2,
      createdAt: '2023-06-10',
      color: 'gray'
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

  const handleViewRole = (role: any) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Роли и права</h1>
          <p className="text-neutral-600 mt-1">Управление ролями пользователей и правами доступа</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <i className="ri-download-line mr-2"></i>
            Экспорт ролей
          </button>
          <button className="btn-primary">
            <i className="ri-add-line mr-2"></i>
            Создать роль
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

            <div className="flex space-x-2">
              <button 
                onClick={() => handleViewRole(role)}
                className="flex-1 btn-primary text-sm"
              >
                <i className="ri-eye-line mr-1"></i>
                Просмотр
              </button>
              <button className="btn-secondary text-sm px-3">
                <i className="ri-edit-line"></i>
              </button>
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
                <button className="text-blue-600 hover:text-blue-800">
                  <i className="ri-edit-line"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              <i className="ri-add-circle-line mr-2"></i>
              Создать новую роль
            </button>
            <button className="w-full btn-secondary text-left">
              <i className="ri-copy-line mr-2"></i>
              Дублировать роль
            </button>
            <button className="w-full btn-warning text-left">
              <i className="ri-key-line mr-2"></i>
              Управление разрешениями
            </button>
            <button className="w-full btn-info text-left">
              <i className="ri-download-line mr-2"></i>
              Экспорт конфигурации
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Статистика ролей</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Активных ролей</span>
              <span className="font-semibold text-green-600">6 из 8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Самые используемые</span>
              <span className="font-semibold text-blue-600">Специалист</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Среднее разрешений</span>
              <span className="font-semibold text-purple-600">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Последнее изменение</span>
              <span className="font-semibold text-orange-600">2 дня назад</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Детали роли"
        size="large"
      >
        {selectedRole && (
          <div className="space-y-6">
            {/* Role Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Информация о роли</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">ID роли:</span>
                    <span className="font-mono text-blue-600">{selectedRole.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Название:</span>
                    <span>{selectedRole.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Статус:</span>
                    <StatusBadge 
                      status={selectedRole.status === 'active' ? 'success' : 'warning'}
                      text={selectedRole.status === 'active' ? 'Активна' : 'Неактивна'}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Создана:</span>
                    <span>{selectedRole.createdAt}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Статистика</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Пользователей:</span>
                    <span className="text-green-600">{selectedRole.usersCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Разрешений:</span>
                    <span className="text-blue-600">{selectedRole.permissionsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Описание:</span>
                    <span className="text-neutral-900">{selectedRole.description}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Permissions */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Разрешения роли</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissions.slice(0, selectedRole.permissionsCount).map((permission, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <i className="ri-check-line text-green-600"></i>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{permission.name}</p>
                      <p className="text-xs text-neutral-600">{permission.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Users */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Пользователи с этой ролью</h3>
              <div className="space-y-2">
                {[
                  'Нурбек Жумабеков',
                  'Айгуль Токтосунова',
                  'Марат Беков',
                  'Айбек Кыдыров'
                ].slice(0, Math.min(selectedRole.usersCount, 4)).map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-semibold">
                          {user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm">{user}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <i className="ri-eye-line"></i>
                    </button>
                  </div>
                ))}
                {selectedRole.usersCount > 4 && (
                  <p className="text-sm text-neutral-600 text-center">
                    И еще {selectedRole.usersCount - 4} пользователей...
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-neutral-200">
              <button className="btn-primary">
                <i className="ri-edit-line mr-2"></i>
                Редактировать роль
              </button>
              <button className="btn-secondary">
                <i className="ri-copy-line mr-2"></i>
                Дублировать роль
              </button>
              <button className="btn-warning">
                <i className="ri-key-line mr-2"></i>
                Управление разрешениями
              </button>
              <button className="btn-error">
                <i className="ri-delete-bin-line mr-2"></i>
                Удалить роль
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
