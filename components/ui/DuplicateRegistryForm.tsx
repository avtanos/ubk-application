'use client';

import { useState } from 'react';

interface Registry {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface DuplicateRegistryFormProps {
  registries: Registry[];
  onSubmit: (formData: any) => void;
}

export default function DuplicateRegistryForm({ registries, onSubmit }: DuplicateRegistryFormProps) {
  const [formData, setFormData] = useState({
    sourceRegistry: '',
    newName: '',
    copyData: true,
    copySettings: true,
    newType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const selectedRegistry = registries.find(r => r.id === formData.sourceRegistry);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">Исходный реестр</label>
        <select
          name="sourceRegistry"
          value={formData.sourceRegistry}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Выберите реестр для дублирования</option>
          {registries.map(registry => (
            <option key={registry.id} value={registry.id}>
              {registry.name} ({registry.type})
            </option>
          ))}
        </select>
      </div>

      {selectedRegistry && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Информация об исходном реестре</h4>
          <div className="text-sm text-blue-800">
            <p><strong>Название:</strong> {selectedRegistry.name}</p>
            <p><strong>Тип:</strong> {selectedRegistry.type}</p>
            <p><strong>Статус:</strong> {selectedRegistry.status}</p>
          </div>
        </div>
      )}

      <div>
        <label className="form-label">Название нового реестра</label>
        <input
          type="text"
          name="newName"
          value={formData.newName}
          onChange={handleChange}
          className="form-input"
          placeholder="Введите название для нового реестра"
          required
        />
      </div>

      <div>
        <label className="form-label">Тип нового реестра</label>
        <select
          name="newType"
          value={formData.newType}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Оставить как в исходном</option>
          <option value="Ежемесячный">Ежемесячный</option>
          <option value="Еженедельный">Еженедельный</option>
          <option value="Специальный">Специальный</option>
          <option value="Аналитический">Аналитический</option>
        </select>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900">Параметры копирования</h4>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="copyData"
            checked={formData.copyData}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Копировать данные (записи выплат)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="copySettings"
            checked={formData.copySettings}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-neutral-700">
            Копировать настройки и параметры
          </label>
        </div>
      </div>

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
          Дублировать реестр
        </button>
      </div>
    </form>
  );
}
