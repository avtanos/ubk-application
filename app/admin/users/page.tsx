'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import MetricCard from '@/components/ui/MetricCard';
import Modal from '@/components/ui/Modal';
import { User, UserRole } from '@/lib/types';

// Mock данные для пользователей
const mockUsers: User[] = [
  {
    id: '1',
    username: 'nurbeck.jumabekov',
    email: 'nurbeck@ubk.kg',
    role: 'specialist',
    firstName: 'Нурбек',
    lastName: 'Жумабеков',
    isActive: true,
    lastLogin: new Date('2025-01-17'),
    permissions: ['view_applications', 'edit_applications', 'approve_applications']
  },
  {
    id: '2',
    username: 'aijan.kydyrova',
    email: 'aijan@ubk.kg',
    role: 'accountant',
    firstName: 'Айжан',
    lastName: 'Кыдырова',
    isActive: true,
    lastLogin: new Date('2025-01-17'),
    permissions: ['view_payments', 'process_payments', 'view_reports', 'generate_reports']
  },
  {
    id: '3',
    username: 'almaz.djumabekov',
    email: 'almaz@ubk.kg',
    role: 'admin',
    firstName: 'Алмаз',
    lastName: 'Джумабеков',
    isActive: true,
    lastLogin: new Date('2025-01-16'),
    permissions: ['manage_users', 'system_settings', 'audit_logs', 'view_reports']
  },
  {
    id: '4',
    username: 'test.user',
    email: 'test@ubk.kg',
    role: 'specialist',
    firstName: 'Тест',
    lastName: 'Пользователь',
    isActive: false,
    lastLogin: new Date('2025-01-10'),
    permissions: ['view_applications']
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = {
    total: users.length,
    active: users.filter(user => user.isActive).length,
    inactive: users.filter(user => !user.isActive).length,
    byRole: {
      specialist: users.filter(user => user.role === 'specialist').length,
      accountant: users.filter(user => user.role === 'accountant').length,
      admin: users.filter(user => user.role === 'admin').length,
      citizen: users.filter(user => user.role === 'citizen').length
    }
  };

  const metrics = [
    {
      title: 'Всего пользователей',
      value: stats.total.toString(),
      change: '+2 за месяц',
      changeType: 'positive' as const,
      icon: <i className="ri-user-line text-4xl text-blue-600"></i>
    },
    {
      title: 'Активных',
      value: stats.active.toString(),
      change: '+1 за неделю',
      changeType: 'positive' as const,
      icon: <i className="ri-user-check-line text-4xl text-green-600"></i>
    },
    {
      title: 'Неактивных',
      value: stats.inactive.toString(),
      change: '0',
      changeType: 'neutral' as const,
      icon: <i className="ri-user-unfollow-line text-4xl text-red-600"></i>
    },
    {
      title: 'Администраторов',
      value: stats.byRole.admin.toString(),
      change: '0',
      changeType: 'neutral' as const,
      icon: <i className="ri-shield-user-line text-4xl text-purple-600"></i>
    }
  ];

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isActive: !user.isActive }
          : user
      )
    );
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const columns = [
    {
      key: 'username',
      label: 'Логин',
      render: (value: string) => (
        <span className="font-mono text-sm font-medium text-neutral-900">{value}</span>
      )
    },
    {
      key: 'firstName',
      label: 'Имя',
      render: (value: string, row: User) => (
        <span className="font-medium text-neutral-900">
          {row.firstName} {row.lastName}
        </span>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => (
        <span className="text-sm text-neutral-600">{value}</span>
      )
    },
    {
      key: 'role',
      label: 'Роль',
      render: (value: UserRole) => {
        const roleMap: { [key in UserRole]: string } = {
          'specialist': 'Специалист',
          'accountant': 'Бухгалтер',
          'admin': 'Администратор',
          'citizen': 'Гражданин'
        };
        return (
          <StatusBadge 
            status={value === 'admin' ? 'error' : value === 'accountant' ? 'warning' : 'success'}
          >
            {roleMap[value]}
          </StatusBadge>
        );
      }
    },
    {
      key: 'isActive',
      label: 'Статус',
      render: (value: boolean) => (
        <StatusBadge status={value ? 'success' : 'error'}>
          {value ? 'Активен' : 'Неактивен'}
        </StatusBadge>
      )
    },
    {
      key: 'lastLogin',
      label: 'Последний вход',
      render: (value: Date) => (
        <span className="text-sm text-neutral-600">
          {value.toLocaleDateString('ru-RU')}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (value: any, row: User) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleEditUser(row)}
            className="btn-secondary text-sm px-3 py-1"
          >
            <i className="ri-edit-line mr-1"></i>
            Редактировать
          </button>
          <button 
            onClick={() => handleToggleUserStatus(row.id)}
            className={`text-sm px-3 py-1 ${
              row.isActive ? 'btn-warning' : 'btn-success'
            }`}
          >
            <i className={`mr-1 ${row.isActive ? 'ri-pause-line' : 'ri-play-line'}`}></i>
            {row.isActive ? 'Деактивировать' : 'Активировать'}
          </button>
          <button 
            onClick={() => handleDeleteUser(row.id)}
            className="btn-danger text-sm px-3 py-1"
          >
            <i className="ri-delete-bin-line mr-1"></i>
            Удалить
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Управление пользователями</h1>
          <p className="text-neutral-600 mt-1">Создание и управление пользователями системы</p>
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Поиск пользователей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <i className="ri-add-line mr-2"></i>
            Создать пользователя
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

      {/* Users Table */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Список пользователей</h3>
          <p className="text-neutral-600 mt-1">Все пользователи системы</p>
        </div>
        <DataTable
          data={filteredUsers}
          columns={columns}
          searchable={false}
          sortable={true}
          emptyMessage="Пользователи не найдены"
        />
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Статистика по ролям</h3>
          <div className="space-y-4">
            {[
              { role: 'Специалисты', count: stats.byRole.specialist, percentage: Math.round((stats.byRole.specialist / stats.total) * 100) },
              { role: 'Бухгалтеры', count: stats.byRole.accountant, percentage: Math.round((stats.byRole.accountant / stats.total) * 100) },
              { role: 'Администраторы', count: stats.byRole.admin, percentage: Math.round((stats.byRole.admin / stats.total) * 100) },
              { role: 'Граждане', count: stats.byRole.citizen, percentage: Math.round((stats.byRole.citizen / stats.total) * 100) }
            ].map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">{stat.role}</p>
                  <p className="text-sm text-neutral-600">{stat.count} пользователей</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-600">{stat.percentage}%</p>
                  <div className="w-20 bg-neutral-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="w-full btn-primary text-left"
            >
              <i className="ri-user-add-line mr-2"></i>
              Добавить нового пользователя
            </button>
            <button className="w-full btn-secondary text-left">
              <i className="ri-import-line mr-2"></i>
              Импорт пользователей
            </button>
            <button className="w-full btn-warning text-left">
              <i className="ri-user-settings-line mr-2"></i>
              Массовое редактирование
            </button>
            <button className="w-full btn-info text-left">
              <i className="ri-download-line mr-2"></i>
              Экспорт списка пользователей
            </button>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Создать пользователя"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Логин
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите логин"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Роль
            </label>
            <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="specialist">Специалист</option>
              <option value="accountant">Бухгалтер</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button className="btn-primary flex-1">
              Создать пользователя
            </button>
            <button 
              onClick={() => setShowCreateModal(false)}
              className="btn-secondary flex-1"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Редактировать пользователя"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Логин
              </label>
              <input
                type="text"
                defaultValue={selectedUser.username}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue={selectedUser.email}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Роль
              </label>
              <select 
                defaultValue={selectedUser.role}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="specialist">Специалист</option>
                <option value="accountant">Бухгалтер</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
            <div className="flex space-x-3 pt-4">
              <button className="btn-primary flex-1">
                Сохранить изменения
              </button>
              <button 
                onClick={() => setShowEditModal(false)}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}