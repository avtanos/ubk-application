'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function AdvancedSettings() {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('system');
  const [settings, setSettings] = useState({
    // Системные настройки
    system: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      maxFileSize: 10,
      enableAuditLog: true,
      sessionTimeout: 30
    },
    // Настройки интеграции
    integration: {
      enableTunduk: true,
      tundukEndpoint: 'https://tunduk.gov.kg/api',
      enableBankIntegration: true,
      bankApiUrl: 'https://bank.gov.kg/api',
      enableSmsGateway: false,
      smsProvider: 'ksoft'
    },
    // Настройки безопасности
    security: {
      requireStrongPassword: true,
      passwordExpiryDays: 90,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      enableIpWhitelist: false,
      allowedIps: '',
      enableEncryption: true,
      encryptionLevel: 'aes-256'
    },
    // Настройки уведомлений
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      notificationFrequency: 'realtime',
      enableDigest: false,
      digestSchedule: 'daily'
    },
    // Настройки производительности
    performance: {
      enableCaching: true,
      cacheTimeout: 300,
      enableCompression: true,
      maxConcurrentUsers: 100,
      enableLoadBalancing: false,
      enableCdn: false
    }
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const tabs = [
    { id: 'system', name: language === 'ru' ? 'Система' : 'Система', icon: 'ri-computer-line' },
    { id: 'integration', name: language === 'ru' ? 'Интеграция' : 'Интеграция', icon: 'ri-link' },
    { id: 'security', name: language === 'ru' ? 'Безопасность' : 'Коопсуздук', icon: 'ri-shield-keyhole-line' },
    { id: 'notifications', name: language === 'ru' ? 'Уведомления' : 'Билдирүүлөр', icon: 'ri-notification-line' },
    { id: 'performance', name: language === 'ru' ? 'Производительность' : 'Өндүрүмдүүлүк', icon: 'ri-speed-line' }
  ];

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Имитация сохранения настроек
    alert(language === 'ru' ? 'Расширенные настройки сохранены!' : 'Кеңейтилген жөндөөлөр сакталды!');
  };

  const handleResetSettings = () => {
    if (confirm(language === 'ru' ? 'Вы уверены, что хотите сбросить все настройки?' : 'Бардык жөндөөлөрдү баштапкы абалга келтиргиңиз келет?')) {
      // Сброс настроек к значениям по умолчанию
      setSettings({
        system: {
          autoBackup: true,
          backupFrequency: 'daily',
          retentionPeriod: 30,
          maxFileSize: 10,
          enableAuditLog: true,
          sessionTimeout: 30
        },
        integration: {
          enableTunduk: true,
          tundukEndpoint: 'https://tunduk.gov.kg/api',
          enableBankIntegration: true,
          bankApiUrl: 'https://bank.gov.kg/api',
          enableSmsGateway: false,
          smsProvider: 'ksoft'
        },
        security: {
          requireStrongPassword: true,
          passwordExpiryDays: 90,
          maxLoginAttempts: 5,
          lockoutDuration: 30,
          enableIpWhitelist: false,
          allowedIps: '',
          enableEncryption: true,
          encryptionLevel: 'aes-256'
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          notificationFrequency: 'realtime',
          enableDigest: false,
          digestSchedule: 'daily'
        },
        performance: {
          enableCaching: true,
          cacheTimeout: 300,
          enableCompression: true,
          maxConcurrentUsers: 100,
          enableLoadBalancing: false,
          enableCdn: false
        }
      });
    }
  };

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
              <Link href="/accountant" className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <i className="ri-government-line text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Расширенная настройка' : 'Кеңейтилген жөндөө'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? 'Детальная конфигурация системы' : 'Системанын деталдуу конфигурациясы'}
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
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-1 py-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ru' ? 'Системные настройки' : 'Системалык жөндөөлөр'}
                </h3>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'Автоматическое резервное копирование' : 'Автоматтык резервдик көчүрмө'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Создавать резервные копии данных автоматически' : 'Маалыматтардын резервдик көчүрмөсүн автоматтык түрдө түзүү'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.system.autoBackup}
                        onChange={(e) => handleSettingChange('system', 'autoBackup', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Частота резервного копирования' : 'Резервдик көчүрмөнүн жыштыгы'}
                      </label>
                      <select
                        value={settings.system.backupFrequency}
                        onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="hourly">{language === 'ru' ? 'Ежечасно' : 'Саат сайын'}</option>
                        <option value="daily">{language === 'ru' ? 'Ежедневно' : 'Күн сайын'}</option>
                        <option value="weekly">{language === 'ru' ? 'Еженедельно' : 'Апта сайын'}</option>
                        <option value="monthly">{language === 'ru' ? 'Ежемесячно' : 'Ай сайын'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Период хранения (дни)' : 'Сактоо мөөнөтү (күндөр)'}
                      </label>
                      <input
                        type="number"
                        value={settings.system.retentionPeriod}
                        onChange={(e) => handleSettingChange('system', 'retentionPeriod', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="1"
                        max="365"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Максимальный размер файла (МБ)' : 'Файлдын максималдуу көлөмү (МБ)'}
                      </label>
                      <input
                        type="number"
                        value={settings.system.maxFileSize}
                        onChange={(e) => handleSettingChange('system', 'maxFileSize', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="1"
                        max="100"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'Включить журнал аудита' : 'Аудит журналын иштетүү'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Записывать все действия пользователей' : 'Бардык колдонуучулардын аракеттерин жазуу'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.system.enableAuditLog}
                        onChange={(e) => handleSettingChange('system', 'enableAuditLog', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Таймаут сессии (минуты)' : 'Сессиянын таймауту (минута)'}
                      </label>
                      <input
                        type="number"
                        value={settings.system.sessionTimeout}
                        onChange={(e) => handleSettingChange('system', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="5"
                        max="480"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integration Settings */}
            {activeTab === 'integration' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ru' ? 'Настройки интеграции' : 'Интеграция жөндөөлөрү'}
                </h3>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'Интеграция с Түндүк' : 'Түндүк менен интеграция'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Подключение к государственному шлюзу' : 'Мамлекеттик шлюзга туташуу'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.integration.enableTunduk}
                        onChange={(e) => handleSettingChange('integration', 'enableTunduk', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'URL Түндүк API' : 'Түндүк API URL'}
                      </label>
                      <input
                        type="url"
                        value={settings.integration.tundukEndpoint}
                        onChange={(e) => handleSettingChange('integration', 'tundukEndpoint', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="https://tunduk.gov.kg/api"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'Интеграция с банком' : 'Банк менен интеграция'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Автоматическая отправка реестров' : 'Реестрлерди автоматтык жөнөтүү'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.integration.enableBankIntegration}
                        onChange={(e) => handleSettingChange('integration', 'enableBankIntegration', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'URL банковского API' : 'Банк API URL'}
                      </label>
                      <input
                        type="url"
                        value={settings.integration.bankApiUrl}
                        onChange={(e) => handleSettingChange('integration', 'bankApiUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="https://bank.gov.kg/api"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'SMS шлюз' : 'SMS шлюз'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Отправка SMS уведомлений' : 'SMS билдирүүлөрдү жөнөтүү'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.integration.enableSmsGateway}
                        onChange={(e) => handleSettingChange('integration', 'enableSmsGateway', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'SMS провайдер' : 'SMS провайдер'}
                      </label>
                      <select
                        value={settings.integration.smsProvider}
                        onChange={(e) => handleSettingChange('integration', 'smsProvider', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="ksoft">KSoft</option>
                        <option value="megacom">MegaCom</option>
                        <option value="beeline">Beeline</option>
                        <option value="o">O!</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ru' ? 'Настройки безопасности' : 'Коопсуздук жөндөөлөрү'}
                </h3>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'Сложные пароли' : 'Кыйын сыр сөздөр'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Требовать сложные пароли' : 'Кыйын сыр сөздөрдү талап кылуу'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.security.requireStrongPassword}
                        onChange={(e) => handleSettingChange('security', 'requireStrongPassword', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Срок действия пароля (дни)' : 'Сыр сөздүн жарактуулук мөөнөтү (күндөр)'}
                      </label>
                      <input
                        type="number"
                        value={settings.security.passwordExpiryDays}
                        onChange={(e) => handleSettingChange('security', 'passwordExpiryDays', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="30"
                        max="365"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Максимум попыток входа' : 'Кирүү аракеттеринин максимуму'}
                      </label>
                      <input
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="3"
                        max="10"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Время блокировки (минуты)' : 'Блоктоо убактысы (минута)'}
                      </label>
                      <input
                        type="number"
                        value={settings.security.lockoutDuration}
                        onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="5"
                        max="1440"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'Белый список IP' : 'IP ак тизмеси'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Ограничить доступ по IP адресам' : 'IP даректер боюнча кирүүнү чектөө'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.security.enableIpWhitelist}
                        onChange={(e) => handleSettingChange('security', 'enableIpWhitelist', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Разрешенные IP адреса' : 'Рухсат берилген IP даректер'}
                      </label>
                      <textarea
                        value={settings.security.allowedIps}
                        onChange={(e) => handleSettingChange('security', 'allowedIps', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                        placeholder="192.168.1.1, 10.0.0.1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ru' ? 'Настройки уведомлений' : 'Билдирүүлөрдүн жөндөөлөрү'}
                </h3>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'Email уведомления' : 'Email билдирүүлөр'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Отправлять уведомления по email' : 'Email аркылуу билдирүүлөрдү жөнөтүү'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'SMS уведомления' : 'SMS билдирүүлөр'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Отправлять SMS уведомления' : 'SMS билдирүүлөрдү жөнөтүү'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'Push уведомления' : 'Push билдирүүлөр'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Внутренние уведомления в системе' : 'Системадагы ички билдирүүлөр'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Частота уведомлений' : 'Билдирүүлөрдүн жыштыгы'}
                      </label>
                      <select
                        value={settings.notifications.notificationFrequency}
                        onChange={(e) => handleSettingChange('notifications', 'notificationFrequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="realtime">{language === 'ru' ? 'В реальном времени' : 'Чыныгы убакытта'}</option>
                        <option value="hourly">{language === 'ru' ? 'Ежечасно' : 'Саат сайын'}</option>
                        <option value="daily">{language === 'ru' ? 'Ежедневно' : 'Күн сайын'}</option>
                        <option value="weekly">{language === 'ru' ? 'Еженедельно' : 'Апта сайын'}</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'Дайджест уведомлений' : 'Билдирүүлөрдүн дайджести'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Группировать уведомления' : 'Билдирүүлөрдү топтоо'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.enableDigest}
                        onChange={(e) => handleSettingChange('notifications', 'enableDigest', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Расписание дайджеста' : 'Дайджесттин жосмолу'}
                      </label>
                      <select
                        value={settings.notifications.digestSchedule}
                        onChange={(e) => handleSettingChange('notifications', 'digestSchedule', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="daily">{language === 'ru' ? 'Ежедневно' : 'Күн сайын'}</option>
                        <option value="weekly">{language === 'ru' ? 'Еженедельно' : 'Апта сайын'}</option>
                        <option value="monthly">{language === 'ru' ? 'Ежемесячно' : 'Ай сайын'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Settings */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ru' ? 'Настройки производительности' : 'Өндүрүмдүүлүктүн жөндөөлөрү'}
                </h3>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'Кэширование' : 'Кэшдөө'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Включить кэширование данных' : 'Маалыматтарды кэшдөөнү иштетүү'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.performance.enableCaching}
                        onChange={(e) => handleSettingChange('performance', 'enableCaching', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Время жизни кэша (секунды)' : 'Кэштин жашоо убактысы (секунд)'}
                      </label>
                      <input
                        type="number"
                        value={settings.performance.cacheTimeout}
                        onChange={(e) => handleSettingChange('performance', 'cacheTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="60"
                        max="3600"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'Сжатие данных' : 'Маалыматтарды кысуу'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Сжимать передаваемые данные' : 'Жөнөтүлгөн маалыматтарды кысуу'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.performance.enableCompression}
                        onChange={(e) => handleSettingChange('performance', 'enableCompression', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Максимум одновременных пользователей' : 'Бир убактагы максималдуу колдонуучулар'}
                      </label>
                      <input
                        type="number"
                        value={settings.performance.maxConcurrentUsers}
                        onChange={(e) => handleSettingChange('performance', 'maxConcurrentUsers', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="10"
                        max="1000"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'Балансировка нагрузки' : 'Жүктү баланстоо'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Распределять нагрузку между серверами' : 'Жүктү серверлер арасында бөлүштүрүү'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.performance.enableLoadBalancing}
                        onChange={(e) => handleSettingChange('performance', 'enableLoadBalancing', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === 'ru' ? 'CDN' : 'CDN'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'ru' ? 'Использовать CDN для статических файлов' : 'Статикалык файлдар үчүн CDN колдонуу'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.performance.enableCdn}
                        onChange={(e) => handleSettingChange('performance', 'enableCdn', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handleResetSettings}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-refresh-line mr-2"></i>
                {language === 'ru' ? 'Сбросить настройки' : 'Жөндөөлөрдү баштапкы абалга келтирүү'}
              </button>
              <div className="flex space-x-3">
                <Link href="/accountant">
                  <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 whitespace-nowrap cursor-pointer">
                    {language === 'ru' ? 'Отмена' : 'Жокко чыгаруу'}
                  </button>
                </Link>
                <button
                  onClick={handleSaveSettings}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-save-line mr-2"></i>
                  {language === 'ru' ? 'Сохранить настройки' : 'Жөндөөлөрдү сактоо'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
