'use client';

import { useState, useEffect } from 'react';
import { StudentEducation } from '@/lib/types';

interface StudentEducationFormProps {
  familyMemberId: number;
  familyMemberName: string;
  initialData?: StudentEducation;
  onSave: (data: StudentEducation) => void;
  onCancel: () => void;
}

export default function StudentEducationForm({
  familyMemberId,
  familyMemberName,
  initialData,
  onSave,
  onCancel
}: StudentEducationFormProps) {
  const [formData, setFormData] = useState<Partial<StudentEducation>>({
    familyMemberId,
    institutionName: '',
    startDate: '',
    endDate: '',
    scholarshipAmount: 0,
    tuitionFeeYearly: 0,
    tuitionFeeMonthly: 0,
    fundingSource: 'parents',
    isFullTime: true,
    isActive: true,
    ...initialData
  });

  // Автоматический расчет месячной платы за обучение
  useEffect(() => {
    if (formData.tuitionFeeYearly && formData.tuitionFeeYearly > 0) {
      const monthlyFee = formData.tuitionFeeYearly / 12;
      setFormData(prev => ({
        ...prev,
        tuitionFeeMonthly: Math.round(monthlyFee)
      }));
    }
  }, [formData.tuitionFeeYearly]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.institutionName || !formData.startDate || !formData.fundingSource) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const educationData: StudentEducation = {
      id: formData.id || 0,
      familyMemberId,
      institutionName: formData.institutionName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      scholarshipAmount: formData.scholarshipAmount || 0,
      tuitionFeeYearly: formData.tuitionFeeYearly || 0,
      tuitionFeeMonthly: formData.tuitionFeeMonthly || 0,
      fundingSource: formData.fundingSource as 'government' | 'parents' | 'grant' | 'other',
      isFullTime: formData.isFullTime || false,
      isActive: true,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(educationData);
  };

  const fundingSourceOptions = [
    { value: 'government', label: 'Государство' },
    { value: 'parents', label: 'Родители' },
    { value: 'grant', label: 'Грант' },
    { value: 'other', label: 'Иное' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Данные об обучении: {familyMemberName}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Учебное заведение */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Где и с какого времени обучается <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="institutionName"
              value={formData.institutionName || ''}
              onChange={handleChange}
              placeholder="Название учебного заведения"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="date"
              name="startDate"
              value={formData.startDate || ''}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Дата окончания обучения (опционально) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дата окончания обучения (если известно)
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Размер стипендии */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Размер стипендии (бюджет) в месяц (сом)
          </label>
          <input
            type="number"
            name="scholarshipAmount"
            value={formData.scholarshipAmount || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Сумма за обучение в год */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Сумма за обучение (коммерческая основа, в год) в сомах
          </label>
          <input
            type="number"
            name="tuitionFeeYearly"
            value={formData.tuitionFeeYearly || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Сумма за обучение в месяц (автоматический расчет) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Сумма за обучение (коммерческая, в месяц) в сомах
          </label>
          <input
            type="number"
            name="tuitionFeeMonthly"
            value={formData.tuitionFeeMonthly || ''}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">
            Автоматически рассчитывается как годовая сумма / 12
          </p>
        </div>

        {/* Источник финансирования */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Источник финансирования <span className="text-red-500">*</span>
          </label>
          <select
            name="fundingSource"
            value={formData.fundingSource || 'parents'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {fundingSourceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Очное обучение */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isFullTime"
            checked={formData.isFullTime || false}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Очное обучение
          </label>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
}
