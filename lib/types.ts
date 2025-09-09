// Типы данных для системы УБК

export interface Application {
  id: string;
  applicantName: string;
  applicantId: string; // ИИН
  phone: string;
  email?: string;
  address: string;
  familyMembers: FamilyMember[];
  income: Income[];
  documents: Document[];
  status: ApplicationStatus;
  priority: Priority;
  riskScore: number;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  approvedAt?: Date;
  approvedBy?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
  rejectionReason?: string;
  paymentAmount?: number;
  paymentStatus?: PaymentStatus;
  notes?: string;
  inspectionRequired: boolean;
  inspectionDate?: Date;
  inspectionResult?: InspectionResult;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  birthDate: Date;
  isDisabled: boolean;
  isStudent: boolean;
  isWorking: boolean;
  income?: number;
}

export interface Income {
  id: string;
  type: IncomeType;
  amount: number;
  source: string;
  period: string; // месяц/год
  isRegular: boolean;
  documents: string[]; // ссылки на документы
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  status: DocumentStatus;
  verifiedAt?: Date;
  verifiedBy?: string;
  notes?: string;
}

export interface InspectionResult {
  id: string;
  inspectorName: string;
  inspectionDate: Date;
  findings: string;
  recommendations: string;
  photos: string[];
  status: 'completed' | 'pending' | 'cancelled';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Payment {
  id: string;
  applicationId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  processedAt?: Date;
  processedBy: string;
  bankAccount: string;
  notes?: string;
}

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  period: {
    start: Date;
    end: Date;
  };
  generatedAt: Date;
  generatedBy: string;
  data: any;
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLogin?: Date;
  permissions: Permission[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: Date;
  details: any;
  ipAddress: string;
  userAgent: string;
}

// Enums
export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'payment_processing' 
  | 'paid' 
  | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type PaymentMethod = 'bank_transfer' | 'cash' | 'card';

export type IncomeType = 
  | 'salary' 
  | 'business' 
  | 'agriculture' 
  | 'education' 
  | 'bank_deposits' 
  | 'social_benefits' 
  | 'rental' 
  | 'other';

export type DocumentType = 
  | 'passport' 
  | 'birth_certificate' 
  | 'marriage_certificate' 
  | 'income_certificate' 
  | 'employment_certificate' 
  | 'bank_statement' 
  | 'property_document' 
  | 'medical_certificate' 
  | 'other';

export type DocumentStatus = 'uploaded' | 'verified' | 'rejected' | 'expired';

export type ReportType = 
  | 'applications_summary' 
  | 'payments_summary' 
  | 'financial_report' 
  | 'audit_report' 
  | 'performance_report' 
  | 'risk_analysis';

export type UserRole = 'specialist' | 'accountant' | 'admin' | 'citizen';

export type Permission = 
  | 'view_applications' 
  | 'edit_applications' 
  | 'approve_applications' 
  | 'reject_applications' 
  | 'view_payments' 
  | 'process_payments' 
  | 'view_reports' 
  | 'generate_reports' 
  | 'manage_users' 
  | 'system_settings' 
  | 'audit_logs';

// API Response types
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

// Filter and search types
export interface ApplicationFilters {
  status?: ApplicationStatus[];
  priority?: Priority[];
  dateFrom?: Date;
  dateTo?: Date;
  riskScoreMin?: number;
  riskScoreMax?: number;
  inspectorId?: string;
  search?: string;
}

export interface PaymentFilters {
  status?: PaymentStatus[];
  method?: PaymentMethod[];
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}
