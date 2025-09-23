'use client';

import { useState, useEffect } from 'react';
import { InspectionFamilyMember } from '@/lib/types';

interface InspectionReportFormProps {
  inspectionId: number;
  applicationId: number;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export default function InspectionReportForm({ 
  inspectionId, 
  applicationId, 
  onSubmit, 
  onCancel, 
  initialData 
}: InspectionReportFormProps) {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    // 1. Общие сведения
    reportNumber: '',
    reportDate: new Date().toISOString().split('T')[0],
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: new Date().toTimeString().slice(0, 5),
    livingAddress: '',
    registrationAddress: '',
    regionalStatus: 'OTHER' as 'HIGH_MOUNTAIN' | 'REMOTE' | 'BORDER' | 'OTHER',
    regionalStatusOther: '',

    // 2. Данные о заявителе
    applicantFullName: '',
    applicantPin: '',
    applicantBirthDate: '',
    identityDocument: {
      series: '',
      number: '',
      issuedBy: ''
    },
    contactPhone: '',

    // 3. Состав семьи
    actualFamilyMembers: [] as Omit<InspectionFamilyMember, 'id'>[],

    // 4. Жилищные условия
    housingConditions: {
      type: 'HOUSE' as 'HOUSE' | 'APARTMENT' | 'RENTAL' | 'DORMITORY' | 'OTHER',
      typeOther: '',
      ownership: 'OWNED' as 'OWNED' | 'RENTED' | 'TEMPORARY',
      area: 0,
      roomsCount: 0,
      utilities: {
        waterSupply: false,
        electricity: false,
        heating: 'NONE' as 'CENTRAL' | 'STOVE' | 'NONE'
      },
      sanitaryConditions: '',
      generalAssessment: ''
    },

    // 5. Доходы и источники средств
    incomeSources: {
      mainIncome: '',
      additionalIncome: '',
      supportingDocuments: [] as string[]
    },

    // 6. Земельные участки и имущество
    property: {
      landPlot: {
        exists: false,
        type: 'HOUSEHOLD' as 'HOUSEHOLD' | 'AGRICULTURAL',
        area: 0,
        usage: ''
      },
      livestock: {
        cattle: 0,
        smallCattle: 0,
        other: ''
      },
      vehicles: {
        hasVehicle: false,
        makeModel: ''
      },
      realEstate: '',
      bankDeposits: {
        hasDeposits: false,
        amount: 0
      }
    },

    // 7. Выводы специалиста
    specialistConclusions: {
      familyCompositionMatches: false,
      livingConditions: '',
      incomeLevel: '',
      meetsCriteria: 'REQUIRES_ADDITIONAL_CHECK' as 'YES' | 'NO' | 'REQUIRES_ADDITIONAL_CHECK',
      rejectionReason: ''
    },

    // 8. Подписи
    signatures: {
      specialist: {
        fullName: '',
        position: '',
        signature: ''
      },
      supervisor: {
        fullName: '',
        signature: ''
      },
      applicant: {
        fullName: '',
        signature: ''
      }
    },

    // 9. Приложения
    attachments: {
      hasPhotos: false,
      hasDocumentCopies: false,
      hasOtherMaterials: false
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: subChild ? {
            ...(prev[parent as keyof typeof prev] as any)[child],
            [subChild]: isCheckbox ? checked : value
          } : (isCheckbox ? checked : value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: isCheckbox ? checked : value
      }));
    }
  };

  const handleFamilyMemberChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      actualFamilyMembers: prev.actualFamilyMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      actualFamilyMembers: [...prev.actualFamilyMembers, {
        fullName: '',
        gender: 'M' as 'M' | 'F',
        birthDate: '',
        pin: '',
        document: '',
        relation: '',
        citizenship: '',
        specialStatus: ''
      }]
    }));
  };

  const removeFamilyMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actualFamilyMembers: prev.actualFamilyMembers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      inspectionId,
      applicationId
    });
  };

  const sections = [
    { id: 1, title: 'Общие сведения', icon: 'ri-file-text-line' },
    { id: 2, title: 'Данные о заявителе', icon: 'ri-user-line' },
    { id: 3, title: 'Состав семьи', icon: 'ri-group-line' },
    { id: 4, title: 'Жилищные условия', icon: 'ri-home-line' },
    { id: 5, title: 'Доходы и источники средств', icon: 'ri-money-dollar-circle-line' },
    { id: 6, title: 'Земельные участки и имущество', icon: 'ri-landscape-line' },
    { id: 7, title: 'Выводы специалиста', icon: 'ri-file-list-3-line' },
    { id: 8, title: 'Подписи', icon: 'ri-edit-line' },
    { id: 9, title: 'Приложения', icon: 'ri-attachment-line' }
  ];

  const renderSection1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">№ акта проверки</label>
          <input
            type="text"
            name="reportNumber"
            value={formData.reportNumber}
            onChange={handleChange}
            className="form-input"
            placeholder="Автоматически генерируется"
            readOnly
          />
        </div>
        <div>
          <label className="form-label">Дата составления</label>
          <input
            type="date"
            name="reportDate"
            value={formData.reportDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Дата визита</label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">Время визита</label>
          <input
            type="time"
            name="visitTime"
            value={formData.visitTime}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>

      <div>
        <label className="form-label">Адрес проживания семьи</label>
        <textarea
          name="livingAddress"
          value={formData.livingAddress}
          onChange={handleChange}
          className="form-textarea"
          rows={2}
          placeholder="Полный адрес проживания семьи"
          required
        />
      </div>

      <div>
        <label className="form-label">Адрес регистрации (по прописке)</label>
        <textarea
          name="registrationAddress"
          value={formData.registrationAddress}
          onChange={handleChange}
          className="form-textarea"
          rows={2}
          placeholder="Адрес по прописке"
          required
        />
      </div>

      <div>
        <label className="form-label">Региональный статус территории</label>
        <div className="space-y-2">
          {[
            { value: 'HIGH_MOUNTAIN', label: 'Высокогорная зона' },
            { value: 'REMOTE', label: 'Отдалённая зона' },
            { value: 'BORDER', label: 'Приграничная территория (особый статус)' },
            { value: 'OTHER', label: 'Другое' }
          ].map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="regionalStatus"
                value={option.value}
                checked={formData.regionalStatus === option.value}
                onChange={handleChange}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
          {formData.regionalStatus === 'OTHER' && (
            <input
              type="text"
              name="regionalStatusOther"
              value={formData.regionalStatusOther}
              onChange={handleChange}
              className="form-input mt-2"
              placeholder="Укажите статус территории"
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      <div>
        <label className="form-label">ФИО заявителя</label>
        <input
          type="text"
          name="applicantFullName"
          value={formData.applicantFullName}
          onChange={handleChange}
          className="form-input"
          placeholder="Полное ФИО заявителя"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">ПИН</label>
          <input
            type="text"
            name="applicantPin"
            value={formData.applicantPin}
            onChange={handleChange}
            className="form-input"
            placeholder="14-16 цифр"
            maxLength={16}
            required
          />
        </div>
        <div>
          <label className="form-label">Дата рождения</label>
          <input
            type="date"
            name="applicantBirthDate"
            value={formData.applicantBirthDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="form-label">Серия документа</label>
          <input
            type="text"
            name="identityDocument.series"
            value={formData.identityDocument.series}
            onChange={handleChange}
            className="form-input"
            placeholder="Серия"
            required
          />
        </div>
        <div>
          <label className="form-label">Номер документа</label>
          <input
            type="text"
            name="identityDocument.number"
            value={formData.identityDocument.number}
            onChange={handleChange}
            className="form-input"
            placeholder="Номер"
            required
          />
        </div>
        <div>
          <label className="form-label">Выдан</label>
          <input
            type="text"
            name="identityDocument.issuedBy"
            value={formData.identityDocument.issuedBy}
            onChange={handleChange}
            className="form-input"
            placeholder="Кем выдан"
            required
          />
        </div>
      </div>

      <div>
        <label className="form-label">Контактный телефон</label>
        <input
          type="tel"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
          className="form-input"
          placeholder="+996 (XXX) XXX-XXX"
          required
        />
      </div>
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Состав семьи (фактически проживающих)</h3>
        <button
          type="button"
          onClick={addFamilyMember}
          className="btn-primary"
        >
          <i className="ri-add-line mr-2"></i>
          Добавить члена семьи
        </button>
      </div>

      <div className="space-y-4">
        {formData.actualFamilyMembers.map((member, index) => (
          <div key={index} className="border border-neutral-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Член семьи #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeFamilyMember(index)}
                className="text-red-600 hover:text-red-800"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="form-label">ФИО</label>
                <input
                  type="text"
                  value={member.fullName}
                  onChange={(e) => handleFamilyMemberChange(index, 'fullName', e.target.value)}
                  className="form-input"
                  placeholder="Полное ФИО"
                />
              </div>
              <div>
                <label className="form-label">Пол</label>
                <select
                  value={member.gender}
                  onChange={(e) => handleFamilyMemberChange(index, 'gender', e.target.value)}
                  className="form-select"
                >
                  <option value="M">Мужской</option>
                  <option value="F">Женский</option>
                </select>
              </div>
              <div>
                <label className="form-label">Дата рождения</label>
                <input
                  type="date"
                  value={member.birthDate}
                  onChange={(e) => handleFamilyMemberChange(index, 'birthDate', e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">ПИН</label>
                <input
                  type="text"
                  value={member.pin}
                  onChange={(e) => handleFamilyMemberChange(index, 'pin', e.target.value)}
                  className="form-input"
                  placeholder="14-16 цифр"
                />
              </div>
              <div>
                <label className="form-label">Документ</label>
                <input
                  type="text"
                  value={member.document}
                  onChange={(e) => handleFamilyMemberChange(index, 'document', e.target.value)}
                  className="form-input"
                  placeholder="Паспорт/свидетельство"
                />
              </div>
              <div>
                <label className="form-label">Родство</label>
                <input
                  type="text"
                  value={member.relation}
                  onChange={(e) => handleFamilyMemberChange(index, 'relation', e.target.value)}
                  className="form-input"
                  placeholder="Супруг, ребенок, родитель"
                />
              </div>
              <div>
                <label className="form-label">Гражданство</label>
                <input
                  type="text"
                  value={member.citizenship}
                  onChange={(e) => handleFamilyMemberChange(index, 'citizenship', e.target.value)}
                  className="form-input"
                  placeholder="KG, RU, etc."
                />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Особый статус</label>
                <input
                  type="text"
                  value={member.specialStatus || ''}
                  onChange={(e) => handleFamilyMemberChange(index, 'specialStatus', e.target.value)}
                  className="form-input"
                  placeholder="Инвалид, пенсионер, студент и т.д."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSection4 = () => (
    <div className="space-y-6">
      <div>
        <label className="form-label">Тип жилья</label>
        <div className="space-y-2">
          {[
            { value: 'HOUSE', label: 'Дом' },
            { value: 'APARTMENT', label: 'Квартира' },
            { value: 'RENTAL', label: 'Съемное жильё' },
            { value: 'DORMITORY', label: 'Общежитие' },
            { value: 'OTHER', label: 'Другое' }
          ].map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="housingConditions.type"
                value={option.value}
                checked={formData.housingConditions.type === option.value}
                onChange={handleChange}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
          {formData.housingConditions.type === 'OTHER' && (
            <input
              type="text"
              name="housingConditions.typeOther"
              value={formData.housingConditions.typeOther}
              onChange={handleChange}
              className="form-input mt-2"
              placeholder="Укажите тип жилья"
            />
          )}
        </div>
      </div>

      <div>
        <label className="form-label">Право собственности</label>
        <div className="space-y-2">
          {[
            { value: 'OWNED', label: 'Собственность' },
            { value: 'RENTED', label: 'Аренда' },
            { value: 'TEMPORARY', label: 'Временное проживание' }
          ].map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="housingConditions.ownership"
                value={option.value}
                checked={formData.housingConditions.ownership === option.value}
                onChange={handleChange}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Площадь жилья (кв.м.)</label>
          <input
            type="number"
            name="housingConditions.area"
            value={formData.housingConditions.area}
            onChange={handleChange}
            className="form-input"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="form-label">Количество комнат</label>
          <input
            type="number"
            name="housingConditions.roomsCount"
            value={formData.housingConditions.roomsCount}
            onChange={handleChange}
            className="form-input"
            min="0"
            required
          />
        </div>
      </div>

      <div>
        <label className="form-label">Наличие коммуникаций</label>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="housingConditions.utilities.waterSupply"
                checked={formData.housingConditions.utilities.waterSupply}
                onChange={handleChange}
                className="mr-2"
              />
              Водоснабжение
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="housingConditions.utilities.electricity"
                checked={formData.housingConditions.utilities.electricity}
                onChange={handleChange}
                className="mr-2"
              />
              Электричество
            </label>
          </div>
          <div>
            <label className="form-label">Отопление</label>
            <div className="space-y-2">
              {[
                { value: 'CENTRAL', label: 'Центральное' },
                { value: 'STOVE', label: 'Печное' },
                { value: 'NONE', label: 'Нет' }
              ].map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="housingConditions.utilities.heating"
                    value={option.value}
                    checked={formData.housingConditions.utilities.heating === option.value}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="form-label">Санитарные условия</label>
        <textarea
          name="housingConditions.sanitaryConditions"
          value={formData.housingConditions.sanitaryConditions}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Описание санитарных условий"
        />
      </div>

      <div>
        <label className="form-label">Общая оценка жилищных условий</label>
        <textarea
          name="housingConditions.generalAssessment"
          value={formData.housingConditions.generalAssessment}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Общая оценка условий проживания"
        />
      </div>
    </div>
  );

  const renderSection5 = () => (
    <div className="space-y-6">
      <div>
        <label className="form-label">Основные доходы семьи</label>
        <textarea
          name="incomeSources.mainIncome"
          value={formData.incomeSources.mainIncome}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Зарплата, пенсия, стипендия, пособия"
        />
      </div>

      <div>
        <label className="form-label">Дополнительные доходы</label>
        <textarea
          name="incomeSources.additionalIncome"
          value={formData.incomeSources.additionalIncome}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Алименты, предпринимательство, помощь, вклады"
        />
      </div>

      <div>
        <label className="form-label">Наличие подтверждающих документов</label>
        <div className="space-y-2">
          {[
            'Справка о доходах',
            'Справка из ГНС',
            'Справка из Соцфонда'
          ].map(doc => (
            <label key={doc} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.incomeSources.supportingDocuments.includes(doc)}
                onChange={(e) => {
                  const newDocs = e.target.checked
                    ? [...formData.incomeSources.supportingDocuments, doc]
                    : formData.incomeSources.supportingDocuments.filter(d => d !== doc);
                  setFormData(prev => ({
                    ...prev,
                    incomeSources: {
                      ...prev.incomeSources,
                      supportingDocuments: newDocs
                    }
                  }));
                }}
                className="mr-2"
              />
              {doc}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSection6 = () => (
    <div className="space-y-6">
      <div>
        <label className="form-label">Земельный участок</label>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.property.landPlot.exists}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                property: {
                  ...prev.property,
                  landPlot: {
                    ...prev.property.landPlot,
                    exists: e.target.checked
                  }
                }
              }))}
              className="mr-2"
            />
            Есть земельный участок
          </label>

          {formData.property.landPlot.exists && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
              <div>
                <label className="form-label">Тип</label>
                <select
                  value={formData.property.landPlot.type || 'HOUSEHOLD'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    property: {
                      ...prev.property,
                      landPlot: {
                        ...prev.property.landPlot,
                        type: e.target.value as 'HOUSEHOLD' | 'AGRICULTURAL'
                      }
                    }
                  }))}
                  className="form-select"
                >
                  <option value="HOUSEHOLD">Приусадебный</option>
                  <option value="AGRICULTURAL">С/хозяйственный</option>
                </select>
              </div>
              <div>
                <label className="form-label">Площадь (соток)</label>
                <input
                  type="number"
                  value={formData.property.landPlot.area || 0}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    property: {
                      ...prev.property,
                      landPlot: {
                        ...prev.property.landPlot,
                        area: parseFloat(e.target.value) || 0
                      }
                    }
                  }))}
                  className="form-input"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="form-label">Использование</label>
                <input
                  type="text"
                  value={formData.property.landPlot.usage || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    property: {
                      ...prev.property,
                      landPlot: {
                        ...prev.property.landPlot,
                        usage: e.target.value
                      }
                    }
                  }))}
                  className="form-input"
                  placeholder="Как используется"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="form-label">Сельхозживотные</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">КРС (голов)</label>
            <input
              type="number"
              value={formData.property.livestock.cattle}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                property: {
                  ...prev.property,
                  livestock: {
                    ...prev.property.livestock,
                    cattle: parseInt(e.target.value) || 0
                  }
                }
              }))}
              className="form-input"
              min="0"
            />
          </div>
          <div>
            <label className="form-label">МРС (голов)</label>
            <input
              type="number"
              value={formData.property.livestock.smallCattle}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                property: {
                  ...prev.property,
                  livestock: {
                    ...prev.property.livestock,
                    smallCattle: parseInt(e.target.value) || 0
                  }
                }
              }))}
              className="form-input"
              min="0"
            />
          </div>
          <div>
            <label className="form-label">Другое</label>
            <input
              type="text"
              value={formData.property.livestock.other}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                property: {
                  ...prev.property,
                  livestock: {
                    ...prev.property.livestock,
                    other: e.target.value
                  }
                }
              }))}
              className="form-input"
              placeholder="Другие животные"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="form-label">Автотранспорт</label>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.property.vehicles.hasVehicle}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                property: {
                  ...prev.property,
                  vehicles: {
                    ...prev.property.vehicles,
                    hasVehicle: e.target.checked
                  }
                }
              }))}
              className="mr-2"
            />
            Есть автотранспорт
          </label>

          {formData.property.vehicles.hasVehicle && (
            <div className="ml-6">
              <label className="form-label">Марка/модель</label>
              <input
                type="text"
                value={formData.property.vehicles.makeModel || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  property: {
                    ...prev.property,
                    vehicles: {
                      ...prev.property.vehicles,
                      makeModel: e.target.value
                    }
                  }
                }))}
                className="form-input"
                placeholder="Марка и модель автомобиля"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="form-label">Недвижимость (дополнительно)</label>
        <textarea
          value={formData.property.realEstate}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            property: {
              ...prev.property,
              realEstate: e.target.value
            }
          }))}
          className="form-textarea"
          rows={2}
          placeholder="Дополнительная недвижимость"
        />
      </div>

      <div>
        <label className="form-label">Вклады в банках</label>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.property.bankDeposits.hasDeposits}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                property: {
                  ...prev.property,
                  bankDeposits: {
                    ...prev.property.bankDeposits,
                    hasDeposits: e.target.checked
                  }
                }
              }))}
              className="mr-2"
            />
            Есть вклады в банках
          </label>

          {formData.property.bankDeposits.hasDeposits && (
            <div className="ml-6">
              <label className="form-label">Сумма (сом)</label>
              <input
                type="number"
                value={formData.property.bankDeposits.amount || 0}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  property: {
                    ...prev.property,
                    bankDeposits: {
                      ...prev.property.bankDeposits,
                      amount: parseFloat(e.target.value) || 0
                    }
                  }
                }))}
                className="form-input"
                min="0"
                step="0.01"
                placeholder="Сумма вкладов"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSection7 = () => (
    <div className="space-y-6">
      <div>
        <label className="form-label">Фактический состав семьи</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="specialistConclusions.familyCompositionMatches"
              value="true"
              checked={formData.specialistConclusions.familyCompositionMatches === true}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                specialistConclusions: {
                  ...prev.specialistConclusions,
                  familyCompositionMatches: e.target.value === 'true'
                }
              }))}
              className="mr-2"
            />
            Соответствует заявленным данным
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="specialistConclusions.familyCompositionMatches"
              value="false"
              checked={formData.specialistConclusions.familyCompositionMatches === false}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                specialistConclusions: {
                  ...prev.specialistConclusions,
                  familyCompositionMatches: e.target.value === 'true'
                }
              }))}
              className="mr-2"
            />
            Не соответствует заявленным данным
          </label>
        </div>
      </div>

      <div>
        <label className="form-label">Условия проживания</label>
        <textarea
          name="specialistConclusions.livingConditions"
          value={formData.specialistConclusions.livingConditions}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Описание условий проживания"
        />
      </div>

      <div>
        <label className="form-label">Уровень доходов</label>
        <textarea
          name="specialistConclusions.incomeLevel"
          value={formData.specialistConclusions.incomeLevel}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Оценка уровня доходов семьи"
        />
      </div>

      <div>
        <label className="form-label">Соответствие критериям назначения УБК</label>
        <div className="space-y-2">
          {[
            { value: 'YES', label: 'Да (рекомендуется назначить пособие)' },
            { value: 'NO', label: 'Нет (основание для отказа)' },
            { value: 'REQUIRES_ADDITIONAL_CHECK', label: 'Требуется дополнительная проверка / документы' }
          ].map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="specialistConclusions.meetsCriteria"
                value={option.value}
                checked={formData.specialistConclusions.meetsCriteria === option.value}
                onChange={handleChange}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {formData.specialistConclusions.meetsCriteria === 'NO' && (
        <div>
          <label className="form-label">Основание для отказа</label>
          <textarea
            name="specialistConclusions.rejectionReason"
            value={formData.specialistConclusions.rejectionReason}
            onChange={handleChange}
            className="form-textarea"
            rows={3}
            placeholder="Укажите причины отказа"
          />
        </div>
      )}
    </div>
  );

  const renderSection8 = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-4">Специалист, проводивший проверку</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">ФИО</label>
            <input
              type="text"
              name="signatures.specialist.fullName"
              value={formData.signatures.specialist.fullName}
              onChange={handleChange}
              className="form-input"
              placeholder="Полное ФИО специалиста"
              required
            />
          </div>
          <div>
            <label className="form-label">Должность</label>
            <input
              type="text"
              name="signatures.specialist.position"
              value={formData.signatures.specialist.position}
              onChange={handleChange}
              className="form-input"
              placeholder="Должность специалиста"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="form-label">Подпись</label>
          <input
            type="text"
            name="signatures.specialist.signature"
            value={formData.signatures.specialist.signature}
            onChange={handleChange}
            className="form-input"
            placeholder="Подпись специалиста"
          />
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Руководитель территориального подразделения (при необходимости)</h4>
        <div className="space-y-4">
          <div>
            <label className="form-label">ФИО</label>
            <input
              type="text"
              name="signatures.supervisor.fullName"
              value={formData.signatures.supervisor.fullName}
              onChange={handleChange}
              className="form-input"
              placeholder="ФИО руководителя"
            />
          </div>
          <div>
            <label className="form-label">Подпись</label>
            <input
              type="text"
              name="signatures.supervisor.signature"
              value={formData.signatures.supervisor.signature}
              onChange={handleChange}
              className="form-input"
              placeholder="Подпись руководителя"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Заявитель (ознакомлен с актом)</h4>
        <div className="space-y-4">
          <div>
            <label className="form-label">ФИО</label>
            <input
              type="text"
              name="signatures.applicant.fullName"
              value={formData.signatures.applicant.fullName}
              onChange={handleChange}
              className="form-input"
              placeholder="ФИО заявителя"
              required
            />
          </div>
          <div>
            <label className="form-label">Подпись</label>
            <input
              type="text"
              name="signatures.applicant.signature"
              value={formData.signatures.applicant.signature}
              onChange={handleChange}
              className="form-input"
              placeholder="Подпись заявителя"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection9 = () => (
    <div className="space-y-6">
      <div>
        <label className="form-label">Приложения (при наличии)</label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="attachments.hasPhotos"
              checked={formData.attachments.hasPhotos}
              onChange={handleChange}
              className="mr-2"
            />
            Фотофиксация жилья и имущества
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="attachments.hasDocumentCopies"
              checked={formData.attachments.hasDocumentCopies}
              onChange={handleChange}
              className="mr-2"
            />
            Копии подтверждающих документов
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="attachments.hasOtherMaterials"
              checked={formData.attachments.hasOtherMaterials}
              onChange={handleChange}
              className="mr-2"
            />
            Иные материалы
          </label>
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1: return renderSection1();
      case 2: return renderSection2();
      case 3: return renderSection3();
      case 4: return renderSection4();
      case 5: return renderSection5();
      case 6: return renderSection6();
      case 7: return renderSection7();
      case 8: return renderSection8();
      case 9: return renderSection9();
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Акт выездной проверки условий проживания семьи
        </h2>
        <p className="text-neutral-600">
          Получатель ежемесячного пособия «Үй-бүлөгө көмөк» (УБК)
        </p>
      </div>

      {/* Навигация по разделам */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <i className={`${section.icon} mr-2`}></i>
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              {sections.find(s => s.id === currentSection)?.title}
            </h3>
          </div>
          
          {renderCurrentSection()}
        </div>

        {/* Навигация */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
            disabled={currentSection === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Назад
          </button>

          <div className="flex space-x-3">
            {currentSection < 9 ? (
              <button
                type="button"
                onClick={() => setCurrentSection(Math.min(9, currentSection + 1))}
                className="btn-primary"
              >
                Далее
                <i className="ri-arrow-right-line ml-2"></i>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn-secondary"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <i className="ri-save-line mr-2"></i>
                  Сохранить акт
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
