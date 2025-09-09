'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface ConfirmPaymentClientProps {
  paymentId: string;
}

export default function ConfirmPaymentClient({ paymentId }: ConfirmPaymentClientProps) {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    bankAccount: '',
    paymentMethod: 'bank_transfer',
    notes: '',
    confirmData: false,
    confirmAmount: false,
    confirmBank: false
  });
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Имитация загрузки данных
    setTimeout(() => {
      setPayment({
        id: paymentId,
        family: 'Гүлнара Осмонова',
        amount: 4140,
        date: '2025-01-20',
        status: 'processing',
        region: 'Нарын',
        children: 3,
        familyMembers: [
          { name: 'Гүлнара Осмонова', age: 28, relation: 'mother', income: 12000 },
          { name: 'Айжан Осмонова', age: 8, relation: 'child', income: 0 },
          { name: 'Нурлан Осмонов', age: 12, relation: 'child', income: 0 },
          { name: 'Айнура Осмонова', age: 14, relation: 'child', income: 0 }
        ],
        bankDetails: {
          bank: 'Кыргызстан Национальный Банк',
          account: '1234567890123456',
          cardNumber: '**** **** **** 1234'
        },
        calculation: {
          baseAmount: 3600,
          regionalCoefficient: 1.15,
          totalAmount: 4140,
          perCapitaIncome: 3000
        },
        verificationChecks: [
          { name: 'Проверка документов', status: 'passed', details: 'Все документы проверены' },
          { name: 'Проверка доходов', status: 'passed', details: 'Доходы соответствуют заявленным' },
          { name: 'Проверка банковских реквизитов', status: 'passed', details: 'Реквизиты корректны' },
          { name: 'Проверка на дубликаты', status: 'passed', details: 'Дубликатов не найдено' }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, [paymentId]);


  const handleInputChange = (field: string, value: any) => {
    setConfirmationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirmPayment = async () => {
    if (!confirmationData.confirmData || !confirmationData.confirmAmount || !confirmationData.confirmBank) {
      alert(language === 'ru' ? 'Пожалуйста, подтвердите все пункты' : 'Бардык пункттарды ырастаңыз');
      return;
    }

    setIsConfirming(true);

    // Имитация процесса подтверждения
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsConfirming(false);
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
                    {language === 'ru' ? 'Подтверждение выплаты' : 'Төлөмдү ырастоо'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? 'Финальная проверка и подтверждение' : 'Акыркы текшерүү жана ырастоо'}
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
        {/* Payment Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'ru' ? 'Выплата' : 'Төлөм'} {payment.id}
              </h2>
              <p className="text-gray-600">
                {language === 'ru' ? 'Семья' : 'Үй-бүлө'}: {payment.family}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 mb-2" suppressHydrationWarning={true}>
                {payment.amount.toLocaleString()} сом
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {language === 'ru' ? 'Ожидает подтверждения' : 'Ырастоо күтүүдө'}
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
                {language === 'ru' ? 'Проверки безопасности' : 'Коопсуздук текшерүүлөрү'}
              </h3>
              <div className="space-y-3">
                {payment.verificationChecks.map((check: any, index: number) => (
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
                {language === 'ru' ? 'Банковские реквизиты' : 'Банк реквизиттери'}
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Банк' : 'Банк'}
                  </div>
                  <div className="font-medium">{payment.bankDetails.bank}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Номер счета' : 'Эсептин номери'}
                  </div>
                  <div className="font-medium font-mono">{payment.bankDetails.account}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Номер карты' : 'Картанын номери'}
                  </div>
                  <div className="font-medium font-mono">{payment.bankDetails.cardNumber}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="ri-settings-line mr-3 text-purple-600"></i>
                {language === 'ru' ? 'Настройки выплаты' : 'Төлөм жөндөөлөрү'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ru' ? 'Способ выплаты' : 'Төлөм ыкмасы'}
                  </label>
                  <select
                    value={confirmationData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="bank_transfer">
                      {language === 'ru' ? 'Банковский перевод' : 'Банк которуму'}
                    </option>
                    <option value="post_office">
                      {language === 'ru' ? 'Почта Кыргызстана' : 'Кыргыз почтасы'}
                    </option>
                    <option value="mobile_money">
                      {language === 'ru' ? 'Мобильные деньги' : 'Мобилдик акча'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ru' ? 'Комментарий' : 'Комментарий'}
                  </label>
                  <textarea
                    value={confirmationData.notes}
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
                    checked={confirmationData.confirmData}
                    onChange={(e) => handleInputChange('confirmData', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-700">
                    {language === 'ru' 
                      ? 'Я подтверждаю, что все данные семьи проверены и корректны'
                      : 'Мен үй-бүлөнүн бардык маалыматтары текшерилген жана туура экендигин ырастайм'
                    }
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={confirmationData.confirmAmount}
                    onChange={(e) => handleInputChange('confirmAmount', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-700">
                    {language === 'ru' 
                      ? 'Я подтверждаю правильность расчета суммы пособия'
                      : 'Мен жөлөкпулдун суммасынын эсептөөсүнүн туура экендигин ырастайм'
                    }
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={confirmationData.confirmBank}
                    onChange={(e) => handleInputChange('confirmBank', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-700">
                    {language === 'ru' 
                      ? 'Я подтверждаю корректность банковских реквизитов'
                      : 'Мен банк реквизиттеринин туура экендигин ырастайм'
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
                      ? 'После подтверждения выплата будет отправлена в банк для обработки. Отменить операцию будет невозможно.'
                      : 'Ырастоодон кийин төлөм иштетүү үчүн банкка жөнөтүлөт. Операцияны жокко чыгаруу мүмкүн болбойт.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Link href={`/accountant/payment/${payment.id}`}>
                <button className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                  <i className="ri-arrow-left-line mr-2"></i>
                  {language === 'ru' ? 'Назад' : 'Артка'}
                </button>
              </Link>
              <button
                onClick={handleConfirmPayment}
                disabled={isConfirming || !confirmationData.confirmData || !confirmationData.confirmAmount || !confirmationData.confirmBank}
                className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center whitespace-nowrap cursor-pointer ${
                  isConfirming || !confirmationData.confirmData || !confirmationData.confirmAmount || !confirmationData.confirmBank
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isConfirming ? (
                  <>
                    <i className="ri-loader-4-line mr-2 animate-spin"></i>
                    {language === 'ru' ? 'Подтверждение...' : 'Ырастоо...'}
                  </>
                ) : (
                  <>
                    <i className="ri-check-line mr-2"></i>
                    {language === 'ru' ? 'Подтвердить выплату' : 'Төлөмдү ырастоо'}
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
                {language === 'ru' ? 'Выплата подтверждена!' : 'Төлөм ырасталды!'}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {language === 'ru' 
                  ? 'Выплата успешно отправлена в банк для обработки. Получатель получит уведомление о зачислении средств.'
                  : 'Төлөм иштетүү үчүн банкка ийгиликтүү жөнөтүлдү. Алуучу акча түшкөн жөнүндө билдирүү алат.'
                }
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-2">
                  {language === 'ru' ? 'Номер выплаты:' : 'Төлөм номери:'}
                </div>
                <div className="text-lg font-bold text-gray-900">{payment.id}</div>
                <div className="text-sm text-gray-600 mt-2">
                  {language === 'ru' ? 'Сумма:' : 'Сумма:'} <span className="font-semibold text-green-600">{payment.amount.toLocaleString()} сом</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => router.push('/accountant')}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {language === 'ru' ? 'К списку выплат' : 'Төлөмдөр тизмесине'}
                </button>
                <button
                  onClick={() => router.push(`/accountant/payment/${payment.id}`)}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {language === 'ru' ? 'Просмотр деталей' : 'Чоо-жайын көрүү'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
