# Справочники для формы заявки

Этот файл содержит все необходимые справочники для формы заявления на получение социальных выплат.

## Структура справочников

Каждый справочник представляет собой массив объектов типа `DirectoryItem`:

```typescript
interface DirectoryItem {
  id: string;        // Уникальный идентификатор
  name: string;      // Отображаемое название
  code?: string;     // Код (опционально)
}
```

## Список справочников

### 1. Личные данные
- **genderList** - Пол заявителя и членов семьи
- **documentTypeList** - Тип документа (паспорт, ИД-карта, свидетельство о рождении)
- **passportIssuingAuthorityList** - Орган выдачи паспорта
- **citizenshipList** - Гражданство
- **nationalityList** - Национальность
- **educationLevelList** - Уровень образования

### 2. Военные и специальные документы
- **militaryDocTypeList** - Тип военного документа
- **specialDocTypeList** - Специальные удостоверения (опекун, ветеран и др.)

### 3. Организационные данные
- **municipalAuthorities** - Органы соцзащиты (УТСЗ)
- **applicantTypes** - Тип заявителя (родитель, опекун и др.)

### 4. Семейные данные
- **categoryList** - Категория семьи (многодетная, малообеспеченная и др.)
- **familyRelationTypes** - Степень родства для членов семьи
- **childCategoryList** - Категория ребенка (инвалид, сирота и др.)

### 5. Географические данные
- **regionList** - Регионы (области) проживания
- **localityList** - Населенные пункты/районы

### 6. Контактная информация
- **contactTypeList** - Типы контактов (мобильный, домашний, рабочий)

### 7. Доходы и имущество
- **incomeTypeList** - Виды доходов
- **propertyTypeList** - Виды имущества (земля, жилье, транспорт)
- **livestockTypeList** - Виды сельскохозяйственных животных

### 8. Банковские данные
- **bankList** - Банки получателя
- **paymentTypeList** - Типы выплат (ежемесячная, единовременная)

### 9. Специальные категории
- **disabilityCategories** - Категории инвалидности
- **identificationTypeList** - Типы идентификационных документов
- **compensationReasonList** - Основания для компенсаций/надбавок
- **compensationTypeList** - Типы компенсаций

### 10. Административные данные
- **refusalReasons** - Причины отказа в назначении

## Использование

### Импорт справочника
```typescript
import { genderList, getDirectory } from '@/lib/directories';

// Прямое использование
const genders = genderList;

// Получение по имени
const genders = getDirectory('genderList');
```

### Поиск элемента
```typescript
import { findDirectoryItem } from '@/lib/directories';

const maleGender = findDirectoryItem('genderList', 'male');
```

## Компоненты для работы со справочниками

### DirectorySelect
Обычный выпадающий список для выбора одного значения:
```tsx
<DirectorySelect
  directoryName="genderList"
  value={formData.gender}
  onChange={(value) => setFormData({...formData, gender: value})}
  label="Пол"
  required
/>
```

### DirectoryMultiSelect
Множественный выбор с чекбоксами:
```tsx
<DirectoryMultiSelect
  directoryName="categoryList"
  values={formData.familyCategory}
  onChange={(values) => setFormData({...formData, familyCategory: values})}
  label="Категория семьи"
  maxSelections={3}
/>
```

### DirectorySearch
Поиск с выпадающим списком:
```tsx
<DirectorySearch
  directoryName="regionList"
  value={formData.region}
  onChange={(value) => setFormData({...formData, region: value})}
  label="Регион проживания"
  searchPlaceholder="Поиск региона..."
/>
```

## Расширение справочников

Для добавления новых справочников:

1. Добавьте новый массив в файл `directories.ts`
2. Добавьте его в функцию `getDirectory`
3. Обновите документацию

Пример:
```typescript
export const newDirectory: DirectoryItem[] = [
  { id: 'item1', name: 'Элемент 1', code: 'ITEM1' },
  { id: 'item2', name: 'Элемент 2', code: 'ITEM2' }
];

// В функции getDirectory:
const directories: Record<string, DirectoryItem[]> = {
  // ... существующие справочники
  newDirectory,
  // ...
};
```

## Примечания

- Все справочники содержат актуальные данные для Казахстана
- Коды соответствуют стандартам, используемым в государственных системах
- Справочники можно легко расширять и модифицировать
- Компоненты поддерживают валидацию и отображение ошибок
