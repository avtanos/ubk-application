import { Suspense } from 'react';
import ExportRegistryClient from './ExportRegistryClient';

// Функция для статической генерации параметров
export async function generateStaticParams() {
  // Возвращаем массив возможных ID реестров для статической генерации
  return [
    { id: 'REG-2025-01' },
    { id: 'REG-2025-02' },
    { id: 'REG-2025-03' },
    { id: 'REG-2024-12' },
    { id: 'REG-2024-11' }
  ];
}



export default async function ExportRegistry({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="ri-government-line text-2xl text-white"></i>
          </div>
          <div className="text-gray-600">Загрузка...</div>
        </div>
      </div>
    }>
      <ExportRegistryClient registryId={id} />
    </Suspense>
  );
}
