'use client';

import { useState } from 'react';
import { loadTestApplications, clearTestApplications } from '@/lib/testData';

interface TestDataLoaderProps {
  onDataLoaded?: () => void;
}

export default function TestDataLoader({ onDataLoaded }: TestDataLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadTestData = async () => {
    setIsLoading(true);
    try {
      loadTestApplications();
      
      // Отправляем событие для обновления компонентов
      window.dispatchEvent(new CustomEvent('applicationSubmitted'));
      
      if (onDataLoaded) {
        onDataLoaded();
      }
      
      alert('Тестовые заявки успешно загружены!');
    } catch (error) {
      console.error('Ошибка при загрузке тестовых данных:', error);
      alert('Ошибка при загрузке тестовых данных');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearTestData = () => {
    if (confirm('Вы уверены, что хотите удалить все тестовые заявки?')) {
      clearTestApplications();
      window.dispatchEvent(new CustomEvent('applicationSubmitted'));
      alert('Тестовые заявки удалены!');
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 md:p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Тестовые данные</h3>
      <div className="space-y-4">
        <div className="text-sm text-neutral-600">
          <p>Загрузите тестовые заявки для демонстрации всех статусов:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><span className="font-medium">DRAFT</span> - Черновик заявки</li>
            <li><span className="font-medium">SUBMITTED</span> - Подана заявка</li>
            <li><span className="font-medium">UNDER_REVIEW</span> - На рассмотрении</li>
            <li><span className="font-medium">APPROVED</span> - Одобрена</li>
            <li><span className="font-medium">REJECTED</span> - Отклонена</li>
            <li><span className="font-medium">PENDING</span> - В ожидании</li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleLoadTestData}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Загрузка...
              </>
            ) : (
              <>
                <i className="ri-database-2-line mr-2"></i>
                Загрузить тестовые заявки
              </>
            )}
          </button>
          
          <button
            onClick={handleClearTestData}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <i className="ri-delete-bin-line mr-2"></i>
            Очистить данные
          </button>
        </div>
      </div>
    </div>
  );
}
