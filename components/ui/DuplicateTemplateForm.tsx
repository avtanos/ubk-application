'use client';

import { useState } from 'react';

interface DuplicateTemplateFormProps {
  onSubmit: (formData: any) => void;
}

export default function DuplicateTemplateForm({ onSubmit }: DuplicateTemplateFormProps) {
  const [formData, setFormData] = useState({
    templateName: '',
    sourceTemplate: 'financial_report',
    newTitle: '',
    description: '',
    modifications: {
      changePeriod: false,
      changeFormat: false,
      changeContent: false
    },
    period: 'monthly',
    format: 'excel',
    includeCharts: true,
    includeDetails: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleModificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      modifications: {
        ...formData.modifications,
        [name]: checked
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">Название нового шаблона</label>
        <input
          type="text"
          name="templateName"
          value={formData.templateName}
          onChange={handleChange}
          className="form-input"
          placeholder="Введите название шаблона"
          required
        />
      </div>

      <div>
        <label className="form-label">Исходный шаблон</label>
        <select
          name="sourceTemplate"
          value={formData.sourceTemplate}
          onChange={handleChange}
          className="form-select"
        >
          <option value="financial_report">Финансовый отчет</option>
          <option value="payments_summary">Сводка платежей</option>
          <option value="applications_summary">Сводка заявлений</option>
          <option value="risk_analysis">Анализ рисков</option>
          <option value="performance_report">Отчет производительности</option>
          <option value="audit_report">Аудит отчет</option>
        </select>
      </div>

      <div>
        <label className="form-label">Название отчета</label>
        <input
          type="text"
          name="newTitle"
          value={formData.newTitle}
          onChange={handleChange}
          className="form-input"
          placeholder="Введите название отчета"
          required
        />
      </div>

      <div>
        <label className="form-label">Описание</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Описание назначения отчета..."
        />
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Модификации шаблона</h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="changePeriod"
            checked={formData.modifications.changePeriod}
            onChange={handleModificationChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Изменить период генерации
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="changeFormat"
            checked={formData.modifications.changeFormat}
            onChange={handleModificationChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Изменить формат отчета
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="changeContent"
            checked={formData.modifications.changeContent}
            onChange={handleModificationChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Изменить содержимое отчета
          </label>
        </div>
      </div>

      {formData.modifications.changePeriod && (
        <div>
          <label className="form-label">Период</label>
          <select
            name="period"
            value={formData.period}
            onChange={handleChange}
            className="form-select"
          >
            <option value="daily">Ежедневно</option>
            <option value="weekly">Еженедельно</option>
            <option value="monthly">Ежемесячно</option>
            <option value="quarterly">Ежеквартально</option>
            <option value="yearly">Ежегодно</option>
          </select>
        </div>
      )}

      {formData.modifications.changeFormat && (
        <div>
          <label className="form-label">Формат отчета</label>
          <select
            name="format"
            value={formData.format}
            onChange={handleChange}
            className="form-select"
          >
            <option value="excel">Excel (.xlsx)</option>
            <option value="pdf">PDF (.pdf)</option>
            <option value="csv">CSV (.csv)</option>
            <option value="json">JSON (.json)</option>
          </select>
        </div>
      )}

      {formData.modifications.changeContent && (
        <div className="space-y-3">
          <h4 className="font-medium text-neutral-900">Содержимое отчета</h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="includeCharts"
              checked={formData.includeCharts}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-neutral-700">
              Включить графики и диаграммы
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="includeDetails"
              checked={formData.includeDetails}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-neutral-700">
              Включить детальную информацию
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={() => onSubmit({})}
          className="btn-secondary"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          <i className="ri-file-copy-line mr-2"></i>
          Дублировать шаблон
        </button>
      </div>
    </form>
  );
}
