'use client';

import React, { useState } from 'react';
import { DirectorySelect, DirectoryMultiSelect, DirectorySearch } from '@/components/ui/DirectorySelect';

interface EnhancedApplicationFormData {
  // Основная информация заявителя (расширенная)
  fullName: string;
  gender: string;
  birthDate: string;
  citizenship: string;
  nationality: string;
  educationLevel: string;
  
  // Документы заявителя (разделенные поля)
  documentType: string;
  documentSeries: string;
  documentNumber: string;
  documentIssueDate: string;
  documentIssuingAuthority: string;
  
  // Адрес (структурированный)
  registrationRegion: string;
  registrationDistrict: string;
  registrationLocality: string;
  registrationStreet: string;
  registrationHouse: string;
  registrationApartment: string;
  
  actualRegion: string;
  actualDistrict: string;
  actualLocality: string;
  actualStreet: string;
  actualHouse: string;
  actualApartment: string;
  
  // Контакты (множественные)
  contacts: Array<{
    type: string;
    value: string;
  }>;
  
  // Категория заявителя и орган соцзащиты
  applicantType: string;
  municipalAuthority: string;
  
  // Состав семьи (расширенный)
  familyMembers: Array<{
    fullName: string;
    birthDate: string;
    gender: string;
    documentType: string;
    documentNumber: string;
    citizenship: string;
    relationToApplicant: string;
    status: string;
    isDisabled: boolean;
    childCategory?: string;
    birthCertificateNumber?: string;
    isStudying?: boolean;
  }>;
  
  // Доходы (переработанные)
  incomes: Array<{
    type: string;
    amount: number;
    periodicity: string;
    source: string;
    period: string;
  }>;
  
  // Подсобное хозяйство (улучшенное)
  subsidiaryFarming: {
    landPlots: Array<{
      type: string;
      area: number;
    }>;
    livestock: Array<{
      type: string;
      count: number;
      conventionalUnits: number;
    }>;
    vehicles: Array<{
      type: string;
      year: number;
      isPassengerCar: boolean;
    }>;
  };
  
  // Документы (расширенные)
  documents: Array<{
    type: string;
    file: File | null;
    isRequired: boolean;
  }>;
  
  // Согласия (отдельные)
  consents: {
    personalDataProcessing: boolean;
    dataAccuracyConfirmation: boolean;
    childrenDataProcessing: boolean;
    benefitRulesAcknowledgment: boolean;
  };
  
  // Расчет
  calculation: {
    totalIncome: number;
    perCapitaIncome: number;
    subsistenceMinimum: number;
    benefitAmount: number;
    isEligible: boolean;
    reasons: string[];
  };
}

export const EnhancedApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState<EnhancedApplicationFormData>({
    fullName: '',
    gender: '',
    birthDate: '',
    citizenship: '',
    nationality: '',
    educationLevel: '',
    documentType: '',
    documentSeries: '',
    documentNumber: '',
    documentIssueDate: '',
    documentIssuingAuthority: '',
    registrationRegion: '',
    registrationDistrict: '',
    registrationLocality: '',
    registrationStreet: '',
    registrationHouse: '',
    registrationApartment: '',
    actualRegion: '',
    actualDistrict: '',
    actualLocality: '',
    actualStreet: '',
    actualHouse: '',
    actualApartment: '',
    contacts: [{ type: 'mobile', value: '' }],
    applicantType: '',
    municipalAuthority: '',
    familyMembers: [],
    incomes: [],
    subsidiaryFarming: {
      landPlots: [],
      livestock: [],
      vehicles: []
    },
    documents: [],
    consents: {
      personalDataProcessing: false,
      dataAccuracyConfirmation: false,
      childrenDataProcessing: false,
      benefitRulesAcknowledgment: false
    },
    calculation: {
      totalIncome: 0,
      perCapitaIncome: 0,
      subsistenceMinimum: 0,
      benefitAmount: 0,
      isEligible: false,
      reasons: []
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: 'Основная информация', description: 'Личные данные заявителя' },
    { id: 2, name: 'Состав семьи', description: 'Информация о членах семьи' },
    { id: 3, name: 'Доходы', description: 'Источники доходов семьи' },
    { id: 4, name: 'Подсобное хозяйство', description: 'Земля, скот, транспорт' },
    { id: 5, name: 'Документы', description: 'Прикрепление документов' },
    { id: 6, name: 'Расчет и отправка', description: 'Расчет пособия и согласия' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { type: 'mobile', value: '' }]
    }));
  };

  const removeContact = (index: number) => {
    if (formData.contacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        contacts: prev.contacts.filter((_, i) => i !== index)
      }));
    }
  };

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, {
        fullName: '',
        birthDate: '',
        gender: '',
        documentType: '',
        documentNumber: '',
        citizenship: '',
        relationToApplicant: '',
        status: '',
        isDisabled: false
      }]
    }));
  };

  const removeFamilyMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
  };

  const addIncome = () => {
    setFormData(prev => ({
      ...prev,
      incomes: [...prev.incomes, {
        type: '',
        amount: 0,
        periodicity: 'monthly',
        source: '',
        period: ''
      }]
    }));
  };

  const removeIncome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      incomes: prev.incomes.filter((_, i) => i !== index)
    }));
  };

  const calculateBenefit = () => {
    // Расчет общего дохода
    const totalIncome = formData.incomes.reduce((sum, income) => sum + income.amount, 0);
    
    // Расчет дохода на душу населения
    const totalFamilyMembers = formData.familyMembers.length + 1; // +1 за заявителя
    const perCapitaIncome = totalFamilyMembers > 0 ? totalIncome / totalFamilyMembers : 0;
    
    // Прожиточный минимум (примерное значение)
    const subsistenceMinimum = 50000; // 50,000 тенге
    
    // Проверка права на пособие
    const isEligible = perCapitaIncome < subsistenceMinimum;
    
    // Расчет размера пособия
    const benefitAmount = isEligible ? Math.max(0, subsistenceMinimum - perCapitaIncome) * totalFamilyMembers : 0;
    
    setFormData(prev => ({
      ...prev,
      calculation: {
        totalIncome,
        perCapitaIncome,
        subsistenceMinimum,
        benefitAmount,
        isEligible,
        reasons: isEligible ? [] : ['Доход на душу населения превышает прожиточный минимум']
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.fullName) newErrors.fullName = 'Введите ФИО';
        if (!formData.gender) newErrors.gender = 'Выберите пол';
        if (!formData.birthDate) newErrors.birthDate = 'Введите дату рождения';
        if (!formData.citizenship) newErrors.citizenship = 'Выберите гражданство';
        if (!formData.documentType) newErrors.documentType = 'Выберите тип документа';
        if (!formData.documentNumber) newErrors.documentNumber = 'Введите номер документа';
        if (!formData.registrationRegion) newErrors.registrationRegion = 'Выберите регион регистрации';
        if (!formData.municipalAuthority) newErrors.municipalAuthority = 'Выберите орган соцзащиты';
        break;
      case 2:
        if (formData.familyMembers.length === 0) newErrors.familyMembers = 'Добавьте хотя бы одного члена семьи';
        break;
      case 3:
        if (formData.incomes.length === 0) newErrors.incomes = 'Добавьте хотя бы один источник дохода';
        break;
      case 6:
        if (!formData.consents.personalDataProcessing) newErrors.consents = 'Необходимо согласие на обработку персональных данных';
        if (!formData.consents.dataAccuracyConfirmation) newErrors.consents = 'Необходимо подтверждение достоверности данных';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log('Отправка формы:', formData);
      alert('Заявление успешно отправлено!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        Заявление на получение социальных выплат
      </h1>

      {/* Прогресс-бар */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= step.id ? 'bg-brand-red text-white' : 'bg-neutral-200 text-neutral-600'
              }`}>
                {step.id}
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-neutral-900">{step.name}</div>
                <div className="text-xs text-neutral-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 ${
                  currentStep > step.id ? 'bg-brand-red' : 'bg-neutral-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Шаг 1: Основная информация */}
      {currentStep === 1 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
            Основная информация заявителя
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                ФИО <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent ${
                  errors.fullName ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Введите полное имя"
              />
              {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            <DirectorySelect
              directoryName="genderList"
              value={formData.gender}
              onChange={(value) => handleInputChange('gender', value)}
              label="Пол"
              required
              error={errors.gender}
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Дата рождения <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent ${
                  errors.birthDate ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {errors.birthDate && <p className="text-sm text-red-600 mt-1">{errors.birthDate}</p>}
            </div>

            <DirectorySelect
              directoryName="citizenshipList"
              value={formData.citizenship}
              onChange={(value) => handleInputChange('citizenship', value)}
              label="Гражданство"
              required
              error={errors.citizenship}
            />

            <DirectorySelect
              directoryName="nationalityList"
              value={formData.nationality}
              onChange={(value) => handleInputChange('nationality', value)}
              label="Национальность"
            />

            <DirectorySelect
              directoryName="educationLevelList"
              value={formData.educationLevel}
              onChange={(value) => handleInputChange('educationLevel', value)}
              label="Образование"
            />
          </div>

          {/* Документы заявителя */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-800">Документы, удостоверяющие личность</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DirectorySelect
                directoryName="documentTypeList"
                value={formData.documentType}
                onChange={(value) => handleInputChange('documentType', value)}
                label="Тип документа"
                required
                error={errors.documentType}
              />

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Серия документа
                </label>
                <input
                  type="text"
                  value={formData.documentSeries}
                  onChange={(e) => handleInputChange('documentSeries', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  placeholder="Введите серию"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Номер документа <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.documentNumber}
                  onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent ${
                    errors.documentNumber ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="Введите номер"
                />
                {errors.documentNumber && <p className="text-sm text-red-600 mt-1">{errors.documentNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Дата выдачи
                </label>
                <input
                  type="date"
                  value={formData.documentIssueDate}
                  onChange={(e) => handleInputChange('documentIssueDate', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>

              <DirectorySelect
                directoryName="passportIssuingAuthorityList"
                value={formData.documentIssuingAuthority}
                onChange={(value) => handleInputChange('documentIssuingAuthority', value)}
                label="Орган выдачи"
              />
            </div>
          </div>

          {/* Адреса */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-800">Адреса</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-neutral-700">Адрес регистрации</h4>
                <div className="grid grid-cols-1 gap-4">
                  <DirectorySearch
                    directoryName="regionList"
                    value={formData.registrationRegion}
                    onChange={(value) => handleInputChange('registrationRegion', value)}
                    label="Регион"
                    required
                    error={errors.registrationRegion}
                  />
                  
                  <input
                    type="text"
                    value={formData.registrationDistrict}
                    onChange={(e) => handleInputChange('registrationDistrict', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="Район"
                  />
                  
                  <input
                    type="text"
                    value={formData.registrationLocality}
                    onChange={(e) => handleInputChange('registrationLocality', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="Населенный пункт"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.registrationStreet}
                      onChange={(e) => handleInputChange('registrationStreet', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      placeholder="Улица"
                    />
                    <input
                      type="text"
                      value={formData.registrationHouse}
                      onChange={(e) => handleInputChange('registrationHouse', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      placeholder="Дом"
                    />
                  </div>
                  
                  <input
                    type="text"
                    value={formData.registrationApartment}
                    onChange={(e) => handleInputChange('registrationApartment', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="Квартира"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-neutral-700">Адрес фактического проживания</h4>
                <div className="grid grid-cols-1 gap-4">
                  <DirectorySearch
                    directoryName="regionList"
                    value={formData.actualRegion}
                    onChange={(value) => handleInputChange('actualRegion', value)}
                    label="Регион"
                  />
                  
                  <input
                    type="text"
                    value={formData.actualDistrict}
                    onChange={(e) => handleInputChange('actualDistrict', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="Район"
                  />
                  
                  <input
                    type="text"
                    value={formData.actualLocality}
                    onChange={(e) => handleInputChange('actualLocality', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="Населенный пункт"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.actualStreet}
                      onChange={(e) => handleInputChange('actualStreet', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      placeholder="Улица"
                    />
                    <input
                      type="text"
                      value={formData.actualHouse}
                      onChange={(e) => handleInputChange('actualHouse', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      placeholder="Дом"
                    />
                  </div>
                  
                  <input
                    type="text"
                    value={formData.actualApartment}
                    onChange={(e) => handleInputChange('actualApartment', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="Квартира"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Контакты */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-800">Контактная информация</h3>
              <button
                type="button"
                onClick={addContact}
                className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
              >
                Добавить контакт
              </button>
            </div>
            
            {formData.contacts.map((contact, index) => (
              <div key={index} className="flex items-center space-x-4">
                <DirectorySelect
                  directoryName="contactTypeList"
                  value={contact.type}
                  onChange={(value) => {
                    const newContacts = [...formData.contacts];
                    newContacts[index].type = value;
                    handleInputChange('contacts', newContacts);
                  }}
                  label=""
                  className="w-48"
                />
                <input
                  type="text"
                  value={contact.value}
                  onChange={(e) => {
                    const newContacts = [...formData.contacts];
                    newContacts[index].value = e.target.value;
                    handleInputChange('contacts', newContacts);
                  }}
                  className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  placeholder="Введите контакт"
                />
                {formData.contacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Удалить
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DirectorySelect
              directoryName="applicantTypes"
              value={formData.applicantType}
              onChange={(value) => handleInputChange('applicantType', value)}
              label="Тип заявителя"
            />

            <DirectorySelect
              directoryName="municipalAuthorities"
              value={formData.municipalAuthority}
              onChange={(value) => handleInputChange('municipalAuthority', value)}
              label="Орган соцзащиты (УТСЗ)"
              required
              error={errors.municipalAuthority}
            />
          </div>
        </div>
      )}

      {/* Шаг 2: Состав семьи */}
      {currentStep === 2 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
              Состав семьи
            </h2>
            <button
              type="button"
              onClick={addFamilyMember}
              className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
            >
              Добавить члена семьи
            </button>
          </div>

          {formData.familyMembers.map((member, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-neutral-800">
                  Член семьи {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeFamilyMember(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Удалить
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    ФИО <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={member.fullName}
                    onChange={(e) => {
                      const newMembers = [...formData.familyMembers];
                      newMembers[index].fullName = e.target.value;
                      handleInputChange('familyMembers', newMembers);
                    }}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="Введите полное имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Дата рождения <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={member.birthDate}
                    onChange={(e) => {
                      const newMembers = [...formData.familyMembers];
                      newMembers[index].birthDate = e.target.value;
                      handleInputChange('familyMembers', newMembers);
                    }}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>

                <DirectorySelect
                  directoryName="genderList"
                  value={member.gender}
                  onChange={(value) => {
                    const newMembers = [...formData.familyMembers];
                    newMembers[index].gender = value;
                    handleInputChange('familyMembers', newMembers);
                  }}
                  label="Пол"
                  className=""
                />

                <DirectorySelect
                  directoryName="citizenshipList"
                  value={member.citizenship}
                  onChange={(value) => {
                    const newMembers = [...formData.familyMembers];
                    newMembers[index].citizenship = value;
                    handleInputChange('familyMembers', newMembers);
                  }}
                  label="Гражданство"
                />

                <DirectorySelect
                  directoryName="documentTypeList"
                  value={member.documentType}
                  onChange={(value) => {
                    const newMembers = [...formData.familyMembers];
                    newMembers[index].documentType = value;
                    handleInputChange('familyMembers', newMembers);
                  }}
                  label="Тип документа"
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Номер документа
                  </label>
                  <input
                    type="text"
                    value={member.documentNumber}
                    onChange={(e) => {
                      const newMembers = [...formData.familyMembers];
                      newMembers[index].documentNumber = e.target.value;
                      handleInputChange('familyMembers', newMembers);
                    }}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="Введите номер документа"
                  />
                </div>

                <DirectorySelect
                  directoryName="familyRelationTypes"
                  value={member.relationToApplicant}
                  onChange={(value) => {
                    const newMembers = [...formData.familyMembers];
                    newMembers[index].relationToApplicant = value;
                    handleInputChange('familyMembers', newMembers);
                  }}
                  label="Отношение к заявителю"
                />

                <DirectorySelect
                  directoryName="childStatusList"
                  value={member.status}
                  onChange={(value) => {
                    const newMembers = [...formData.familyMembers];
                    newMembers[index].status = value;
                    handleInputChange('familyMembers', newMembers);
                  }}
                  label="Статус"
                />

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={member.isDisabled}
                    onChange={(e) => {
                      const newMembers = [...formData.familyMembers];
                      newMembers[index].isDisabled = e.target.checked;
                      handleInputChange('familyMembers', newMembers);
                    }}
                    className="rounded border-neutral-300 text-brand-red focus:ring-brand-red"
                  />
                  <label className="text-sm font-medium text-neutral-700">
                    Инвалид
                  </label>
                </div>

                {/* Дополнительные поля для детей */}
                {(member.relationToApplicant === 'son' || member.relationToApplicant === 'daughter' || 
                  member.relationToApplicant === 'grandson' || member.relationToApplicant === 'granddaughter') && (
                  <>
                    <DirectorySelect
                      directoryName="childCategoryList"
                      value={member.childCategory || ''}
                      onChange={(value) => {
                        const newMembers = [...formData.familyMembers];
                        newMembers[index].childCategory = value;
                        handleInputChange('familyMembers', newMembers);
                      }}
                      label="Категория ребенка"
                    />

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Номер свидетельства о рождении
                      </label>
                      <input
                        type="text"
                        value={member.birthCertificateNumber || ''}
                        onChange={(e) => {
                          const newMembers = [...formData.familyMembers];
                          newMembers[index].birthCertificateNumber = e.target.value;
                          handleInputChange('familyMembers', newMembers);
                        }}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                        placeholder="Введите номер свидетельства"
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={member.isStudying || false}
                        onChange={(e) => {
                          const newMembers = [...formData.familyMembers];
                          newMembers[index].isStudying = e.target.checked;
                          handleInputChange('familyMembers', newMembers);
                        }}
                        className="rounded border-neutral-300 text-brand-red focus:ring-brand-red"
                      />
                      <label className="text-sm font-medium text-neutral-700">
                        Обучается
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {errors.familyMembers && (
            <p className="text-sm text-red-600">{errors.familyMembers}</p>
          )}
        </div>
      )}

      {/* Шаг 3: Доходы */}
      {currentStep === 3 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
              Доходы семьи
            </h2>
            <button
              type="button"
              onClick={addIncome}
              className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
            >
              Добавить доход
            </button>
          </div>

          {formData.incomes.map((income, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-neutral-800">
                  Доход {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeIncome(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Удалить
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DirectorySelect
                  directoryName="incomeTypeList"
                  value={income.type}
                  onChange={(value) => {
                    const newIncomes = [...formData.incomes];
                    newIncomes[index].type = value;
                    handleInputChange('incomes', newIncomes);
                  }}
                  label="Тип дохода"
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Сумма (тенге) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={income.amount}
                    onChange={(e) => {
                      const newIncomes = [...formData.incomes];
                      newIncomes[index].amount = parseFloat(e.target.value) || 0;
                      handleInputChange('incomes', newIncomes);
                    }}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <DirectorySelect
                  directoryName="incomePeriodicityList"
                  value={income.periodicity}
                  onChange={(value) => {
                    const newIncomes = [...formData.incomes];
                    newIncomes[index].periodicity = value;
                    handleInputChange('incomes', newIncomes);
                  }}
                  label="Периодичность"
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Источник дохода
                  </label>
                  <input
                    type="text"
                    value={income.source}
                    onChange={(e) => {
                      const newIncomes = [...formData.incomes];
                      newIncomes[index].source = e.target.value;
                      handleInputChange('incomes', newIncomes);
                    }}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="Укажите источник"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Период получения дохода
                  </label>
                  <input
                    type="text"
                    value={income.period}
                    onChange={(e) => {
                      const newIncomes = [...formData.incomes];
                      newIncomes[index].period = e.target.value;
                      handleInputChange('incomes', newIncomes);
                    }}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="Например: январь-декабрь 2024"
                  />
                </div>
              </div>
            </div>
          ))}

          {errors.incomes && (
            <p className="text-sm text-red-600">{errors.incomes}</p>
          )}

          {/* Автоматический расчет */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-800 mb-4">
              Автоматический расчет доходов
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formData.incomes.reduce((sum, income) => sum + income.amount, 0).toLocaleString()} ₸
                </div>
                <div className="text-sm text-blue-700">Общий доход семьи</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formData.familyMembers.length + 1 > 0 
                    ? Math.round(formData.incomes.reduce((sum, income) => sum + income.amount, 0) / (formData.familyMembers.length + 1)).toLocaleString()
                    : 0} ₸
                </div>
                <div className="text-sm text-blue-700">Доход на душу населения</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50,000 ₸</div>
                <div className="text-sm text-blue-700">Прожиточный минимум</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Шаг 4: Подсобное хозяйство */}
      {currentStep === 4 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
            Подсобное хозяйство
          </h2>

          {/* Земельные участки */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-800">Земельные участки</h3>
              <button
                type="button"
                onClick={() => {
                  const newPlots = [...formData.subsidiaryFarming.landPlots];
                  newPlots.push({ type: 'irrigated', area: 0 });
                  handleInputChange('subsidiaryFarming', {
                    ...formData.subsidiaryFarming,
                    landPlots: newPlots
                  });
                }}
                className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
              >
                Добавить участок
              </button>
            </div>

            {formData.subsidiaryFarming.landPlots.map((plot, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-neutral-800">Участок {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newPlots = formData.subsidiaryFarming.landPlots.filter((_, i) => i !== index);
                      handleInputChange('subsidiaryFarming', {
                        ...formData.subsidiaryFarming,
                        landPlots: newPlots
                      });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Удалить
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DirectorySelect
                    directoryName="propertyTypeList"
                    value={plot.type}
                    onChange={(value) => {
                      const newPlots = [...formData.subsidiaryFarming.landPlots];
                      newPlots[index].type = value;
                      handleInputChange('subsidiaryFarming', {
                        ...formData.subsidiaryFarming,
                        landPlots: newPlots
                      });
                    }}
                    label="Тип участка"
                  />

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Площадь (соток)
                    </label>
                    <input
                      type="number"
                      value={plot.area}
                      onChange={(e) => {
                        const newPlots = [...formData.subsidiaryFarming.landPlots];
                        newPlots[index].area = parseFloat(e.target.value) || 0;
                        handleInputChange('subsidiaryFarming', {
                          ...formData.subsidiaryFarming,
                          landPlots: newPlots
                        });
                      }}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Скот */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-800">Скот</h3>
              <button
                type="button"
                onClick={() => {
                  const newLivestock = [...formData.subsidiaryFarming.livestock];
                  newLivestock.push({ type: 'cow', count: 0, conventionalUnits: 0 });
                  handleInputChange('subsidiaryFarming', {
                    ...formData.subsidiaryFarming,
                    livestock: newLivestock
                  });
                }}
                className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
              >
                Добавить скот
              </button>
            </div>

            {formData.subsidiaryFarming.livestock.map((animal, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-neutral-800">Животное {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newLivestock = formData.subsidiaryFarming.livestock.filter((_, i) => i !== index);
                      handleInputChange('subsidiaryFarming', {
                        ...formData.subsidiaryFarming,
                        livestock: newLivestock
                      });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Удалить
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DirectorySelect
                    directoryName="livestockTypeList"
                    value={animal.type}
                    onChange={(value) => {
                      const newLivestock = [...formData.subsidiaryFarming.livestock];
                      newLivestock[index].type = value;
                      // Автоматический расчет условных голов
                      const conventionalUnitsMap: Record<string, number> = {
                        'cow': 1.0,
                        'horse': 1.0,
                        'sheep': 0.1,
                        'goat': 0.1,
                        'pig': 0.2,
                        'chicken': 0.01,
                        'duck': 0.01,
                        'goose': 0.01
                      };
                      newLivestock[index].conventionalUnits = conventionalUnitsMap[value] || 0;
                      handleInputChange('subsidiaryFarming', {
                        ...formData.subsidiaryFarming,
                        livestock: newLivestock
                      });
                    }}
                    label="Тип животного"
                  />

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Количество
                    </label>
                    <input
                      type="number"
                      value={animal.count}
                      onChange={(e) => {
                        const newLivestock = [...formData.subsidiaryFarming.livestock];
                        newLivestock[index].count = parseInt(e.target.value) || 0;
                        handleInputChange('subsidiaryFarming', {
                          ...formData.subsidiaryFarming,
                          livestock: newLivestock
                        });
                      }}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Условные головы
                    </label>
                    <input
                      type="number"
                      value={(animal.count * animal.conventionalUnits).toFixed(2)}
                      readOnly
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Транспорт */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-800">Транспортные средства</h3>
              <button
                type="button"
                onClick={() => {
                  const newVehicles = [...formData.subsidiaryFarming.vehicles];
                  newVehicles.push({ type: 'passenger_car', year: new Date().getFullYear(), isPassengerCar: true });
                  handleInputChange('subsidiaryFarming', {
                    ...formData.subsidiaryFarming,
                    vehicles: newVehicles
                  });
                }}
                className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
              >
                Добавить транспорт
              </button>
            </div>

            {formData.subsidiaryFarming.vehicles.map((vehicle, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-neutral-800">Транспорт {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newVehicles = formData.subsidiaryFarming.vehicles.filter((_, i) => i !== index);
                      handleInputChange('subsidiaryFarming', {
                        ...formData.subsidiaryFarming,
                        vehicles: newVehicles
                      });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Удалить
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DirectorySelect
                    directoryName="vehicleTypeList"
                    value={vehicle.type}
                    onChange={(value) => {
                      const newVehicles = [...formData.subsidiaryFarming.vehicles];
                      newVehicles[index].type = value;
                      newVehicles[index].isPassengerCar = value === 'passenger_car';
                      handleInputChange('subsidiaryFarming', {
                        ...formData.subsidiaryFarming,
                        vehicles: newVehicles
                      });
                    }}
                    label="Тип транспорта"
                  />

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Год выпуска
                    </label>
                    <input
                      type="number"
                      value={vehicle.year}
                      onChange={(e) => {
                        const newVehicles = [...formData.subsidiaryFarming.vehicles];
                        newVehicles[index].year = parseInt(e.target.value) || new Date().getFullYear();
                        handleInputChange('subsidiaryFarming', {
                          ...formData.subsidiaryFarming,
                          vehicles: newVehicles
                        });
                      }}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={vehicle.isPassengerCar}
                      onChange={(e) => {
                        const newVehicles = [...formData.subsidiaryFarming.vehicles];
                        newVehicles[index].isPassengerCar = e.target.checked;
                        handleInputChange('subsidiaryFarming', {
                          ...formData.subsidiaryFarming,
                          vehicles: newVehicles
                        });
                      }}
                      className="rounded border-neutral-300 text-brand-red focus:ring-brand-red"
                    />
                    <label className="text-sm font-medium text-neutral-700">
                      Легковой автомобиль
                    </label>
                  </div>
                </div>

                {/* Проверка возраста легкового автомобиля */}
                {vehicle.isPassengerCar && (
                  <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center">
                      <div className="text-yellow-600 mr-2">⚠️</div>
                      <div className="text-sm text-yellow-800">
                        {new Date().getFullYear() - vehicle.year > 20 
                          ? `Автомобиль старше 20 лет (${new Date().getFullYear() - vehicle.year} лет). Это может повлиять на право получения пособия.`
                          : `Автомобиль ${new Date().getFullYear() - vehicle.year} лет.`
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Автоматический расчет подсобного хозяйства */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-green-800 mb-4">
              Расчет подсобного хозяйства
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-700 mb-2">Общая площадь земельных участков</h4>
                <div className="text-2xl font-bold text-green-600">
                  {formData.subsidiaryFarming.landPlots.reduce((sum, plot) => sum + plot.area, 0)} соток
                </div>
              </div>
              <div>
                <h4 className="font-medium text-green-700 mb-2">Общее количество условных голов</h4>
                <div className="text-2xl font-bold text-green-600">
                  {formData.subsidiaryFarming.livestock.reduce((sum, animal) => sum + (animal.count * animal.conventionalUnits), 0).toFixed(2)}
                </div>
              </div>
            </div>
            
            {/* Проверка лимита условных голов */}
            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-sm text-blue-800">
                <strong>Лимит условных голов:</strong> 4 условные головы на одного члена семьи
                <br />
                <strong>Ваш лимит:</strong> {(formData.familyMembers.length + 1) * 4} условных голов
                <br />
                <strong>Текущее количество:</strong> {formData.subsidiaryFarming.livestock.reduce((sum, animal) => sum + (animal.count * animal.conventionalUnits), 0).toFixed(2)} условных голов
                {formData.subsidiaryFarming.livestock.reduce((sum, animal) => sum + (animal.count * animal.conventionalUnits), 0) > (formData.familyMembers.length + 1) * 4 && (
                  <span className="text-red-600 font-medium"> (превышен лимит!)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Шаг 5: Документы */}
      {currentStep === 5 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
            Документы
          </h2>

          <div className="space-y-6">
            {formData.documents.map((doc, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-neutral-800">
                    Документ {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newDocs = formData.documents.filter((_, i) => i !== index);
                      handleInputChange('documents', newDocs);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Удалить
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DirectorySelect
                    directoryName="documentUploadTypeList"
                    value={doc.type}
                    onChange={(value) => {
                      const newDocs = [...formData.documents];
                      newDocs[index].type = value;
                      handleInputChange('documents', newDocs);
                    }}
                    label="Тип документа"
                  />

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Файл документа
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        const newDocs = [...formData.documents];
                        newDocs[index].file = e.target.files?.[0] || null;
                        handleInputChange('documents', newDocs);
                      }}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Поддерживаемые форматы: PDF, JPG, PNG, DOC, DOCX (максимум 10 МБ)
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-4">
                  <input
                    type="checkbox"
                    checked={doc.isRequired}
                    onChange={(e) => {
                      const newDocs = [...formData.documents];
                      newDocs[index].isRequired = e.target.checked;
                      handleInputChange('documents', newDocs);
                    }}
                    className="rounded border-neutral-300 text-brand-red focus:ring-brand-red"
                  />
                  <label className="text-sm font-medium text-neutral-700">
                    Обязательный документ
                  </label>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newDocs = [...formData.documents];
                newDocs.push({ type: '', file: null, isRequired: false });
                handleInputChange('documents', newDocs);
              }}
              className="w-full border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-brand-red transition-colors"
            >
              <div className="text-neutral-600 mb-2">+</div>
              <div className="text-neutral-700">Добавить документ</div>
            </button>
          </div>

          {/* Информация о необходимых документах */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-4">
              Необходимые документы
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
              <div>
                <h4 className="font-medium mb-2">Обязательные для всех:</h4>
                <ul className="space-y-1">
                  <li>• Копия паспорта заявителя</li>
                  <li>• Справка о составе семьи</li>
                  <li>• Справки о доходах всех членов семьи</li>
                  <li>• Свидетельства о рождении детей</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Дополнительные (при необходимости):</h4>
                <ul className="space-y-1">
                  <li>• Справка из уголовно-исполнительной инспекции</li>
                  <li>• Справка из центра занятости</li>
                  <li>• Патент предпринимателя</li>
                  <li>• Документы об инвалидности</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Шаг 6: Расчет и отправка */}
      {currentStep === 6 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
            Расчет пособия и отправка заявления
          </h2>

          <div className="flex justify-center">
            <button
              onClick={calculateBenefit}
              className="px-8 py-4 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors text-lg font-medium"
            >
              Рассчитать пособие
            </button>
          </div>

          {formData.calculation.totalIncome > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-800 mb-4">
                Результат расчета
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Общий доход семьи:</span>
                    <span className="font-semibold">{formData.calculation.totalIncome.toLocaleString()} ₸</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Доход на душу населения:</span>
                    <span className="font-semibold">{formData.calculation.perCapitaIncome.toLocaleString()} ₸</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Прожиточный минимум:</span>
                    <span className="font-semibold">{formData.calculation.subsistenceMinimum.toLocaleString()} ₸</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formData.calculation.benefitAmount.toLocaleString()} ₸
                  </div>
                  <div className="text-green-700 font-medium">
                    {formData.calculation.isEligible ? 'Размер пособия' : 'Право на пособие отсутствует'}
                  </div>
                </div>
              </div>

              {!formData.calculation.isEligible && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-red-800">
                    <strong>Причина отказа:</strong> {formData.calculation.reasons.join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Согласия */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800">Согласия и подтверждения</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.consents.personalDataProcessing}
                  onChange={(e) => handleInputChange('consents', {
                    ...formData.consents,
                    personalDataProcessing: e.target.checked
                  })}
                  className="mt-1 rounded border-neutral-300 text-brand-red focus:ring-brand-red"
                />
                <label className="text-sm text-neutral-700">
                  Я даю согласие на обработку моих персональных данных в соответствии с законодательством Республики Казахстан
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.consents.dataAccuracyConfirmation}
                  onChange={(e) => handleInputChange('consents', {
                    ...formData.consents,
                    dataAccuracyConfirmation: e.target.checked
                  })}
                  className="mt-1 rounded border-neutral-300 text-brand-red focus:ring-brand-red"
                />
                <label className="text-sm text-neutral-700">
                  Я подтверждаю достоверность предоставленной информации и несу ответственность за ее точность
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.consents.childrenDataProcessing}
                  onChange={(e) => handleInputChange('consents', {
                    ...formData.consents,
                    childrenDataProcessing: e.target.checked
                  })}
                  className="mt-1 rounded border-neutral-300 text-brand-red focus:ring-brand-red"
                />
                <label className="text-sm text-neutral-700">
                  Я даю согласие на обработку персональных данных моих детей
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.consents.benefitRulesAcknowledgment}
                  onChange={(e) => handleInputChange('consents', {
                    ...formData.consents,
                    benefitRulesAcknowledgment: e.target.checked
                  })}
                  className="mt-1 rounded border-neutral-300 text-brand-red focus:ring-brand-red"
                />
                <label className="text-sm text-neutral-700">
                  Я ознакомлен с правилами подачи и прекращения выплаты пособия
                </label>
              </div>
            </div>
          </div>

          {/* Подпись специалиста */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Подпись специалиста (при приеме заявления)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ФИО специалиста
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  placeholder="Введите ФИО специалиста"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата приема заявления
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Навигация */}
      <div className="flex justify-between pt-8 border-t border-neutral-200">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg ${
            currentStep === 1
              ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              : 'bg-neutral-600 text-white hover:bg-neutral-700'
          }`}
        >
          Назад
        </button>

        {currentStep < steps.length ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
          >
            Далее
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Отправить заявление
          </button>
        )}
      </div>
    </div>
  );
};
