// Сервис для работы с внешними API
import { 
  EXTERNAL_SERVICES, 
  ExternalServiceResponse, 
  ExternalServiceConfig,
  MSEKData,
  GRSPassportData,
  GRSCivilRegistryData,
  GRSAddressData,
  GRSVehicleData,
  ISRTEmploymentData,
  SFPensionData,
  SFWorkPeriodsData,
  VeterinaryData,
  GNSPatentData,
  GNSIndividualEntrepreneurData,
  CadastreData,
  GKDOVeteranData,
  KISSPAvailableServices
} from './externalServices';

class ExternalApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.ubk.kg';
  private apiKey = process.env.NEXT_PUBLIC_API_KEY;

  // Общий метод для вызова внешних API
  private async callExternalAPI<T>(
    serviceId: string, 
    endpoint: string, 
    params: Record<string, any> = {}
  ): Promise<ExternalServiceResponse<T>> {
    const service = EXTERNAL_SERVICES.find(s => s.id === serviceId);
    
    if (!service) {
      return {
        isSuccess: false,
        errorMessage: `Сервис ${serviceId} не найден`,
        timestamp: new Date().toISOString()
      };
    }

    if (!service.isActive) {
      return {
        isSuccess: false,
        errorMessage: `Сервис ${service.name} отключен`,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const url = new URL(endpoint, service.baseUrl);
      
      // Добавляем параметры в URL
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : '',
          'X-Service-ID': serviceId,
          'X-Request-ID': this.generateRequestId()
        },
        signal: AbortSignal.timeout(service.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        isSuccess: true,
        data: data as T,
        statusCode: response.status,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Ошибка при вызове сервиса ${serviceId}:`, error);
      
      return {
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : 'Неизвестная ошибка',
        timestamp: new Date().toISOString()
      };
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 1. МСЭК - Получение данных об инвалидности
  async getMSEKData(pin: string): Promise<ExternalServiceResponse<MSEKData>> {
    return this.callExternalAPI<MSEKData>('msek', '/api/msek/disability', { pin });
  }

  // 2. ГРС: Паспортная база
  async getGRSPassportData(pin: string): Promise<ExternalServiceResponse<GRSPassportData>> {
    return this.callExternalAPI<GRSPassportData>('grs_passport', '/api/grs/passport', { pin });
  }

  // 3. ГРС: ЗАГС база
  async getGRSCivilRegistryData(pin: string): Promise<ExternalServiceResponse<GRSCivilRegistryData>> {
    return this.callExternalAPI<GRSCivilRegistryData>('grs_civil_registry', '/api/grs/civil-registry', { pin });
  }

  // 4. ГРС: Адрес фактического проживания
  async getGRSAddressData(pin: string): Promise<ExternalServiceResponse<GRSAddressData>> {
    return this.callExternalAPI<GRSAddressData>('grs_address', '/api/grs/address', { pin });
  }

  // 5. ГРС: Транспортные средства
  async getGRSVehicleData(pin: string): Promise<ExternalServiceResponse<GRSVehicleData[]>> {
    return this.callExternalAPI<GRSVehicleData[]>('grs_vehicle', '/api/grs/vehicles', { pin });
  }

  // 6. ИСРТ: Статус занятости
  async getISRTEmploymentData(pin: string): Promise<ExternalServiceResponse<ISRTEmploymentData>> {
    return this.callExternalAPI<ISRTEmploymentData>('isrt_employment', '/api/isrt/employment', { pin });
  }

  // 7. СФ: Наличие пенсии
  async getSFPensionData(pin: string): Promise<ExternalServiceResponse<SFPensionData>> {
    return this.callExternalAPI<SFPensionData>('sf_pension', '/api/sf/pension', { pin });
  }

  // 8. СФ: Периоды работы
  async getSFWorkPeriodsData(pin: string): Promise<ExternalServiceResponse<SFWorkPeriodsData>> {
    return this.callExternalAPI<SFWorkPeriodsData>('sf_work_periods', '/api/sf/work-periods', { pin });
  }

  // 9. Ветеринария: КРС и МРС
  async getVeterinaryData(pin: string): Promise<ExternalServiceResponse<VeterinaryData>> {
    return this.callExternalAPI<VeterinaryData>('veterinary', '/api/veterinary/animals', { pin });
  }

  // 10. ГНС: Патенты
  async getGNSPatentData(pin: string): Promise<ExternalServiceResponse<GNSPatentData[]>> {
    return this.callExternalAPI<GNSPatentData[]>('gns_patent', '/api/gns/patents', { pin });
  }

  // 11. ГНС: ИП
  async getGNSIndividualEntrepreneurData(pin: string): Promise<ExternalServiceResponse<GNSIndividualEntrepreneurData>> {
    return this.callExternalAPI<GNSIndividualEntrepreneurData>('gns_individual_entrepreneur', '/api/gns/individual-entrepreneur', { pin });
  }

  // 12. Кадастр: Недвижимость
  async getCadastreData(pin: string): Promise<ExternalServiceResponse<CadastreData>> {
    return this.callExternalAPI<CadastreData>('cadastre', '/api/cadastre/properties', { pin });
  }

  // 13. ГКДО: ВОВ
  async getGKDOVOVData(pin: string): Promise<ExternalServiceResponse<GKDOVeteranData>> {
    return this.callExternalAPI<GKDOVeteranData>('gkdo_vov', '/api/gkdo/vov', { pin });
  }

  // 14. ГКДО: ЧАЭС
  async getGKDOChernobylData(pin: string): Promise<ExternalServiceResponse<GKDOVeteranData>> {
    return this.callExternalAPI<GKDOVeteranData>('gkdo_chernobyl', '/api/gkdo/chernobyl', { pin });
  }

  // 15. ГКДО: Афганцы
  async getGKDOAfghanData(pin: string): Promise<ExternalServiceResponse<GKDOVeteranData>> {
    return this.callExternalAPI<GKDOVeteranData>('gkdo_afghan', '/api/gkdo/afghan', { pin });
  }

  // 16. КИССП: Доступные услуги
  async getKISSPAvailableServices(): Promise<ExternalServiceResponse<KISSPAvailableServices>> {
    return this.callExternalAPI<KISSPAvailableServices>('kissp_services', '/api/kissp/services');
  }

  // Комплексная проверка всех данных по ПИН
  async getAllDataByPIN(pin: string): Promise<{
    msek: ExternalServiceResponse<MSEKData>;
    grsPassport: ExternalServiceResponse<GRSPassportData>;
    grsCivilRegistry: ExternalServiceResponse<GRSCivilRegistryData>;
    grsAddress: ExternalServiceResponse<GRSAddressData>;
    grsVehicles: ExternalServiceResponse<GRSVehicleData[]>;
    isrtEmployment: ExternalServiceResponse<ISRTEmploymentData>;
    sfPension: ExternalServiceResponse<SFPensionData>;
    sfWorkPeriods: ExternalServiceResponse<SFWorkPeriodsData>;
    veterinary: ExternalServiceResponse<VeterinaryData>;
    gnsPatent: ExternalServiceResponse<GNSPatentData[]>;
    gnsIndividualEntrepreneur: ExternalServiceResponse<GNSIndividualEntrepreneurData>;
    cadastre: ExternalServiceResponse<CadastreData>;
    gkdoVOV: ExternalServiceResponse<GKDOVeteranData>;
    gkdoChernobyl: ExternalServiceResponse<GKDOVeteranData>;
    gkdoAfghan: ExternalServiceResponse<GKDOVeteranData>;
  }> {
    // Выполняем все запросы параллельно для ускорения
    const [
      msek,
      grsPassport,
      grsCivilRegistry,
      grsAddress,
      grsVehicles,
      isrtEmployment,
      sfPension,
      sfWorkPeriods,
      veterinary,
      gnsPatent,
      gnsIndividualEntrepreneur,
      cadastre,
      gkdoVOV,
      gkdoChernobyl,
      gkdoAfghan
    ] = await Promise.all([
      this.getMSEKData(pin),
      this.getGRSPassportData(pin),
      this.getGRSCivilRegistryData(pin),
      this.getGRSAddressData(pin),
      this.getGRSVehicleData(pin),
      this.getISRTEmploymentData(pin),
      this.getSFPensionData(pin),
      this.getSFWorkPeriodsData(pin),
      this.getVeterinaryData(pin),
      this.getGNSPatentData(pin),
      this.getGNSIndividualEntrepreneurData(pin),
      this.getCadastreData(pin),
      this.getGKDOVOVData(pin),
      this.getGKDOChernobylData(pin),
      this.getGKDOAfghanData(pin)
    ]);

    return {
      msek,
      grsPassport,
      grsCivilRegistry,
      grsAddress,
      grsVehicles,
      isrtEmployment,
      sfPension,
      sfWorkPeriods,
      veterinary,
      gnsPatent,
      gnsIndividualEntrepreneur,
      cadastre,
      gkdoVOV,
      gkdoChernobyl,
      gkdoAfghan
    };
  }

  // Получение статуса всех сервисов
  async getServicesStatus(): Promise<ExternalServiceConfig[]> {
    return EXTERNAL_SERVICES;
  }

  // Проверка доступности сервиса
  async checkServiceHealth(serviceId: string): Promise<boolean> {
    try {
      const service = EXTERNAL_SERVICES.find(s => s.id === serviceId);
      if (!service || !service.isActive) return false;

      const response = await fetch(`${service.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}

// Экспортируем singleton instance
export const externalApiService = new ExternalApiService();
export default externalApiService;
