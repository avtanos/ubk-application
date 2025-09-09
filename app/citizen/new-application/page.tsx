'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { regions, incomeCategories } from '@/lib/mockData';
import { calculateBenefit, validateFamilyComposition } from '@/lib/benefitCalculator';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
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

export default function NewApplication() {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [useNewForm, setUseNewForm] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 1,
      type: 'adult', // 'adult' или 'child'
    fullName: '',
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
      income: {
        salary: 0,
        pension: 0,
        benefit: 0,
        businessIncome: 0,
        propertyIncome: 0,
        agriculturalIncome: 0,
        otherIncome: 0
      }
    }
  ]);

  // Состояние для подсобного хозяйства
  const [subsidiaryFarming, setSubsidiaryFarming] = useState({
    landPlots: [
      {
        id: 1,
        type: '',
        area: 0,
        unit: 'соток'
      }
    ],
    livestock: [
      {
        id: 1,
        type: '',
        count: 0
      }
    ],
    vehicles: [
      {
        id: 1,
        type: '',
        year: new Date().getFullYear(),
        model: ''
      }
    ]
  });

  // Состояние для доходов
  const [familyIncome, setFamilyIncome] = useState({
    // Основной доход (зарплата, пенсия, соц.выплаты)
    mainIncome: {
      salary: 0,
      pension: 0,
      socialBenefits: 0,
      otherMainIncome: 0
    },
    // Доход от образования (стипендии, обучение)
    educationIncome: {
      scholarships: 0,
      trainingIncome: 0,
      otherEducationIncome: 0
    },
    // Прочие доходы (алименты, аренда, помощь)
    otherIncome: {
      alimony: 0,
      rent: 0,
      assistance: 0,
      otherMiscIncome: 0
    },
    // Предпринимательская деятельность
    businessIncome: {
      businessRevenue: 0,
      taxData: {
        taxNumber: '',
        taxPeriod: '',
        declaredIncome: 0
      }
    },
    // Финансовые инструменты
    financialAssets: [
      {
        id: 1,
        type: '',
        amount: 0,
        monthlyIncome: 0
      }
    ]
  });

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
      income: {
        salary: 0,
        pension: 0,
        benefit: 0,
        businessIncome: 0,
        propertyIncome: 0,
        agriculturalIncome: 0,
        otherIncome: 0
      }
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  // Функция для удаления члена семьи
  const removeFamilyMember = (id: number) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter(member => member.id !== id));
    }
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

  // Функции для управления подсобным хозяйством
  const addLandPlot = () => {
    const newPlot = {
      id: Date.now(),
      type: '',
      area: 0,
      unit: 'соток'
    };
    setSubsidiaryFarming(prev => ({
      ...prev,
      landPlots: [...prev.landPlots, newPlot]
    }));
  };

  const removeLandPlot = (id: number) => {
    if (subsidiaryFarming.landPlots.length > 1) {
      setSubsidiaryFarming(prev => ({
        ...prev,
        landPlots: prev.landPlots.filter(plot => plot.id !== id)
      }));
    }
  };

  const updateLandPlot = (id: number, field: string, value: any) => {
    setSubsidiaryFarming(prev => ({
      ...prev,
      landPlots: prev.landPlots.map(plot => 
        plot.id === id ? { ...plot, [field]: value } : plot
      )
    }));
  };

  const addLivestock = () => {
    const newLivestock = {
      id: Date.now(),
      type: '',
      count: 0
    };
    setSubsidiaryFarming(prev => ({
      ...prev,
      livestock: [...prev.livestock, newLivestock]
    }));
  };

  const removeLivestock = (id: number) => {
    if (subsidiaryFarming.livestock.length > 1) {
      setSubsidiaryFarming(prev => ({
        ...prev,
        livestock: prev.livestock.filter(item => item.id !== id)
      }));
    }
  };

  const updateLivestock = (id: number, field: string, value: any) => {
    setSubsidiaryFarming(prev => ({
      ...prev,
      livestock: prev.livestock.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addVehicle = () => {
    const newVehicle = {
      id: Date.now(),
      type: '',
      year: new Date().getFullYear(),
      model: ''
    };
    setSubsidiaryFarming(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle]
    }));
  };

  const removeVehicle = (id: number) => {
    if (subsidiaryFarming.vehicles.length > 1) {
      setSubsidiaryFarming(prev => ({
        ...prev,
        vehicles: prev.vehicles.filter(vehicle => vehicle.id !== id)
      }));
    }
  };

  const updateVehicle = (id: number, field: string, value: any) => {
    setSubsidiaryFarming(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle => 
        vehicle.id === id ? { ...vehicle, [field]: value } : vehicle
      )
    }));
  };

  // Функция для расчета условных голов скота
  const calculateConventionalUnits = () => {
    const { livestock } = subsidiaryFarming;
    const conversionRates = {
      cow: 1.0,
      horse: 1.0,
      sheep: 0.1,
      goat: 0.1,
      pig: 0.2,
      chicken: 0.01,
      duck: 0.01,
      goose: 0.01
    };

    return livestock.reduce((total, item) => {
      const rate = conversionRates[item.type as keyof typeof conversionRates] || 0;
      return total + (item.count * rate);
    }, 0);
  };

  // Функция для проверки возраста автомобиля
  const isCarAgeValid = (year: number) => {
    const currentYear = new Date().getFullYear();
    return (currentYear - year) < 20;
  };

  // Функция для расчета общего имущества в МПЦ
  const calculateTotalPropertyValue = () => {
    const conventionalUnits = calculateConventionalUnits();
    const totalLandArea = subsidiaryFarming.landPlots.reduce((sum, plot) => sum + plot.area, 0);
    const vehicleCount = subsidiaryFarming.vehicles.length;
    
    // Примерные коэффициенты для расчета в МПЦ
    const landValue = totalLandArea * 0.1; // 0.1 МПЦ за сотку
    const livestockValue = conventionalUnits * 0.5; // 0.5 МПЦ за условную голову
    const vehicleValue = vehicleCount * 2.0; // 2 МПЦ за транспортное средство
    
    return landValue + livestockValue + vehicleValue;
  };

  // Функции для управления доходами
  const updateMainIncome = (field: string, value: number) => {
    setFamilyIncome(prev => ({
      ...prev,
      mainIncome: { ...prev.mainIncome, [field]: value }
    }));
  };

  const updateEducationIncome = (field: string, value: number) => {
    setFamilyIncome(prev => ({
      ...prev,
      educationIncome: { ...prev.educationIncome, [field]: value }
    }));
  };

  const updateOtherIncome = (field: string, value: number) => {
    setFamilyIncome(prev => ({
        ...prev,
      otherIncome: { ...prev.otherIncome, [field]: value }
    }));
  };

  const updateBusinessIncome = (field: string, value: any) => {
    setFamilyIncome(prev => ({
      ...prev,
      businessIncome: { ...prev.businessIncome, [field]: value }
    }));
  };

  const updateTaxData = (field: string, value: any) => {
    setFamilyIncome(prev => ({
      ...prev,
      businessIncome: {
        ...prev.businessIncome,
        taxData: { ...prev.businessIncome.taxData, [field]: value }
      }
    }));
  };

  const addFinancialAsset = () => {
    const newAsset = {
      id: Date.now(),
      type: '',
      amount: 0,
      monthlyIncome: 0
    };
    setFamilyIncome(prev => ({
      ...prev,
      financialAssets: [...prev.financialAssets, newAsset]
    }));
  };

  const removeFinancialAsset = (id: number) => {
    if (familyIncome.financialAssets.length > 1) {
      setFamilyIncome(prev => ({
        ...prev,
        financialAssets: prev.financialAssets.filter(asset => asset.id !== id)
      }));
    }
  };

  const updateFinancialAsset = (id: number, field: string, value: any) => {
    setFamilyIncome(prev => ({
      ...prev,
      financialAssets: prev.financialAssets.map(asset => 
        asset.id === id ? { ...asset, [field]: value } : asset
      )
    }));
  };

  // Функция для расчета суммарного дохода семьи
  const calculateTotalFamilyIncome = () => {
    const { mainIncome, educationIncome, otherIncome, businessIncome, financialAssets } = familyIncome;
    
    const mainTotal = Object.values(mainIncome).reduce((sum, value) => sum + value, 0);
    const educationTotal = Object.values(educationIncome).reduce((sum, value) => sum + value, 0);
    const otherTotal = Object.values(otherIncome).reduce((sum, value) => sum + value, 0);
    const businessTotal = businessIncome.businessRevenue;
    const financialTotal = financialAssets.reduce((sum, asset) => sum + asset.monthlyIncome, 0);
    
    return mainTotal + educationTotal + otherTotal + businessTotal + financialTotal;
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
      completionData.applicantSignature &&
      documents.applicantPassport.isValid &&
      documents.familyCompositionCertificate.isValid &&
      familyMembers.filter(member => member.type === 'child').every(child => 
        documents.childrenBirthCertificates.some(cert => cert.childId === child.id && cert.isValid)
      )
    );
  };

  // Функция для отправки заявления
  const submitApplication = () => {
    if (!isReadyToSubmit()) {
      alert(language === 'ru' ? 'Пожалуйста, заполните все обязательные поля' : 'Сураныч, бардык милдеттүү талааларды толтуруңуз');
      return;
    }

    const applicationNumber = generateApplicationNumber();
    updateCompletionData('applicationNumber', applicationNumber);

    // Здесь будет логика отправки данных на сервер
    console.log('Заявление отправлено:', {
      applicationNumber,
      familyMembers,
      familyIncome,
      subsidiaryFarming,
      documents,
      completionData,
      tuData,
      benefitCalculation: calculateDetailedBenefit()
    });

    alert(language === 'ru' 
      ? `Заявление №${applicationNumber} успешно отправлено!`
      : `№${applicationNumber} арыз ийгиликтүү жөнөтүлдү!`
    );
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

  // Дополнительные удостоверения
  const addAdditionalId = () => {
    const newId = {
      id: Date.now(),
      type: '',
      series: '',
      number: '',
      issuingAuthority: '',
      issueDate: '',
      expiryDate: ''
    };
    setTuData(prev => ({
      ...prev,
      additionalIds: [...prev.additionalIds, newId]
    }));
  };

  const removeAdditionalId = (id: number) => {
    setTuData(prev => ({
      ...prev,
      additionalIds: prev.additionalIds.filter(item => item.id !== id)
    }));
  };

  const updateAdditionalId = (id: number, field: string, value: any) => {
    setTuData(prev => ({
      ...prev,
      additionalIds: prev.additionalIds.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  // Адреса
  const addAddress = (type: 'REG' | 'FACT') => {
    const newAddress = {
      id: Date.now(),
      type,
      regionCode: '',
      raionCode: '',
      localityCode: '',
      street: '',
      house: '',
      flat: '',
      postalCode: '',
      isPrimary: false
    };
    setTuData(prev => ({
      ...prev,
      addresses: [...prev.addresses, newAddress]
    }));
  };

  const removeAddress = (id: number) => {
    setTuData(prev => ({
      ...prev,
      addresses: prev.addresses.filter(item => item.id !== id)
    }));
  };

  const updateAddress = (id: number, field: string, value: any) => {
    setTuData(prev => ({
      ...prev,
      addresses: prev.addresses.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  // Контакты
  const addContact = () => {
    const newContact = {
      id: Date.now(),
      type: '',
      value: '',
      isPrimary: false
    };
    setTuData(prev => ({
      ...prev,
      contacts: [...prev.contacts, newContact]
    }));
  };

  const removeContact = (id: number) => {
    setTuData(prev => ({
      ...prev,
      contacts: prev.contacts.filter(item => item.id !== id)
    }));
  };

  const updateContact = (id: number, field: string, value: any) => {
    setTuData(prev => ({
      ...prev,
      contacts: prev.contacts.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  // Специальные компенсации
  const addSpecialCompensation = () => {
    const newCompensation = {
      id: Date.now(),
      reason: '',
      type: '',
      amount: 0,
      periodFrom: '',
      periodTo: ''
    };
    setTuData(prev => ({
      ...prev,
      specialCompensations: [...prev.specialCompensations, newCompensation]
    }));
  };

  const removeSpecialCompensation = (id: number) => {
    setTuData(prev => ({
      ...prev,
      specialCompensations: prev.specialCompensations.filter(item => item.id !== id)
    }));
  };

  const updateSpecialCompensation = (id: number, field: string, value: any) => {
    setTuData(prev => ({
      ...prev,
      specialCompensations: prev.specialCompensations.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

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
    const incomes = [
      { amount: familyIncome.mainIncome.salary, periodicity: 'M' as 'M' | 'Y' },
      { amount: familyIncome.mainIncome.pension, periodicity: 'M' as 'M' | 'Y' },
      { amount: familyIncome.mainIncome.socialBenefits, periodicity: 'M' as 'M' | 'Y' },
      { amount: familyIncome.mainIncome.otherMainIncome, periodicity: 'M' as 'M' | 'Y' }
    ].filter(income => income.amount > 0);

    const livestock = subsidiaryFarming.livestock.map(item => ({
      type: item.type,
      count: item.count
    }));

    const vehicles = subsidiaryFarming.vehicles.map(vehicle => ({
      type: vehicle.type,
      year: vehicle.year,
      isLightCar: vehicle.type === 'car' // Простая логика для определения легкового авто
    }));

    const familySize = familyMembers.length + 1; // +1 для заявителя

    // Расчет метрик
    const metrics = calculateHouseholdMetrics(incomes, livestock, vehicles, familySize);
    
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
    auditLogger.logCalculation('BENEFIT', 0, 0, 'SPECIALIST', { incomes, livestock, vehicles, familySize }, metrics);
  };

  // Обновление валидации при изменении данных
  useEffect(() => {
    calculateHouseholdMetricsData();
  }, [familyMembers, familyIncome, subsidiaryFarming]);

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
              <Link href="/citizen" className="flex items-center space-x-4">
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
              <button
                onClick={() => setUseNewForm(!useNewForm)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  useNewForm 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {useNewForm ? 'Новая форма' : 'Старая форма'}
              </button>
            <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {useNewForm ? (
          <ApplicationForm />
        ) : (
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

                    {/* Категория заявителя */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Категория заявителя' : 'Арыз берүүчүнүн категориясы'} <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option value="">{language === 'ru' ? 'Выберите категорию' : 'Категорияны тандаңыз'}</option>
                        {applicantTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                  </div>

                    {/* Орган соцзащиты */}
                  <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Орган соцзащиты' : 'Социалдык коргоо органы'} <span className="text-red-500">*</span>
                          </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option value="">{language === 'ru' ? 'Выберите орган соцзащиты' : 'Социалдык коргоо органдын тандаңыз'}</option>
                        {municipalAuthorities.map(authority => (
                          <option key={authority.id} value={authority.id}>
                            {authority.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Основной документ */}
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      {language === 'ru' ? 'Основной документ' : 'Негизги документ'} <span className="text-red-500">*</span>
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
                    </div>
                  </div>

                  {/* Адрес проживания - структурированный */}
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      {language === 'ru' ? 'Адрес проживания' : 'Турак жай дареги'} <span className="text-red-500">*</span>
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
                            onClick={() => removeAdditionalId(id.id)}
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
                              onChange={(e) => updateAdditionalId(id.id, 'type', e.target.value)}
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
                              onChange={(e) => updateAdditionalId(id.id, 'series', e.target.value)}
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
                              onChange={(e) => updateAdditionalId(id.id, 'number', e.target.value)}
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
                              onChange={(e) => updateAdditionalId(id.id, 'issuingAuthority', e.target.value)}
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
                              onChange={(e) => updateAdditionalId(id.id, 'issueDate', e.target.value)}
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
                              onChange={(e) => updateAdditionalId(id.id, 'expiryDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      </div>
                    </div>
                  ))}
                    
                    <button
                      type="button"
                      onClick={addAdditionalId}
                      className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                    >
                      {language === 'ru' ? '+ Добавить удостоверение' : '+ Кимдик документ кошуу'}
                    </button>
                  </div>
                      </div>

                {/* Раздел 1.2: Орган соцзащиты и категории */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '1.2. Орган соцзащиты и категории' : '1.2. Социалдык коргоо органы жана категориялар'}
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

                {/* Раздел 1.3: Платежные реквизиты */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '1.3. Платежные реквизиты' : '1.3. Төлөм реквизиттери'}
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

                {/* Раздел 1.4: Адреса (REG/FACT) */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '1.4. Адреса регистрации и проживания' : '1.4. Каттоо жана жашаган дареги'}
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
                                onChange={(e) => updateAddress(address.id, 'isPrimary', e.target.checked)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">
                                {language === 'ru' ? 'Основной' : 'Негизги'}
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeAddress(address.id)}
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
                              onChange={(e) => updateAddress(address.id, 'regionCode', e.target.value)}
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
                              onChange={(e) => updateAddress(address.id, 'raionCode', e.target.value)}
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
                              onChange={(e) => updateAddress(address.id, 'localityCode', e.target.value)}
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
                              onChange={(e) => updateAddress(address.id, 'street', e.target.value)}
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
                              onChange={(e) => updateAddress(address.id, 'house', e.target.value)}
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
                              onChange={(e) => updateAddress(address.id, 'flat', e.target.value)}
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
                              onChange={(e) => updateAddress(address.id, 'postalCode', e.target.value)}
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
                        onClick={() => addAddress('REG')}
                        className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                      >
                        {language === 'ru' ? '+ Адрес регистрации' : '+ Каттоо дареги'}
                      </button>
                      <button
                        type="button"
                        onClick={() => addAddress('FACT')}
                        className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                      >
                        {language === 'ru' ? '+ Фактический адрес' : '+ Фактик дареги'}
                      </button>
                    </div>
                    </div>
                  </div>

                {/* Раздел 1.5: Контакты (мульти) */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '1.5. Контактная информация' : '1.5. Байланыш маалыматы'}
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
                                onChange={(e) => updateContact(contact.id, 'isPrimary', e.target.checked)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">
                                {language === 'ru' ? 'Основной' : 'Негизги'}
                              </span>
                          </label>
                            <button
                              type="button"
                              onClick={() => removeContact(contact.id)}
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
                              onChange={(e) => updateContact(contact.id, 'type', e.target.value)}
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
                              onChange={(e) => updateContact(contact.id, 'value', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите контакт' : 'Байланышты киргизиңиз'}
                            />
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    <button
                      type="button"
                      onClick={addContact}
                      className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                    >
                      {language === 'ru' ? '+ Добавить контакт' : '+ Байланыш кошуу'}
                    </button>
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
                          {/* ФИО члена семьи */}
              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'ФИО члена семьи' : 'Үй-бүлө мүчөсүнүн аты-жөнү'} <span className="text-red-500">*</span>
                          </label>
                        <input
                            type="text"
                              value={member.fullName}
                              onChange={(e) => updateFamilyMember(member.id, 'fullName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите полное имя' : 'Толук атын киргизиңиз'}
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

                        {/* Свидетельство о рождении - только для детей */}
                        {member.type === 'child' && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h5 className="font-medium text-blue-900 mb-3">
                              {language === 'ru' ? 'Свидетельство о рождении' : 'Туулган күбөлүгү'}
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                                <label className="block text-sm font-medium text-blue-800 mb-1">
                                  {language === 'ru' ? 'Номер свидетельства' : 'Күбөлүктүн номуру'}
                          </label>
                            <input
                                  type="text"
                                  value={member.birthCertificate.number}
                                  onChange={(e) => updateFamilyMember(member.id, 'birthCertificate.number', e.target.value)}
                                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder={language === 'ru' ? 'Введите номер' : 'Номурун киргизиңиз'}
                                />
                            </div>
                              <div>
                                <label className="block text-sm font-medium text-blue-800 mb-1">
                                  {language === 'ru' ? 'Дата выдачи' : 'Берилген күнү'}
                                </label>
                      <input
                                  type="date"
                                  value={member.birthCertificate.issueDate}
                                  onChange={(e) => updateFamilyMember(member.id, 'birthCertificate.issueDate', e.target.value)}
                                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                          </div>
                              <div>
                                <label className="block text-sm font-medium text-blue-800 mb-1">
                                  {language === 'ru' ? 'Орган выдачи' : 'Берүүчү орган'}
                                </label>
                      <input
                                  type="text"
                                  value={member.birthCertificate.issuingAuthority}
                                  onChange={(e) => updateFamilyMember(member.id, 'birthCertificate.issuingAuthority', e.target.value)}
                                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder={language === 'ru' ? 'Введите орган выдачи' : 'Берүүчү органды киргизиңиз'}
                                />
                        </div>
                    </div>
                  </div>
            )}

                        {/* Детализированные доходы - только для взрослых */}
                        {member.type === 'adult' && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h5 className="font-medium text-green-900 mb-3">
                              {language === 'ru' ? 'Ежемесячные доходы (по видам)' : 'Айлык кирешелер (түрлөрү боюнча)'}
                                </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {incomeTypeList.slice(0, 6).map(incomeType => (
                                <div key={incomeType.id}>
                                  <label className="block text-sm font-medium text-green-800 mb-1">
                                    {incomeType.name}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                                      value={member.income[incomeType.id as keyof typeof member.income] || 0}
                                      onChange={(e) => updateFamilyMember(member.id, `income.${incomeType.id}`, parseFloat(e.target.value) || 0)}
                                      className="w-full pl-8 pr-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="0"
                              min="0"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-green-600 text-sm">₽</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                            <div className="mt-3 p-3 bg-green-100 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-green-900">
                                  {language === 'ru' ? 'Общий доход:' : 'Жалпы киреше:'}
                    </span>
                                <span className="font-bold text-green-900 text-lg">
                                  {Object.values(member.income).reduce((sum, income) => sum + (income || 0), 0)} ₽
                        </span>
                  </div>
                </div>
              </div>
            )}
                        </div>
                    ))}
                    
                    {/* Кнопки добавления членов семьи */}
                    <div className="flex flex-col sm:flex-row gap-3">
              <button
                        onClick={() => addFamilyMember('adult')}
                        className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 inline-flex items-center justify-center"
                      >
                        <i className="ri-user-add-line mr-2"></i>
                        {language === 'ru' ? 'Добавить взрослого' : 'Чоң адамды кошуу'}
              </button>
                  <button
                        onClick={() => addFamilyMember('child')}
                        className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center justify-center"
                >
                        <i className="ri-user-heart-line mr-2"></i>
                        {language === 'ru' ? 'Добавить ребенка' : 'Баланы кошуу'}
                  </button>
                    </div>
                  </div>
                </div>

                {/* Раздел 3: Подсобное хозяйство */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '3. Подсобное хозяйство' : '3. Жардамчы чарба'}
                  </h3>
                  
                  <div className="space-y-6">
                {/* Земельные участки */}
                    <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">
                    {language === 'ru' ? 'Земельные участки' : 'Жер учактары'}
                  </h4>
                      
                      <div className="space-y-4">
                        {subsidiaryFarming.landPlots.map((plot, index) => (
                          <div key={plot.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-medium text-gray-800">
                                {language === 'ru' ? `Участок ${index + 1}` : `Учак ${index + 1}`}
                              </h5>
                              {subsidiaryFarming.landPlots.length > 1 && (
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
                          value={plot.type}
                                  onChange={(e) => updateLandPlot(plot.id, 'type', e.target.value)}
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
                          value={plot.area}
                                    onChange={(e) => updateLandPlot(plot.id, 'area', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent rounded-r-none"
                          placeholder="0"
                              min="0"
                        />
                                  <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600">
                                    {plot.unit}
                        </span>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Единица измерения' : 'Өлчөм бирдиги'}
                                </label>
                                <select 
                                  value={plot.unit}
                                  onChange={(e) => updateLandPlot(plot.id, 'unit', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                  <option value="соток">{language === 'ru' ? 'Соток' : 'Соток'}</option>
                                  <option value="га">{language === 'ru' ? 'Гектар' : 'Гектар'}</option>
                                  <option value="м²">{language === 'ru' ? 'Квадратный метр' : 'Квадрат метр'}</option>
                                </select>
                            </div>
                          </div>
                        </div>
                      ))}
                        
                          <button
                          onClick={addLandPlot}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center justify-center"
                        >
                          <i className="ri-add-line mr-2"></i>
                          {language === 'ru' ? 'Добавить участок' : 'Учакта кошуу'}
                        </button>
                    </div>
                  </div>

                    {/* Скот */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Скот' : 'Мал'}
                    </h4>
                      
                      <div className="space-y-4">
                        {subsidiaryFarming.livestock.map((item, index) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-medium text-gray-800">
                                {language === 'ru' ? `Скот ${index + 1}` : `Мал ${index + 1}`}
                              </h5>
                              {subsidiaryFarming.livestock.length > 1 && (
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
                                  value={item.type}
                                  onChange={(e) => updateLivestock(item.id, 'type', e.target.value)}
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
                                  value={item.count}
                                  onChange={(e) => updateLivestock(item.id, 'count', parseFloat(e.target.value) || 0)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="0"
                              min="0"
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
                          {language === 'ru' ? 'Добавить скот' : 'Мал кошуу'}
                    </button>
                      </div>
                      
                      {/* Автоматический расчет условных голов */}
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-yellow-800">
                            {language === 'ru' ? 'Условные головы:' : 'Шарттуу баштар:'}
                          </span>
                          <span className="font-bold text-yellow-900 text-lg">
                            {calculateConventionalUnits().toFixed(2)}
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
                        {subsidiaryFarming.vehicles.map((vehicle, index) => (
                          <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-medium text-gray-800">
                                {language === 'ru' ? `Транспорт ${index + 1}` : `Транспорт ${index + 1}`}
                              </h5>
                              {subsidiaryFarming.vehicles.length > 1 && (
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
                                  value={vehicle.type}
                                  onChange={(e) => updateVehicle(vehicle.id, 'type', e.target.value)}
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
                                    vehicle.type === 'passenger_car' && !isCarAgeValid(vehicle.year)
                                      ? 'border-red-500 focus:ring-red-500'
                                      : 'border-gray-300 focus:ring-red-500'
                                  }`}
                                  min="1900"
                                  max={new Date().getFullYear()}
                                />
                                {vehicle.type === 'passenger_car' && !isCarAgeValid(vehicle.year) && (
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
                                  value={vehicle.model}
                                  onChange={(e) => updateVehicle(vehicle.id, 'model', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                  placeholder={language === 'ru' ? 'Введите модель' : 'Моделди киргизиңиз'}
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
                          {language === 'ru' ? 'Добавить транспорт' : 'Транспорт кошуу'}
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
                            {subsidiaryFarming.landPlots.reduce((sum, plot) => sum + plot.area, 0)}
                            </div>
                          <div className="text-sm text-gray-600">
                            {language === 'ru' ? 'Соток земли' : 'Жер соток'}
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {calculateConventionalUnits().toFixed(1)}
                    </div>
                          <div className="text-sm text-gray-600">
                            {language === 'ru' ? 'Условных голов' : 'Шарттуу баштар'}
                  </div>
                </div>

                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {subsidiaryFarming.vehicles.length}
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

                {/* Раздел 4: Доходы */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '4. Доходы' : '4. Киреше'}
                </h3>
                
                  <div className="space-y-6">
                    {/* Основной доход (зарплата, пенсия, соц.выплаты) */}
                    <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Основной доход (зарплата, пенсия, соц.выплаты)' : 'Негизги киреше (эмгек акы, пенсия, социалдык төлөмдөр)'}
                  </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Зарплата' : 'Эмгек акы'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                            value={familyIncome.mainIncome.salary}
                            onChange={(e) => updateMainIncome('salary', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Пенсия' : 'Пенсия'}
                      </label>
                      <input
                        type="number"
                            value={familyIncome.mainIncome.pension}
                            onChange={(e) => updateMainIncome('pension', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="0"
                        min="0"
                      />
                    </div>
                        
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Социальные выплаты' : 'Социалдык төлөмдөр'}
                      </label>
                      <input
                        type="number"
                            value={familyIncome.mainIncome.socialBenefits}
                            onChange={(e) => updateMainIncome('socialBenefits', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="0"
                        min="0"
                      />
                    </div>
                        
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Прочий основной доход' : 'Башка негизги киреше'}
                      </label>
                      <input
                        type="number"
                            value={familyIncome.mainIncome.otherMainIncome}
                            onChange={(e) => updateMainIncome('otherMainIncome', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                    {/* Доход от образования (стипендии, обучение) */}
                    <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Доход от образования (стипендии, обучение)' : 'Билим берүүдөн киреше (стипендия, окутуу)'}
                  </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Стипендии' : 'Стипендия'}
                      </label>
                      <input
                        type="number"
                            value={familyIncome.educationIncome.scholarships}
                            onChange={(e) => updateEducationIncome('scholarships', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="0"
                        min="0"
                      />
                    </div>
                        
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Доход от обучения' : 'Окутуудан киреше'}
                      </label>
                      <input
                        type="number"
                            value={familyIncome.educationIncome.trainingIncome}
                            onChange={(e) => updateEducationIncome('trainingIncome', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="0"
                        min="0"
                      />
                    </div>
                        
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Прочий доход от образования' : 'Билим берүүдөн башка киреше'}
                      </label>
                      <input
                        type="number"
                            value={familyIncome.educationIncome.otherEducationIncome}
                            onChange={(e) => updateEducationIncome('otherEducationIncome', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                    {/* Прочие доходы (алименты, аренда, помощь) */}
                    <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Прочие доходы (алименты, аренда, помощь)' : 'Башка кирешелер (алимент, аренда, жардам)'}
                  </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Алименты' : 'Алимент'}
                      </label>
                      <input
                        type="number"
                            value={familyIncome.otherIncome.alimony}
                            onChange={(e) => updateOtherIncome('alimony', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="0"
                        min="0"
                      />
                    </div>
                        
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Аренда' : 'Аренда'}
                      </label>
                        <input
                          type="number"
                            value={familyIncome.otherIncome.rent}
                            onChange={(e) => updateOtherIncome('rent', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="0"
                          min="0"
                      />
                    </div>
                        
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Помощь' : 'Жардам'}
                      </label>
                      <input
                        type="number"
                            value={familyIncome.otherIncome.assistance}
                            onChange={(e) => updateOtherIncome('assistance', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="0"
                        min="0"
                          />
                    </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Прочие доходы' : 'Башка кирешелер'}
                          </label>
                      <input
                            type="number"
                            value={familyIncome.otherIncome.otherMiscIncome}
                            onChange={(e) => updateOtherIncome('otherMiscIncome', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                      />
                    </div>
                  </div>
                </div>

                    {/* Предпринимательская деятельность */}
                    <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Предпринимательская деятельность' : 'Кесипкердик ишмердик'}
                  </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Доход от предпринимательской деятельности' : 'Кесипкердик ишмердиктен киреше'} <span className="text-red-500">*</span>
                      </label>
                      <input
                            type="number"
                            value={familyIncome.businessIncome.businessRevenue}
                            onChange={(e) => updateBusinessIncome('businessRevenue', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                    </div>
                        
                        {/* Налоговые данные */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h5 className="font-medium text-blue-900 mb-3">
                            {language === 'ru' ? 'Налоговые данные' : 'Салык маалыматтары'}
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ru' ? 'Налоговый номер' : 'Салык номуру'}
                      </label>
                      <input
                                type="text"
                                value={familyIncome.businessIncome.taxData.taxNumber}
                                onChange={(e) => updateTaxData('taxNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder={language === 'ru' ? 'Введите налоговый номер' : 'Салык номурун киргизиңиз'}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ru' ? 'Налоговый период' : 'Салык мезгили'}
                      </label>
                              <input
                                type="text"
                                value={familyIncome.businessIncome.taxData.taxPeriod}
                                onChange={(e) => updateTaxData('taxPeriod', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder={language === 'ru' ? 'Например: 2024' : 'Мисалы: 2024'}
                              />
                    </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ru' ? 'Заявленный доход' : 'Билдирилген киреше'}
                              </label>
                        <input
                          type="number"
                                value={familyIncome.businessIncome.taxData.declaredIncome}
                                onChange={(e) => updateTaxData('declaredIncome', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="0"
                                min="0"
                              />
                  </div>
                </div>
              </div>
                      </div>
                    </div>

                    {/* Финансовые инструменты */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Финансовые инструменты (вклады, ценные бумаги и другие)' : 'Каржы каражаттары (депозит, баалуу кагаздар жана башкалар)'}
                      </h4>

                <div className="space-y-4">
                        {familyIncome.financialAssets.map((asset, index) => (
                          <div key={asset.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-medium text-gray-800">
                                {language === 'ru' ? `Финансовый инструмент ${index + 1}` : `Каржы каражаты ${index + 1}`}
                              </h5>
                              {familyIncome.financialAssets.length > 1 && (
                                <button
                                  onClick={() => removeFinancialAsset(asset.id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <i className="ri-delete-bin-line"></i>
                              </button>
                      )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Тип инструмента' : 'Каражаттын түрү'} <span className="text-red-500">*</span>
                                </label>
                                <select 
                                  value={asset.type}
                                  onChange={(e) => updateFinancialAsset(asset.id, 'type', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                  <option value="">{language === 'ru' ? 'Выберите тип' : 'Түрүн тандаңыз'}</option>
                                  {financialAssetsList.map(type => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Сумма' : 'Сумма'}
                                </label>
                      <input
                                  type="number"
                                  value={asset.amount}
                                  onChange={(e) => updateFinancialAsset(asset.id, 'amount', parseFloat(e.target.value) || 0)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                  placeholder="0"
                                  min="0"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Ежемесячный доход' : 'Айлык киреше'}
                      </label>
                                <input
                                  type="number"
                                  value={asset.monthlyIncome}
                                  onChange={(e) => updateFinancialAsset(asset.id, 'monthlyIncome', parseFloat(e.target.value) || 0)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                  placeholder="0"
                                  min="0"
                                />
                    </div>
                            </div>
                          </div>
                        ))}
                        
                        <button
                          onClick={addFinancialAsset}
                          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 inline-flex items-center justify-center"
                        >
                          <i className="ri-add-line mr-2"></i>
                          {language === 'ru' ? 'Добавить финансовый инструмент' : 'Каржы каражатын кошуу'}
                        </button>
                      </div>
                    </div>

                    {/* Автоматические расчеты */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
                      <h4 className="font-medium text-green-900 mb-4">
                        {language === 'ru' ? 'Автоматические расчеты' : 'Автоматтык эсептөөлөр'}
                    </h4>
                      
                      <div className="space-y-4">
                        {/* Суммарный доход семьи */}
                        <div className="flex justify-between items-center p-3 bg-white border border-green-200 rounded-lg">
                          <span className="font-medium text-gray-800">
                            {language === 'ru' ? 'Суммарный доход семьи:' : 'Үй-бүлөнүн жалпы кирешеси:'}
                          </span>
                          <span className="font-bold text-green-900 text-lg">
                            {calculateTotalFamilyIncome().toLocaleString()} {language === 'ru' ? 'сом' : 'сом'}
                          </span>
                  </div>
                        
                        {/* Среднедушевой доход (ССДС) */}
                        <div className="flex justify-between items-center p-3 bg-white border border-green-200 rounded-lg">
                          <span className="font-medium text-gray-800">
                            {language === 'ru' ? 'Среднедушевой доход (ССДС):' : 'Адам башына киреше (АБК):'}
                          </span>
                          <span className="font-bold text-green-900 text-lg">
                            {calculatePerCapitaIncome().toLocaleString()} {language === 'ru' ? 'сом' : 'сом'}
                          </span>
                </div>
                        
                        {/* Сравнение с ГМД */}
                        <div className="flex justify-between items-center p-3 bg-white border border-green-200 rounded-lg">
                          <span className="font-medium text-gray-800">
                            {language === 'ru' ? 'Гарантированный минимальный доход (ГМД):' : 'Кепилденген минималдык киреше (КМК):'}
                          </span>
                          <span className="font-bold text-blue-900 text-lg">
                            {GUARANTEED_MINIMUM_INCOME.toLocaleString()} {language === 'ru' ? 'сом' : 'сом'}
                          </span>
              </div>
                        
                        {/* Статус соответствия критерию */}
                        <div className={`p-4 rounded-lg border-2 ${isIncomeEligible() ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
                          <div className="flex items-center">
                            <i className={`ri-${isIncomeEligible() ? 'check-line' : 'close-line'} text-2xl ${isIncomeEligible() ? 'text-green-600' : 'text-red-600'} mr-3`}></i>
                            <div>
                              <h5 className={`font-bold ${isIncomeEligible() ? 'text-green-800' : 'text-red-800'}`}>
                                {isIncomeEligible() 
                                  ? (language === 'ru' ? 'Соответствует критерию дохода' : 'Киреше критерийине туура келет')
                                  : (language === 'ru' ? 'Не соответствует критерию дохода' : 'Киреше критерийине туура келбейт')
                                }
                              </h5>
                              <p className={`text-sm ${isIncomeEligible() ? 'text-green-700' : 'text-red-700'}`}>
                                {isIncomeEligible()
                                  ? (language === 'ru' 
                                      ? `ССДС (${calculatePerCapitaIncome().toLocaleString()} сом) ≤ ГМД (${GUARANTEED_MINIMUM_INCOME.toLocaleString()} сом)`
                                      : `АБК (${calculatePerCapitaIncome().toLocaleString()} сом) ≤ КМК (${GUARANTEED_MINIMUM_INCOME.toLocaleString()} сом)`
                                    )
                                  : (language === 'ru' 
                                      ? `ССДС (${calculatePerCapitaIncome().toLocaleString()} сом) > ГМД (${GUARANTEED_MINIMUM_INCOME.toLocaleString()} сом)`
                                      : `АБК (${calculatePerCapitaIncome().toLocaleString()} сом) > КМК (${GUARANTEED_MINIMUM_INCOME.toLocaleString()} сом)`
                                    )
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Раздел 5: Документы */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '5. Документы' : '5. Документтер'}
                </h3>
                
                  <div className="space-y-6">
                    {/* Паспорт заявителя */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Паспорт заявителя' : 'Арыз берүүчүнүн паспорту'} <span className="text-red-500">*</span>
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-4">
                      <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => updateApplicantPassport(e.target.files?.[0] || null)}
                            className="hidden"
                            id="applicant-passport"
                          />
                          <label
                            htmlFor="applicant-passport"
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center justify-center"
                          >
                            <i className="ri-upload-line mr-2"></i>
                            {language === 'ru' ? 'Выбрать файл' : 'Файл тандаңыз'}
                      </label>
                    </div>
                        
                        {documents.applicantPassport.fileName && (
                          <div className={`p-3 rounded-lg border ${documents.applicantPassport.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <i className={`ri-${documents.applicantPassport.isValid ? 'check-line' : 'error-warning-line'} text-lg ${documents.applicantPassport.isValid ? 'text-green-600' : 'text-red-600'} mr-2`}></i>
                                <span className="font-medium text-gray-800">{documents.applicantPassport.fileName}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                  ({(documents.applicantPassport.fileSize / 1024 / 1024).toFixed(2)} MB)
                                </span>
                  </div>
                  <button
                                onClick={() => updateApplicantPassport(null)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                </div>
                            {documents.applicantPassport.error && (
                              <p className="text-red-600 text-sm mt-1">{documents.applicantPassport.error}</p>
                            )}
              </div>
            )}

                        <p className="text-sm text-gray-600">
                          {language === 'ru' 
                            ? 'Поддерживаемые форматы: JPG, PNG, PDF. Максимальный размер: 5MB'
                            : 'Колдолуучу форматтар: JPG, PNG, PDF. Максималдык көлөм: 5MB'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Свидетельства о рождении детей */}
                    {familyMembers.filter(member => member.type === 'child').length > 0 && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-4">
                          {language === 'ru' ? 'Свидетельства о рождении детей' : 'Балалардын туулгандыгы тууралуу күбөлүк'} <span className="text-red-500">*</span>
                        </h4>

                <div className="space-y-4">
                          {familyMembers
                            .filter(member => member.type === 'child')
                            .map((child) => {
                              const certificate = documents.childrenBirthCertificates.find(cert => cert.childId === child.id);
                              return (
                                <div key={child.id} className="border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-gray-800">
                                      {language === 'ru' ? 'Ребенок:' : 'Бала:'} {child.fullName}
                                    </h5>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4">
                                    <input
                                      type="file"
                                      accept=".jpg,.jpeg,.png,.pdf"
                                      onChange={(e) => updateChildBirthCertificate(child.id, e.target.files?.[0] || null)}
                                      className="hidden"
                                      id={`child-birth-cert-${child.id}`}
                                    />
                                    <label
                                      htmlFor={`child-birth-cert-${child.id}`}
                                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer inline-flex items-center justify-center"
                                    >
                                      <i className="ri-upload-line mr-2"></i>
                                      {language === 'ru' ? 'Выбрать файл' : 'Файл тандаңыз'}
                                    </label>
                                  </div>
                                  
                                  {certificate && (
                                    <div className={`mt-2 p-3 rounded-lg border ${certificate.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <i className={`ri-${certificate.isValid ? 'check-line' : 'error-warning-line'} text-lg ${certificate.isValid ? 'text-green-600' : 'text-red-600'} mr-2`}></i>
                                          <span className="font-medium text-gray-800">{certificate.fileName}</span>
                                          <span className="text-sm text-gray-500 ml-2">
                                            ({(certificate.fileSize / 1024 / 1024).toFixed(2)} MB)
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => updateChildBirthCertificate(child.id, null)}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          <i className="ri-delete-bin-line"></i>
                  </button>
              </div>
                                      {certificate.error && (
                                        <p className="text-red-600 text-sm mt-1">{certificate.error}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* Справка о составе семьи */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Справка о составе семьи' : 'Үй-бүлө курамы тууралуу справка'} <span className="text-red-500">*</span>
                    </h4>

                          <div className="space-y-3">
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => updateFamilyCompositionCertificate(e.target.files?.[0] || null)}
                            className="hidden"
                            id="family-composition"
                          />
                          <label
                            htmlFor="family-composition"
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center justify-center"
                          >
                            <i className="ri-upload-line mr-2"></i>
                            {language === 'ru' ? 'Выбрать файл' : 'Файл тандаңыз'}
                          </label>
                  </div>
                        
                        {documents.familyCompositionCertificate.fileName && (
                          <div className={`p-3 rounded-lg border ${documents.familyCompositionCertificate.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <i className={`ri-${documents.familyCompositionCertificate.isValid ? 'check-line' : 'error-warning-line'} text-lg ${documents.familyCompositionCertificate.isValid ? 'text-green-600' : 'text-red-600'} mr-2`}></i>
                                <span className="font-medium text-gray-800">{documents.familyCompositionCertificate.fileName}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                  ({(documents.familyCompositionCertificate.fileSize / 1024 / 1024).toFixed(2)} MB)
                              </span>
                </div>
                              <button
                                onClick={() => updateFamilyCompositionCertificate(null)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
              </div>
                            {documents.familyCompositionCertificate.error && (
                              <p className="text-red-600 text-sm mt-1">{documents.familyCompositionCertificate.error}</p>
                            )}
                          </div>
                        )}
                      </div>
                            </div>
                            
                    {/* Справки о доходах */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Справки о доходах' : 'Киреше тууралуу справкалар'}
                      </h4>
                      
                      <div className="space-y-4">
                        {documents.incomeCertificates.map((certificate, index) => (
                          <div key={certificate.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-medium text-gray-800">
                                {language === 'ru' ? `Справка о доходах ${index + 1}` : `Киреше справкасы ${index + 1}`}
                                {isIncomeCertificateRequired(certificate.incomeType) && <span className="text-red-500 ml-1">*</span>}
                                </h5>
                  <button
                                onClick={() => removeIncomeCertificate(certificate.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Тип дохода' : 'Киреше түрү'} <span className="text-red-500">*</span>
                                </label>
                                <select 
                                  value={certificate.incomeType}
                                  onChange={(e) => updateIncomeCertificate(certificate.id, 'incomeType', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                  <option value="">{language === 'ru' ? 'Выберите тип дохода' : 'Киреше түрүн тандаңыз'}</option>
                                  {incomeTypeList.map(type => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === 'ru' ? 'Файл справки' : 'Справка файлы'} <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  onChange={(e) => updateIncomeCertificate(certificate.id, 'file', e.target.files?.[0] || null)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            
                            {certificate.fileName && (
                              <div className={`p-3 rounded-lg border ${certificate.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <i className={`ri-${certificate.isValid ? 'check-line' : 'error-warning-line'} text-lg ${certificate.isValid ? 'text-green-600' : 'text-red-600'} mr-2`}></i>
                                    <span className="font-medium text-gray-800">{certificate.fileName}</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                      ({(certificate.fileSize / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                  </div>
                                </div>
                                {certificate.error && (
                                  <p className="text-red-600 text-sm mt-1">{certificate.error}</p>
                                )}
                                  </div>
                                )}
                          </div>
                        ))}
                        
                        <button
                          onClick={addIncomeCertificate}
                          className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 inline-flex items-center justify-center"
                        >
                          <i className="ri-add-line mr-2"></i>
                          {language === 'ru' ? 'Добавить справку о доходах' : 'Киреше справкасын кошуу'}
                  </button>
                      </div>
              </div>
                
                    {/* Справка от органа пробации */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'ru' ? 'Справка от органа пробации (при наличии)' : 'Пробация органдан справка (бар болсо)'}
                        {documents.probationCertificate.isRequired && <span className="text-red-500 ml-1">*</span>}
                    </h4>

                          <div className="space-y-3">
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => updateProbationCertificate(e.target.files?.[0] || null)}
                            className="hidden"
                            id="probation-certificate"
                          />
                          <label
                            htmlFor="probation-certificate"
                            className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 cursor-pointer inline-flex items-center justify-center"
                          >
                            <i className="ri-upload-line mr-2"></i>
                            {language === 'ru' ? 'Выбрать файл' : 'Файл тандаңыз'}
                          </label>
                        </div>
                        
                        {documents.probationCertificate.fileName && (
                          <div className={`p-3 rounded-lg border ${documents.probationCertificate.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <i className={`ri-${documents.probationCertificate.isValid ? 'check-line' : 'error-warning-line'} text-lg ${documents.probationCertificate.isValid ? 'text-green-600' : 'text-red-600'} mr-2`}></i>
                                <span className="font-medium text-gray-800">{documents.probationCertificate.fileName}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                  ({(documents.probationCertificate.fileSize / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                </div>
                              <button
                                onClick={() => updateProbationCertificate(null)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                              </div>
                            {documents.probationCertificate.error && (
                              <p className="text-red-600 text-sm mt-1">{documents.probationCertificate.error}</p>
                            )}
                          </div>
                        )}
                        
                        <p className="text-sm text-gray-600">
                          {language === 'ru' 
                            ? 'Документ требуется только при наличии судимости или нахождения под надзором'
                            : 'Документ гана соттолуу же көзөмөлдө болгондо талап кылынат'
                          }
                        </p>
                      </div>
                    </div>

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
                            {language === 'ru' ? 'Паспорт заявителя:' : 'Арыз берүүчүнүн паспорту:'}
                              </span>
                          <span className={`font-medium ${documents.applicantPassport.isValid ? 'text-green-600' : 'text-red-600'}`}>
                            {documents.applicantPassport.isValid ? (language === 'ru' ? 'Загружен' : 'Жүктөлдү') : (language === 'ru' ? 'Не загружен' : 'Жүктөлбөдү')}
                          </span>
                            </div>
                        
                        <div className="flex justify-between items-center">
                              <span className="text-gray-700">
                            {language === 'ru' ? 'Справка о составе семьи:' : 'Үй-бүлө курамы тууралуу справка:'}
                              </span>
                          <span className={`font-medium ${documents.familyCompositionCertificate.isValid ? 'text-green-600' : 'text-red-600'}`}>
                            {documents.familyCompositionCertificate.isValid ? (language === 'ru' ? 'Загружена' : 'Жүктөлдү') : (language === 'ru' ? 'Не загружена' : 'Жүктөлбөдү')}
                          </span>
                            </div>
                        
                        <div className="flex justify-between items-center">
                                <span className="text-gray-700">
                            {language === 'ru' ? 'Свидетельства о рождении детей:' : 'Балалардын туулгандыгы тууралуу күбөлүктөр:'}
                                </span>
                          <span className={`font-medium ${documents.childrenBirthCertificates.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {documents.childrenBirthCertificates.length > 0 
                              ? `${documents.childrenBirthCertificates.length} ${language === 'ru' ? 'загружено' : 'жүктөлдү'}`
                              : (language === 'ru' ? 'Не загружены' : 'Жүктөлбөдү')
                            }
                          </span>
                              </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">
                            {language === 'ru' ? 'Справки о доходах:' : 'Киреше тууралуу справкалар:'}
                            </span>
                          <span className={`font-medium ${documents.incomeCertificates.length > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {documents.incomeCertificates.length > 0 
                              ? `${documents.incomeCertificates.length} ${language === 'ru' ? 'загружено' : 'жүктөлдү'}`
                              : (language === 'ru' ? 'Не загружены' : 'Жүктөлбөдү')
                            }
                            </span>
                          </div>
                      </div>
                    </div>
                        </div>
                      </div>

                {/* Раздел 5.1: Специальные компенсации */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '5.1. Специальные компенсации' : '5.1. Атайын компенсациялар'}
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
                            onClick={() => removeSpecialCompensation(compensation.id)}
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
                              onChange={(e) => updateSpecialCompensation(compensation.id, 'reason', e.target.value)}
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
                              onChange={(e) => updateSpecialCompensation(compensation.id, 'type', e.target.value)}
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
                              onChange={(e) => updateSpecialCompensation(compensation.id, 'amount', parseFloat(e.target.value) || 0)}
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
                              onChange={(e) => updateSpecialCompensation(compensation.id, 'periodFrom', e.target.value)}
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
                              onChange={(e) => updateSpecialCompensation(compensation.id, 'periodTo', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addSpecialCompensation}
                      className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                    >
                      {language === 'ru' ? '+ Добавить компенсацию' : '+ Компенсация кошуу'}
                    </button>
                  </div>
                </div>

                {/* Раздел 5.2: Возвраты */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '5.2. Возвраты и передоформления' : '5.2. Кайтарымдар жана кайра расмийлөө'}
                  </h3>
                  
                  <div className="space-y-4">
                    {tuData.refunds.map((refund, index) => (
                      <div key={refund.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-800">
                            {language === 'ru' ? `Возврат ${index + 1}` : `Кайтарым ${index + 1}`}
                          </h4>
                          <button
                            type="button"
                            onClick={() => setTuData(prev => ({
                              ...prev,
                              refunds: prev.refunds.filter(item => item.id !== refund.id)
                            }))}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            {language === 'ru' ? 'Удалить' : 'Өчүрүү'}
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Причина возврата' : 'Кайтарым себеби'} <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={refund.reason}
                              onChange={(e) => setTuData(prev => ({
                                ...prev,
                                refunds: prev.refunds.map(item => 
                                  item.id === refund.id ? { ...item, reason: e.target.value } : item
                                )
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">{language === 'ru' ? 'Выберите причину' : 'Себебин тандаңыз'}</option>
                              {refusalReasons.map(reason => (
                                <option key={reason.id} value={reason.id}>{reason.name}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Дата возврата' : 'Кайтарым күнү'} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={refund.returnDate}
                              onChange={(e) => setTuData(prev => ({
                                ...prev,
                                refunds: prev.refunds.map(item => 
                                  item.id === refund.id ? { ...item, returnDate: e.target.value } : item
                                )
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'ru' ? 'Сумма возврата' : 'Кайтарым суммасы'} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={refund.amount}
                              onChange={(e) => setTuData(prev => ({
                                ...prev,
                                refunds: prev.refunds.map(item => 
                                  item.id === refund.id ? { ...item, amount: parseFloat(e.target.value) || 0 } : item
                                )
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder={language === 'ru' ? 'Введите сумму' : 'Сумманы киргизиңиз'}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setTuData(prev => ({
                          ...prev,
                          refunds: [...prev.refunds, {
                            id: Date.now(),
                            reason: '',
                            returnDate: '',
                            amount: 0
                          }]
                        }))}
                        className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                      >
                        {language === 'ru' ? '+ Добавить возврат' : '+ Кайтарым кошуу'}
                      </button>
                      
                      <button
                        type="button"
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        {language === 'ru' ? 'Передоформить на другое лицо' : 'Башка адамга кайра расмийлөө'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Раздел 6: Расчёт (завершение) */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? '6. Расчёт (завершение)' : '6. Эсептөө (аяктоо)'}
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
                  <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    {language === 'ru' ? 'Отмена' : 'Жокко чыгаруу'}
                  </button>
                <button
                  onClick={submitApplication}
                    disabled={!isReadyToSubmit()}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      isReadyToSubmit() 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {language === 'ru' ? 'Сохранить и продолжить' : 'Сактоо жана улантуу'}
                </button>
              </div>
            </div>
          </div>
          </div>
        )}
        </div>
    </div>
  );
}