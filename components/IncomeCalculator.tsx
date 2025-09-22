'use client';

import { useState } from 'react';
import { incomeCategories } from '@/lib/mockData';
import { calculateIncomeBreakdown, calculateBenefit, validateFamilyComposition } from '@/lib/benefitCalculator';
import type { LandPlot, Livestock, HouseholdAssets } from '@/lib/benefitCalculator';
import CalculationRulesModal from './ui/CalculationRulesModal';

interface IncomeCalculatorProps {
  language: string;
  onIncomeChange?: (totalIncome: number, breakdown: any) => void;
  onBenefitCalculation?: (calculation: any) => void;
}

export default function IncomeCalculator({ language, onIncomeChange, onBenefitCalculation }: IncomeCalculatorProps) {
  const [incomes, setIncomes] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState('primary');
  const [showRulesModal, setShowRulesModal] = useState(false);
  
  // Новые состояния для ЛПХ
  const [landPlots, setLandPlots] = useState<LandPlot[]>([
    { type: 'irrigated', area: 0 }
  ]);
  const [livestock, setLivestock] = useState<Livestock>({
    cows: 0,
    heifers: 0,
    bulls: 0,
    horses: 0,
    sheep: 0,
    goats: 0,
    pigs: 0,
    poultry: 0,
    other: 0
  });
  const [assets, setAssets] = useState<HouseholdAssets>({
    hasCar: false,
    hasTractor: false,
    hasTruck: false,
    carAge: undefined
  });
  
  // Состояние для семьи (для расчета пособия)
  const [familyMembers, setFamilyMembers] = useState([
    { name: 'Заявитель', age: 30, relation: 'parent', income: 0 }
  ]);
  const [region, setRegion] = useState('bishkek');

  const categories = [
    { id: 'primary', name: language === 'ru' ? 'Основные доходы' : 'Негизги кирешелер', color: 'blue' },
    { id: 'property', name: language === 'ru' ? 'Доходы от собственности' : 'Мүлкүдөн кирешелер', color: 'green' },
    { id: 'agriculture', name: language === 'ru' ? 'Сельское хозяйство' : 'Айыл чарбасы', color: 'yellow' },
    { id: 'business', name: language === 'ru' ? 'Предпринимательство' : 'Ишкердик', color: 'purple' },
    { id: 'employment', name: language === 'ru' ? 'Трудоустройство' : 'Жумуш орду', color: 'orange' },
    { id: 'foreign', name: language === 'ru' ? 'Внешние доходы' : 'Тышкы кирешелер', color: 'teal' },
    { id: 'compensation', name: language === 'ru' ? 'Компенсации' : 'Компенсациялар', color: 'indigo' },
    { id: 'land', name: language === 'ru' ? 'Земельные доходы' : 'Жер кирешелери', color: 'red' },
    { id: 'social', name: language === 'ru' ? 'Социальные выплаты' : 'Социалдык төлөмдөр', color: 'pink' },
    { id: 'financial', name: language === 'ru' ? 'Финансовые инструменты' : 'Финансылык куралдар', color: 'gray' },
    { id: 'household', name: language === 'ru' ? 'ЛПХ детально' : 'ЖЧ деталдуу', color: 'brown' }
  ];

  const handleIncomeChange = (incomeId: string, value: number) => {
    const newIncomes = { ...incomes, [incomeId]: value };
    setIncomes(newIncomes);
    
    const breakdown = calculateIncomeBreakdown(newIncomes);
    if (onIncomeChange) {
      onIncomeChange(breakdown.total, breakdown);
    }
    
    // Пересчитываем пособие
    calculateBenefitAmount(newIncomes);
  };

  const handleLandPlotChange = (index: number, field: keyof LandPlot, value: any) => {
    const newLandPlots = [...landPlots];
    newLandPlots[index] = { ...newLandPlots[index], [field]: value };
    setLandPlots(newLandPlots);
    calculateBenefitAmount();
  };

  const addLandPlot = () => {
    setLandPlots([...landPlots, { type: 'irrigated', area: 0 }]);
  };

  const removeLandPlot = (index: number) => {
    if (landPlots.length > 1) {
      setLandPlots(landPlots.filter((_, i) => i !== index));
    }
  };

  const handleLivestockChange = (type: keyof Livestock, value: number) => {
    setLivestock(prev => ({ ...prev, [type]: value }));
    calculateBenefitAmount();
  };

  const handleAssetChange = (field: keyof HouseholdAssets, value: any) => {
    setAssets(prev => ({ ...prev, [field]: value }));
    calculateBenefitAmount();
  };

  const calculateBenefitAmount = (customIncomes?: Record<string, number>) => {
    const incomesToUse = customIncomes || incomes;
    const totalIncome = Object.values(incomesToUse).reduce((sum, income) => sum + income, 0);
    
    try {
      const result = calculateBenefit(
        familyMembers,
        region,
        totalIncome,
        landPlots,
        livestock,
        assets
      );
      
      if (onBenefitCalculation) {
        onBenefitCalculation(result);
      }
    } catch (error) {
      console.error('Error calculating benefit:', error);
    }
  };

  const getCategoryIncomes = (categoryId: string) => {
    return incomeCategories.filter(income => income.category === categoryId);
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-900',
      teal: 'bg-teal-50 border-teal-200 text-teal-900',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      red: 'bg-red-50 border-red-200 text-red-900',
      pink: 'bg-pink-50 border-pink-200 text-pink-900',
      gray: 'bg-gray-50 border-gray-200 text-gray-900',
      brown: 'bg-amber-50 border-amber-200 text-amber-900'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const totalIncome = Object.values(incomes).reduce((sum, value) => sum + value, 0);
  const breakdown = calculateIncomeBreakdown(incomes);

  // Расчет доходов от ЛПХ
  const landIncome = landPlots.reduce((total, plot) => {
    const norms = { irrigated: 20, rain_fed: 10, household: 30 };
    return total + (norms[plot.type] * plot.area);
  }, 0);

  const livestockMRS = Object.entries(livestock).reduce((total, [type, count]) => {
    const coefficients = { 
      cows: 6, heifers: 2.5, bulls: 8, horses: 7, 
      sheep: 1, goats: 1, pigs: 2, poultry: 0.1, other: 1 
    };
    return total + (count * (coefficients[type as keyof typeof coefficients] || 0));
  }, 0);

  const livestockIncome = livestockMRS * 500; // 500 сом на МРС в месяц
  const totalHouseholdIncome = landIncome + livestockIncome;

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <i className="ri-calculator-line mr-3 text-blue-600"></i>
              {language === 'ru' ? 'Калькулятор доходов' : 'Кирешелерди эсептегич'}
            </h3>
            <p className="text-gray-600 mt-2">
              {language === 'ru' 
                ? 'Детальный расчет доходов по 10 категориям с учетом ЛПХ для определения права на пособие'
                : 'Жөлөкпулга укукту аныктоо үчүн 10 категория боюнча ЛПХни эске алуу менен кирешелерди деталдуу эсептөө'}
            </p>
          </div>
          <button
            onClick={() => setShowRulesModal(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <i className="ri-information-line mr-2"></i>
            {language === 'ru' ? 'Правила расчета' : 'Эсептөө эрежелери'}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Category Tabs */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4">
              {language === 'ru' ? 'Категории доходов' : 'Кирешелердин категориялары'}
            </h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? getCategoryColor(category.color)
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs text-gray-500">
                    {category.id === 'household' 
                      ? (language === 'ru' ? 'ЛПХ детально' : 'ЖЧ деталдуу')
                      : `${getCategoryIncomes(category.id).length} ${language === 'ru' ? 'типов' : 'түр'}`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Income Inputs */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              {categories.find(c => c.id === activeCategory)?.name}
            </h4>
            
            {activeCategory === 'household' ? (
              // Детальный учет ЛПХ
              <div className="space-y-6">
                {/* Земельные участки */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">
                    {language === 'ru' ? 'Земельные участки' : 'Жер учактары'}
                  </h5>
                  <div className="space-y-3">
                    {landPlots.map((plot, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <select
                          value={plot.type}
                          onChange={(e) => handleLandPlotChange(index, 'type', e.target.value as any)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="irrigated">{language === 'ru' ? 'Орошаемый' : 'Сугарылган'}</option>
                          <option value="rain_fed">{language === 'ru' ? 'Богарный' : 'Богардык'}</option>
                          <option value="household">{language === 'ru' ? 'Приусадебный' : 'Үй тиричилиги'}</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          value={plot.area}
                          onChange={(e) => handleLandPlotChange(index, 'area', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-24"
                        />
                        <span className="text-sm text-gray-600">
                          {language === 'ru' ? 'соток' : 'соток'}
                        </span>
                        {landPlots.length > 1 && (
                          <button
                            onClick={() => removeLandPlot(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addLandPlot}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <i className="ri-add-line mr-1"></i>
                      {language === 'ru' ? 'Добавить участок' : 'Учакта кошуу'}
                    </button>
                  </div>
                </div>

                {/* Скот */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">
                    {language === 'ru' ? 'Скот' : 'Мал'}
                  </h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'ru' ? 'Коровы' : 'Уйлар'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={livestock.cows}
                        onChange={(e) => handleLivestockChange('cows', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'ru' ? 'Телки' : 'Телкелер'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={livestock.heifers}
                        onChange={(e) => handleLivestockChange('heifers', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'ru' ? 'Быки' : 'Букалар'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={livestock.bulls}
                        onChange={(e) => handleLivestockChange('bulls', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'ru' ? 'Лошади' : 'Аттар'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={livestock.horses}
                        onChange={(e) => handleLivestockChange('horses', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'ru' ? 'Овцы' : 'Койлор'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={livestock.sheep}
                        onChange={(e) => handleLivestockChange('sheep', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'ru' ? 'Козы' : 'Эчкилер'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={livestock.goats}
                        onChange={(e) => handleLivestockChange('goats', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'ru' ? 'Свиньи' : 'Чочколор'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={livestock.pigs}
                        onChange={(e) => handleLivestockChange('pigs', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'ru' ? 'Птица' : 'Чымчыктар'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={livestock.poultry}
                        onChange={(e) => handleLivestockChange('poultry', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Активы семьи */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">
                    {language === 'ru' ? 'Активы семьи' : 'Үй-бүлөнүн активдери'}
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={assets.hasCar}
                        onChange={(e) => handleAssetChange('hasCar', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        {language === 'ru' ? 'Есть автомобиль' : 'Автомобиль бар'}
                      </label>
                      {assets.hasCar && (
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={assets.carAge || ''}
                          onChange={(e) => handleAssetChange('carAge', parseInt(e.target.value) || undefined)}
                          placeholder="0"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-20"
                        />
                      )}
                      {assets.hasCar && (
                        <span className="text-sm text-gray-600">
                          {language === 'ru' ? 'лет' : 'жаш'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={assets.hasTractor}
                        onChange={(e) => handleAssetChange('hasTractor', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        {language === 'ru' ? 'Есть трактор' : 'Трактор бар'}
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={assets.hasTruck}
                        onChange={(e) => handleAssetChange('hasTruck', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        {language === 'ru' ? 'Есть грузовик' : 'Жүк ташуучу машина бар'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Сводка по ЛПХ */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h6 className="font-medium text-gray-900 mb-3">
                    {language === 'ru' ? 'Сводка по ЛПХ' : 'ЖЧ боюнча корутунду'}
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{language === 'ru' ? 'Доход от земли:' : 'Жерден киреше:'}</span>
                      <span className="font-medium">{landIncome.toLocaleString()} сом</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ru' ? 'Доход от скота:' : 'Малдан киреше:'}</span>
                      <span className="font-medium">{livestockIncome.toLocaleString()} сом</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ru' ? 'Всего МРС:' : 'Жалпы МРС:'}</span>
                      <span className="font-medium">{livestockMRS.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ru' ? 'МРС на человека:' : 'Адамга МРС:'}</span>
                      <span className="font-medium">{(livestockMRS / familyMembers.length).toFixed(1)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>{language === 'ru' ? 'Общий доход от ЛПХ:' : 'ЖЧдөн жалпы киреше:'}</span>
                        <span className="text-blue-600">{totalHouseholdIncome.toLocaleString()} сом</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Обычные категории доходов
              <div className="grid md:grid-cols-2 gap-4">
                {getCategoryIncomes(activeCategory).map((income) => (
                  <div key={income.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <i className={`${income.icon} mr-2`}></i>
                      {income.name}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={incomes[income.id] || ''}
                        onChange={(e) => handleIncomeChange(income.id, parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        сом
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Income Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-3">
              {language === 'ru' ? 'Сводка по доходам' : 'Кирешелер боюнча корутунду'}
            </h5>
            
            <div className="space-y-2 mb-4">
              {breakdown.breakdown.map((item) => (
                <div key={item.category} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {categories.find(c => c.id === item.category)?.name}:
                  </span>
                  <span className="font-medium" suppressHydrationWarning={true}>
                    {item.amount.toLocaleString()} сом ({item.percentage}%)
                  </span>
                </div>
              ))}
              {totalHouseholdIncome > 0 && (
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-gray-600 font-medium">
                    {language === 'ru' ? 'Доход от ЛПХ:' : 'ЖЧдөн киреше:'}
                  </span>
                  <span className="font-medium text-blue-600">
                    {totalHouseholdIncome.toLocaleString()} сом
                  </span>
                </div>
              )}
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">
                  {language === 'ru' ? 'Общий месячный доход:' : 'Жалпы айлык киреше:'}
                </span>
                <span className="text-2xl font-bold text-blue-600" suppressHydrationWarning={true}>
                  {(totalIncome + totalHouseholdIncome).toLocaleString()} сом
                </span>
              </div>
            </div>

            {/* Eligibility Indicator */}
            <div className="mt-4 p-3 rounded-lg border-2 border-dashed">
              {totalIncome === 0 && totalHouseholdIncome === 0 ? (
                <div className="text-center text-gray-500">
                  <i className="ri-information-line mr-2"></i>
                  {language === 'ru' ? 'Введите доходы для расчета' : 'Эсептөө үчүн кирешелерди киргизиңиз'}
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Предварительная оценка права на пособие' : 'Жөлөкпулга укуктун алдын ала баасы'}
                  </div>
                  <div className={`font-semibold ${(totalIncome + totalHouseholdIncome) < 6000 ? 'text-green-600' : 'text-red-600'}`}>
                    {(totalIncome + totalHouseholdIncome) < 6000 
                      ? (language === 'ru' ? '✓ Вероятно имеет право' : '✓ Укугу бар болушу мүмкүн')
                      : (language === 'ru' ? '✗ Превышает порог ГМД' : '✗ ГМКнын босогосун ашат')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {language === 'ru' ? 'Порог ГМД: 6,000 сом на человека' : 'ГМКнын босогосу: адамга 6,000 сом'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Модальное окно с правилами расчета */}
      <CalculationRulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        language={language}
      />
    </div>
  );
}