# План обновления интерфейсов для соответствия новой структуре данных

## 🎯 **Цель:** Адаптировать все интерфейсы обработки заявок под новую структуру данных DDL

## 📋 **Этап 1: Обновление типов данных**

### ✅ **Выполнено:**
- [x] Создан `lib/types-updated.ts` с полной структурой DDL
- [x] Создан `lib/mappers.ts` для преобразования данных
- [x] Создан `lib/api/applicationService-updated.ts` с новыми API методами

### 🔄 **Требуется:**
- [ ] Заменить `lib/types.ts` на `lib/types-updated.ts`
- [ ] Обновить все импорты типов в проекте
- [ ] Протестировать совместимость

## 📋 **Этап 2: Обновление формы заявления**

### **Файл:** `app/citizen/new-application/page.tsx`

#### **Текущие проблемы:**
```typescript
// ❌ Неправильно - заявитель в массиве семьи
const [familyMembers, setFamilyMembers] = useState([{
  // данные заявителя + члены семьи
}]);

// ❌ Неправильно - доходы как объект
const [familyIncome, setFamilyIncome] = useState({
  mainIncome: { salary: 0, ... },
  // ...
});

// ❌ Неправильно - имущество как объект
const [subsidiaryFarming, setSubsidiaryFarming] = useState({
  landPlots: [...],
  livestock: [...],
  vehicles: [...]
});
```

#### **Необходимые изменения:**
```typescript
// ✅ Правильно - разделение данных
const [applicant, setApplicant] = useState<Applicant>({...});
const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
const [incomes, setIncomes] = useState<Income[]>([]);
const [landPlots, setLandPlots] = useState<LandPlot[]>([]);
const [livestock, setLivestock] = useState<Livestock[]>([]);
const [vehicles, setVehicles] = useState<Vehicle[]>([]);
const [addresses, setAddresses] = useState<Address[]>([]);
const [contacts, setContacts] = useState<Contact[]>([]);
const [consents, setConsents] = useState<Consent>({...});
const [documents, setDocuments] = useState<Document[]>([]);
```

#### **Конкретные изменения:**

1. **Разделить состояние заявителя и семьи:**
   - Создать отдельное состояние для заявителя
   - Убрать заявителя из массива семьи
   - Обновить все функции работы с данными

2. **Структурировать доходы:**
   - Преобразовать `familyIncome` в массив `incomes`
   - Связать доходы с членами семьи через `memberId`
   - Обновить функции расчета

3. **Структурировать имущество:**
   - Разделить `subsidiaryFarming` на отдельные массивы
   - Обновить функции расчета условных голов и МПЦ

4. **Добавить новые поля:**
   - ПИН заявителя
   - Национальность и образование
   - Дополнительные удостоверения
   - Органы соцзащиты
   - Платежные реквизиты
   - Мульти-адреса и контакты
   - Согласия

5. **Обновить валидации:**
   - Добавить валидации для новых полей
   - Обновить существующие валидации
   - Добавить валидации связей

## 📋 **Этап 3: Обновление страниц обработки заявок**

### **Файл:** `app/dashboard/queue/page.tsx`

#### **Необходимые изменения:**

1. **Обновить колонки таблицы:**
```typescript
// ❌ Текущие колонки
const columns = [
  { key: 'applicantName', label: 'Заявитель' },
  { key: 'phone', label: 'Телефон' },
  { key: 'address', label: 'Адрес' },
  // ...
];

// ✅ Новые колонки
const columns = [
  { key: 'applicant.pin', label: 'ПИН' },
  { key: 'applicant.fullName', label: 'Заявитель' },
  { key: 'contacts', label: 'Контакты', render: (contacts) => 
    contacts?.find(c => c.isPrimary)?.value || 'Не указан'
  },
  { key: 'addresses', label: 'Адрес', render: (addresses) => 
    addresses?.find(a => a.isPrimary)?.street || 'Не указан'
  },
  { key: 'applicant.socialProtectionAuthority', label: 'Орган соцзащиты' },
  { key: 'applicantCategories', label: 'Категории' },
  { key: 'householdMetrics.perCapitaIncome', label: 'ССДС' },
  { key: 'householdMetrics.criteriaFlags', label: 'Критерии' },
  // ...
];
```

2. **Обновить фильтры:**
```typescript
// ✅ Новые фильтры
const filterConfig = [
  {
    key: 'status',
    label: 'Статус',
    type: 'multiselect',
    options: [
      { value: 'DRAFT', label: 'Черновик' },
      { value: 'SUBMITTED', label: 'Подана' },
      { value: 'UNDER_REVIEW', label: 'На рассмотрении' },
      // ...
    ]
  },
  {
    key: 'regionCode',
    label: 'Область',
    type: 'select',
    options: regionList
  },
  {
    key: 'categoryCode',
    label: 'Категория',
    type: 'multiselect',
    options: categoryList
  },
  {
    key: 'pin',
    label: 'ПИН',
    type: 'text'
  },
  // ...
];
```

3. **Обновить модальные окна:**
   - Добавить отображение новых полей
   - Обновить структуру данных
   - Добавить работу с связанными данными

### **Файл:** `app/dashboard/review/page.tsx`

#### **Необходимые изменения:**

1. **Обновить формы рассмотрения:**
   - Добавить поля для работы с новыми данными
   - Обновить валидации
   - Добавить работу с категориями и органами соцзащиты

2. **Обновить отображение данных:**
   - Показать структурированные адреса
   - Показать мульти-контакты
   - Показать показатели домохозяйства
   - Показать критерии отбора

3. **Добавить новые функции:**
   - Работа с согласиями
   - Работа с дополнительными удостоверениями
   - Работа с платежными реквизитами

### **Файл:** `app/accountant/payments/page.tsx`

#### **Необходимые изменения:**

1. **Обновить отображение платежных реквизитов:**
   - Показать все типы реквизитов
   - Добавить работу с банками
   - Обновить валидации

2. **Добавить новые функции:**
   - Работа с перерасчетами
   - Работа с прекращениями
   - Работа с возвратами
   - Работа с передоформлениями

## 📋 **Этап 4: Обновление компонентов**

### **Файл:** `components/ui/ApplicationDetailsModal.tsx`

#### **Необходимые изменения:**

1. **Обновить структуру отображения:**
```typescript
// ✅ Новая структура
const ApplicationDetailsModal = ({ application }: { application: Application }) => {
  return (
    <div className="space-y-6">
      {/* Заявитель */}
      <section>
        <h3>Заявитель</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>ПИН: {application.applicant?.pin}</div>
          <div>ФИО: {application.applicant?.fullName}</div>
          <div>Национальность: {application.applicant?.nationalityCode}</div>
          <div>Образование: {application.applicant?.educationCode}</div>
        </div>
      </section>

      {/* Адреса */}
      <section>
        <h3>Адреса</h3>
        {application.addresses?.map(addr => (
          <div key={addr.id} className="border p-3 rounded">
            <div>Тип: {addr.addrType === 'REG' ? 'Регистрация' : 'Фактический'}</div>
            <div>Адрес: {addr.street}, {addr.house}{addr.flat && `, кв. ${addr.flat}`}</div>
            <div>Область: {addr.regionCode}, Район: {addr.raionCode}</div>
          </div>
        ))}
      </section>

      {/* Контакты */}
      <section>
        <h3>Контакты</h3>
        {application.contacts?.map(contact => (
          <div key={contact.id} className="flex items-center gap-2">
            <span className="font-medium">{contact.contactTypeCode}:</span>
            <span>{contact.value}</span>
            {contact.isPrimary && <span className="text-blue-600">(основной)</span>}
          </div>
        ))}
      </section>

      {/* Члены семьи */}
      <section>
        <h3>Члены семьи</h3>
        {application.familyMembers?.map(member => (
          <div key={member.id} className="border p-3 rounded">
            <div className="font-medium">{member.fullName}</div>
            <div>Родство: {member.relationCode}</div>
            <div>Возраст: {member.age}</div>
            <div>Пол: {member.genderCode === 'M' ? 'Мужской' : 'Женский'}</div>
            {member.childCategoryCode && (
              <div>Категория ребенка: {member.childCategoryCode}</div>
            )}
          </div>
        ))}
      </section>

      {/* Доходы */}
      <section>
        <h3>Доходы</h3>
        {application.incomes?.map(income => (
          <div key={income.id} className="border p-3 rounded">
            <div>Тип: {income.incomeTypeCode}</div>
            <div>Сумма: {income.amount} сом</div>
            <div>Периодичность: {income.periodicity === 'M' ? 'Месяц' : 'Год'}</div>
            <div>Период: {income.periodFrom} - {income.periodTo || 'по настоящее время'}</div>
          </div>
        ))}
      </section>

      {/* Имущество */}
      <section>
        <h3>Земельные участки</h3>
        {application.landPlots?.map(plot => (
          <div key={plot.id} className="border p-3 rounded">
            <div>Тип: {plot.typeCode}</div>
            <div>Площадь: {plot.areaHectare} га</div>
            <div>Владение: {plot.isOwned ? 'Собственность' : 'Аренда'}</div>
          </div>
        ))}

        <h3>Скот</h3>
        {application.livestock?.map(item => (
          <div key={item.id} className="border p-3 rounded">
            <div>Тип: {item.typeCode}</div>
            <div>Количество: {item.qty}</div>
            <div>Условные головы: {item.convUnits}</div>
          </div>
        ))}

        <h3>Транспортные средства</h3>
        {application.vehicles?.map(vehicle => (
          <div key={vehicle.id} className="border p-3 rounded">
            <div>Тип: {vehicle.typeCode}</div>
            <div>Модель: {vehicle.makeModel}</div>
            <div>Год: {vehicle.year}</div>
            <div>Легковой: {vehicle.isLightCar ? 'Да' : 'Нет'}</div>
          </div>
        ))}
      </section>

      {/* Показатели домохозяйства */}
      <section>
        <h3>Показатели домохозяйства</h3>
        {application.householdMetrics?.map(metrics => (
          <div key={metrics.id} className="border p-3 rounded">
            <div>Общий доход в месяц: {metrics.totalIncomeMonth} сом</div>
            <div>Среднедушевой доход: {metrics.perCapitaIncome} сом</div>
            <div>Условные головы: {metrics.convUnitsTotal}</div>
            <div>Гарантированный минимум: {metrics.guaranteedMinimumIncome} сом</div>
            <div className="mt-2">
              <h4>Критерии отбора:</h4>
              <div>Доходы: {metrics.incomeCriteriaFlag ? '✅' : '❌'}</div>
              <div>Имущество: {metrics.propertyCriteriaFlag ? '✅' : '❌'}</div>
              <div>Семья: {metrics.familyCriteriaFlag ? '✅' : '❌'}</div>
              <div>Транспорт: {metrics.vehicleCriteriaFlag ? '✅' : '❌'}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Назначения пособий */}
      <section>
        <h3>Назначения пособий</h3>
        {application.benefitAssignments?.map(assignment => (
          <div key={assignment.id} className="border p-3 rounded">
            <div>Тип пособия: {assignment.benefitType}</div>
            <div>Категория: {assignment.categoryCode}</div>
            <div>Решение: {assignment.decision}</div>
            <div>Сумма: {assignment.assignedAmount} сом</div>
            <div>Период: {assignment.periodFrom} - {assignment.periodTo || 'бессрочно'}</div>
          </div>
        ))}
      </section>

      {/* Расчеты */}
      <section>
        <h3>Расчеты пособий</h3>
        {application.calculations?.map(calc => (
          <div key={calc.id} className="border p-3 rounded">
            <div>Базовая сумма: {calc.baseAmount} сом</div>
            <div>Количество детей: {calc.childrenCount}</div>
            <div>Региональный коэффициент: {calc.regionCoeff}</div>
            <div>Дополнительный коэффициент: {calc.addCoeff}</div>
            <div>Пограничная надбавка: {calc.borderBonus} сом</div>
            <div className="font-bold">Итого: {calc.totalAmount} сом</div>
            <div>Период действия: {calc.validFrom} - {calc.validTo || 'бессрочно'}</div>
          </div>
        ))}
      </section>

      {/* Документы */}
      <section>
        <h3>Документы</h3>
        {application.documents?.map(doc => (
          <div key={doc.id} className="border p-3 rounded">
            <div>Тип: {doc.documentType}</div>
            <div>Файл: {doc.fileName}</div>
            <div>Размер: {doc.fileSize} байт</div>
            <div>Статус: {doc.status}</div>
            {doc.verifiedAt && (
              <div>Верифицирован: {doc.verifiedAt}</div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};
```

## 📋 **Этап 5: Обновление API интеграции**

### **Файлы для обновления:**
- `lib/api/applicationService.ts` → заменить на `applicationService-updated.ts`
- Все компоненты, использующие старый сервис
- Обновить импорты и вызовы методов

### **Новые API методы:**
- Работа с заявителями
- Работа с членами семьи
- Работа с доходами
- Работа с имуществом
- Работа с адресами и контактами
- Работа с документами
- Работа с согласиями
- Расчет показателей домохозяйства
- Работа с назначениями и расчетами

## 📋 **Этап 6: Обновление валидаций**

### **Файл:** `lib/validations.ts`

#### **Необходимые изменения:**

1. **Добавить валидации для новых полей:**
   - ПИН (14-16 цифр)
   - Национальность и образование
   - Дополнительные удостоверения
   - Органы соцзащиты
   - Платежные реквизиты
   - Адреса с кодами
   - Контакты разных типов

2. **Обновить существующие валидации:**
   - Валидации документов
   - Валидации доходов
   - Валидации имущества
   - Валидации семьи

3. **Добавить валидации связей:**
   - Проверка соответствия данных заявителя и семьи
   - Проверка соответствия доходов и членов семьи
   - Проверка соответствия документов и данных

## 📋 **Этап 7: Обновление расчетов**

### **Файл:** `lib/calculations.ts`

#### **Необходимые изменения:**

1. **Обновить функции расчета:**
   - Адаптировать под новую структуру данных
   - Использовать новые поля и связи
   - Обновить логику расчета ССДС

2. **Добавить новые расчеты:**
   - Расчет показателей домохозяйства
   - Расчет критериев отбора
   - Расчет пособий с новыми коэффициентами

## 📋 **Этап 8: Обновление RBAC и аудита**

### **Файлы:** `lib/rbac.ts`, `lib/audit.ts`

#### **Необходимые изменения:**

1. **Обновить роли и права:**
   - Адаптировать под новую структуру данных
   - Добавить права на новые поля
   - Обновить workflow статусов

2. **Обновить аудит:**
   - Добавить логирование новых операций
   - Обновить структуру логов
   - Добавить аудит связей между таблицами

## 🎯 **Приоритеты выполнения:**

### **Высокий приоритет:**
1. Обновление типов данных
2. Адаптация формы заявления
3. Создание мапперов
4. Обновление основных страниц обработки

### **Средний приоритет:**
1. Обновление компонентов
2. Обновление API сервисов
3. Обновление валидаций
4. Обновление расчетов

### **Низкий приоритет:**
1. Обновление RBAC и аудита
2. Оптимизация производительности
3. Дополнительные функции

## ⚠️ **Риски и ограничения:**

1. **Совместимость:** Нужно обеспечить обратную совместимость
2. **Производительность:** Новая структура может повлиять на производительность
3. **Тестирование:** Требуется полное тестирование всех изменений
4. **Миграция данных:** Нужен план миграции существующих данных

## 📊 **Ожидаемые результаты:**

1. **Полное соответствие** структуры данных DDL и интерфейсов
2. **Улучшенная производительность** за счет правильной нормализации
3. **Более гибкая система** с возможностью расширения
4. **Соответствие ТУ** и требованиям системы УБК
5. **Улучшенный UX** с более структурированным отображением данных
