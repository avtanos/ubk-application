import { Application, ApplicationFilters, ApiResponse, PaginatedResponse } from '../types';

// Mock данные для демонстрации
const mockApplications: Application[] = [
  {
    id: 'APP-2025-001',
    applicantName: 'Айжан Абдуллаева',
    applicantId: '12345678901234',
    phone: '+996 555 123 456',
    email: 'aijan.abdullaeva@email.com',
    address: 'г. Бишкек, ул. Чуй, д. 123, кв. 45',
    familyMembers: [
      {
        id: '1',
        name: 'Айжан Абдуллаева',
        relationship: 'spouse',
        birthDate: new Date('1985-03-15'),
        isDisabled: false,
        isStudent: false,
        isWorking: true,
        income: 25000
      },
      {
        id: '2',
        name: 'Айдар Абдуллаев',
        relationship: 'child',
        birthDate: new Date('2010-07-20'),
        isDisabled: false,
        isStudent: true,
        isWorking: false
      }
    ],
    income: [
      {
        id: '1',
        type: 'salary',
        amount: 25000,
        source: 'ООО "Торговый дом"',
        period: '2025-01',
        isRegular: true,
        documents: ['doc1', 'doc2']
      }
    ],
    documents: [
      {
        id: 'doc1',
        name: 'Справка о доходах',
        type: 'income_certificate',
        url: '/documents/income_cert_001.pdf',
        uploadedAt: new Date('2025-01-15'),
        uploadedBy: 'Айжан Абдуллаева',
        status: 'verified'
      },
      {
        id: 'doc2',
        name: 'Паспорт',
        type: 'passport',
        url: '/documents/passport_001.pdf',
        uploadedAt: new Date('2025-01-15'),
        uploadedBy: 'Айжан Абдуллаева',
        status: 'verified'
      }
    ],
    status: 'under_review',
    priority: 'medium',
    riskScore: 25,
    submittedAt: new Date('2025-01-15'),
    reviewedAt: new Date('2025-01-16'),
    reviewedBy: 'Нурбек Жумабеков',
    inspectionRequired: false,
    notes: 'Заявление требует дополнительной проверки доходов'
  },
  {
    id: 'APP-2025-002',
    applicantName: 'Гульнара Осмонова',
    applicantId: '23456789012345',
    phone: '+996 555 234 567',
    email: 'gulnara.osmonova@email.com',
    address: 'г. Ош, ул. Ленина, д. 67, кв. 12',
    familyMembers: [
      {
        id: '1',
        name: 'Гульнара Осмонова',
        relationship: 'spouse',
        birthDate: new Date('1988-11-10'),
        isDisabled: false,
        isStudent: false,
        isWorking: false
      },
      {
        id: '2',
        name: 'Айгерим Осмонова',
        relationship: 'child',
        birthDate: new Date('2015-04-12'),
        isDisabled: false,
        isStudent: true,
        isWorking: false
      },
      {
        id: '3',
        name: 'Айдар Осмонов',
        relationship: 'child',
        birthDate: new Date('2018-09-05'),
        isDisabled: false,
        isStudent: false,
        isWorking: false
      }
    ],
    income: [
      {
        id: '1',
        type: 'social_benefits',
        amount: 8000,
        source: 'Социальные выплаты',
        period: '2025-01',
        isRegular: true,
        documents: ['doc3']
      }
    ],
    documents: [
      {
        id: 'doc3',
        name: 'Справка о социальных выплатах',
        type: 'social_benefits',
        url: '/documents/social_benefits_002.pdf',
        uploadedAt: new Date('2025-01-14'),
        uploadedBy: 'Гульнара Осмонова',
        status: 'verified'
      }
    ],
    status: 'approved',
    priority: 'high',
    riskScore: 5,
    submittedAt: new Date('2025-01-14'),
    reviewedAt: new Date('2025-01-15'),
    reviewedBy: 'Нурбек Жумабеков',
    approvedAt: new Date('2025-01-16'),
    approvedBy: 'Нурбек Жумабеков',
    paymentAmount: 12000,
    paymentStatus: 'completed',
    inspectionRequired: false
  },
  {
    id: 'APP-2025-003',
    applicantName: 'Жамиля Турдубекова',
    applicantId: '34567890123456',
    phone: '+996 555 345 678',
    email: 'jamila.turdubekova@email.com',
    address: 'г. Джалал-Абад, ул. Советская, д. 89, кв. 23',
    familyMembers: [
      {
        id: '1',
        name: 'Жамиля Турдубекова',
        relationship: 'spouse',
        birthDate: new Date('1990-06-25'),
        isDisabled: false,
        isStudent: false,
        isWorking: true,
        income: 18000
      },
      {
        id: '2',
        name: 'Айбек Турдубеков',
        relationship: 'child',
        birthDate: new Date('2012-12-03'),
        isDisabled: true,
        isStudent: true,
        isWorking: false
      }
    ],
    income: [
      {
        id: '1',
        type: 'salary',
        amount: 18000,
        source: 'ИП "Турдубекова"',
        period: '2025-01',
        isRegular: true,
        documents: ['doc4']
      }
    ],
    documents: [
      {
        id: 'doc4',
        name: 'Справка о доходах ИП',
        type: 'income_certificate',
        url: '/documents/ip_income_003.pdf',
        uploadedAt: new Date('2025-01-13'),
        uploadedBy: 'Жамиля Турдубекова',
        status: 'verified'
      },
      {
        id: 'doc5',
        name: 'Медицинская справка',
        type: 'medical_certificate',
        url: '/documents/medical_003.pdf',
        uploadedAt: new Date('2025-01-13'),
        uploadedBy: 'Жамиля Турдубекова',
        status: 'verified'
      }
    ],
    status: 'approved',
    priority: 'high',
    riskScore: 10,
    submittedAt: new Date('2025-01-13'),
    reviewedAt: new Date('2025-01-14'),
    reviewedBy: 'Нурбек Жумабеков',
    approvedAt: new Date('2025-01-15'),
    approvedBy: 'Нурбек Жумабеков',
    paymentAmount: 15000,
    paymentStatus: 'processing',
    inspectionRequired: false
  }
];

class ApplicationService {
  private applications: Application[] = mockApplications;

  // Получить все заявления с фильтрацией и пагинацией
  async getApplications(
    filters: ApplicationFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Application>>> {
    try {
      let filteredApplications = [...this.applications];

      // Применяем фильтры
      if (filters.status && filters.status.length > 0) {
        filteredApplications = filteredApplications.filter(app => 
          filters.status!.includes(app.status)
        );
      }

      if (filters.priority && filters.priority.length > 0) {
        filteredApplications = filteredApplications.filter(app => 
          filters.priority!.includes(app.priority)
        );
      }

      if (filters.dateFrom) {
        filteredApplications = filteredApplications.filter(app => 
          app.submittedAt >= filters.dateFrom!
        );
      }

      if (filters.dateTo) {
        filteredApplications = filteredApplications.filter(app => 
          app.submittedAt <= filters.dateTo!
        );
      }

      if (filters.riskScoreMin !== undefined) {
        filteredApplications = filteredApplications.filter(app => 
          app.riskScore >= filters.riskScoreMin!
        );
      }

      if (filters.riskScoreMax !== undefined) {
        filteredApplications = filteredApplications.filter(app => 
          app.riskScore <= filters.riskScoreMax!
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredApplications = filteredApplications.filter(app => 
          app.applicantName.toLowerCase().includes(searchLower) ||
          app.applicantId.includes(searchLower) ||
          app.id.toLowerCase().includes(searchLower)
        );
      }

      // Пагинация
      const total = filteredApplications.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredApplications.slice(startIndex, endIndex);

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
        error: 'Ошибка при получении заявлений'
      };
    }
  }

  // Получить заявление по ID
  async getApplicationById(id: string): Promise<ApiResponse<Application>> {
    try {
      const application = this.applications.find(app => app.id === id);
      
      if (!application) {
        return {
          success: false,
          error: 'Заявление не найдено'
        };
      }

      return {
        success: true,
        data: application
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при получении заявления'
      };
    }
  }

  // Обновить статус заявления
  async updateApplicationStatus(
    id: string, 
    status: Application['status'], 
    userId: string,
    notes?: string
  ): Promise<ApiResponse<Application>> {
    try {
      const applicationIndex = this.applications.findIndex(app => app.id === id);
      
      if (applicationIndex === -1) {
        return {
          success: false,
          error: 'Заявление не найдено'
        };
      }

      const application = this.applications[applicationIndex];
      const now = new Date();

      // Обновляем статус и связанные поля
      application.status = status;
      application.notes = notes;

      switch (status) {
        case 'under_review':
          application.reviewedAt = now;
          application.reviewedBy = userId;
          break;
        case 'approved':
          application.approvedAt = now;
          application.approvedBy = userId;
          application.paymentAmount = this.calculatePaymentAmount(application);
          break;
        case 'rejected':
          application.rejectedAt = now;
          application.rejectedBy = userId;
          break;
      }

      this.applications[applicationIndex] = application;

      return {
        success: true,
        data: application,
        message: 'Статус заявления обновлен'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при обновлении статуса заявления'
      };
    }
  }

  // Создать новое заявление
  async createApplication(applicationData: Partial<Application>): Promise<ApiResponse<Application>> {
    try {
      const newApplication: Application = {
        id: `APP-2025-${String(this.applications.length + 1).padStart(3, '0')}`,
        applicantName: applicationData.applicantName || '',
        applicantId: applicationData.applicantId || '',
        phone: applicationData.phone || '',
        email: applicationData.email,
        address: applicationData.address || '',
        familyMembers: applicationData.familyMembers || [],
        income: applicationData.income || [],
        documents: applicationData.documents || [],
        status: 'submitted',
        priority: 'medium',
        riskScore: this.calculateRiskScore(applicationData),
        submittedAt: new Date(),
        inspectionRequired: this.requiresInspection(applicationData),
        ...applicationData
      } as Application;

      this.applications.push(newApplication);

      return {
        success: true,
        data: newApplication,
        message: 'Заявление успешно создано'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при создании заявления'
      };
    }
  }

  // Получить статистику заявлений
  async getApplicationStats(): Promise<ApiResponse<any>> {
    try {
      const stats = {
        total: this.applications.length,
        byStatus: {
          draft: this.applications.filter(app => app.status === 'draft').length,
          submitted: this.applications.filter(app => app.status === 'submitted').length,
          under_review: this.applications.filter(app => app.status === 'under_review').length,
          approved: this.applications.filter(app => app.status === 'approved').length,
          rejected: this.applications.filter(app => app.status === 'rejected').length,
          paid: this.applications.filter(app => app.status === 'paid').length
        },
        byPriority: {
          low: this.applications.filter(app => app.priority === 'low').length,
          medium: this.applications.filter(app => app.priority === 'medium').length,
          high: this.applications.filter(app => app.priority === 'high').length,
          urgent: this.applications.filter(app => app.priority === 'urgent').length
        },
        averageRiskScore: this.applications.reduce((sum, app) => sum + app.riskScore, 0) / this.applications.length,
        totalPaymentAmount: this.applications
          .filter(app => app.paymentAmount)
          .reduce((sum, app) => sum + (app.paymentAmount || 0), 0)
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка при получении статистики'
      };
    }
  }

  // Приватные методы
  private calculatePaymentAmount(application: Application): number {
    // Базовая сумма пособия
    let baseAmount = 8000;
    
    // Доплата за детей
    const childrenCount = application.familyMembers.filter(member => 
      member.relationship === 'child' && member.birthDate > new Date(Date.now() - 16 * 365 * 24 * 60 * 60 * 1000)
    ).length;
    
    baseAmount += childrenCount * 2000;
    
    // Доплата за инвалидность
    const disabledMembers = application.familyMembers.filter(member => member.isDisabled).length;
    baseAmount += disabledMembers * 3000;
    
    return baseAmount;
  }

  private calculateRiskScore(applicationData: Partial<Application>): number {
    let riskScore = 0;
    
    // Проверяем доходы
    const totalIncome = applicationData.income?.reduce((sum, income) => sum + income.amount, 0) || 0;
    if (totalIncome > 50000) riskScore += 30;
    else if (totalIncome > 30000) riskScore += 15;
    
    // Проверяем количество детей
    const childrenCount = applicationData.familyMembers?.filter(member => 
      member.relationship === 'child'
    ).length || 0;
    if (childrenCount > 5) riskScore += 20;
    else if (childrenCount > 3) riskScore += 10;
    
    // Проверяем документы
    const documentCount = applicationData.documents?.length || 0;
    if (documentCount < 3) riskScore += 25;
    
    return Math.min(riskScore, 100);
  }

  private requiresInspection(applicationData: Partial<Application>): boolean {
    const riskScore = this.calculateRiskScore(applicationData);
    return riskScore > 50;
  }
}

export const applicationService = new ApplicationService();
