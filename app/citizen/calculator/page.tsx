'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import IncomeCalculator from '@/components/IncomeCalculator';
import { calculateBenefit, formatCurrency } from '@/lib/benefitCalculator';
import { regions } from '@/lib/mockData';

export default function BenefitCalculator() {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [calculation, setCalculation] = useState<any>(null);
  const [familyMembers, setFamilyMembers] = useState([
    { name: 'Заявитель', age: 30, relation: 'parent', income: 0 }
  ]);
  const [region, setRegion] = useState('bishkek');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const t = translations[language as keyof typeof translations];

  const handleBenefitCalculation = (result: any) => {
    setCalculation(result);
  };

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: '', age: 0, relation: '', income: 0 }]);
  };

  const removeFamilyMember = (index: number) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    }
  };

  const handleFamilyMemberChange = (index: number, field: string, value: any) => {
    const updatedMembers = [...familyMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };
    setFamilyMembers(updatedMembers);
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
              <Link href="/citizen" className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <i className="ri-government-line text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Калькулятор пособия' : 'Жөлөкпул эсептөөчү'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? 'Расчет пособия с учетом ЛПХ' : 'ЖЧни эске алуу менен жөлөкпулду эсептөө'}
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Левая панель - Состав семьи */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ru' ? 'Состав семьи' : 'Үй-бүлөлүк курам'}
              </h3>
              
              <div className="space-y-4">
                {familyMembers.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        {language === 'ru' ? `Член семьи ${index + 1}` : `Үй-бүлө мүчөсү ${index + 1}`}
                      </h4>
                      {familyMembers.length > 1 && (
                        <button
                          onClick={() => removeFamilyMember(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ru' ? 'Имя' : 'Аты'}
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          placeholder={language === 'ru' ? 'Введите имя' : 'Атын киргизиңиз'}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ru' ? 'Возраст' : 'Жашы'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="120"
                          value={member.age}
                          onChange={(e) => handleFamilyMemberChange(index, 'age', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ru' ? 'Отношение' : 'Карым-катыш'}
                        </label>
                        <select
                          value={member.relation}
                          onChange={(e) => handleFamilyMemberChange(index, 'relation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">{language === 'ru' ? 'Выберите' : 'Тандаңыз'}</option>
                          <option value="parent">{language === 'ru' ? 'Родитель' : 'Ата-эне'}</option>
                          <option value="child">{language === 'ru' ? 'Ребенок' : 'Бала'}</option>
                          <option value="grandparent">{language === 'ru' ? 'Бабушка/Дедушка' : 'Чоң ата/Чоң эне'}</option>
                          <option value="sibling">{language === 'ru' ? 'Брат/Сестра' : 'Бир тууган'}</option>
                          <option value="other">{language === 'ru' ? 'Другое' : 'Башка'}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addFamilyMember}
                  className="w-full text-red-600 hover:text-red-800 text-sm py-2 border border-dashed border-red-300 rounded-lg hover:border-red-400"
                >
                  <i className="ri-add-line mr-1"></i>
                  {language === 'ru' ? 'Добавить члена семьи' : 'Үй-бүлө мүчөсүн кошуу'}
                </button>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ru' ? 'Регион проживания' : 'Турак жай аймагы'}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Правая панель - Калькулятор доходов */}
          <div className="lg:col-span-2">
            <IncomeCalculator 
              language={language} 
              onBenefitCalculation={handleBenefitCalculation}
            />
            
            {/* Результаты расчета */}
            {calculation && (
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ru' ? 'Результат расчета пособия' : 'Жөлөкпулду эсептөөнүн жыйынтыгы'}
                </h3>
                
                {calculation.eligible ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <i className="ri-check-line text-green-600 mr-2"></i>
                        <span className="text-green-800 font-medium">
                          {language === 'ru' ? 'Семья имеет право на пособие!' : 'Үй-бүлөнүн жөлөкпулга укугу бар!'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            {language === 'ru' ? 'Доход на человека:' : 'Адамга киреше:'}
                          </span>
                          <span className="font-semibold">{formatCurrency(calculation.perCapitaIncome)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            {language === 'ru' ? 'Детей до 16 лет:' : '16га чейинки балдар:'}
                          </span>
                          <span className="font-semibold">{calculation.childrenUnder16}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            {language === 'ru' ? 'Базовая сумма:' : 'Негизги сумма:'}
                          </span>
                          <span className="font-semibold">{formatCurrency(calculation.baseBenefit)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            {language === 'ru' ? 'Районный коэффициент:' : 'Аймактык коэффициент:'}
                          </span>
                          <span className="font-semibold">{calculation.regionalCoefficient}x</span>
                        </div>
                        
                        {calculation.borderBonus > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">
                              {language === 'ru' ? 'Приграничная надбавка:' : 'Чек ара кошумча:'}
                            </span>
                            <span className="font-semibold">{formatCurrency(calculation.borderBonus)}</span>
                          </div>
                        )}
                        
                        <div className="border-t pt-2">
                          <div className="flex justify-between">
                            <span className="text-lg font-semibold text-gray-900">
                              {language === 'ru' ? 'Итого пособие:' : 'Жалпы жөлөкпул:'}
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                              {formatCurrency(calculation.totalMonthlyBenefit)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Детализация ЛПХ */}
                    {(calculation.landIncome > 0 || calculation.livestockIncome > 0) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-3">
                          {language === 'ru' ? 'Учет личного подсобного хозяйства:' : 'Жеке жардамчы чарбанын эсеби:'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          {calculation.landIncome > 0 && (
                            <div className="flex justify-between">
                              <span className="text-blue-700">
                                {language === 'ru' ? 'Доход от земли:' : 'Жерден киреше:'}
                              </span>
                              <span className="font-medium">{formatCurrency(calculation.landIncome)}</span>
                            </div>
                          )}
                          {calculation.livestockIncome > 0 && (
                            <div className="flex justify-between">
                              <span className="text-blue-700">
                                {language === 'ru' ? 'Доход от скота:' : 'Малдан киреше:'}
                              </span>
                              <span className="font-medium">{formatCurrency(calculation.livestockIncome)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-blue-700">
                              {language === 'ru' ? 'МРС на человека:' : 'Адамга МРС:'}
                            </span>
                            <span className="font-medium">{calculation.livestockPerPerson.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <i className="ri-close-line text-red-600 mr-2"></i>
                      <span className="text-red-800 font-medium">
                        {language === 'ru' ? 'Семья не имеет права на пособие' : 'Үй-бүлөнүн жөлөкпулга укугу жок'}
                      </span>
                    </div>
                    <p className="text-red-700 text-sm">
                      {calculation.reason}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
