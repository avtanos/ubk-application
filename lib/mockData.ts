
export const mockFamilies = [
  {
    id: 1,
    familyHead: 'Айжан Абдуллаева',
    region: 'Бишкек',
    regionType: 'urban',
    members: [
      { name: 'Айжан Абдуллаева', age: 32, relation: 'Мать', income: 15000 },
      { name: 'Талант Абдуллаев', age: 35, relation: 'Отец', income: 15000 },
      { name: 'Азиза Абдуллаева', age: 12, relation: 'Дочь', income: 0 },
      { name: 'Бакыт Абдуллаев', age: 8, relation: 'Сын', income: 0 }
    ],
    totalIncome: 30000,
    childrenUnder16: 2,
    perCapitaIncome: 7500,
    gmdThreshold: 6000,
    eligible: false,
    regionalCoefficient: 1.0,
    baseBenefit: 1200
  },
  {
    id: 2,
    familyHead: 'Гүлнара Осмонова',
    region: 'Нарын',
    regionType: 'mountainous',
    members: [
      { name: 'Гүлнара Осмонова', age: 28, relation: 'Мать', income: 12000 },
      { name: 'Нурбек Осмонов', age: 14, relation: 'Сын', income: 0 },
      { name: 'Айым Осмонова', age: 10, relation: 'Дочь', income: 0 },
      { name: 'Элмир Осмонов', age: 6, relation: 'Сын', income: 0 }
    ],
    totalIncome: 12000,
    childrenUnder16: 3,
    perCapitaIncome: 3000,
    gmdThreshold: 6000,
    eligible: true,
    regionalCoefficient: 1.15,
    baseBenefit: 1200
  },
  {
    id: 3,
    familyHead: 'Жамиля Турдубекова',
    region: 'Баткен',
    regionType: 'border',
    members: [
      { name: 'Жамиля Турдубекова', age: 30, relation: 'Мать', income: 8000 },
      { name: 'Аида Турдубекова', age: 15, relation: 'Дочь', income: 0 },
      { name: 'Данияр Турдубеков', age: 11, relation: 'Сын', income: 0 }
    ],
    totalIncome: 8000,
    childrenUnder16: 2,
    perCapitaIncome: 2667,
    gmdThreshold: 6000,
    eligible: true,
    regionalCoefficient: 1.2,
    baseBenefit: 1200,
    borderBonus: 1000
  }
];

export const mockApplications = [
  {
    id: 'APP-2025-001',
    applicantName: 'Айжан Абдуллаева',
    applicantId: '12345678901234',
    phone: '+996 555 123 456',
    email: 'aijan.abdullaeva@email.com',
    address: 'г. Бишкек, ул. Чуй 123, кв. 45',
    familyMembers: [
      {
        id: '1',
        name: 'Айжан Абдуллаева',
        relationship: 'spouse' as const,
        birthDate: new Date('1990-05-15'),
        isDisabled: false,
        isStudent: false,
        isWorking: true,
        income: 15000
      },
      {
        id: '2',
        name: 'Талант Абдуллаев',
        relationship: 'spouse' as const,
        birthDate: new Date('1988-03-20'),
        isDisabled: false,
        isStudent: false,
        isWorking: true,
        income: 15000
      },
      {
        id: '3',
        name: 'Азиза Абдуллаева',
        relationship: 'child' as const,
        birthDate: new Date('2012-08-10'),
        isDisabled: false,
        isStudent: true,
        isWorking: false,
        income: 0
      },
      {
        id: '4',
        name: 'Бакыт Абдуллаев',
        relationship: 'child' as const,
        birthDate: new Date('2016-12-05'),
        isDisabled: false,
        isStudent: false,
        isWorking: false,
        income: 0
      }
    ],
    income: [
      {
        id: '1',
        type: 'salary' as const,
        amount: 30000,
        source: 'ООО "Торговый дом"',
        period: 'Январь 2025',
        isRegular: true,
        documents: ['doc1.pdf']
      }
    ],
    documents: [
      {
        id: '1',
        name: 'Паспорт Айжан Абдуллаевой',
        type: 'passport' as const,
        url: '/documents/passport1.pdf',
        uploadedAt: new Date('2025-01-15'),
        uploadedBy: 'Айжан Абдуллаева',
        status: 'verified' as const,
        verifiedAt: new Date('2025-01-16'),
        verifiedBy: 'Нурбек Жумабеков'
      },
      {
        id: '2',
        name: 'Справка о доходах',
        type: 'income_certificate' as const,
        url: '/documents/income1.pdf',
        uploadedAt: new Date('2025-01-15'),
        uploadedBy: 'Айжан Абдуллаева',
        status: 'verified' as const,
        verifiedAt: new Date('2025-01-16'),
        verifiedBy: 'Нурбек Жумабеков'
      }
    ],
    status: 'under_review' as const,
    priority: 'medium' as const,
    riskScore: 25,
    submittedAt: new Date('2025-01-15'),
    reviewedAt: new Date('2025-01-16'),
    reviewedBy: 'Нурбек Жумабеков',
    inspectionRequired: false,
    notes: 'Заявка в процессе рассмотрения. Все документы проверены.'
  },
  {
    id: 'APP-2025-002',
    applicantName: 'Гүлнара Осмонова',
    applicantId: '23456789012345',
    phone: '+996 555 234 567',
    email: 'gulnara.osmonova@email.com',
    address: 'Нарынская область, с. Ат-Баши, ул. Ленина 67',
    familyMembers: [
      {
        id: '1',
        name: 'Гүлнара Осмонова',
        relationship: 'spouse' as const,
        birthDate: new Date('1995-07-12'),
        isDisabled: false,
        isStudent: false,
        isWorking: true,
        income: 12000
      },
      {
        id: '2',
        name: 'Нурбек Осмонов',
        relationship: 'child' as const,
        birthDate: new Date('2010-04-18'),
        isDisabled: false,
        isStudent: true,
        isWorking: false,
        income: 0
      },
      {
        id: '3',
        name: 'Айым Осмонова',
        relationship: 'child' as const,
        birthDate: new Date('2014-09-25'),
        isDisabled: false,
        isStudent: true,
        isWorking: false,
        income: 0
      },
      {
        id: '4',
        name: 'Элмир Осмонов',
        relationship: 'child' as const,
        birthDate: new Date('2018-11-30'),
        isDisabled: false,
        isStudent: false,
        isWorking: false,
        income: 0
      }
    ],
    income: [
      {
        id: '1',
        type: 'salary' as const,
        amount: 12000,
        source: 'Айыл окмоту Ат-Баши',
        period: 'Январь 2025',
        isRegular: true,
        documents: ['doc2.pdf']
      }
    ],
    documents: [
      {
        id: '1',
        name: 'Паспорт Гүлнары Осмоновой',
        type: 'passport' as const,
        url: '/documents/passport2.pdf',
        uploadedAt: new Date('2025-01-12'),
        uploadedBy: 'Гүлнара Осмонова',
        status: 'verified' as const,
        verifiedAt: new Date('2025-01-13'),
        verifiedBy: 'Айгүл Касымова'
      },
      {
        id: '2',
        name: 'Свидетельства о рождении детей',
        type: 'birth_certificate' as const,
        url: '/documents/birth_certs2.pdf',
        uploadedAt: new Date('2025-01-12'),
        uploadedBy: 'Гүлнара Осмонова',
        status: 'verified' as const,
        verifiedAt: new Date('2025-01-13'),
        verifiedBy: 'Айгүл Касымова'
      }
    ],
    status: 'approved' as const,
    priority: 'high' as const,
    riskScore: 15,
    submittedAt: new Date('2025-01-12'),
    reviewedAt: new Date('2025-01-13'),
    reviewedBy: 'Айгүл Касымова',
    approvedAt: new Date('2025-01-20'),
    approvedBy: 'Айгүл Касымова',
    paymentAmount: 4140,
    paymentStatus: 'completed' as const,
    inspectionRequired: false,
    notes: 'Заявка одобрена. Семья соответствует критериям программы.'
  },
  {
    id: 'APP-2025-003',
    applicantName: 'Жамиля Турдубекова',
    applicantId: '34567890123456',
    phone: '+996 555 345 678',
    email: 'jamila.turdubekova@email.com',
    address: 'Баткенская область, г. Баткен, ул. Мира 89',
    familyMembers: [
      {
        id: '1',
        name: 'Жамиля Турдубекова',
        relationship: 'spouse' as const,
        birthDate: new Date('1992-11-08'),
        isDisabled: false,
        isStudent: false,
        isWorking: true,
        income: 8000
      },
      {
        id: '2',
        name: 'Аида Турдубекова',
        relationship: 'child' as const,
        birthDate: new Date('2009-06-14'),
        isDisabled: false,
        isStudent: true,
        isWorking: false,
        income: 0
      },
      {
        id: '3',
        name: 'Данияр Турдубеков',
        relationship: 'child' as const,
        birthDate: new Date('2013-02-28'),
        isDisabled: false,
        isStudent: true,
        isWorking: false,
        income: 0
      }
    ],
    income: [
      {
        id: '1',
        type: 'salary' as const,
        amount: 8000,
        source: 'Школа №1 г. Баткен',
        period: 'Январь 2025',
        isRegular: true,
        documents: ['doc3.pdf']
      }
    ],
    documents: [
      {
        id: '1',
        name: 'Паспорт Жамили Турдубековой',
        type: 'passport' as const,
        url: '/documents/passport3.pdf',
        uploadedAt: new Date('2025-01-10'),
        uploadedBy: 'Жамиля Турдубекова',
        status: 'verified' as const,
        verifiedAt: new Date('2025-01-11'),
        verifiedBy: 'Омурбек Ташиев'
      },
      {
        id: '2',
        name: 'Справка о доходах',
        type: 'income_certificate' as const,
        url: '/documents/income3.pdf',
        uploadedAt: new Date('2025-01-10'),
        uploadedBy: 'Жамиля Турдубекова',
        status: 'verified' as const,
        verifiedAt: new Date('2025-01-11'),
        verifiedBy: 'Омурбек Ташиев'
      }
    ],
    status: 'approved' as const,
    priority: 'high' as const,
    riskScore: 10,
    submittedAt: new Date('2025-01-10'),
    reviewedAt: new Date('2025-01-11'),
    reviewedBy: 'Омурбек Ташиев',
    approvedAt: new Date('2025-01-22'),
    approvedBy: 'Омурбек Ташиев',
    paymentAmount: 3880,
    paymentStatus: 'completed' as const,
    inspectionRequired: false,
    notes: 'Заявка одобрена. Применен пограничный коэффициент.'
  }
];

// Обновленные категории доходов согласно официальному списку
export const incomeCategories = [
  // I. Основные доходы
  { id: 'salary', name: 'Зарплата', category: 'primary', icon: 'ri-money-dollar-circle-line' },
  { id: 'pension', name: 'Пенсия', category: 'primary', icon: 'ri-user-heart-line' },
  { id: 'scholarship', name: 'Стипендия', category: 'primary', icon: 'ri-book-line' },
  { id: 'unemployment_benefit', name: 'Пособие по безработице', category: 'primary', icon: 'ri-briefcase-line' },
  { id: 'alimony', name: 'Алименты', category: 'primary', icon: 'ri-heart-line' },
  
  // II. Доходы от собственности
  { id: 'property_rental', name: 'Доход от собственности, сданной в наем', category: 'property', icon: 'ri-home-line' },
  { id: 'tenant_payment', name: 'Оплата от квартиросъемщиков/постояльцев', category: 'property', icon: 'ri-home-4-line' },
  { id: 'car_rental', name: 'Доход от использования личной автомашины', category: 'property', icon: 'ri-car-line' },
  
  // III. Доходы от сельского хозяйства
  { id: 'tenant_coop_income', name: 'Доходы арендаторов и кооператоров', category: 'agriculture', icon: 'ri-plant-line' },
  { id: 'farm_work_payment', name: 'Оплата за работу в фермерских/крестьянских хозяйствах', category: 'agriculture', icon: 'ri-tractor-line' },
  { id: 'individual_labor', name: 'Доход от индивидуальной трудовой деятельности', category: 'agriculture', icon: 'ri-tools-line' },
  { id: 'business_income', name: 'Доход от предпринимательской, коммерческой деятельности', category: 'business', icon: 'ri-briefcase-line' },
  { id: 'part_time_work', name: 'Оплата труда за работу по совместительству и найму', category: 'employment', icon: 'ri-time-line' },
  
  // IV. Внешние доходы
  { id: 'foreign_income', name: 'Суммы, заработанные за пределами республики', category: 'foreign', icon: 'ri-global-line' },
  { id: 'compensation', name: 'Суммы, полученные в порядке возмещения ущерба', category: 'compensation', icon: 'ri-shield-check-line' },
  
  // V. Земельные доходы
  { id: 'land_rental', name: 'Доход с земли, сданной (или могшей быть сданной) в аренду', category: 'land', icon: 'ri-landscape-line' },
  { id: 'household_plot', name: 'Доход от личных приусадебных участков', category: 'land', icon: 'ri-home-garden-line' },
  { id: 'farm_income', name: 'Доход с крестьянского и фермерского хозяйства', category: 'land', icon: 'ri-seedling-line' },
  
  // VI. Социальные выплаты
  { id: 'family_help', name: 'Помощь от родственников', category: 'social', icon: 'ri-hand-heart-line' },
  { id: 'social_benefit', name: 'Социальное пособие или пенсия', category: 'social', icon: 'ri-heart-line' },
  { id: 'dividends', name: 'Дивиденды', category: 'financial', icon: 'ri-stock-line' },
  { id: 'monetary_compensation', name: 'Денежная компенсация', category: 'compensation', icon: 'ri-money-dollar-circle-line' }
];

export const regions = [
  { id: 'bishkek', name: 'Бишкек', type: 'urban', coefficient: 1.0 },
  { id: 'osh', name: 'Ош', type: 'urban', coefficient: 1.0 },
  { id: 'naryn', name: 'Нарын', type: 'mountainous', coefficient: 1.15 },
  { id: 'issyk-kul', name: 'Иссык-Куль', type: 'mountainous', coefficient: 1.15 },
  { id: 'batken', name: 'Баткен', type: 'border', coefficient: 1.2, borderBonus: 1000 },
  { id: 'osh-region', name: 'Ошская область', type: 'rural', coefficient: 1.0 },
  { id: 'jalal-abad', name: 'Джалал-Абад', type: 'rural', coefficient: 1.0 },
  { id: 'talas', name: 'Талас', type: 'rural', coefficient: 1.0 },
  { id: 'chui', name: 'Чуй', type: 'rural', coefficient: 1.0 }
];

// External System Integrations for automated checks
export const externalIntegrations = [
  {
    id: 'tunduk',
    name: 'Tunduk',
    description: 'Государственная система идентификации граждан',
    icon: 'ri-shield-user-line',
    status: 'active'
  },
  {
    id: 'employment_center',
    name: 'Центр занятости',
    description: 'Проверка статуса безработицы',
    icon: 'ri-briefcase-line',
    status: 'active'
  },
  {
    id: 'medical_commission',
    name: 'Медико-социальная экспертная комиссия',
    description: 'Проверка статуса инвалидности',
    icon: 'ri-hospital-line',
    status: 'active'
  },
  {
    id: 'sanaryp_aymak',
    name: 'Система "Санарып Аймак"',
    description: 'Комплексные данные о гражданах',
    icon: 'ri-database-2-line',
    status: 'active'
  },
  {
    id: 'tax_service',
    name: 'Налоговая служба',
    description: 'Проверка доходов и налоговых обязательств',
    icon: 'ri-money-dollar-circle-line',
    status: 'active'
  },
  {
    id: 'cadastre',
    name: 'Кадастр',
    description: 'Проверка права собственности на недвижимость',
    icon: 'ri-home-line',
    status: 'active'
  },
  {
    id: 'banks',
    name: 'Банковская система',
    description: 'Проверка финансовой информации',
    icon: 'ri-bank-line',
    status: 'active'
  },
  {
    id: 'probation',
    name: 'Служба пробации',
    description: 'Проверка криминального статуса',
    icon: 'ri-shield-check-line',
    status: 'active'
  }
];

export const GMD_THRESHOLD = 6000; // Гарантированный минимальный доход (устанавливается ежегодно Кабмином)
export const BASE_BENEFIT_PER_CHILD = 1200; // Base amount: 1,200 soms per child under 16
