// Сервис для управления выплатами УБК

import { 
  BenefitAssignment,
  PaymentRequisite,
  Calculation,
  Application,
  ApiResponse,
  PaymentStatus,
  PaginatedResponse,
  PaymentFilters
} from '../types-updated';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface PaymentRequest {
  applicationId: number;
  applicantName: string;
  amount: number;
  bankCode: string;
  bankAccount: string;
  scheduledDate?: string;
  notes?: string;
  createdBy: number;
}

export interface PaymentRecord {
  id: number;
  applicationId: number;
  benefitAssignmentId?: number;
  applicantName: string;
  pin: string;
  amount: number;
  status: PaymentStatus;
  bankCode: string;
  bankAccount: string;
  scheduledDate: string;
  processedDate?: string;
  notes?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceData {
  id: string;
  departmentName: string;
  purpose: string;
  companyAccount: string;
  valueDate: string;
  totalAmount: number;
  payments: Array<{
    number: number;
    fullName: string;
    accountNumber: string;
    amount: number;
  }>;
  headName: string;
  accountantName: string;
}

class PaymentService {
  /**
   * Назначение выплаты после одобрения заявки
   */
  async assignPaymentAfterApproval(
    applicationId: number,
    decision: 'approved' | 'rejected',
    userId: number,
    notes?: string
  ): Promise<ApiResponse<{ benefitAssignment?: BenefitAssignment; payment?: PaymentRecord }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/assign-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          userId,
          notes
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      return {
        success: true,
        data: result.data,
        message: decision === 'approved' 
          ? 'Выплата успешно назначена' 
          : 'Заявка отклонена'
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'Ошибка назначения выплаты' 
      };
    }
  }

  /**
   * Создание назначения пособия
   */
  async createBenefitAssignment(assignment: Omit<BenefitAssignment, 'id'>): Promise<ApiResponse<BenefitAssignment>> {
    try {
      const response = await fetch(`${API_BASE_URL}/benefit-assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignment)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания назначения пособия' };
    }
  }

  /**
   * Создание записи о выплате
   */
  async createPayment(payment: Omit<PaymentRequest, 'id'>): Promise<ApiResponse<PaymentRecord>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payment,
          status: 'PENDING'
        })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания выплаты' };
    }
  }

  /**
   * Получение списка выплат с фильтрацией
   */
  async getPayments(
    filters: PaymentFilters = {},
    page: number = 1,
    limit: number = 50
  ): Promise<ApiResponse<PaginatedResponse<PaymentRecord>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).map(([key, value]) => [
            key, 
            Array.isArray(value) ? value.join(',') : value?.toString() || ''
          ])
        )
      });

      const response = await fetch(`${API_BASE_URL}/payments?${params}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения выплат' };
    }
  }

  /**
   * Получение выплаты по ID
   */
  async getPayment(id: number): Promise<ApiResponse<PaymentRecord>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения выплаты' };
    }
  }

  /**
   * Обновление статуса выплаты
   */
  async updatePaymentStatus(
    id: number, 
    status: PaymentStatus, 
    notes?: string
  ): Promise<ApiResponse<PaymentRecord>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка обновления статуса выплаты' };
    }
  }

  /**
   * Массовое создание выплат
   */
  async createBulkPayments(
    applicationIds: number[],
    userId: number
  ): Promise<ApiResponse<{ created: number; failed: number; errors: string[] }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationIds, userId })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка массового создания выплат' };
    }
  }

  /**
   * Планирование выплат
   */
  async schedulePayments(
    paymentIds: number[],
    scheduledDate: string,
    userId: number
  ): Promise<ApiResponse<{ scheduled: number; failed: number }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIds, scheduledDate, userId })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка планирования выплат' };
    }
  }

  /**
   * Выполнение выплаты (отправка в банк)
   */
  async executePayment(id: number, userId: number): Promise<ApiResponse<PaymentRecord>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка выполнения выплаты' };
    }
  }

  /**
   * Повтор неудачной выплаты
   */
  async retryPayment(id: number, userId: number): Promise<ApiResponse<PaymentRecord>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка повтора выплаты' };
    }
  }

  /**
   * Отмена выплаты
   */
  async cancelPayment(id: number, reason: string, userId: number): Promise<ApiResponse<PaymentRecord>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, userId })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка отмены выплаты' };
    }
  }

  /**
   * Получение статистики по выплатам
   */
  async getPaymentStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    totalAmount: number;
    todayAmount: number;
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/stats`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения статистики выплат' };
    }
  }

  /**
   * Расчет суммы пособия
   */
  async calculateBenefitAmount(applicationId: number): Promise<ApiResponse<Calculation>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/calculate-benefit`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка расчета суммы пособия' };
    }
  }

  /**
   * Создание платежных реквизитов
   */
  async createPaymentRequisites(requisites: Omit<PaymentRequisite, 'id'>): Promise<ApiResponse<PaymentRequisite>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-requisites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requisites)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания платежных реквизитов' };
    }
  }

  /**
   * Получение платежных реквизитов по заявке
   */
  async getPaymentRequisites(applicationId: number): Promise<ApiResponse<PaymentRequisite[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/payment-requisites`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения платежных реквизитов' };
    }
  }

  /**
   * Генерация данных для накладной (Сводная ведомость №8)
   */
  async generateInvoiceData(
    paymentIds: number[],
    departmentName: string,
    companyAccount: string,
    valueDate: string,
    headName: string,
    accountantName: string
  ): Promise<ApiResponse<InvoiceData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/generate-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIds,
          departmentName,
          companyAccount,
          valueDate,
          headName,
          accountantName
        })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка генерации данных накладной' };
    }
  }

  /**
   * Экспорт накладной в PDF
   */
  async exportInvoiceToPDF(invoiceData: InvoiceData): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/export-invoice-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка экспорта накладной в PDF' };
    }
  }

  /**
   * Экспорт накладной в Excel
   */
  async exportInvoiceToExcel(invoiceData: InvoiceData): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/export-invoice-excel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка экспорта накладной в Excel' };
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
