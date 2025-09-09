
'use client';

import { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Home() {
  const [language, setLanguage] = useState('ru');

  const content = {
    ru: {
      title: 'Үй-бүлөгө көмөк',
      subtitle: 'Программа "Үй-бүлөгө көмөк" - Помощь семьям Кыргызстана',
      description: 'Система управления семейными пособиями для граждан Кыргызской Республики',
      specialist: 'Кабинет специалиста',
      specialistDesc: 'Рассмотрение и обработка заявлений',
      accountant: 'Кабинет бухгалтера',
      accountantDesc: 'Управление выплатами и финансовая отчетность',
      admin: 'Админ панель',
      adminDesc: 'Управление системой и отчетность',
      director: 'Кабинет директора',
      directorDesc: 'Контроль и утверждение заявлений',
      features: 'Преимущества системы',
      autoCalc: 'Автоматический расчет пособий',
      regionalCoeff: 'Региональные коэффициенты',
      integration: 'Интеграция с государственными базами',
      mobile: 'Мобильная версия',
      activeApps: 'Активных заявлений',
      somPerChild: 'Сом на ребенка',
      regions: 'Областей',
      accuracy: 'Точность расчетов'
    },
    ky: {
      title: 'Үй-бүлөгө көмөк',
      subtitle: 'Программа "Үй-бүлөгө көмөк" - Кыргызстандын үй-бүлөлөрүнө жардам',
      description: 'Кыргыз Республикасынын жарандары үчүн үй-бүлөлүк жөлөкпулдарды башкаруу системасы',
      specialist: 'Адистин кабинети',
      specialistDesc: 'Арыздарды карап чыгуу жана иштетүү',
      accountant: 'Бухгалтердин кабинети',
      accountantDesc: 'Төлөмдөрдү башкаруу жана финансылык отчеттуулук',
      admin: 'Админ панели',
      adminDesc: 'Системаны башкаруу жана отчеттуулук',
      director: 'Директордун кабинети',
      directorDesc: 'Арыздарды көзөмөлдөө жана бекитүү',
      features: 'Системанын артыкчылыктары',
      autoCalc: 'Жөлөкпулдарды автоматтык эсептөө',
      regionalCoeff: 'Аймактык коэффициенттер',
      integration: 'Мамлекеттик базалар менен интеграция',
      mobile: 'Мобилдик версия',
      activeApps: 'Активдүү арыздар',
      somPerChild: 'Балага сом',
      regions: 'Аймактар',
      accuracy: 'Эсептөө тактыгы'
    }
  };

  const t = content[language as keyof typeof content];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <i className="ri-building-line text-lg md:text-xl text-white"></i>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-neutral-900">{t.title}</h1>
                <p className="text-xs md:text-sm text-neutral-600">Кыргызская Республика</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <LanguageSwitcher 
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1200' height='500' viewBox='0 0 1200 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FFE4B5;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23DEB887;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23CD853F;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='500' fill='url(%23sky)'/%3E%3C!-- Mountains --%3E%3Cpolygon points='0,300 200,150 400,200 600,100 800,180 1000,120 1200,200 1200,500 0,500' fill='%238B7355' opacity='0.8'/%3E%3C!-- Yurts --%3E%3Cg transform='translate(100,350)'%3E%3C!-- Yurt 1 --%3E%3Ccircle cx='0' cy='0' r='40' fill='%23F5F5DC'/%3E%3Cpath d='M-40,0 Q0,-30 40,0' fill='%23DEB887'/%3E%3Cline x1='0' y1='-30' x2='0' y2='40' stroke='%238B4513' stroke-width='2'/%3E%3C!-- Yurt 2 --%3E%3Ccircle cx='80' cy='0' r='40' fill='%23F5F5DC'/%3E%3Cpath d='M40,0 Q80,-30 120,0' fill='%23DEB887'/%3E%3Cline x1='80' y1='-30' x2='80' y2='40' stroke='%238B4513' stroke-width='2'/%3E%3C!-- Yurt 3 --%3E%3Ccircle cx='160' cy='0' r='40' fill='%23F5F5DC'/%3E%3Cpath d='M120,0 Q160,-30 200,0' fill='%23DEB887'/%3E%3Cline x1='160' y1='-30' x2='160' y2='40' stroke='%238B4513' stroke-width='2'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-yellow-900/60"></div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4 md:px-6">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight">
              {t.subtitle}
            </h2>
            <p className="text-sm md:text-lg lg:text-xl mb-6 md:mb-8 opacity-95 leading-relaxed">
              {t.description}
            </p>
            
            {/* Main Entry Cards */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center max-w-6xl mx-auto">
              <Link href="/dashboard" className="group w-full sm:w-auto">
                <div className="bg-white rounded-2xl p-6 md:p-8 text-center w-full sm:w-72 md:w-80 h-40 md:h-48 flex flex-col justify-center items-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-100 rounded-2xl mb-3 md:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="ri-user-settings-line text-2xl md:text-3xl text-yellow-600"></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-2">
                    {t.specialist}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600">
                    {t.specialistDesc}
                  </p>
                </div>
              </Link>
              
              <Link href="/accountant" className="group w-full sm:w-auto">
                <div className="bg-white rounded-2xl p-6 md:p-8 text-center w-full sm:w-72 md:w-80 h-40 md:h-48 flex flex-col justify-center items-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-2xl mb-3 md:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="ri-money-dollar-circle-line text-2xl md:text-3xl text-green-600"></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-2">
                    {t.accountant}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600">
                    {t.accountantDesc}
                  </p>
                </div>
              </Link>
              
              <Link href="/director" className="group w-full sm:w-auto">
                <div className="bg-white rounded-2xl p-6 md:p-8 text-center w-full sm:w-72 md:w-80 h-40 md:h-48 flex flex-col justify-center items-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl mb-3 md:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="ri-government-line text-2xl md:text-3xl text-blue-600"></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-2">
                    {t.director}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600">
                    {t.directorDesc}
                  </p>
                </div>
              </Link>
              
              <Link href="/admin" className="group w-full sm:w-auto">
                <div className="bg-white rounded-2xl p-6 md:p-8 text-center w-full sm:w-72 md:w-80 h-40 md:h-48 flex flex-col justify-center items-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-2xl mb-3 md:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="ri-shield-user-line text-2xl md:text-3xl text-red-600"></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-2">
                    {t.admin}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600">
                    {t.adminDesc}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-2xl md:text-4xl font-bold text-neutral-900 mb-4">
              {t.features}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-2xl mx-auto mb-4 md:mb-6 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <i className="ri-file-chart-line text-xl md:text-2xl text-red-600"></i>
              </div>
              <h4 className="text-base md:text-lg font-semibold mb-3 text-neutral-900">
                {t.autoCalc}
              </h4>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-100 rounded-2xl mx-auto mb-4 md:mb-6 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <i className="ri-map-pin-line text-xl md:text-2xl text-yellow-600"></i>
              </div>
              <h4 className="text-base md:text-lg font-semibold mb-3 text-neutral-900">
                {t.regionalCoeff}
              </h4>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-2xl mx-auto mb-4 md:mb-6 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <i className="ri-database-2-line text-xl md:text-2xl text-red-600"></i>
              </div>
              <h4 className="text-base md:text-lg font-semibold mb-3 text-neutral-900">
                {t.integration}
              </h4>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-100 rounded-2xl mx-auto mb-4 md:mb-6 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <i className="ri-smartphone-line text-xl md:text-2xl text-yellow-600"></i>
              </div>
              <h4 className="text-base md:text-lg font-semibold mb-3 text-neutral-900">
                {t.mobile}
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 md:py-20 bg-neutral-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-4 md:p-8 text-center shadow-sm">
              <div className="text-2xl md:text-4xl font-bold text-red-600 mb-2">45,672</div>
              <p className="text-xs md:text-sm text-neutral-600">{t.activeApps}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 md:p-8 text-center shadow-sm">
              <div className="text-2xl md:text-4xl font-bold text-yellow-600 mb-2">1,200</div>
              <p className="text-xs md:text-sm text-neutral-600">{t.somPerChild}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 md:p-8 text-center shadow-sm">
              <div className="text-2xl md:text-4xl font-bold text-red-600 mb-2">7</div>
              <p className="text-xs md:text-sm text-neutral-600">{t.regions}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 md:p-8 text-center shadow-sm">
              <div className="text-2xl md:text-4xl font-bold text-yellow-600 mb-2">98.5%</div>
              <p className="text-xs md:text-sm text-neutral-600">{t.accuracy}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-gradient rounded-lg flex items-center justify-center">
                  <i className="ri-government-line text-lg md:text-xl text-white"></i>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-bold">Үй-бүлөгө көмөк</h4>
                  <p className="text-xs md:text-sm text-neutral-400">Государственная программа</p>
                </div>
              </div>
              <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
                Система управления семейными пособиями для граждан Кыргызской Республики
              </p>
            </div>
            
            <div>
              <h5 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Контакты</h5>
              <div className="space-y-2 text-sm md:text-base text-neutral-400">
                <p><i className="ri-phone-line mr-2"></i>+996 (312) 66-00-00</p>
                <p><i className="ri-mail-line mr-2"></i>info@mlsp.gov.kg</p>
                <p><i className="ri-map-pin-line mr-2"></i>г. Бишкек, ул. Московская, 95</p>
              </div>
            </div>
            
            <div className="md:col-span-2 lg:col-span-1">
              <h5 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Полезные ссылки</h5>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-sm md:text-base text-neutral-400">
                <p><a href="#" className="hover:text-white transition-colors">О программе</a></p>
                <p><a href="#" className="hover:text-white transition-colors">Документы</a></p>
                <p><a href="#" className="hover:text-white transition-colors">Поддержка</a></p>
                <p><a href="#" className="hover:text-white transition-colors">Новости</a></p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 pt-6 md:pt-8 text-center">
            <p className="text-sm md:text-base text-neutral-400">
              © 2025 Министерство труда и социального развития Кыргызской Республики
            </p>
            <p className="text-xs md:text-sm text-neutral-500 mt-2">
              Система &ldquo;Үй-бүлөгө көмөк&rdquo; - Помощь семьям Кыргызстана
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
 