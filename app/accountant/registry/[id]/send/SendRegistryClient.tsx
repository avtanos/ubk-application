'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface SendRegistryClientProps {
  registryId: string;
}

export default function SendRegistryClient({ registryId }: SendRegistryClientProps) {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [registry, setRegistry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sendData, setSendData] = useState({
    bankName: 'Кыргызстан Национальный Банк',
    priority: 'normal',
    notes: '',
    confirmSend: false,
    confirmData: false,
    confirmAmount: false
  });
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Имитация загрузки данных
    setTimeout(() => {
      setRegistry({
        id: registryId,
        month: 'Январь 2025',
        totalAmount: 12500000,
        recipients: 1250,
        status: 'preparing',
        date: '2025-01-15',
        region: 'Нарынская область',
        payments: [
          { id: 'PAY-001', family: 'Гүлнара Осмонова', amount: 4140, children: 3, status: 'ready', date: '2025-01-20' },
          { id: 'PAY-002', family: 'Айгүл Касымова', amount: 3600, children: 2, status: 'ready', date: '2025-01-20' },
          { id: 'PAY-003', family: 'Нурбек Жумабеков', amount: 4800, children: 4, status: 'ready', date: '2025-01-20' },
          { id: 'PAY-004', family: 'Айнура Токтосунова', amount: 3000, children: 1, status: 'ready', date: '2025-01-20' },
          { id: 'PAY-005', family: 'Бакыт Калматов', amount: 5400, children: 5, status: 'ready', date: '2025-01-20' }
        ],
        verificationChecks: [
          { name: 'Проверка данных получателей', status: 'passed', details: 'Все данные проверены' },
          { name: 'Проверка банковских реквизитов', status: 'passed', details: 'Реквизиты корректны' },
          { name: 'Проверка сумм выплат', status: 'passed', details: 'Суммы рассчитаны правильно' },
          { name: 'Проверка на дубликаты', status: 'passed', details: 'Дубликатов не найдено' }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, [registryId]);

  const t = translations[language as keyof typeof translations];

  const handleInputChange = (field: string, value: any) => {
    setSendData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendRegistry = async () => {
    if (!sendData.confirmSend || !sendData.confirmData || !sendData.confirmAmount) {
      alert(language === 'ru' ? 'Пожалуйста, подтвердите все пункты' : 'Бардык пункттарды ырастаңыз');
      return;
    }

    setIsSending(true);

    // Имитация процесса отправки
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsSending(false);
    setShowSuccessModal(true);
  };

  const getCheckStatusColor = (status: string) => {
    const colors = {
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCheckStatusText = (status: string) => {
    const statusTexts = {
      ru: {
        passed: 'Пройдено',
        failed: 'Не пройдено',
        pending: 'Ожидает'
      },
      ky: {
        passed: 'Өттү',
        failed: 'Өтпөдү',
        pending: 'Күтүүдө'
      }
    };
    return statusTexts[language as keyof typeof statusTexts]?.[status as keyof typeof statusTexts.ru] || status;
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
                    {language === 'ru' ? 'Отправка реестра' : 'Реестрди жөнөтүү'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? 'Отправка реестра выплат в банк' : 'Төлөмдөрдүн реестрин банкка жөнөтүү'}
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
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {language === 'ru' ? 'Готов к отправке' : 'Жөнөтүүгө даяр'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Verification Checks */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-shield-check-line mr-3 text-green-600"></i>
                {language === 'ru' ? 'Проверки перед отправкой' : 'Жөнөтүүдөн мурун текшерүүлөр'}
              </h3>
              <div className="space-y-3">
                {registry.verificationChecks.map((check: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        check.status === 'passed' ? 'bg-green-100' : 
                        check.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        <i className={`${
                          check.status === 'passed' ? 'ri-check-line text-green-600' :
                          check.status === 'failed' ? 'ri-close-line text-red-600' :
                          'ri-time-line text-yellow-600'
                        }`}></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{check.name}</div>
                        <div className="text-sm text-gray-600">{check.details}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCheckStatusColor(check.status)}`}>
                      {getCheckStatusText(check.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-bank-line mr-3 text-blue-600"></i>
                {language === 'ru' ? 'Информация о банке' : 'Банк жөнүндө маалымат'}
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Банк получатель' : 'Алуучу банк'}
                  </div>
                  <div className="font-medium">{sendData.bankName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Способ передачи' : 'Жеткирүү ыкмасы'}
                  </div>
                  <div className="font-medium">
                    {language === 'ru' ? 'Электронная система' : 'Электрондук система'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Send Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-settings-line mr-3 text-purple-600"></i>
                {language === 'ru' ? 'Настройки отправки' : 'Жөнөтүү жөндөөлөрү'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ru' ? 'Приоритет отправки' : 'Жөнөтүү приоритети'}
                  </label>
                  <select
                    value={sendData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="normal">
                      {language === 'ru' ? 'Обычный' : 'Кадимки'}
                    </option>
                    <option value="high">
                      {language === 'ru' ? 'Высокий' : 'Жогорку'}
                    </option>
                    <option value="urgent">
                      {language === 'ru' ? 'Срочный' : 'Шашылыш'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ru' ? 'Комментарий' : 'Комментарий'}
                  </label>
                  <textarea
                    value={sendData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={language === 'ru' ? 'Дополнительные комментарии...' : 'Кошумча комментарийлер...'}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-check-double-line mr-3 text-green-600"></i>
                {language === 'ru' ? 'Подтверждения' : 'Ырастоолор'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={sendData.confirmSend}
                    onChange={(e) => handleInputChange('confirmSend', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-700">
                    {language === 'ru' 
                      ? 'Я подтверждаю отправку реестра в банк'
                      : 'Мен реестрди банкка жөнөтүүнү ырастайм'
                    }
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={sendData.confirmData}
                    onChange={(e) => handleInputChange('confirmData', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-700">
                    {language === 'ru' 
                      ? 'Я подтверждаю корректность всех данных в реестре'
                      : 'Мен реестрдеги бардык маалыматтардын туура экендигин ырастайм'
                    }
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={sendData.confirmAmount}
                    onChange={(e) => handleInputChange('confirmAmount', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-700">
                    {language === 'ru' 
                      ? 'Я подтверждаю правильность общей суммы реестра'
                      : 'Мен реестрдин жалпы суммасынын туура экендигин ырастайм'
                    }
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <i className="ri-alert-line text-yellow-600 mr-3 mt-0.5"></i>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    {language === 'ru' ? 'Важное предупреждение' : 'Маанилүү эскертүү'}
                  </h4>
                  <p className="text-sm text-yellow-700">
                    {language === 'ru' 
                      ? 'После отправки реестр будет передан в банк для обработки. Отменить операцию будет невозможно.'
                      : 'Жөнөтүлгөндөн кийин реестр иштетүү үчүн банкка берилет. Операцияны жокко чыгаруу мүмкүн болбойт.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Link href={`/accountant/registry/${registry.id}`}>
                <button className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                  <i className="ri-arrow-left-line mr-2"></i>
                  {language === 'ru' ? 'Назад' : 'Артка'}
                </button>
              </Link>
              <button
                onClick={handleSendRegistry}
                disabled={isSending || !sendData.confirmSend || !sendData.confirmData || !sendData.confirmAmount}
                className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center whitespace-nowrap cursor-pointer ${
                  isSending || !sendData.confirmSend || !sendData.confirmData || !sendData.confirmAmount
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isSending ? (
                  <>
                    <i className="ri-loader-4-line mr-2 animate-spin"></i>
                    {language === 'ru' ? 'Отправка...' : 'Жөнөтүлүүдө...'}
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-line mr-2"></i>
                    {language === 'ru' ? 'Отправить реестр' : 'Реестрди жөнөтүү'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="ri-check-line text-3xl text-green-600"></i>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'ru' ? 'Реестр отправлен!' : 'Реестр жөнөтүлдү!'}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {language === 'ru' 
                  ? 'Реестр успешно отправлен в банк для обработки. Все получатели получат уведомления о зачислении средств.'
                  : 'Реестр иштетүү үчүн банкка ийгиликтүү жөнөтүлдү. Бардык алуучулар акча түшкөн жөнүндө билдирүү алышат.'
                }
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-2">
                  {language === 'ru' ? 'Номер реестра:' : 'Реестр номери:'}
                </div>
                <div className="text-lg font-bold text-gray-900">{registry.id}</div>
                <div className="text-sm text-gray-600 mt-2">
                  {language === 'ru' ? 'Сумма:' : 'Сумма:'} <span className="font-semibold text-green-600">{registry.totalAmount.toLocaleString()} сом</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {language === 'ru' ? 'Получателей:' : 'Алуучулар:'} <span className="font-semibold">{registry.recipients}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => router.push('/accountant')}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {language === 'ru' ? 'К списку реестров' : 'Реестрлер тизмесине'}
                </button>
                <button
                  onClick={() => router.push(`/accountant/registry/${registry.id}`)}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {language === 'ru' ? 'Просмотр реестра' : 'Реестрди көрүү'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
