// Мапперы для преобразования данных между формой и DDL структурами

import { 
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
  HouseholdMetrics
} from './types-updated';

// Типы данных формы (текущая структура)
export interface FormData {
  // Основная информация заявителя
  applicant: {
    pin: string;
    fullName: string;
    gender: string;
    birthDate: string;
    citizenship: string;
    nationality?: string;
    education?: string;
    maritalStatus?: string;
    applicantCategory?: string;
    socialProtectionAuthority?: string;
  };
  
  // Дополнительные удостоверения
  additionalIds: Array<{
    id: number;
    type: string;
    series: string;
    number: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate: string;
  }>;
  
  // Орган соцзащиты и категории
  socialAuthority: {
    municipalAuthority: string;
    applicantType: string;
    category: string;
    disabilityCategory: string;
    msekRefNumber: string;
    msekIssueDate: string;
    dsuRefNumber: string;
    dsuIssueDate: string;
  };
  
  // Категории (чекбоксы)
  categories: {
    forChild: boolean;
    forFamilyWithChild: boolean;
    forMinor: boolean;
    forIncapacitated: boolean;
  };
  
  // Платежные реквизиты
  paymentRequisites: {
    personalAccount: string;
    bankAccount: string;
    cardAccount: string;
    bankCode: string;
    paymentType: string;
  };
  
  // Адреса
  addresses: Array<{
    id: number;
    type: 'REG' | 'FACT';
    regionCode: string;
    raionCode: string;
    localityCode: string;
    street: string;
    house: string;
    flat: string;
    postalCode: string;
    isPrimary: boolean;
  }>;
  
  // Контакты
  contacts: Array<{
    id: number;
    type: string;
    value: string;
    isPrimary: boolean;
  }>;
  
  // Члены семьи
  familyMembers: Array<{
    id: number;
    type: 'adult' | 'child';
    fullName: string;
    birthDate: string;
    age: number;
    gender: string;
    relation: string;
    citizenship: string;
    documentType: string;
    documentNumber: string;
    childCategory: string;
    birthCertificate: {
      number: string;
      issueDate: string;
      issuingAuthority: string;
    };
    income: {
      salary: number;
      pension: number;
      benefit: number;
      businessIncome: number;
      propertyIncome: number;
      agriculturalIncome: number;
      otherIncome: number;
    };
  }>;
  
  // Подсобное хозяйство
  subsidiaryFarming: {
    landPlots: Array<{
      id: number;
      type: string;
      area: number;
      unit: string;
    }>;
    livestock: Array<{
      id: number;
      type: string;
      count: number;
    }>;
    vehicles: Array<{
      id: number;
      type: string;
      year: number;
      model: string;
    }>;
  };
  
  // Доходы семьи
  familyIncome: {
    mainIncome: {
      salary: number;
      pension: number;
      socialBenefits: number;
      otherMainIncome: number;
    };
    educationIncome: {
      scholarships: number;
      trainingIncome: number;
      otherEducationIncome: number;
    };
    otherIncome: {
      alimony: number;
      rent: number;
      assistance: number;
      otherMiscIncome: number;
    };
    businessIncome: {
      businessRevenue: number;
      taxData: {
        taxNumber: string;
        taxPeriod: string;
        declaredIncome: number;
      };
    };
    financialAssets: Array<{
      id: number;
      type: string;
      amount: number;
      monthlyIncome: number;
    }>;
  };
  
  // Документы
  documents: {
    applicantPassport: {
      file: File | null;
      fileName: string;
      fileSize: number;
      isValid: boolean;
      error: string;
    };
    childrenBirthCertificates: Array<{
      childId: number;
      file: File | null;
      fileName: string;
      fileSize: number;
      isValid: boolean;
      error: string;
    }>;
    familyCompositionCertificate: {
      file: File | null;
      fileName: string;
      fileSize: number;
      isValid: boolean;
      error: string;
    };
    incomeCertificates: Array<{
      id: number;
      incomeType: string;
      file: File | null;
      fileName: string;
      fileSize: number;
      isValid: boolean;
      error: string;
      isRequired: boolean;
    }>;
    probationCertificate: {
      file: File | null;
      fileName: string;
      fileSize: number;
      isValid: boolean;
      error: string;
      isRequired: boolean;
    };
    additionalDocuments: Array<{
      id: number;
      documentType: string;
      file: File | null;
      fileName: string;
      fileSize: number;
      isValid: boolean;
      error: string;
      isRequired: boolean;
    }>;
  };
  
  // Согласия
  consents: {
    personalDataConsent: boolean;
    childrenDataConsent: boolean;
    dataAccuracyConfirmation: boolean;
    terminationConditionsAcknowledgment: boolean;
  };
  
  // Специальные компенсации
  specialCompensations: Array<{
    id: number;
    reason: string;
    type: string;
    amount: number;
    periodFrom: string;
    periodTo: string;
  }>;
  
  // Возвраты
  refunds: Array<{
    id: number;
    reason: string;
    returnDate: string;
    amount: number;
  }>;
}

// Маппер: Форма → DDL структуры
export const mapFormToDDL = (formData: FormData, applicationId: number) => {
  const now = new Date().toISOString();
  
  // 1. Заявитель
  const applicant: Omit<Applicant, 'id'> = {
    pin: formData.applicant.pin,
    fullName: formData.applicant.fullName,
    genderCode: formData.applicant.gender as 'M' | 'F',
    birthDate: formData.applicant.birthDate,
    age: calculateAge(formData.applicant.birthDate),
    citizenshipCode: formData.applicant.citizenship,
    nationalityCode: formData.applicant.nationality,
    educationCode: formData.applicant.education,
    maritalStatus: formData.applicant.maritalStatus,
    applicantCategory: formData.applicant.applicantCategory,
    socialProtectionAuthority: formData.applicant.socialProtectionAuthority,
    language: 'ru',
    isActive: true,
    createdAt: now,
    updatedAt: now
  };
  
  // 2. Дополнительные удостоверения
  const additionalIds: Omit<AdditionalIdentity, 'id'>[] = formData.additionalIds.map(item => ({
    applicantId: 0, // будет установлен после создания заявителя
    idType: item.type as 'military' | 'special',
    series: item.series,
    number: item.number,
    issuingAuthority: item.issuingAuthority,
    issueDate: item.issueDate,
    expiryDate: item.expiryDate,
    isActive: true,
    createdAt: now,
    updatedAt: now
  }));
  
  // 3. Связь с органами соцзащиты
  const socialAuthorityLink: Omit<SocialAuthorityLink, 'id'> = {
    applicantId: 0, // будет установлен после создания заявителя
    municipalAuthorityCode: formData.socialAuthority.municipalAuthority,
    applicantTypeCode: formData.socialAuthority.applicantType,
    categoryCode: formData.socialAuthority.category,
    disabilityCategoryCode: formData.socialAuthority.disabilityCategory,
    msekRefNumber: formData.socialAuthority.msekRefNumber,
    msekIssueDate: formData.socialAuthority.msekIssueDate,
    dsuRefNumber: formData.socialAuthority.dsuRefNumber,
    dsuIssueDate: formData.socialAuthority.dsuIssueDate,
    isActive: true,
    createdAt: now,
    updatedAt: now
  };
  
  // 4. Категории заявителя
  const applicantCategories: Omit<ApplicantCategory, 'id'>[] = Object.entries(formData.categories)
    .filter(([_, value]) => value)
    .map(([key, _]) => ({
      applicationId,
      categoryCode: key,
      isException: false,
      assignedDate: now.split('T')[0],
      validFrom: now.split('T')[0],
      validTo: undefined,
      isActive: true,
      createdAt: now,
      updatedAt: now
    }));
  
  // 5. Платежные реквизиты
  const paymentRequisites: Omit<PaymentRequisite, 'id'>[] = [
    {
      applicationId,
      requisiteType: 'PERSONAL',
      personalAccount: formData.paymentRequisites.personalAccount,
      isActive: true,
      createdAt: now,
      updatedAt: now
    },
    {
      applicationId,
      requisiteType: 'BANK',
      bankCode: formData.paymentRequisites.bankCode,
      bankAccount: formData.paymentRequisites.bankAccount,
      isActive: true,
      createdAt: now,
      updatedAt: now
    },
    {
      applicationId,
      requisiteType: 'CARD',
      cardAccount: formData.paymentRequisites.cardAccount,
      isActive: true,
      createdAt: now,
      updatedAt: now
    }
  ].filter(req => req.personalAccount || req.bankAccount || req.cardAccount);
  
  // 6. Адреса
  const addresses: Omit<Address, 'id'>[] = formData.addresses.map(addr => ({
    applicantId: 0, // будет установлен после создания заявителя
    regionCode: addr.regionCode,
    raionCode: addr.raionCode,
    localityCode: addr.localityCode,
    street: addr.street,
    house: addr.house,
    flat: addr.flat,
    addrType: addr.type,
    postalCode: addr.postalCode,
    isPrimary: addr.isPrimary,
    isActive: true,
    createdAt: now,
    updatedAt: now
  }));
  
  // 7. Контакты
  const contacts: Omit<Contact, 'id'>[] = formData.contacts.map(contact => ({
    applicantId: 0, // будет установлен после создания заявителя
    contactTypeCode: contact.type,
    value: contact.value,
    isPrimary: contact.isPrimary,
    isVerified: false,
    createdAt: now,
    updatedAt: now
  }));
  
  // 8. Члены семьи
  const familyMembers: Omit<FamilyMember, 'id'>[] = formData.familyMembers.map(member => ({
    applicationId,
    fullName: member.fullName,
    birthDate: member.birthDate,
    age: member.age,
    genderCode: member.gender as 'M' | 'F',
    relationCode: member.relation,
    pinOrDoc: member.documentNumber,
    citizenshipCode: member.citizenship,
    childCategoryCode: member.childCategory,
    birthCertNo: member.birthCertificate.number,
    birthCertDate: member.birthCertificate.issueDate,
    birthCertIssuer: member.birthCertificate.issuingAuthority,
    disabilityFlag: false, // нужно добавить в форму
    isActive: true,
    createdAt: now,
    updatedAt: now
  }));
  
  // 9. Доходы
  const incomes: Omit<Income, 'id'>[] = [];
  
  // Доходы заявителя (первый член семьи)
  if (formData.familyMembers.length > 0) {
    const applicantIncome = formData.familyMembers[0].income;
    const mainIncome = formData.familyIncome.mainIncome;
    
    // Зарплата
    if (applicantIncome.salary > 0) {
      incomes.push({
        applicationId,
        memberId: 0, // будет установлен после создания члена семьи
        incomeTypeCode: 'SALARY',
        amount: applicantIncome.salary,
        periodicity: 'M',
        periodFrom: now.split('T')[0],
        periodTo: undefined,
        isVerified: false,
        createdAt: now,
        updatedAt: now
      });
    }
    
    // Пенсия
    if (applicantIncome.pension > 0) {
      incomes.push({
        applicationId,
        memberId: 0,
        incomeTypeCode: 'PENSION',
        amount: applicantIncome.pension,
        periodicity: 'M',
        periodFrom: now.split('T')[0],
        periodTo: undefined,
        isVerified: false,
        createdAt: now,
        updatedAt: now
      });
    }
    
    // Социальные пособия
    if (mainIncome.socialBenefits > 0) {
      incomes.push({
        applicationId,
        memberId: 0,
        incomeTypeCode: 'SOCIAL_BENEFITS',
        amount: mainIncome.socialBenefits,
        periodicity: 'M',
        periodFrom: now.split('T')[0],
        periodTo: undefined,
        isVerified: false,
        createdAt: now,
        updatedAt: now
      });
    }
    
    // Предпринимательская деятельность
    if (formData.familyIncome.businessIncome.businessRevenue > 0) {
      incomes.push({
        applicationId,
        memberId: 0,
        incomeTypeCode: 'BUSINESS',
        amount: formData.familyIncome.businessIncome.businessRevenue,
        periodicity: 'M',
        periodFrom: now.split('T')[0],
        periodTo: undefined,
        isVerified: false,
        createdAt: now,
        updatedAt: now
      });
    }
  }
  
  // 10. Земельные участки
  const landPlots: Omit<LandPlot, 'id'>[] = formData.subsidiaryFarming.landPlots.map(plot => ({
    applicationId,
    typeCode: plot.type,
    areaHectare: convertToHectares(plot.area, plot.unit),
    ownershipType: 'OWNED',
    location: '',
    estimatedValue: 0,
    isOwned: true,
    createdAt: now,
    updatedAt: now
  }));
  
  // 11. Скот
  const livestock: Omit<Livestock, 'id'>[] = formData.subsidiaryFarming.livestock.map(item => ({
    applicationId,
    typeCode: item.type,
    qty: item.count,
    convUnits: calculateConventionalUnits(item.type, item.count),
    estimatedValue: 0,
    isOwned: true,
    createdAt: now,
    updatedAt: now
  }));
  
  // 12. Транспортные средства
  const vehicles: Omit<Vehicle, 'id'>[] = formData.subsidiaryFarming.vehicles.map(vehicle => ({
    applicationId,
    typeCode: vehicle.type,
    makeModel: vehicle.model,
    year: vehicle.year,
    isLightCar: vehicle.type === 'car' && (new Date().getFullYear() - vehicle.year) < 20,
    regNo: '',
    estimatedValue: 0,
    isOwned: true,
    createdAt: now,
    updatedAt: now
  }));
  
  // 13. Согласия
  const consents: Omit<Consent, 'id'> = {
    applicantId: 0, // будет установлен после создания заявителя
    pdnSelf: formData.consents.personalDataConsent,
    pdnChildren: formData.consents.childrenDataConsent,
    truthConfirm: formData.consents.dataAccuracyConfirmation,
    termsAck: formData.consents.terminationConditionsAcknowledgment,
    givenAt: now,
    ipAddress: '',
    userAgent: '',
    createdAt: now
  };
  
  // 14. Документы
  const documents: Omit<Document, 'id'>[] = [];
  
  // Паспорт заявителя
  if (formData.documents.applicantPassport.file) {
    documents.push({
      applicationId,
      documentType: 'PASSPORT',
      fileName: formData.documents.applicantPassport.fileName,
      filePath: '', // будет установлен при загрузке
      fileSize: formData.documents.applicantPassport.fileSize,
      mimeType: formData.documents.applicantPassport.file.type,
      uploadedAt: now,
      uploadedBy: 0, // ID пользователя
      status: 'UPLOADED',
      createdAt: now,
      updatedAt: now
    });
  }
  
  // Свидетельства о рождении детей
  formData.documents.childrenBirthCertificates.forEach(cert => {
    if (cert.file) {
      documents.push({
        applicationId,
        documentType: 'BIRTH_CERTIFICATE',
        fileName: cert.fileName,
        filePath: '',
        fileSize: cert.fileSize,
        mimeType: cert.file.type,
        uploadedAt: now,
        uploadedBy: 0,
        status: 'UPLOADED',
        createdAt: now,
        updatedAt: now
      });
    }
  });
  
  // Справка о составе семьи
  if (formData.documents.familyCompositionCertificate.file) {
    documents.push({
      applicationId,
      documentType: 'FAMILY_COMPOSITION',
      fileName: formData.documents.familyCompositionCertificate.fileName,
      filePath: '',
      fileSize: formData.documents.familyCompositionCertificate.fileSize,
      mimeType: formData.documents.familyCompositionCertificate.file.type,
      uploadedAt: now,
      uploadedBy: 0,
      status: 'UPLOADED',
      createdAt: now,
      updatedAt: now
    });
  }
  
  // Справки о доходах
  formData.documents.incomeCertificates.forEach(cert => {
    if (cert.file) {
      documents.push({
        applicationId,
        documentType: 'INCOME_CERTIFICATE',
        fileName: cert.fileName,
        filePath: '',
        fileSize: cert.fileSize,
        mimeType: cert.file.type,
        uploadedAt: now,
        uploadedBy: 0,
        status: 'UPLOADED',
        createdAt: now,
        updatedAt: now
      });
    }
  });
  
  // Дополнительные документы
  formData.documents.additionalDocuments.forEach(doc => {
    if (doc.file) {
      documents.push({
        applicationId,
        documentType: doc.documentType,
        fileName: doc.fileName,
        filePath: '',
        fileSize: doc.fileSize,
        mimeType: doc.file.type,
        uploadedAt: now,
        uploadedBy: 0,
        status: 'UPLOADED',
        createdAt: now,
        updatedAt: now
      });
    }
  });
  
  return {
    applicant,
    additionalIds,
    socialAuthorityLink,
    applicantCategories,
    paymentRequisites,
    addresses,
    contacts,
    familyMembers,
    incomes,
    landPlots,
    livestock,
    vehicles,
    consents,
    documents
  };
};

// Маппер: DDL структуры → Форма
export const mapDDLToForm = (ddlData: any): Partial<FormData> => {
  // Реализация обратного преобразования
  // ...
  return {};
};

// Вспомогательные функции
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function convertToHectares(area: number, unit: string): number {
  switch (unit) {
    case 'соток':
      return area * 0.01; // 1 сотка = 0.01 гектара
    case 'гектаров':
      return area;
    case 'квадратных метров':
      return area / 10000; // 1 га = 10000 м²
    default:
      return area;
  }
}

function calculateConventionalUnits(type: string, count: number): number {
  const conversionRates: { [key: string]: number } = {
    'cow': 1.0,
    'horse': 1.0,
    'sheep': 0.1,
    'goat': 0.1,
    'pig': 0.2,
    'chicken': 0.01,
    'duck': 0.01,
    'goose': 0.01
  };
  
  return count * (conversionRates[type] || 0);
}
