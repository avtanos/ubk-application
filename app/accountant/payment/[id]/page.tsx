import { Suspense } from 'react';
import PaymentDetailsClient from './PaymentDetailsClient';

// Функция для статической генерации параметров
export async function generateStaticParams() {
  // Возвращаем массив возможных ID выплат для статической генерации
  return [
    { id: 'PAY-001' },
    { id: 'PAY-002' },
    { id: 'PAY-003' },
    { id: 'PAY-004' },
    { id: 'PAY-005' }
  ];
}



export default async function PaymentDetails({ params }: { params: Promise<{ id: string }> }) {
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
      <PaymentDetailsClient paymentId={id} />
    </Suspense>
  );
}
