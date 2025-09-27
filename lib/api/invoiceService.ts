// Сервис для управления накладными и их утверждением

import { ApiResponse, PaginatedResponse } from '../types-updated';
import { InvoiceData } from './paymentService';

export interface InvoiceSubmission {
  id: string;
  invoiceData: InvoiceData;
  submittedBy: number;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  region: string;
  departmentName: string;
  totalAmount: number;
  paymentCount: number;
  approvedBy?: number;
  approvedAt?: string;
  rejectedBy?: number;
  rejectedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceApprovalRequest {
  invoiceId: string;
  action: 'APPROVE' | 'REJECT';
  approvedBy: number;
  notes?: string;
  rejectionReason?: string;
}

export interface InvoiceFilters {
  status?: string[];
  region?: string[];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class InvoiceService {
  /**
   * Отправка накладной директору на утверждение
   */
  async submitInvoiceForApproval(
    invoiceData: InvoiceData,
    submittedBy: number,
    region: string,
    departmentName: string,
    notes?: string
  ): Promise<ApiResponse<InvoiceSubmission>> {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceData,
          submittedBy,
          region,
          departmentName,
          notes
        })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка отправки накладной на утверждение' };
    }
  }

  /**
   * Получение списка накладных для директора
   */
  async getInvoicesForDirector(
    filters: InvoiceFilters = {},
    page: number = 1,
    limit: number = 50
  ): Promise<ApiResponse<PaginatedResponse<InvoiceSubmission>>> {
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

      const response = await fetch(`${API_BASE_URL}/invoices/director?${params}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения накладных' };
    }
  }

  /**
   * Получение накладной по ID
   */
  async getInvoice(id: string): Promise<ApiResponse<InvoiceSubmission>> {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${id}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения накладной' };
    }
  }

  /**
   * Утверждение накладной директором
   */
  async approveInvoice(
    invoiceId: string,
    approvedBy: number,
    notes?: string
  ): Promise<ApiResponse<InvoiceSubmission>> {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvedBy, notes })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка утверждения накладной' };
    }
  }

  /**
   * Отклонение накладной директором
   */
  async rejectInvoice(
    invoiceId: string,
    rejectedBy: number,
    rejectionReason: string,
    notes?: string
  ): Promise<ApiResponse<InvoiceSubmission>> {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectedBy, rejectionReason, notes })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка отклонения накладной' };
    }
  }

  /**
   * Массовое утверждение накладных
   */
  async bulkApproveInvoices(
    invoiceIds: string[],
    approvedBy: number,
    notes?: string
  ): Promise<ApiResponse<{ approved: number; failed: number; errors: string[] }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/bulk/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceIds, approvedBy, notes })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка массового утверждения накладных' };
    }
  }

  /**
   * Массовое отклонение накладных
   */
  async bulkRejectInvoices(
    invoiceIds: string[],
    rejectedBy: number,
    rejectionReason: string,
    notes?: string
  ): Promise<ApiResponse<{ rejected: number; failed: number; errors: string[] }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/bulk/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceIds, rejectedBy, rejectionReason, notes })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка массового отклонения накладных' };
    }
  }

  /**
   * Получение статистики накладных
   */
  async getInvoiceStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalAmount: number;
    byRegion: Array<{
      region: string;
      count: number;
      amount: number;
    }>;
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/stats`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения статистики накладных' };
    }
  }

  /**
   * Получение накладных по региону
   */
  async getInvoicesByRegion(region: string): Promise<ApiResponse<InvoiceSubmission[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/region/${region}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения накладных по региону' };
    }
  }

  /**
   * Экспорт накладных в Excel
   */
  async exportInvoices(
    filters: InvoiceFilters,
    format: 'excel' | 'csv' = 'excel'
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      const params = new URLSearchParams({
        format,
        ...Object.fromEntries(
          Object.entries(filters).map(([key, value]) => [
            key, 
            Array.isArray(value) ? value.join(',') : value?.toString() || ''
          ])
        )
      });

      const response = await fetch(`${API_BASE_URL}/invoices/export?${params}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка экспорта накладных' };
    }
  }

  /**
   * Отмена отправки накладной (только для отправителя)
   */
  async cancelInvoiceSubmission(
    invoiceId: string,
    cancelledBy: number,
    reason: string
  ): Promise<ApiResponse<InvoiceSubmission>> {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancelledBy, reason })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка отмены отправки накладной' };
    }
  }
}

export const invoiceService = new InvoiceService();
export default invoiceService;
