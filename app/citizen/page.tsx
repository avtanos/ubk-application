
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function CitizenPortal() {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const t = translations[language as keyof typeof translations];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="ri-government-line text-2xl text-white"></i>
          </div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-red-600">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <i className="ri-government-line text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Портал граждан' : 'Жарандардын порталы'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? 'Подача заявления на пособие «Үй-бүлөгө көмөк»' : '«Үй-бүлөгө көмөк» жөлөкпулуна арыз берүү'}
                  </p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'ru' ? 'Добро пожаловать в портал граждан' : 'Жарандардын порталына кош келиңиз'}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  {language === 'ru' ? 'Подача заявления' : 'Арыз берүү'}
                </h3>
                <p className="text-blue-800 mb-4">
                  {language === 'ru' 
                    ? 'Подайте заявление на получение пособия «Үй-бүлөгө көмөк» для семей с детьми до 16 лет.'
                    : '16га чейинки балдары бар үй-бүлөлөр үчүн «Үй-бүлөгө көмөк» жөлөкпулуна арыз бериңиз.'
                  }
                </p>
                <Link href="/citizen/new-application">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer">
                    {language === 'ru' ? 'Подать заявление' : 'Арыз берүү'}
                  </button>
                </Link>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">
                  {language === 'ru' ? 'Проверить статус' : 'Абалды текшерүү'}
                </h3>
                <p className="text-green-800 mb-4">
                  {language === 'ru' 
                    ? 'Узнайте статус вашего заявления по номеру.'
                    : 'Арыздын номери боюнча анын абалын билиңиз.'
                  }
                </p>
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 whitespace-nowrap cursor-pointer">
                  {language === 'ru' ? 'Проверить' : 'Текшерүү'}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                  {language === 'ru' ? 'Калькулятор пособия' : 'Жөлөкпул эсептөөчү'}
                </h3>
                <p className="text-yellow-800 mb-4">
                  {language === 'ru' 
                    ? 'Рассчитайте предварительный размер пособия.'
                    : 'Жөлөкпулдун алдын ала көлөмүн эсептеңиз.'
                  }
                </p>
                <Link href="/citizen/calculator">
                  <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 whitespace-nowrap cursor-pointer">
                    {language === 'ru' ? 'Рассчитать' : 'Эсептөө'}
                  </button>
                </Link>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">
                  {language === 'ru' ? 'Информация' : 'Маалымат'}
                </h3>
                <p className="text-purple-800 mb-4">
                  {language === 'ru' 
                    ? 'Узнайте больше о программе и условиях получения пособия.'
                    : 'Программа жана жөлөкпул алуу шарттары жөнүндө көбүрөөк маалымат алыңыз.'
                  }
                </p>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 whitespace-nowrap cursor-pointer">
                  {language === 'ru' ? 'Узнать больше' : 'Көбүрөөк билүү'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
