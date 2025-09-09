'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface ExportRegistryClientProps {
  registryId: string;
}

export default function ExportRegistryClient({ registryId }: ExportRegistryClientProps) {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [registry, setRegistry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exportData, setExportData] = useState({
    format: 'excel',
    includeDetails: true,
    includeStatistics: true,
    fileName: '',
    email: ''
  });

  useEffect(() => {
    setIsClient(true);
    // Имитация загрузки данных
    setTimeout(() => {
      setRegistry({
        id: registryId,
        month: 'Январь 2025',
        totalAmount: 12500000,
        recipients: 1250,
        status: 'completed',
        date: '2025-01-15',
        region: 'Нарынская область',
        payments: [
          { id: 'PAY-001', family: 'Гүлнара Осмонова', amount: 4140, children: 3, status: 'paid', date: '2025-01-20' },
          { id: 'PAY-002', family: 'Айгүл Касымова', amount: 3600, children: 2, status: 'paid', date: '2025-01-20' },
          { id: 'PAY-003', family: 'Нурбек Жумабеков', amount: 4800, children: 4, status: 'paid', date: '2025-01-20' },
          { id: 'PAY-004', family: 'Айнура Токтосунова', amount: 3000, children: 1, status: 'paid', date: '2025-01-20' },
          { id: 'PAY-005', family: 'Бакыт Калматов', amount: 5400, children: 5, status: 'paid', date: '2025-01-20' }
        ]
      });
      setExportData(prev => ({
        ...prev,
        fileName: `Реестр_${registryId}_${new Date().toISOString().split('T')[0]}`
      }));
      setIsLoading(false);
    }, 1000);
  }, [registryId]);

  const t = translations[language as keyof typeof translations];

  const handleInputChange = (field: string, value: any) => {
    setExportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = () => {
    // Имитация экспорта
    alert(language === 'ru' 
      ? `Экспорт реестра ${registryId} в формате ${exportData.format} начат. Файл будет сохранен как "${exportData.fileName}.${exportData.format === 'excel' ? 'xlsx' : 'pdf'}"`
      : `${registryId} реестрин ${exportData.format} форматында экспорту башталды. Файл "${exportData.fileName}.${exportData.format === 'excel' ? 'xlsx' : 'pdf'}" деп сакталат`
    );
  };

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="ri-government-line text-2xl text-white"></i>
          </div>
          <div className="text-gray-600">
            {isLoading ? 'Загрузка...' : 'Loading...'}
          </div>
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
              <Link href="/accountant" className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <i className="ri-government-line text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Экспорт реестра' : 'Реестрди экспорттоо'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? 'Экспорт реестра выплат в различных форматах' : 'Төлөмдөрдүн реестрин ар кандай форматтарда экспорттоо'}
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
        {/* Registry Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'ru' ? 'Реестр' : 'Реестр'} {registry.id}
              </h2>
              <p className="text-gray-600">
                {language === 'ru' ? 'Период' : 'Мөөнөт'}: {registry.month}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 mb-2" suppressHydrationWarning={true}>
                {registry.totalAmount.toLocaleString()} сом
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {language === 'ru' ? 'Завершен' : 'Аякталды'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Export Options */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-settings-line mr-3 text-purple-600"></i>
                {language === 'ru' ? 'Настройки экспорта' : 'Экспорт жөндөөлөрү'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ru' ? 'Формат файла' : 'Файл форматы'}
                  </label>
                  <select
                    value={exportData.format}
                    onChange={(e) => handleInputChange('format', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="excel">
                      {language === 'ru' ? 'Microsoft Excel (.xlsx)' : 'Microsoft Excel (.xlsx)'}
                    </option>
                    <option value="pdf">
                      {language === 'ru' ? 'PDF документ (.pdf)' : 'PDF документ (.pdf)'}
                    </option>
                    <option value="csv">
                      {language === 'ru' ? 'CSV файл (.csv)' : 'CSV файл (.csv)'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ru' ? 'Имя файла' : 'Файл аты'}
                  </label>
                  <input
                    type="text"
                    value={exportData.fileName}
                    onChange={(e) => handleInputChange('fileName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={language === 'ru' ? 'Введите имя файла...' : 'Файл атын киргизиңиз...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ru' ? 'Email для отправки' : 'Жөнөтүү үчүн email'}
                  </label>
                  <input
                    type="email"
                    value={exportData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={language === 'ru' ? 'example@email.com' : 'example@email.com'}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-checkbox-multiple-line mr-3 text-blue-600"></i>
                {language === 'ru' ? 'Содержимое экспорта' : 'Экспорттун мазмуну'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={exportData.includeDetails}
                    onChange={(e) => handleInputChange('includeDetails', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-700">
                    {language === 'ru' 
                      ? 'Включить детальную информацию о выплатах'
                      : 'Төлөмдөр жөнүндө деталдуу маалыматты кошуу'
                    }
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={exportData.includeStatistics}
                    onChange={(e) => handleInputChange('includeStatistics', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-700">
                    {language === 'ru' 
                      ? 'Включить статистические данные'
                      : 'Статистикалык маалыматтарды кошуу'
                    }
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preview and Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-eye-line mr-3 text-green-600"></i>
                {language === 'ru' ? 'Предварительный просмотр' : 'Алдын ала көрүү'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ru' ? 'Формат:' : 'Формат:'}
                  </span>
                  <span className="font-medium">
                    {exportData.format === 'excel' ? 'Excel' : 
                     exportData.format === 'pdf' ? 'PDF' : 'CSV'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ru' ? 'Размер файла:' : 'Файл көлөмү:'}
                  </span>
                  <span className="font-medium">
                    {exportData.format === 'excel' ? '~2.5 MB' : 
                     exportData.format === 'pdf' ? '~1.8 MB' : '~0.5 MB'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ru' ? 'Количество записей:' : 'Жазмалардын саны:'}
                  </span>
                  <span className="font-medium">{registry.recipients}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ru' ? 'Общая сумма:' : 'Жалпы сумма:'}
                  </span>
                  <span className="font-medium text-green-600" suppressHydrationWarning={true}>
                    {registry.totalAmount.toLocaleString()} сом
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-download-line mr-3 text-blue-600"></i>
                {language === 'ru' ? 'Действия' : 'Аракеттер'}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleExport}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-download-line mr-2"></i>
                  {language === 'ru' ? 'Скачать файл' : 'Файлды жүктөө'}
                </button>
                
                {exportData.email && (
                  <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                    <i className="ri-mail-line mr-2"></i>
                    {language === 'ru' ? 'Отправить на email' : 'Email аркылуу жөнөтүү'}
                  </button>
                )}
                
                <Link href={`/accountant/registry/${registry.id}`}>
                  <button className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                    <i className="ri-arrow-left-line mr-2"></i>
                    {language === 'ru' ? 'Назад к реестру' : 'Реестрге кайтуу'}
                  </button>
                </Link>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <i className="ri-information-line text-blue-600 mr-3 mt-0.5"></i>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {language === 'ru' ? 'Информация об экспорте' : 'Экспорт жөнүндө маалымат'}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {language === 'ru' 
                      ? 'Экспортированный файл будет содержать полную информацию о реестре выплат, включая данные получателей, суммы выплат и статистическую информацию.'
                      : 'Экспорттолгон файл төлөмдөрдүн реестри жөнүндө толук маалыматты камтыйт, алуучулардын маалыматтарын, төлөмдөрдүн суммаларын жана статистикалык маалыматтарды камтыйт.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
