'use client';

import { useState } from 'react';

interface CreateRegistryFormProps {
  onSubmit: (formData: any) => void;
}

export default function CreateRegistryForm({ onSubmit }: CreateRegistryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Ежемесячный',
    description: '',
    startDate: '',
    endDate: '',
    template: 'default'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">Название реестра</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          placeholder="Например: Реестр выплат за январь 2024"
          required
        />
      </div>

      <div>
        <label className="form-label">Тип реестра</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="form-select"
        >
          <option value="Ежемесячный">Ежемесячный</option>
          <option value="Еженедельный">Еженедельный</option>
          <option value="Специальный">Специальный</option>
          <option value="Аналитический">Аналитический</option>
        </select>
      </div>

      <div>
        <label className="form-label">Описание</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Описание назначения реестра..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Дата начала</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">Дата окончания</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>

      <div>
        <label className="form-label">Шаблон</label>
        <select
          name="template"
          value={formData.template}
          onChange={handleChange}
          className="form-select"
        >
          <option value="default">Стандартный шаблон</option>
          <option value="monthly">Ежемесячный шаблон</option>
          <option value="special">Специальный шаблон</option>
          <option value="analytical">Аналитический шаблон</option>
        </select>
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
          <i className="ri-add-line mr-2"></i>
          Создать реестр
        </button>
      </div>
    </form>
  );
}
