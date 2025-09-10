// Обновленные типы данных для соответствия DDL и форме заявления

// 1. Заявитель (соответствует таблице applicant)
export interface Applicant {
  id: number;
  pin: string; // 14-16 цифр
  fullName: string;
  genderCode: 'M' | 'F';
  birthDate: string; // YYYY-MM-DD
  age: number;
  citizenshipCode: string; // ISO код
  nationalityCode?: string;
  educationCode?: string;
  maritalStatus?: string;
  applicantCategory?: string;
  socialProtectionAuthority?: string;
  language: 'ru' | 'ky';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

// 2. Документы, удостоверяющие личность
export interface IdentityDocument {
  id: number;
  applicantId: number;
  familyMemberId?: number;
  docType: string; // passport, birth_certificate, etc.
  series: string;
  number: string;
  issueDate: string;
  issuerCode: string;
  issuingAuthority?: string;
  expiryDate: string;
  iin?: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 3. Дополнительные удостоверения
export interface AdditionalIdentity {
  id: number;
  applicantId: number;
  idType: 'military' | 'special';
  series?: string;
  number?: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 4. Согласия
export interface Consent {
  id: number;
  applicantId: number;
  pdnSelf: boolean;
  pdnChildren: boolean;
  truthConfirm: boolean;
  termsAck: boolean;
  givenAt: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// 5. Связь с органами соцзащиты
export interface SocialAuthorityLink {
  id: number;
  applicantId: number;
  municipalAuthorityCode: string;
  applicantTypeCode: string;
  categoryCode: string;
  disabilityCategoryCode?: string;
  msekRefNumber?: string;
  msekIssueDate?: string;
  dsuRefNumber?: string;
  dsuIssueDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 6. Категории заявителя
export interface ApplicantCategory {
  id: number;
  applicationId: number;
  categoryCode: string;
  isException: boolean;
  assignedDate: string;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 7. Платежные реквизиты
export interface PaymentRequisite {
  id: number;
  applicationId: number;
  requisiteType: 'PERSONAL' | 'BANK' | 'CARD';
  bankCode?: string;
  personalAccount?: string;
  bankAccount?: string;
  cardAccount?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 8. Адреса
export interface Address {
  id: number;
  applicantId: number;
  regionCode: string;
  raionCode: string;
  localityCode: string;
  street: string;
  house: string;
  flat?: string;
  addrType: 'REG' | 'FACT';
  postalCode?: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 9. Контакты
export interface Contact {
  id: number;
  applicantId: number;
  contactTypeCode: string; // mobile, home, email, other
  value: string;
  isPrimary: boolean;
  isVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 10. Члены семьи
export interface FamilyMember {
  id: number;
  applicationId: number;
  fullName: string;
  birthDate: string;
  age: number;
  genderCode: 'M' | 'F';
  relationCode: string; // spouse, child, parent, etc.
  pinOrDoc?: string;
  citizenshipCode?: string;
  childCategoryCode?: string;
  birthCertNo?: string;
  birthCertDate?: string;
  birthCertIssuer?: string;
  disabilityFlag: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 11. Доходы
export interface Income {
  id: number;
  applicationId: number;
  memberId?: number; // ссылка на family_member
  incomeTypeCode: string;
  amount: number;
  periodicity: 'M' | 'Y'; // месяц/год
  periodFrom: string;
  periodTo?: string;
  sourceRef?: string;
  evidenceDocId?: number;
  isVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 12. Земельные участки
export interface LandPlot {
  id: number;
  applicationId: number;
  typeCode: string;
  areaHectare: number;
  ownershipType?: string;
  location?: string;
  estimatedValue?: number;
  isOwned: boolean;
  createdAt: string;
  updatedAt: string;
}

// 13. Скот
export interface Livestock {
  id: number;
  applicationId: number;
  typeCode: string;
  qty: number;
  convUnits: number;
  estimatedValue?: number;
  isOwned: boolean;
  createdAt: string;
  updatedAt: string;
}

// 14. Транспортные средства
export interface Vehicle {
  id: number;
  applicationId: number;
  typeCode: string;
  makeModel?: string;
  year: number;
  isLightCar: boolean;
  regNo?: string;
  estimatedValue?: number;
  isOwned: boolean;
  createdAt: string;
  updatedAt: string;
}

// 15. Показатели домохозяйства
export interface HouseholdMetrics {
  id: number;
  applicationId: number;
  calculationPeriodId?: number;
  totalIncomeMonth: number;
  perCapitaIncome: number;
  convUnitsTotal: number;
  incomeCriteriaFlag: boolean;
  propertyCriteriaFlag: boolean;
  familyCriteriaFlag: boolean;
  vehicleCriteriaFlag: boolean;
  guaranteedMinimumIncome: number;
  calculatedAt: string;
  createdAt: string;
  updatedAt: string;
}

// 16. Заявление (обновленное)
export interface Application {
  id: number;
  applicationNumber: string;
  applicantId: number;
  status: ApplicationStatus;
  priority: Priority;
  riskScore: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: number;
  approvedAt?: string;
  approvedBy?: number;
  rejectedAt?: string;
  rejectedBy?: number;
  rejectionReason?: string;
  paymentAmount?: number;
  paymentStatus?: PaymentStatus;
  notes?: string;
  inspectionRequired: boolean;
  inspectionDate?: string;
  inspectionResult?: InspectionResult;
  createdAt: string;
  updatedAt: string;
  
  // Связанные данные
  applicant?: Applicant;
  familyMembers?: FamilyMember[];
  incomes?: Income[];
  landPlots?: LandPlot[];
  livestock?: Livestock[];
  vehicles?: Vehicle[];
  householdMetrics?: HouseholdMetrics[];
  benefitAssignments?: BenefitAssignment[];
  calculations?: Calculation[];
  documents?: Document[];
  addresses?: Address[];
  contacts?: Contact[];
  consents?: Consent[];
  socialAuthorityLink?: SocialAuthorityLink;
  applicantCategories?: ApplicantCategory[];
  paymentRequisites?: PaymentRequisite[];
}

// 17. Назначения пособий
export interface BenefitAssignment {
  id: number;
  applicationId: number;
  benefitType: string;
  categoryCode: string;
  periodFrom: string;
  periodTo?: string;
  decision: 'APPROVED' | 'DENIED';
  decisionReasonCode?: string;
  assignedAmount: number;
  currentAmount: number;
  assignmentDate: string;
  effectiveDate: string;
  terminationDate?: string;
  assignedBy?: number;
  createdAt: string;
  updatedAt: string;
}

// 18. Расчеты пособий
export interface Calculation {
  id: number;
  benefitAssignmentId?: number;
  applicationId: number;
  baseAmount: number;
  childrenCount: number;
  regionCoeff: number;
  addCoeff: number;
  borderBonus: number;
  totalAmount: number;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
  calculationMethod?: string;
  calculationFormula?: string;
  isAutomatic: boolean;
  calculatedAt: string;
  calculatedBy?: number;
  createdAt: string;
}

// 19. Документы (обновленное)
export interface Document {
  id: number;
  applicationId: number;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: number;
  status: DocumentStatus;
  verifiedAt?: string;
  verifiedBy?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 20. Перерасчеты
export interface Recalculation {
  id: number;
  applicationId?: number;
  benefitAssignmentId?: number;
  recalcType: 'BASE' | 'COEFF' | 'ADDRESS' | 'MANUAL';
  oldAmount?: number;
  newAmount?: number;
  effectiveDate: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  reason?: string;
  processedBy?: number;
  processedAt?: string;
  createdAt: string;
}

// 21. Прекращения
export interface Termination {
  id: number;
  applicationId: number;
  benefitAssignmentId?: number;
  reasonCode: string;
  decisionDate: string;
  effectiveDate: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  processedBy?: number;
  processedAt?: string;
  createdAt: string;
}

// 22. Возвраты
export interface RefundReturn {
  id: number;
  applicationId: number;
  benefitAssignmentId?: number;
  returnReasonCode: string;
  returnDate: string;
  amount?: number;
  note?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  processedBy?: number;
  processedAt?: string;
  createdAt: string;
}

// 23. Передоформления
export interface Reissue {
  id: number;
  applicationId: number;
  benefitAssignmentId?: number;
  toPersonId?: number;
  reasonCode: string;
  decisionDate: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  processedBy?: number;
  processedAt?: string;
  createdAt: string;
}

// 24. Специальные компенсации
export interface SpecialCompensation {
  id: number;
  applicationId: number;
  benefitAssignmentId?: number;
  typeCode: string;
  reasonCode: string;
  amount: number;
  periodFrom: string;
  periodTo?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

// 25. Журнал аудита
export interface AuditLog {
  id: number;
  entityType: string;
  entityId: number;
  action: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  userId: number;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string;
  createdAt: string;
}

// 26. Протокол решения
export interface DecisionProtocol {
  id: number;
  applicationId: number;
  applicationNumber: string;
  decisionDate: string;
  responsiblePerson: string;
  responsiblePosition: string;
  decision: 'APPROVED' | 'DENIED' | 'PENDING';
  reason?: string;
  basis?: string;
  createdAt: string;
}

// Enums (обновленные)
export type ApplicationStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'PENDING_APPROVAL'
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PAYMENT_PROCESSING' 
  | 'PAID' 
  | 'CANCELLED'
  | 'TERMINATED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type DocumentStatus = 'UPLOADED' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';

export type InspectionResult = {
  id: number;
  inspectorName: string;
  inspectionDate: string;
  findings: string;
  recommendations: string;
  photos: string[];
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
};

// API Response types (без изменений)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter types (обновленные)
export interface ApplicationFilters {
  status?: ApplicationStatus[];
  priority?: Priority[];
  dateFrom?: string;
  dateTo?: string;
  riskScoreMin?: number;
  riskScoreMax?: number;
  inspectorId?: number;
  search?: string;
  regionCode?: string;
  categoryCode?: string;
}

export interface PaymentFilters {
  status?: PaymentStatus[];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
  bankCode?: string;
}
