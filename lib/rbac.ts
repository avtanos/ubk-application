// RBAC и workflow статусов согласно ТУ

export type UserRole = 'SPECIALIST' | 'DIRECTOR' | 'ACCOUNTANT' | 'ADMIN';

export type ApplicationStatus = 
  | 'DRAFT' 
  | 'UNDER_REVIEW' 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'ACTIVE' 
  | 'SUSPENDED' 
  | 'TERMINATED';

export type ActionType = 
  | 'OPEN_EDIT_APPLICANT'
  | 'ADD_ANOTHER_PASSPORT'
  | 'GET_MSEK_REF'
  | 'CHECK_JUVENILE_SERVICE'
  | 'UPDATE_BENEFIT_CATEGORY'
  | 'SELECT_BANK'
  | 'MANAGE_FAMILY_MEMBER'
  | 'MANAGE_INCOME'
  | 'CALCULATE_BENEFIT'
  | 'SUBMIT_FOR_APPROVAL'
  | 'APPROVE_APPLICATION'
  | 'REJECT_APPLICATION'
  | 'EXTEND_BENEFIT'
  | 'TERMINATE_BENEFIT'
  | 'DELETE_RECALCULATION'
  | 'TRANSFER_PAYMENT'
  | 'REISSUE_BENEFIT';

export interface Action {
  type: ActionType;
  role: UserRole;
  precondition: string;
  result: {
    status?: ApplicationStatus;
    event?: string;
    update?: string[];
    create?: string[];
  };
}

// Определение разрешений для каждой роли
export const ROLE_PERMISSIONS: Record<UserRole, ActionType[]> = {
  SPECIALIST: [
    'OPEN_EDIT_APPLICANT',
    'ADD_ANOTHER_PASSPORT',
    'GET_MSEK_REF',
    'CHECK_JUVENILE_SERVICE',
    'UPDATE_BENEFIT_CATEGORY',
    'SELECT_BANK',
    'MANAGE_FAMILY_MEMBER',
    'MANAGE_INCOME',
    'CALCULATE_BENEFIT',
    'SUBMIT_FOR_APPROVAL',
    'TERMINATE_BENEFIT',
    'REISSUE_BENEFIT'
  ],
  DIRECTOR: [
    'APPROVE_APPLICATION',
    'REJECT_APPLICATION',
    'EXTEND_BENEFIT',
    'TERMINATE_BENEFIT',
    'REISSUE_BENEFIT'
  ],
  ACCOUNTANT: [
    'TRANSFER_PAYMENT'
  ],
  ADMIN: [
    'DELETE_RECALCULATION'
  ]
};

// Определение действий согласно ТУ
export const ACTIONS: Action[] = [
  {
    type: 'OPEN_EDIT_APPLICANT',
    role: 'SPECIALIST',
    precondition: 'application.status IN ["DRAFT", "UNDER_REVIEW"]',
    result: {
      update: ['applicant', 'identity_doc'],
      event: 'APPLICANT_UPDATED'
    }
  },
  {
    type: 'ADD_ANOTHER_PASSPORT',
    role: 'SPECIALIST',
    precondition: 'identity_doc.is_primary = true',
    result: {
      create: ['identity_doc'],
      event: 'IDENTITY_DOC_ADDED'
    }
  },
  {
    type: 'GET_MSEK_REF',
    role: 'SPECIALIST',
    precondition: 'applicant.pin IS NOT NULL',
    result: {
      create: ['disability_msek_ref'],
      event: 'MSEK_REF_REQUESTED'
    }
  },
  {
    type: 'CHECK_JUVENILE_SERVICE',
    role: 'SPECIALIST',
    precondition: 'family_member.type = "child"',
    result: {
      create: ['juvenile_service_ref'],
      event: 'JUVENILE_SERVICE_CHECKED'
    }
  },
  {
    type: 'UPDATE_BENEFIT_CATEGORY',
    role: 'SPECIALIST',
    precondition: 'applicant_category.is_active = true',
    result: {
      update: ['applicant_category'],
      event: 'BENEFIT_CATEGORY_UPDATED'
    }
  },
  {
    type: 'SELECT_BANK',
    role: 'SPECIALIST',
    precondition: 'contact.value IS NOT NULL',
    result: {
      create: ['payment_requisite'],
      event: 'BANK_SELECTED'
    }
  },
  {
    type: 'MANAGE_FAMILY_MEMBER',
    role: 'SPECIALIST',
    precondition: 'application.status IN ["DRAFT", "UNDER_REVIEW"]',
    result: {
      update: ['family_member'],
      event: 'FAMILY_MEMBER_CHANGED'
    }
  },
  {
    type: 'MANAGE_INCOME',
    role: 'SPECIALIST',
    precondition: 'application.status = "UNDER_REVIEW"',
    result: {
      update: ['income', 'household_metrics'],
      event: 'INCOME_CHANGED'
    }
  },
  {
    type: 'CALCULATE_BENEFIT',
    role: 'SPECIALIST',
    precondition: 'all_required_data_complete',
    result: {
      create: ['calculation'],
      event: 'BENEFIT_CALCULATED'
    }
  },
  {
    type: 'SUBMIT_FOR_APPROVAL',
    role: 'SPECIALIST',
    precondition: 'all_validations_passed',
    result: {
      status: 'PENDING_APPROVAL',
      event: 'SUBMITTED_FOR_APPROVAL'
    }
  },
  {
    type: 'APPROVE_APPLICATION',
    role: 'DIRECTOR',
    precondition: 'application.status = "PENDING_APPROVAL"',
    result: {
      status: 'APPROVED',
      create: ['benefit_assignment', 'calculation'],
      event: 'APPLICATION_APPROVED'
    }
  },
  {
    type: 'REJECT_APPLICATION',
    role: 'DIRECTOR',
    precondition: 'application.status = "PENDING_APPROVAL"',
    result: {
      status: 'REJECTED',
      event: 'APPLICATION_REJECTED'
    }
  },
  {
    type: 'EXTEND_BENEFIT',
    role: 'DIRECTOR',
    precondition: 'benefit_assignment.status = "ACTIVE"',
    result: {
      create: ['benefit_assignment'],
      event: 'BENEFIT_EXTENDED'
    }
  },
  {
    type: 'TERMINATE_BENEFIT',
    role: 'SPECIALIST',
    precondition: 'benefit_assignment.status = "ACTIVE"',
    result: {
      status: 'TERMINATED',
      create: ['termination'],
      event: 'BENEFIT_TERMINATED'
    }
  },
  {
    type: 'DELETE_RECALCULATION',
    role: 'ADMIN',
    precondition: 'recalculation.status = "PENDING"',
    result: {
      update: ['recalculation'],
      event: 'RECALCULATION_DELETED'
    }
  },
  {
    type: 'TRANSFER_PAYMENT',
    role: 'ACCOUNTANT',
    precondition: 'benefit_assignment.status = "ACTIVE"',
    result: {
      update: ['payment_requisite'],
      event: 'PAYMENT_TRANSFERRED'
    }
  },
  {
    type: 'REISSUE_BENEFIT',
    role: 'SPECIALIST',
    precondition: 'valid_reissue_reason',
    result: {
      create: ['reissue'],
      event: 'BENEFIT_REISSUED'
    }
  }
];

// Проверка разрешения на действие
export const hasPermission = (role: UserRole, action: ActionType): boolean => {
  return ROLE_PERMISSIONS[role].includes(action);
};

// Получение доступных действий для роли и статуса
export const getAvailableActions = (role: UserRole, status: ApplicationStatus): ActionType[] => {
  return ACTIONS
    .filter(action => action.role === role)
    .map(action => action.type);
};

// Проверка предварительных условий
export const checkPrecondition = (action: ActionType, context: any): boolean => {
  const actionDef = ACTIONS.find(a => a.type === action);
  if (!actionDef) return false;
  
  // Здесь должна быть логика проверки предварительных условий
  // В реальной реализации это будет более сложная логика
  return true;
};

// Выполнение действия
export const executeAction = (action: ActionType, context: any): {
  success: boolean;
  result?: any;
  error?: string;
} => {
  const actionDef = ACTIONS.find(a => a.type === action);
  if (!actionDef) {
    return {
      success: false,
      error: 'Действие не найдено'
    };
  }
  
  if (!checkPrecondition(action, context)) {
    return {
      success: false,
      error: 'Предварительные условия не выполнены'
    };
  }
  
  // Здесь должна быть логика выполнения действия
  // В реальной реализации это будет обращение к API
  
  return {
    success: true,
    result: actionDef.result
  };
};

// Получение следующего статуса после действия
export const getNextStatus = (currentStatus: ApplicationStatus, action: ActionType): ApplicationStatus | null => {
  const actionDef = ACTIONS.find(a => a.type === action);
  if (!actionDef || !actionDef.result.status) {
    return null;
  }
  
  return actionDef.result.status;
};

// Валидация перехода статусов
export const isValidStatusTransition = (from: ApplicationStatus, to: ApplicationStatus): boolean => {
  const validTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
    'DRAFT': ['UNDER_REVIEW', 'PENDING_APPROVAL'],
    'UNDER_REVIEW': ['DRAFT', 'PENDING_APPROVAL'],
    'PENDING_APPROVAL': ['APPROVED', 'REJECTED'],
    'APPROVED': ['ACTIVE'],
    'REJECTED': ['DRAFT'],
    'ACTIVE': ['SUSPENDED', 'TERMINATED'],
    'SUSPENDED': ['ACTIVE', 'TERMINATED'],
    'TERMINATED': []
  };
  
  return validTransitions[from]?.includes(to) || false;
};
