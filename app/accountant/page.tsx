'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountantDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Перенаправляем на страницу выплат по умолчанию
    router.replace('/accountant/payments');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-600">Перенаправление на страницу выплат...</p>
      </div>
    </div>
  );
}
