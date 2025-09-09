import { Report, ReportType, ApiResponse, PaginatedResponse } from '../types';

// Mock данные для отчетов
const mockReports: Report[] = [
  {
    id: 'report-001',
    title: 'Отчет по заявлениям за январь 2025',
    type: 'applications_summary',
    period: {
      start: new Date('2025-01-01'),
      end: new Date('2025-01-31')
    },
    generatedAt: new Date('2025-01-31'),
    generatedBy: 'Нурбек Жумабеков',
    status: 'completed',
    downloadUrl: '/reports/applications_summary_jan_2025.pdf',
    data: {
      totalApplications: 150,
      approved: 120,
      rejected: 20,
      pending: 10,
      totalAmount: 1200000,
      averageProcessingTime: 3.5
    }
  },
  {
    id: 'report-002',
    title: 'Финансовый отчет за январь 2025',
    type: 'financial_report',
    period: {
      start: new Date('2025-01-01'),
      end: new Date('2025-01-31')
    },
    generatedAt: new Date('2025-01-31'),
    generatedBy: 'Айжан Кыдырова',
    status: 'completed',
    downloadUrl: '/reports/financial_report_jan_2025.pdf',
    data: {
      totalPayments: 1200000,
      completedPayments: 1150000,
      pendingPayments: 50000,
      averagePaymentAmount: 10000,
      paymentMethods: {
        bank_transfer: 1000000,
        cash: 150000
      }
    }
  },
  {
    id: 'report-003',
    title: 'Анализ рисков за январь 2025',
    type: 'risk_analysis',
    period: {
      start: new Date('2025-01-01'),
      end: new Date('2025-01-31')
    },
    generatedAt: new Date('2025-01-31'),
    generatedBy: 'Алмаз Джумабеков',
    status: 'completed',
    downloadUrl: '/reports/risk_analysis_jan_2025.pdf',
    data: {
      highRiskApplications: 15,
      mediumRiskApplications: 45,
      lowRiskApplications: 90,
      averageRiskScore: 25.5,
      riskFactors: {
        highIncome: 8,
        manyChildren: 12,
        missingDocuments: 5
      }
    }
  },
  {
    id: 'report-004',
    title: 'Отчет по производительности за январь 2025',
    type: 'performance_report',
    period: {
      start: new Date('2025-01-01'),
      end: new Date('2025-01-31')
    },
    generatedAt: new Date('2025-01-31'),
    generatedBy: 'Нурбек Жумабеков',
    status: 'completed',
    downloadUrl: '/reports/performance_report_jan_2025.pdf',
    data: {
      applicationsProcessed: 150,
      averageProcessingTime: 3.5,
      specialistPerformance: {
        'Нурбек Жумабеков': 120,
        'Айжан Кыдырова': 30
      },
      inspectionRate: 0.15
    }
  }
];

interface ReportFilters {
  type?: ReportType[];
  generatedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: string[];
  search?: string;
}

class ReportService {
  private reports: Report[] = mockReports;

  // Получить все отчеты с фильтрацией
  async getReports(
    filters: ReportFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Report>>> {
    try {
      let filteredReports = [...this.reports];

      // Применяем фильтры
      if (filters.type && filters.type.length > 0) {
        filteredReports = filteredReports.filter(report => 
          filters.type!.includes(report.type)
        );
      }

      if (filters.generatedBy) {
        filteredReports = filteredReports.filter(report => 
          report.generatedBy.toLowerCase().includes(filters.generatedBy!.toLowerCase())
        );
      }

      if (filters.dateFrom) {
        filteredReports = filteredReports.filter(report => 
          report.generatedAt >= filters.dateFrom!
        );
      }

      if (filters.dateTo) {
        filteredReports = filteredReports.filter(report => 
          report.generatedAt <= filters.dateTo!
        );
      }

      if (filters.status && filters.status.length > 0) {
        filteredReports = filteredReports.filter(report => 
          filters.status!.includes(report.status)
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredReports = filteredReports.filter(report => 
          report.title.toLowerCase().includes(searchLower) ||
          report.generatedBy.toLowerCase().includes(searchLower)
        );
      }

      // Сортируем по дате создания (новые сначала)
      filteredReports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());

      // Пагинация
      const total = filteredReports.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredReports.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          data: paginatedData,
          total,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при получении отчетов'
      };
    }
  }

  // Получить отчет по ID
  async getReportById(id: string): Promise<ApiResponse<Report>> {
    try {
      const report = this.reports.find(report => report.id === id);
      
      if (!report) {
        return {
          success: false,
          error: 'Отчет не найден'
        };
      }

      return {
        success: true,
        data: report
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при получении отчета'
      };
    }
  }

  // Создать новый отчет
  async generateReport(
    type: ReportType,
    period: { start: Date; end: Date },
    generatedBy: string,
    title?: string
  ): Promise<ApiResponse<Report>> {
    try {
      const reportId = `report-${Date.now()}`;
      const reportTitle = title || this.getDefaultReportTitle(type, period);

      const newReport: Report = {
        id: reportId,
        title: reportTitle,
        type,
        period,
        generatedAt: new Date(),
        generatedBy,
        status: 'generating',
        data: {}
      };

      this.reports.unshift(newReport); // Добавляем в начало списка

      // Имитируем генерацию отчета
      setTimeout(() => {
        this.completeReportGeneration(reportId, type);
      }, 2000);

      return {
        success: true,
        data: newReport,
        message: 'Отчет поставлен в очередь на генерацию'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при создании отчета'
      };
    }
  }

  // Скачать отчет
  async downloadReport(id: string): Promise<ApiResponse<Blob>> {
    try {
      const report = this.reports.find(report => report.id === id);
      
      if (!report) {
        return {
          success: false,
          error: 'Отчет не найден'
        };
      }

      if (report.status !== 'completed') {
        return {
          success: false,
          error: 'Отчет еще не готов к скачиванию'
        };
      }

      // В реальном приложении здесь был бы запрос к серверу для получения файла
      // Пока возвращаем пустой Blob как пример
      const blob = new Blob(['Mock report content'], { type: 'application/pdf' });

      return {
        success: true,
        data: blob
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при скачивании отчета'
      };
    }
  }

  // Удалить отчет
  async deleteReport(id: string): Promise<ApiResponse<boolean>> {
    try {
      const reportIndex = this.reports.findIndex(report => report.id === id);
      
      if (reportIndex === -1) {
        return {
          success: false,
          error: 'Отчет не найден'
        };
      }

      this.reports.splice(reportIndex, 1);

      return {
        success: true,
        data: true,
        message: 'Отчет удален'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при удалении отчета'
      };
    }
  }

  // Получить статистику отчетов
  async getReportStats(): Promise<ApiResponse<any>> {
    try {
      const stats = {
        total: this.reports.length,
        byType: {
          applications_summary: this.reports.filter(report => report.type === 'applications_summary').length,
          financial_report: this.reports.filter(report => report.type === 'financial_report').length,
          risk_analysis: this.reports.filter(report => report.type === 'risk_analysis').length,
          performance_report: this.reports.filter(report => report.type === 'performance_report').length,
          audit_report: this.reports.filter(report => report.type === 'audit_report').length
        },
        byStatus: {
          generating: this.reports.filter(report => report.status === 'generating').length,
          completed: this.reports.filter(report => report.status === 'completed').length,
          failed: this.reports.filter(report => report.status === 'failed').length
        },
        generatedThisMonth: this.reports.filter(report => {
          const now = new Date();
          const reportDate = report.generatedAt;
          return reportDate.getMonth() === now.getMonth() && 
                 reportDate.getFullYear() === now.getFullYear();
        }).length,
        mostActiveUser: this.getMostActiveUser()
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при получении статистики отчетов'
      };
    }
  }

  // Получить шаблоны отчетов
  async getReportTemplates(): Promise<ApiResponse<any[]>> {
    try {
      const templates = [
        {
          id: 'template-1',
          name: 'Еженедельный отчет по заявлениям',
          type: 'applications_summary',
          description: 'Сводка по заявлениям за неделю',
          parameters: ['dateFrom', 'dateTo']
        },
        {
          id: 'template-2',
          name: 'Месячный финансовый отчет',
          type: 'financial_report',
          description: 'Финансовый отчет за месяц',
          parameters: ['month', 'year']
        },
        {
          id: 'template-3',
          name: 'Анализ рисков',
          type: 'risk_analysis',
          description: 'Анализ рисков по заявлениям',
          parameters: ['dateFrom', 'dateTo', 'riskThreshold']
        },
        {
          id: 'template-4',
          name: 'Отчет по производительности',
          type: 'performance_report',
          description: 'Отчет по производительности специалистов',
          parameters: ['dateFrom', 'dateTo', 'specialistId']
        }
      ];

      return {
        success: true,
        data: templates
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при получении шаблонов отчетов'
      };
    }
  }

  // Приватные методы
  private getDefaultReportTitle(type: ReportType, period: { start: Date; end: Date }): string {
    const typeNames = {
      applications_summary: 'Отчет по заявлениям',
      financial_report: 'Финансовый отчет',
      risk_analysis: 'Анализ рисков',
      performance_report: 'Отчет по производительности',
      audit_report: 'Аудит отчет',
      payments_summary: 'Отчет по выплатам'
    };

    const startDate = period.start.toLocaleDateString('ru-RU');
    const endDate = period.end.toLocaleDateString('ru-RU');
    
    return `${typeNames[type]} с ${startDate} по ${endDate}`;
  }

  private completeReportGeneration(reportId: string, type: ReportType): void {
    const reportIndex = this.reports.findIndex(report => report.id === reportId);
    
    if (reportIndex !== -1) {
      const report = this.reports[reportIndex];
      report.status = 'completed';
      report.downloadUrl = `/reports/${type}_${reportId}.pdf`;
      
      // Генерируем mock данные в зависимости от типа отчета
      report.data = this.generateMockReportData(type);
      
      this.reports[reportIndex] = report;
    }
  }

  private generateMockReportData(type: ReportType): any {
    switch (type) {
      case 'applications_summary':
        return {
          totalApplications: Math.floor(Math.random() * 200) + 100,
          approved: Math.floor(Math.random() * 150) + 80,
          rejected: Math.floor(Math.random() * 30) + 10,
          pending: Math.floor(Math.random() * 20) + 5,
          totalAmount: Math.floor(Math.random() * 2000000) + 1000000,
          averageProcessingTime: Math.random() * 5 + 2
        };
      
      case 'financial_report':
        return {
          totalPayments: Math.floor(Math.random() * 2000000) + 1000000,
          completedPayments: Math.floor(Math.random() * 1800000) + 900000,
          pendingPayments: Math.floor(Math.random() * 200000) + 100000,
          averagePaymentAmount: Math.floor(Math.random() * 5000) + 8000,
          paymentMethods: {
            bank_transfer: Math.floor(Math.random() * 1500000) + 800000,
            cash: Math.floor(Math.random() * 300000) + 100000
          }
        };
      
      case 'risk_analysis':
        return {
          highRiskApplications: Math.floor(Math.random() * 20) + 10,
          mediumRiskApplications: Math.floor(Math.random() * 50) + 30,
          lowRiskApplications: Math.floor(Math.random() * 100) + 60,
          averageRiskScore: Math.random() * 30 + 20,
          riskFactors: {
            highIncome: Math.floor(Math.random() * 10) + 5,
            manyChildren: Math.floor(Math.random() * 15) + 8,
            missingDocuments: Math.floor(Math.random() * 8) + 3
          }
        };
      
      case 'performance_report':
        return {
          applicationsProcessed: Math.floor(Math.random() * 200) + 100,
          averageProcessingTime: Math.random() * 5 + 2,
          specialistPerformance: {
            'Нурбек Жумабеков': Math.floor(Math.random() * 150) + 100,
            'Айжан Кыдырова': Math.floor(Math.random() * 50) + 20
          },
          inspectionRate: Math.random() * 0.3 + 0.1
        };
      
      default:
        return {};
    }
  }

  private getMostActiveUser(): string {
    const userCounts: { [key: string]: number } = {};
    
    this.reports.forEach(report => {
      userCounts[report.generatedBy] = (userCounts[report.generatedBy] || 0) + 1;
    });
    
    return Object.keys(userCounts).reduce((a, b) => 
      userCounts[a] > userCounts[b] ? a : b
    );
  }
}

export const reportService = new ReportService();
