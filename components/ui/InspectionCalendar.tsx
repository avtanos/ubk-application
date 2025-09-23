'use client';

import { useState, useEffect } from 'react';
import { Inspection, InspectionStatus } from '@/lib/types';

interface InspectionCalendarProps {
  inspections: Inspection[];
  onInspectionClick?: (inspection: Inspection) => void;
}

export default function InspectionCalendar({ inspections, onInspectionClick }: InspectionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Получаем первый день месяца и количество дней
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Создаем массив дней месяца
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Создаем массив пустых дней для выравнивания
  const emptyDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    emptyDays.push(i);
  }

  // Получаем проверки для выбранной даты
  const getInspectionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return inspections.filter(inspection => 
      inspection.scheduledDate && 
      new Date(inspection.scheduledDate).toISOString().split('T')[0] === dateStr
    );
  };

  // Получаем проверки для текущего дня
  const getInspectionsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return getInspectionsForDate(date);
  };

  const getStatusColor = (status: InspectionStatus) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'PREPARATION': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'REPEAT': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: InspectionStatus) => {
    switch (status) {
      case 'ASSIGNED': return 'Назначена';
      case 'PREPARATION': return 'Подготовка';
      case 'IN_PROGRESS': return 'В процессе';
      case 'COMPLETED': return 'Завершена';
      case 'CANCELLED': return 'Отменена';
      case 'REPEAT': return 'Повторная';
      default: return status;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Календарь проверок</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>
          <span className="text-lg font-medium text-gray-900 min-w-[200px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty days */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-24"></div>
          ))}

          {/* Days */}
          {days.map((day) => {
            const dayInspections = getInspectionsForDay(day);
            const isCurrentDay = isToday(day);
            const isSelectedDay = isSelected(day);

            return (
              <div
                key={day}
                className={`
                  h-24 border border-gray-200 rounded-lg p-2 cursor-pointer transition-colors
                  ${isCurrentDay ? 'bg-blue-50 border-blue-300' : ''}
                  ${isSelectedDay ? 'bg-blue-100 border-blue-400' : ''}
                  ${!isCurrentDay && !isSelectedDay ? 'hover:bg-gray-50' : ''}
                `}
                onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}`}>
                    {day}
                  </span>
                  {dayInspections.length > 0 && (
                    <span className="text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {dayInspections.length}
                    </span>
                  )}
                </div>
                
                {/* Inspections for this day */}
                <div className="space-y-1">
                  {dayInspections.slice(0, 2).map((inspection) => (
                    <div
                      key={inspection.id}
                      className={`
                        text-xs px-2 py-1 rounded truncate cursor-pointer
                        ${getStatusColor(inspection.status)}
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectionClick?.(inspection);
                      }}
                      title={`${inspection.application?.applicant?.fullName || 'Не указано'} - ${getStatusLabel(inspection.status)}`}
                    >
                      {inspection.scheduledTime && (
                        <span className="font-medium">{inspection.scheduledTime}</span>
                      )}
                      <div className="truncate">
                        {inspection.application?.applicant?.fullName || 'Не указано'}
                      </div>
                    </div>
                  ))}
                  {dayInspections.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayInspections.length - 2} еще
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="border-t p-4 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">
            Проверки на {selectedDate.toLocaleDateString('ru-RU', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h4>
          {getInspectionsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500 text-sm">На этот день проверок не запланировано</p>
          ) : (
            <div className="space-y-2">
              {getInspectionsForDate(selectedDate).map((inspection) => (
                <div
                  key={inspection.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() => onInspectionClick?.(inspection)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {inspection.application?.applicant?.fullName || 'Не указано'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(inspection.status)}`}>
                        {getStatusLabel(inspection.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {inspection.scheduledTime && `${inspection.scheduledTime} • `}
                      {inspection.address}
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
