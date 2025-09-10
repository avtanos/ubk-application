'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { 
  analyzeApplicationIncome, 
  IncomeAnalysisResult, 
  getStabilityColor, 
  getDiversificationColor, 
  formatCurrency 
} from '@/lib/incomeAnalysis';

interface IncomeAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
}

export default function IncomeAnalysisModal({ isOpen, onClose, application }: IncomeAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<IncomeAnalysisResult | null>(null);

  useEffect(() => {
    if (application && isOpen) {
      const result = analyzeApplicationIncome(application);
      setAnalysis(result);
    }
  }, [application, isOpen]);

  if (!analysis) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              8-категорийный анализ доходов
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Заявка №{application?.applicationNumber} - {application?.applicantName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Общая информация */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <i className="ri-money-dollar-circle-line text-blue-600 text-xl"></i>
              <div>
                <p className="text-sm font-medium text-blue-900">Общий семейный доход</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatCurrency(analysis.totalIncome)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <i className="ri-user-line text-purple-600 text-xl"></i>
              <div>
                <p className="text-sm font-medium text-purple-900">ССДС</p>
                <p className="text-lg font-semibold text-purple-600">
                  {formatCurrency(analysis.analysis.perCapitaIncome)}
                </p>
                <p className="text-xs text-purple-600">на {analysis.analysis.familySize} чел.</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <i className="ri-shield-check-line text-green-600 text-xl"></i>
              <div>
                <p className="text-sm font-medium text-green-900">Стабильность</p>
                <p className={`text-sm font-medium px-2 py-1 rounded ${getStabilityColor(analysis.analysis.stability)}`}>
                  {analysis.analysis.stability === 'high' ? 'Высокая' : 
                   analysis.analysis.stability === 'medium' ? 'Средняя' : 'Низкая'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <i className="ri-line-chart-line text-orange-600 text-xl"></i>
              <div>
                <p className="text-sm font-medium text-orange-900">Диверсификация</p>
                <p className={`text-sm font-medium px-2 py-1 rounded ${getDiversificationColor(analysis.analysis.diversification)}`}>
                  {analysis.analysis.diversification === 'high' ? 'Высокая' : 
                   analysis.analysis.diversification === 'medium' ? 'Средняя' : 'Низкая'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Сравнение с порогом ГМД */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="ri-scales-line text-red-600 text-xl"></i>
              <div>
                <h3 className="text-lg font-semibold text-red-900">Сравнение с порогом ГМД</h3>
                <p className="text-sm text-red-700">Порог ГМД: 4 500 сом</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${analysis.analysis.perCapitaIncome > 4500 ? 'text-red-600' : 'text-green-600'}`}>
                {analysis.analysis.perCapitaIncome > 4500 ? 'Х НЕ ПОДХОДИТ' : '✓ ПОДХОДИТ'}
              </p>
              <p className="text-sm text-red-700">
                {analysis.analysis.perCapitaIncome > 4500 
                  ? `${formatCurrency(analysis.analysis.perCapitaIncome - 4500)} выше порога`
                  : `${formatCurrency(4500 - analysis.analysis.perCapitaIncome)} ниже порога`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Основной источник дохода */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">Основной источник дохода</h3>
          <div className="flex items-center space-x-3">
            <i className="ri-focus-3-line text-blue-600 text-xl"></i>
            <span className="text-lg font-medium text-neutral-900">{analysis.analysis.primarySource}</span>
          </div>
        </div>

        {/* Категории доходов */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">8-категорийный анализ доходов</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analysis.categories.map((category) => (
              <div key={category.id} className={`${category.color.replace('bg-', 'bg-')} border border-neutral-200 rounded-lg p-4`}>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <i className={`${category.icon} text-white text-2xl`}></i>
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-2">{category.name}</h4>
                  <p className="text-white text-lg font-bold mb-2">
                    {formatCurrency(category.amount)}
                  </p>
                  <p className="text-white text-sm opacity-90">
                    {category.percentage.toFixed(1)}% от общего дохода
                  </p>
                  
                  {/* Подкатегории */}
                  <div className="mt-3 pt-3 border-t border-white border-opacity-30">
                    <ul className="text-xs text-white text-left space-y-1">
                      {category.subcategories?.map((subcat, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-white rounded-full mr-2"></span>
                          {subcat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Рекомендации */}
        {analysis.analysis.recommendations.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
              <i className="ri-lightbulb-line mr-2"></i>
              Рекомендации
            </h3>
            <ul className="space-y-2">
              {analysis.analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <i className="ri-arrow-right-s-line text-yellow-600 mt-0.5"></i>
                  <span className="text-sm text-yellow-800">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          >
            Закрыть
          </button>
          <button
            onClick={() => {
              // Здесь можно добавить экспорт анализа
              console.log('Экспорт анализа доходов', analysis);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-download-line mr-2"></i>
            Экспорт анализа
          </button>
        </div>
      </div>
    </Modal>
  );
}
