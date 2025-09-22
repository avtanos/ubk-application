'use client';

import { useState } from 'react';
import { 
  MSEKData, 
  GRSPassportData, 
  GRSCivilRegistryData, 
  GRSAddressData, 
  GRSVehicleData,
  ISRTEmploymentData,
  SFPensionData,
  SFWorkPeriodsData,
  VeterinaryData,
  GNSPatentData,
  GNSIndividualEntrepreneurData,
  CadastreData,
  GKDOVeteranData,
  ExternalServiceResponse
} from '@/lib/externalServices';

interface ExternalDataViewerProps {
  language: string;
  data: {
    msek: ExternalServiceResponse<MSEKData>;
    grsPassport: ExternalServiceResponse<GRSPassportData>;
    grsCivilRegistry: ExternalServiceResponse<GRSCivilRegistryData>;
    grsAddress: ExternalServiceResponse<GRSAddressData>;
    grsVehicles: ExternalServiceResponse<GRSVehicleData[]>;
    isrtEmployment: ExternalServiceResponse<ISRTEmploymentData>;
    sfPension: ExternalServiceResponse<SFPensionData>;
    sfWorkPeriods: ExternalServiceResponse<SFWorkPeriodsData>;
    veterinary: ExternalServiceResponse<VeterinaryData>;
    gnsPatent: ExternalServiceResponse<GNSPatentData[]>;
    gnsIndividualEntrepreneur: ExternalServiceResponse<GNSIndividualEntrepreneurData>;
    cadastre: ExternalServiceResponse<CadastreData>;
    gkdoVOV: ExternalServiceResponse<GKDOVeteranData>;
    gkdoChernobyl: ExternalServiceResponse<GKDOVeteranData>;
    gkdoAfghan: ExternalServiceResponse<GKDOVeteranData>;
  };
}

export default function ExternalDataViewer({ language, data }: ExternalDataViewerProps) {
  const [activeTab, setActiveTab] = useState('msek');

  const tabs = [
    { id: 'msek', name: language === 'ru' ? 'МСЭК' : 'МСЭК', icon: 'ri-hospital-line' },
    { id: 'grsPassport', name: language === 'ru' ? 'ГРС: Паспорт' : 'ГРС: Паспорт', icon: 'ri-passport-line' },
    { id: 'grsCivilRegistry', name: language === 'ru' ? 'ГРС: ЗАГС' : 'ГРС: ЗАГС', icon: 'ri-user-heart-line' },
    { id: 'grsAddress', name: language === 'ru' ? 'ГРС: Адрес' : 'ГРС: Дарек', icon: 'ri-map-pin-line' },
    { id: 'grsVehicles', name: language === 'ru' ? 'ГРС: Транспорт' : 'ГРС: Транспорт', icon: 'ri-car-line' },
    { id: 'isrtEmployment', name: language === 'ru' ? 'ИСРТ: Занятость' : 'ИСРТ: Жумуш', icon: 'ri-briefcase-line' },
    { id: 'sfPension', name: language === 'ru' ? 'СФ: Пенсия' : 'СФ: Пенсия', icon: 'ri-money-dollar-circle-line' },
    { id: 'sfWorkPeriods', name: language === 'ru' ? 'СФ: Периоды работы' : 'СФ: Жумуш мезгилдери', icon: 'ri-calendar-line' },
    { id: 'veterinary', name: language === 'ru' ? 'Ветеринария' : 'Ветеринария', icon: 'ri-cow-line' },
    { id: 'gnsPatent', name: language === 'ru' ? 'ГНС: Патенты' : 'ГНС: Патенттер', icon: 'ri-award-line' },
    { id: 'gnsIndividualEntrepreneur', name: language === 'ru' ? 'ГНС: ИП' : 'ГНС: ЖК', icon: 'ri-user-line' },
    { id: 'cadastre', name: language === 'ru' ? 'Кадастр' : 'Кадастр', icon: 'ri-home-line' },
    { id: 'gkdoVOV', name: language === 'ru' ? 'ГКДО: ВОВ' : 'ГКДО: ВОВ', icon: 'ri-medal-line' },
    { id: 'gkdoChernobyl', name: language === 'ru' ? 'ГКДО: ЧАЭС' : 'ГКДО: ЧАЭС', icon: 'ri-radar-line' },
    { id: 'gkdoAfghan', name: language === 'ru' ? 'ГКДО: Афганцы' : 'ГКДО: Афгандыктар', icon: 'ri-shield-line' }
  ];

  const renderData = () => {
    const currentData = data[activeTab as keyof typeof data];
    
    if (!currentData) return null;

    if (!currentData.isSuccess) {
      return (
        <div className="text-center py-8">
          <i className="ri-error-warning-line text-4xl text-red-500 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {language === 'ru' ? 'Ошибка получения данных' : 'Маалымат алуу катасы'}
          </h3>
          <p className="text-gray-600">{currentData.errorMessage}</p>
        </div>
      );
    }

    if (!currentData.data) {
      return (
        <div className="text-center py-8">
          <i className="ri-information-line text-4xl text-blue-500 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {language === 'ru' ? 'Данные не найдены' : 'Маалымат табылган жок'}
          </h3>
          <p className="text-gray-600">
            {language === 'ru' 
              ? 'По указанному ПИН данные не найдены в системе'
              : 'Көрсөтүлгөн ПИН боюнча системада маалымат табылган жок'}
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'msek':
        return renderMSEKData(currentData.data as MSEKData);
      case 'grsPassport':
        return renderGRSPassportData(currentData.data as GRSPassportData);
      case 'grsCivilRegistry':
        return renderGRSCivilRegistryData(currentData.data as GRSCivilRegistryData);
      case 'grsAddress':
        return renderGRSAddressData(currentData.data as GRSAddressData);
      case 'grsVehicles':
        return renderGRSVehiclesData(currentData.data as GRSVehicleData[]);
      case 'isrtEmployment':
        return renderISRTEmploymentData(currentData.data as ISRTEmploymentData);
      case 'sfPension':
        return renderSFPensionData(currentData.data as SFPensionData);
      case 'sfWorkPeriods':
        return renderSFWorkPeriodsData(currentData.data as SFWorkPeriodsData);
      case 'veterinary':
        return renderVeterinaryData(currentData.data as VeterinaryData);
      case 'gnsPatent':
        return renderGNSPatentData(currentData.data as GNSPatentData[]);
      case 'gnsIndividualEntrepreneur':
        return renderGNSIndividualEntrepreneurData(currentData.data as GNSIndividualEntrepreneurData);
      case 'cadastre':
        return renderCadastreData(currentData.data as CadastreData);
      case 'gkdoVOV':
      case 'gkdoChernobyl':
      case 'gkdoAfghan':
        return renderGKDOVeteranData(currentData.data as GKDOVeteranData);
      default:
        return null;
    }
  };

  const renderMSEKData = (data: MSEKData) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">
            {language === 'ru' ? 'Организация' : 'Уюм'}
          </h4>
          <p className="text-blue-800">{data.organizationName}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">
            {language === 'ru' ? 'Группа инвалидности' : 'Инвалиддик тобу'}
          </h4>
          <p className="text-green-800">{data.disabilityGroup}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">
            {language === 'ru' ? 'Дата освидетельствования' : 'Текшерүү күнү'}
          </h4>
          <p className="text-yellow-800">{new Date(data.examinationDate).toLocaleDateString()}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2">
            {language === 'ru' ? 'Период действия' : 'Жарактуулук мезгили'}
          </h4>
          <p className="text-purple-800">
            {new Date(data.from).toLocaleDateString()} - {new Date(data.to).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

  const renderGRSPassportData = (data: GRSPassportData) => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">
          {language === 'ru' ? 'Личные данные' : 'Жеке маалыматтар'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800">
          <p><strong>{language === 'ru' ? 'ФИО:' : 'Аты-жөнү:'}</strong> {data.surname} {data.name} {data.patronymic}</p>
          <p><strong>{language === 'ru' ? 'ПИН:' : 'ПИН:'}</strong> {data.pin}</p>
          <p><strong>{language === 'ru' ? 'Дата рождения:' : 'Туулган күнү:'}</strong> {new Date(data.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>{language === 'ru' ? 'Национальность:' : 'Улуту:'}</strong> {data.nationality}</p>
        </div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">
          {language === 'ru' ? 'Паспортные данные' : 'Паспорт маалыматтары'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-green-800">
          <p><strong>{language === 'ru' ? 'Серия и номер:' : 'Серия жана номуру:'}</strong> {data.passportSeries} {data.passportNumber}</p>
          <p><strong>{language === 'ru' ? 'Дата выдачи:' : 'Чыгарылган күнү:'}</strong> {new Date(data.issuedDate).toLocaleDateString()}</p>
          <p><strong>{language === 'ru' ? 'Действует до:' : 'Жарактуулугу:'}</strong> {new Date(data.expiredDate).toLocaleDateString()}</p>
          <p><strong>{language === 'ru' ? 'Орган выдачи:' : 'Чыгарган орган:'}</strong> {data.passportAuthority}</p>
        </div>
      </div>
    </div>
  );

  const renderGRSCivilRegistryData = (data: GRSCivilRegistryData) => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">
          {language === 'ru' ? 'Личные данные' : 'Жеке маалыматтар'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800">
          <p><strong>{language === 'ru' ? 'ФИО:' : 'Аты-жөнү:'}</strong> {data.surname} {data.name} {data.patronymic}</p>
          <p><strong>{language === 'ru' ? 'ПИН:' : 'ПИН:'}</strong> {data.pin}</p>
          <p><strong>{language === 'ru' ? 'Семейное положение:' : 'Үй-бүлөлүк абал:'}</strong> {data.maritalStatus}</p>
          <p><strong>{language === 'ru' ? 'Гражданство:' : 'Жарандыгы:'}</strong> {data.citizenship}</p>
        </div>
      </div>
    </div>
  );

  const renderGRSAddressData = (data: GRSAddressData) => (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-semibold text-blue-900 mb-2">
        {language === 'ru' ? 'Адрес фактического проживания' : 'Чыныгы жашаган дареки'}
      </h4>
      <div className="text-blue-800">
        <p>{data.state}, {data.region}, {data.district}</p>
        <p>{data.city}, {data.street}, {data.house}{data.flat ? `, кв. ${data.flat}` : ''}</p>
      </div>
    </div>
  );

  const renderGRSVehiclesData = (vehicles: GRSVehicleData[]) => (
    <div className="space-y-4">
      {vehicles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {language === 'ru' ? 'Транспортные средства не найдены' : 'Транспорт каражаттары табылган жок'}
        </div>
      ) : (
        vehicles.map((vehicle, index) => (
          <div key={index} className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              {language === 'ru' ? `Транспортное средство ${index + 1}` : `Транспорт каражаты ${index + 1}`}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800">
              <p><strong>{language === 'ru' ? 'Госномер:' : 'Госномер:'}</strong> {vehicle.govPlate}</p>
              <p><strong>{language === 'ru' ? 'Марка/Модель:' : 'Марка/Модель:'}</strong> {vehicle.vehicleBrand} {vehicle.vehicleModel}</p>
              <p><strong>{language === 'ru' ? 'Год выпуска:' : 'Чыгарылган жылы:'}</strong> {vehicle.vehicleYear}</p>
              <p><strong>{language === 'ru' ? 'Тип:' : 'Түрү:'}</strong> {vehicle.carTypeName}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderISRTEmploymentData = (data: ISRTEmploymentData) => (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${data.regStatus === 1 ? 'bg-red-50' : 'bg-green-50'}`}>
        <h4 className={`font-semibold mb-2 ${data.regStatus === 1 ? 'text-red-900' : 'text-green-900'}`}>
          {language === 'ru' ? 'Статус занятости' : 'Жумуш абалы'}
        </h4>
        <div className={`text-sm ${data.regStatus === 1 ? 'text-red-800' : 'text-green-800'}`}>
          {data.regStatus === -1 && (language === 'ru' ? 'Отсутствует регистрация' : 'Каттоо жок')}
          {data.regStatus === 0 && (language === 'ru' ? 'Есть регистрация, но нет статуса безработного' : 'Каттоо бар, бирок жумушсуздук статусу жок')}
          {data.regStatus === 1 && (language === 'ru' ? 'Официальный безработный' : 'Расмий жумушсуз')}
        </div>
      </div>
      
      {data.registrationDate && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">
            {language === 'ru' ? 'Даты регистрации' : 'Каттоо күндөрү'}
          </h4>
          <div className="text-blue-800">
            <p><strong>{language === 'ru' ? 'Первичная регистрация:' : 'Баштапкы каттоо:'}</strong> {new Date(data.registrationDate).toLocaleDateString()}</p>
            {data.statusDate && (
              <p><strong>{language === 'ru' ? 'Получение статуса:' : 'Статус алуу:'}</strong> {new Date(data.statusDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderSFPensionData = (data: SFPensionData) => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">
          {language === 'ru' ? 'Информация о пенсионере' : 'Пенсионер маалыматы'}
        </h4>
        <div className="text-blue-800">
          <p><strong>{language === 'ru' ? 'ФИО:' : 'Аты-жөнү:'}</strong> {data.pinInfo.fullName}</p>
          <p><strong>{language === 'ru' ? 'ПИН:' : 'ПИН:'}</strong> {data.pinInfo.pin}</p>
        </div>
      </div>
      
      {data.dossierInfo.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">
            {language === 'ru' ? 'Пенсионные досье' : 'Пенсия досьелери'}
          </h4>
          {data.dossierInfo.map((dossier, index) => (
            <div key={index} className="bg-green-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-green-800">
                <p><strong>{language === 'ru' ? 'Номер досье:' : 'Досье номуру:'}</strong> {dossier.numDossier}</p>
                <p><strong>{language === 'ru' ? 'Размер пенсии:' : 'Пенсия өлчөмү:'}</strong> {dossier.sum.toLocaleString()} сом</p>
                <p><strong>{language === 'ru' ? 'Вид пенсии:' : 'Пенсия түрү:'}</strong> {dossier.kindOfPension}</p>
                <p><strong>{language === 'ru' ? 'Период:' : 'Мезгил:'}</strong> {new Date(dossier.dateFromInitial).toLocaleDateString()} - {new Date(dossier.dateTo).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSFWorkPeriodsData = (data: SFWorkPeriodsData) => (
    <div className="space-y-4">
      {data.workPeriods.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {language === 'ru' ? 'Периоды работы не найдены' : 'Жумуш мезгилдери табылган жок'}
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">
            {language === 'ru' ? 'Периоды работы' : 'Жумуш мезгилдери'}
          </h4>
          {data.workPeriods.map((period, index) => (
            <div key={index} className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800">
                <p><strong>{language === 'ru' ? 'Организация:' : 'Уюм:'}</strong> {period.organizationName}</p>
                <p><strong>{language === 'ru' ? 'Должность:' : 'Кызмат:'}</strong> {period.position}</p>
                <p><strong>{language === 'ru' ? 'Период:' : 'Мезгил:'}</strong> {new Date(period.periodFrom).toLocaleDateString()} - {new Date(period.periodTo).toLocaleDateString()}</p>
                <p><strong>{language === 'ru' ? 'Зарплата:' : 'Эмгек акы:'}</strong> {period.salary.toLocaleString()} сом</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderVeterinaryData = (data: VeterinaryData) => (
    <div className="space-y-4">
      {data.animals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {language === 'ru' ? 'Животные не найдены' : 'Жаныбарлар табылган жок'}
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">
            {language === 'ru' ? 'Зарегистрированные животные' : 'Катталган жаныбарлар'}
          </h4>
          {data.animals.map((animal, index) => (
            <div key={index} className="bg-green-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-green-800">
                <p><strong>{language === 'ru' ? 'Тип:' : 'Түрү:'}</strong> {
                  animal.type === 1 ? (language === 'ru' ? 'КРС' : 'КРС') :
                  animal.type === 2 ? (language === 'ru' ? 'Лошади' : 'Аттар') :
                  animal.type === 3 ? (language === 'ru' ? 'МРС' : 'МРС') :
                  animal.type === 4 ? (language === 'ru' ? 'Свиньи' : 'Чочколор') :
                  animal.type === 5 ? (language === 'ru' ? 'Птица' : 'Чымчыктар') :
                  animal.type === 6 ? (language === 'ru' ? 'Пчелы' : 'Аарылар') : 'Неизвестно'
                }</p>
                <p><strong>{language === 'ru' ? 'Пол:' : 'Жынысы:'}</strong> {animal.gender === 't' ? (language === 'ru' ? 'Самец' : 'Эркек') : (language === 'ru' ? 'Самка' : 'Ургаачы')}</p>
                <p><strong>{language === 'ru' ? 'Возраст:' : 'Жашы:'}</strong> {animal.age} {language === 'ru' ? 'лет' : 'жаш'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGNSPatentData = (patents: GNSPatentData[]) => (
    <div className="space-y-4">
      {patents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {language === 'ru' ? 'Патенты не найдены' : 'Патенттер табылган жок'}
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">
            {language === 'ru' ? 'Патенты' : 'Патенттер'}
          </h4>
          {patents.map((patent, index) => (
            <div key={index} className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800">
                <p><strong>{language === 'ru' ? 'Владелец:' : 'Ээси:'}</strong> {patent.fullName}</p>
                <p><strong>{language === 'ru' ? 'Код ГКЭД:' : 'ГКЭД коду:'}</strong> {patent.gkedCode}</p>
                <p><strong>{language === 'ru' ? 'Период действия:' : 'Жарактуулук мезгили:'}</strong> {new Date(patent.dateFrom).toLocaleDateString()} - {new Date(patent.dateTo).toLocaleDateString()}</p>
                <p><strong>{language === 'ru' ? 'Статус:' : 'Абал:'}</strong> {patent.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGNSIndividualEntrepreneurData = (data: GNSIndividualEntrepreneurData) => (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-semibold text-blue-900 mb-2">
        {language === 'ru' ? 'Индивидуальный предприниматель' : 'Жеке ишкер'}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800">
        <p><strong>{language === 'ru' ? 'ФИО:' : 'Аты-жөнү:'}</strong> {data.lastName} {data.firstName} {data.middleName}</p>
        <p><strong>{language === 'ru' ? 'ИНН:' : 'ИНН:'}</strong> {data.tin}</p>
        <p><strong>{language === 'ru' ? 'Дата регистрации:' : 'Каттоо күнү:'}</strong> {new Date(data.registrationDate).toLocaleDateString()}</p>
        <p><strong>{language === 'ru' ? 'Район:' : 'Район:'}</strong> {data.rayonName}</p>
      </div>
    </div>
  );

  const renderCadastreData = (data: CadastreData) => (
    <div className="space-y-4">
      {data.properties.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {language === 'ru' ? 'Недвижимость не найдена' : 'Кыймылсыз мүлк табылган жок'}
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">
            {language === 'ru' ? 'Недвижимость' : 'Кыймылсыз мүлк'}
          </h4>
          {data.properties.map((property, index) => (
            <div key={index} className="bg-green-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-green-800">
                <p><strong>{language === 'ru' ? 'Тип:' : 'Түрү:'}</strong> {property.type}</p>
                <p><strong>{language === 'ru' ? 'Адрес:' : 'Дарек:'}</strong> {property.address}</p>
                <p><strong>{language === 'ru' ? 'Площадь:' : 'Аянты:'}</strong> {property.area} м²</p>
                <p><strong>{language === 'ru' ? 'Стоимость:' : 'Баасы:'}</strong> {property.value.toLocaleString()} сом</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGKDOVeteranData = (data: GKDOVeteranData) => (
    <div className="space-y-4">
      <div className="bg-red-50 p-4 rounded-lg">
        <h4 className="font-semibold text-red-900 mb-2">
          {language === 'ru' ? 'Статус ветерана' : 'Ветеран абалы'}
        </h4>
        <div className="text-red-800">
          <p><strong>{language === 'ru' ? 'Тип:' : 'Түрү:'}</strong> {
            data.veteranType === 'VOV' ? (language === 'ru' ? 'ВОВ' : 'ВОВ') :
            data.veteranType === 'CHERNOBYL' ? (language === 'ru' ? 'ЧАЭС' : 'ЧАЭС') :
            data.veteranType === 'AFGHAN' ? (language === 'ru' ? 'Афганцы' : 'Афгандыктар') : 'Неизвестно'
          }</p>
          <p><strong>{language === 'ru' ? 'Статус:' : 'Абал:'}</strong> {data.status}</p>
        </div>
      </div>
      
      {data.benefits.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">
            {language === 'ru' ? 'Льготы' : 'Льготалар'}
          </h4>
          {data.benefits.map((benefit, index) => (
            <div key={index} className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800">
                <p><strong>{language === 'ru' ? 'Тип льготы:' : 'Льгота түрү:'}</strong> {benefit.type}</p>
                <p><strong>{language === 'ru' ? 'Размер:' : 'Өлчөмү:'}</strong> {benefit.amount.toLocaleString()} сом</p>
                <p><strong>{language === 'ru' ? 'Период:' : 'Мезгил:'}</strong> {new Date(benefit.periodFrom).toLocaleDateString()} - {new Date(benefit.periodTo).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <i className="ri-database-2-line mr-3 text-blue-600"></i>
          {language === 'ru' ? 'Данные внешних проверок' : 'Тышкы текшерүүлөрдүн маалыматтары'}
        </h3>
        <p className="text-gray-600 mt-2">
          {language === 'ru' 
            ? 'Информация, полученная из государственных информационных систем'
            : 'Мамлекеттик маалыматтык системалардан алынган маалыматтар'}
        </p>
      </div>

      <div className="flex">
        {/* Табы */}
        <div className="w-1/4 border-r border-gray-200">
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4">
              {language === 'ru' ? 'Источники данных' : 'Маалымат булактары'}
            </h4>
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 border-blue-200 text-blue-900 border'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <i className={`${tab.icon} text-sm`}></i>
                  <span className="text-sm font-medium">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Содержимое */}
        <div className="flex-1 p-6">
          {renderData()}
        </div>
      </div>
    </div>
  );
}
