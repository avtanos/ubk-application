// Авторасчеты согласно ТУ
export interface HouseholdMetrics {
  totalIncomeMonth: number;
  perCapitaIncome: number;
  convUnitsTotal: number;
  criteriaFlags: {
    incomeEligible: boolean;
    propertyEligible: boolean;
    familyEligible: boolean;
    vehicleEligible: boolean;
  };
  guaranteedMinimumIncome: number;
}

export interface LivestockItem {
  type: string;
  count: number;
}

export interface VehicleItem {
  type: string;
  year: number;
  isLightCar: boolean;
}

export interface IncomeItem {
  amount: number;
  periodicity: 'M' | 'Y'; // месячный/годовый
}

// Нормативы МРС (мелкий рогатый скот) для расчета условных единиц
const LIVESTOCK_COEFFICIENTS: Record<string, number> = {
  'SHEEP': 1.0,
  'GOAT': 1.0,
  'COW': 5.0,
  'HORSE': 5.0,
  'PIG': 2.0,
  'CHICKEN': 0.1,
  'DUCK': 0.1,
  'GOOSE': 0.2,
  'TURKEY': 0.3,
  'RABBIT': 0.05
};

// Гарантированный минимальный доход (ГМД) - примерное значение
const GUARANTEED_MINIMUM_INCOME = 15000; // сом в месяц

// Расчет условных единиц скота
export const calculateConventionalUnits = (livestock: LivestockItem[]): number => {
  return livestock.reduce((total, item) => {
    const coefficient = LIVESTOCK_COEFFICIENTS[item.type] || 1.0;
    return total + (item.count * coefficient);
  }, 0);
};

// Проверка лимита скота (≤ 4 МРС/член семьи)
export const checkLivestockLimit = (convUnits: number, familySize: number): boolean => {
  const maxUnits = familySize * 4;
  return convUnits <= maxUnits;
};

// Проверка возраста автомобиля (легковой < 20 лет → отказ)
export const checkVehicleAge = (vehicles: VehicleItem[]): boolean => {
  const currentYear = new Date().getFullYear();
  return !vehicles.some(vehicle => 
    vehicle.isLightCar && (currentYear - vehicle.year) < 20
  );
};

// Расчет общего дохода семьи в месяц
export const calculateTotalIncomeMonth = (incomes: IncomeItem[]): number => {
  return incomes.reduce((total, income) => {
    if (income.periodicity === 'M') {
      return total + income.amount;
    } else if (income.periodicity === 'Y') {
      return total + (income.amount / 12);
    }
    return total;
  }, 0);
};

// Расчет среднедушевого дохода (ССДС)
export const calculatePerCapitaIncome = (totalIncomeMonth: number, familySize: number): number => {
  if (familySize === 0) return 0;
  return totalIncomeMonth / familySize;
};

// Проверка соответствия критериям дохода
export const checkIncomeEligibility = (perCapitaIncome: number): boolean => {
  return perCapitaIncome <= GUARANTEED_MINIMUM_INCOME;
};

// Расчет пособия по формуле: total = base × children × region_coeff × add_coeff + border_bonus
export const calculateBenefitAmount = (
  baseAmount: number,
  childrenCount: number,
  regionCoeff: number,
  addCoeff: number,
  borderBonus: number
): number => {
  // Ограничение: region_coeff × add_coeff ≤ 1.8
  const totalCoeff = Math.min(regionCoeff * addCoeff, 1.8);
  return (baseAmount * childrenCount * totalCoeff) + borderBonus;
};

// Основная функция расчета показателей домохозяйства
export const calculateHouseholdMetrics = (
  incomes: IncomeItem[],
  livestock: LivestockItem[],
  vehicles: VehicleItem[],
  familySize: number
): HouseholdMetrics => {
  // Расчет доходов
  const totalIncomeMonth = calculateTotalIncomeMonth(incomes);
  const perCapitaIncome = calculatePerCapitaIncome(totalIncomeMonth, familySize);
  
  // Расчет скота
  const convUnitsTotal = calculateConventionalUnits(livestock);
  const livestockEligible = checkLivestockLimit(convUnitsTotal, familySize);
  
  // Проверка транспорта
  const vehicleEligible = checkVehicleAge(vehicles);
  
  // Проверка дохода
  const incomeEligible = checkIncomeEligibility(perCapitaIncome);
  
  // Общая проверка семьи (базовая логика)
  const familyEligible = familySize > 0;
  
  return {
    totalIncomeMonth,
    perCapitaIncome,
    convUnitsTotal,
    criteriaFlags: {
      incomeEligible,
      propertyEligible: livestockEligible,
      familyEligible,
      vehicleEligible
    },
    guaranteedMinimumIncome: GUARANTEED_MINIMUM_INCOME
  };
};

// Проверка готовности к назначению пособия
export const checkBenefitEligibility = (metrics: HouseholdMetrics): boolean => {
  return Object.values(metrics.criteriaFlags).every(flag => flag);
};

// Форматирование валюты
export const formatCurrency = (amount: number, currency: string = 'сом'): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KGS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount).replace('KGS', currency);
};

// Получение статуса заявления на основе метрик
export const getApplicationStatus = (metrics: HouseholdMetrics): {
  status: 'ELIGIBLE' | 'INELIGIBLE' | 'PENDING';
  message: string;
} => {
  if (checkBenefitEligibility(metrics)) {
    return {
      status: 'ELIGIBLE',
      message: 'Заявление соответствует критериям для назначения пособия'
    };
  }
  
  const issues = [];
  if (!metrics.criteriaFlags.incomeEligible) {
    issues.push('Превышен лимит дохода на душу населения');
  }
  if (!metrics.criteriaFlags.propertyEligible) {
    issues.push('Превышен лимит условных единиц скота');
  }
  if (!metrics.criteriaFlags.vehicleEligible) {
    issues.push('Имеется легковой автомобиль моложе 20 лет');
  }
  if (!metrics.criteriaFlags.familyEligible) {
    issues.push('Некорректные данные о составе семьи');
  }
  
  return {
    status: 'INELIGIBLE',
    message: `Заявление не соответствует критериям: ${issues.join(', ')}`
  };
};
