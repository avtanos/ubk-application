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
  // Для демонстрации возвращаем моковые данные для всех 8 категорий
  const mockCategories: IncomeCategory[] = [
    {
      id: 'labor',
      name: 'I. Трудовая деятельность',
      description: 'Заработная плата, пенсии, государственные выплаты',
      amount: 20000,
      percentage: 59.3,
      color: 'bg-blue-500',
      icon: 'ri-briefcase-line'
    },
    {
      id: 'education',
      name: 'II. Образование',
      description: 'Стипендии, гранты, доходы от обучения',
      amount: 3000,
      percentage: 8.9,
      color: 'bg-green-500',
      icon: 'ri-graduation-cap-line'
    },
    {
      id: 'entrepreneur',
      name: 'III. Предпринимательская деятельность',
      description: 'Доходы ИП, патентные доходы, лицензионные платежи',
      amount: 0,
      percentage: 0,
      color: 'bg-purple-500',
      icon: 'ri-store-line'
    },
    {
      id: 'agriculture',
      name: 'IV. Сельское хозяйство',
      description: 'Орошаемое и богарное земледелие, продажа урожая',
      amount: 0,
      percentage: 0,
      color: 'bg-yellow-500',
      icon: 'ri-plant-line'
    },
    {
      id: 'land_use',
      name: 'V. Землепользование',
      description: 'Аренда земли, продажа земли, доходы от недвижимости',
      amount: 10000,
      percentage: 29.6,
      color: 'bg-orange-500',
      icon: 'ri-landscape-line'
    },
    {
      id: 'livestock',
      name: 'VI. Животноводство',
      description: 'Продажа скота, молочная продукция, птицеводство',
      amount: 0,
      percentage: 0,
      color: 'bg-pink-500',
      icon: 'ri-cow-line'
    },
    {
      id: 'banking',
      name: 'VII. Банковские услуги',
      description: 'Депозитные проценты, инвестиционные доходы, дивиденды',
      amount: 500,
      percentage: 1.5,
      color: 'bg-indigo-500',
      icon: 'ri-bank-line'
    },
    {
      id: 'other',
      name: 'VIII. Прочие доходы',
      description: 'Алименты, семейная помощь, разовые доходы',
      amount: 300,
      percentage: 0.9,
      color: 'bg-gray-500',
      icon: 'ri-more-line'
    }
  ];

  const totalIncome = 33800;
  const familySize = application?.familyMembers?.length || 4;

  // Анализ стабильности и диверсификации
  const analysis = {
    primarySource: 'I. Трудовая деятельность',
    stability: 'high' as const,
    diversification: 'medium' as const,
    recommendations: [
      'Высокая зависимость от трудовой деятельности',
      'Рассмотрите возможность диверсификации доходов',
      'Стабильный доход позволяет планировать расходы'
    ],
    perCapitaIncome: Math.round(totalIncome / familySize),
    familySize
  };

  return {
    totalIncome,
    categories: mockCategories,
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
