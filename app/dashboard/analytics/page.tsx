'use client';

import { useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [reportPeriod, setReportPeriod] = useState('30d');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const metrics = [
    {
      title: 'Всего заявок',
      value: '2,456',
      change: '+8%',
      changeType: 'positive' as const,
      icon: <i className="ri-file-list-3-line"></i>
    },
    {
      title: 'Одобрено',
      value: '1,234',
      change: '+5%',
      changeType: 'positive' as const,
      icon: <i className="ri-check-line"></i>
    },
    {
      title: 'На рассмотрении',
      value: '234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: <i className="ri-eye-line"></i>
    },
    {
      title: 'Отказано',
      value: '156',
      change: '-3%',
      changeType: 'negative' as const,
      icon: <i className="ri-close-line"></i>
    }
  ];

  const applicationsData = [
    { month: 'Янв', applications: 240, approved: 180, rejected: 25, inReview: 20, draft: 15 },
    { month: 'Фев', applications: 280, approved: 210, rejected: 30, inReview: 25, draft: 15 },
    { month: 'Мар', applications: 320, approved: 250, rejected: 35, inReview: 20, draft: 15 },
    { month: 'Апр', applications: 290, approved: 220, rejected: 28, inReview: 22, draft: 20 },
    { month: 'Май', applications: 350, approved: 280, rejected: 40, inReview: 15, draft: 15 },
    { month: 'Июн', applications: 380, approved: 300, rejected: 45, inReview: 20, draft: 15 }
  ];

  const statusData = [
    { name: 'Одобрено', value: 1234, color: '#10b981' },
    { name: 'На рассмотрении', value: 234, color: '#f59e0b' },
    { name: 'Обработка платежа', value: 156, color: '#8b5cf6' },
    { name: 'Черновик', value: 89, color: '#6b7280' },
    { name: 'Отклонено', value: 156, color: '#ef4444' }
  ];

  const inspectionData = [
    { day: 'Пн', scheduled: 8, completed: 7, pending: 1 },
    { day: 'Вт', scheduled: 12, completed: 10, pending: 2 },
    { day: 'Ср', scheduled: 6, completed: 6, pending: 0 },
    { day: 'Чт', scheduled: 15, completed: 12, pending: 3 },
    { day: 'Пт', scheduled: 9, completed: 8, pending: 1 },
    { day: 'Сб', scheduled: 4, completed: 4, pending: 0 },
    { day: 'Вс', scheduled: 2, completed: 2, pending: 0 }
  ];

  const bulkProcessingData = [
    { operation: 'Одобрить', count: 45, success: 42, failed: 3 },
    { operation: 'Отклонить', count: 12, success: 12, failed: 0 },
    { operation: 'Назначить проверку', count: 28, success: 25, failed: 3 },
    { operation: 'Отправить на доработку', count: 18, success: 18, failed: 0 }
  ];

  const reportTypes = [
    { id: 'daily', name: 'Ежедневный отчет', icon: 'ri-file-chart-line', description: 'Детальная статистика за день' },
    { id: 'weekly', name: 'Еженедельный отчет', icon: 'ri-calendar-line', description: 'Сводка за неделю' },
    { id: 'monthly', name: 'Месячный отчет', icon: 'ri-bar-chart-line', description: 'Полный анализ за месяц' }
  ];

  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingReport(true);
    try {
      // Имитация генерации отчета
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Здесь будет логика генерации отчета
      console.log(`Генерация отчета: ${reportType} за период: ${reportPeriod}`);
      
      // Показать уведомление об успехе
      alert(`Отчет "${reportTypes.find(r => r.id === reportType)?.name}" успешно сгенерирован!`);
    } catch (error) {
      console.error('Ошибка генерации отчета:', error);
      alert('Произошла ошибка при генерации отчета');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Аналитика</h1>
          <p className="text-neutral-600 mt-1">Анализ эффективности обработки заявлений</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Последние 7 дней</option>
            <option value="30d">Последние 30 дней</option>
            <option value="90d">Последние 90 дней</option>
            <option value="1y">Последний год</option>
          </select>
        </div>
      </div>


      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Trend */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Динамика заявок</h3>
            <p className="text-neutral-600 mt-1">Количество заявок по месяцам</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} name="Заявки" />
              <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="Одобрено" />
              <Line type="monotone" dataKey="inReview" stroke="#f59e0b" strokeWidth={2} name="На рассмотрении" />
              <Line type="monotone" dataKey="draft" stroke="#6b7280" strokeWidth={2} name="Черновик" />
              <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} name="Отклонено" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Распределение статусов</h3>
            <p className="text-neutral-600 mt-1">Текущее состояние заявок</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Inspections */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Выездные проверки</h3>
            <p className="text-neutral-600 mt-1">Запланированные и выполненные проверки по дням недели</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inspectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scheduled" fill="#3b82f6" name="Запланировано" />
              <Bar dataKey="completed" fill="#10b981" name="Выполнено" />
              <Bar dataKey="pending" fill="#f59e0b" name="Ожидает" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bulk Processing */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Массовая обработка</h3>
            <p className="text-neutral-600 mt-1">Статистика массовых операций за период</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bulkProcessingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ operation, count }) => `${operation}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {bulkProcessingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* Export and Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Отчеты и экспорт</h3>
            <p className="text-neutral-600 mt-1">Генерация детальных отчетов</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-neutral-700">Период:</label>
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="px-3 py-1 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">7 дней</option>
                <option value="30d">30 дней</option>
                <option value="90d">90 дней</option>
                <option value="1y">1 год</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => handleGenerateReport(report.id)}
              disabled={isGeneratingReport}
              className={`p-4 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-solid hover:shadow-md ${
                isGeneratingReport 
                  ? 'opacity-50 cursor-not-allowed border-neutral-300' 
                  : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <i className={`${report.icon} text-2xl mb-2 ${
                  report.id === 'daily' ? 'text-blue-600' :
                  report.id === 'weekly' ? 'text-green-600' :
                  'text-orange-600'
                }`}></i>
                <h4 className="font-medium text-neutral-900 mb-1">{report.name}</h4>
                <p className="text-xs text-neutral-600">{report.description}</p>
                {isGeneratingReport && (
                  <div className="mt-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-neutral-900">Последние отчеты</h4>
              <p className="text-sm text-neutral-600">История сгенерированных отчетов</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Показать все
            </button>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between py-2 px-3 bg-white rounded border">
              <div className="flex items-center space-x-3">
                <i className="ri-file-chart-line text-blue-600"></i>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Ежедневный отчет</p>
                  <p className="text-xs text-neutral-600">Сегодня, 14:30</p>
                </div>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-800">
                <i className="ri-download-line mr-1"></i>
                Скачать
              </button>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white rounded border">
              <div className="flex items-center space-x-3">
                <i className="ri-calendar-line text-green-600"></i>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Еженедельный отчет</p>
                  <p className="text-xs text-neutral-600">Вчера, 16:45</p>
                </div>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-800">
                <i className="ri-download-line mr-1"></i>
                Скачать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
