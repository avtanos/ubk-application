'use client';

import { useState, useEffect } from 'react';
import { InspectionType, Priority } from '@/lib/types';

interface ScheduleInspectionFormProps {
  applicationId: number;
  applicantName: string;
  address: string;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

export default function ScheduleInspectionForm({ 
  applicationId, 
  applicantName, 
  address, 
  onSubmit, 
  onCancel 
}: ScheduleInspectionFormProps) {
  const [formData, setFormData] = useState({
    applicationId,
    type: 'PRIMARY' as InspectionType,
    priority: 'MEDIUM' as Priority,
    scheduledDate: '',
    scheduledTime: '',
    inspectorId: 0,
    inspectorName: '',
    address: address,
    notes: ''
  });

  const [inspectors, setInspectors] = useState([
    { id: 1, name: 'Нурбек Жумабеков', position: 'Специалист по выездным проверкам' },
    { id: 2, name: 'Айгуль Токтосунова', position: 'Специалист по выездным проверкам' },
    { id: 3, name: 'Марат Беков', position: 'Старший специалист' },
    { id: 4, name: 'Нургуль Асанова', position: 'Специалист по выездным проверкам' }
  ]);

  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    // Генерируем доступные временные слоты
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    setAvailableTimeSlots(slots);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // При выборе инспектора автоматически заполняем имя
    if (name === 'inspectorId') {
      const inspector = inspectors.find(i => i.id === parseInt(value));
      if (inspector) {
        setFormData(prev => ({
          ...prev,
          inspectorName: inspector.name
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'URGENT': return 'text-red-600 bg-red-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getTypeLabel = (type: InspectionType) => {
    switch (type) {
      case 'PRIMARY': return 'Первичная проверка';
      case 'REPEAT': return 'Повторная проверка';
      case 'COMPLAINT': return 'Проверка по жалобе';
      default: return type;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Планирование выездной проверки
        </h2>
        <p className="text-neutral-600">
          Назначение выездной проверки для заявления
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Информация о заявлении */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Информация о заявлении
          </h3>
          <div className="space-y-3">
            <div>
              <label className="form-label">Заявитель</label>
              <input
                type="text"
                value={applicantName}
                className="form-input bg-neutral-50"
                readOnly
              />
            </div>
            <div>
              <label className="form-label">Адрес для проверки</label>
              <textarea
                value={formData.address}
                onChange={handleChange}
                name="address"
                className="form-textarea"
                rows={2}
                placeholder="Адрес для проведения проверки"
                required
              />
            </div>
          </div>
        </div>

        {/* Параметры проверки */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Параметры проверки
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Тип проверки</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="PRIMARY">Первичная проверка</option>
                <option value="REPEAT">Повторная проверка</option>
                <option value="COMPLAINT">Проверка по жалобе</option>
              </select>
            </div>

            <div>
              <label className="form-label">Приоритет</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="LOW">Низкий</option>
                <option value="MEDIUM">Средний</option>
                <option value="HIGH">Высокий</option>
                <option value="URGENT">Срочный</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600">Тип:</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${getPriorityColor(formData.priority)}`}>
                {getTypeLabel(formData.type)}
              </span>
              <span className="text-sm text-neutral-600">Приоритет:</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${getPriorityColor(formData.priority)}`}>
                {formData.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Планирование времени */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Планирование времени
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Дата проверки</label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="form-label">Время проверки</label>
              <select
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Выберите время</option>
                {availableTimeSlots.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.scheduledDate && formData.scheduledTime && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <i className="ri-calendar-line mr-2"></i>
                Проверка запланирована на {new Date(formData.scheduledDate).toLocaleDateString('ru-RU')} в {formData.scheduledTime}
              </p>
            </div>
          )}
        </div>

        {/* Назначение инспектора */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Назначение инспектора
          </h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Инспектор</label>
              <select
                name="inspectorId"
                value={formData.inspectorId}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Выберите инспектора</option>
                {inspectors.map(inspector => (
                  <option key={inspector.id} value={inspector.id}>
                    {inspector.name} - {inspector.position}
                  </option>
                ))}
              </select>
            </div>

            {formData.inspectorId > 0 && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <i className="ri-user-line mr-2"></i>
                  Назначен инспектор: {formData.inspectorName}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Дополнительные заметки */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Дополнительные заметки
          </h3>
          <div>
            <label className="form-label">Заметки для инспектора</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              rows={4}
              placeholder="Дополнительная информация, особенности проверки, особые указания..."
            />
          </div>
        </div>

        {/* Чек-лист подготовки */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Чек-лист подготовки к проверке
          </h3>
          <div className="space-y-3">
            {[
              'Скачать чек-лист проверки из системы',
              'Подготовить документы о составе семьи',
              'Подготовить документы о доходах',
              'Подготовить документы о жилищных условиях',
              'Подготовить документы об имуществе',
              'Проверить контактные данные заявителя',
              'Подготовить план маршрута',
              'Проверить наличие фотоаппарата/телефона для фотофиксации'
            ].map((item, index) => (
              <label key={index} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-neutral-700">{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!formData.scheduledDate || !formData.scheduledTime || !formData.inspectorId}
          >
            <i className="ri-calendar-check-line mr-2"></i>
            Запланировать проверку
          </button>
        </div>
      </form>
    </div>
  );
}
