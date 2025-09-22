'use client';

import { useState } from 'react';
import ExternalServicesMonitor from '@/components/ui/ExternalServicesMonitor';
import ExternalDataViewer from '@/components/ui/ExternalDataViewer';
import { externalApiService } from '@/lib/externalApiService';

export default function IntegrationsPage() {
  const [language, setLanguage] = useState('ru');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [externalData, setExternalData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckData = async () => {
    if (!pin.trim()) {
      setError('Введите ПИН для проверки');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await externalApiService.getAllDataByPIN(pin);
      setExternalData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при получении данных');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'ru' ? 'Интеграции с внешними сервисами' : 'Тышкы сервистер менен интеграциялар'}
          </h1>
          <p className="text-gray-600">
            {language === 'ru' 
              ? 'Мониторинг и тестирование интеграции с государственными информационными системами'
              : 'Мамлекеттик маалыматтык системалар менен интеграцияны мониторинг жана тестирлөө'}
          </p>
        </div>

        {/* Переключатель языка */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {language === 'ru' ? 'Язык:' : 'Тил:'}
            </span>
            <button
              onClick={() => setLanguage('ru')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                language === 'ru'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Русский
            </button>
            <button
              onClick={() => setLanguage('ky')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                language === 'ky'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Кыргызча
            </button>
          </div>
        </div>

        {/* Мониторинг сервисов */}
        <div className="mb-8">
          <ExternalServicesMonitor language={language} />
        </div>

        {/* Тестирование данных по ПИН */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <i className="ri-search-line mr-3 text-blue-600"></i>
                {language === 'ru' ? 'Проверка данных по ПИН' : 'ПИН боюнча маалыматтарды текшерүү'}
              </h2>
              <p className="text-gray-600 mt-2">
                {language === 'ru' 
                  ? 'Получение данных из всех внешних систем по персональному идентификационному номеру'
                  : 'Жеке идентификациялык номер боюнча бардык тышкы системалардан маалымат алуу'}
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ru' ? 'ПИН (14-16 цифр)' : 'ПИН (14-16 сан)'}
                  </label>
                  <input
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder={language === 'ru' ? 'Введите ПИН' : 'ПИН киргизиңиз'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={16}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleCheckData}
                    disabled={isLoading || !pin.trim()}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        {language === 'ru' ? 'Проверка...' : 'Текшерүү...'}
                      </>
                    ) : (
                      <>
                        <i className="ri-search-line mr-2"></i>
                        {language === 'ru' ? 'Проверить' : 'Текшерүү'}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-error-warning-line text-red-600 mr-2"></i>
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}

              {externalData && (
                <div className="mt-6">
                  <ExternalDataViewer language={language} data={externalData} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Информация о сервисах */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <i className="ri-information-line mr-3 text-blue-600"></i>
              {language === 'ru' ? 'Информация о сервисах' : 'Сервистер жөнүндө маалымат'}
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {language === 'ru' ? 'МСЭК' : 'МСЭК'}
                </h3>
                <p className="text-blue-800 text-sm mb-2">
                  {language === 'ru' 
                    ? 'Медико-социальная экспертная комиссия'
                    : 'Медициналык-социалдык эксперттик комиссия'}
                </p>
                <p className="text-blue-700 text-xs">
                  {language === 'ru' 
                    ? 'Данные об инвалидности и медицинских экспертизах'
                    : 'Инвалиддик жана медициналык экспертизалар жөнүндө маалыматтар'}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">
                  {language === 'ru' ? 'ГРС' : 'ГРС'}
                </h3>
                <p className="text-green-800 text-sm mb-2">
                  {language === 'ru' 
                    ? 'Государственная регистрационная служба'
                    : 'Мамлекеттик каттоо кызматы'}
                </p>
                <p className="text-green-700 text-xs">
                  {language === 'ru' 
                    ? 'Паспортные данные, ЗАГС, адреса, транспорт'
                    : 'Паспорт маалыматтары, ЗАГС, даректер, транспорт'}
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  {language === 'ru' ? 'СФ' : 'СФ'}
                </h3>
                <p className="text-yellow-800 text-sm mb-2">
                  {language === 'ru' 
                    ? 'Социальный Фонд'
                    : 'Социалдык Фонд'}
                </p>
                <p className="text-yellow-700 text-xs">
                  {language === 'ru' 
                    ? 'Пенсии и периоды работы'
                    : 'Пенсиялар жана жумуш мезгилдери'}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">
                  {language === 'ru' ? 'Ветеринария' : 'Ветеринария'}
                </h3>
                <p className="text-purple-800 text-sm mb-2">
                  {language === 'ru' 
                    ? 'Министерство водных ресурсов и сельского хозяйства'
                    : 'Суу ресурстары жана айыл чарбасы министрлиги'}
                </p>
                <p className="text-purple-700 text-xs">
                  {language === 'ru' 
                    ? 'Данные о КРС и МРС'
                    : 'КРС жана МРС жөнүндө маалыматтар'}
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">
                  {language === 'ru' ? 'ГНС' : 'ГНС'}
                </h3>
                <p className="text-red-800 text-sm mb-2">
                  {language === 'ru' 
                    ? 'Государственная налоговая служба'
                    : 'Мамлекеттик салык кызматы'}
                </p>
                <p className="text-red-700 text-xs">
                  {language === 'ru' 
                    ? 'Патенты и индивидуальные предприниматели'
                    : 'Патенттер жана жеке ишкерлер'}
                </p>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-900 mb-2">
                  {language === 'ru' ? 'ГКДО' : 'ГКДО'}
                </h3>
                <p className="text-indigo-800 text-sm mb-2">
                  {language === 'ru' 
                    ? 'Государственный комитет по делам обороны'
                    : 'Коргоо иштери боюнча мамлекеттик комитет'}
                </p>
                <p className="text-indigo-700 text-xs">
                  {language === 'ru' 
                    ? 'Ветераны ВОВ, ЧАЭС, Афганистана'
                    : 'ВОВ, ЧАЭС, Афганистан ветераны'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
