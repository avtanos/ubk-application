'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { regions, incomeCategories } from '@/lib/mockData';
import { calculateBenefit, validateFamilyComposition } from '@/lib/benefitCalculator';
import { 
  genderList, 
  citizenshipList, 
  documentTypeList, 
  passportIssuingAuthorityList,
  regionList,
  localityList,
  applicantTypes,
  municipalAuthorities,
  familyRelationTypes,
  childCategoryList,
  getDirectory,
  incomeTypeList,
  propertyTypeList,
  landPlotTypeList,
  livestockTypeList,
  financialAssetsList,
  vehicleTypeList,
  // Новые справочники для ТУ
  militaryDocTypeList,
  specialDocTypeList,
  nationalityList,
  educationLevelList,
  categoryList,
  disabilityCategories,
  bankList,
  paymentTypeList,
  contactTypeList,
  compensationReasonList,
  compensationTypeList,
  refusalReasons
} from '@/lib/directories';
import { 
  validatePin, 
  validateDocumentSeriesNumber, 
  validateDocumentDates, 
  validatePhone, 
  validateEmail, 
  validateChildAge, 
  validateIncomeAmount, 
  validateLandArea, 
  validateVehicleAge, 
  validateCalculationCoeffs, 
  validateRequiredFields, 
  validateConsents, 
  validateAddress, 
  validateContacts 
} from '@/lib/validations';
import { 
  calculateHouseholdMetrics, 
  checkBenefitEligibility, 
  getApplicationStatus, 
  formatCurrency as formatCurrencyCalc 
} from '@/lib/calculations';
import { 
  auditLogger, 
  decisionProtocolManager, 
  auditUtils 
} from '@/lib/audit';
import { applicationService } from '@/lib/api/applicationService';

export default function NewApplication() {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  
  // API сервис уже импортирован
  
  // Заявитель (отдельно от семьи)
  const [applicant, setApplicant] = useState({
    pin: '',
    fullName: '',
    gender: '',
    birthDate: '',
    citizenship: '',
    nationality: '',
    education: '',
    maritalStatus: '',
    applicantCategory: '',
    socialProtectionAuthority: '',
    // Документные данные
    documentType: '',
    documentSeries: '',
    documentNumber: '',
    documentIssueDate: '',
    passportIssuingAuthority: '',
    documentExpiryDate: ''
  });

  // Члены семьи (без заявителя)
  const [familyMembers, setFamilyMembers] = useState<Array<{
    id: number;
    type: 'adult' | 'child';
    fullName: string;
    pin: string;
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
    disabilityFlag: boolean;
  }>>([]);

  // Земельные участки
  const [landPlots, setLandPlots] = useState<Array<{
    id: number;
    typeCode: string;
    areaHectare: number;
    ownershipType?: string;
    location?: string;
    estimatedValue?: number;
    isOwned: boolean;
  }>>([{
    id: 1,
    typeCode: '',
    areaHectare: 0,
    ownershipType: 'OWNED',
    location: '',
    estimatedValue: 0,
    isOwned: true
  }]);

  // Единица измерения для земельных участков
  const [landMeasurementUnit, setLandMeasurementUnit] = useState<'соток' | 'га' | 'м²'>('га');

  // Скот
  const [livestock, setLivestock] = useState<Array<{
    id: number;
    typeCode: string;
    qty: number;
    convUnits: number;
    estimatedValue?: number;
    isOwned: boolean;
  }>>([{
    id: 1,
    typeCode: '',
    qty: 0,
    convUnits: 0,
    estimatedValue: 0,
    isOwned: true
  }]);

  // Транспортные средства
  const [vehicles, setVehicles] = useState<Array<{
    id: number;
    typeCode: string;
    makeModel?: string;
    year: number;
    isLightCar: boolean;
    regNo?: string;
    estimatedValue?: number;
    isOwned: boolean;
  }>>([{
    id: 1,
    typeCode: '',
    makeModel: '',
    year: new Date().getFullYear(),
    isLightCar: false,
    regNo: '',
    estimatedValue: 0,
    isOwned: true
  }]);

  // Доходы (массив для каждого члена семьи)
  const [incomes, setIncomes] = useState<Array<{
    id: number;
    memberId?: number; // ссылка на члена семьи
    incomeTypeCode: string;
    amount: number;
    periodicity: 'M' | 'Y';
    periodFrom: string;
    periodTo?: string;
    sourceRef?: string;
  }>>([]);

  // Адреса
  const [addresses, setAddresses] = useState<Array<{
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
  }>>([{
    id: 1,
    type: 'REG',
    regionCode: '',
    raionCode: '',
    localityCode: '',
    street: '',
    house: '',
    flat: '',
    postalCode: '',
    isPrimary: true
  }]);

  // Контакты
  const [contacts, setContacts] = useState<Array<{
    id: number;
    type: string;
    value: string;
    isPrimary: boolean;
  }>>([{
    id: 1,
    type: 'mobile',
    value: '',
    isPrimary: true
  }]);

  // Дополнительные удостоверения
  const [additionalIds, setAdditionalIds] = useState<Array<{
    id: number;
    type: string;
    series: string;
    number: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate: string;
  }>>([]);

  // Орган соцзащиты и категории
  const [socialAuthority, setSocialAuthority] = useState({
    municipalAuthority: '',
    applicantType: '',
    category: '',
    disabilityCategory: '',
    msekRefNumber: '',
    msekIssueDate: '',
    dsuRefNumber: '',
    dsuIssueDate: ''
  });

  // Категории (чекбоксы)
  const [categories, setCategories] = useState({
    forChild: false,
    forFamilyWithChild: false,
    forMinor: false,
    forIncapacitated: false
  });

  // Платежные реквизиты
  const [paymentRequisites, setPaymentRequisites] = useState({
    personalAccount: '',
    bankAccount: '',
    cardAccount: '',
    bankCode: '',
    paymentType: ''
  });

  // Специальные компенсации
  const [specialCompensations, setSpecialCompensations] = useState<Array<{
    id: number;
    reason: string;
    type: string;
    amount: number;
    periodFrom: string;
    periodTo: string;
  }>>([]);

  // Возвраты
  const [refunds, setRefunds] = useState<Array<{
    id: number;
    reason: string;
    returnDate: string;
    amount: number;
  }>>([]);

  // Состояние для документов
  const [documents, setDocuments] = useState({
    // Паспорт заявителя
    applicantPassport: {
      file: null as File | null,
      fileName: '',
      fileSize: 0,
      isValid: false,
      error: ''
    },
    // Свидетельства о рождении детей
    childrenBirthCertificates: [] as Array<{
      childId: number;
      file: File | null;
      fileName: string;
      fileSize: number;
      isValid: boolean;
      error: string;
    }>,
    // Справка о составе семьи
    familyCompositionCertificate: {
      file: null as File | null,
      fileName: '',
      fileSize: 0,
      isValid: false,
      error: ''
    },
    // Справки о доходах
    incomeCertificates: [] as Array<{
      id: number;
      incomeType: string;
      file: File | null;
      fileName: string;
      fileSize: number;
      isValid: boolean;
      error: string;
      isRequired: boolean;
    }>,
    // Справка от органа пробации
    probationCertificate: {
      file: null as File | null,
      fileName: '',
      fileSize: 0,
      isValid: false,
      error: '',
      isRequired: false
    },
    // Дополнительные документы
    additionalDocuments: [] as Array<{
      id: number;
      documentType: string;
      file: File | null;
      fileName: string;
      fileSize: number;
      isValid: boolean;
      error: string;
      isRequired: boolean;
    }>
  });

  // Состояние для завершающего раздела
  const [completionData, setCompletionData] = useState({
    // Согласия
    personalDataConsent: false,
    childrenDataConsent: false,
    // Подтверждения
    dataAccuracyConfirmation: false,
    terminationConditionsAcknowledgment: false,
    // Подписи
    applicantSignature: '',
    specialistSignature: '',
    // Номер заявления
    applicationNumber: '',
    // Протокол решения
    decisionProtocol: {
      decision: '', // 'approved' | 'rejected'
      reason: '',
      date: '',
      specialistName: '',
      specialistPosition: ''
    }
  });

  // Состояние для валидаций
  const [validations, setValidations] = useState({
    pin: { isValid: true, error: '' },
    document: { isValid: true, error: '' },
    phone: { isValid: true, error: '' },
    email: { isValid: true, error: '' },
    childAge: { isValid: true, error: '' },
    income: { isValid: true, error: '' },
    landArea: { isValid: true, error: '' },
    vehicleAge: { isValid: true, error: '' },
    calculation: { isValid: true, error: '' },
    address: { isValid: true, error: '' },
    contacts: { isValid: true, error: '' },
    consents: { isValid: true, error: '' }
  });

  // Состояние для авторасчетов
  const [householdMetrics, setHouseholdMetrics] = useState({
    totalIncomeMonth: 0,
    perCapitaIncome: 0,
    convUnitsTotal: 0,
    criteriaFlags: {
      incomeEligible: true,
      propertyEligible: true,
      familyEligible: true,
      vehicleEligible: true
    },
    guaranteedMinimumIncome: 15000,
    applicationStatus: 'PENDING' as 'ELIGIBLE' | 'INELIGIBLE' | 'PENDING',
    statusMessage: ''
  });

  // Состояние для отправки заявки
  const [submitState, setSubmitState] = useState({
    isSubmitting: false,
    isSubmitted: false,
    submitError: null as string | null,
    applicationId: null as number | null
  });

  // Новое состояние для ТУ полей
  const [tuData, setTuData] = useState({
    // Дополнительные удостоверения
    additionalIds: [] as Array<{
      id: number;
      type: string; // 'military', 'special'
      series: string;
      number: string;
      issuingAuthority: string;
      issueDate: string;
      expiryDate: string;
    }>,
    // Орган соцзащиты и категории
    socialAuthority: {
      municipalAuthority: '',
      applicantType: '',
      category: '',
      disabilityCategory: '',
      msekRefNumber: '',
      msekIssueDate: '',
      dsuRefNumber: '',
      dsuIssueDate: ''
    },
    // Категории (чекбоксы)
    categories: {
      forChild: false,
      forFamilyWithChild: false,
      forMinor: false,
      forIncapacitated: false
    },
    // Платежные реквизиты
    paymentRequisites: {
      personalAccount: '',
      bankAccount: '',
      cardAccount: '',
      bankCode: '',
      paymentType: ''
    },
    // Адреса (REG/FACT)
    addresses: [] as Array<{
      id: number;
      type: 'REG' | 'FACT'; // регистрация/фактический
      regionCode: string;
      raionCode: string;
      localityCode: string;
      street: string;
      house: string;
      flat: string;
      postalCode: string;
      isPrimary: boolean;
    }>,
    // Контакты (мульти)
    contacts: [] as Array<{
      id: number;
      type: string; // 'mobile', 'home', 'email', 'other'
      value: string;
      isPrimary: boolean;
    }>,
    // Специальные компенсации
    specialCompensations: [] as Array<{
      id: number;
      reason: string;
      type: string;
      amount: number;
      periodFrom: string;
      periodTo: string;
    }>,
    // Возвраты
    refunds: [] as Array<{
      id: number;
      reason: string;
      returnDate: string;
      amount: number;
    }>
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Функция для добавления нового члена семьи
  const addFamilyMember = (type: 'adult' | 'child') => {
    const newMember = {
      id: Date.now(),
      type,
      fullName: '',
      pin: '',
      birthDate: '',
      age: 0,
      gender: '',
      relation: '',
      citizenship: '',
      documentType: '',
      documentNumber: '',
      childCategory: '',
      birthCertificate: {
        number: '',
        issueDate: '',
        issuingAuthority: ''
      },
      disabilityFlag: false
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  // Функция для удаления члена семьи
  const removeFamilyMember = (id: number) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter(member => member.id !== id));
    }
  };

  // Функция для обновления данных заявителя
  const updateApplicant = (field: string, value: any) => {
    setApplicant(prev => ({ ...prev, [field]: value }));
  };

  // Функция для обновления данных члена семьи
  const updateFamilyMember = (id: number, field: string, value: any) => {
    setFamilyMembers(prevMembers => 
      prevMembers.map(member => {
        if (member.id === id) {
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            const parentValue = member[parent as keyof typeof member] as any;
            return {
              ...member,
              [parent]: {
                ...parentValue,
                [child]: value
              }
            };
          }
          return { ...member, [field]: value };
        }
        return member;
      })
    );
  };

  // Функция для автоматического расчета возраста
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Функция для определения типа члена семьи на основе родства
  const getMemberTypeFromRelation = (relation: string) => {
    const childRelations = [
      'son', 'daughter', 'grandson', 'granddaughter', 'ward', 
      'adopted_son', 'adopted_daughter', 'stepson', 'stepdaughter', 
      'nephew', 'niece'
    ];
    return childRelations.includes(relation) ? 'child' : 'adult';
  };

  // Функции для управления подсобным хозяйством (удалены - перенесены ниже)

  // Старые функции удалены

  // Старые функции для скота удалены

  // Старые функции для транспортных средств удалены

  // Функции удалены - используются новые структуры данных

  // Функция для конвертации площади в гектары
  const convertToHectares = (area: number, unit: 'соток' | 'га' | 'м²') => {
    switch (unit) {
      case 'соток':
        return area * 0.01; // 1 соток = 0.01 га
      case 'га':
        return area;
      case 'м²':
        return area / 10000; // 1 га = 10000 м²
      default:
        return area;
    }
  };

  // Функция для расчета общей стоимости имущества в МПЦ
  const calculateTotalPropertyValue = () => {
    // Расчет стоимости земли (в гектарах)
    const landValue = landPlots.reduce((sum, plot) => {
      const areaInHectares = convertToHectares(plot.areaHectare, landMeasurementUnit);
      // Примерная стоимость 1 га земли (можно настроить)
      const landPricePerHectare = 100000; // 100,000 сом за гектар
      return sum + (areaInHectares * landPricePerHectare);
    }, 0);

    // Расчет стоимости скота
    const livestockValue = livestock.reduce((sum, item) => {
      // Примерная стоимость за условную голову скота
      const pricePerUnit = 50000; // 50,000 сом за условную голову
      return sum + (item.convUnits * pricePerUnit);
    }, 0);

    // Расчет стоимости транспортных средств
    const vehicleValue = vehicles.reduce((sum, vehicle) => {
      return sum + (vehicle.estimatedValue || 0);
    }, 0);

    // Конвертация в МПЦ (1 МПЦ = 1,000,000 сом)
    const totalValueInSoms = landValue + livestockValue + vehicleValue;
    return totalValueInSoms / 1000000; // Конвертация в МПЦ
  };

  // Функция для расчета суммарного дохода семьи
  const calculateTotalFamilyIncome = () => {
    return incomes.reduce((total, income) => {
      if (income.periodicity === 'M') {
        return total + income.amount;
      } else if (income.periodicity === 'Y') {
        return total + (income.amount / 12);
      }
      return total;
    }, 0);
  };

  // Функция для расчета среднедушевого дохода (ССДС)
  const calculatePerCapitaIncome = () => {
    const totalIncome = calculateTotalFamilyIncome();
    const familySize = familyMembers.length;
    return familySize > 0 ? totalIncome / familySize : 0;
  };

  // Гарантированный минимальный доход (ГМД) - примерное значение
  const GUARANTEED_MINIMUM_INCOME = 15000; // 15,000 сом в месяц

  // Функция для проверки соответствия критерию дохода
  const isIncomeEligible = () => {
    const perCapitaIncome = calculatePerCapitaIncome();
    return perCapitaIncome <= GUARANTEED_MINIMUM_INCOME;
  };

  // Функции для управления документами
  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    if (file.size > maxSize) {
      return { isValid: false, error: language === 'ru' ? 'Размер файла не должен превышать 5MB' : 'Файлдын көлөмү 5MB дан ашпашы керек' };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: language === 'ru' ? 'Разрешены только файлы JPG, PNG, PDF' : 'JPG, PNG, PDF файлдары гана уруксат' };
    }
    
    return { isValid: true, error: '' };
  };

  const updateApplicantPassport = (file: File | null) => {
    if (!file) {
      setDocuments(prev => ({
      ...prev,
        applicantPassport: {
          file: null,
          fileName: '',
          fileSize: 0,
          isValid: false,
          error: ''
        }
      }));
      return;
    }

    const validation = validateFile(file);
    setDocuments(prev => ({
      ...prev,
      applicantPassport: {
        file,
        fileName: file.name,
        fileSize: file.size,
        isValid: validation.isValid,
        error: validation.error
      }
    }));
  };

  const updateFamilyCompositionCertificate = (file: File | null) => {
    if (!file) {
      setDocuments(prev => ({
        ...prev,
        familyCompositionCertificate: {
          file: null,
          fileName: '',
          fileSize: 0,
          isValid: false,
          error: ''
        }
      }));
      return;
    }

    const validation = validateFile(file);
    setDocuments(prev => ({
      ...prev,
      familyCompositionCertificate: {
        file,
        fileName: file.name,
        fileSize: file.size,
        isValid: validation.isValid,
        error: validation.error
      }
    }));
  };

  const updateProbationCertificate = (file: File | null) => {
    if (!file) {
      setDocuments(prev => ({
        ...prev,
        probationCertificate: {
          file: null,
          fileName: '',
          fileSize: 0,
          isValid: false,
          error: '',
          isRequired: false
        }
      }));
      return;
    }

    const validation = validateFile(file);
    setDocuments(prev => ({
      ...prev,
      probationCertificate: {
        file,
        fileName: file.name,
        fileSize: file.size,
        isValid: validation.isValid,
        error: validation.error,
        isRequired: true
      }
    }));
  };

  const addIncomeCertificate = () => {
    const newCertificate = {
      id: Date.now(),
      incomeType: '',
      file: null,
      fileName: '',
      fileSize: 0,
      isValid: false,
      error: '',
      isRequired: false
    };
    setDocuments(prev => ({
      ...prev,
      incomeCertificates: [...prev.incomeCertificates, newCertificate]
    }));
  };

  const removeIncomeCertificate = (id: number) => {
    setDocuments(prev => ({
      ...prev,
      incomeCertificates: prev.incomeCertificates.filter(cert => cert.id !== id)
    }));
  };

  const updateIncomeCertificate = (id: number, field: string, value: any) => {
    setDocuments(prev => ({
      ...prev,
      incomeCertificates: prev.incomeCertificates.map(cert => {
        if (cert.id === id) {
          if (field === 'file' && value) {
            const validation = validateFile(value);
            return {
              ...cert,
              file: value,
              fileName: value.name,
              fileSize: value.size,
              isValid: validation.isValid,
              error: validation.error
            };
          }
          return { ...cert, [field]: value };
        }
        return cert;
      })
    }));
  };

  const addAdditionalDocument = () => {
    const newDocument = {
      id: Date.now(),
      documentType: '',
      file: null,
      fileName: '',
      fileSize: 0,
      isValid: false,
      error: '',
      isRequired: false
    };
    setDocuments(prev => ({
      ...prev,
      additionalDocuments: [...prev.additionalDocuments, newDocument]
    }));
  };

  const removeAdditionalDocument = (id: number) => {
    setDocuments(prev => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter(doc => doc.id !== id)
    }));
  };

  const updateAdditionalDocument = (id: number, field: string, value: any) => {
    setDocuments(prev => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.map(doc => {
        if (doc.id === id) {
          if (field === 'file' && value) {
            const validation = validateFile(value);
            return {
              ...doc,
              file: value,
              fileName: value.name,
              fileSize: value.size,
              isValid: validation.isValid,
              error: validation.error
            };
          }
          return { ...doc, [field]: value };
        }
        return doc;
      })
    }));
  };

  // Функция для обновления свидетельств о рождении детей
  const updateChildBirthCertificate = (childId: number, file: File | null) => {
    if (!file) {
      setDocuments(prev => ({
        ...prev,
        childrenBirthCertificates: prev.childrenBirthCertificates.filter(cert => cert.childId !== childId)
      }));
      return;
    }

    const validation = validateFile(file);
    const existingIndex = documents.childrenBirthCertificates.findIndex(cert => cert.childId === childId);
    
    const newCertificate = {
      childId,
      file,
      fileName: file.name,
      fileSize: file.size,
      isValid: validation.isValid,
      error: validation.error
    };

    setDocuments(prev => ({
      ...prev,
      childrenBirthCertificates: existingIndex >= 0 
        ? prev.childrenBirthCertificates.map(cert => cert.childId === childId ? newCertificate : cert)
        : [...prev.childrenBirthCertificates, newCertificate]
    }));
  };

  // Функция для определения обязательности справок о доходах
  const isIncomeCertificateRequired = (incomeType: string) => {
    const requiredTypes = ['salary', 'business', 'pension'];
    return requiredTypes.includes(incomeType);
  };

  // Функция для определения дополнительных документов в зависимости от категории заявителя
  const getRequiredAdditionalDocuments = () => {
    // Здесь можно добавить логику в зависимости от категории заявителя
    // Например, для инвалидов - справка об инвалидности, для безработных - справка из центра занятости
    return [];
  };

  // Функции для завершающего раздела
  const updateCompletionData = (field: string, value: any) => {
    setCompletionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateDecisionProtocol = (field: string, value: any) => {
    setCompletionData(prev => ({
      ...prev,
      decisionProtocol: {
        ...prev.decisionProtocol,
        [field]: value
      }
    }));
  };

  // Функция для детализированного расчета пособия
  const calculateDetailedBenefit = () => {
    const children = familyMembers.filter(member => member.type === 'child');
    const baseAmount = 5000; // Базовая сумма пособия на ребенка
    const coefficient = 1.0; // Коэффициент (может зависеть от региона, категории и т.д.)
    
    // Расчет по каждому ребенку
    const childrenCalculations = children.map((child, index) => {
      const childBase = baseAmount;
      const childCoefficient = coefficient;
      const childAmount = childBase * childCoefficient;
      
      return {
        childName: child.fullName,
        childAge: child.age,
        baseAmount: childBase,
        coefficient: childCoefficient,
        amount: childAmount
      };
    });

    // Общая сумма
    const totalAmount = childrenCalculations.reduce((sum, calc) => sum + calc.amount, 0);
    
    // Надбавки (примерные)
    const allowances = {
      largeFamily: children.length >= 3 ? 1000 : 0, // Многодетная семья
      singleParent: 500, // Мать-одиночка (пример)
      disability: 0, // Надбавка за инвалидность
      other: 0 // Прочие надбавки
    };

    const totalAllowances = Object.values(allowances).reduce((sum, allowance) => sum + allowance, 0);
    const finalAmount = totalAmount + totalAllowances;

    return {
      childrenCalculations,
      totalAmount,
      allowances,
      totalAllowances,
      finalAmount,
      childrenCount: children.length
    };
  };

  // Функция для генерации номера заявления
  const generateApplicationNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `UB-${year}${month}${day}-${random}`;
  };


  // Функция для проверки готовности к отправке
  const isReadyToSubmit = () => {
    return (
      completionData.personalDataConsent &&
      completionData.childrenDataConsent &&
      completionData.dataAccuracyConfirmation &&
      completionData.terminationConditionsAcknowledgment &&
      completionData.applicantSignature
    );
  };

  // Функция для преобразования данных формы в формат API
  const prepareApplicationData = () => {
    const applicationNumber = generateApplicationNumber();
    const currentDate = new Date().toISOString();
    
    // Подготовка данных заявителя
    const applicantData = {
      pin: applicant.pin,
      fullName: applicant.fullName,
      genderCode: applicant.gender as 'M' | 'F',
      birthDate: applicant.birthDate,
      age: calculateAge(applicant.birthDate),
      citizenshipCode: applicant.citizenship,
      nationalityCode: applicant.nationality,
      educationCode: applicant.education,
      maritalStatus: applicant.maritalStatus,
      language: language as 'ru' | 'ky',
      isActive: true,
      createdAt: currentDate,
      updatedAt: currentDate
    };

    // Подготовка основного документа
    const identityDocument = {
      docType: applicant.documentType || '',
      series: applicant.documentSeries || '',
      number: applicant.documentNumber || '',
      issueDate: applicant.documentIssueDate || '',
      issuerCode: applicant.passportIssuingAuthority || '',
      issuingAuthority: applicant.passportIssuingAuthority || '',
      expiryDate: applicant.documentExpiryDate || '',
      isPrimary: true,
      isActive: true,
      createdAt: currentDate,
      updatedAt: currentDate
    };

    // Подготовка дополнительных удостоверений
    const additionalIdentities = tuData.additionalIds.map(id => ({
      idType: id.type as 'military' | 'special',
      series: id.series,
      number: id.number,
      issuingAuthority: id.issuingAuthority,
      issueDate: id.issueDate,
      expiryDate: id.expiryDate,
      isActive: true,
      createdAt: currentDate,
      updatedAt: currentDate
    }));

    // Подготовка адресов
    const addresses = tuData.addresses.map(addr => ({
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
      createdAt: currentDate,
      updatedAt: currentDate
    }));

    // Подготовка контактов
    const contacts = tuData.contacts.map(contact => ({
      contactTypeCode: contact.type,
      value: contact.value,
      isPrimary: contact.isPrimary,
      isVerified: false,
      createdAt: currentDate,
      updatedAt: currentDate
    }));

    // Подготовка членов семьи
    const familyMembersData = familyMembers.map(member => ({
      fullName: member.fullName,
      pin: member.pin,
      birthDate: member.birthDate,
      age: member.age,
      genderCode: member.gender as 'M' | 'F',
      relationCode: member.relation,
      citizenshipCode: member.citizenship,
      documentType: member.documentType,
      documentNumber: member.documentNumber,
      childCategoryCode: member.childCategory,
      disabilityFlag: member.disabilityFlag,
      isActive: true,
      createdAt: currentDate,
      updatedAt: currentDate
    }));

    // Подготовка доходов
    const incomesData = incomes.map(income => ({
      incomeTypeCode: income.incomeTypeCode,
      amount: income.amount,
      periodicity: income.periodicity,
      periodFrom: income.periodFrom,
      periodTo: income.periodTo,
      sourceRef: income.sourceRef,
      createdAt: currentDate,
      updatedAt: currentDate
    }));

    // Подготовка земельных участков
    const landPlotsData = landPlots.map(plot => ({
      typeCode: plot.typeCode,
      areaHectare: plot.areaHectare,
      ownershipType: plot.ownershipType,
      location: plot.location,
      estimatedValue: plot.estimatedValue,
      isOwned: plot.isOwned,
      createdAt: currentDate,
      updatedAt: currentDate
    }));

    // Подготовка скота
    const livestockData = livestock.map(animal => ({
      typeCode: animal.typeCode,
      qty: animal.qty,
      convUnits: animal.convUnits,
      estimatedValue: animal.estimatedValue,
      isOwned: animal.isOwned,
      createdAt: currentDate,
      updatedAt: currentDate
    }));

    // Подготовка транспортных средств
    const vehiclesData = vehicles.map(vehicle => ({
      typeCode: vehicle.typeCode,
      makeModel: vehicle.makeModel,
      year: vehicle.year,
      isLightCar: vehicle.isLightCar,
      regNo: vehicle.regNo,
      estimatedValue: vehicle.estimatedValue,
      isOwned: vehicle.isOwned,
      createdAt: currentDate,
      updatedAt: currentDate
    }));

    // Подготовка согласий
    const consentData = {
      pdnSelf: completionData.personalDataConsent,
      pdnChildren: completionData.childrenDataConsent,
      truthConfirm: completionData.dataAccuracyConfirmation,
      termsAck: completionData.terminationConditionsAcknowledgment,
      givenAt: currentDate,
      ipAddress: '', // Будет заполнено на сервере
      userAgent: navigator.userAgent,
      createdAt: currentDate
    };

    // Подготовка связи с органами соцзащиты
    const socialAuthorityLink = {
      municipalAuthorityCode: tuData.socialAuthority.municipalAuthority,
      applicantTypeCode: tuData.socialAuthority.applicantType,
      categoryCode: tuData.socialAuthority.category,
      disabilityCategoryCode: tuData.socialAuthority.disabilityCategory,
      msekRefNumber: tuData.socialAuthority.msekRefNumber,
      msekIssueDate: tuData.socialAuthority.msekIssueDate,
      dsuRefNumber: tuData.socialAuthority.dsuRefNumber,
      dsuIssueDate: tuData.socialAuthority.dsuIssueDate,
      isActive: true,
      createdAt: currentDate,
      updatedAt: currentDate
    };

    // Подготовка категорий заявителя
    const applicantCategories = Object.entries(tuData.categories)
      .filter(([_, value]) => value)
      .map(([key, _]) => ({
        categoryCode: key,
        isException: false,
        assignedDate: currentDate,
        validFrom: currentDate,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate
      }));

    // Подготовка платежных реквизитов
    const paymentRequisites = [
      {
        requisiteType: 'PERSONAL' as const,
        personalAccount: tuData.paymentRequisites.personalAccount,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        requisiteType: 'BANK' as const,
        bankCode: tuData.paymentRequisites.bankCode,
        bankAccount: tuData.paymentRequisites.bankAccount,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        requisiteType: 'CARD' as const,
        cardAccount: tuData.paymentRequisites.cardAccount,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    ].filter(req => req.personalAccount || req.bankAccount || req.cardAccount);

    // Подготовка заявления
    const applicationData = {
      applicationNumber,
      applicantId: 0, // Будет установлен сервером
      status: 'SUBMITTED' as const,
      submissionDate: currentDate,
      submittedAt: currentDate,
      language: language as 'ru' | 'ky',
      priority: 'NORMAL' as const,
      riskScore: 0,
      inspectionRequired: false,
      isActive: true,
      createdAt: currentDate,
      updatedAt: currentDate,
      // Связанные данные
      applicant: applicantData,
      identityDocument,
      additionalIdentities,
      addresses,
      contacts,
      familyMembers: familyMembersData,
      incomes: incomesData,
      landPlots: landPlotsData,
      livestock: livestockData,
      vehicles: vehiclesData,
      consent: consentData,
      socialAuthorityLink,
      applicantCategories,
      paymentRequisites
    };

    return applicationData;
  };

  // Функция для отправки заявления
  const submitApplication = async () => {
    if (!isReadyToSubmit()) {
      setSubmitState(prev => ({
        ...prev,
        submitError: language === 'ru' ? 'Пожалуйста, заполните все обязательные поля' : 'Сураныч, бардык милдеттүү талааларды толтуруңуз'
      }));
      return;
    }

    setSubmitState(prev => ({
      ...prev,
      isSubmitting: true,
      submitError: null
    }));

    try {
      // Подготовка данных заявления
      const applicationNumber = generateApplicationNumber();
      const currentDate = new Date().toISOString();
      const applicationId = Date.now(); // Используем timestamp как ID
      
      const applicationData = {
        id: applicationId,
        applicationNumber,
        status: 'SUBMITTED' as const,
        submissionDate: currentDate,
        submittedAt: currentDate,
        language: language as 'ru' | 'ky',
        priority: 'NORMAL' as const,
        riskScore: 0,
        inspectionRequired: false,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
        // Данные заявителя
        applicantName: applicant.fullName,
        applicantPin: applicant.pin,
        applicantPhone: tuData.contacts.find(c => c.isPrimary)?.value || '',
        requestedAmount: calculateDetailedBenefit().finalAmount,
        // Полные данные формы
        formData: {
          applicant,
          familyMembers,
          tuData,
          completionData,
          landPlots,
          livestock,
          vehicles,
          incomes
        }
      };

      // Сохранение в localStorage для демонстрации
      const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      existingApplications.push(applicationData);
      localStorage.setItem('applications', JSON.stringify(existingApplications));
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateCompletionData('applicationNumber', applicationNumber);
      
      setSubmitState(prev => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
        applicationId: applicationId
      }));

      // Логирование успешной отправки
      console.log('Заявление успешно отправлено:', applicationData);

      // Отправляем событие для обновления очереди заявок
      window.dispatchEvent(new CustomEvent('applicationSubmitted', {
        detail: { applicationId, applicationNumber }
      }));

      alert(language === 'ru' 
        ? `Заявление №${applicationNumber} успешно отправлено!\n\nЗаявка добавлена в очередь на рассмотрение. Вы можете отслеживать её статус в разделе "Очередь заявок" в личном кабинете.`
        : `№${applicationNumber} арыз ийгиликтүү жөнөтүлдү!\n\nАрыз каралууга кезекке кошулду. Анын абалын жеке кабинеттин "Арыздардын кезеги" бөлүмүндөн көзөмөлдөй аласыз.`
      );
    } catch (error) {
      console.error('Ошибка отправки заявления:', error);
      
      setSubmitState(prev => ({
        ...prev,
        isSubmitting: false,
        submitError: error instanceof Error ? error.message : 'Неизвестная ошибка'
      }));

      alert(language === 'ru' 
        ? `Ошибка отправки заявления: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
        : `Арыз жөнөтүүдө ката: ${error instanceof Error ? error.message : 'Белгисиз ката'}`
      );
    }
  };

  // Функции для управления ТУ данными
  const updateTuData = (field: string, value: any) => {
    setTuData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateTuDataNested = (parent: string, field: string, value: any) => {
    setTuData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev] as any,
        [field]: value
      }
    }));
  };

  // Функции для работы с дополнительными удостоверениями в tuData
  const addTuAdditionalId = () => {
    const newId = Math.max(...tuData.additionalIds.map(a => a.id), 0) + 1;
    setTuData(prev => ({
      ...prev,
      additionalIds: [...prev.additionalIds, {
        id: newId,
        type: 'military',
        series: '',
        number: '',
        issuingAuthority: '',
        issueDate: '',
        expiryDate: ''
      }]
    }));
  };

  const updateTuAdditionalId = (id: number, field: string, value: any) => {
    setTuData(prev => ({
      ...prev,
      additionalIds: prev.additionalIds.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeTuAdditionalId = (id: number) => {
    setTuData(prev => ({
      ...prev,
      additionalIds: prev.additionalIds.filter(item => item.id !== id)
    }));
  };

  // Функции для работы с адресами в tuData
  const addTuAddress = (type: 'REG' | 'FACT' = 'FACT') => {
    const newId = Math.max(...tuData.addresses.map(a => a.id), 0) + 1;
    setTuData(prev => ({
      ...prev,
      addresses: [...prev.addresses, {
        id: newId,
        type,
        regionCode: '',
        raionCode: '',
        localityCode: '',
        street: '',
        house: '',
        flat: '',
        postalCode: '',
        isPrimary: false
      }]
    }));
  };

  const updateTuAddress = (id: number, field: string, value: any) => {
    setTuData(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => 
        addr.id === id ? { ...addr, [field]: value } : addr
      )
    }));
  };

  const removeTuAddress = (id: number) => {
    if (tuData.addresses.length > 1) {
      setTuData(prev => ({
        ...prev,
        addresses: prev.addresses.filter(addr => addr.id !== id)
      }));
    }
  };

  // Функции для работы с контактами в tuData
  const addTuContact = () => {
    const newId = Math.max(...tuData.contacts.map(c => c.id), 0) + 1;
    setTuData(prev => ({
      ...prev,
      contacts: [...prev.contacts, {
        id: newId,
        type: 'mobile',
        value: '',
        isPrimary: false
      }]
    }));
  };

  const updateTuContact = (id: number, field: string, value: any) => {
    setTuData(prev => ({
      ...prev,
      contacts: prev.contacts.map(contact => 
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removeTuContact = (id: number) => {
    if (tuData.contacts.length > 1) {
      setTuData(prev => ({
        ...prev,
        contacts: prev.contacts.filter(contact => contact.id !== id)
      }));
    }
  };

  // Функции для работы со специальными компенсациями в tuData
  const addTuSpecialCompensation = () => {
    const newId = Math.max(...tuData.specialCompensations.map(s => s.id), 0) + 1;
    setTuData(prev => ({
      ...prev,
      specialCompensations: [...prev.specialCompensations, {
        id: newId,
        reason: '',
        type: '',
        amount: 0,
        periodFrom: new Date().toISOString().split('T')[0],
        periodTo: ''
      }]
    }));
  };

  const updateTuSpecialCompensation = (id: number, field: string, value: any) => {
    setTuData(prev => ({
      ...prev,
      specialCompensations: prev.specialCompensations.map(comp => 
        comp.id === id ? { ...comp, [field]: value } : comp
      )
    }));
  };

  const removeTuSpecialCompensation = (id: number) => {
    setTuData(prev => ({
      ...prev,
      specialCompensations: prev.specialCompensations.filter(comp => comp.id !== id)
    }));
  };

  // Старые функции для дополнительных удостоверений удалены

  // Старые функции для адресов удалены

  // Старые функции для контактов удалены

  // Старые функции для специальных компенсаций удалены

  // Интеграции (заглушки)
  const getMsekRef = () => {
    alert(language === 'ru' ? 'Запрос справки МСЭК отправлен' : 'МСЭК справкасынын суроосу жөнөтүлдү');
    // Здесь будет реальная интеграция
    auditLogger.logIntegration('MSEK', 0, 0, 'SPECIALIST', {}, { status: 'success' });
  };

  const checkDsu = () => {
    alert(language === 'ru' ? 'Проверка в ССУ выполнена' : 'ССУда текшерүү аткарылды');
    // Здесь будет реальная интеграция
    auditLogger.logIntegration('DSU', 0, 0, 'SPECIALIST', {}, { status: 'success' });
  };

  // Функции валидации
  const validateField = (field: string, value: any, additionalData?: any) => {
    let result = { isValid: true, error: '' };

    switch (field) {
      case 'pin':
        result = validatePin(value);
        break;
      case 'document':
        if (additionalData) {
          result = validateDocumentSeriesNumber(additionalData.docType, additionalData.series, additionalData.number);
        }
        break;
      case 'phone':
        result = validatePhone(value);
        break;
      case 'email':
        result = validateEmail(value);
        break;
      case 'childAge':
        if (additionalData) {
          result = validateChildAge(additionalData.birthDate, additionalData.applicationDate);
        }
        break;
      case 'income':
        result = validateIncomeAmount(value);
        break;
      case 'landArea':
        result = validateLandArea(value);
        break;
      case 'vehicleAge':
        if (additionalData) {
          result = validateVehicleAge(additionalData.year, additionalData.isLightCar);
        }
        break;
      case 'calculation':
        if (additionalData) {
          result = validateCalculationCoeffs(additionalData.regionCoeff, additionalData.addCoeff);
        }
        break;
      case 'address':
        result = validateAddress(value);
        break;
      case 'contacts':
        result = validateContacts(value);
        break;
      case 'consents':
        result = validateConsents(value);
        break;
    }

    setValidations(prev => ({
      ...prev,
      [field]: result
    }));

    return result;
  };

  // Функция авторасчета показателей домохозяйства
  const calculateHouseholdMetricsData = () => {
    // Подготовка данных для расчета
    const livestockData = livestock.map(item => ({
      type: item.typeCode,
      count: item.qty,
      convUnits: item.convUnits || 0
    }));

    const vehiclesData = vehicles.map(vehicle => ({
      type: vehicle.typeCode,
      year: vehicle.year,
      isLightCar: vehicle.isLightCar
    }));

    const landPlotsData = landPlots.map(item => ({
      type: item.typeCode,
      area: item.areaHectare,
      ownershipType: item.ownershipType || 'OWNED'
    }));

    // Расчет метрик
    const metrics = calculateHouseholdMetrics(familyMembers, incomes, landPlotsData, livestockData, vehiclesData);
    
    // Проверка готовности к назначению
    const isEligible = checkBenefitEligibility(metrics);
    const status = getApplicationStatus(metrics);

    setHouseholdMetrics({
      totalIncomeMonth: metrics.totalIncomeMonth,
      perCapitaIncome: metrics.perCapitaIncome,
      convUnitsTotal: metrics.convUnitsTotal,
      criteriaFlags: metrics.criteriaFlags,
      guaranteedMinimumIncome: metrics.guaranteedMinimumIncome,
      applicationStatus: status.status,
      statusMessage: status.message
    });

    // Логирование расчета
    auditLogger.logCalculation('BENEFIT', 0, 0, 'SPECIALIST', { incomes, livestockData, vehiclesData, landPlotsData }, metrics);
  };

  // Функции для работы с новыми структурами данных
  
  // Функции для работы с доходами
  const addIncome = () => {
    const newId = Math.max(...incomes.map(i => i.id), 0) + 1;
    setIncomes(prev => [...prev, {
      id: newId,
      memberId: undefined,
      incomeTypeCode: '',
      amount: 0,
      periodicity: 'M',
      periodFrom: new Date().toISOString().split('T')[0],
      periodTo: undefined,
      sourceRef: ''
    }]);
  };

  const updateIncome = (id: number, field: string, value: any) => {
    setIncomes(prev => prev.map(income => 
      income.id === id ? { ...income, [field]: value } : income
    ));
  };

  const removeIncome = (id: number) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
  };

  // Функции для работы с земельными участками
  const addLandPlot = () => {
    const newId = Math.max(...landPlots.map(l => l.id), 0) + 1;
    setLandPlots(prev => [...prev, {
      id: newId,
      typeCode: '',
      areaHectare: 0,
      ownershipType: 'OWNED',
      location: '',
      estimatedValue: 0,
      isOwned: true
    }]);
  };

  const updateLandPlot = (id: number, field: string, value: any) => {
    setLandPlots(prev => prev.map(plot => 
      plot.id === id ? { ...plot, [field]: value } : plot
    ));
  };

  const removeLandPlot = (id: number) => {
    if (landPlots.length > 1) {
      setLandPlots(prev => prev.filter(plot => plot.id !== id));
    }
  };

  // Функции для работы со скотом
  const addLivestock = () => {
    const newId = Math.max(...livestock.map(l => l.id), 0) + 1;
    setLivestock(prev => [...prev, {
      id: newId,
      typeCode: '',
      qty: 0,
      convUnits: 0,
      estimatedValue: 0,
      isOwned: true
    }]);
  };

  // Функция для расчета условных голов скота
  const calculateConvUnits = (typeCode: string, qty: number) => {
    // Коэффициенты пересчета в условные головы для разных типов скота
    const conversionRates: { [key: string]: number } = {
      'cattle': 1.0,      // Крупный рогатый скот
      'sheep': 0.15,      // Овцы
      'goats': 0.15,      // Козы
      'horses': 1.0,      // Лошади
      'pigs': 0.3,        // Свиньи
      'poultry': 0.01,    // Птица
      'camels': 1.2,      // Верблюды
      'donkeys': 0.5,     // Ослы
    };
    
    const rate = conversionRates[typeCode] || 0.1; // По умолчанию 0.1
    return qty * rate;
  };

  const updateLivestock = (id: number, field: string, value: any) => {
    setLivestock(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Автоматический пересчет условных голов при изменении типа или количества
        if (field === 'typeCode' || field === 'qty') {
          updatedItem.convUnits = calculateConvUnits(updatedItem.typeCode, updatedItem.qty);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const removeLivestock = (id: number) => {
    if (livestock.length > 1) {
      setLivestock(prev => prev.filter(item => item.id !== id));
    }
  };

  // Функции для работы с транспортными средствами
  const addVehicle = () => {
    const newId = Math.max(...vehicles.map(v => v.id), 0) + 1;
    setVehicles(prev => [...prev, {
      id: newId,
      typeCode: '',
      makeModel: '',
      year: new Date().getFullYear(),
      isLightCar: false,
      regNo: '',
      estimatedValue: 0,
      isOwned: true
    }]);
  };

  const updateVehicle = (id: number, field: string, value: any) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === id ? { ...vehicle, [field]: value } : vehicle
    ));
  };

  const removeVehicle = (id: number) => {
    if (vehicles.length > 1) {
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    }
  };

  // Функции для работы с адресами
  const addAddress = () => {
    const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
    setAddresses(prev => [...prev, {
      id: newId,
      type: 'FACT',
      regionCode: '',
      raionCode: '',
      localityCode: '',
      street: '',
      house: '',
      flat: '',
      postalCode: '',
      isPrimary: false
    }]);
  };

  const updateAddress = (id: number, field: string, value: any) => {
    setAddresses(prev => prev.map(addr => 
      addr.id === id ? { ...addr, [field]: value } : addr
    ));
  };

  const removeAddress = (id: number) => {
    if (addresses.length > 1) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    }
  };

  // Функции для работы с контактами
  const addContact = () => {
    const newId = Math.max(...contacts.map(c => c.id), 0) + 1;
    setContacts(prev => [...prev, {
      id: newId,
      type: 'mobile',
      value: '',
      isPrimary: false
    }]);
  };

  const updateContact = (id: number, field: string, value: any) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  const removeContact = (id: number) => {
    if (contacts.length > 1) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
    }
  };

  // Функции для работы с дополнительными удостоверениями
  const addAdditionalId = () => {
    const newId = Math.max(...additionalIds.map(a => a.id), 0) + 1;
    setAdditionalIds(prev => [...prev, {
      id: newId,
      type: 'military',
      series: '',
      number: '',
      issuingAuthority: '',
      issueDate: '',
      expiryDate: ''
    }]);
  };

  const updateAdditionalId = (id: number, field: string, value: any) => {
    setAdditionalIds(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeAdditionalId = (id: number) => {
    setAdditionalIds(prev => prev.filter(item => item.id !== id));
  };

  // Функции для работы с специальными компенсациями
  const addSpecialCompensation = () => {
    const newId = Math.max(...specialCompensations.map(s => s.id), 0) + 1;
    setSpecialCompensations(prev => [...prev, {
      id: newId,
      reason: '',
      type: '',
      amount: 0,
      periodFrom: new Date().toISOString().split('T')[0],
      periodTo: ''
    }]);
  };

  const updateSpecialCompensation = (id: number, field: string, value: any) => {
    setSpecialCompensations(prev => prev.map(comp => 
      comp.id === id ? { ...comp, [field]: value } : comp
    ));
  };

  const removeSpecialCompensation = (id: number) => {
    setSpecialCompensations(prev => prev.filter(comp => comp.id !== id));
  };

  // Функции для работы с возвратами
  const addRefund = () => {
    const newId = Math.max(...refunds.map(r => r.id), 0) + 1;
    setRefunds(prev => [...prev, {
      id: newId,
      reason: '',
      returnDate: new Date().toISOString().split('T')[0],
      amount: 0
    }]);
  };

  const updateRefund = (id: number, field: string, value: any) => {
    setRefunds(prev => prev.map(refund => 
      refund.id === id ? { ...refund, [field]: value } : refund
    ));
  };

  const removeRefund = (id: number) => {
    setRefunds(prev => prev.filter(refund => refund.id !== id));
  };

  // Обновление валидации при изменении данных
  useEffect(() => {
    calculateHouseholdMetricsData();
  }, [familyMembers, incomes, landPlots, livestock, vehicles]);

  // Функция для обновления валидации
  const updateValidation = (field: string, value: any, additionalData?: any) => {
    validateField(field, value, additionalData);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="ri-government-line text-2xl text-white"></i>
          </div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-red-600">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <i className="ri-government-line text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Новое заявление' : 'Жаңы арыз'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? 'Подача заявления на пособие «Үй-бүлөгө көмөк»' : '«Үй-бүлөгө көмөк» жөлөкпулуна арыз берүү'}
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                <i className="ri-arrow-left-line"></i>
                <span className="hidden sm:inline">Назад в кабинет</span>
              </Link>
              <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'ru' ? 'Заявление на пособие «Үй-бүлөгө көмөк»' : '«Үй-бүлөгө көмөк» жөлөкпулуна арыз'}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === 'ru' 
                  ? 'Выберите "Новая форма" для использования улучшенной версии с справочниками'
                  : 'Жакшыртылган версияны колдонуу үчүн "Жаңы форма" тандаңыз'
                }
              </p>
              
              {/* Основная форма заявки */}
              <div className="space-y-8">
                {/* Раздел 1: Основная информация */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '1. Основная информация заявителя' : '1. Арыз берүүчүнүн негизги маалыматы'}
                </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Тип заявления */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Тип заявления' : 'Арыздын түрү'} <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option value="">{language === 'ru' ? 'Выберите тип заявления' : 'Арыздын түрүн тандаңыз'}</option>
                        <option value="primary">{language === 'ru' ? 'Первичное' : 'Биринчи'}</option>
                        <option value="repeat">{language === 'ru' ? 'Повторное' : 'Кайра'}</option>
                      </select>
                    </div>

                    {/* ПИН заявителя */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'ПИН' : 'ПИН'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        pattern="[0-9]{14,16}"
                        maxLength={16}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={language === 'ru' ? '14-16 цифр' : '14-16 сан'}
                        title={language === 'ru' ? 'ПИН должен содержать 14-16 цифр' : 'ПИН 14-16 сандан турушу керек'}
                      />
                    </div>
                    
                    {/* ФИО заявителя */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'ФИО заявителя' : 'Арыз берүүчүнүн аты-жөнү'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={language === 'ru' ? 'Введите полное имя' : 'Толук атын киргизиңиз'}
                      />
                    </div>

                    {/* Пол */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Пол' : 'Жынысы'} <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option value="">{language === 'ru' ? 'Выберите пол' : 'Жынысты тандаңыз'}</option>
                        {genderList.map(gender => (
                          <option key={gender.id} value={gender.id}>
                            {gender.name}
                          </option>
                        ))}
                      </select>
                </div>

                    {/* Дата рождения */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Дата рождения' : 'Туулган күнү'} <span className="text-red-500">*</span>
                      </label>
                    <input
                      type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                  </div>

                    {/* Гражданство */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Гражданство' : 'Жарандыгы'} <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option value="">{language === 'ru' ? 'Выберите гражданство' : 'Жарандыкты тандаңыз'}</option>
                        {citizenshipList.map(citizenship => (
                          <option key={citizenship.id} value={citizenship.id}>
                            {citizenship.name}
                          </option>
                        ))}
                      </select>
            </div>

                    {/* Национальность */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Национальность' : 'Улуту'}
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option value="">{language === 'ru' ? 'Выберите национальность' : 'Улутту тандаңыз'}</option>
                        {nationalityList.map(nationality => (
                          <option key={nationality.id} value={nationality.id}>
                            {nationality.name}
                          </option>
                        ))}
                      </select>
          </div>

                    {/* Образование */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Образование' : 'Билими'}
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option value="">{language === 'ru' ? 'Выберите образование' : 'Билимди тандаңыз'}</option>
                        {educationLevelList.map(education => (
                          <option key={education.id} value={education.id}>
                            {education.name}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Основной документ */}
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      {language === 'ru' ? 'Основной документ (паспорт)' : 'Негизги документ (паспорт)'} <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Тип документа */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Тип документа' : 'Документтин түрү'} <span className="text-red-500">*</span>
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option value="">{language === 'ru' ? 'Выберите тип документа' : 'Документтин түрүн тандаңыз'}</option>
                          {documentTypeList.map(docType => (
                            <option key={docType.id} value={docType.id}>
                              {docType.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Серия документа */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Серия документа' : 'Документтин сериясы'}
                      </label>
                      <input
                          type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={language === 'ru' ? 'Введите серию' : 'Серияны киргизиңиз'}
                      />
                    </div>
                    
                      {/* Номер документа */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Номер документа' : 'Документтин номуру'} <span className="text-red-500">*</span>
                      </label>
                      <input
                          type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={language === 'ru' ? 'Введите номер документа' : 'Документтин номурун киргизиңиз'}
                      />
                    </div>

                      {/* Дата выдачи */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Дата выдачи' : 'Берилген күнү'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>

                      {/* Орган выдачи */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Орган выдачи' : 'Берүүчү орган'} <span className="text-red-500">*</span>
                          </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option value="">{language === 'ru' ? 'Выберите орган выдачи' : 'Берүүчү органды тандаңыз'}</option>
                          {passportIssuingAuthorityList.map(authority => (
                            <option key={authority.id} value={authority.id}>
                              {authority.name}
                            </option>
                          ))}
                            </select>
                      </div>

                      {/* Дата окончания */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Дата окончания' : 'Бүтүш күнү'}
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      {/* Семейное положение */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Семейное положение' : 'Үй-бүлө абалы'}
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option value="">{language === 'ru' ? 'Выберите семейное положение' : 'Үй-бүлө абалын тандаңыз'}</option>
                          <option value="single">{language === 'ru' ? 'Холост/Не замужем' : 'Үйлөнбөгөн'}</option>
                          <option value="married">{language === 'ru' ? 'Женат/Замужем' : 'Үйлөнгөн'}</option>
                          <option value="divorced">{language === 'ru' ? 'Разведен/Разведена' : 'Ажырашкан'}</option>
                          <option value="widowed">{language === 'ru' ? 'Вдовец/Вдова' : 'Жесир'}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Адрес проживания - структурированный */}
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      {language === 'ru' ? 'Адрес по документу' : 'Документ боюнча дарек'} <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ru' ? 'Область' : 'Облус'}
                          </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option value="">{language === 'ru' ? 'Выберите область' : 'Облусту тандаңыз'}</option>
                          {regionList.map(region => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ru' ? 'Район' : 'Район'}
                        </label>
                            <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={language === 'ru' ? 'Введите район' : 'Районду киргизиңиз'}
                        />
                  </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ru' ? 'Населенный пункт' : 'Турак жай'}
                  </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                          <option value="">{language === 'ru' ? 'Выберите населенный пункт' : 'Турак жайды тандаңыз'}</option>
                          {localityList.map(locality => (
                            <option key={locality.id} value={locality.id}>
                              {locality.name}
                            </option>
                          ))}
                        </select>
                    </div>
                  </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ru' ? 'Улица' : 'Көчө'}
                          </label>
                            <input
                          type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={language === 'ru' ? 'Введите улицу' : 'Көчөнү киргизиңиз'}
                  />
                </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ru' ? 'Дом' : 'Үй'}
                          </label>
                            <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={language === 'ru' ? 'Номер дома' : 'Үй номуру'}
                        />
              </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ru' ? 'Квартира' : 'Бөлмө'}
                          </label>
                            <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={language === 'ru' ? 'Номер квартиры' : 'Бөлмө номуру'}
                        />
                            </div>
                    </div>
                  </div>
                </div>

                {/* Раздел 1.1: Дополнительные удостоверения */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '1.1. Дополнительные удостоверения' : '1.1. Кошумча кимдик документтери'}
                </h3>

                <div className="space-y-4">
                    {tuData.additionalIds.map((id, index) => (
                      <div key={id.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-800">
                            {language === 'ru' ? `Удостоверение ${index + 1}` : `Кимдик документ ${index + 1}`}
                        </h4>
                          <button
                            type="button"
                            onClick={() => removeTuAdditionalId(id.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            {language === 'ru' ? 'Удалить' : 'Өчүрүү'}
                          </button>
                      </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Тип удостоверения' : 'Кимдик документтин түрү'}
                            </label>
                            <select
                              value={id.type}
                              onChange={(e) => updateTuAdditionalId(id.id, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите тип' : 'Түрүн тандаңыз'}</option>
                              <optgroup label={language === 'ru' ? 'Военные документы' : 'Аскердик документтер'}>
                                {militaryDocTypeList.map(doc => (
                                  <option key={doc.id} value={doc.id}>{doc.name}</option>
                                ))}
                              </optgroup>
                              <optgroup label={language === 'ru' ? 'Специальные удостоверения' : 'Атайын кимдик документтер'}>
                                {specialDocTypeList.map(doc => (
                                  <option key={doc.id} value={doc.id}>{doc.name}</option>
                                ))}
                              </optgroup>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Серия' : 'Сериясы'}
                        </label>
                        <input
                            type="text"
                              value={id.series}
                              onChange={(e) => updateTuAdditionalId(id.id, 'series', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите серию' : 'Серияны киргизиңиз'}
                          />
                  </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Номер' : 'Номуру'}
                        </label>
                        <input
                              type="text"
                              value={id.number}
                              onChange={(e) => updateTuAdditionalId(id.id, 'number', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите номер' : 'Номурун киргизиңиз'}
                          />
                  </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Орган выдачи' : 'Чыгаруу органы'}
                        </label>
                            <input
                              type="text"
                              value={id.issuingAuthority}
                              onChange={(e) => updateTuAdditionalId(id.id, 'issuingAuthority', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите орган выдачи' : 'Чыгаруу органын киргизиңиз'}
                            />
                  </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Дата выдачи' : 'Чыгаруу күнү'}
                        </label>
                        <input
                              type="date"
                              value={id.issueDate}
                              onChange={(e) => updateTuAdditionalId(id.id, 'issueDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Срок действия' : 'Жарактылык мөөнөтү'}
                            </label>
                            <input
                              type="date"
                              value={id.expiryDate}
                              onChange={(e) => updateTuAdditionalId(id.id, 'expiryDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      </div>
                    </div>
                  ))}
                    
                    <button
                      type="button"
                      onClick={addTuAdditionalId}
                      className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                    >
                      {language === 'ru' ? '+ Добавить удостоверение' : '+ Кимдик документ кошуу'}
                    </button>
                  </div>
                      </div>

                {/* Раздел 1.2: Контакты (мульти) */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '1.2. Контактная информация' : '1.2. Байланыш маалыматы'}
                  </h3>
                  
                  <div className="space-y-4">
                    {tuData.contacts.map((contact, index) => (
                      <div key={contact.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-800">
                            {language === 'ru' ? `Контакт ${index + 1}` : `Байланыш ${index + 1}`}
                    </h4>
                          <div className="flex items-center space-x-2">
                            <label className="flex items-center space-x-1">
                              <input
                                type="checkbox"
                                checked={contact.isPrimary}
                                onChange={(e) => updateTuContact(contact.id, 'isPrimary', e.target.checked)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">
                                {language === 'ru' ? 'Основной' : 'Негизги'}
                              </span>
                          </label>
                            <button
                              type="button"
                              onClick={() => removeTuContact(contact.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              {language === 'ru' ? 'Удалить' : 'Өчүрүү'}
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Тип контакта' : 'Байланыш түрү'} <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={contact.type}
                              onChange={(e) => updateTuContact(contact.id, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите тип' : 'Түрүн тандаңыз'}</option>
                              {contactTypeList.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Значение' : 'Мааниси'} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={contact.value}
                              onChange={(e) => updateTuContact(contact.id, 'value', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите контакт' : 'Байланышты киргизиңиз'}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addTuContact}
                      className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                    >
                      {language === 'ru' ? '+ Добавить контакт' : '+ Байланыш кошуу'}
                    </button>
                    </div>
                  </div>

                {/* Раздел 1.3: Адреса (REG/FACT) */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '1.3. Адреса регистрации и проживания' : '1.3. Каттоо жана жашаган дареги'}
                  </h3>
                  
                  <div className="space-y-4">
                    {tuData.addresses.map((address, index) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-800">
                            {language === 'ru' 
                              ? `${address.type === 'REG' ? 'Адрес регистрации' : 'Фактический адрес'} ${index + 1}`
                              : `${address.type === 'REG' ? 'Каттоо дареги' : 'Фактик дареги'} ${index + 1}`
                            }
                          </h4>
                          <div className="flex items-center space-x-2">
                            <label className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={address.isPrimary}
                                onChange={(e) => updateTuAddress(address.id, 'isPrimary', e.target.checked)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">
                                {language === 'ru' ? 'Основной' : 'Негизги'}
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeTuAddress(address.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              {language === 'ru' ? 'Удалить' : 'Өчүрүү'}
                            </button>
                            </div>
                          </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Область' : 'Область'} <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={address.regionCode}
                              onChange={(e) => updateTuAddress(address.id, 'regionCode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите область' : 'Областы тандаңыз'}</option>
                              {regionList.map(region => (
                                <option key={region.id} value={region.id}>{region.name}</option>
                              ))}
                            </select>
                        </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Район' : 'Район'} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={address.raionCode}
                              onChange={(e) => updateTuAddress(address.id, 'raionCode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите район' : 'Районду киргизиңиз'}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Населённый пункт' : 'Турак жай'} <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={address.localityCode}
                              onChange={(e) => updateTuAddress(address.id, 'localityCode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите населённый пункт' : 'Турак жайды тандаңыз'}</option>
                              {localityList.map(locality => (
                                <option key={locality.id} value={locality.id}>{locality.name}</option>
                              ))}
                            </select>
                    </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Улица' : 'Көчө'} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={address.street}
                              onChange={(e) => updateTuAddress(address.id, 'street', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите улицу' : 'Көчөнү киргизиңиз'}
                            />
                  </div>

                  <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Дом' : 'Үй'} <span className="text-red-500">*</span>
                          </label>
                            <input
                              type="text"
                              value={address.house}
                              onChange={(e) => updateTuAddress(address.id, 'house', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите номер дома' : 'Үй номурун киргизиңиз'}
                            />
                            </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Квартира' : 'Квартира'}
                            </label>
                            <input
                              type="text"
                              value={address.flat}
                              onChange={(e) => updateTuAddress(address.id, 'flat', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите номер квартиры' : 'Квартира номурун киргизиңиз'}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Почтовый индекс' : 'Почта индекси'}
                            </label>
                            <input
                              type="text"
                              value={address.postalCode}
                              onChange={(e) => updateTuAddress(address.id, 'postalCode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите индекс' : 'Индекси киргизиңиз'}
                            />
                          </div>
                          </div>
                        </div>
                      ))}
                    
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => addTuAddress('REG')}
                        className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                      >
                        {language === 'ru' ? '+ Адрес регистрации' : '+ Каттоо дареги'}
                      </button>
                      <button
                        type="button"
                        onClick={() => addTuAddress('FACT')}
                        className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                      >
                        {language === 'ru' ? '+ Фактический адрес' : '+ Фактик дареги'}
                      </button>
                    </div>
                    </div>
                  </div>

                {/* Раздел 1.4: Орган соцзащиты и категории */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '1.4. Орган соцзащиты и категории' : '1.4. Социалдык коргоо органы жана категориялар'}
                </h3>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Муниципальное управление' : 'Муниципалдык башкаруу'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={tuData.socialAuthority.municipalAuthority}
                        onChange={(e) => updateTuDataNested('socialAuthority', 'municipalAuthority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">{language === 'ru' ? 'Выберите управление' : 'Башкарууну тандаңыз'}</option>
                        {municipalAuthorities.map(authority => (
                          <option key={authority.id} value={authority.id}>{authority.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Вид заявителя' : 'Арыз берүүчүнүн түрү'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={tuData.socialAuthority.applicantType}
                        onChange={(e) => updateTuDataNested('socialAuthority', 'applicantType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">{language === 'ru' ? 'Выберите вид заявителя' : 'Арыз берүүчүнүн түрүн тандаңыз'}</option>
                        {applicantTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Категория заявителя' : 'Арыз берүүчүнүн категориясы'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={tuData.socialAuthority.category}
                        onChange={(e) => updateTuDataNested('socialAuthority', 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">{language === 'ru' ? 'Выберите категорию' : 'Категорияны тандаңыз'}</option>
                        {categoryList.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Категория инвалидности' : 'Өнүгүү бузулуу категориясы'}
                      </label>
                      <select
                        value={tuData.socialAuthority.disabilityCategory}
                        onChange={(e) => updateTuDataNested('socialAuthority', 'disabilityCategory', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">{language === 'ru' ? 'Выберите категорию' : 'Категорияны тандаңыз'}</option>
                        {disabilityCategories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Справки МСЭК и ССУ */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={getMsekRef}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {language === 'ru' ? 'Получить справку МСЭК' : 'МСЭК справкасын алуу'}
                      </button>
                      <button
                        type="button"
                        onClick={checkDsu}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {language === 'ru' ? 'Проверка в ССУ' : 'ССУда текшерүү'}
                      </button>
                    </div>
                    
                    {(tuData.socialAuthority.msekRefNumber || tuData.socialAuthority.dsuRefNumber) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">
                          {language === 'ru' ? 'Полученные справки' : 'Алынган справкалар'}
                  </h4>
                        {tuData.socialAuthority.msekRefNumber && (
                          <p className="text-sm text-blue-800">
                            <strong>{language === 'ru' ? 'МСЭК:' : 'МСЭК:'}</strong> {tuData.socialAuthority.msekRefNumber}
                            {tuData.socialAuthority.msekIssueDate && ` (${tuData.socialAuthority.msekIssueDate})`}
                          </p>
                        )}
                        {tuData.socialAuthority.dsuRefNumber && (
                          <p className="text-sm text-blue-800">
                            <strong>{language === 'ru' ? 'ССУ:' : 'ССУ:'}</strong> {tuData.socialAuthority.dsuRefNumber}
                            {tuData.socialAuthority.dsuIssueDate && ` (${tuData.socialAuthority.dsuIssueDate})`}
                          </p>
                        )}
                  </div>
                    )}
                </div>
                
                  {/* Категории (чекбоксы) */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-800 mb-3">
                      {language === 'ru' ? 'Категории льгот' : 'Льготалардын категориялары'}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tuData.categories.forChild}
                          onChange={(e) => updateTuDataNested('categories', 'forChild', e.target.checked)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {language === 'ru' ? 'На ребёнка' : 'Балага'}
                        </span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tuData.categories.forFamilyWithChild}
                          onChange={(e) => updateTuDataNested('categories', 'forFamilyWithChild', e.target.checked)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {language === 'ru' ? 'На семью с ребёнком' : 'Балалуу үй-бүлөгө'}
                        </span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tuData.categories.forMinor}
                          onChange={(e) => updateTuDataNested('categories', 'forMinor', e.target.checked)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {language === 'ru' ? 'На несовершеннолетнего' : 'Жашы толо элекке'}
                        </span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tuData.categories.forIncapacitated}
                          onChange={(e) => updateTuDataNested('categories', 'forIncapacitated', e.target.checked)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {language === 'ru' ? 'На недееспособного' : 'Жөндөмсүзгө'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Раздел 1.5: Платежные реквизиты */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '1.5. Платежные реквизиты' : '1.5. Төлөм реквизиттери'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Лицевой счёт' : 'Жеке эсеп'}
                          </label>
                            <input
                        type="text"
                        value={tuData.paymentRequisites.personalAccount}
                        onChange={(e) => updateTuDataNested('paymentRequisites', 'personalAccount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={language === 'ru' ? 'Введите лицевой счёт' : 'Жеке эсепти киргизиңиз'}
                      />
                            </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Счёт в банке' : 'Банктагы эсеп'}
                      </label>
                      <input
                        type="text"
                        value={tuData.paymentRequisites.bankAccount}
                        onChange={(e) => updateTuDataNested('paymentRequisites', 'bankAccount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={language === 'ru' ? 'Введите счёт в банке' : 'Банктагы эсепти киргизиңиз'}
                      />
                          </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Карточный счёт' : 'Карточка эсеби'}
                      </label>
                      <input
                        type="text"
                        value={tuData.paymentRequisites.cardAccount}
                        onChange={(e) => updateTuDataNested('paymentRequisites', 'cardAccount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={language === 'ru' ? 'Введите карточный счёт' : 'Карточка эсебин киргизиңиз'}
                      />
                        </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Банк' : 'Банк'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={tuData.paymentRequisites.bankCode}
                        onChange={(e) => updateTuDataNested('paymentRequisites', 'bankCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">{language === 'ru' ? 'Выберите банк' : 'Банкты тандаңыз'}</option>
                        {bankList.map(bank => (
                          <option key={bank.id} value={bank.id}>{bank.name}</option>
                        ))}
                      </select>
                  </div>

                  <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Тип платежа' : 'Төлөм түрү'}
                          </label>
                      <select
                        value={tuData.paymentRequisites.paymentType}
                        onChange={(e) => updateTuDataNested('paymentRequisites', 'paymentType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">{language === 'ru' ? 'Выберите тип платежа' : 'Төлөм түрүн тандаңыз'}</option>
                        {paymentTypeList.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>



                {/* Раздел 2: Состав семьи */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '2. Состав семьи' : '2. Үй-бүлөлүк курам'}
                </h3>
                
                  <div className="space-y-6">
                    {/* Список членов семьи */}
                    {familyMembers.map((member, index) => (
                      <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-900">
                          {language === 'ru' ? `Член семьи ${index + 1}` : `Үй-бүлө мүчөсү ${index + 1}`}
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              member.type === 'child' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {member.type === 'child' 
                                ? (language === 'ru' ? 'Ребенок' : 'Бала')
                                : (language === 'ru' ? 'Взрослый' : 'Чоң адам')
                              }
                        </span>
                    </h4>
                          {familyMembers.length > 1 && (
                          <button
                              onClick={() => removeFamilyMember(member.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        )}
                      </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Фамилия */}
              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Фамилия' : 'Фамилиясы'} <span className="text-red-500">*</span>
                          </label>
                        <input
                            type="text"
                              value={member.lastName || ''}
                              onChange={(e) => updateFamilyMember(member.id, 'lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите фамилию' : 'Фамилиясын киргизиңиз'}
                            />
                          </div>

                          {/* Имя */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Имя' : 'Аты'} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={member.firstName || ''}
                              onChange={(e) => updateFamilyMember(member.id, 'firstName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите имя' : 'Атын киргизиңиз'}
                            />
                          </div>

                          {/* Отчество */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Отчество' : 'Атасынын аты'}
                            </label>
                            <input
                              type="text"
                              value={member.middleName || ''}
                              onChange={(e) => updateFamilyMember(member.id, 'middleName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите отчество' : 'Атасынын атын киргизиңиз'}
                          />
                  </div>

                          {/* ПИН */}
                          <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'ПИН' : 'ПИН'} <span className="text-red-500">*</span>
                          </label>
                        <input
                            type="text"
                              value={member.pin}
                              onChange={(e) => updateFamilyMember(member.id, 'pin', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите ПИН' : 'ПИН киргизиңиз'}
                              maxLength={14}
                          />
                  </div>

                          {/* Дата рождения */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Дата рождения' : 'Туулган күнү'} <span className="text-red-500">*</span>
                      </label>
                      <input
                              type="date"
                              value={member.birthDate}
                              onChange={(e) => {
                                updateFamilyMember(member.id, 'birthDate', e.target.value);
                                updateFamilyMember(member.id, 'age', calculateAge(e.target.value));
                                // Автоматически определяем тип на основе возраста
                                const age = calculateAge(e.target.value);
                                if (age < 18) {
                                  updateFamilyMember(member.id, 'type', 'child');
                                } else {
                                  updateFamilyMember(member.id, 'type', 'adult');
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                          {/* Возраст (автоматический расчет) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Возраст' : 'Жашы'} <span className="text-red-500">*</span>
                        </label>
                            <input
                              type="number"
                            value={member.age}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                              placeholder="0"
                              min="0"
                            max="120"
                              readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {language === 'ru' ? 'Рассчитывается автоматически' : 'Автоматтык түрдө эсептелет'}
                            </p>
                            </div>

                          {/* Пол */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Пол' : 'Жынысы'} <span className="text-red-500">*</span>
                        </label>
                          <select
                              value={member.gender}
                              onChange={(e) => updateFamilyMember(member.id, 'gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                              <option value="">{language === 'ru' ? 'Выберите пол' : 'Жынысты тандаңыз'}</option>
                              {genderList.map(gender => (
                                <option key={gender.id} value={gender.id}>
                                  {gender.name}
                                </option>
                              ))}
                          </select>
                          </div>

                          {/* Категория */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Категория' : 'Категория'}
                            </label>
                            <select
                              value={member.category || ''}
                              onChange={(e) => updateFamilyMember(member.id, 'category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите категорию' : 'Категорияны тандаңыз'}</option>
                              <option value="general">{language === 'ru' ? 'Общий' : 'Жалпы'}</option>
                              <option value="disabled">{language === 'ru' ? 'Инвалид' : 'Өнүгүү бузулуу'}</option>
                              <option value="pensioner">{language === 'ru' ? 'Пенсионер' : 'Пенсионер'}</option>
                              <option value="student">{language === 'ru' ? 'Студент' : 'Студент'}</option>
                              <option value="unemployed">{language === 'ru' ? 'Безработный' : 'Жумушсуз'}</option>
                          </select>
                          </div>

                          {/* Род занятий */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Род занятий' : 'Кесиби'}
                            </label>
                            <input
                              type="text"
                              value={member.occupation || ''}
                              onChange={(e) => updateFamilyMember(member.id, 'occupation', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите род занятий' : 'Кесибин киргизиңиз'}
                            />
                          </div>

                          {/* Родство */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Родство' : 'Туугандык'} <span className="text-red-500">*</span>
                        </label>
                            <select 
                              value={member.relation || ''}
                              onChange={(e) => {
                                updateFamilyMember(member.id, 'relation', e.target.value);
                                // Автоматически определяем тип на основе родства
                                const memberType = getMemberTypeFromRelation(e.target.value);
                                updateFamilyMember(member.id, 'type', memberType);
                              }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите родство' : 'Туугандыкты тандаңыз'}</option>
                              {familyRelationTypes.map(relation => (
                                <option key={relation.id} value={relation.id}>
                                  {relation.name}
                                </option>
                              ))}
                            </select>
                        </div>

                          {/* Гражданство */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Гражданство' : 'Жарандыгы'} <span className="text-red-500">*</span>
                            </label>
                            <select 
                              value={member.citizenship}
                              onChange={(e) => updateFamilyMember(member.id, 'citizenship', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите гражданство' : 'Жарандыкты тандаңыз'}</option>
                              {citizenshipList.map(citizenship => (
                                <option key={citizenship.id} value={citizenship.id}>
                                  {citizenship.name}
                                </option>
                              ))}
                            </select>
                    </div>


                          {/* Тип документа */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Тип документа' : 'Документтин түрү'} <span className="text-red-500">*</span>
                            </label>
                            <select 
                              value={member.documentType}
                              onChange={(e) => updateFamilyMember(member.id, 'documentType', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите тип документа' : 'Документтин түрүн тандаңыз'}</option>
                              {documentTypeList.map(docType => (
                                <option key={docType.id} value={docType.id}>
                                  {docType.name}
                                </option>
                              ))}
                            </select>
                  </div>

                          {/* Серия документа */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Серия' : 'Сериясы'}
                            </label>
                            <input
                              type="text"
                              value={member.documentSeries || ''}
                              onChange={(e) => updateFamilyMember(member.id, 'documentSeries', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите серию' : 'Серияны киргизиңиз'}
                            />
                          </div>

                          {/* Номер документа */}
                  <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Номер документа' : 'Документтин номуру'} <span className="text-red-500">*</span>
                          </label>
                            <input
                              type="text"
                              value={member.documentNumber}
                              onChange={(e) => updateFamilyMember(member.id, 'documentNumber', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите номер документа' : 'Документтин номурун киргизиңиз'}
                      />
                            </div>

                          {/* Дата выдачи */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Дата выдачи' : 'Берилген күнү'}
                            </label>
                            <input
                              type="date"
                              value={member.documentIssueDate || ''}
                              onChange={(e) => updateFamilyMember(member.id, 'documentIssueDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>

                          {/* Дата окончания */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Дата окончания' : 'Бүтүш күнү'}
                            </label>
                            <input
                              type="date"
                              value={member.documentExpiryDate || ''}
                              onChange={(e) => updateFamilyMember(member.id, 'documentExpiryDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>

                          {/* Выдавший орган */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Выдавший орган' : 'Берүүчү орган'}
                            </label>
                            <input
                              type="text"
                              value={member.documentIssuingAuthority || ''}
                              onChange={(e) => updateFamilyMember(member.id, 'documentIssuingAuthority', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите орган выдачи' : 'Берүүчү органды киргизиңиз'}
                            />
                          </div>

                          {/* Категория ребенка - только для детей */}
                          {member.type === 'child' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ru' ? 'Категория ребенка' : 'Баланын категориясы'}
                              </label>
                              <select 
                                value={member.childCategory}
                                onChange={(e) => updateFamilyMember(member.id, 'childCategory', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              >
                                <option value="">{language === 'ru' ? 'Выберите категорию' : 'Категорияны тандаңыз'}</option>
                                {childCategoryList.map(category => (
                                  <option key={category.id} value={category.id}>
                            {category.name}
                                  </option>
                                ))}
                              </select>
                    </div>
                          )}
                  </div>


                        </div>
                    ))}
                    
                    {/* Кнопка добавления члена семьи */}
                    <div className="flex justify-center">
              <button
                        onClick={() => addFamilyMember('adult')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center justify-center"
                      >
                        <i className="ri-user-add-line mr-2"></i>
                        {language === 'ru' ? 'Запросить члена семьи' : 'Үй-бүлө мүчөсүн сурап берүү'}
                  </button>
                    </div>
                  </div>
                </div>

                {/* Раздел 3: Доходы */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '3. Доходы' : '3. Киреше'}
                  </h3>
                  
                  <div className="space-y-4">
                    {incomes.map((income, index) => (
                      <div key={income.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-medium text-gray-800">
                            {language === 'ru' ? `Доход ${index + 1}` : `Киреше ${index + 1}`}
                            </h5>
                          {incomes.length > 1 && (
                            <button
                              onClick={() => removeIncome(income.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              {language === 'ru' ? 'Удалить' : 'Өчүрүү'}
                            </button>
                          )}
                        </div>
                      
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Тип дохода' : 'Киреше түрү'} <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={income.incomeTypeCode}
                              onChange={(e) => updateIncome(income.id, 'incomeTypeCode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите тип' : 'Түрүн тандаңыз'}</option>
                              {getDirectory('incomeTypeList').map((item) => (
                                <option key={item.code} value={item.code}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Сумма' : 'Сумма'} <span className="text-red-500">*</span>
                          </label>
                            <input
                              type="number"
                              value={income.amount}
                              onChange={(e) => updateIncome(income.id, 'amount', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="0"
                              min="0"
                                />
                            </div>
                          
                              <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Периодичность' : 'Мезгилдүүлүк'} <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={income.periodicity}
                              onChange={(e) => updateIncome(income.id, 'periodicity', e.target.value as 'M' | 'Y')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите периодичность' : 'Мезгилдүүлүктү тандаңыз'}</option>
                              {getDirectory('incomePeriodicityList').map((item) => (
                                <option key={item.code} value={item.code}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Период с' : 'Мезгил башталышы'}
                                </label>
                      <input
                                  type="date"
                              value={income.periodFrom}
                              onChange={(e) => updateIncome(income.id, 'periodFrom', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                          </div>
                          
                              <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Период по' : 'Мезгил аягы'}
                                </label>
                      <input
                              type="date"
                              value={income.periodTo || ''}
                              onChange={(e) => updateIncome(income.id, 'periodTo', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                        </div>
                    </div>

                        {/* Кому принадлежит доход */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'ПИН получателя' : 'Алуучунун ПИНи'} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={income.recipientPin || ''}
                              onChange={(e) => updateIncome(income.id, 'recipientPin', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите ПИН получателя' : 'Алуучунун ПИНин киргизиңиз'}
                              maxLength={14}
                            />
                  </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'ФИО получателя' : 'Алуучунун ФИОсу'} <span className="text-red-500">*</span>
                          </label>
                            <input
                              type="text"
                              value={income.recipientFullName || ''}
                              onChange={(e) => updateIncome(income.id, 'recipientFullName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите ФИО получателя' : 'Алуучунун ФИОсун киргизиңиз'}
                            />
                            </div>
                          </div>
                        </div>
                    ))}
                    
              <button
                      onClick={addIncome}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {language === 'ru' ? '+ Запросить доход' : '+ Киреше сурап берүү'}
                  </button>
                  </div>
                </div>

                {/* Раздел 4: Подсобное хозяйство */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '4. Подсобное хозяйство' : '4. Жардамчы чарба'}
                  </h3>
                  
                  <div className="space-y-6">
                {/* Земельные участки */}
                    <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">
                    {language === 'ru' ? 'Земельные участки' : 'Жер учактары'}
                  </h4>
                      
                      <div className="space-y-4">
                        {landPlots.map((plot, index) => (
                          <div key={plot.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-medium text-gray-800">
                                {language === 'ru' ? `Участок ${index + 1}` : `Учак ${index + 1}`}
                              </h5>
                              {landPlots.length > 1 && (
                                <button
                                  onClick={() => removeLandPlot(plot.id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Тип участка' : 'Учактын түрү'} <span className="text-red-500">*</span>
                          </label>
                        <select
                                  value={plot.typeCode}
                                  onChange={(e) => updateLandPlot(plot.id, 'typeCode', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                  <option value="">{language === 'ru' ? 'Выберите тип' : 'Түрүн тандаңыз'}</option>
                                  {landPlotTypeList.map(type => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))}
                        </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Площадь' : 'Аянт'} <span className="text-red-500">*</span>
                                </label>
                                <div className="flex">
                        <input
                          type="number"
                                  value={plot.areaHectare}
                                    onChange={(e) => updateLandPlot(plot.id, 'areaHectare', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent rounded-r-none"
                          placeholder="0"
                              min="0"
                        />
                                  <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600">
                                    {language === 'ru' ? 'га' : 'га'}
                        </span>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Единица измерения' : 'Өлчөм бирдиги'}
                                </label>
                                <select 
                                  value={landMeasurementUnit}
                                  onChange={(e) => setLandMeasurementUnit(e.target.value as 'соток' | 'га' | 'м²')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                  <option value="соток">{language === 'ru' ? 'Соток' : 'Соток'}</option>
                                  <option value="га">{language === 'ru' ? 'Гектар' : 'Гектар'}</option>
                                  <option value="м²">{language === 'ru' ? 'Квадратный метр' : 'Квадрат метр'}</option>
                                </select>
                            </div>
                          </div>

                          {/* Кому принадлежит участок */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ru' ? 'ПИН владельца' : 'Ээсинин ПИНи'} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={plot.ownerPin || ''}
                                onChange={(e) => updateLandPlot(plot.id, 'ownerPin', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder={language === 'ru' ? 'Введите ПИН владельца' : 'Ээсинин ПИНин киргизиңиз'}
                                maxLength={14}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ru' ? 'ФИО владельца' : 'Ээсинин ФИОсу'} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={plot.ownerFullName || ''}
                                onChange={(e) => updateLandPlot(plot.id, 'ownerFullName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder={language === 'ru' ? 'Введите ФИО владельца' : 'Ээсинин ФИОсун киргизиңиз'}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                        
                          <button
                          onClick={addLandPlot}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center justify-center"
                        >
                          <i className="ri-add-line mr-2"></i>
                          {language === 'ru' ? 'Запросить участок' : 'Учакта сурап берүү'}
                        </button>
                    </div>
                  </div>

                    {/* Скот */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Скот' : 'Мал'}
                    </h4>
                      
                      <div className="space-y-4">
                        {livestock.map((item, index) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-medium text-gray-800">
                                {language === 'ru' ? `Скот ${index + 1}` : `Мал ${index + 1}`}
                              </h5>
                              {livestock.length > 1 && (
                                <button
                                  onClick={() => removeLivestock(item.id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        )}
                      </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Тип скота' : 'Малдын түрү'} <span className="text-red-500">*</span>
                          </label>
                                <select 
                                  value={item.typeCode}
                                  onChange={(e) => updateLivestock(item.id, 'typeCode', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                  <option value="">{language === 'ru' ? 'Выберите тип скота' : 'Малдын түрүн тандаңыз'}</option>
                                  {livestockTypeList.map(type => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Количество' : 'Саны'} <span className="text-red-500">*</span>
                                </label>
                            <input
                              type="number"
                                  value={item.qty}
                                  onChange={(e) => updateLivestock(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="0"
                              min="0"
                            />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ru' ? 'Условные головы (авто)' : 'Шарттуу баштар (авто)'}
                              </label>
                              <input
                                type="number"
                                value={item.convUnits}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                placeholder="0"
                                min="0"
                                step="0.01"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {language === 'ru' ? 'Рассчитывается автоматически' : 'Автоматтык эсептелет'}
                              </p>
                            </div>
                          </div>

                          {/* Кому принадлежит скот */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ru' ? 'ПИН владельца' : 'Ээсинин ПИНи'} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={item.ownerPin || ''}
                                onChange={(e) => updateLivestock(item.id, 'ownerPin', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder={language === 'ru' ? 'Введите ПИН владельца' : 'Ээсинин ПИНин киргизиңиз'}
                                maxLength={14}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ru' ? 'ФИО владельца' : 'Ээсинин ФИОсу'} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={item.ownerFullName || ''}
                                onChange={(e) => updateLivestock(item.id, 'ownerFullName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder={language === 'ru' ? 'Введите ФИО владельца' : 'Ээсинин ФИОсун киргизиңиз'}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                        
                    <button
                          onClick={addLivestock}
                          className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 inline-flex items-center justify-center"
                    >
                          <i className="ri-add-line mr-2"></i>
                          {language === 'ru' ? 'Запросить скот' : 'Малды сурап берүү'}
                    </button>
                      </div>
                      
                      {/* Автоматический расчет условных голов */}
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-yellow-800">
                            {language === 'ru' ? 'Условные головы:' : 'Шарттуу баштар:'}
                          </span>
                          <span className="font-bold text-yellow-900 text-lg">
                            {livestock.reduce((sum, item) => sum + item.convUnits, 0).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-yellow-700 mt-1">
                          {language === 'ru' 
                            ? 'Автоматический пересчет в условные головы скота'
                            : 'Малдын шарттуу баштарына автоматтык эсептөө'
                          }
                        </p>
                  </div>
                </div>

                    {/* Транспортные средства */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Транспортные средства' : 'Транспорт каражаттары'}
                    </h4>
                      
                      <div className="space-y-4">
                        {vehicles.map((vehicle, index) => (
                          <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-medium text-gray-800">
                                {language === 'ru' ? `Транспорт ${index + 1}` : `Транспорт ${index + 1}`}
                              </h5>
                              {vehicles.length > 1 && (
                                <button
                                  onClick={() => removeVehicle(vehicle.id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Тип транспорта' : 'Транспорттун түрү'} <span className="text-red-500">*</span>
                          </label>
                                <select 
                                  value={vehicle.typeCode}
                                  onChange={(e) => updateVehicle(vehicle.id, 'typeCode', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                  <option value="">{language === 'ru' ? 'Выберите тип' : 'Түрүн тандаңыз'}</option>
                                  {vehicleTypeList.map(type => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Год выпуска' : 'Чыгарылган жылы'} <span className="text-red-500">*</span>
                                </label>
                            <input
                              type="number"
                                  value={vehicle.year}
                                  onChange={(e) => updateVehicle(vehicle.id, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                                    vehicle.typeCode === 'passenger_car' && (new Date().getFullYear() - vehicle.year) >= 20
                                      ? 'border-red-500 focus:ring-red-500'
                                      : 'border-gray-300 focus:ring-red-500'
                                  }`}
                                  min="1900"
                                  max={new Date().getFullYear()}
                                />
                                {vehicle.typeCode === 'passenger_car' && (new Date().getFullYear() - vehicle.year) >= 20 && (
                                  <p className="text-xs text-red-600 mt-1">
                                    {language === 'ru' ? 'Возраст автомобиля должен быть менее 20 лет' : 'Автомобильдин жашы 20 жылдан аз болушу керек'}
                                  </p>
                                )}
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Модель' : 'Модель'}
                                </label>
                                <input
                                  type="text"
                                  value={vehicle.makeModel || ''}
                                  onChange={(e) => updateVehicle(vehicle.id, 'makeModel', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                  placeholder={language === 'ru' ? 'Введите модель' : 'Моделди киргизиңиз'}
                                />
                            </div>
                          </div>

                          {/* Кому принадлежит транспорт */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ru' ? 'ПИН владельца' : 'Ээсинин ПИНи'} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={vehicle.ownerPin || ''}
                                onChange={(e) => updateVehicle(vehicle.id, 'ownerPin', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder={language === 'ru' ? 'Введите ПИН владельца' : 'Ээсинин ПИНин киргизиңиз'}
                                maxLength={14}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ru' ? 'ФИО владельца' : 'Ээсинин ФИОсу'} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={vehicle.ownerFullName || ''}
                                onChange={(e) => updateVehicle(vehicle.id, 'ownerFullName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder={language === 'ru' ? 'Введите ФИО владельца' : 'Ээсинин ФИОсун киргизиңиз'}
                                />
                            </div>
                          </div>
                        </div>
                      ))}
                        
                        <button
                          onClick={addVehicle}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center justify-center"
                        >
                          <i className="ri-add-line mr-2"></i>
                          {language === 'ru' ? 'Запросить транспорт' : 'Транспортту сурап берүү'}
                        </button>
                    </div>
                  </div>

                    {/* Общий подсчет имущества */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                      <h4 className="font-medium text-blue-900 mb-4">
                        {language === 'ru' ? 'Общий подсчет имущества' : 'Мүлктүн жалпы эсеби'}
                    </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {landPlots.reduce((sum, plot) => sum + plot.areaHectare, 0).toFixed(2)}
                            </div>
                          <div className="text-sm text-gray-600">
                            {language === 'ru' 
                              ? `Земля (${landMeasurementUnit === 'га' ? 'гектары' : landMeasurementUnit === 'соток' ? 'сотки' : 'м²'})`
                              : `Жер (${landMeasurementUnit === 'га' ? 'гектар' : landMeasurementUnit === 'соток' ? 'соток' : 'м²'})`
                            }
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {livestock.reduce((sum, item) => sum + item.convUnits, 0).toFixed(1)}
                    </div>
                          <div className="text-sm text-gray-600">
                            {language === 'ru' ? 'Условных голов' : 'Шарттуу баштар'}
                  </div>
                </div>

                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {vehicles.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            {language === 'ru' ? 'Транспортных средств' : 'Транспорт каражаттары'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border-2 border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-900">
                            {language === 'ru' ? 'Общая стоимость имущества (МПЦ):' : 'Мүлктүн жалпы баасы (МПЦ):'}
                    </span>
                          <span className={`font-bold text-lg ${
                            calculateTotalPropertyValue() <= 4 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {calculateTotalPropertyValue().toFixed(2)} МПЦ
                        </span>
                  </div>
                        
                        {calculateTotalPropertyValue() <= 4 ? (
                          <div className="mt-2 p-2 bg-green-100 rounded text-green-800 text-sm">
                            <i className="ri-check-line mr-1"></i>
                            {language === 'ru' 
                              ? 'Соответствует критериям (≤4 МПЦ)'
                              : 'Критерийлерге туура келет (≤4 МПЦ)'
                            }
                </div>
                        ) : (
                          <div className="mt-2 p-2 bg-red-100 rounded text-red-800 text-sm">
                            <i className="ri-error-warning-line mr-1"></i>
                            {language === 'ru' 
                              ? 'Превышает критерии (>4 МПЦ)'
                              : 'Критерийлерден ашып кетет (>4 МПЦ)'
                            }
              </div>
            )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Раздел 5: Специальные компенсации */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '5. Специальные компенсации' : '5. Атайын компенсациялар'}
                  </h3>
                  
                  <div className="space-y-4">
                    {tuData.specialCompensations.map((compensation, index) => (
                      <div key={compensation.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-800">
                            {language === 'ru' ? `Компенсация ${index + 1}` : `Компенсация ${index + 1}`}
                          </h4>
                            <button
                            type="button"
                            onClick={() => removeTuSpecialCompensation(compensation.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                            >
                              {language === 'ru' ? 'Удалить' : 'Өчүрүү'}
                            </button>
                        </div>
                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Причина' : 'Себеби'} <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={compensation.reason}
                              onChange={(e) => updateTuSpecialCompensation(compensation.id, 'reason', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите причину' : 'Себебин тандаңыз'}</option>
                              {compensationReasonList.map(reason => (
                                <option key={reason.id} value={reason.id}>{reason.name}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Тип компенсации' : 'Компенсация түрү'} <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={compensation.type}
                              onChange={(e) => updateTuSpecialCompensation(compensation.id, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите тип' : 'Түрүн тандаңыз'}</option>
                              {compensationTypeList.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                              ))}
                            </select>
                        </div>
                        
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Сумма' : 'Суммасы'} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={compensation.amount}
                              onChange={(e) => updateTuSpecialCompensation(compensation.id, 'amount', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите сумму' : 'Сумманы киргизиңиз'}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Период с' : 'Мөөнөт башталышы'}
                            </label>
                            <input
                              type="date"
                              value={compensation.periodFrom}
                              onChange={(e) => updateTuSpecialCompensation(compensation.id, 'periodFrom', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Период по' : 'Мөөнөт аягы'}
                                </label>
                                <input
                              type="date"
                              value={compensation.periodTo}
                              onChange={(e) => updateTuSpecialCompensation(compensation.id, 'periodTo', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <button
                      type="button"
                      onClick={addTuSpecialCompensation}
                      className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                        >
                      {language === 'ru' ? '+ Запросить компенсацию' : '+ Компенсацияны сурап берүү'}
                  </button>
                      </div>
              </div>
                
                {/* Раздел 6: Документы */}

                {/* Раздел 6: Документы */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '6. Документы' : '6. Документтер'}
                </h3>
                
                  <div className="space-y-6">



                    {/* Дополнительные документы */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Дополнительные документы' : 'Кошумча документтер'}
                      </h4>
                      
                      <div className="space-y-4">
                        {documents.additionalDocuments.map((document, index) => (
                          <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-medium text-gray-800">
                                {language === 'ru' ? `Дополнительный документ ${index + 1}` : `Кошумча документ ${index + 1}`}
                                {document.isRequired && <span className="text-red-500 ml-1">*</span>}
                                </h5>
                              <button
                                onClick={() => removeAdditionalDocument(document.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Тип документа' : 'Документ түрү'} <span className="text-red-500">*</span>
                                </label>
                                <select 
                                  value={document.documentType}
                                  onChange={(e) => updateAdditionalDocument(document.id, 'documentType', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                  <option value="">{language === 'ru' ? 'Выберите тип документа' : 'Документ түрүн тандаңыз'}</option>
                                  <option value="disability_certificate">{language === 'ru' ? 'Справка об инвалидности' : 'Өнүгүү бузулуу тууралуу справка'}</option>
                                  <option value="employment_certificate">{language === 'ru' ? 'Справка из центра занятости' : 'Жумушсуздук борборунан справка'}</option>
                                  <option value="medical_certificate">{language === 'ru' ? 'Медицинская справка' : 'Медициналык справка'}</option>
                                  <option value="education_certificate">{language === 'ru' ? 'Справка об образовании' : 'Билим тууралуу справка'}</option>
                                  <option value="other">{language === 'ru' ? 'Прочие документы' : 'Башка документтер'}</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Файл документа' : 'Документ файлы'} <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  onChange={(e) => updateAdditionalDocument(document.id, 'file', e.target.files?.[0] || null)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            
                            {document.fileName && (
                              <div className={`p-3 rounded-lg border ${document.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <i className={`ri-${document.isValid ? 'check-line' : 'error-warning-line'} text-lg ${document.isValid ? 'text-green-600' : 'text-red-600'} mr-2`}></i>
                                    <span className="font-medium text-gray-800">{document.fileName}</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                      ({(document.fileSize / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                                </div>
                                {document.error && (
                                  <p className="text-red-600 text-sm mt-1">{document.error}</p>
                                )}
                                  </div>
                                )}
                                </div>
                        ))}
                        
                        <button
                          onClick={addAdditionalDocument}
                          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 inline-flex items-center justify-center"
                        >
                          <i className="ri-add-line mr-2"></i>
                          {language === 'ru' ? 'Добавить дополнительный документ' : 'Кошумча документ кошуу'}
                        </button>
                              </div>
                    </div>

                    {/* Сводка по документам */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                      <h4 className="font-medium text-blue-900 mb-4">
                        {language === 'ru' ? 'Сводка по документам' : 'Документтер боюнча жыйынтык'}
                      </h4>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                              <span className="text-gray-700">
                            {language === 'ru' ? 'Дополнительные документы:' : 'Кошумча документтер:'}
                              </span>
                          <span className={`font-medium ${documents.additionalDocuments.length > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                            {documents.additionalDocuments.length > 0 
                              ? `${documents.additionalDocuments.length} ${language === 'ru' ? 'загружено' : 'жүктөлдү'}`
                              : (language === 'ru' ? 'Нет документов' : 'Документтер жок')
                            }
                            </span>
                          </div>
                      </div>
                    </div>
                        </div>
                      </div>



                {/* Раздел 7: Расчёт (завершение) */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '7. Расчёт (завершение)' : '7. Эсептөө (аяктоо)'}
                  </h3>

                  {/* Авторасчеты показателей домохозяйства */}
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3">
                      {language === 'ru' ? 'Показатели домохозяйства' : 'Үй-чарба көрсөткүчтөрү'}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            {language === 'ru' ? 'Общий доход в месяц:' : 'Айлык жалпы киреше:'}
                            </span>
                          <span className="font-medium">
                            {formatCurrencyCalc(householdMetrics.totalIncomeMonth)}
                            </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            {language === 'ru' ? 'Среднедушевой доход:' : 'Адам башына орточо киреше:'}
                          </span>
                          <span className="font-medium">
                            {formatCurrencyCalc(householdMetrics.perCapitaIncome)}
                          </span>
                      </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            {language === 'ru' ? 'Условные единицы скота:' : 'Малдын шарттуу бирдиктери:'}
                          </span>
                          <span className="font-medium">
                            {householdMetrics.convUnitsTotal.toFixed(2)}
                      </span>
                    </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            {language === 'ru' ? 'Гарантированный минимум:' : 'Кепилдүү минимум:'}
                          </span>
                          <span className="font-medium">
                            {formatCurrencyCalc(householdMetrics.guaranteedMinimumIncome)}
                          </span>
                      </div>
                    </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${householdMetrics.criteriaFlags.incomeEligible ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">
                            {language === 'ru' ? 'Критерий дохода' : 'Киреше критерийи'}
                      </span>
                    </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${householdMetrics.criteriaFlags.propertyEligible ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">
                            {language === 'ru' ? 'Критерий имущества' : 'Мүлк критерийи'}
                          </span>
                      </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${householdMetrics.criteriaFlags.familyEligible ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">
                            {language === 'ru' ? 'Критерий семьи' : 'Үй-бүлө критерийи'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${householdMetrics.criteriaFlags.vehicleEligible ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">
                            {language === 'ru' ? 'Критерий транспорта' : 'Транспорт критерийи'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 rounded-lg bg-white border">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${
                          householdMetrics.applicationStatus === 'ELIGIBLE' ? 'bg-green-500' : 
                          householdMetrics.applicationStatus === 'INELIGIBLE' ? 'bg-red-500' : 
                          'bg-yellow-500'
                        }`}></div>
                        <span className="font-medium text-gray-800">
                          {language === 'ru' ? 'Статус заявления:' : 'Арыздын статусу:'}
                        </span>
                        <span className={`font-semibold ${
                          householdMetrics.applicationStatus === 'ELIGIBLE' ? 'text-green-600' : 
                          householdMetrics.applicationStatus === 'INELIGIBLE' ? 'text-red-600' : 
                          'text-yellow-600'
                        }`}>
                          {householdMetrics.applicationStatus === 'ELIGIBLE' ? 
                            (language === 'ru' ? 'Соответствует критериям' : 'Критерийлерге туура келет') :
                            householdMetrics.applicationStatus === 'INELIGIBLE' ? 
                            (language === 'ru' ? 'Не соответствует критериям' : 'Критерийлерге туура келбейт') :
                            (language === 'ru' ? 'На рассмотрении' : 'Каралууда')
                          }
                        </span>
                      </div>
                      {householdMetrics.statusMessage && (
                        <p className="text-sm text-gray-600 mt-2">
                          {householdMetrics.statusMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Детализированный расчет пособия */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
                      <h4 className="font-medium text-green-900 mb-4">
                        {language === 'ru' ? 'Расчет пособия «Үй-бүлөгө көмөк»' : '«Үй-бүлөгө көмөк» жөлөкпулунун эсептөөсү'}
                      </h4>
                      
                      {(() => {
                        const calculation = calculateDetailedBenefit();
                        return (
                          <div className="space-y-4">
                            {/* Расчет по детям */}
                            {calculation.childrenCalculations.length > 0 ? (
                              <div className="bg-white border border-green-200 rounded-lg p-4">
                                <h5 className="font-medium text-gray-800 mb-3">
                                  {language === 'ru' ? 'Расчет по детям:' : 'Балалар боюнча эсептөө:'}
                                </h5>
                                <div className="space-y-2">
                                  {calculation.childrenCalculations.map((calc, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                      <div>
                                        <span className="font-medium">{calc.childName}</span>
                                        <span className="text-sm text-gray-500 ml-2">
                                          ({language === 'ru' ? 'возраст' : 'жашы'}: {calc.childAge} {language === 'ru' ? 'лет' : 'жаш'})
                      </span>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm text-gray-600">
                                          {calc.baseAmount.toLocaleString()} × {calc.coefficient} = {calc.amount.toLocaleString()} {language === 'ru' ? 'сом' : 'сом'}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="flex justify-between items-center font-medium">
                                    <span>{language === 'ru' ? 'Итого по детям:' : 'Балалар боюнча жыйынтык:'}</span>
                                    <span>{calculation.totalAmount.toLocaleString()} {language === 'ru' ? 'сом' : 'сом'}</span>
                    </div>
                      </div>
                    </div>
                    ) : (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800">
                                  {language === 'ru' 
                                    ? 'Для расчета пособия необходимо добавить детей в состав семьи'
                                    : 'Жөлөкпул эсептөө үчүн үй-бүлө курамына балаларды кошуу керек'
                                  }
                                </p>
                  </div>
                )}
                
                            {/* Надбавки */}
                            {calculation.childrenCount > 0 && (
                              <div className="bg-white border border-green-200 rounded-lg p-4">
                                <h5 className="font-medium text-gray-800 mb-3">
                                  {language === 'ru' ? 'Надбавки:' : 'Кошумчалар:'}
                                </h5>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span>{language === 'ru' ? 'Многодетная семья (3+ детей):' : 'Көп балалуу үй-бүлө (3+ бала):'}</span>
                                    <span>{calculation.allowances.largeFamily.toLocaleString()} {language === 'ru' ? 'сом' : 'сом'}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>{language === 'ru' ? 'Мать-одиночка:' : 'Жалгыз эне:'}</span>
                                    <span>{calculation.allowances.singleParent.toLocaleString()} {language === 'ru' ? 'сом' : 'сом'}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>{language === 'ru' ? 'Надбавка за инвалидность:' : 'Өнүгүү бузулуу кошумчасы:'}</span>
                                    <span>{calculation.allowances.disability.toLocaleString()} {language === 'ru' ? 'сом' : 'сом'}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>{language === 'ru' ? 'Прочие надбавки:' : 'Башка кошумчалар:'}</span>
                                    <span>{calculation.allowances.other.toLocaleString()} {language === 'ru' ? 'сом' : 'сом'}</span>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="flex justify-between items-center font-medium">
                                    <span>{language === 'ru' ? 'Итого надбавок:' : 'Кошумчалардын жыйынтыгы:'}</span>
                                    <span>{calculation.totalAllowances.toLocaleString()} {language === 'ru' ? 'сом' : 'сом'}</span>
                                  </div>
                    </div>
                      </div>
                    )}

                            {/* Итоговая сумма */}
                            {calculation.childrenCount > 0 && (
                              <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-bold text-green-900">
                                    {language === 'ru' ? 'ИТОГОВАЯ СУММА ПОСОБИЯ:' : 'ЖӨЛӨКПУЛДУН ЖЫЙЫНТЫК СУММАСЫ:'}
                                  </span>
                                  <span className="text-2xl font-bold text-green-900">
                                    {calculation.finalAmount.toLocaleString()} {language === 'ru' ? 'сом' : 'сом'}
                                  </span>
                                </div>
                                <p className="text-sm text-green-700 mt-2">
                                  {language === 'ru' 
                                    ? 'Ежемесячная сумма пособия на семью'
                                    : 'Үй-бүлөгө айлык жөлөкпул суммасы'
                                  }
                                </p>
                  </div>
                )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Согласия */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Согласия' : 'Макулдуктар'}
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                            id="personal-data-consent"
                            checked={completionData.personalDataConsent}
                            onChange={(e) => updateCompletionData('personalDataConsent', e.target.checked)}
                            className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label htmlFor="personal-data-consent" className="text-sm text-gray-700">
                            <span className="text-red-500">*</span> {language === 'ru' 
                              ? 'Я даю согласие на обработку моих персональных данных в соответствии с Законом КР «О персональных данных»'
                              : 'Мен КР «Жеке маалыматтар жөнүндө» мыйзамына ылайык жеке маалыматтарымды иштетүүгө макулдук берем'
                      }
                    </label>
                  </div>
                        
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="children-data-consent"
                            checked={completionData.childrenDataConsent}
                            onChange={(e) => updateCompletionData('childrenDataConsent', e.target.checked)}
                            className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label htmlFor="children-data-consent" className="text-sm text-gray-700">
                            <span className="text-red-500">*</span> {language === 'ru' 
                              ? 'Я даю согласие на обработку персональных данных моих несовершеннолетних детей'
                              : 'Мен жашы толо элек балаларымдын жеке маалыматтарын иштетүүгө макулдук берем'
                            }
                          </label>
                </div>
              </div>
                    </div>

                    {/* Подтверждения */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Подтверждения' : 'Ырастоолор'}
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="data-accuracy-confirmation"
                            checked={completionData.dataAccuracyConfirmation}
                            onChange={(e) => updateCompletionData('dataAccuracyConfirmation', e.target.checked)}
                            className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label htmlFor="data-accuracy-confirmation" className="text-sm text-gray-700">
                            <span className="text-red-500">*</span> {language === 'ru' 
                              ? 'Я подтверждаю достоверность всех указанных сведений и несу ответственность за их точность'
                              : 'Мен көрсөтүлгөн бардык маалыматтардын чындыгын ырастайм жана алардын тактыгы үчүн жоопкерчилик алам'
                            }
                          </label>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="termination-conditions-acknowledgment"
                            checked={completionData.terminationConditionsAcknowledgment}
                            onChange={(e) => updateCompletionData('terminationConditionsAcknowledgment', e.target.checked)}
                            className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label htmlFor="termination-conditions-acknowledgment" className="text-sm text-gray-700">
                            <span className="text-red-500">*</span> {language === 'ru' 
                              ? 'Я ознакомлен(а) с условиями прекращения выплаты пособия и обязуюсь уведомлять об изменениях в составе семьи и доходах'
                              : 'Мен жөлөкпул төлөмүн токтотуу шарттары менен тааныштым жана үй-бүлө курамы жана кирешелердеги өзгөрүүлөр жөнүндө билдирүү милдетин алам'
                            }
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Электронная подпись заявителя */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Электронная подпись заявителя' : 'Арыз берүүчүнүн электрондук колтамгасы'} <span className="text-red-500">*</span>
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'ФИО заявителя' : 'Арыз берүүчүнүн аты-жөнү'}
                          </label>
                          <input
                            type="text"
                            value={completionData.applicantSignature}
                            onChange={(e) => updateCompletionData('applicantSignature', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder={language === 'ru' ? 'Введите ФИО для подписи' : 'Колтамга үчүн аты-жөнүн киргизиңиз'}
                          />
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            {language === 'ru' 
                              ? 'Вводя ФИО, вы подтверждаете, что данное заявление подано от вашего имени и вы несете ответственность за достоверность указанных сведений'
                              : 'Аты-жөнүнүздү киргизип, сиз бул арыздын сиздин атыңыздан берилгенин ырастайсыз жана көрсөтүлгөн маалыматтардын чындыгы үчүн жоопкерчилик аласыз'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Номер заявления */}
                    {completionData.applicationNumber && (
                      <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                        <h4 className="font-medium text-blue-900 mb-2">
                          {language === 'ru' ? 'Номер заявления' : 'Арыздын номуру'}
                        </h4>
                        <p className="text-lg font-bold text-blue-900">
                          № {completionData.applicationNumber}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          {language === 'ru' 
                            ? 'Сохраните номер заявления для отслеживания статуса'
                            : 'Статусту көзөмөлдөө үчүн арыздын номурун сактаңыз'
                          }
                        </p>
              </div>
            )}

                    {/* Статус готовности */}
                    <div className={`border-2 rounded-lg p-4 ${isReadyToSubmit() ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
                      <div className="flex items-center">
                        <i className={`ri-${isReadyToSubmit() ? 'check-line' : 'error-warning-line'} text-2xl ${isReadyToSubmit() ? 'text-green-600' : 'text-yellow-600'} mr-3`}></i>
                        <div>
                          <h5 className={`font-bold ${isReadyToSubmit() ? 'text-green-800' : 'text-yellow-800'}`}>
                            {isReadyToSubmit() 
                              ? (language === 'ru' ? 'Готово к отправке' : 'Жөнөтүүгө даяр')
                              : (language === 'ru' ? 'Требуется заполнение' : 'Толтуруу талап кылынат')
                            }
                          </h5>
                          <p className={`text-sm ${isReadyToSubmit() ? 'text-green-700' : 'text-yellow-700'}`}>
                            {isReadyToSubmit()
                              ? (language === 'ru' 
                                  ? 'Все обязательные поля заполнены. Заявление готово к отправке.'
                                  : 'Бардык милдеттүү талаалар толтурулду. Арыз жөнөтүүгө даяр.'
                                )
                              : (language === 'ru' 
                                  ? 'Пожалуйста, заполните все обязательные поля и загрузите необходимые документы.'
                                  : 'Сураныч, бардык милдеттүү талааларды толтуруңуз жана керектүү документтерди жүктөңүз.'
                                )
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Кнопки отправки */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
                  <button 
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={submitState.isSubmitting}
                  >
                    {language === 'ru' ? 'Отмена' : 'Жокко чыгаруу'}
                  </button>
                  
                  {submitState.isSubmitted ? (
                    <div className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>
                        {language === 'ru' 
                          ? `Заявление №${completionData.applicationNumber} отправлено!` 
                          : `№${completionData.applicationNumber} арыз жөнөтүлдү!`
                        }
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={submitApplication}
                      disabled={!isReadyToSubmit() || submitState.isSubmitting}
                      className={`px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
                        isReadyToSubmit() && !submitState.isSubmitting
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {submitState.isSubmitting && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      <span>
                        {submitState.isSubmitting 
                          ? (language === 'ru' ? 'Отправка...' : 'Жөнөтүлүүдө...')
                          : (language === 'ru' ? 'Отправить заявление' : 'Арызды жөнөтүү')
                        }
                      </span>
                    </button>
                  )}
                </div>

                {/* Отображение ошибок */}
                {submitState.submitError && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{submitState.submitError}</span>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}