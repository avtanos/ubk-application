// 8-категорийный анализ доходов для заявок

export interface IncomeCategory {
  id: string;
  name: string;
  description: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface IncomeAnalysisResult {
  totalIncome: number;
  categories: IncomeCategory[];
  analysis: {
    primarySource: string;
    stability: 'high' | 'medium' | 'low';
    diversification: 'high' | 'medium' | 'low';
    recommendations: string[];
    perCapitaIncome: number;
    familySize: number;
  };
}

// 8 категорий доходов согласно государственным стандартам
export const INCOME_CATEGORIES = {
  LABOR: {
    id: 'labor',
    name: 'I. Трудовая деятельность',
    description: 'Заработная плата, пенсии, государственные выплаты',
    color: 'bg-blue-500',
    icon: 'ri-briefcase-line',
    subcategories: ['Заработная плата наемных работников', 'Пенсии и пособия', 'Государственные выплаты']
  },
  EDUCATION: {
    id: 'education',
    name: 'II. Образование',
    description: 'Стипендии, гранты, доходы от обучения',
    color: 'bg-green-500',
    icon: 'ri-graduation-cap-line',
    subcategories: ['Стипендии', 'Образовательные гранты', 'Доходы от обучения']
  },
  ENTREPRENEUR: {
    id: 'entrepreneur',
    name: 'III. Предпринимательская деятельность',
    description: 'Доходы ИП, патентные доходы, лицензионные платежи',
    color: 'bg-purple-500',
    icon: 'ri-store-line',
    subcategories: ['Доходы ИП', 'Патентные доходы', 'Лицензионные платежи']
  },
  AGRICULTURE: {
    id: 'agriculture',
    name: 'IV. Сельское хозяйство',
    description: 'Орошаемое и богарное земледелие, продажа урожая',
    color: 'bg-yellow-500',
    icon: 'ri-plant-line',
    subcategories: ['Орошаемое земледелие', 'Богарное земледелие', 'Продажа урожая']
  },
  LAND_USE: {
    id: 'land_use',
    name: 'V. Землепользование',
    description: 'Аренда земли, продажа земли, доходы от недвижимости',
    color: 'bg-orange-500',
    icon: 'ri-landscape-line',
    subcategories: ['Аренда земли', 'Продажа земли', 'Доходы от недвижимости']
  },
  LIVESTOCK: {
    id: 'livestock',
    name: 'VI. Животноводство',
    description: 'Продажа скота, молочная продукция, птицеводство',
    color: 'bg-pink-500',
    icon: 'ri-cow-line',
    subcategories: ['Продажа скота', 'Молочная продукция', 'Птицеводство']
  },
  BANKING: {
    id: 'banking',
    name: 'VII. Банковские услуги',
    description: 'Депозитные проценты, инвестиционные доходы, дивиденды',
    color: 'bg-indigo-500',
    icon: 'ri-bank-line',
    subcategories: ['Депозитные проценты', 'Инвестиционные доходы', 'Дивиденды']
  },
  OTHER: {
    id: 'other',
    name: 'VIII. Прочие доходы',
    description: 'Алименты, семейная помощь, разовые доходы',
    color: 'bg-gray-500',
    icon: 'ri-more-line',
    subcategories: ['Алименты', 'Семейная помощь', 'Разовые доходы']
  }
};

// Функция для анализа доходов заявки
export function analyzeApplicationIncome(application: any): IncomeAnalysisResult {
  const incomes = application.formData?.incomes || [];
  const familyMembers = application.formData?.familyMembers || [];
  const landPlots = application.formData?.landPlots || [];
  const livestock = application.formData?.livestock || [];
  const vehicles = application.formData?.vehicles || [];
  
  // Собираем все доходы (заявитель + члены семьи)
  const allIncomes = [...incomes];
  
  // Добавляем доходы членов семьи
  familyMembers.forEach((member: any) => {
    if (member.monthlyIncome && member.monthlyIncome > 0) {
      allIncomes.push({
        type: 'SALARY',
        amount: member.monthlyIncome,
        source: member.workplace || 'Работа',
        periodicity: 'M'
      });
    }
  });

  // Добавляем доходы от имущества (если есть данные)
  landPlots.forEach((plot: any) => {
    if (plot.estimatedValue && plot.estimatedValue > 0) {
      allIncomes.push({
        type: 'LAND_USE',
        amount: plot.estimatedValue / 12, // Конвертируем годовую стоимость в месячную
        source: 'Земельный участок',
        periodicity: 'M'
      });
    }
  });

  livestock.forEach((animal: any) => {
    if (animal.estimatedValue && animal.estimatedValue > 0) {
      allIncomes.push({
        type: 'LIVESTOCK',
        amount: animal.estimatedValue / 12, // Конвертируем годовую стоимость в месячную
        source: 'Скот',
        periodicity: 'M'
      });
    }
  });

  vehicles.forEach((vehicle: any) => {
    if (vehicle.estimatedValue && vehicle.estimatedValue > 0) {
      allIncomes.push({
        type: 'OTHER',
        amount: vehicle.estimatedValue / 12, // Конвертируем годовую стоимость в месячную
        source: 'Транспортное средство',
        periodicity: 'M'
      });
    }
  });

  // Группируем доходы по категориям
  const categoryTotals: { [key: string]: number } = {};
  let totalIncome = 0;

  allIncomes.forEach((income: any) => {
    const category = mapIncomeTypeToCategory(income.type);
    const amount = income.amount || 0;
    
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    
    categoryTotals[category] += amount;
    totalIncome += amount;
  });

  // Создаем категории с процентами
  const categories: IncomeCategory[] = Object.entries(INCOME_CATEGORIES).map(([key, category]) => {
    const amount = categoryTotals[category.id] || 0;
    const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
    
    return {
      ...category,
      amount: Math.round(amount * 100) / 100,
      percentage: Math.round(percentage * 100) / 100
    };
  }).filter(cat => cat.amount > 0);

  // Анализ стабильности и диверсификации
  const analysis = analyzeIncomeStability(categories, totalIncome, familyMembers.length + 1);

  return {
    totalIncome: Math.round(totalIncome * 100) / 100,
    categories,
    analysis
  };
}

// Маппинг типов доходов на категории
function mapIncomeTypeToCategory(incomeType: string): string {
  const mapping: { [key: string]: string } = {
    'SALARY': 'labor',
    'PENSION': 'labor',
    'BENEFIT': 'labor',
    'UNEMPLOYMENT_BENEFIT': 'labor',
    'BUSINESS': 'entrepreneur',
    'RENTAL': 'land_use',
    'INVESTMENT': 'banking',
    'AGRICULTURE': 'agriculture',
    'FARMING': 'agriculture',
    'LIVESTOCK': 'livestock',
    'LAND_USE': 'land_use',
    'EDUCATION': 'education',
    'OTHER': 'other'
  };
  
  return mapping[incomeType] || 'other';
}

// Анализ стабильности доходов
function analyzeIncomeStability(categories: IncomeCategory[], totalIncome: number, familySize: number) {
  const primaryCategory = categories.reduce((max, cat) => 
    cat.amount > max.amount ? cat : max, categories[0] || { amount: 0, name: 'Нет данных' }
  );
  
  // Рассчитываем доход на душу населения
  const perCapitaIncome = familySize > 0 ? totalIncome / familySize : 0;
  
  // Определяем стабильность
  let stability: 'high' | 'medium' | 'low' = 'low';
  if (primaryCategory.name.includes('Трудовая деятельность')) {
    stability = 'high';
  } else if (primaryCategory.name.includes('Предпринимательская деятельность') || primaryCategory.name.includes('Сельское хозяйство')) {
    stability = 'medium';
  }
  
  // Определяем диверсификацию
  let diversification: 'high' | 'medium' | 'low' = 'low';
  const activeCategories = categories.filter(cat => cat.amount > 0).length;
  if (activeCategories >= 4) {
    diversification = 'high';
  } else if (activeCategories >= 2) {
    diversification = 'medium';
  }
  
  // Генерируем рекомендации
  const recommendations: string[] = [];
  
  if (stability === 'low') {
    recommendations.push('Рекомендуется найти стабильный источник дохода');
  }
  
  if (diversification === 'low') {
    recommendations.push('Рассмотрите возможность диверсификации доходов');
  }
  
  if (primaryCategory.percentage > 80) {
    recommendations.push('Высокая зависимость от одного источника дохода');
  }
  
  if (perCapitaIncome < 4500) {
    recommendations.push('Низкий уровень доходов на душу населения, возможно получение дополнительной поддержки');
  }
  
  if (categories.find(cat => cat.name.includes('Трудовая деятельность'))?.percentage > 50) {
    recommendations.push('Высокая зависимость от трудовой деятельности');
  }
  
  if (perCapitaIncome > 4500) {
    recommendations.push('Доходы превышают порог ГМД, заявка может не подойти');
  }
  
  return {
    primarySource: primaryCategory.name,
    stability,
    diversification,
    recommendations,
    perCapitaIncome: Math.round(perCapitaIncome * 100) / 100,
    familySize
  };
}

// Функция для получения цветового индикатора стабильности
export function getStabilityColor(stability: string): string {
  switch (stability) {
    case 'high': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

// Функция для получения цветового индикатора диверсификации
export function getDiversificationColor(diversification: string): string {
  switch (diversification) {
    case 'high': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

// Функция для форматирования суммы
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KGS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
