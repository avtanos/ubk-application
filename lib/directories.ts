// Справочники для формы заявки
export interface DirectoryItem {
  id: string;
  name: string;
  code?: string;
}

// 1. Справочник полов
export const genderList: DirectoryItem[] = [
  { id: 'male', name: 'Мужской', code: 'M' },
  { id: 'female', name: 'Женский', code: 'F' },
  { id: 'other', name: 'Другой', code: 'O' }
];

// 2. Типы документов
export const documentTypeList: DirectoryItem[] = [
  { id: 'passport', name: 'Паспорт гражданина РК', code: 'PASSPORT' },
  { id: 'id_card', name: 'ИД-карта', code: 'ID_CARD' },
  { id: 'birth_certificate', name: 'Свидетельство о рождении', code: 'BIRTH_CERT' },
  { id: 'military_id', name: 'Военный билет', code: 'MILITARY_ID' },
  { id: 'temporary_id', name: 'Временное удостоверение личности', code: 'TEMP_ID' }
];

// 3. Органы выдачи паспортов
export const passportIssuingAuthorityList: DirectoryItem[] = [
  { id: 'mvd_astana', name: 'МВД г. Астана', code: 'MVD_ASTANA' },
  { id: 'mvd_almaty', name: 'МВД г. Алматы', code: 'MVD_ALMATY' },
  { id: 'mvd_shymkent', name: 'МВД г. Шымкент', code: 'MVD_SHYMKENT' },
  { id: 'mvd_akmola', name: 'МВД Акмолинской области', code: 'MVD_AKMOLA' },
  { id: 'mvd_almaty_region', name: 'МВД Алматинской области', code: 'MVD_ALMATY_REGION' }
];

// 4. Гражданство
export const citizenshipList: DirectoryItem[] = [
  { id: 'kazakhstan', name: 'Республика Казахстан', code: 'KZ' },
  { id: 'russia', name: 'Российская Федерация', code: 'RU' },
  { id: 'uzbekistan', name: 'Республика Узбекистан', code: 'UZ' },
  { id: 'kyrgyzstan', name: 'Кыргызская Республика', code: 'KG' },
  { id: 'tajikistan', name: 'Республика Таджикистан', code: 'TJ' },
  { id: 'stateless', name: 'Лицо без гражданства', code: 'STATELESS' }
];

// 5. Типы военных документов
export const militaryDocTypeList: DirectoryItem[] = [
  { id: 'military_id', name: 'Военный билет', code: 'MILITARY_ID' },
  { id: 'reserve_certificate', name: 'Удостоверение о зачислении в запас', code: 'RESERVE_CERT' },
  { id: 'exemption_certificate', name: 'Справка об освобождении от военной службы', code: 'EXEMPTION_CERT' }
];

// 6. Специальные документы
export const specialDocTypeList: DirectoryItem[] = [
  { id: 'guardian_cert', name: 'Удостоверение опекуна', code: 'GUARDIAN_CERT' },
  { id: 'veteran_cert', name: 'Удостоверение ветерана', code: 'VETERAN_CERT' },
  { id: 'disabled_cert', name: 'Удостоверение инвалида', code: 'DISABLED_CERT' },
  { id: 'pensioner_cert', name: 'Удостоверение пенсионера', code: 'PENSIONER_CERT' }
];

// 7. Национальность
export const nationalityList: DirectoryItem[] = [
  { id: 'kazakh', name: 'Казах', code: 'KAZAKH' },
  { id: 'russian', name: 'Русский', code: 'RUSSIAN' },
  { id: 'uzbek', name: 'Узбек', code: 'UZBEK' },
  { id: 'ukrainian', name: 'Украинец', code: 'UKRAINIAN' },
  { id: 'german', name: 'Немец', code: 'GERMAN' },
  { id: 'tatar', name: 'Татарин', code: 'TATAR' },
  { id: 'korean', name: 'Кореец', code: 'KOREAN' },
  { id: 'other', name: 'Другая', code: 'OTHER' }
];

// 8. Уровни образования
export const educationLevelList: DirectoryItem[] = [
  { id: 'primary', name: 'Начальное', code: 'PRIMARY' },
  { id: 'secondary', name: 'Среднее', code: 'SECONDARY' },
  { id: 'vocational', name: 'Профессионально-техническое', code: 'VOCATIONAL' },
  { id: 'higher', name: 'Высшее', code: 'HIGHER' },
  { id: 'postgraduate', name: 'Послевузовское', code: 'POSTGRADUATE' },
  { id: 'no_education', name: 'Без образования', code: 'NO_EDUCATION' }
];

// 9. Муниципальные органы (УТСЗ)
export const municipalAuthorities: DirectoryItem[] = [
  { id: 'utsz_astana', name: 'УТСЗ г. Астана', code: 'UTSZ_ASTANA' },
  { id: 'utsz_almaty', name: 'УТСЗ г. Алматы', code: 'UTSZ_ALMATY' },
  { id: 'utsz_shymkent', name: 'УТСЗ г. Шымкент', code: 'UTSZ_SHYMKENT' },
  { id: 'utsz_akmola', name: 'УТСЗ Акмолинской области', code: 'UTSZ_AKMOLA' },
  { id: 'utsz_almaty_region', name: 'УТСЗ Алматинской области', code: 'UTSZ_ALMATY_REGION' }
];

// 10. Типы заявителей
export const applicantTypes: DirectoryItem[] = [
  { id: 'parent', name: 'Один из родителей', code: 'PARENT' },
  { id: 'guardian', name: 'Опекун', code: 'GUARDIAN' },
  { id: 'trustee', name: 'Попечитель', code: 'TRUSTEE' },
  { id: 'adoptive_parent', name: 'Усыновитель', code: 'ADOPTIVE_PARENT' },
  { id: 'grandparent', name: 'Бабушка/дедушка', code: 'GRANDPARENT' }
];

// 11. Категории семей
export const categoryList: DirectoryItem[] = [
  { id: 'large_family', name: 'Многодетная семья', code: 'LARGE_FAMILY' },
  { id: 'low_income', name: 'Малообеспеченная семья', code: 'LOW_INCOME' },
  { id: 'disadvantaged', name: 'Неблагополучная семья', code: 'DISADVANTAGED' },
  { id: 'single_parent', name: 'Неполная семья', code: 'SINGLE_PARENT' },
  { id: 'disabled_parent', name: 'Семья с родителем-инвалидом', code: 'DISABLED_PARENT' },
  { id: 'military_family', name: 'Семья военнослужащего', code: 'MILITARY_FAMILY' }
];

// 12. Типы семейных отношений
export const familyRelationTypes: DirectoryItem[] = [
  // Взрослые члены семьи
  { id: 'spouse', name: 'Супруг/супруга', code: 'SPOUSE' },
  { id: 'father', name: 'Отец', code: 'FATHER' },
  { id: 'mother', name: 'Мать', code: 'MOTHER' },
  { id: 'brother', name: 'Брат', code: 'BROTHER' },
  { id: 'sister', name: 'Сестра', code: 'SISTER' },
  { id: 'grandfather', name: 'Дедушка', code: 'GRANDFATHER' },
  { id: 'grandmother', name: 'Бабушка', code: 'GRANDMOTHER' },
  { id: 'uncle', name: 'Дядя', code: 'UNCLE' },
  { id: 'aunt', name: 'Тетя', code: 'AUNT' },
  { id: 'father_in_law', name: 'Тесть/свекор', code: 'FATHER_IN_LAW' },
  { id: 'mother_in_law', name: 'Теща/свекровь', code: 'MOTHER_IN_LAW' },
  { id: 'brother_in_law', name: 'Шурин/деверь/зять', code: 'BROTHER_IN_LAW' },
  { id: 'sister_in_law', name: 'Золовка/невестка/свояченица', code: 'SISTER_IN_LAW' },
  { id: 'stepfather', name: 'Отчим', code: 'STEPFATHER' },
  { id: 'stepmother', name: 'Мачеха', code: 'STEPMOTHER' },
  { id: 'stepbrother', name: 'Сводный брат', code: 'STEPBROTHER' },
  { id: 'stepsister', name: 'Сводная сестра', code: 'STEPSISTER' },
  { id: 'guardian', name: 'Опекун', code: 'GUARDIAN' },
  { id: 'trustee', name: 'Попечитель', code: 'TRUSTEE' },
  { id: 'adoptive_father', name: 'Приемный отец', code: 'ADOPTIVE_FATHER' },
  { id: 'adoptive_mother', name: 'Приемная мать', code: 'ADOPTIVE_MOTHER' },
  
  // Дети
  { id: 'son', name: 'Сын', code: 'SON' },
  { id: 'daughter', name: 'Дочь', code: 'DAUGHTER' },
  { id: 'grandson', name: 'Внук', code: 'GRANDSON' },
  { id: 'granddaughter', name: 'Внучка', code: 'GRANDDAUGHTER' },
  { id: 'ward', name: 'Опекаемый', code: 'WARD' },
  { id: 'adopted_son', name: 'Приемный сын', code: 'ADOPTED_SON' },
  { id: 'adopted_daughter', name: 'Приемная дочь', code: 'ADOPTED_DAUGHTER' },
  { id: 'stepson', name: 'Пасынок', code: 'STEPSON' },
  { id: 'stepdaughter', name: 'Падчерица', code: 'STEPDAUGHTER' },
  { id: 'nephew', name: 'Племянник', code: 'NEPHEW' },
  { id: 'niece', name: 'Племянница', code: 'NIECE' }
];

// 13. Категории детей
export const childCategoryList: DirectoryItem[] = [
  { id: 'disabled_child', name: 'Ребенок-инвалид', code: 'DISABLED_CHILD' },
  { id: 'orphan', name: 'Сирота', code: 'ORPHAN' },
  { id: 'state_supported', name: 'Находящийся на государственном обеспечении', code: 'STATE_SUPPORTED' },
  { id: 'adopted', name: 'Усыновленный', code: 'ADOPTED' },
  { id: 'under_guardianship', name: 'Находящийся под опекой', code: 'UNDER_GUARDIANSHIP' },
  { id: 'refugee', name: 'Беженец', code: 'REFUGEE' }
];

// 14. Регионы (области)
export const regionList: DirectoryItem[] = [
  { id: 'astana', name: 'г. Астана', code: 'ASTANA' },
  { id: 'almaty', name: 'г. Алматы', code: 'ALMATY' },
  { id: 'shymkent', name: 'г. Шымкент', code: 'SHYMKENT' },
  { id: 'akmola', name: 'Акмолинская область', code: 'AKMOLA' },
  { id: 'almaty_region', name: 'Алматинская область', code: 'ALMATY_REGION' },
  { id: 'aktobe', name: 'Актюбинская область', code: 'AKTOBE' },
  { id: 'atyrau', name: 'Атырауская область', code: 'ATYRAU' },
  { id: 'east_kazakhstan', name: 'Восточно-Казахстанская область', code: 'EAST_KAZAKHSTAN' },
  { id: 'zhambyl', name: 'Жамбылская область', code: 'ZHAMBYL' },
  { id: 'west_kazakhstan', name: 'Западно-Казахстанская область', code: 'WEST_KAZAKHSTAN' },
  { id: 'karaganda', name: 'Карагандинская область', code: 'KARAGANDA' },
  { id: 'kostanay', name: 'Костанайская область', code: 'KOSTANAY' },
  { id: 'kyzylorda', name: 'Кызылординская область', code: 'KYZYLORDA' },
  { id: 'mangystau', name: 'Мангистауская область', code: 'MANGYSTAU' },
  { id: 'north_kazakhstan', name: 'Северо-Казахстанская область', code: 'NORTH_KAZAKHSTAN' },
  { id: 'pavlodar', name: 'Павлодарская область', code: 'PAVLODAR' },
  { id: 'turkestan', name: 'Туркестанская область', code: 'TURKESTAN' }
];

// 15. Населенные пункты (пример для Алматинской области)
export const localityList: DirectoryItem[] = [
  { id: 'taldykorgan', name: 'Талдыкорган', code: 'TALDIKORGAN' },
  { id: 'kapshagay', name: 'Капшагай', code: 'KAPSHAGAY' },
  { id: 'tekeli', name: 'Текели', code: 'TEKELI' },
  { id: 'ushtobe', name: 'Уштобе', code: 'USHTOBE' },
  { id: 'zharkent', name: 'Жаркент', code: 'ZHARKENT' },
  { id: 'sarkand', name: 'Сарканд', code: 'SARKAND' }
];

// 16. Типы контактов
export const contactTypeList: DirectoryItem[] = [
  { id: 'mobile', name: 'Мобильный', code: 'MOBILE' },
  { id: 'home', name: 'Домашний', code: 'HOME' },
  { id: 'work', name: 'Рабочий', code: 'WORK' },
  { id: 'email', name: 'Электронная почта', code: 'EMAIL' },
  { id: 'fax', name: 'Факс', code: 'FAX' }
];

// 17. Виды доходов
export const incomeTypeList: DirectoryItem[] = [
  { id: 'salary', name: 'Заработная плата', code: 'SALARY' },
  { id: 'pension', name: 'Пенсия', code: 'PENSION' },
  { id: 'benefit', name: 'Пособие', code: 'BENEFIT' },
  { id: 'business_income', name: 'Доход от предпринимательской деятельности', code: 'BUSINESS_INCOME' },
  { id: 'property_income', name: 'Доход от сдачи имущества в аренду', code: 'PROPERTY_INCOME' },
  { id: 'agricultural_income', name: 'Доход от сельского хозяйства', code: 'AGRICULTURAL_INCOME' },
  { id: 'other_income', name: 'Прочие доходы', code: 'OTHER_INCOME' }
];

// 18. Виды имущества
export const propertyTypeList: DirectoryItem[] = [
  { id: 'land', name: 'Земельный участок', code: 'LAND' },
  { id: 'house', name: 'Жилой дом', code: 'HOUSE' },
  { id: 'apartment', name: 'Квартира', code: 'APARTMENT' },
  { id: 'car', name: 'Автомобиль', code: 'CAR' },
  { id: 'motorcycle', name: 'Мотоцикл', code: 'MOTORCYCLE' },
  { id: 'livestock', name: 'Сельскохозяйственные животные', code: 'LIVESTOCK' },
  { id: 'equipment', name: 'Оборудование', code: 'EQUIPMENT' }
];

// 18.1. Типы земельных участков
export const landPlotTypeList: DirectoryItem[] = [
  { id: 'irrigated', name: 'Орошаемый', code: 'IRRIGATED' },
  { id: 'rain_fed', name: 'Богарный', code: 'RAIN_FED' },
  { id: 'household', name: 'Приусадебный', code: 'HOUSEHOLD' },
  { id: 'pasture', name: 'Пастбище', code: 'PASTURE' },
  { id: 'hayfield', name: 'Сенокос', code: 'HAYFIELD' },
  { id: 'garden', name: 'Огород', code: 'GARDEN' },
  { id: 'orchard', name: 'Сад', code: 'ORCHARD' }
];

// 19. Виды сельскохозяйственных животных
export const livestockTypeList: DirectoryItem[] = [
  { id: 'cow', name: 'Корова', code: 'COW' },
  { id: 'sheep', name: 'Овца', code: 'SHEEP' },
  { id: 'goat', name: 'Коза', code: 'GOAT' },
  { id: 'horse', name: 'Лошадь', code: 'HORSE' },
  { id: 'pig', name: 'Свинья', code: 'PIG' },
  { id: 'chicken', name: 'Курица', code: 'CHICKEN' },
  { id: 'duck', name: 'Утка', code: 'DUCK' },
  { id: 'goose', name: 'Гусь', code: 'GOOSE' }
];

// 19.1. Финансовые инструменты
export const financialAssetsList: DirectoryItem[] = [
  { id: 'bank_deposit', name: 'Банковский вклад', code: 'BANK_DEPOSIT' },
  { id: 'savings_account', name: 'Сберегательный счет', code: 'SAVINGS_ACCOUNT' },
  { id: 'government_bonds', name: 'Государственные облигации', code: 'GOVERNMENT_BONDS' },
  { id: 'corporate_bonds', name: 'Корпоративные облигации', code: 'CORPORATE_BONDS' },
  { id: 'stocks', name: 'Акции', code: 'STOCKS' },
  { id: 'mutual_funds', name: 'Паевые инвестиционные фонды', code: 'MUTUAL_FUNDS' },
  { id: 'pension_fund', name: 'Пенсионный фонд', code: 'PENSION_FUND' },
  { id: 'insurance_policy', name: 'Страховой полис', code: 'INSURANCE_POLICY' },
  { id: 'precious_metals', name: 'Драгоценные металлы', code: 'PRECIOUS_METALS' },
  { id: 'cryptocurrency', name: 'Криптовалюта', code: 'CRYPTOCURRENCY' },
  { id: 'other_securities', name: 'Прочие ценные бумаги', code: 'OTHER_SECURITIES' }
];

// 20. Банки
export const bankList: DirectoryItem[] = [
  { id: 'halyk_bank', name: 'АО "Народный Банк Казахстана"', code: 'HALYK_BANK' },
  { id: 'kaspi_bank', name: 'АО "Kaspi Bank"', code: 'KASPI_BANK' },
  { id: 'sberbank', name: 'АО "Сбербанк"', code: 'SBERBANK' },
  { id: 'forte_bank', name: 'АО "ForteBank"', code: 'FORTE_BANK' },
  { id: 'centercredit', name: 'АО "ЦентрКредит Банк"', code: 'CENTRECREDIT' },
  { id: 'eurobank', name: 'АО "Евразийский Банк"', code: 'EUROBANK' }
];

// 21. Типы выплат
export const paymentTypeList: DirectoryItem[] = [
  { id: 'monthly', name: 'Ежемесячная', code: 'MONTHLY' },
  { id: 'one_time', name: 'Единовременная', code: 'ONE_TIME' },
  { id: 'quarterly', name: 'Ежеквартальная', code: 'QUARTERLY' },
  { id: 'annual', name: 'Ежегодная', code: 'ANNUAL' }
];

// 22. Категории инвалидности
export const disabilityCategories: DirectoryItem[] = [
  { id: 'group_1', name: '1 группа', code: 'GROUP_1' },
  { id: 'group_2', name: '2 группа', code: 'GROUP_2' },
  { id: 'group_3', name: '3 группа', code: 'GROUP_3' },
  { id: 'child_disability', name: 'Инвалидность с детства', code: 'CHILD_DISABILITY' }
];

// 23. Типы идентификационных документов
export const identificationTypeList: DirectoryItem[] = [
  { id: 'iin', name: 'ИИН', code: 'IIN' },
  { id: 'passport', name: 'Паспорт', code: 'PASSPORT' },
  { id: 'birth_certificate', name: 'Свидетельство о рождении', code: 'BIRTH_CERTIFICATE' },
  { id: 'id_card', name: 'ИД-карта', code: 'ID_CARD' }
];

// 24. Основания для компенсаций
export const compensationReasonList: DirectoryItem[] = [
  { id: 'border_zone', name: 'Приграничная зона', code: 'BORDER_ZONE' },
  { id: 'radiation_zone', name: 'Зона радиационного воздействия', code: 'RADIATION_ZONE' },
  { id: 'mountainous_area', name: 'Горная местность', code: 'MOUNTAINOUS_AREA' },
  { id: 'remote_area', name: 'Отдаленная местность', code: 'REMOTE_AREA' },
  { id: 'extreme_climate', name: 'Экстремальные климатические условия', code: 'EXTREME_CLIMATE' }
];

// 25. Типы компенсаций
export const compensationTypeList: DirectoryItem[] = [
  { id: 'monthly_compensation', name: 'Ежемесячная компенсация', code: 'MONTHLY_COMPENSATION' },
  { id: 'one_time_compensation', name: 'Разовая компенсация', code: 'ONE_TIME_COMPENSATION' },
  { id: 'transport_compensation', name: 'Транспортная компенсация', code: 'TRANSPORT_COMPENSATION' },
  { id: 'medical_compensation', name: 'Медицинская компенсация', code: 'MEDICAL_COMPENSATION' }
];

// 26. Причины отказа
export const refusalReasons: DirectoryItem[] = [
  { id: 'insufficient_income', name: 'Недостаточный уровень дохода', code: 'INSUFFICIENT_INCOME' },
  { id: 'false_documents', name: 'Предоставление недостоверных документов', code: 'FALSE_DOCUMENTS' },
  { id: 'missing_documents', name: 'Отсутствие необходимых документов', code: 'MISSING_DOCUMENTS' },
  { id: 'age_restriction', name: 'Возрастные ограничения', code: 'AGE_RESTRICTION' },
  { id: 'citizenship_requirement', name: 'Несоответствие требованиям гражданства', code: 'CITIZENSHIP_REQUIREMENT' },
  { id: 'residence_requirement', name: 'Несоответствие требованиям проживания', code: 'RESIDENCE_REQUIREMENT' },
  { id: 'duplicate_application', name: 'Дублирование заявления', code: 'DUPLICATE_APPLICATION' }
];

// 27. Типы транспортных средств
export const vehicleTypeList: DirectoryItem[] = [
  { id: 'passenger_car', name: 'Легковой автомобиль', code: 'PASSENGER_CAR' },
  { id: 'truck', name: 'Грузовой автомобиль', code: 'TRUCK' },
  { id: 'tractor', name: 'Трактор', code: 'TRACTOR' },
  { id: 'special_equipment', name: 'Специальная техника', code: 'SPECIAL_EQUIPMENT' },
  { id: 'motorcycle', name: 'Мотоцикл', code: 'MOTORCYCLE' },
  { id: 'bus', name: 'Автобус', code: 'BUS' }
];

// 28. Периодичность доходов
export const incomePeriodicityList: DirectoryItem[] = [
  { id: 'monthly', name: 'Ежемесячно', code: 'MONTHLY' },
  { id: 'quarterly', name: 'Ежеквартально', code: 'QUARTERLY' },
  { id: 'annually', name: 'Ежегодно', code: 'ANNUALLY' },
  { id: 'one_time', name: 'Единовременно', code: 'ONE_TIME' },
  { id: 'irregular', name: 'Нерегулярно', code: 'IRREGULAR' }
];

// 29. Статусы детей
export const childStatusList: DirectoryItem[] = [
  { id: 'studying', name: 'Обучается', code: 'STUDYING' },
  { id: 'not_studying', name: 'Не обучается', code: 'NOT_STUDYING' },
  { id: 'disabled', name: 'Инвалид', code: 'DISABLED' },
  { id: 'state_support', name: 'На полном гособеспечении', code: 'STATE_SUPPORT' },
  { id: 'orphan', name: 'Сирота', code: 'ORPHAN' }
];

// 30. Типы документов для загрузки
export const documentUploadTypeList: DirectoryItem[] = [
  { id: 'passport_copy', name: 'Копия паспорта', code: 'PASSPORT_COPY' },
  { id: 'birth_certificate', name: 'Свидетельство о рождении', code: 'BIRTH_CERTIFICATE' },
  { id: 'family_composition', name: 'Справка о составе семьи', code: 'FAMILY_COMPOSITION' },
  { id: 'income_certificate', name: 'Справка о доходах', code: 'INCOME_CERTIFICATE' },
  { id: 'probation_certificate', name: 'Справка из уголовно-исполнительной инспекции', code: 'PROBATION_CERTIFICATE' },
  { id: 'employment_certificate', name: 'Справка из центра занятости', code: 'EMPLOYMENT_CERTIFICATE' },
  { id: 'patent_certificate', name: 'Патент предпринимателя', code: 'PATENT_CERTIFICATE' },
  { id: 'other', name: 'Прочие документы', code: 'OTHER' }
];

// Функция для получения справочника по имени
export function getDirectory(directoryName: string): DirectoryItem[] {
  const directories: Record<string, DirectoryItem[]> = {
    genderList,
    documentTypeList,
    passportIssuingAuthorityList,
    citizenshipList,
    militaryDocTypeList,
    specialDocTypeList,
    nationalityList,
    educationLevelList,
    municipalAuthorities,
    applicantTypes,
    categoryList,
    familyRelationTypes,
    childCategoryList,
    regionList,
    localityList,
    contactTypeList,
    incomeTypeList,
    propertyTypeList,
    landPlotTypeList,
    livestockTypeList,
    financialAssetsList,
    bankList,
    paymentTypeList,
    disabilityCategories,
    identificationTypeList,
    compensationReasonList,
    compensationTypeList,
    refusalReasons,
    vehicleTypeList,
    incomePeriodicityList,
    childStatusList,
    documentUploadTypeList
  };

  return directories[directoryName] || [];
}

// Функция для поиска элемента в справочнике
export function findDirectoryItem(directoryName: string, id: string): DirectoryItem | undefined {
  const directory = getDirectory(directoryName);
  return directory.find(item => item.id === id);
}
