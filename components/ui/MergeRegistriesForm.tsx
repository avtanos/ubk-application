'use client';

import { useState } from 'react';

interface Registry {
  id: string;
  name: string;
  type: string;
  status: string;
  recordsCount: number;
  totalAmount: number;
}

interface MergeRegistriesFormProps {
  registries: Registry[];
  onSubmit: (formData: any) => void;
}

export default function MergeRegistriesForm({ registries, onSubmit }: MergeRegistriesFormProps) {
  const [formData, setFormData] = useState({
    registries: [] as string[],
    mergedName: '',
    mergeStrategy: 'combine',
    removeDuplicates: true,
    newType: 'Ежемесячный'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.registries.length < 2) {
      alert('Выберите минимум 2 реестра для объединения');
      return;
    }
    onSubmit(formData);
  };

  const handleRegistryChange = (registryId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        registries: [...formData.registries, registryId]
      });
    } else {
      setFormData({
        ...formData,
        registries: formData.registries.filter(id => id !== registryId)
      });
    }
  };

  const selectedRegistries = registries.filter(r => formData.registries.includes(r.id));
  const totalRecords = selectedRegistries.reduce((sum, r) => sum + r.recordsCount, 0);
  const totalAmount = selectedRegistries.reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">Выберите реестры для объединения (минимум 2)</label>
        <div className="space-y-2 max-h-48 overflow-y-auto border border-neutral-200 rounded-lg p-3">
          {registries.map(registry => (
            <div key={registry.id} className="flex items-center">
              <input
                type="checkbox"
                id={registry.id}
                checked={formData.registries.includes(registry.id)}
                onChange={(e) => handleRegistryChange(registry.id, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={registry.id} className="ml-2 text-sm text-neutral-700 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{registry.name}</span>
                  <span className="text-neutral-500">
                    {registry.recordsCount.toLocaleString()} записей, {registry.totalAmount.toLocaleString()} сом
                  </span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {selectedRegistries.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Сводка объединения</h4>
          <div className="text-sm text-green-800">
            <p><strong>Выбрано реестров:</strong> {selectedRegistries.length}</p>
            <p><strong>Общее количество записей:</strong> {totalRecords.toLocaleString()}</p>
            <p><strong>Общая сумма:</strong> {totalAmount.toLocaleString()} сом</p>
          </div>
        </div>
      )}

      <div>
        <label className="form-label">Название объединенного реестра</label>
        <input
          type="text"
          name="mergedName"
          value={formData.mergedName}
          onChange={(e) => setFormData({...formData, mergedName: e.target.value})}
          className="form-input"
          placeholder="Введите название для объединенного реестра"
          required
        />
      </div>

      <div>
        <label className="form-label">Тип объединенного реестра</label>
        <select
          name="newType"
          value={formData.newType}
          onChange={(e) => setFormData({...formData, newType: e.target.value})}
          className="form-select"
        >
          <option value="Ежемесячный">Ежемесячный</option>
          <option value="Еженедельный">Еженедельный</option>
          <option value="Специальный">Специальный</option>
          <option value="Аналитический">Аналитический</option>
        </select>
      </div>

      <div>
        <label className="form-label">Стратегия объединения</label>
        <select
          name="mergeStrategy"
          value={formData.mergeStrategy}
          onChange={(e) => setFormData({...formData, mergeStrategy: e.target.value})}
          className="form-select"
        >
          <option value="combine">Объединить все записи</option>
          <option value="append">Добавить к первому реестру</option>
          <option value="merge">Слияние с приоритетом</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="removeDuplicates"
          checked={formData.removeDuplicates}
          onChange={(e) => setFormData({...formData, removeDuplicates: e.target.checked})}
          className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
        />
        <label className="ml-2 text-sm text-neutral-700">
          Удалить дублирующиеся записи
        </label>
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
          className="btn-warning"
          disabled={formData.registries.length < 2}
        >
          <i className="ri-merge-cells-line mr-2"></i>
          Объединить реестры
        </button>
      </div>
    </form>
  );
}
