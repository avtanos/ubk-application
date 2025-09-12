'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SpecialistSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function SpecialistSidebar({ isCollapsed = false, onToggle }: SpecialistSidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Главная',
      icon: <i className="ri-dashboard-line"></i>,
      href: '/dashboard'
    },
    {
      id: 'inspections',
      label: 'Выездные проверки',
      icon: <i className="ri-car-line"></i>,
      href: '/dashboard/inspections'
    },
    {
      id: 'bulk',
      label: 'Массовая обработка',
      icon: <i className="ri-file-copy-line"></i>,
      href: '/dashboard/bulk'
    },
    {
      id: 'analytics',
      label: 'Аналитика',
      icon: <i className="ri-bar-chart-line"></i>,
      href: '/dashboard/analytics'
    }
   
  ];

  return (
    <div className={`bg-neutral-100 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-screen flex flex-col`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand-gradient rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="ri-user-settings-line text-xl text-white"></i>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-neutral-900">Специалист</h1>
              <p className="text-xs text-neutral-600">Обработка заявлений</p>
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
                      ? 'bg-white text-brand-red shadow-sm border border-neutral-200'
                      : 'text-neutral-700 hover:bg-white hover:text-neutral-900'
                  }`}
                >
                  <span className={`text-lg ${isActive ? 'text-brand-red' : 'text-neutral-500 group-hover:text-neutral-700'}`}>
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
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">НЖ</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">Нурбек Жумабеков</p>
              <p className="text-xs text-neutral-600">Специалист</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
