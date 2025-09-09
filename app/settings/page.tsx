'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    baseRate: 1200,
    gmdThreshold: 6000,
    maxChildAge: 16,
    mountainCoefficient: 1.15,
    borderCoefficient: 1.20,
    borderAllowance: 1000,
    emailNotifications: true,
    pushNotifications: false,
    actionLogging: true,
    autoBackup: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Здесь будет логика сохранения настроек
    alert('Настройки сохранены!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Настройки</h1>
        <p className="text-neutral-600 mt-1">Управление системными параметрами и конфигурацией</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General Parameters */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Общие параметры
          </h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Базовая ставка пособия (сом)</label>
              <input 
                type="number" 
                value={settings.baseRate}
                onChange={(e) => handleSettingChange('baseRate', parseInt(e.target.value))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Порог ГМД (сом)</label>
              <input 
                type="number" 
                value={settings.gmdThreshold}
                onChange={(e) => handleSettingChange('gmdThreshold', parseInt(e.target.value))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Максимальный возраст ребенка (лет)</label>
              <input 
                type="number" 
                value={settings.maxChildAge}
                onChange={(e) => handleSettingChange('maxChildAge', parseInt(e.target.value))}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Regional Coefficients */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Региональные коэффициенты
          </h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Горные районы</label>
              <input 
                type="number" 
                step="0.05"
                value={settings.mountainCoefficient}
                onChange={(e) => handleSettingChange('mountainCoefficient', parseFloat(e.target.value))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Приграничные зоны</label>
              <input 
                type="number" 
                step="0.05"
                value={settings.borderCoefficient}
                onChange={(e) => handleSettingChange('borderCoefficient', parseFloat(e.target.value))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Приграничная надбавка (сом)</label>
              <input 
                type="number" 
                value={settings.borderAllowance}
                onChange={(e) => handleSettingChange('borderAllowance', parseInt(e.target.value))}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Уведомления
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-neutral-900">Email уведомления</label>
                <p className="text-sm text-neutral-600">Отправка уведомлений по электронной почте</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="rounded border-neutral-300 text-brand-red focus:ring-brand-red"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-neutral-900">Push уведомления</label>
                <p className="text-sm text-neutral-600">Уведомления в браузере</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                className="rounded border-neutral-300 text-brand-red focus:ring-brand-red"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Безопасность
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-neutral-900">Логирование действий</label>
                <p className="text-sm text-neutral-600">Запись всех действий пользователей</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.actionLogging}
                onChange={(e) => handleSettingChange('actionLogging', e.target.checked)}
                className="rounded border-neutral-300 text-brand-red focus:ring-brand-red"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-neutral-900">Автоматическое резервное копирование</label>
                <p className="text-sm text-neutral-600">Ежедневное создание резервных копий</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.autoBackup}
                onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                className="rounded border-neutral-300 text-brand-red focus:ring-brand-red"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          className="btn-primary"
        >
          <i className="ri-save-line mr-2"></i>
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
