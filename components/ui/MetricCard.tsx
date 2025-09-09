'use client';

import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  icon?: ReactNode;
  className?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  className = '' 
}: MetricCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {change && (
            <p className={`text-xs md:text-sm font-medium ${
              change.type === 'positive' ? 'text-green-600' : 
              change.type === 'negative' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {change.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
