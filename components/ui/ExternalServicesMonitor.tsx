'use client';

import { useState, useEffect } from 'react';
import { externalApiService } from '@/lib/externalApiService';
import { EXTERNAL_SERVICES, ExternalServiceConfig } from '@/lib/externalServices';

interface ExternalServicesMonitorProps {
  language: string;
}

interface ServiceStatus {
  id: string;
  name: string;
  provider: string;
  isActive: boolean;
  isHealthy: boolean;
  lastChecked: string;
  responseTime?: number;
  errorMessage?: string;
}

export default function ExternalServicesMonitor({ language }: ExternalServicesMonitorProps) {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const checkAllServices = async () => {
    setIsLoading(true);
    const serviceStatuses: ServiceStatus[] = [];

    for (const service of EXTERNAL_SERVICES) {
      const startTime = Date.now();
      const isHealthy = await externalApiService.checkServiceHealth(service.id);
      const responseTime = Date.now() - startTime;

      serviceStatuses.push({
        id: service.id,
        name: service.name,
        provider: service.provider,
        isActive: service.isActive,
        isHealthy,
        lastChecked: new Date().toISOString(),
        responseTime: isHealthy ? responseTime : undefined,
        errorMessage: isHealthy ? undefined : 'Сервис недоступен'
      });
    }

    setServices(serviceStatuses);
    setLastUpdate(new Date().toLocaleString());
    setIsLoading(false);
  };

  useEffect(() => {
    checkAllServices();
    
    // Проверяем статус каждые 5 минут
    const interval = setInterval(checkAllServices, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (service: ServiceStatus) => {
    if (!service.isActive) return 'text-gray-500 bg-gray-100';
    if (service.isHealthy) return 'text-green-600 bg-green-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (service: ServiceStatus) => {
    if (!service.isActive) return 'ri-pause-circle-line';
    if (service.isHealthy) return 'ri-check-circle-line';
    return 'ri-error-warning-line';
  };

  const getStatusText = (service: ServiceStatus) => {
    if (!service.isActive) return language === 'ru' ? 'Отключен' : 'Өчүрүлгөн';
    if (service.isHealthy) return language === 'ru' ? 'Работает' : 'Иштейт';
    return language === 'ru' ? 'Ошибка' : 'Ката';
  };

  const activeServices = services.filter(s => s.isActive);
  const healthyServices = activeServices.filter(s => s.isHealthy);
  const unhealthyServices = activeServices.filter(s => !s.isHealthy);

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <i className="ri-server-line mr-3 text-blue-600"></i>
              {language === 'ru' ? 'Мониторинг внешних сервисов' : 'Тышкы сервистерди мониторинг'}
            </h3>
            <p className="text-gray-600 mt-2">
              {language === 'ru' 
                ? 'Статус интеграции с государственными информационными системами'
                : 'Мамлекеттик маалыматтык системалар менен интеграциянын абалы'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={checkAllServices}
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <i className={`ri-refresh-line mr-2 ${isLoading ? 'animate-spin' : ''}`}></i>
              {language === 'ru' ? 'Обновить' : 'Жаңылоо'}
            </button>
            <div className="text-sm text-gray-500">
              {language === 'ru' ? 'Последнее обновление:' : 'Акыркы жаңылоо:'} {lastUpdate}
            </div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-server-line text-2xl text-blue-600 mr-3"></i>
              <div>
                <div className="text-2xl font-bold text-blue-900">{services.length}</div>
                <div className="text-sm text-blue-700">
                  {language === 'ru' ? 'Всего сервисов' : 'Жалпы сервистер'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-check-circle-line text-2xl text-green-600 mr-3"></i>
              <div>
                <div className="text-2xl font-bold text-green-900">{healthyServices.length}</div>
                <div className="text-sm text-green-700">
                  {language === 'ru' ? 'Работают' : 'Иштейт'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-error-warning-line text-2xl text-red-600 mr-3"></i>
              <div>
                <div className="text-2xl font-bold text-red-900">{unhealthyServices.length}</div>
                <div className="text-sm text-red-700">
                  {language === 'ru' ? 'Ошибки' : 'Каталар'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <i className="ri-pause-circle-line text-2xl text-gray-600 mr-3"></i>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {services.length - activeServices.length}
                </div>
                <div className="text-sm text-gray-700">
                  {language === 'ru' ? 'Отключены' : 'Өчүрүлгөн'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Список сервисов */}
      <div className="p-6">
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${getStatusColor(service)}`}>
                  <i className={`${getStatusIcon(service)} text-lg`}></i>
                </div>
                
                <div>
                  <div className="font-semibold text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-600">{service.provider}</div>
                  {service.errorMessage && (
                    <div className="text-sm text-red-600 mt-1">{service.errorMessage}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(service)}`}>
                    {getStatusText(service)}
                  </div>
                  {service.responseTime && (
                    <div className="text-xs text-gray-500">
                      {service.responseTime}ms
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-400">
                  {new Date(service.lastChecked).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Легенда */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-3">
          {language === 'ru' ? 'Легенда' : 'Аныктама'}
        </h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <i className="ri-check-circle-line text-green-600"></i>
            <span>{language === 'ru' ? 'Сервис работает' : 'Сервис иштейт'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="ri-error-warning-line text-red-600"></i>
            <span>{language === 'ru' ? 'Ошибка подключения' : 'Туташуу катасы'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="ri-pause-circle-line text-gray-600"></i>
            <span>{language === 'ru' ? 'Сервис отключен' : 'Сервис өчүрүлгөн'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
