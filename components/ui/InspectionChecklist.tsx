'use client';

import { useState } from 'react';

interface InspectionChecklistProps {
  inspectionId: number;
  onComplete: (completedItems: string[]) => void;
  onUpdate: (itemId: string, completed: boolean, notes?: string) => void;
  initialData?: {
    completedItems: string[];
    itemNotes: Record<string, string>;
  };
}

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  required: boolean;
  order: number;
}

export default function InspectionChecklist({ 
  inspectionId, 
  onComplete, 
  onUpdate,
  initialData 
}: InspectionChecklistProps) {
  const [completedItems, setCompletedItems] = useState<string[]>(
    initialData?.completedItems || []
  );
  const [itemNotes, setItemNotes] = useState<Record<string, string>>(
    initialData?.itemNotes || {}
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const checklistItems: ChecklistItem[] = [
    // Подготовка к проверке
    {
      id: 'prep_1',
      category: 'Подготовка',
      title: 'Скачать чек-лист проверки',
      description: 'Загрузить актуальный чек-лист из системы',
      required: true,
      order: 1
    },
    {
      id: 'prep_2',
      category: 'Подготовка',
      title: 'Подготовить документы о составе семьи',
      description: 'Справки о составе семьи, свидетельства о рождении детей',
      required: true,
      order: 2
    },
    {
      id: 'prep_3',
      category: 'Подготовка',
      title: 'Подготовить документы о доходах',
      description: 'Справки о доходах, справки из ГНС, справки из Соцфонда',
      required: true,
      order: 3
    },
    {
      id: 'prep_4',
      category: 'Подготовка',
      title: 'Подготовить документы о жилищных условиях',
      description: 'Документы на жилье, справки о составе семьи по месту жительства',
      required: true,
      order: 4
    },
    {
      id: 'prep_5',
      category: 'Подготовка',
      title: 'Подготовить документы об имуществе',
      description: 'Документы на земельные участки, транспорт, недвижимость',
      required: true,
      order: 5
    },
    {
      id: 'prep_6',
      category: 'Подготовка',
      title: 'Проверить контактные данные заявителя',
      description: 'Актуальный телефон, адрес, время доступности',
      required: true,
      order: 6
    },
    {
      id: 'prep_7',
      category: 'Подготовка',
      title: 'Подготовить план маршрута',
      description: 'Оптимальный маршрут до места проверки',
      required: false,
      order: 7
    },
    {
      id: 'prep_8',
      category: 'Подготовка',
      title: 'Проверить техническое оснащение',
      description: 'Фотоаппарат/телефон, планшет, зарядные устройства',
      required: true,
      order: 8
    },

    // Проведение проверки
    {
      id: 'visit_1',
      category: 'Визит',
      title: 'Прибытие на место проверки',
      description: 'Вовремя прибыть по указанному адресу',
      required: true,
      order: 9
    },
    {
      id: 'visit_2',
      category: 'Визит',
      title: 'Представиться и объяснить цель визита',
      description: 'Показать удостоверение, объяснить процедуру проверки',
      required: true,
      order: 10
    },
    {
      id: 'visit_3',
      category: 'Визит',
      title: 'Проверить документы на жилье',
      description: 'Документы о праве собственности или аренде',
      required: true,
      order: 11
    },
    {
      id: 'visit_4',
      category: 'Визит',
      title: 'Осмотреть жилое помещение',
      description: 'Общая площадь, количество комнат, состояние жилья',
      required: true,
      order: 12
    },
    {
      id: 'visit_5',
      category: 'Визит',
      title: 'Проверить условия проживания',
      description: 'Наличие коммуникаций, санитарные условия',
      required: true,
      order: 13
    },
    {
      id: 'visit_6',
      category: 'Визит',
      title: 'Проверить фактический состав семьи',
      description: 'Сверить с заявленными данными, проверить документы',
      required: true,
      order: 14
    },
    {
      id: 'visit_7',
      category: 'Визит',
      title: 'Проверить наличие имущества',
      description: 'Земельные участки, скот, транспорт, недвижимость',
      required: true,
      order: 15
    },
    {
      id: 'visit_8',
      category: 'Визит',
      title: 'Провести интервью с заявителем',
      description: 'Выяснить источники доходов, обстоятельства',
      required: true,
      order: 16
    },
    {
      id: 'visit_9',
      category: 'Визит',
      title: 'Проверить соседей (при необходимости)',
      description: 'Получить подтверждение о составе семьи',
      required: false,
      order: 17
    },
    {
      id: 'visit_10',
      category: 'Визит',
      title: 'Провести фотофиксацию',
      description: 'Сфотографировать жилье, имущество, документы',
      required: true,
      order: 18
    },

    // Документирование
    {
      id: 'doc_1',
      category: 'Документирование',
      title: 'Заполнить акт проверки',
      description: 'Заполнить все разделы акта выездной проверки',
      required: true,
      order: 19
    },
    {
      id: 'doc_2',
      category: 'Документирование',
      title: 'Записать дату и время визита',
      description: 'Точное время начала и окончания проверки',
      required: true,
      order: 20
    },
    {
      id: 'doc_3',
      category: 'Документирование',
      title: 'Записать комментарии и обстоятельства',
      description: 'Все наблюдения и обстоятельства проверки',
      required: true,
      order: 21
    },
    {
      id: 'doc_4',
      category: 'Документирование',
      title: 'Получить подписи участников',
      description: 'Подписи заявителя, специалиста, при необходимости руководителя',
      required: true,
      order: 22
    },
    {
      id: 'doc_5',
      category: 'Документирование',
      title: 'Загрузить фотографии в систему',
      description: 'Прикрепить все сделанные фотографии к акту',
      required: true,
      order: 23
    },
    {
      id: 'doc_6',
      category: 'Документирование',
      title: 'Сохранить акт в реестре',
      description: 'Сохранить завершенный акт в системе',
      required: true,
      order: 24
    }
  ];

  const categories = [...new Set(checklistItems.map(item => item.category))];

  const handleItemToggle = (itemId: string) => {
    const newCompletedItems = completedItems.includes(itemId)
      ? completedItems.filter(id => id !== itemId)
      : [...completedItems, itemId];
    
    setCompletedItems(newCompletedItems);
    onUpdate(itemId, !completedItems.includes(itemId), itemNotes[itemId]);
    
    if (newCompletedItems.length === checklistItems.filter(item => item.required).length) {
      onComplete(newCompletedItems);
    }
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    setItemNotes(prev => ({
      ...prev,
      [itemId]: notes
    }));
    onUpdate(itemId, completedItems.includes(itemId), notes);
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Подготовка': return 'ri-tools-line';
      case 'Визит': return 'ri-car-line';
      case 'Документирование': return 'ri-file-text-line';
      default: return 'ri-checkbox-circle-line';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Подготовка': return 'text-blue-600 bg-blue-100';
      case 'Визит': return 'text-green-600 bg-green-100';
      case 'Документирование': return 'text-purple-600 bg-purple-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getProgressPercentage = () => {
    const requiredItems = checklistItems.filter(item => item.required);
    const completedRequired = requiredItems.filter(item => completedItems.includes(item.id));
    return Math.round((completedRequired.length / requiredItems.length) * 100);
  };

  const getCategoryProgress = (category: string) => {
    const categoryItems = checklistItems.filter(item => item.category === category);
    const completedCategoryItems = categoryItems.filter(item => completedItems.includes(item.id));
    return Math.round((completedCategoryItems.length / categoryItems.length) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-neutral-900">
            Чек-лист выездной проверки
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {getProgressPercentage()}%
            </div>
            <div className="text-sm text-neutral-600">Выполнено</div>
          </div>
        </div>
        
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map(category => {
          const categoryItems = checklistItems
            .filter(item => item.category === category)
            .sort((a, b) => a.order - b.order);
          
          const categoryProgress = getCategoryProgress(category);
          
          return (
            <div key={category} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <i className={`${getCategoryIcon(category)} text-xl`}></i>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {category}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getCategoryColor(category)}`}>
                    {categoryProgress}%
                  </span>
                  <div className="w-16 bg-neutral-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${categoryProgress}%`,
                        backgroundColor: categoryProgress === 100 ? '#10b981' : '#3b82f6'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {categoryItems.map(item => {
                  const isCompleted = completedItems.includes(item.id);
                  const isExpanded = expandedItems.has(item.id);
                  
                  return (
                    <div key={item.id} className="border border-neutral-200 rounded-lg">
                      <div className="flex items-center p-4">
                        <button
                          onClick={() => handleItemToggle(item.id)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-4 transition-colors ${
                            isCompleted
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'border-neutral-300 hover:border-green-500'
                          }`}
                        >
                          {isCompleted && <i className="ri-check-line text-sm"></i>}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${isCompleted ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                              {item.title}
                              {item.required && (
                                <span className="ml-2 text-red-500 text-sm">*</span>
                              )}
                            </h4>
                            <div className="flex items-center space-x-2">
                              {item.description && (
                                <button
                                  onClick={() => toggleExpanded(item.id)}
                                  className="text-neutral-400 hover:text-neutral-600"
                                >
                                  <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line`}></i>
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {isExpanded && item.description && (
                            <p className="text-sm text-neutral-600 mt-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-neutral-100">
                          <div className="mt-3">
                            <label className="form-label text-sm">Заметки</label>
                            <textarea
                              value={itemNotes[item.id] || ''}
                              onChange={(e) => handleNotesChange(item.id, e.target.value)}
                              className="form-textarea text-sm"
                              rows={2}
                              placeholder="Дополнительные заметки по этому пункту..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Статистика */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {completedItems.length}
          </div>
          <div className="text-sm text-neutral-600">Выполнено пунктов</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {checklistItems.filter(item => item.required).length}
          </div>
          <div className="text-sm text-neutral-600">Обязательных пунктов</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {checklistItems.length}
          </div>
          <div className="text-sm text-neutral-600">Всего пунктов</div>
        </div>
      </div>
    </div>
  );
}
