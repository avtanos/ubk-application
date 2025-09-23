// InspectionService для работы с выездными проверками

import { 
  Inspection, 
  InspectionReport, 
  InspectionFamilyMember,
  InspectionStatus,
  InspectionType,
  Priority,
  ApiResponse, 
  PaginatedResponse,
  InspectionFilters
} from '../types';

// Базовый URL API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Типы запросов
export interface CreateInspectionRequest {
  applicationId: number;
  type: InspectionType;
  priority: Priority;
  scheduledDate: string;
  scheduledTime: string;
  inspectorId: number;
  inspectorName: string;
  address: string;
  notes?: string;
}

export interface UpdateInspectionRequest {
  status?: InspectionStatus;
  scheduledDate?: string;
  scheduledTime?: string;
  inspectorId?: number;
  inspectorName?: string;
  address?: string;
  notes?: string;
}

export interface CreateInspectionReportRequest {
  inspectionId: number;
  applicationId: number;
  reportDate: string;
  visitDate: string;
  visitTime: string;
  livingAddress: string;
  registrationAddress: string;
  regionalStatus: 'HIGH_MOUNTAIN' | 'REMOTE' | 'BORDER' | 'OTHER';
  regionalStatusOther?: string;
  applicantFullName: string;
  applicantPin: string;
  applicantBirthDate: string;
  identityDocument: {
    series: string;
    number: string;
    issuedBy: string;
  };
  contactPhone: string;
  actualFamilyMembers: Omit<InspectionFamilyMember, 'id'>[];
  housingConditions: {
    type: 'HOUSE' | 'APARTMENT' | 'RENTAL' | 'DORMITORY' | 'OTHER';
    typeOther?: string;
    ownership: 'OWNED' | 'RENTED' | 'TEMPORARY';
    area: number;
    roomsCount: number;
    utilities: {
      waterSupply: boolean;
      electricity: boolean;
      heating: 'CENTRAL' | 'STOVE' | 'NONE';
    };
    sanitaryConditions: string;
    generalAssessment: string;
  };
  incomeSources: {
    mainIncome: string;
    additionalIncome: string;
    supportingDocuments: string[];
  };
  property: {
    landPlot: {
      exists: boolean;
      type?: 'HOUSEHOLD' | 'AGRICULTURAL';
      area?: number;
      usage?: string;
    };
    livestock: {
      cattle: number;
      smallCattle: number;
      other: string;
    };
    vehicles: {
      hasVehicle: boolean;
      makeModel?: string;
    };
    realEstate: string;
    bankDeposits: {
      hasDeposits: boolean;
      amount?: number;
    };
  };
  specialistConclusions: {
    familyCompositionMatches: boolean;
    livingConditions: string;
    incomeLevel: string;
    meetsCriteria: 'YES' | 'NO' | 'REQUIRES_ADDITIONAL_CHECK';
    rejectionReason?: string;
  };
  signatures: {
    specialist: {
      fullName: string;
      position: string;
      signature: string;
    };
    supervisor?: {
      fullName: string;
      signature: string;
    };
    applicant: {
      fullName: string;
      signature: string;
    };
  };
  attachments: {
    hasPhotos: boolean;
    hasDocumentCopies: boolean;
    hasOtherMaterials: boolean;
  };
}

class InspectionService {
  // 1. Выездные проверки
  async createInspection(data: CreateInspectionRequest): Promise<ApiResponse<Inspection>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания проверки' };
    }
  }

  async getInspections(filters: InspectionFilters = {}): Promise<PaginatedResponse<Inspection>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`${API_BASE_URL}/inspections?${params}`);
      return await response.json();
    } catch (error) {
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  }

  async getInspection(id: number): Promise<ApiResponse<Inspection>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspections/${id}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения проверки' };
    }
  }

  async updateInspection(id: number, data: UpdateInspectionRequest): Promise<ApiResponse<Inspection>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка обновления проверки' };
    }
  }

  async updateInspectionStatus(id: number, status: InspectionStatus): Promise<ApiResponse<Inspection>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspections/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка обновления статуса проверки' };
    }
  }

  async deleteInspection(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspections/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка удаления проверки' };
    }
  }

  // 2. Акты выездных проверок
  async createInspectionReport(data: CreateInspectionReportRequest): Promise<ApiResponse<InspectionReport>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspection-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания акта проверки' };
    }
  }

  async getInspectionReport(id: number): Promise<ApiResponse<InspectionReport>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspection-reports/${id}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения акта проверки' };
    }
  }

  async getInspectionReports(filters: any = {}): Promise<PaginatedResponse<InspectionReport>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`${API_BASE_URL}/inspection-reports?${params}`);
      return await response.json();
    } catch (error) {
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  }

  async updateInspectionReport(id: number, data: Partial<CreateInspectionReportRequest>): Promise<ApiResponse<InspectionReport>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspection-reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка обновления акта проверки' };
    }
  }

  async approveInspectionReport(id: number): Promise<ApiResponse<InspectionReport>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspection-reports/${id}/approve`, {
        method: 'PATCH'
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка утверждения акта проверки' };
    }
  }

  async rejectInspectionReport(id: number, reason: string): Promise<ApiResponse<InspectionReport>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspection-reports/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка отклонения акта проверки' };
    }
  }

  // 3. Фотографии проверок
  async uploadInspectionPhotos(inspectionId: number, photos: File[]): Promise<ApiResponse<string[]>> {
    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append(`photos`, photo);
      });

      const response = await fetch(`${API_BASE_URL}/inspections/${inspectionId}/photos`, {
        method: 'POST',
        body: formData
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка загрузки фотографий' };
    }
  }

  async getInspectionPhotos(inspectionId: number): Promise<ApiResponse<string[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspections/${inspectionId}/photos`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения фотографий' };
    }
  }

  async deleteInspectionPhoto(inspectionId: number, photoId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspections/${inspectionId}/photos/${photoId}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка удаления фотографии' };
    }
  }

  // 4. Статистика проверок
  async getInspectionStats(): Promise<ApiResponse<{
    total: number;
    assigned: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    averageDuration: number;
    successRate: number;
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspections/stats`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения статистики проверок' };
    }
  }

  // 5. Экспорт отчетов
  async exportInspectionReport(id: number, format: 'pdf' | 'excel' = 'pdf'): Promise<ApiResponse<Blob>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspection-reports/${id}/export?format=${format}`);
      if (!response.ok) {
        throw new Error('Ошибка экспорта отчета');
      }
      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      return { success: false, error: 'Ошибка экспорта отчета' };
    }
  }

  // 6. Генерация номера проверки
  async generateInspectionNumber(): Promise<ApiResponse<string>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspections/generate-number`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка генерации номера проверки' };
    }
  }

  // 7. Генерация номера акта
  async generateReportNumber(): Promise<ApiResponse<string>> {
    try {
      const response = await fetch(`${API_BASE_URL}/inspection-reports/generate-number`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка генерации номера акта' };
    }
  }
}

export default new InspectionService();
