'use client';

import { useState } from 'react';
import Link from 'next/link';
import AccountantSidebar from './AccountantSidebar';
import LanguageSwitcher from '../ui/LanguageSwitcher';

interface AccountantLayoutProps {
  children: React.ReactNode;
}

export default function AccountantLayout({ children }: AccountantLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState('ru');

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <AccountantSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <i className="ri-menu-line text-lg"></i>
              </button>
              <Link 
                href="/" 
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Вернуться к выбору ролей"
              >
                <i className="ri-home-line text-lg"></i>
              </Link>
              <h2 className="text-xl font-semibold text-neutral-900">Кабинет бухгалтера</h2>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher 
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">БХ</span>
                </div>
                <span className="text-sm font-medium text-neutral-900">Айжан Кыдырова</span>
              </div>
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
