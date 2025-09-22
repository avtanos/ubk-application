// Типы данных для внешних сервисов интеграции

// 1. Данные МСЭК (Медико-социальная экспертная комиссия)
export interface MSEKData {
  organizationName: string;        // Наименование организации
  examinationDate: string;         // Дата освидетельствования
  examinationType: string;         // Вид освидетельствования
  disabilityGroup: string;         // Группа инвалидности
  timeOfDisability: string;        // Дата установления инвалидности
  from: string;                    // Период с (начало действия)
  to: string;                      // Период по (окончание действия)
  reExamination: boolean;          // Повторное освидетельствование
  statusCode: string;              // Код статуса
}

// 2. Данные из ГРС: Паспортная база
export interface GRSPassportData {
  pin: string;                     // Персональный идентификационный номер (ПИН)
  surname: string;                 // Фамилия
  name: string;                    // Имя
  patronymic: string;              // Отчество
  nationality: string;             // Национальность
  dateOfBirth: string;             // Дата рождения
  passportSeries: string;          // Серия паспорта
  passportNumber: string;          // Номер паспорта
  voidStatus: string;              // Статус недействительности
  issuedDate: string;              // Дата выдачи
  expiredDate: string;             // Дата окончания срока действия
  passportAuthority: string;       // Орган, выдавший паспорт
  familyStatus: string;            // Семейное положение
  addressRegion: string;           // Область / регион проживания
  addressLocality: string;         // Населённый пункт
  addressStreet: string;           // Улица
  addressHouse: string;            // Дом
  addressBuilding: string;         // Корпус / строение
  addressApartment: string;        // Квартира
  faultcode?: string;              // Код ошибки
  faultstring?: string;            // Сообщение об ошибке
}

// 3. Данные из ГРС: ЗАГС база
export interface GRSCivilRegistryData {
  pin: string;                     // Персональный идентификационный номер (ПИН)
  surname: string;                 // Фамилия
  name: string;                    // Имя
  patronymic: string;              // Отчество
  maritalStatus: string;           // Семейное положение (текстовое значение)
  maritalStatusId: string;         // Код семейного положения
  nationality: string;             // Национальность (текстовое значение)
  nationalityId: string;           // Код национальности
  citizenship: string;             // Гражданство (текстовое значение)
  citizenshipId: string;           // Код гражданства
  pinBlocked: boolean;             // Статус блокировки ПИН
  pinGenerationDate: string;       // Дата генерации ПИН
  dateOfBirth: string;             // Дата рождения
  deathDate?: string;              // Дата смерти
  faultcode?: string;              // Код ошибки
  faultstring?: string;            // Сообщение об ошибке
}

// 4. Данные из ГРС: Адрес фактического проживания
export interface GRSAddressData {
  pin: string;                     // Персональный идентификационный номер (ПИН)
  state: string;                   // Область
  stateId: string;                 // Идентификатор области
  region: string;                  // Район
  regionId: string;                // Идентификатор района
  district: string;                // Айыл аймак / административный округ
  districtId: string;              // Идентификатор айыл аймака
  city: string;                    // Населённый пункт, село/город
  cityId: string;                  // Идентификатор населённого пункта
  street: string;                  // Улица
  streetId: string;                // Идентификатор улицы
  house: string;                   // Номер дома
  flat: string;                    // Номер квартиры
}

// 5. Данные из ГРС: Сведения о транспортном средстве
export interface GRSVehicleData {
  govPlate: string;                // Госномер
  carTypeName: string;             // Классификация типа (легковой автомобиль, автобус)
  bodyType: string;                // Тип кузова (седан, внедорожник)
  vehicleBrand: string;            // Марка
  vehicleModel: string;            // Модель
  steering: string;                // Расположение руля (левый/правый)
  vehicleYear: number;             // Год выпуска
  color: string;                   // Цвет
  bodyNo: string;                  // Номер кузова
  vin: string;                     // Идентификационный номер (VIN)
  engineVolume: number;            // Объем двигателя (см³)
  dateFrom: string;                // Дата регистрации
}

// 6. Данные из ИСРТ: Статус занятости
export interface ISRTEmploymentData {
  regStatus: number;               // -1 = Отсутствует регистрация, 0 = Есть регистрация но нет статуса, 1 = Официальный безработный
  registrationDate: string;        // Дата первичной регистрации
  deRegistrationDate: string;      // Дата перерегистрации
  statusDate: string;              // Дата получения статуса безработного
  departmentName: string;          // Наименование органа занятости
  eligibleForBenefits: boolean;    // Право на пособие по безработице
}

// 7. Данные из СФ: Наличие пенсии
export interface SFPensionData {
  isSuccess: boolean;              // Успешность выполнения запроса
  errorMessage?: string;           // Сообщение об ошибке
  pinInfo: {
    state: string;                 // Статус записи
    pin: string;                   // ПИН
    lastName: string;              // Фамилия
    firstName: string;             // Имя
    fullName: string;              // Полное имя
    issuer: string;                // Орган, выдавший данные
  };
  dossierInfo: Array<{
    rusf: string;                  // Код регионального отделения ПФ
    numDossier: string;            // Номер досье
    pinPensioner: string;          // ПИН пенсионера
    pinRecipient: string;          // ПИН получателя
    dateFromInitial: string;       // Дата начала
    dateTo: string;                // Дата окончания
    sum: number;                   // Размер пенсии
    kindOfPension: string;         // Вид пенсии
    categoryPension: string;       // Категория пенсии
    pin1: string;                  // Дополнительный ПИН 1 (кормильца)
    pin2: string;                  // Дополнительный ПИН 2 (кормильца)
  }>;
}

// 8. Данные из СФ: Информация о периодах работы
export interface SFWorkPeriodsData {
  isSuccess: boolean;
  errorMessage?: string;
  workPeriods: Array<{
    organizationName: string;      // Наименование организации
    periodFrom: string;            // Период с
    periodTo: string;              // Период по
    position: string;              // Должность
    salary: number;                // Заработная плата
    contributionAmount: number;    // Сумма взносов
  }>;
}

// 9. Ветеринария: Информация о КРС и МРС
export interface VeterinaryData {
  animals: Array<{
    type: number;                  // 1=КРС, 2=Лошади, 3=МРС, 4=Свиньи, 5=Птица, 6=Пчелы
    gender: string;                // t=самец, f=самка
    age: number;                   // Возраст (десятичное число)
  }>;
}

// 10. Данные из ГНС: Информация о наличии патента
export interface GNSPatentData {
  pin: string;                     // ПИН
  fullName: string;                // Полное имя
  gkedCode: string;                // Код по ГКЭД
  dateFrom: string;                // Дата начала действия патента
  dateTo: string;                  // Дата окончания действия патента
  status: string;                  // Статус патента
}

// 11. Данные из ГНС: ИП
export interface GNSIndividualEntrepreneurData {
  tin: string;                     // ИНН налогоплательщика
  lastName: string;                // Отчество
  firstName: string;               // Имя
  middleName: string;              // Фамилия
  rayonCode: string;               // ИНН района
  registrationDate: string;        // Дата регистрации
  legalFormCode: string;           // Организационно-правовая форма
  rayonName: string;               // Название района
}

// 12. Данные Кадастра: Наличие недвижимости
export interface CadastreData {
  pin: string;                     // ПИН
  properties: Array<{
    type: string;                  // Тип недвижимости
    address: string;               // Адрес
    area: number;                  // Площадь
    value: number;                 // Стоимость
    ownershipType: string;         // Тип собственности
  }>;
}

// 13-15. Данные с ГКДО: ВОВ, ЧАЭС, Афганцы
export interface GKDOVeteranData {
  pin: string;                     // ПИН
  veteranType: 'VOV' | 'CHERNOBYL' | 'AFGHAN'; // Тип ветерана
  status: string;                  // Статус
  benefits: Array<{
    type: string;                  // Тип льготы
    amount: number;                // Размер льготы
    periodFrom: string;            // Период с
    periodTo: string;              // Период по
  }>;
}

// 16. Данные из КИССП: Список доступных услуг
export interface KISSPAvailableServices {
  services: Array<{
    id: string;                    // ID сервиса
    name: string;                  // Название сервиса
    description: string;           // Описание
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    url: string;                   // URL сервиса
  }>;
}

// Общий интерфейс для ответов внешних сервисов
export interface ExternalServiceResponse<T> {
  isSuccess: boolean;
  errorMessage?: string;
  data?: T;
  statusCode?: number;
  timestamp: string;
}

// Конфигурация внешних сервисов
export interface ExternalServiceConfig {
  id: string;
  name: string;
  provider: string;
  baseUrl: string;
  apiKey?: string;
  timeout: number;
  retryAttempts: number;
  isActive: boolean;
}

// Список всех внешних сервисов
export const EXTERNAL_SERVICES: ExternalServiceConfig[] = [
  {
    id: 'msek',
    name: 'МСЭК',
    provider: 'Министерство труда, социального обеспечения и миграции КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/117',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'grs_passport',
    name: 'ГРС: Паспортная база',
    provider: 'ГАГС и МС при КМ КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/74',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'grs_civil_registry',
    name: 'ГРС: ЗАГС база',
    provider: 'ГАГС и МС при КМ КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/92',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'grs_address',
    name: 'ГРС: Адрес фактического проживания',
    provider: 'ГАГС и МС при КМ КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/2267',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'grs_vehicle',
    name: 'ГРС: Транспортные средства',
    provider: 'ГАГС и МС при КМ КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/41',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'isrt_employment',
    name: 'ИСРТ: Статус занятости',
    provider: 'МТСОиМ КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/120',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'sf_pension',
    name: 'СФ: Наличие пенсии',
    provider: 'Социальный Фонд КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/240',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'sf_work_periods',
    name: 'СФ: Периоды работы',
    provider: 'Социальный Фонд КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/241',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'veterinary',
    name: 'Ветеринария: КРС и МРС',
    provider: 'МВСХиПП КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/23',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'gns_patent',
    name: 'ГНС: Патенты',
    provider: 'ГНС при КМ КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/283',
    timeout: 10000,
    retryAttempts: 3,
    isActive: false // Отключен, нужно попросить включить
  },
  {
    id: 'gns_individual_entrepreneur',
    name: 'ГНС: ИП',
    provider: 'ГНС при КМ КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/237973',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'cadastre',
    name: 'Кадастр: Недвижимость',
    provider: 'ГАЗРКиГ при КМ КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/335918',
    timeout: 10000,
    retryAttempts: 3,
    isActive: false // Ждем документацию
  },
  {
    id: 'gkdo_vov',
    name: 'ГКДО: ВОВ',
    provider: 'ГКДО КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/533',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'gkdo_chernobyl',
    name: 'ГКДО: ЧАЭС',
    provider: 'ГКДО КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/534',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'gkdo_afghan',
    name: 'ГКДО: Афганцы',
    provider: 'ГКДО КР',
    baseUrl: 'https://catalog.tunduk.kg/services/detail/535',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  },
  {
    id: 'kissp_services',
    name: 'КИССП: Доступные услуги',
    provider: 'КИССП',
    baseUrl: 'https://catalog.tunduk.kg/services',
    timeout: 10000,
    retryAttempts: 3,
    isActive: true
  }
];
