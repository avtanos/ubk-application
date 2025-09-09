'use client';

import { useState } from 'react';
import Link from 'next/link';
// import Sidebar from './Sidebar'; // Removed - using individual sidebars
import LanguageSwitcher from '../ui/LanguageSwitcher';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [language, setLanguage] = useState('ru');

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Вернуться к выбору ролей"
              >
                <i className="ri-home-line text-lg"></i>
              </Link>
              <h2 className="text-xl font-semibold text-neutral-900">Главная система</h2>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher 
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">НЖ</span>
                </div>
                <span className="text-sm font-medium text-neutral-900">Нурбек Жумабеков</span>
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
