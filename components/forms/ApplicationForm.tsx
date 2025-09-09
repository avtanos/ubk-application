'use client';

import React, { useState } from 'react';
import { DirectorySelect, DirectoryMultiSelect, DirectorySearch } from '@/components/ui/DirectorySelect';

interface ApplicationFormData {
  // Личные данные заявителя
  gender: string;
  documentType: string;
  passportIssuingAuthority: string;
  citizenship: string;
  nationality: string;
  educationLevel: string;
  
  // Семейные данные
  applicantType: string;
  familyCategory: string[];
  familyRelations: string[];
  childCategories: string[];
  
  // Местоположение
  region: string;
  locality: string;
  municipalAuthority: string;
  
  // Контакты
  contactTypes: string[];
  
  // Доходы и имущество
  incomeTypes: string[];
  propertyTypes: string[];
  livestockTypes: string[];
  
  // Банковские данные
  bank: string;
  paymentType: string;
  
  // Специальные категории
  disabilityCategory: string;
  compensationReasons: string[];
  compensationTypes: string[];
}

export const ApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    gender: '',
    documentType: '',
    passportIssuingAuthority: '',
    citizenship: '',
    nationality: '',
    educationLevel: '',
    applicantType: '',
    familyCategory: [],
    familyRelations: [],
    childCategories: [],
    region: '',
    locality: '',
    municipalAuthority: '',
    contactTypes: [],
    incomeTypes: [],
    propertyTypes: [],
    livestockTypes: [],
    bank: '',
    paymentType: '',
    disabilityCategory: '',
    compensationReasons: [],
    compensationTypes: []
  });

  const [errors, setErrors] = useState<Partial<ApplicationFormData>>({});

  const handleInputChange = (field: keyof ApplicationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ApplicationFormData> = {};

    // Обязательные поля
    if (!formData.gender) newErrors.gender = 'Выберите пол';
    if (!formData.documentType) newErrors.documentType = 'Выберите тип документа';
    if (!formData.citizenship) newErrors.citizenship = 'Выберите гражданство';
    if (!formData.region) newErrors.region = 'Выберите регион';
    if (!formData.municipalAuthority) newErrors.municipalAuthority = 'Выберите орган соцзащиты';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Данные формы:', formData);
      // Здесь можно отправить данные на сервер
      alert('Форма успешно отправлена!');
    } else {
      alert('Пожалуйста, заполните все обязательные поля');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">
        Заявление на получение социальных выплат
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Личные данные */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
            Личные данные заявителя
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DirectorySelect
              directoryName="genderList"
              value={formData.gender}
              onChange={(value) => handleInputChange('gender', value)}
              label="Пол"
              placeholder="Выберите пол"
              required
              error={errors.gender}
            />

            <DirectorySelect
              directoryName="documentTypeList"
              value={formData.documentType}
              onChange={(value) => handleInputChange('documentType', value)}
              label="Тип документа"
              placeholder="Выберите тип документа"
              required
              error={errors.documentType}
            />

            <DirectorySelect
              directoryName="passportIssuingAuthorityList"
              value={formData.passportIssuingAuthority}
              onChange={(value) => handleInputChange('passportIssuingAuthority', value)}
              label="Орган выдачи паспорта"
              placeholder="Выберите орган выдачи"
            />

            <DirectorySelect
              directoryName="citizenshipList"
              value={formData.citizenship}
              onChange={(value) => handleInputChange('citizenship', value)}
              label="Гражданство"
              placeholder="Выберите гражданство"
              required
              error={errors.citizenship}
            />

            <DirectorySelect
              directoryName="nationalityList"
              value={formData.nationality}
              onChange={(value) => handleInputChange('nationality', value)}
              label="Национальность"
              placeholder="Выберите национальность"
            />

            <DirectorySelect
              directoryName="educationLevelList"
              value={formData.educationLevel}
              onChange={(value) => handleInputChange('educationLevel', value)}
              label="Образование"
              placeholder="Выберите уровень образования"
            />
          </div>
        </section>

        {/* Семейные данные */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
            Семейные данные
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DirectorySelect
              directoryName="applicantTypes"
              value={formData.applicantType}
              onChange={(value) => handleInputChange('applicantType', value)}
              label="Тип заявителя"
              placeholder="Выберите тип заявителя"
            />

            <DirectoryMultiSelect
              directoryName="categoryList"
              values={formData.familyCategory}
              onChange={(values) => handleInputChange('familyCategory', values)}
              label="Категория семьи"
              placeholder="Выберите категории семьи"
              maxSelections={3}
            />

            <DirectoryMultiSelect
              directoryName="familyRelationTypes"
              values={formData.familyRelations}
              onChange={(values) => handleInputChange('familyRelations', values)}
              label="Члены семьи"
              placeholder="Выберите членов семьи"
            />

            <DirectoryMultiSelect
              directoryName="childCategoryList"
              values={formData.childCategories}
              onChange={(values) => handleInputChange('childCategories', values)}
              label="Категории детей"
              placeholder="Выберите категории детей"
            />
          </div>
        </section>

        {/* Местоположение */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
            Местоположение
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DirectorySearch
              directoryName="regionList"
              value={formData.region}
              onChange={(value) => handleInputChange('region', value)}
              label="Регион проживания"
              placeholder="Выберите регион"
              required
              error={errors.region}
              searchPlaceholder="Поиск региона..."
            />

            <DirectorySearch
              directoryName="localityList"
              value={formData.locality}
              onChange={(value) => handleInputChange('locality', value)}
              label="Населенный пункт"
              placeholder="Выберите населенный пункт"
              searchPlaceholder="Поиск населенного пункта..."
            />

            <DirectorySelect
              directoryName="municipalAuthorities"
              value={formData.municipalAuthority}
              onChange={(value) => handleInputChange('municipalAuthority', value)}
              label="Орган соцзащиты (УТСЗ)"
              placeholder="Выберите орган соцзащиты"
              required
              error={errors.municipalAuthority}
            />
          </div>
        </section>

        {/* Контакты */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
            Контактная информация
          </h2>
          
          <DirectoryMultiSelect
            directoryName="contactTypeList"
            values={formData.contactTypes}
            onChange={(values) => handleInputChange('contactTypes', values)}
            label="Типы контактов"
            placeholder="Выберите типы контактов"
            maxSelections={5}
          />
        </section>

        {/* Доходы и имущество */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
            Доходы и имущество
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DirectoryMultiSelect
              directoryName="incomeTypeList"
              values={formData.incomeTypes}
              onChange={(values) => handleInputChange('incomeTypes', values)}
              label="Виды доходов"
              placeholder="Выберите виды доходов"
            />

            <DirectoryMultiSelect
              directoryName="propertyTypeList"
              values={formData.propertyTypes}
              onChange={(values) => handleInputChange('propertyTypes', values)}
              label="Виды имущества"
              placeholder="Выберите виды имущества"
            />

            <DirectoryMultiSelect
              directoryName="livestockTypeList"
              values={formData.livestockTypes}
              onChange={(values) => handleInputChange('livestockTypes', values)}
              label="Сельскохозяйственные животные"
              placeholder="Выберите виды животных"
            />
          </div>
        </section>

        {/* Банковские данные */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
            Банковские данные
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DirectorySelect
              directoryName="bankList"
              value={formData.bank}
              onChange={(value) => handleInputChange('bank', value)}
              label="Банк получателя"
              placeholder="Выберите банк"
            />

            <DirectorySelect
              directoryName="paymentTypeList"
              value={formData.paymentType}
              onChange={(value) => handleInputChange('paymentType', value)}
              label="Тип выплаты"
              placeholder="Выберите тип выплаты"
            />
          </div>
        </section>

        {/* Специальные категории */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
            Специальные категории
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DirectorySelect
              directoryName="disabilityCategories"
              value={formData.disabilityCategory}
              onChange={(value) => handleInputChange('disabilityCategory', value)}
              label="Категория инвалидности"
              placeholder="Выберите категорию инвалидности"
            />

            <DirectoryMultiSelect
              directoryName="compensationReasonList"
              values={formData.compensationReasons}
              onChange={(values) => handleInputChange('compensationReasons', values)}
              label="Основания для компенсаций"
              placeholder="Выберите основания"
            />

            <DirectoryMultiSelect
              directoryName="compensationTypeList"
              values={formData.compensationTypes}
              onChange={(values) => handleInputChange('compensationTypes', values)}
              label="Типы компенсаций"
              placeholder="Выберите типы компенсаций"
            />
          </div>
        </section>

        {/* Кнопки */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-200">
          <button
            type="button"
            className="px-6 py-3 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
          >
            Отправить заявление
          </button>
        </div>
      </form>
    </div>
  );
};
