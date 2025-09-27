'use client';

import { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '../ui/LanguageSwitcher';

interface DirectorLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function DirectorLayout({ children, currentPage = 'main' }: DirectorLayoutProps) {
  const [language, setLanguage] = useState('ru');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigationItems = [
    {
      name: 'Главная',
      nameKy: 'Башкы',
      href: '/director',
      icon: 'ri-dashboard-line',
      key: 'main'
    },
    {
      name: 'Накладные',
      nameKy: 'Накладкалар',
      href: '/director/invoices',
      icon: 'ri-file-list-line',
      key: 'invoices'
    },
    {
      name: 'Отчеты',
      nameKy: 'Отчеттор',
      href: '/director/reports',
      icon: 'ri-file-chart-line',
      key: 'reports'
    },
    {
      name: 'Аналитика',
      nameKy: 'Аналитика',
      href: '/director/analytics',
      icon: 'ri-pie-chart-line',
      key: 'analytics'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-government-line text-xl text-white"></i>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {language === 'ru' ? 'Кабинет директора' : 'Директордун кабинети'}
                </h1>
                <p className="text-xs text-gray-600">
                  {language === 'ru' ? 'Система УБК' : 'УБК системасы'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = item.key === currentPage;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">
                    {language === 'ru' ? item.name : item.nameKy}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-blue-600"></i>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {language === 'ru' ? 'Директор' : 'Директор'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {language === 'ru' ? 'Управление соцзащиты' : 'Социалдык коргоо башкаруу'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-menu-line text-lg"></i>
              </button>
              <Link 
                href="/" 
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={language === 'ru' ? 'Вернуться к выбору ролей' : 'Ролдорду тандоого кайтуу'}
              >
                <i className="ri-home-line text-lg"></i>
              </Link>
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'ru' ? 'Кабинет директора' : 'Директордун кабинети'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
