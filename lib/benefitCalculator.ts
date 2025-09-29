
import { regions, GMD_THRESHOLD, BASE_BENEFIT_PER_CHILD, externalIntegrations } from './mockData';
import { BankDeposit, StudentEducationDetails, Entrepreneurship } from './types';

export interface FamilyMember {
  name: string;
  age: number;
  relation: string;
  income: number;
  // Поля для студентов
  isStudent?: boolean;
  educationData?: {
    scholarshipAmount?: number;
    tuitionFeeYearly?: number;
    tuitionFeeMonthly?: number;
    fundingSource: 'government' | 'parents' | 'grant' | 'other';
    isFullTime: boolean;
  };
}

// Новые интерфейсы для учета ЛПХ
export interface LandPlot {
  type: 'irrigated' | 'rain_fed' | 'household'; // орошаемый, богарный, приусадебный
  area: number; // площадь в сотках
}

export interface Livestock {
  cows: number;
  heifers: number;  // телки
  bulls: number;    // быки
  horses: number;
  sheep: number;
  goats: number;
  pigs: number;
  poultry: number;
  other: number;
}

export interface HouseholdAssets {
  hasCar: boolean;
  hasTractor: boolean;
  hasTruck: boolean;
  carAge?: number; // возраст автомобиля в годах
}

export interface BenefitCalculation {
  eligible: boolean;
  perCapitaIncome: number;
  childrenUnder16: number;
  baseBenefit: number;
  regionalCoefficient: number;
  borderBonus: number;
  totalMonthlyBenefit: number;
  reason?: string;
  // Новые поля для детализации расчета
  landIncome: number;
  livestockIncome: number;
  totalHouseholdIncome: number;
  livestockMRSEquivalent: number;
  livestockPerPerson: number;
  assetsCheck: boolean;
  // Поля для студентов
  studentIncome: number;
  studentExpenses: number;
  eligibleStudents: number;
  totalFamilyMembers: number; // общее количество членов семьи с учетом студентов
  // Поля для банковских вкладов (Раздел VII)
  bankDepositIncome: number;
  totalBankDeposits: number;
  // Поля для предпринимательства (Раздел IV)
  entrepreneurshipIncome: number;
  declaredBusinessIncome: number;
  normativeBusinessIncome: number;
}

export interface ExternalCheckResult {
  system: string;
  status: 'success' | 'warning' | 'error';
  data: any;
  message: string;
}

// Нормативы доходности земли (сом/сотка/месяц) - обновлены согласно официальным данным
const LAND_INCOME_NORMS = {
  irrigated: 20,    // орошаемый земельный надел
  rain_fed: 10,     // богарный надел
  household: 30     // приусадебный участок
};

// Коэффициенты перевода скота в условные единицы (МРС) - обновлены согласно официальным данным
const LIVESTOCK_MRS_COEFFICIENTS = {
  cows: 6,      // 1 корова = 6 МРС
  heifers: 2.5, // 1 телка = 2.5 МРС
  bulls: 8,     // 1 бык = 8 МРС
  horses: 7,    // 1 лошадь = 7 МРС
  sheep: 1,     // 1 овца = 1 МРС
  goats: 1,     // 1 коза = 1 МРС
  pigs: 2,      // 1 свинья = 2 МРС
  poultry: 0.1, // 1 птица = 0.1 МРС
  other: 1      // прочие животные = 1 МРС
};

// Нормативный доход на 1 МРС в месяц (сом)
const MRS_MONTHLY_INCOME = 500;

// Максимальное количество МРС на человека для получения пособия
const MAX_MRS_PER_PERSON = 4;

// Возраст автомобиля, при котором он не учитывается как актив
const MAX_CAR_AGE = 20;

// Гарантированный минимальный доход (ГМД) - устанавливается ежегодно Кабмином
export const GMD_THRESHOLD = 6000; // сом на человека в месяц

// Доходы, не учитываемые в расчете пособия
export const EXCLUDED_INCOMES = [
  'benefits',           // пособия
  'funeral_allowance',  // пособие на погребение
  'material_aid',       // матпомощь
  'scholarships',       // стипендии
  'travel_expenses',    // командировочные
  'social_contract',    // соцконтракт (3 мес.)
  'personal_assistant', // выплаты персональному ассистенту
  'other_excluded'      // прочие исключения
];

// Пособия и выплаты, которые учитываются (могут быть препятствием)
export const INCLUDED_BENEFITS = [
  'monthly_compensations', // ежемесячные денежные компенсации взамен льгот
  'pensions',              // пенсии (кроме льготных инвалидных ниже базовой части)
  'other_regular_payments' // другие регулярные выплаты, не входящие в перечень исключений
];

// Члены семьи, которые НЕ учитываются в составе семьи
export const EXCLUDED_FAMILY_MEMBERS = [
  'conscripts',           // военнослужащие срочной службы
  'convicts',             // осужденные
  'state_support',        // на полном гособеспечении
  'deprived_rights',      // лишённые родительских прав
  'outsiders'             // посторонние
];

// Расчет дохода от земельных участков
function calculateLandIncome(landPlots: LandPlot[]): number {
  return landPlots.reduce((total, plot) => {
    const norm = LAND_INCOME_NORMS[plot.type];
    return total + (norm * plot.area);
  }, 0);
}

// Расчет дохода от животноводства
function calculateLivestockIncome(livestock: Livestock): number {
  const totalMRS = Object.entries(livestock).reduce((total, [type, count]) => {
    const coefficient = LIVESTOCK_MRS_COEFFICIENTS[type as keyof typeof LIVESTOCK_MRS_COEFFICIENTS];
    return total + (count * coefficient);
  }, 0);
  
  return totalMRS * MRS_MONTHLY_INCOME;
}

// Расчет дохода от банковских вкладов (Раздел VII)
function calculateBankDepositIncome(bankDeposits: BankDeposit[]): { income: number; totalDeposits: number } {
  let totalIncome = 0;
  let totalDeposits = 0;
  
  bankDeposits.forEach(deposit => {
    if (deposit.isActive) {
      totalDeposits += deposit.depositAmount;
      // Рассчитываем ежемесячные проценты
      const monthlyRate = deposit.interestRate / 100 / 12;
      const monthlyInterest = deposit.depositAmount * monthlyRate;
      totalIncome += monthlyInterest;
    }
  });
  
  return { income: totalIncome, totalDeposits };
}

// Расчет дохода от предпринимательства (Раздел IV)
function calculateEntrepreneurshipIncome(entrepreneurship: Entrepreneurship[]): { 
  income: number; 
  declaredIncome: number; 
  normativeIncome: number 
} {
  let totalIncome = 0;
  let totalDeclaredIncome = 0;
  let totalNormativeIncome = 0;
  
  entrepreneurship.forEach(business => {
    if (business.isActive) {
      // Используем задекларированный доход, если есть, иначе нормативный
      const businessIncome = business.declaredIncome > 0 ? business.declaredIncome : business.normativeIncome;
      totalIncome += businessIncome;
      totalDeclaredIncome += business.declaredIncome;
      totalNormativeIncome += business.normativeIncome;
    }
  });
  
  return { 
    income: totalIncome, 
    declaredIncome: totalDeclaredIncome, 
    normativeIncome: totalNormativeIncome 
  };
}

// Расчет общего количества МРС
function calculateTotalMRS(livestock: Livestock): number {
  return Object.entries(livestock).reduce((total, [type, count]) => {
    const coefficient = LIVESTOCK_MRS_COEFFICIENTS[type as keyof typeof LIVESTOCK_MRS_COEFFICIENTS];
    return total + (count * coefficient);
  }, 0);
}

// Проверка активов семьи
function checkHouseholdAssets(assets: HouseholdAssets): boolean {
  // Если есть автомобиль моложе 20 лет - не имеет права на пособие
  if (assets.hasCar && (!assets.carAge || assets.carAge < MAX_CAR_AGE)) {
    return false;
  }
  
  // Если есть сельхозтехника или грузовой транспорт - не имеет права
  if (assets.hasTractor || assets.hasTruck) {
    return false;
  }
  
  return true;
}

// Enhanced benefit calculation engine with regional coefficients and household farming
// Функция для расчета доходов студентов
function calculateStudentIncome(familyMembers: FamilyMember[]): {
  studentIncome: number;
  studentExpenses: number;
  eligibleStudents: number;
} {
  let studentIncome = 0;
  let studentExpenses = 0;
  let eligibleStudents = 0;

  familyMembers.forEach(member => {
    if (member.isStudent && member.educationData) {
      const { educationData } = member;
      
      // Проверяем возраст: студенты до 21 года включаются в состав семьи
      if (member.age <= 21 && educationData.isFullTime) {
        eligibleStudents++;
        
        // Стипендия считается доходом семьи
        if (educationData.scholarshipAmount) {
          studentIncome += educationData.scholarshipAmount;
        }
        
        // Грант или государственное финансирование тоже считается доходом
        if (educationData.fundingSource === 'government' || educationData.fundingSource === 'grant') {
          // Здесь можно добавить логику для расчета дохода от гранта
          // Пока что считаем только стипендию
        }
      }
      
      // Расходы на обучение фиксируются для аналитики, но не уменьшают доход
      if (educationData.tuitionFeeMonthly) {
        studentExpenses += educationData.tuitionFeeMonthly;
      }
    }
  });

  return { studentIncome, studentExpenses, eligibleStudents };
}

export function calculateBenefit(
  familyMembers: FamilyMember[],
  regionId: string,
  totalIncome: number,
  landPlots: LandPlot[] = [],
  livestock: Livestock = { cows: 0, heifers: 0, bulls: 0, horses: 0, sheep: 0, goats: 0, pigs: 0, poultry: 0, other: 0 },
  assets: HouseholdAssets = { hasCar: false, hasTractor: false, hasTruck: false },
  bankDeposits: BankDeposit[] = [],
  entrepreneurship: Entrepreneurship[] = []
): BenefitCalculation {
  const region = regions.find(r => r.id === regionId);
  if (!region) {
    throw new Error('Invalid region');
  }

  // Рассчитываем доходы студентов
  const { studentIncome, studentExpenses, eligibleStudents } = calculateStudentIncome(familyMembers);
  
  // Фильтруем членов семьи с учетом студентов
  const eligibleFamilyMembers = familyMembers.filter(member => {
    if (member.isStudent && member.educationData) {
      // Студенты до 21 года с очным обучением включаются в состав семьи
      return member.age <= 21 && member.educationData.isFullTime;
    }
    // Остальные члены семьи включаются по обычным правилам
    return true;
  });

  const childrenUnder16 = eligibleFamilyMembers.filter(member => member.age < 16).length;
  
  if (childrenUnder16 === 0) {
    return {
      eligible: false,
      perCapitaIncome: 0,
      childrenUnder16: 0,
      baseBenefit: 0,
      regionalCoefficient: region.coefficient,
      borderBonus: 0,
      totalMonthlyBenefit: 0,
      landIncome: 0,
      livestockIncome: 0,
      totalHouseholdIncome: 0,
      livestockMRSEquivalent: 0,
      livestockPerPerson: 0,
      assetsCheck: false,
      studentIncome,
      studentExpenses,
      eligibleStudents,
      totalFamilyMembers: eligibleFamilyMembers.length,
      bankDepositIncome: 0,
      totalBankDeposits: 0,
      entrepreneurshipIncome: 0,
      declaredBusinessIncome: 0,
      normativeBusinessIncome: 0,
      reason: 'No children under 16 years old'
    };
  }

  // Проверка активов семьи
  const assetsCheck = checkHouseholdAssets(assets);
  if (!assetsCheck) {
    return {
      eligible: false,
      perCapitaIncome: 0,
      childrenUnder16,
      baseBenefit: 0,
      regionalCoefficient: region.coefficient,
      borderBonus: 0,
      totalMonthlyBenefit: 0,
      landIncome: 0,
      livestockIncome: 0,
      totalHouseholdIncome: 0,
      livestockMRSEquivalent: 0,
      livestockPerPerson: 0,
      assetsCheck: false,
      studentIncome,
      studentExpenses,
      eligibleStudents,
      totalFamilyMembers: eligibleFamilyMembers.length,
      bankDepositIncome: 0,
      totalBankDeposits: 0,
      entrepreneurshipIncome: 0,
      declaredBusinessIncome: 0,
      normativeBusinessIncome: 0,
      reason: 'Family has significant assets (car, tractor, truck) that exclude them from benefits'
    };
  }

  // Расчет доходов от ЛПХ
  const landIncome = calculateLandIncome(landPlots);
  const livestockIncome = calculateLivestockIncome(livestock);
  
  // Расчет доходов от банковских вкладов (Раздел VII)
  const { income: bankDepositIncome, totalDeposits } = calculateBankDepositIncome(bankDeposits);
  
  // Расчет доходов от предпринимательства (Раздел IV)
  const { income: entrepreneurshipIncome, declaredIncome, normativeIncome } = calculateEntrepreneurshipIncome(entrepreneurship);
  
  const totalHouseholdIncome = landIncome + livestockIncome + bankDepositIncome + entrepreneurshipIncome;
  
  // Расчет МРС на человека
  const totalMRS = calculateTotalMRS(livestock);
  const livestockPerPerson = familyMembers.length > 0 ? totalMRS / familyMembers.length : 0;
  
  // Проверка лимита по скоту (не более 4 МРС на человека)
  if (livestockPerPerson > MAX_MRS_PER_PERSON) {
    return {
      eligible: false,
      perCapitaIncome: 0,
      childrenUnder16,
      baseBenefit: 0,
      regionalCoefficient: region.coefficient,
      borderBonus: 0,
      totalMonthlyBenefit: 0,
      landIncome,
      livestockIncome,
      totalHouseholdIncome,
      livestockMRSEquivalent: totalMRS,
      livestockPerPerson,
      assetsCheck: true,
      studentIncome,
      studentExpenses,
      eligibleStudents,
      totalFamilyMembers: eligibleFamilyMembers.length,
      bankDepositIncome: Math.round(bankDepositIncome),
      totalBankDeposits: Math.round(totalDeposits),
      entrepreneurshipIncome: Math.round(entrepreneurshipIncome),
      declaredBusinessIncome: Math.round(declaredIncome),
      normativeBusinessIncome: Math.round(normativeIncome),
      reason: `Livestock per person (${livestockPerPerson.toFixed(1)} MRS) exceeds maximum limit (${MAX_MRS_PER_PERSON} MRS)`
    };
  }

  // Общий доход семьи с учетом ЛПХ и доходов студентов
  const totalFamilyIncome = totalIncome + totalHouseholdIncome + studentIncome;
  const perCapitaIncome = eligibleFamilyMembers.length > 0 ? totalFamilyIncome / eligibleFamilyMembers.length : 0;
  
  // Check eligibility - per capita income must be below GMD threshold
  const eligible = perCapitaIncome < GMD_THRESHOLD;
  
  if (!eligible) {
    return {
      eligible: false,
      perCapitaIncome: Math.round(perCapitaIncome),
      childrenUnder16,
      baseBenefit: 0,
      regionalCoefficient: region.coefficient,
      borderBonus: 0,
      totalMonthlyBenefit: 0,
      landIncome,
      livestockIncome,
      totalHouseholdIncome,
      livestockMRSEquivalent: totalMRS,
      livestockPerPerson,
      assetsCheck: true,
      studentIncome,
      studentExpenses,
      eligibleStudents,
      totalFamilyMembers: eligibleFamilyMembers.length,
      bankDepositIncome: Math.round(bankDepositIncome),
      totalBankDeposits: Math.round(totalDeposits),
      entrepreneurshipIncome: Math.round(entrepreneurshipIncome),
      declaredBusinessIncome: Math.round(declaredIncome),
      normativeBusinessIncome: Math.round(normativeIncome),
      reason: `Per capita income (${Math.round(perCapitaIncome)} сом) exceeds GMD threshold (${GMD_THRESHOLD} сом)`
    };
  }

  // Base Amount: 1,200 soms per child under 16
  const baseBenefit = BASE_BENEFIT_PER_CHILD * childrenUnder16;
  
  // Apply regional coefficients
  let regionallyAdjustedBenefit = baseBenefit * region.coefficient;
  
  // Border regions with special status: Regional coefficient × 1.20 + 1,000 soms compensation
  let borderBonus = 0;
  if (region.type === 'border') {
    // Additional 20% boost for border regions
    regionallyAdjustedBenefit = baseBenefit * region.coefficient * 1.20;
    // Plus 1,000 soms compensation per child
    borderBonus = (region.borderBonus || 1000) * childrenUnder16;
  }
  
  const totalMonthlyBenefit = regionallyAdjustedBenefit + borderBonus;

  return {
    eligible: true,
    perCapitaIncome: Math.round(perCapitaIncome),
    childrenUnder16,
    baseBenefit,
    regionalCoefficient: region.coefficient,
    borderBonus,
    totalMonthlyBenefit: Math.round(totalMonthlyBenefit),
    landIncome: Math.round(landIncome),
    livestockIncome: Math.round(livestockIncome),
    totalHouseholdIncome: Math.round(totalHouseholdIncome),
    livestockMRSEquivalent: totalMRS,
    livestockPerPerson,
    assetsCheck: true,
    studentIncome,
    studentExpenses,
    eligibleStudents,
    totalFamilyMembers: eligibleFamilyMembers.length,
    // Новые поля для банковских вкладов и предпринимательства
    bankDepositIncome: Math.round(bankDepositIncome),
    totalBankDeposits: Math.round(totalDeposits),
    entrepreneurshipIncome: Math.round(entrepreneurshipIncome),
    declaredBusinessIncome: Math.round(declaredIncome),
    normativeBusinessIncome: Math.round(normativeIncome)
  };
}

// Simulate external system integrations
export async function simulateExternalCheck(systemId: string, citizenData: any): Promise<ExternalCheckResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  
  const integration = externalIntegrations.find(i => i.id === systemId);
  if (!integration) {
    return {
      system: systemId,
      status: 'error',
      data: null,
      message: 'System not found'
    };
  }

  // Simulate different responses based on system
  switch (systemId) {
    case 'tunduk':
      return {
        system: 'Tunduk',
        status: 'success',
        data: {
          identity_verified: true,
          personal_id: citizenData.personalId,
          full_name: citizenData.fullName,
          birth_date: '1992-05-15',
          citizenship: 'Кыргызстан'
        },
        message: 'Identity successfully verified'
      };

    case 'employment_center':
      return {
        system: 'Employment Center',
        status: 'success',
        data: {
          unemployment_status: 'registered',
          registration_date: '2025-01-01',
          benefits_received: false
        },
        message: 'Employment status confirmed'
      };

    case 'medical_commission':
      return {
        system: 'Medical Commission',
        status: 'success',
        data: {
          disability_status: 'none',
          last_examination: null,
          benefits_received: false
        },
        message: 'No disability status found'
      };

    case 'sanaryp_aymak':
      return {
        system: 'Sanaryp Aymak',
        status: 'success',
        data: {
          comprehensive_data: true,
          family_composition_verified: true,
          address_confirmed: true,
          last_update: '2025-01-15'
        },
        message: 'Comprehensive citizen data verified'
      };

    case 'tax_service':
      return {
        system: 'Tax Service',
        status: 'success',
        data: {
          declared_income: 24000,
          tax_compliance: true,
          business_registration: false,
          last_declaration: '2024-12-31'
        },
        message: 'Tax information verified'
      };

    case 'cadastre':
      return {
        system: 'Cadastre',
        status: 'success',
        data: {
          property_ownership: true,
          properties: [
            {
              type: 'apartment',
              address: 'г. Бишкек, ул. Манаса 45, кв. 12',
              area: '65 sq.m',
              value: 2500000
            }
          ],
          land_ownership: false
        },
        message: 'Property information verified'
      };

    case 'banks':
      return {
        system: 'Banking System',
        status: 'success',
        data: {
          accounts_count: 2,
          total_deposits: 45000,
          active_loans: false,
          credit_history: 'good',
          last_transaction: '2025-01-20'
        },
        message: 'Banking information verified'
      };

    case 'probation':
      return {
        system: 'Probation Department',
        status: 'success',
        data: {
          criminal_record: 'clean',
          probation_status: 'none',
          restrictions: false,
          last_check: '2025-01-15'
        },
        message: 'No criminal restrictions found'
      };

    default:
      return {
        system: systemId,
        status: 'warning',
        data: null,
        message: 'System check not implemented'
      };
  }
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()} сом`;
}

export function getRegionTypeDescription(regionType: string, language: string = 'ru'): string {
  const descriptions = {
    ru: {
      urban: 'Городская местность (коэффициент 1.0)',
      rural: 'Сельская местность (коэффициент 1.0)', 
      mountainous: 'Горная местность (коэффициент +15%)',
      border: 'Приграничная зона (коэффициент +20% × 1.20 + 1000 сом)'
    },
    ky: {
      urban: 'Шаар жери (коэффициент 1.0)',
      rural: 'Айыл жери (коэффициент 1.0)',
      mountainous: 'Тоолуу жер (коэффициент +15%)',
      border: 'Чек ара аймак (коэффициент +20% × 1.20 + 1000 сом)'
    }
  };
  
  return descriptions[language as keyof typeof descriptions]?.[regionType as keyof typeof descriptions.ru] || regionType;
}

// Validate family composition for eligibility
export function validateFamilyComposition(familyMembers: FamilyMember[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (familyMembers.length === 0) {
    errors.push('Family must have at least one member');
  }
  
  const childrenUnder16 = familyMembers.filter(m => m.age < 16).length;
  if (childrenUnder16 === 0) {
    errors.push('Family must have at least one child under 16 years old');
  }
  
  const invalidMembers = familyMembers.filter(m => !m.name || m.age < 0 || !m.relation);
  if (invalidMembers.length > 0) {
    errors.push('All family members must have name, age, and relation specified');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Расчет среднедушевого дохода за 3 месяца (согласно официальным правилам)
export function calculatePerCapitaIncome(
  familyMembers: FamilyMember[], 
  monthlyIncomes: Record<string, number>[], 
  landPlots: LandPlot[] = [],
  livestock: Livestock = { cows: 0, heifers: 0, bulls: 0, horses: 0, sheep: 0, goats: 0, pigs: 0, poultry: 0, other: 0 }
): number {
  // Суммируем доходы за 3 месяца
  const totalIncome3Months = monthlyIncomes.reduce((total, monthIncomes) => {
    return total + Object.values(monthIncomes).reduce((sum, income) => sum + income, 0);
  }, 0);
  
  // Добавляем доходы от ЛПХ (они постоянные)
  const landIncome = calculateLandIncome(landPlots);
  const livestockIncome = calculateLivestockIncome(livestock);
  const totalHouseholdIncome3Months = (landIncome + livestockIncome) * 3;
  
  // Общий доход за 3 месяца
  const totalFamilyIncome3Months = totalIncome3Months + totalHouseholdIncome3Months;
  
  // Среднедушевой доход = доход семьи за 3 мес. ÷ 3 ÷ число членов семьи
  const perCapitaIncome = familyMembers.length > 0 
    ? (totalFamilyIncome3Months / 3) / familyMembers.length 
    : 0;
    
  return Math.round(perCapitaIncome);
}

// Calculate income breakdown by categories
export function calculateIncomeBreakdown(incomes: Record<string, number>) {
  const categories = {
    primary: 0,        // I. Основные доходы
    property: 0,       // II. Доходы от собственности
    agriculture: 0,    // III. Доходы от сельского хозяйства
    business: 0,       // IV. Предпринимательская деятельность
    employment: 0,     // V. Трудоустройство
    foreign: 0,        // VI. Внешние доходы
    compensation: 0,   // VII. Компенсации
    land: 0,           // VIII. Земельные доходы
    social: 0,         // IX. Социальные выплаты
    financial: 0       // X. Финансовые инструменты
  };
  
  // Map income types to categories
  const categoryMap = {
    // Основные доходы
    salary: 'primary', 
    pension: 'primary', 
    scholarship: 'primary',
    unemployment_benefit: 'primary',
    alimony: 'primary',
    
    // Доходы от собственности
    property_rental: 'property',
    tenant_payment: 'property',
    car_rental: 'property',
    
    // Доходы от сельского хозяйства
    tenant_coop_income: 'agriculture',
    farm_work_payment: 'agriculture',
    individual_labor: 'agriculture',
    
    // Предпринимательская деятельность
    business_income: 'business',
    
    // Трудоустройство
    part_time_work: 'employment',
    
    // Внешние доходы
    foreign_income: 'foreign',
    
    // Компенсации
    compensation: 'compensation',
    monetary_compensation: 'compensation',
    
    // Земельные доходы
    land_rental: 'land',
    household_plot: 'land',
    farm_income: 'land',
    
    // Социальные выплаты
    family_help: 'social',
    social_benefit: 'social',
    
    // Финансовые инструменты
    dividends: 'financial'
  };
  
  Object.entries(incomes).forEach(([key, value]) => {
    const category = categoryMap[key as keyof typeof categoryMap];
    if (category && value > 0) {
      categories[category as keyof typeof categories] += value;
    }
  });
  
  const total = Object.values(categories).reduce((sum, value) => sum + value, 0);
  
  return {
    categories,
    total,
    breakdown: Object.entries(categories)
      .filter(([, value]) => value > 0)
      .map(([category, value]) => ({
        category,
        amount: value,
        percentage: total > 0 ? Math.round((value / total) * 100) : 0
      }))
  };
}
