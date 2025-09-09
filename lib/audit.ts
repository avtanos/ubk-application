// Аудит и логирование согласно ТУ

export interface AuditLogEntry {
  id?: number;
  entityType: string;
  entityId: number;
  action: string;
  fieldName?: string;
  oldValue?: any;
  newValue?: any;
  userId: number;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string;
  createdAt?: Date;
}

export interface DecisionProtocol {
  id?: number;
  applicationId: number;
  applicationNumber: string;
  decisionDate: Date;
  responsiblePerson: string;
  responsiblePosition: string;
  decision: 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'TERMINATED';
  reason?: string;
  basis?: string;
  createdAt?: Date;
}

// Типы действий для аудита
export type AuditAction = 
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'SUBMIT'
  | 'APPROVE'
  | 'REJECT'
  | 'SUSPEND'
  | 'TERMINATE'
  | 'CALCULATE'
  | 'RECALCULATE'
  | 'TRANSFER'
  | 'REISSUE'
  | 'INTEGRATION_MSEK'
  | 'INTEGRATION_DSU'
  | 'LOGIN'
  | 'LOGOUT';

// Типы сущностей для аудита
export type AuditEntityType = 
  | 'APPLICANT'
  | 'IDENTITY_DOC'
  | 'FAMILY_MEMBER'
  | 'INCOME'
  | 'LAND_PLOT'
  | 'LIVESTOCK'
  | 'VEHICLE'
  | 'BENEFIT_ASSIGNMENT'
  | 'CALCULATION'
  | 'RECALCULATION'
  | 'TERMINATION'
  | 'REFUND_RETURN'
  | 'REISSUE'
  | 'SPECIAL_COMPENSATION'
  | 'APPLICATION'
  | 'USER'
  | 'SYSTEM';

// Класс для работы с аудитом
export class AuditLogger {
  private static instance: AuditLogger;
  private logs: AuditLogEntry[] = [];

  private constructor() {}

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  // Логирование создания сущности
  public logCreate(
    entityType: AuditEntityType,
    entityId: number,
    userId: number,
    userRole: string,
    data: any,
    context?: { ipAddress?: string; userAgent?: string; correlationId?: string }
  ): void {
    this.log({
      entityType,
      entityId,
      action: 'CREATE',
      newValue: data,
      userId,
      userRole,
      ...context
    });
  }

  // Логирование обновления сущности
  public logUpdate(
    entityType: AuditEntityType,
    entityId: number,
    userId: number,
    userRole: string,
    oldData: any,
    newData: any,
    changedFields: string[],
    context?: { ipAddress?: string; userAgent?: string; correlationId?: string }
  ): void {
    changedFields.forEach(field => {
      this.log({
        entityType,
        entityId,
        action: 'UPDATE',
        fieldName: field,
        oldValue: oldData[field],
        newValue: newData[field],
        userId,
        userRole,
        ...context
      });
    });
  }

  // Логирование удаления сущности
  public logDelete(
    entityType: AuditEntityType,
    entityId: number,
    userId: number,
    userRole: string,
    data: any,
    context?: { ipAddress?: string; userAgent?: string; correlationId?: string }
  ): void {
    this.log({
      entityType,
      entityId,
      action: 'DELETE',
      oldValue: data,
      userId,
      userRole,
      ...context
    });
  }

  // Логирование просмотра
  public logView(
    entityType: AuditEntityType,
    entityId: number,
    userId: number,
    userRole: string,
    context?: { ipAddress?: string; userAgent?: string; correlationId?: string }
  ): void {
    this.log({
      entityType,
      entityId,
      action: 'VIEW',
      userId,
      userRole,
      ...context
    });
  }

  // Логирование действий с заявлением
  public logApplicationAction(
    action: AuditAction,
    applicationId: number,
    userId: number,
    userRole: string,
    details?: any,
    context?: { ipAddress?: string; userAgent?: string; correlationId?: string }
  ): void {
    this.log({
      entityType: 'APPLICATION',
      entityId: applicationId,
      action,
      newValue: details,
      userId,
      userRole,
      ...context
    });
  }

  // Логирование интеграций
  public logIntegration(
    integrationType: 'MSEK' | 'DSU',
    applicationId: number,
    userId: number,
    userRole: string,
    requestData: any,
    responseData: any,
    context?: { ipAddress?: string; userAgent?: string; correlationId?: string }
  ): void {
    this.log({
      entityType: 'APPLICATION',
      entityId: applicationId,
      action: `INTEGRATION_${integrationType}`,
      oldValue: requestData,
      newValue: responseData,
      userId,
      userRole,
      ...context
    });
  }

  // Логирование расчетов
  public logCalculation(
    calculationType: 'BENEFIT' | 'RECALCULATION',
    applicationId: number,
    userId: number,
    userRole: string,
    calculationData: any,
    result: any,
    context?: { ipAddress?: string; userAgent?: string; correlationId?: string }
  ): void {
    this.log({
      entityType: 'CALCULATION',
      entityId: applicationId,
      action: calculationType,
      oldValue: calculationData,
      newValue: result,
      userId,
      userRole,
      ...context
    });
  }

  // Логирование решений
  public logDecision(
    decisionType: 'APPROVE' | 'REJECT' | 'SUSPEND' | 'TERMINATE',
    applicationId: number,
    userId: number,
    userRole: string,
    decisionData: any,
    context?: { ipAddress?: string; userAgent?: string; correlationId?: string }
  ): void {
    this.log({
      entityType: 'APPLICATION',
      entityId: applicationId,
      action: decisionType,
      newValue: decisionData,
      userId,
      userRole,
      ...context
    });
  }

  // Основной метод логирования
  private log(entry: AuditLogEntry): void {
    const logEntry: AuditLogEntry = {
      ...entry,
      createdAt: new Date()
    };
    
    this.logs.push(logEntry);
    
    // В реальной реализации здесь будет отправка в базу данных
    console.log('AUDIT LOG:', logEntry);
  }

  // Получение логов по сущности
  public getLogsByEntity(entityType: AuditEntityType, entityId: number): AuditLogEntry[] {
    return this.logs.filter(log => 
      log.entityType === entityType && log.entityId === entityId
    );
  }

  // Получение логов по пользователю
  public getLogsByUser(userId: number): AuditLogEntry[] {
    return this.logs.filter(log => log.userId === userId);
  }

  // Получение логов по действию
  public getLogsByAction(action: AuditAction): AuditLogEntry[] {
    return this.logs.filter(log => log.action === action);
  }

  // Получение логов за период
  public getLogsByPeriod(startDate: Date, endDate: Date): AuditLogEntry[] {
    return this.logs.filter(log => 
      log.createdAt && log.createdAt >= startDate && log.createdAt <= endDate
    );
  }

  // Получение всех логов
  public getAllLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  // Очистка логов (для тестирования)
  public clearLogs(): void {
    this.logs = [];
  }
}

// Создание протокола решения
export class DecisionProtocolManager {
  private static instance: DecisionProtocolManager;
  private protocols: DecisionProtocol[] = [];

  private constructor() {}

  public static getInstance(): DecisionProtocolManager {
    if (!DecisionProtocolManager.instance) {
      DecisionProtocolManager.instance = new DecisionProtocolManager();
    }
    return DecisionProtocolManager.instance;
  }

  // Создание протокола решения
  public createProtocol(
    applicationId: number,
    applicationNumber: string,
    responsiblePerson: string,
    responsiblePosition: string,
    decision: 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'TERMINATED',
    reason?: string,
    basis?: string
  ): DecisionProtocol {
    const protocol: DecisionProtocol = {
      applicationId,
      applicationNumber,
      decisionDate: new Date(),
      responsiblePerson,
      responsiblePosition,
      decision,
      reason,
      basis,
      createdAt: new Date()
    };

    this.protocols.push(protocol);
    
    // Логирование создания протокола
    const auditLogger = AuditLogger.getInstance();
    auditLogger.logCreate(
      'APPLICATION',
      applicationId,
      0, // system user
      'SYSTEM',
      protocol
    );

    return protocol;
  }

  // Получение протокола по заявлению
  public getProtocolByApplication(applicationId: number): DecisionProtocol | undefined {
    return this.protocols.find(protocol => protocol.applicationId === applicationId);
  }

  // Получение всех протоколов
  public getAllProtocols(): DecisionProtocol[] {
    return [...this.protocols];
  }

  // Очистка протоколов (для тестирования)
  public clearProtocols(): void {
    this.protocols = [];
  }
}

// Утилиты для работы с аудитом
export const auditUtils = {
  // Генерация корреляционного ID
  generateCorrelationId: (): string => {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Получение IP адреса из контекста
  getClientIP: (req: any): string => {
    return req?.ip || 
           req?.connection?.remoteAddress || 
           req?.socket?.remoteAddress ||
           req?.headers?.['x-forwarded-for'] ||
           'unknown';
  },

  // Получение User-Agent из контекста
  getUserAgent: (req: any): string => {
    return req?.headers?.['user-agent'] || 'unknown';
  },

  // Форматирование данных для логирования
  formatDataForLogging: (data: any): any => {
    if (typeof data === 'object' && data !== null) {
      return JSON.parse(JSON.stringify(data));
    }
    return data;
  },

  // Проверка чувствительных данных
  isSensitiveField: (fieldName: string): boolean => {
    const sensitiveFields = ['pin', 'password', 'token', 'secret', 'key'];
    return sensitiveFields.some(field => 
      fieldName.toLowerCase().includes(field)
    );
  },

  // Маскирование чувствительных данных
  maskSensitiveData: (data: any): any => {
    if (typeof data === 'object' && data !== null) {
      const masked = { ...data };
      Object.keys(masked).forEach(key => {
        if (auditUtils.isSensitiveField(key)) {
          masked[key] = '***MASKED***';
        }
      });
      return masked;
    }
    return data;
  }
};

// Экспорт синглтонов для использования
export const auditLogger = AuditLogger.getInstance();
export const decisionProtocolManager = DecisionProtocolManager.getInstance();
