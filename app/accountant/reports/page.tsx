'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import MetricCard from '@/components/ui/MetricCard';
import ReportBulkActions from '@/components/ui/ReportBulkActions';
import { reportService } from '@/lib/api/reportService';
import { Report, ReportType } from '@/lib/types';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [selectedReports, setSelectedReports] = useState<Report[]>([]);

  useEffect(() => {
    loadReports();
    loadStats();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await reportService.getReports({}, 1, 20);
      if (response.success && response.data) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке отчетов:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await reportService.getReportStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error);
    }
  };

  const handleGenerateReport = async (type: ReportType) => {
    try {
      setGenerating(type);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const response = await reportService.generateReport(
        type,
        { start: startOfMonth, end: endOfMonth },
        'Айжан Кыдырова'
      );

      if (response.success && response.data) {
        setReports(prev => [response.data!, ...prev]);
        loadStats();
      }
    } catch (error) {
      console.error('Ошибка при генерации отчета:', error);
    } finally {
      setGenerating(null);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const response = await reportService.downloadReport(reportId);
      if (response.success && response.data) {
        // В реальном приложении здесь был бы скачивание файла
        console.log('Отчет скачан:', reportId);
      }
    } catch (error) {
      console.error('Ошибка при скачивании отчета:', error);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const response = await reportService.deleteReport(reportId);
      if (response.success) {
        setReports(prev => prev.filter(report => report.id !== reportId));
        loadStats();
      }
    } catch (error) {
      console.error('Ошибка при удалении отчета:', error);
    }
  };

  // Функции для массовых действий
  const handleSelectReport = (report: Report, checked: boolean) => {
    if (checked) {
      setSelectedReports([...selectedReports, report]);
    } else {
      setSelectedReports(selectedReports.filter(r => r.id !== report.id));
    }
  };

  const handleSelectAll = () => {
    setSelectedReports([...reports]);
  };

  const handleDeselectAll = () => {
    setSelectedReports([]);
  };

  const handleBulkAction = (action: string, reportIds: string[]) => {
    switch (action) {
      case 'download':
        console.log('Массовое скачивание отчетов:', reportIds);
        alert(`Скачивание ${reportIds.length} отчетов...`);
        break;
      case 'export':
        console.log('Экспорт отчетов:', reportIds);
        alert(`Экспорт ${reportIds.length} отчетов...`);
        break;
      case 'archive':
        console.log('Архивирование отчетов:', reportIds);
        alert(`Архивирование ${reportIds.length} отчетов...`);
        break;
      case 'delete':
        console.log('Удаление отчетов:', reportIds);
        alert(`Удаление ${reportIds.length} отчетов...`);
        break;
    }
    
    // Очищаем выбор после действия
    setSelectedReports([]);
  };


  const metrics = [
    {
      title: 'Всего выплат',
      value: '2,847',
      change: '+12%',
      changeType: 'positive' as const,
      icon: <i className="ri-money-dollar-circle-line text-4xl text-green-600"></i>
    },
    {
      title: 'Накладных создано',
      value: '156',
      change: '+8%',
      changeType: 'positive' as const,
      icon: <i className="ri-file-list-3-line text-4xl text-blue-600"></i>
    },
    {
      title: 'Дубликатов найдено',
      value: '23',
      change: '-15%',
      changeType: 'negative' as const,
      icon: <i className="ri-alert-line text-4xl text-red-600"></i>
    },
  ];

  const columns = [
    {
      key: 'select',
      label: 'Выбор',
      render: (value: any, row: Report) => (
        <input
          type="checkbox"
          checked={selectedReports.some(r => r.id === row.id)}
          onChange={(e) => handleSelectReport(row, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
        />
      )
    },
    {
      key: 'title',
      label: 'Название отчета',
      render: (value: string) => (
        <span className="font-medium text-neutral-900">{value}</span>
      )
    },
    {
      key: 'type',
      label: 'Тип',
      render: (value: string) => {
        const typeMap: { [key: string]: string } = {
          'applications_summary': 'Сводка заявлений',
          'financial_report': 'Финансовый отчет',
          'risk_analysis': 'Анализ рисков',
          'performance_report': 'Отчет производительности',
          'audit_report': 'Аудит отчет',
          'payments_summary': 'Сводка платежей'
        };
        return (
          <span className="text-sm text-neutral-600">
            {typeMap[value] || value}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value: string) => {
        const statusMap: { [key: string]: { status: any; text: string } } = {
          'generating': { status: 'warning', text: 'Генерируется' },
          'completed': { status: 'success', text: 'Готов' },
          'failed': { status: 'error', text: 'Ошибка' }
        };
        const statusInfo = statusMap[value] || { status: 'neutral', text: value };
        return (
          <StatusBadge status={statusInfo.status}>
            {statusInfo.text}
          </StatusBadge>
        );
      }
    },
    {
      key: 'generatedAt',
      label: 'Дата создания',
      render: (value: Date) => (
        <span className="text-sm text-neutral-600">
          {value.toLocaleDateString('ru-RU')}
        </span>
      )
    },
    {
      key: 'generatedBy',
      label: 'Создал',
      render: (value: string) => (
        <span className="text-sm text-neutral-600">{value}</span>
      )
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (value: any, row: Report) => (
        <div className="flex space-x-2">
          {row.status === 'completed' && (
            <button 
              onClick={() => handleDownloadReport(row.id)}
              className="btn-primary text-sm px-3 py-1"
            >
              <i className="ri-download-line mr-1"></i>
              Скачать
            </button>
          )}
          <button 
            onClick={() => handleDeleteReport(row.id)}
            className="btn-danger text-sm px-3 py-1"
          >
            <i className="ri-delete-bin-line mr-1"></i>
            Удалить
          </button>
        </div>
      )
    }
  ];

  const reportTemplates = [
    {
      type: 'payments_summary' as ReportType,
      title: 'Отчет по выплатам',
      description: 'Детальная сводка всех выплат с анализом дубликатов',
      icon: <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
    },
    {
      type: 'invoices_report' as ReportType,
      title: 'Отчет по накладным',
      description: 'Статистика создания и утверждения накладных',
      icon: <i className="ri-file-list-3-line text-2xl text-blue-600"></i>
    },
    {
      type: 'duplicates_analysis' as ReportType,
      title: 'Анализ дубликатов',
      description: 'Отчет по найденным и разрешенным дубликатам',
      icon: <i className="ri-alert-line text-2xl text-red-600"></i>
    },
    {
      type: 'financial_summary' as ReportType,
      title: 'Финансовая сводка',
      description: 'Общий финансовый отчет по всем операциям',
      icon: <i className="ri-bar-chart-line text-2xl text-purple-600"></i>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Отчеты</h1>
          <p className="text-neutral-600 mt-1">Финансовые отчеты, аналитика выплат и накладных</p>
        </div>
        <button 
          onClick={loadReports}
          className="btn-secondary"
        >
          <i className="ri-refresh-line mr-2"></i>
          Обновить
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Report Templates */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Создать отчет</h3>
          <p className="text-neutral-600 mt-1">Выберите тип отчета для анализа финансовых операций</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTemplates.map((template) => (
            <div 
              key={template.type}
              className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => handleGenerateReport(template.type)}
            >
              <div className="flex items-center space-x-3 mb-3">
                {template.icon}
                <h4 className="font-semibold text-neutral-900">{template.title}</h4>
              </div>
              <p className="text-sm text-neutral-600 mb-4">{template.description}</p>
              <button 
                className={`w-full btn-primary ${generating === template.type ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={generating === template.type}
              >
                {generating === template.type ? (
                  <>
                    <i className="ri-loader-line animate-spin mr-2"></i>
                    Генерируется...
                  </>
                ) : (
                  <>
                    <i className="ri-add-line mr-2"></i>
                    Создать отчет
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">История отчетов</h3>
          <p className="text-neutral-600 mt-1">Все созданные финансовые отчеты и аналитика</p>
        </div>
        
        {/* Mass Actions */}
        <ReportBulkActions
          selectedReports={selectedReports}
          onBulkAction={handleBulkAction}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          totalReports={reports.length}
          isAllSelected={selectedReports.length === reports.length && reports.length > 0}
        />
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <DataTable
            data={reports}
            columns={columns}
            searchable={true}
            sortable={true}
            emptyMessage="Нет созданных отчетов"
          />
        )}
      </div>


    </div>
  );
}