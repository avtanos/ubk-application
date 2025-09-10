// Тестовые данные для заявок
export const testApplications = [
  {
    id: 1,
    applicationNumber: 'TU-2024-000001',
    status: 'DRAFT',
    submissionDate: '2024-01-15T10:30:00Z',
    submittedAt: null,
    reviewedAt: null,
    approvedAt: null,
    rejectedAt: null,
    language: 'ru',
    priority: 'NORMAL',
    riskScore: 25,
    inspectionRequired: false,
    isActive: true,
    applicantName: 'Иванов Иван Иванович',
    applicantPin: '12345678901234',
    applicantPhone: '+996 555 123 456',
    requestedAmount: 15000.00,
    approvedAmount: null,
    notes: 'Черновик заявки',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    applicant: {
      id: 1,
      pin: '12345678901234',
      fullName: 'Иванов Иван Иванович',
      gender: 'MALE',
      birthDate: '1985-03-15',
      citizenship: 'Кыргызская Республика',
      nationality: 'Кыргыз',
      education: 'Высшее',
      maritalStatus: 'MARRIED',
      documentType: 'passport',
      documentSeries: 'ID',
      documentNumber: '1234567',
      documentIssueDate: '2010-05-20',
      passportIssuingAuthority: 'МВД КР',
      documentExpiryDate: '2030-05-20',
      disabilityFlag: false,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    documents: [
      {
        id: 1,
        type: 'passport',
        series: 'ID',
        number: '1234567',
        issueDate: '2010-05-20',
        issuingAuthority: 'МВД КР',
        expiryDate: '2030-05-20',
        isPrimary: true
      }
    ],
    formData: {
      tuData: {
        additionalIdentities: [
          {
            type: 'military',
            series: 'AB',
            number: '123456',
            issuingAuthority: 'Военкомат',
            issueDate: '2010-06-01',
            expiryDate: '2025-06-01'
          }
        ],
        addresses: [
          {
            type: 'REG',
            regionCode: '01',
            raionCode: '001',
            localityCode: '0001',
            street: 'ул. Ленина',
            house: '15',
            flat: '25',
            postalCode: '720000',
            isPrimary: true
          },
          {
            type: 'FACT',
            regionCode: '01',
            raionCode: '001',
            localityCode: '0001',
            street: 'ул. Советская',
            house: '42',
            flat: '8',
            postalCode: '720000',
            isPrimary: false
          }
        ],
        contacts: [
          {
            type: 'mobile',
            value: '+996 555 123 456',
            isPrimary: true
          },
          {
            type: 'email',
            value: 'ivanov@example.com',
            isPrimary: false
          }
        ],
        socialAuthority: {
          municipalAuthority: 'Мэрия г. Бишкек',
          applicantType: 'adult',
          category: 'многодетная семья',
          disabilityCategory: null,
          msekRefNumber: null,
          msekIssueDate: null,
          dsuRefNumber: null,
          dsuIssueDate: null,
          authorityCode: '01',
          authorityName: 'Управление соцзащиты г. Бишкек',
          linkType: 'family_benefit'
        },
        specialCompensations: [
          {
            reason: 'Многодетная семья',
            type: 'monthly',
            amount: 5000.00,
            periodFrom: '2024-01-01',
            periodTo: '2024-12-31'
          }
        ]
      },
      familyMembers: [
        {
          type: 'adult',
          fullName: 'Иванова Мария Петровна',
          pin: '23456789012345',
          birthDate: '1987-08-20',
          gender: 'FEMALE',
          relation: 'spouse',
          citizenship: 'Кыргызская Республика',
          documentType: 'passport',
          documentNumber: '7654321',
          childCategory: null,
          birthCertificateNumber: null,
          birthCertificateIssueDate: null,
          birthCertificateIssuingAuthority: null,
          monthlyIncome: 25000.00,
          incomeSource: 'Зарплата',
          workplace: 'ООО "Компания"',
          position: 'Менеджер',
          disabilityFlag: false,
          disabilityCategory: null
        },
        {
          type: 'child',
          fullName: 'Иванов Петр Иванович',
          pin: '34567890123456',
          birthDate: '2010-12-05',
          gender: 'MALE',
          relation: 'child',
          citizenship: 'Кыргызская Республика',
          documentType: 'birth_certificate',
          documentNumber: 'BC123456',
          childCategory: 'до 7 лет',
          birthCertificateNumber: 'BC123456',
          birthCertificateIssueDate: '2010-12-10',
          birthCertificateIssuingAuthority: 'ЗАГС г. Бишкек',
          monthlyIncome: 0,
          incomeSource: null,
          workplace: null,
          position: null,
          disabilityFlag: false,
          disabilityCategory: null
        }
      ],
      incomes: [
        {
          type: 'SALARY',
          amount: 25000.00,
          source: 'ООО "Компания"',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        },
        {
          type: 'RENTAL',
          amount: 8000.00,
          source: 'Аренда квартиры',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        },
        {
          type: 'INVESTMENT',
          amount: 2000.00,
          source: 'Банковский депозит',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        }
      ],
      landPlots: [
        {
          typeCode: '01',
          areaHectare: 0.5,
          areaSotok: 5.0,
          areaSqm: 5000,
          measurementUnit: 'га',
          ownershipType: 'собственность',
          location: 'г. Бишкек, ул. Садовая',
          estimatedValue: 100000.00,
          isOwned: true
        }
      ],
      livestock: [
        {
          typeCode: '01',
          qty: 2,
          convUnits: 2.0,
          estimatedValue: 50000.00,
          isOwned: true
        }
      ],
      vehicles: [
        {
          typeCode: '01',
          makeModel: 'Toyota Camry',
          year: 2015,
          isLightCar: true,
          regNo: '01KG123ABC',
          estimatedValue: 800000.00,
          isOwned: true
        }
      ],
      paymentRequisites: {
        bankCode: '001',
        bankName: 'ОАО "Демир Банк"',
        personalAccount: '1234567890123456',
        bankAccount: '1234567890123456',
        cardAccount: '1234567890123456',
        paymentType: 'card'
      },
      categories: {
        forChild: true,
        forFamilyWithChild: true,
        forMinor: false,
        forIncapacitated: false
      }
    }
  },
  {
    id: 2,
    applicationNumber: 'TU-2024-000002',
    status: 'SUBMITTED',
    submissionDate: '2024-01-16T14:20:00Z',
    submittedAt: '2024-01-16T14:20:00Z',
    reviewedAt: null,
    approvedAt: null,
    rejectedAt: null,
    language: 'ru',
    priority: 'HIGH',
    riskScore: 45,
    inspectionRequired: true,
    isActive: true,
    applicantName: 'Петрова Анна Сергеевна',
    applicantPin: '23456789012345',
    applicantPhone: '+996 555 234 567',
    requestedAmount: 25000.00,
    approvedAmount: null,
    notes: 'Заявка подана, ожидает рассмотрения',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    applicant: {
      id: 2,
      pin: '23456789012345',
      fullName: 'Петрова Анна Сергеевна',
      gender: 'FEMALE',
      birthDate: '1990-07-22',
      citizenship: 'Кыргызская Республика',
      nationality: 'Русская',
      education: 'Среднее специальное',
      maritalStatus: 'SINGLE',
      documentType: 'passport',
      documentSeries: 'ID',
      documentNumber: '2345678',
      documentIssueDate: '2015-03-10',
      passportIssuingAuthority: 'МВД КР',
      documentExpiryDate: '2035-03-10',
      disabilityFlag: false,
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-16T14:20:00Z'
    },
    documents: [
      {
        id: 2,
        type: 'passport',
        series: 'ID',
        number: '2345678',
        issueDate: '2015-03-10',
        issuingAuthority: 'МВД КР',
        expiryDate: '2035-03-10',
        isPrimary: true
      }
    ],
    formData: {
      tuData: {
        additionalIdentities: [
          {
            type: 'student',
            series: 'ST',
            number: 'ST123456',
            issuingAuthority: 'КГУ им. Ж. Баласагына',
            issueDate: '2023-09-01',
            expiryDate: '2027-06-30'
          }
        ],
        addresses: [
          {
            type: 'REG',
            regionCode: '02',
            raionCode: '002',
            localityCode: '0002',
            street: 'ул. Пушкина',
            house: '33',
            flat: '12',
            postalCode: '720100',
            isPrimary: true
          },
          {
            type: 'FACT',
            regionCode: '02',
            raionCode: '002',
            localityCode: '0002',
            street: 'ул. Ленина',
            house: '45',
            flat: '8',
            postalCode: '720100',
            isPrimary: false
          }
        ],
        contacts: [
          {
            type: 'mobile',
            value: '+996 555 234 567',
            isPrimary: true
          },
          {
            type: 'email',
            value: 'petrova@example.com',
            isPrimary: false
          },
          {
            type: 'home',
            value: '+996 322 123 456',
            isPrimary: false
          }
        ],
        socialAuthority: {
          municipalAuthority: 'Мэрия г. Ош',
          applicantType: 'adult',
          category: 'малоимущая семья',
          disabilityCategory: null,
          msekRefNumber: null,
          msekIssueDate: null,
          dsuRefNumber: null,
          dsuIssueDate: null,
          authorityCode: '02',
          authorityName: 'Управление соцзащиты г. Ош',
          linkType: 'low_income_benefit'
        },
        specialCompensations: []
      },
      familyMembers: [],
      incomes: [
        {
          type: 'PENSION',
          amount: 8000.00,
          source: 'Пенсионный фонд',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        },
        {
          type: 'BENEFIT',
          amount: 2000.00,
          source: 'Соцзащита',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        }
      ],
      landPlots: [],
      livestock: [],
      vehicles: [],
      paymentRequisites: {
        bankCode: '002',
        bankName: 'ОАО "Айыл Банк"',
        personalAccount: '2345678901234567',
        bankAccount: '2345678901234567',
        cardAccount: '2345678901234567',
        paymentType: 'bank_account'
      },
      categories: {
        forChild: false,
        forFamilyWithChild: false,
        forMinor: false,
        forIncapacitated: false
      }
    }
  },
  {
    id: 3,
    applicationNumber: 'TU-2024-000003',
    status: 'UNDER_REVIEW',
    submissionDate: '2024-01-17T09:15:00Z',
    submittedAt: '2024-01-17T09:15:00Z',
    reviewedAt: '2024-01-17T11:30:00Z',
    approvedAt: null,
    rejectedAt: null,
    language: 'ky',
    priority: 'NORMAL',
    riskScore: 30,
    inspectionRequired: false,
    isActive: true,
    applicantName: 'Сидоров Айбек Токтогулович',
    applicantPin: '34567890123456',
    applicantPhone: '+996 555 345 678',
    requestedAmount: 18000.00,
    approvedAmount: null,
    notes: 'Заявка на рассмотрении у специалиста',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T11:30:00Z',
    applicant: {
      id: 3,
      pin: '34567890123456',
      fullName: 'Сидоров Айбек Токтогулович',
      gender: 'MALE',
      birthDate: '1978-11-08',
      citizenship: 'Кыргызская Республика',
      nationality: 'Кыргыз',
      education: 'Высшее',
      maritalStatus: 'MARRIED',
      documentType: 'passport',
      documentSeries: 'ID',
      documentNumber: '3456789',
      documentIssueDate: '2018-09-15',
      passportIssuingAuthority: 'МВД КР',
      documentExpiryDate: '2028-09-15',
      disabilityFlag: false,
      createdAt: '2024-01-17T09:15:00Z',
      updatedAt: '2024-01-17T11:30:00Z'
    },
    documents: [
      {
        id: 3,
        type: 'passport',
        series: 'ID',
        number: '3456789',
        issueDate: '2018-09-15',
        issuingAuthority: 'МВД КР',
        expiryDate: '2028-09-15',
        isPrimary: true
      }
    ],
    formData: {
      tuData: {
        additionalIdentities: [],
        addresses: [
          {
            type: 'REG',
            regionCode: '03',
            raionCode: '003',
            localityCode: '0003',
            street: 'ул. Манаса',
            house: '77',
            flat: '15',
            postalCode: '720200',
            isPrimary: true
          }
        ],
        contacts: [
          {
            type: 'mobile',
            value: '+996 555 345 678',
            isPrimary: true
          },
          {
            type: 'home',
            value: '+996 312 123 456',
            isPrimary: false
          }
        ],
        socialAuthority: {
          municipalAuthority: 'Мэрия г. Джалал-Абад',
          applicantType: 'adult',
          category: 'семья с инвалидом',
          disabilityCategory: '3 группа',
          msekRefNumber: 'MSEK-2024-001',
          msekIssueDate: '2024-01-10',
          dsuRefNumber: 'DSU-2024-001',
          dsuIssueDate: '2024-01-12',
          authorityCode: '03',
          authorityName: 'Управление соцзащиты г. Джалал-Абад',
          linkType: 'benefit_recipient'
        },
        specialCompensations: [
          {
            reason: 'Инвалидность 3 группы',
            type: 'monthly',
            amount: 3000.00,
            periodFrom: '2024-01-01',
            periodTo: '2024-12-31'
          }
        ]
      },
      familyMembers: [
        {
          type: 'adult',
          fullName: 'Сидорова Гульнара Асановна',
          pin: '45678901234567',
          birthDate: '1982-04-12',
          gender: 'FEMALE',
          relation: 'spouse',
          citizenship: 'Кыргызская Республика',
          documentType: 'passport',
          documentNumber: '4567890',
          childCategory: null,
          birthCertificateNumber: null,
          birthCertificateIssueDate: null,
          birthCertificateIssuingAuthority: null,
          monthlyIncome: 15000.00,
          incomeSource: 'Зарплата',
          workplace: 'Школа №5',
          position: 'Учитель',
          disabilityFlag: false,
          disabilityCategory: null
        },
        {
          type: 'child',
          fullName: 'Сидоров Айдар Айбекович',
          pin: '56789012345678',
          birthDate: '2015-06-18',
          gender: 'MALE',
          relation: 'child',
          citizenship: 'Кыргызская Республика',
          documentType: 'birth_certificate',
          documentNumber: 'BC789012',
          childCategory: 'до 7 лет',
          birthCertificateNumber: 'BC789012',
          birthCertificateIssueDate: '2015-06-25',
          birthCertificateIssuingAuthority: 'ЗАГС г. Джалал-Абад',
          monthlyIncome: 0,
          incomeSource: null,
          workplace: null,
          position: null,
          disabilityFlag: false,
          disabilityCategory: null
        }
      ],
      incomes: [
        {
          type: 'SALARY',
          amount: 15000.00,
          source: 'Школа №5',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        },
        {
          type: 'BENEFIT',
          amount: 3000.00,
          source: 'Соцзащита',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        },
        {
          type: 'AGRICULTURE',
          amount: 12000.00,
          source: 'Продажа скота',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        },
        {
          type: 'FARMING',
          amount: 5000.00,
          source: 'Продажа сельхозпродукции',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        }
      ],
      landPlots: [
        {
          typeCode: '02',
          areaHectare: 1.2,
          areaSotok: 12.0,
          areaSqm: 12000,
          measurementUnit: 'га',
          ownershipType: 'аренда',
          location: 'Джалал-Абадская область',
          estimatedValue: 80000.00,
          isOwned: false
        }
      ],
      livestock: [
        {
          typeCode: '02',
          qty: 5,
          convUnits: 5.0,
          estimatedValue: 75000.00,
          isOwned: true
        },
        {
          typeCode: '03',
          qty: 10,
          convUnits: 2.0,
          estimatedValue: 20000.00,
          isOwned: true
        }
      ],
      vehicles: [],
      paymentRequisites: {
        bankCode: '003',
        bankName: 'ОАО "Кыргызстан"',
        personalAccount: '3456789012345678',
        bankAccount: '3456789012345678',
        cardAccount: '3456789012345678',
        paymentType: 'personal_account'
      },
      categories: {
        forChild: true,
        forFamilyWithChild: true,
        forMinor: false,
        forIncapacitated: false
      }
    }
  },
  {
    id: 4,
    applicationNumber: 'TU-2024-000004',
    status: 'APPROVED',
    submissionDate: '2024-01-18T16:45:00Z',
    submittedAt: '2024-01-18T16:45:00Z',
    reviewedAt: '2024-01-19T10:20:00Z',
    approvedAt: '2024-01-19T14:30:00Z',
    rejectedAt: null,
    language: 'ru',
    priority: 'LOW',
    riskScore: 15,
    inspectionRequired: false,
    isActive: true,
    applicantName: 'Козлова Елена Владимировна',
    applicantPin: '45678901234567',
    applicantPhone: '+996 555 456 789',
    requestedAmount: 12000.00,
    approvedAmount: 12000.00,
    notes: 'Заявка одобрена, выплата назначена',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-19T14:30:00Z',
    applicant: {
      id: 4,
      pin: '45678901234567',
      fullName: 'Козлова Елена Владимировна',
      gender: 'FEMALE',
      birthDate: '1992-12-03',
      citizenship: 'Кыргызская Республика',
      nationality: 'Русская',
      education: 'Высшее',
      maritalStatus: 'DIVORCED',
      documentType: 'passport',
      documentSeries: 'ID',
      documentNumber: '5678901',
      documentIssueDate: '2020-01-15',
      passportIssuingAuthority: 'МВД КР',
      documentExpiryDate: '2030-01-15',
      disabilityFlag: false,
      createdAt: '2024-01-18T16:45:00Z',
      updatedAt: '2024-01-19T14:30:00Z'
    },
    documents: [
      {
        id: 4,
        type: 'passport',
        series: 'ID',
        number: '5678901',
        issueDate: '2020-01-15',
        issuingAuthority: 'МВД КР',
        expiryDate: '2030-01-15',
        isPrimary: true
      }
    ],
    formData: {
      tuData: {
        additionalIdentities: [
          {
            type: 'driver_license',
            series: 'DL',
            number: 'DL789012',
            issuingAuthority: 'ГАИ МВД КР',
            issueDate: '2018-03-15',
            expiryDate: '2028-03-15'
          }
        ],
        addresses: [
          {
            type: 'REG',
            regionCode: '01',
            raionCode: '001',
            localityCode: '0001',
            street: 'ул. Чуй',
            house: '88',
            flat: '33',
            postalCode: '720000',
            isPrimary: true
          },
          {
            type: 'FACT',
            regionCode: '01',
            raionCode: '001',
            localityCode: '0001',
            street: 'ул. Московская',
            house: '12',
            flat: '15',
            postalCode: '720000',
            isPrimary: false
          }
        ],
        contacts: [
          {
            type: 'mobile',
            value: '+996 555 456 789',
            isPrimary: true
          },
          {
            type: 'email',
            value: 'kozlova@example.com',
            isPrimary: false
          }
        ],
        socialAuthority: {
          municipalAuthority: 'Мэрия г. Бишкек',
          applicantType: 'adult',
          category: 'мать-одиночка',
          disabilityCategory: null,
          msekRefNumber: null,
          msekIssueDate: null,
          dsuRefNumber: null,
          dsuIssueDate: null,
          authorityCode: '01',
          authorityName: 'Управление соцзащиты г. Бишкек',
          linkType: 'single_mother_benefit'
        },
        specialCompensations: []
      },
      familyMembers: [
        {
          type: 'child',
          fullName: 'Козлов Дмитрий Еленович',
          pin: '67890123456789',
          birthDate: '2018-03-25',
          gender: 'MALE',
          relation: 'child',
          citizenship: 'Кыргызская Республика',
          documentType: 'birth_certificate',
          documentNumber: 'BC345678',
          childCategory: 'до 7 лет',
          birthCertificateNumber: 'BC345678',
          birthCertificateIssueDate: '2018-04-02',
          birthCertificateIssuingAuthority: 'ЗАГС г. Бишкек',
          monthlyIncome: 0,
          incomeSource: null,
          workplace: null,
          position: null,
          disabilityFlag: false,
          disabilityCategory: null
        }
      ],
      incomes: [
        {
          type: 'SALARY',
          amount: 20000.00,
          source: 'ООО "Торговый дом"',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        },
        {
          type: 'BUSINESS',
          amount: 15000.00,
          source: 'ИП "Козлова Е.В."',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        },
        {
          type: 'RENTAL',
          amount: 5000.00,
          source: 'Аренда гаража',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        }
      ],
      landPlots: [],
      livestock: [],
      vehicles: [
        {
          typeCode: '02',
          makeModel: 'Lada Vesta',
          year: 2019,
          isLightCar: true,
          regNo: '01KG456DEF',
          estimatedValue: 600000.00,
          isOwned: true
        }
      ],
      paymentRequisites: {
        bankCode: '001',
        bankName: 'ОАО "Демир Банк"',
        personalAccount: '4567890123456789',
        bankAccount: '4567890123456789',
        cardAccount: '4567890123456789',
        paymentType: 'card'
      },
      categories: {
        forChild: true,
        forFamilyWithChild: true,
        forMinor: false,
        forIncapacitated: false
      }
    }
  },
  {
    id: 5,
    applicationNumber: 'TU-2024-000005',
    status: 'REJECTED',
    submissionDate: '2024-01-19T11:20:00Z',
    submittedAt: '2024-01-19T11:20:00Z',
    reviewedAt: '2024-01-19T15:45:00Z',
    approvedAt: null,
    rejectedAt: '2024-01-20T09:15:00Z',
    language: 'ru',
    priority: 'NORMAL',
    riskScore: 75,
    inspectionRequired: true,
    isActive: true,
    applicantName: 'Нурматов Бакыт Нурматович',
    applicantPin: '56789012345678',
    applicantPhone: '+996 555 567 890',
    requestedAmount: 30000.00,
    approvedAmount: null,
    notes: 'Заявка отклонена: недостаточно документов',
    createdAt: '2024-01-19T11:20:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    applicant: {
      id: 5,
      pin: '56789012345678',
      fullName: 'Нурматов Бакыт Нурматович',
      gender: 'MALE',
      birthDate: '1980-05-14',
      citizenship: 'Кыргызская Республика',
      nationality: 'Кыргыз',
      education: 'Среднее',
      maritalStatus: 'MARRIED',
      documentType: 'passport',
      documentSeries: 'ID',
      documentNumber: '6789012',
      documentIssueDate: '2015-08-22',
      passportIssuingAuthority: 'МВД КР',
      documentExpiryDate: '2025-08-22',
      disabilityFlag: false,
      createdAt: '2024-01-19T11:20:00Z',
      updatedAt: '2024-01-20T09:15:00Z'
    },
    documents: [
      {
        id: 5,
        type: 'passport',
        series: 'ID',
        number: '6789012',
        issueDate: '2015-08-22',
        issuingAuthority: 'МВД КР',
        expiryDate: '2025-08-22',
        isPrimary: true
      }
    ],
    formData: {
      tuData: {
        additionalIdentities: [
          {
            type: 'tax_id',
            series: 'TI',
            number: 'TI345678',
            issuingAuthority: 'Налоговая служба КР',
            issueDate: '2015-01-10',
            expiryDate: null
          }
        ],
        addresses: [
          {
            type: 'REG',
            regionCode: '04',
            raionCode: '004',
            localityCode: '0004',
            street: 'ул. Абая',
            house: '99',
            flat: '7',
            postalCode: '720300',
            isPrimary: true
          }
        ],
        contacts: [
          {
            type: 'mobile',
            value: '+996 555 567 890',
            isPrimary: true
          },
          {
            type: 'home',
            value: '+996 392 234 567',
            isPrimary: false
          },
          {
            type: 'other',
            value: 'nurmatov@example.com',
            isPrimary: false
          }
        ],
        socialAuthority: {
          municipalAuthority: 'Мэрия г. Каракол',
          applicantType: 'adult',
          category: 'безработный',
          disabilityCategory: null,
          msekRefNumber: null,
          msekIssueDate: null,
          dsuRefNumber: null,
          dsuIssueDate: null,
          authorityCode: '04',
          authorityName: 'Управление соцзащиты г. Каракол',
          linkType: 'unemployment_benefit'
        },
        specialCompensations: []
      },
      familyMembers: [
        {
          type: 'adult',
          fullName: 'Нурматова Айгуль Сапарбековна',
          pin: '78901234567890',
          birthDate: '1983-09-30',
          gender: 'FEMALE',
          relation: 'spouse',
          citizenship: 'Кыргызская Республика',
          documentType: 'passport',
          documentNumber: '7890123',
          childCategory: null,
          birthCertificateNumber: null,
          birthCertificateIssueDate: null,
          birthCertificateIssuingAuthority: null,
          monthlyIncome: 0,
          incomeSource: null,
          workplace: null,
          position: null,
          disabilityFlag: false,
          disabilityCategory: null
        }
      ],
      incomes: [
        {
          type: 'UNEMPLOYMENT_BENEFIT',
          amount: 5000.00,
          source: 'Центр занятости',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        }
      ],
      landPlots: [
        {
          typeCode: '03',
          areaHectare: 2.5,
          areaSotok: 25.0,
          areaSqm: 25000,
          measurementUnit: 'га',
          ownershipType: 'собственность',
          location: 'Иссык-Кульская область',
          estimatedValue: 200000.00,
          isOwned: true
        }
      ],
      livestock: [
        {
          typeCode: '01',
          qty: 8,
          convUnits: 8.0,
          estimatedValue: 100000.00,
          isOwned: true
        }
      ],
      vehicles: [
        {
          typeCode: '03',
          makeModel: 'ГАЗ-53',
          year: 1995,
          isLightCar: false,
          regNo: '04KG789GHI',
          estimatedValue: 150000.00,
          isOwned: true
        }
      ],
      paymentRequisites: {
        bankCode: '004',
        bankName: 'ОАО "РСК Банк"',
        personalAccount: '5678901234567890',
        bankAccount: '5678901234567890',
        cardAccount: '5678901234567890',
        paymentType: 'bank_account'
      },
      categories: {
        forChild: false,
        forFamilyWithChild: false,
        forMinor: false,
        forIncapacitated: false
      }
    }
  },
  {
    id: 6,
    applicationNumber: 'TU-2024-000006',
    status: 'PENDING',
    submissionDate: '2024-01-20T13:10:00Z',
    submittedAt: '2024-01-20T13:10:00Z',
    reviewedAt: '2024-01-20T16:30:00Z',
    approvedAt: null,
    rejectedAt: null,
    language: 'ky',
    priority: 'URGENT',
    riskScore: 60,
    inspectionRequired: true,
    isActive: true,
    applicantName: 'Абдыкадырова Гульмира Абдыкадыровна',
    applicantPin: '67890123456789',
    applicantPhone: '+996 555 678 901',
    requestedAmount: 35000.00,
    approvedAmount: null,
    notes: 'Заявка в ожидании дополнительных документов',
    createdAt: '2024-01-20T13:10:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
    applicant: {
      id: 6,
      pin: '67890123456789',
      fullName: 'Абдыкадырова Гульмира Абдыкадыровна',
      gender: 'FEMALE',
      birthDate: '1975-01-28',
      citizenship: 'Кыргызская Республика',
      nationality: 'Кыргызка',
      education: 'Среднее специальное',
      maritalStatus: 'WIDOWED',
      documentType: 'passport',
      documentSeries: 'ID',
      documentNumber: '8901234',
      documentIssueDate: '2012-11-05',
      passportIssuingAuthority: 'МВД КР',
      documentExpiryDate: '2022-11-05',
      disabilityFlag: true,
      createdAt: '2024-01-20T13:10:00Z',
      updatedAt: '2024-01-20T16:30:00Z'
    },
    documents: [
      {
        id: 6,
        type: 'passport',
        series: 'ID',
        number: '8901234',
        issueDate: '2012-11-05',
        issuingAuthority: 'МВД КР',
        expiryDate: '2022-11-05',
        isPrimary: true
      },
      {
        id: 7,
        type: 'disability_certificate',
        series: 'DIS',
        number: 'DIS-2024-001',
        issueDate: '2024-01-05',
        issuingAuthority: 'МСЭК г. Талас',
        expiryDate: '2025-01-05',
        isPrimary: false
      }
    ],
    formData: {
      tuData: {
        additionalIdentities: [
          {
            type: 'pension_certificate',
            series: 'PC',
            number: 'PC456789',
            issuingAuthority: 'Пенсионный фонд КР',
            issueDate: '2020-01-01',
            expiryDate: null
          }
        ],
        addresses: [
          {
            type: 'REG',
            regionCode: '05',
            raionCode: '005',
            localityCode: '0005',
            street: 'ул. Токтогула',
            house: '55',
            flat: '18',
            postalCode: '720400',
            isPrimary: true
          }
        ],
        contacts: [
          {
            type: 'mobile',
            value: '+996 555 678 901',
            isPrimary: true
          },
          {
            type: 'home',
            value: '+996 312 234 567',
            isPrimary: false
          }
        ],
        socialAuthority: {
          municipalAuthority: 'Мэрия г. Талас',
          applicantType: 'adult',
          category: 'инвалид 2 группы',
          disabilityCategory: '2 группа',
          msekRefNumber: 'MSEK-2024-002',
          msekIssueDate: '2024-01-05',
          dsuRefNumber: 'DSU-2024-002',
          dsuIssueDate: '2024-01-08',
          authorityCode: '05',
          authorityName: 'Управление соцзащиты г. Талас',
          linkType: 'disability_benefit'
        },
        specialCompensations: [
          {
            reason: 'Инвалидность 2 группы',
            type: 'monthly',
            amount: 8000.00,
            periodFrom: '2024-01-01',
            periodTo: '2024-12-31'
          },
          {
            reason: 'Вдова',
            type: 'monthly',
            amount: 2000.00,
            periodFrom: '2024-01-01',
            periodTo: '2024-12-31'
          }
        ]
      },
      familyMembers: [
        {
          type: 'child',
          fullName: 'Абдыкадыров Айдар Абдыкадырович',
          pin: '89012345678901',
          birthDate: '2012-08-15',
          gender: 'MALE',
          relation: 'child',
          citizenship: 'Кыргызская Республика',
          documentType: 'birth_certificate',
          documentNumber: 'BC456789',
          childCategory: '7-18 лет',
          birthCertificateNumber: 'BC456789',
          birthCertificateIssueDate: '2012-08-22',
          birthCertificateIssuingAuthority: 'ЗАГС г. Талас',
          monthlyIncome: 0,
          incomeSource: null,
          workplace: null,
          position: null,
          disabilityFlag: false,
          disabilityCategory: null
        }
      ],
      incomes: [
        {
          type: 'PENSION',
          amount: 12000.00,
          source: 'Пенсионный фонд',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        },
        {
          type: 'BENEFIT',
          amount: 8000.00,
          source: 'Соцзащита',
          period: '2024-01',
          periodicity: 'M',
          periodFrom: '2024-01-01',
          periodTo: '2024-01-31'
        }
      ],
      landPlots: [
        {
          typeCode: '01',
          areaHectare: 0.8,
          areaSotok: 8.0,
          areaSqm: 8000,
          measurementUnit: 'га',
          ownershipType: 'собственность',
          location: 'Таласская область',
          estimatedValue: 120000.00,
          isOwned: true
        }
      ],
      livestock: [
        {
          typeCode: '02',
          qty: 3,
          convUnits: 3.0,
          estimatedValue: 45000.00,
          isOwned: true
        }
      ],
      vehicles: [],
      paymentRequisites: {
        bankCode: '005',
        bankName: 'ОАО "Айыл Банк"',
        personalAccount: '6789012345678901',
        bankAccount: '6789012345678901',
        cardAccount: '6789012345678901',
        paymentType: 'personal_account'
      },
      categories: {
        forChild: true,
        forFamilyWithChild: true,
        forMinor: false,
        forIncapacitated: true
      }
    }
  }
];

// Функция для загрузки тестовых данных в localStorage
export const loadTestApplications = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('applications', JSON.stringify(testApplications));
    console.log('Тестовые заявки загружены в localStorage');
  }
};

// Функция для очистки тестовых данных
export const clearTestApplications = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('applications');
    console.log('Тестовые заявки удалены из localStorage');
  }
};
