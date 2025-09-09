// Валидации согласно ТУ
export interface ValidationResult {
  isValid: boolean;
  error: string;
}

// Валидация ПИН (14-16 цифр)
export const validatePin = (pin: string): ValidationResult => {
  const pinRegex = /^\d{14,16}$/;
  if (!pinRegex.test(pin)) {
    return {
      isValid: false,
      error: 'ПИН должен содержать 14-16 цифр'
    };
  }
  return { isValid: true };
};

// Валидация серии и номера документа по типу
export const validateDocumentSeriesNumber = (docType: string, series: string, number: string): ValidationResult => {
  const formatRules: Record<string, { seriesLength: number; numberLength: number }> = {
    'PASSPORT': { seriesLength: 2, numberLength: 7 },
    'ID_CARD': { seriesLength: 2, numberLength: 6 },
    'BIRTH_CERTIFICATE': { seriesLength: 2, numberLength: 7 },
    'MILITARY_ID': { seriesLength: 2, numberLength: 7 }
  };

  const rule = formatRules[docType];
  if (!rule) {
    return { isValid: true }; // Неизвестный тип - пропускаем
  }

  if (series.length !== rule.seriesLength || number.length !== rule.numberLength) {
    return {
      isValid: false,
      error: `Для ${docType}: серия должна быть ${rule.seriesLength} символов, номер ${rule.numberLength} символов`
    };
  }

  return { isValid: true };
};

// Валидация дат документа
export const validateDocumentDates = (issueDate: string, expiryDate: string): ValidationResult => {
  const today = new Date();
  const issue = new Date(issueDate);
  const expiry = new Date(expiryDate);

  if (issue > today) {
    return {
      isValid: false,
      error: 'Дата выдачи не может быть в будущем'
    };
  }

  if (expiry < today) {
    return {
      isValid: false,
      error: 'Срок действия документа истек'
    };
  }

  return { isValid: true };
};

// Валидация телефона (+996 и 9 знаков)
export const validatePhone = (phone: string): ValidationResult => {
  const phoneRegex = /^\+996\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      error: 'Телефон должен быть в формате +996XXXXXXXXX'
    };
  }
  return { isValid: true };
};

// Валидация email (RFC)
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Некорректный формат email'
    };
  }
  return { isValid: true };
};

// Валидация возраста детей (≤ 16 лет)
export const validateChildAge = (birthDate: string, applicationDate: string = new Date().toISOString().split('T')[0]): ValidationResult => {
  const birth = new Date(birthDate);
  const app = new Date(applicationDate);
  const age = app.getFullYear() - birth.getFullYear();
  const monthDiff = app.getMonth() - birth.getMonth();
  
  const actualAge = monthDiff < 0 || (monthDiff === 0 && app.getDate() < birth.getDate()) ? age - 1 : age;
  
  if (actualAge > 16) {
    return {
      isValid: false,
      error: 'Возраст ребенка не должен превышать 16 лет'
    };
  }
  
  return { isValid: true };
};

// Валидация суммы дохода (≥ 0)
export const validateIncomeAmount = (amount: number): ValidationResult => {
  if (amount < 0) {
    return {
      isValid: false,
      error: 'Сумма дохода не может быть отрицательной'
    };
  }
  return { isValid: true };
};

// Валидация площади земли (≥ 0)
export const validateLandArea = (area: number): ValidationResult => {
  if (area < 0) {
    return {
      isValid: false,
      error: 'Площадь земли не может быть отрицательной'
    };
  }
  return { isValid: true };
};

// Валидация легкового автомобиля (моложе 20 лет → отказ)
export const validateVehicleAge = (year: number, isLightCar: boolean): ValidationResult => {
  if (isLightCar) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    if (age < 20) {
      return {
        isValid: false,
        error: 'Легковой автомобиль моложе 20 лет не допускается'
      };
    }
  }
  
  return { isValid: true };
};

// Валидация коэффициентов расчета (region_coeff × add_coeff ≤ 1.8)
export const validateCalculationCoeffs = (regionCoeff: number, addCoeff: number): ValidationResult => {
  const totalCoeff = regionCoeff * addCoeff;
  if (totalCoeff > 1.8) {
    return {
      isValid: false,
      error: 'Общий коэффициент не может превышать 1.8'
    };
  }
  return { isValid: true };
};

// Валидация обязательных полей
export const validateRequiredFields = (fields: Record<string, any>): ValidationResult => {
  const requiredFields = ['pin', 'fullName', 'birthDate', 'gender', 'citizenship', 'documentType', 'documentNumber'];
  
  for (const field of requiredFields) {
    if (!fields[field] || fields[field].toString().trim() === '') {
      return {
        isValid: false,
        error: `Поле ${field} обязательно для заполнения`
      };
    }
  }
  
  return { isValid: true };
};

// Валидация согласий (все 4 чекбокса обязательны)
export const validateConsents = (consents: {
  personalDataConsent: boolean;
  childrenDataConsent: boolean;
  dataAccuracyConfirmation: boolean;
  terminationConditionsAcknowledgment: boolean;
}): ValidationResult => {
  const requiredConsents = Object.values(consents);
  
  if (requiredConsents.some(consent => !consent)) {
    return {
      isValid: false,
      error: 'Все согласия обязательны для подачи заявления'
    };
  }
  
  return { isValid: true };
};

// Валидация адреса (коды из справочников)
export const validateAddress = (address: {
  regionCode: string;
  raionCode: string;
  localityCode: string;
  street: string;
  house: string;
  flat?: string;
  addrType: 'REG' | 'FACT';
}): ValidationResult => {
  if (!address.regionCode || !address.raionCode || !address.localityCode) {
    return {
      isValid: false,
      error: 'Коды области, района и населенного пункта обязательны'
    };
  }
  
  if (!address.street || !address.house) {
    return {
      isValid: false,
      error: 'Улица и дом обязательны'
    };
  }
  
  if (!['REG', 'FACT'].includes(address.addrType)) {
    return {
      isValid: false,
      error: 'Тип адреса должен быть REG или FACT'
    };
  }
  
  if (address.street.length > 100) {
    return {
      isValid: false,
      error: 'Название улицы не должно превышать 100 символов'
    };
  }
  
  if (address.house.length > 20) {
    return {
      isValid: false,
      error: 'Номер дома не должен превышать 20 символов'
    };
  }
  
  if (address.flat && address.flat.length > 10) {
    return {
      isValid: false,
      error: 'Номер квартиры не должен превышать 10 символов'
    };
  }
  
  return { isValid: true };
};

// Валидация контактов (is_primary=1 ровно для одного)
export const validateContacts = (contacts: Array<{ isPrimary: boolean }>): ValidationResult => {
  const primaryCount = contacts.filter(contact => contact.isPrimary).length;
  
  if (primaryCount === 0) {
    return {
      isValid: false,
      error: 'Должен быть указан хотя бы один основной контакт'
    };
  }
  
  if (primaryCount > 1) {
    return {
      isValid: false,
      error: 'Только один контакт может быть основным'
    };
  }
  
  return { isValid: true };
};
