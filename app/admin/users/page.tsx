'use client';

import { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import MetricCard from '@/components/ui/MetricCard';
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
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Пользователи</h1>
          <p className="text-neutral-600 mt-1">Просмотр пользователей системы</p>
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Поиск пользователей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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


    </div>
  );
}