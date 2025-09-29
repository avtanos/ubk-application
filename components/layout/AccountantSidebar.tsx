'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AccountantSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function AccountantSidebar({ isCollapsed = false, onToggle }: AccountantSidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      id: 'payments',
      label: 'Выплаты',
      icon: <i className="ri-money-dollar-circle-line"></i>,
      href: '/accountant/payments'
    },
    {
      id: 'reconciliation',
      label: 'Сверка по заявкам',
      icon: <i className="ri-check-double-line"></i>,
      href: '/accountant/reconciliation'
    },
    {
      id: 'registries',
      label: 'Накладные',
      icon: <i className="ri-file-list-3-line"></i>,
      href: '/accountant/registries'
    },
    {
      id: 'reports',
      label: 'Отчеты',
      icon: <i className="ri-bar-chart-line"></i>,
      href: '/accountant/reports'
    }
  ];

  return (
    <div className={`bg-neutral-100 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-screen flex flex-col`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="ri-money-dollar-circle-line text-xl text-white"></i>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-neutral-900">Бухгалтер</h1>
              <p className="text-xs text-neutral-600">Финансовое управление</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-white text-green-600 shadow-sm border border-neutral-200'
                      : 'text-neutral-700 hover:bg-white hover:text-neutral-900'
                  }`}
                >
                  <span className={`text-lg ${isActive ? 'text-green-600' : 'text-neutral-500 group-hover:text-neutral-700'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">БХ</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">Айжан Кыдырова</p>
              <p className="text-xs text-neutral-600">Бухгалтер</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
