
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
        amount: 20000,
        source: 'ООО "Торговый дом"',
        period: 'Январь 2025',
        isRegular: true,
        documents: ['doc1.pdf']
      },
      {
        id: '2',
        type: 'education' as const,
        amount: 3000,
        source: 'Стипендия студента',
        period: 'Январь 2025',
        isRegular: true,
        documents: ['doc2.pdf']
      },
      {
        id: '3',
        type: 'land_use' as const,
        amount: 10000,
        source: 'Аренда земли',
        period: 'Январь 2025',
        isRegular: true,
        documents: ['doc3.pdf']
      },
      {
        id: '4',
        type: 'banking' as const,
        amount: 500,
        source: 'Депозитные проценты',
        period: 'Январь 2025',
        isRegular: true,
        documents: ['doc4.pdf']
      },
      {
        id: '5',
        type: 'other' as const,
        amount: 300,
        source: 'Семейная помощь',
        period: 'Январь 2025',
        isRegular: false,
        documents: ['doc5.pdf']
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
      },
      {
        id: '2',
        type: 'education' as const,
        amount: 2000,
        source: 'Стипендия студента',
        period: 'Январь 2025',
        isRegular: true,
        documents: ['doc2_2.pdf']
      },
      {
        id: '3',
        type: 'agriculture' as const,
        amount: 5000,
        source: 'Продажа урожая',
        period: 'Январь 2025',
        isRegular: false,
        documents: ['doc2_3.pdf']
      },
      {
        id: '4',
        type: 'livestock' as const,
        amount: 3000,
        source: 'Продажа молочной продукции',
        period: 'Январь 2025',
        isRegular: true,
        documents: ['doc2_4.pdf']
      },
      {
        id: '5',
        type: 'other' as const,
        amount: 1000,
        source: 'Семейная помощь',
        period: 'Январь 2025',
        isRegular: false,
        documents: ['doc2_5.pdf']
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
      },
      {
        id: '2',
        type: 'education' as const,
        amount: 1500,
        source: 'Стипендия студента',
        period: 'Январь 2025',
        isRegular: true,
        documents: ['doc3_2.pdf']
      },
      {
        id: '3',
        type: 'entrepreneur' as const,
        amount: 2000,
        source: 'Доходы ИП',
        period: 'Январь 2025',
        isRegular: true,
        documents: ['doc3_3.pdf']
      },
      {
        id: '4',
        type: 'agriculture' as const,
        amount: 1500,
        source: 'Продажа овощей',
        period: 'Январь 2025',
        isRegular: false,
        documents: ['doc3_4.pdf']
      },
      {
        id: '5',
        type: 'other' as const,
        amount: 500,
        source: 'Алименты',
        period: 'Январь 2025',
        isRegular: true,
        documents: ['doc3_5.pdf']
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

// Тестовые данные для выездных проверок
export const mockInspections = [
  {
    id: 1,
    applicationId: 1,
    inspectionNumber: 'INS-2024-001',
    status: 'ASSIGNED' as const,
    type: 'PRIMARY' as const,
    priority: 'HIGH' as const,
    assignedDate: '2024-01-15T09:00:00Z',
    scheduledDate: '2024-01-20',
    scheduledTime: '10:00',
    inspectorId: 1,
    inspectorName: 'Нурбек Жумабеков',
    address: 'ул. Чуй, 123, кв. 45, Бишкек',
    notes: 'Заявка с высоким риском, требуется детальная проверка',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    application: {
      id: 1,
      applicationNumber: 'APP-2024-001',
      applicant: {
        id: 1,
        fullName: 'Айбек Кыдыров',
        pin: '12345678901234',
        birthDate: '1985-03-15',
        age: 39,
        genderCode: 'M' as const,
        citizenshipCode: 'KG',
        language: 'ru' as const,
        isActive: true,
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-10T08:00:00Z'
      },
      status: 'INSPECTION_ASSIGNED' as const,
      priority: 'HIGH' as const,
      riskScore: 85,
      submittedAt: '2024-01-10T08:00:00Z',
    inspectionRequired: true,
    homeVisitRequired: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
    }
  },
  {
    id: 2,
    applicationId: 2,
    inspectionNumber: 'INS-2024-002',
    status: 'IN_PROGRESS' as const,
    type: 'REPEAT' as const,
    priority: 'MEDIUM' as const,
    assignedDate: '2024-01-12T10:00:00Z',
    scheduledDate: '2024-01-18',
    scheduledTime: '14:00',
    inspectorId: 2,
    inspectorName: 'Айгуль Токтосунова',
    address: 'ул. Московская, 45, кв. 12, Бишкек',
    notes: 'Повторная проверка по жалобе',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
    application: {
      id: 2,
      applicationNumber: 'APP-2024-002',
      applicant: {
        id: 2,
        fullName: 'Нургуль Асанова',
        pin: '23456789012345',
        birthDate: '1990-07-22',
        age: 34,
        genderCode: 'F' as const,
        citizenshipCode: 'KG',
        language: 'ru' as const,
        isActive: true,
        createdAt: '2024-01-08T10:00:00Z',
        updatedAt: '2024-01-12T10:00:00Z'
      },
      status: 'INSPECTION_IN_PROGRESS' as const,
      priority: 'MEDIUM' as const,
      riskScore: 65,
      submittedAt: '2024-01-08T10:00:00Z',
      inspectionRequired: true,
      homeVisitRequired: true,
      createdAt: '2024-01-08T10:00:00Z',
      updatedAt: '2024-01-18T14:00:00Z'
    }
  },
  {
    id: 3,
    applicationId: 3,
    inspectionNumber: 'INS-2024-003',
    status: 'COMPLETED' as const,
    type: 'PRIMARY' as const,
    priority: 'LOW' as const,
    assignedDate: '2024-01-10T08:00:00Z',
    scheduledDate: '2024-01-15',
    scheduledTime: '09:00',
    inspectorId: 3,
    inspectorName: 'Марат Беков',
    address: 'ул. Ленина, 78, кв. 23, Бишкек',
    notes: 'Проверка завершена успешно',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z',
    application: {
      id: 3,
      applicationNumber: 'APP-2024-003',
      applicant: {
        id: 3,
        fullName: 'Марат Беков',
        pin: '34567890123456',
        birthDate: '1978-11-05',
        age: 45,
        genderCode: 'M' as const,
        citizenshipCode: 'KG',
        language: 'ru' as const,
        isActive: true,
        createdAt: '2024-01-05T12:00:00Z',
        updatedAt: '2024-01-15T16:00:00Z'
      },
      status: 'INSPECTION_COMPLETED' as const,
      priority: 'LOW' as const,
      riskScore: 35,
      submittedAt: '2024-01-05T12:00:00Z',
      inspectionRequired: true,
      homeVisitRequired: false,
      createdAt: '2024-01-05T12:00:00Z',
      updatedAt: '2024-01-15T16:00:00Z'
    },
    report: {
      id: 1,
      inspectionId: 3,
      applicationId: 3,
      reportNumber: 'RPT-2024-001',
      reportDate: '2024-01-15',
      visitDate: '2024-01-15',
      visitTime: '09:00',
      livingAddress: 'ул. Ленина, 78, кв. 23, Бишкек',
      registrationAddress: 'ул. Ленина, 78, кв. 23, Бишкек',
      regionalStatus: 'OTHER' as const,
      applicantFullName: 'Марат Беков',
      applicantPin: '34567890123456',
      applicantBirthDate: '1978-11-05',
      identityDocument: {
        series: 'ID',
        number: '1234567',
        issuedBy: 'МВД КР'
      },
      contactPhone: '+996 555 123 456',
      actualFamilyMembers: [
        {
          id: 1,
          fullName: 'Марат Беков',
          gender: 'M' as const,
          birthDate: '1978-11-05',
          pin: '34567890123456',
          document: 'Паспорт ID1234567',
          relation: 'Заявитель',
          citizenship: 'KG',
          specialStatus: 'Пенсионер'
        },
        {
          id: 2,
          fullName: 'Айгуль Бекова',
          gender: 'F' as const,
          birthDate: '1982-04-12',
          pin: '45678901234567',
          document: 'Паспорт ID2345678',
          relation: 'Супруга',
          citizenship: 'KG',
          specialStatus: 'Работает'
        }
      ],
      housingConditions: {
        type: 'APARTMENT' as const,
        ownership: 'OWNED' as const,
        area: 65.5,
        roomsCount: 3,
        utilities: {
          waterSupply: true,
          electricity: true,
          heating: 'CENTRAL' as const
        },
        sanitaryConditions: 'Хорошие санитарные условия',
        generalAssessment: 'Жилье в хорошем состоянии'
      },
      incomeSources: {
        mainIncome: 'Пенсия 15000 сом, зарплата супруги 25000 сом',
        additionalIncome: 'Подработка 5000 сом',
        supportingDocuments: ['Справка о доходах', 'Справка из Соцфонда']
      },
      property: {
        landPlot: {
          exists: true,
          type: 'HOUSEHOLD' as const,
          area: 6,
          usage: 'Огород'
        },
        livestock: {
          cattle: 0,
          smallCattle: 2,
          other: 'Куры 10 штук'
        },
        vehicles: {
          hasVehicle: true,
          makeModel: 'ВАЗ 2107'
        },
        realEstate: 'Нет дополнительной недвижимости',
        bankDeposits: {
          hasDeposits: false,
          amount: 0
        }
      },
      specialistConclusions: {
        familyCompositionMatches: true,
        livingConditions: 'Удовлетворительные жилищные условия',
        incomeLevel: 'Доходы соответствуют заявленным',
        meetsCriteria: 'YES' as const,
        rejectionReason: ''
      },
      signatures: {
        specialist: {
          fullName: 'Марат Беков',
          position: 'Специалист по выездным проверкам',
          signature: 'М.Беков'
        },
        supervisor: {
          fullName: 'Нурбек Жумабеков',
          signature: 'Н.Жумабеков'
        },
        applicant: {
          fullName: 'Марат Беков',
          signature: 'М.Беков'
        }
      },
      attachments: {
        hasPhotos: true,
        hasDocumentCopies: true,
        hasOtherMaterials: false
      },
      status: 'COMPLETED' as const,
      createdAt: '2024-01-15T16:00:00Z',
      updatedAt: '2024-01-15T16:00:00Z'
    }
  },
  {
    id: 4,
    applicationId: 4,
    inspectionNumber: 'INS-2024-004',
    status: 'CANCELLED' as const,
    type: 'PRIMARY' as const,
    priority: 'MEDIUM' as const,
    assignedDate: '2024-01-14T11:00:00Z',
    scheduledDate: '2024-01-19',
    scheduledTime: '11:00',
    inspectorId: 4,
    inspectorName: 'Нургуль Асанова',
    address: 'ул. Ибраимова, 12, кв. 8, Бишкек',
    notes: 'Проверка отменена по просьбе заявителя',
    createdAt: '2024-01-14T11:00:00Z',
    updatedAt: '2024-01-16T14:00:00Z',
    application: {
      id: 4,
      applicationNumber: 'APP-2024-004',
      applicant: {
        id: 4,
        fullName: 'Айгуль Токтосунова',
        pin: '45678901234567',
        birthDate: '1987-09-18',
        age: 36,
        genderCode: 'F' as const,
        citizenshipCode: 'KG',
        language: 'ru' as const,
        isActive: true,
        createdAt: '2024-01-12T14:00:00Z',
        updatedAt: '2024-01-16T14:00:00Z'
      },
      status: 'CANCELLED' as const,
      priority: 'MEDIUM' as const,
      riskScore: 55,
      submittedAt: '2024-01-12T14:00:00Z',
      inspectionRequired: true,
      homeVisitRequired: true,
      createdAt: '2024-01-12T14:00:00Z',
      updatedAt: '2024-01-16T14:00:00Z'
    }
  },
  {
    id: 5,
    applicationId: 5,
    inspectionNumber: 'INS-2024-005',
    status: 'ASSIGNED' as const,
    type: 'COMPLAINT' as const,
    priority: 'URGENT' as const,
    assignedDate: '2024-01-18T15:00:00Z',
    scheduledDate: '2024-01-22',
    scheduledTime: '13:00',
    inspectorId: 1,
    inspectorName: 'Нурбек Жумабеков',
    address: 'ул. Ахунбаева, 34, кв. 15, Бишкек',
    notes: 'Проверка по жалобе - срочная',
    createdAt: '2024-01-18T15:00:00Z',
    updatedAt: '2024-01-18T15:00:00Z',
    application: {
      id: 5,
      applicationNumber: 'APP-2024-005',
      applicant: {
        id: 5,
        fullName: 'Эркин Садыков',
        pin: '56789012345678',
        birthDate: '1992-12-03',
        age: 31,
        genderCode: 'M' as const,
        citizenshipCode: 'KG',
        language: 'ru' as const,
        isActive: true,
        createdAt: '2024-01-16T16:00:00Z',
        updatedAt: '2024-01-18T15:00:00Z'
      },
      status: 'INSPECTION_ASSIGNED' as const,
      priority: 'URGENT' as const,
      riskScore: 95,
      submittedAt: '2024-01-16T16:00:00Z',
      inspectionRequired: true,
      homeVisitRequired: true,
      createdAt: '2024-01-16T16:00:00Z',
      updatedAt: '2024-01-18T15:00:00Z'
    }
  }
];

// Тестовые данные для статистики проверок
export const mockInspectionStats = {
  total: 5,
  assigned: 2,
  inProgress: 1,
  completed: 1,
  cancelled: 1,
  averageDuration: 2.5,
  successRate: 80
};

// Мокап данные для 8 категорий доходов
export const mockIncomeData = {
  // I. Основной доход семьи
  primaryIncome: [
    {
      id: 1,
      type: 'salary',
      amount: 25000,
      source: 'ООО "Торговый дом"',
      period: 'Январь 2025',
      recipientPin: '12345678901234',
      recipientFullName: 'Айжан Абдуллаева',
      periodicity: 'M',
      isRegular: true
    },
    {
      id: 2,
      type: 'salary',
      amount: 30000,
      source: 'АО "Кыргызтелеком"',
      period: 'Январь 2025',
      recipientPin: '12345678901235',
      recipientFullName: 'Талант Абдуллаев',
      periodicity: 'M',
      isRegular: true
    },
    {
      id: 3,
      type: 'pension',
      amount: 12000,
      source: 'Социальный фонд КР',
      period: 'Январь 2025',
      recipientPin: '12345678901236',
      recipientFullName: 'Айгуль Абдуллаева',
      periodicity: 'M',
      isRegular: true
    },
    {
      id: 4,
      type: 'alimony',
      amount: 8000,
      source: 'Алименты на ребенка',
      period: 'Январь 2025',
      recipientPin: '12345678901234',
      recipientFullName: 'Айжан Абдуллаева',
      periodicity: 'M',
      isRegular: true
    }
  ],

  // II. Обучение (студенты, учащиеся)
  educationIncome: [
    {
      id: 1,
      familyMemberId: 3,
      institutionName: 'Кыргызский национальный университет',
      institutionType: 'UNIVERSITY',
      startDate: '2020-09-01',
      endDate: '2024-06-30',
      currentYear: 4,
      isFullTime: true,
      fundingSource: 'GOVERNMENT',
      scholarshipAmount: 3000,
      tuitionFeeYearly: 0,
      tuitionFeeMonthly: 0,
      additionalExpenses: 2000,
      isActive: true
    },
    {
      id: 2,
      familyMemberId: 4,
      institutionName: 'Кыргызский государственный университет строительства',
      institutionType: 'UNIVERSITY',
      startDate: '2022-09-01',
      endDate: '2026-06-30',
      currentYear: 2,
      isFullTime: true,
      fundingSource: 'PARENTS',
      scholarshipAmount: 0,
      tuitionFeeYearly: 60000,
      tuitionFeeMonthly: 5000,
      additionalExpenses: 1500,
      isActive: true
    }
  ],

  // III. Иные доходы семьи
  otherIncome: [
    {
      id: 1,
      type: 'family_help',
      amount: 5000,
      source: 'Помощь от родителей',
      period: 'Январь 2025',
      recipientPin: '12345678901234',
      recipientFullName: 'Айжан Абдуллаева',
      periodicity: 'M',
      isRegular: true
    },
    {
      id: 2,
      type: 'dividends',
      amount: 1200,
      source: 'Дивиденды по акциям',
      period: 'Январь 2025',
      recipientPin: '12345678901235',
      recipientFullName: 'Талант Абдуллаев',
      periodicity: 'M',
      isRegular: true
    },
    {
      id: 3,
      type: 'social_benefit',
      amount: 2000,
      source: 'Социальное пособие',
      period: 'Январь 2025',
      recipientPin: '12345678901234',
      recipientFullName: 'Айжан Абдуллаева',
      periodicity: 'M',
      isRegular: true
    },
    {
      id: 4,
      type: 'compensation',
      amount: 15000,
      source: 'Компенсация за ущерб',
      period: 'Январь 2025',
      recipientPin: '12345678901234',
      recipientFullName: 'Айжан Абдуллаева',
      periodicity: 'O',
      isRegular: false
    }
  ],

  // IV. Предпринимательство
  entrepreneurship: [
    {
      id: 1,
      businessType: 'INDIVIDUAL',
      businessName: 'ИП "Абдуллаева"',
      registrationNumber: 'ИП-123456',
      patentNumber: '',
      licenseNumber: 'ЛИЦ-789012',
      businessAddress: 'г. Бишкек, ул. Чуй 123',
      declaredIncome: 45000,
      normativeIncome: 50000,
      taxAmount: 4500,
      periodFrom: '2024-01-01',
      periodTo: '2024-12-31',
      isActive: true,
      ownerPin: '12345678901234',
      ownerFullName: 'Айжан Абдуллаева'
    },
    {
      id: 2,
      businessType: 'TRADE',
      businessName: 'Магазин "Продукты"',
      registrationNumber: '',
      patentNumber: 'ПАТ-456789',
      licenseNumber: '',
      businessAddress: 'г. Бишкек, ул. Московская 45',
      declaredIncome: 25000,
      normativeIncome: 30000,
      taxAmount: 2500,
      periodFrom: '2024-01-01',
      periodTo: '2024-12-31',
      isActive: true,
      ownerPin: '12345678901235',
      ownerFullName: 'Талант Абдуллаев'
    }
  ],

  // V. Земельные участки
  landPlots: [
    {
      id: 1,
      type: 'irrigated',
      area: 0.5,
      location: 'Чуйская область, с. Кант',
      ownershipType: 'OWNED',
      usage: 'Огород',
      normativeIncome: 15000,
      actualIncome: 12000,
      isActive: true,
      ownerPin: '12345678901234',
      ownerFullName: 'Айжан Абдуллаева'
    },
    {
      id: 2,
      type: 'rain_fed',
      area: 1.2,
      location: 'Чуйская область, с. Кант',
      ownershipType: 'RENTED',
      usage: 'Пастбище',
      normativeIncome: 8000,
      actualIncome: 6000,
      isActive: true,
      ownerPin: '12345678901235',
      ownerFullName: 'Талант Абдуллаев'
    }
  ],

  // VI. Подсобное хозяйство (животные, птица, пчёлы)
  livestock: {
    cows: 2,
    heifers: 1,
    bulls: 0,
    horses: 1,
    sheep: 5,
    goats: 3,
    pigs: 0,
    poultry: 15,
    other: 0,
    bees: 2,
    // Детальная информация
    details: [
      {
        id: 1,
        type: 'cow',
        count: 2,
        age: '3-5 лет',
        productivity: 'молочные',
        monthlyIncome: 8000,
        ownerPin: '12345678901234',
        ownerFullName: 'Айжан Абдуллаева'
      },
      {
        id: 2,
        type: 'sheep',
        count: 5,
        age: '1-3 года',
        productivity: 'мясные',
        monthlyIncome: 3000,
        ownerPin: '12345678901235',
        ownerFullName: 'Талант Абдуллаев'
      },
      {
        id: 3,
        type: 'poultry',
        count: 15,
        age: '6-12 месяцев',
        productivity: 'яичные',
        monthlyIncome: 2000,
        ownerPin: '12345678901234',
        ownerFullName: 'Айжан Абдуллаева'
      },
      {
        id: 4,
        type: 'bees',
        count: 2,
        age: '2-3 года',
        productivity: 'мед',
        monthlyIncome: 1500,
        ownerPin: '12345678901235',
        ownerFullName: 'Талант Абдуллаев'
      }
    ]
  },

  // VII. Банковские вклады и сбережения
  bankDeposits: [
    {
      id: 1,
      bankCode: 'DEMIR',
      depositType: 'SAVINGS',
      accountNumber: '1234567890123456',
      depositAmount: 500000,
      interestRate: 12,
      monthlyInterest: 5000,
      openingDate: '2023-01-15',
      maturityDate: '2025-01-15',
      isActive: true,
      ownerPin: '12345678901234',
      ownerFullName: 'Айжан Абдуллаева'
    },
    {
      id: 2,
      bankCode: 'OPTIMA',
      depositType: 'TERM',
      accountNumber: '9876543210987654',
      depositAmount: 300000,
      interestRate: 15,
      monthlyInterest: 3750,
      openingDate: '2024-06-01',
      maturityDate: '2025-06-01',
      isActive: true,
      ownerPin: '12345678901235',
      ownerFullName: 'Талант Абдуллаев'
    },
    {
      id: 3,
      bankCode: 'BAI_TUSHUM',
      depositType: 'CURRENT',
      accountNumber: '5555444433332222',
      depositAmount: 100000,
      interestRate: 8,
      monthlyInterest: 667,
      openingDate: '2024-03-10',
      maturityDate: null,
      isActive: true,
      ownerPin: '12345678901234',
      ownerFullName: 'Айжан Абдуллаева'
    }
  ],

  // VIII. Совокупный доход и расчет ССДС
  totalIncomeCalculation: {
    totalFamilyIncome: 125000,
    familyMembers: 4,
    childrenUnder16: 2,
    studentsUnder21: 1,
    perCapitaIncome: 31250,
    gmdThreshold: 6000,
    isEligible: false,
    benefitAmount: 0,
    regionalCoefficient: 1.0,
    borderBonus: 0,
    totalMonthlyBenefit: 0
  }
};
