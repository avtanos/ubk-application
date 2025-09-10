// Обновленный ApplicationService для работы с новой структурой данных

import { 
  Application, 
  Applicant, 
  FamilyMember, 
  Income, 
  LandPlot, 
  Livestock, 
  Vehicle, 
  Address, 
  Contact, 
  Consent, 
  SocialAuthorityLink, 
  ApplicantCategory, 
  PaymentRequisite, 
  Document,
  IdentityDocument,
  AdditionalIdentity,
  HouseholdMetrics,
  BenefitAssignment,
  Calculation,
  ApiResponse,
  PaginatedResponse,
  ApplicationFilters
} from '../types-updated';

// Базовый URL API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApplicationServiceUpdated {
  // 1. Заявители
  async createApplicant(applicant: Omit<Applicant, 'id'>): Promise<ApiResponse<Applicant>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applicants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicant)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания заявителя' };
    }
  }

  async getApplicant(id: number): Promise<ApiResponse<Applicant>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applicants/${id}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения заявителя' };
    }
  }

  async updateApplicant(id: number, applicant: Partial<Applicant>): Promise<ApiResponse<Applicant>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applicants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicant)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка обновления заявителя' };
    }
  }

  // 2. Заявления
  async createApplication(application: Omit<Application, 'id'>): Promise<ApiResponse<Application>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания заявления' };
    }
  }

  async getApplications(
    filters: ApplicationFilters = {},
    page: number = 1,
    limit: number = 50
  ): Promise<ApiResponse<PaginatedResponse<Application>>> {
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

      const response = await fetch(`${API_BASE_URL}/applications?${params}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения заявлений' };
    }
  }

  async getApplication(id: number): Promise<ApiResponse<Application>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения заявления' };
    }
  }

  async updateApplication(id: number, application: Partial<Application>): Promise<ApiResponse<Application>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка обновления заявления' };
    }
  }

  async updateApplicationStatus(
    id: number, 
    status: Application['status'], 
    userId: number,
    notes?: string
  ): Promise<ApiResponse<Application>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, userId, notes })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка обновления статуса' };
    }
  }

  // 3. Члены семьи
  async createFamilyMember(familyMember: Omit<FamilyMember, 'id'>): Promise<ApiResponse<FamilyMember>> {
    try {
      const response = await fetch(`${API_BASE_URL}/family-members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(familyMember)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания члена семьи' };
    }
  }

  async getFamilyMembers(applicationId: number): Promise<ApiResponse<FamilyMember[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/family-members`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения членов семьи' };
    }
  }

  async updateFamilyMember(id: number, familyMember: Partial<FamilyMember>): Promise<ApiResponse<FamilyMember>> {
    try {
      const response = await fetch(`${API_BASE_URL}/family-members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(familyMember)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка обновления члена семьи' };
    }
  }

  async deleteFamilyMember(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/family-members/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка удаления члена семьи' };
    }
  }

  // 4. Доходы
  async createIncome(income: Omit<Income, 'id'>): Promise<ApiResponse<Income>> {
    try {
      const response = await fetch(`${API_BASE_URL}/incomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(income)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания дохода' };
    }
  }

  async getIncomes(applicationId: number): Promise<ApiResponse<Income[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/incomes`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения доходов' };
    }
  }

  async updateIncome(id: number, income: Partial<Income>): Promise<ApiResponse<Income>> {
    try {
      const response = await fetch(`${API_BASE_URL}/incomes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(income)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка обновления дохода' };
    }
  }

  async deleteIncome(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/incomes/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка удаления дохода' };
    }
  }

  // 5. Имущество
  async createLandPlot(landPlot: Omit<LandPlot, 'id'>): Promise<ApiResponse<LandPlot>> {
    try {
      const response = await fetch(`${API_BASE_URL}/land-plots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(landPlot)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания земельного участка' };
    }
  }

  async getLandPlots(applicationId: number): Promise<ApiResponse<LandPlot[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/land-plots`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения земельных участков' };
    }
  }

  async createLivestock(livestock: Omit<Livestock, 'id'>): Promise<ApiResponse<Livestock>> {
    try {
      const response = await fetch(`${API_BASE_URL}/livestock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(livestock)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания скота' };
    }
  }

  async getLivestock(applicationId: number): Promise<ApiResponse<Livestock[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/livestock`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения скота' };
    }
  }

  async createVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<ApiResponse<Vehicle>> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания транспортного средства' };
    }
  }

  async getVehicles(applicationId: number): Promise<ApiResponse<Vehicle[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/vehicles`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения транспортных средств' };
    }
  }

  // 6. Адреса и контакты
  async createAddress(address: Omit<Address, 'id'>): Promise<ApiResponse<Address>> {
    try {
      const response = await fetch(`${API_BASE_URL}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания адреса' };
    }
  }

  async getAddresses(applicantId: number): Promise<ApiResponse<Address[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applicants/${applicantId}/addresses`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения адресов' };
    }
  }

  async createContact(contact: Omit<Contact, 'id'>): Promise<ApiResponse<Contact>> {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания контакта' };
    }
  }

  async getContacts(applicantId: number): Promise<ApiResponse<Contact[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applicants/${applicantId}/contacts`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения контактов' };
    }
  }

  // 7. Документы
  async uploadDocument(document: Omit<Document, 'id'>): Promise<ApiResponse<Document>> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(document)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка загрузки документа' };
    }
  }

  async getDocuments(applicationId: number): Promise<ApiResponse<Document[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/documents`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения документов' };
    }
  }

  async verifyDocument(id: number, verifiedBy: number, notes?: string): Promise<ApiResponse<Document>> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedBy, notes })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка верификации документа' };
    }
  }

  // 8. Согласия
  async createConsent(consent: Omit<Consent, 'id'>): Promise<ApiResponse<Consent>> {
    try {
      const response = await fetch(`${API_BASE_URL}/consents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consent)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания согласия' };
    }
  }

  async getConsent(applicantId: number): Promise<ApiResponse<Consent>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applicants/${applicantId}/consent`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения согласия' };
    }
  }

  // 9. Показатели домохозяйства
  async calculateHouseholdMetrics(applicationId: number): Promise<ApiResponse<HouseholdMetrics>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/household-metrics`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка расчета показателей домохозяйства' };
    }
  }

  async getHouseholdMetrics(applicationId: number): Promise<ApiResponse<HouseholdMetrics[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/household-metrics`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения показателей домохозяйства' };
    }
  }

  // 10. Назначения пособий
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

  async getBenefitAssignments(applicationId: number): Promise<ApiResponse<BenefitAssignment[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/benefit-assignments`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения назначений пособий' };
    }
  }

  // 11. Расчеты пособий
  async createCalculation(calculation: Omit<Calculation, 'id'>): Promise<ApiResponse<Calculation>> {
    try {
      const response = await fetch(`${API_BASE_URL}/calculations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calculation)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка создания расчета' };
    }
  }

  async getCalculations(applicationId: number): Promise<ApiResponse<Calculation[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/calculations`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения расчетов' };
    }
  }

  // 12. Статистика
  async getApplicationStats(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/stats`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка получения статистики' };
    }
  }

  // 13. Массовые операции
  async bulkUpdateStatus(
    applicationIds: number[], 
    status: Application['status'], 
    userId: number,
    notes?: string
  ): Promise<ApiResponse<{ updated: number; failed: number }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/bulk/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationIds, status, userId, notes })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка массового обновления статусов' };
    }
  }

  async bulkExport(filters: ApplicationFilters, format: 'excel' | 'csv' = 'excel'): Promise<ApiResponse<{ downloadUrl: string }>> {
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

      const response = await fetch(`${API_BASE_URL}/applications/export?${params}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Ошибка экспорта данных' };
    }
  }
}

export const applicationServiceUpdated = new ApplicationServiceUpdated();
