'use client';

import { FamilyMember } from '@/lib/types';

interface StudentListViewProps {
  familyMembers: FamilyMember[];
}

export default function StudentListView({ familyMembers }: StudentListViewProps) {
  // Фильтруем только студентов
  const students = familyMembers.filter(member => member.isStudent);

  const getFundingSourceText = (source: string) => {
    const sources = {
      government: 'Государство',
      parents: 'Родители',
      grant: 'Грант',
      loan: 'Образовательный кредит',
      other: 'Иное'
    };
    return sources[source as keyof typeof sources] || source;
  };

  const getInstitutionTypeText = (type: string) => {
    const types = {
      UNIVERSITY: 'Университет',
      COLLEGE: 'Колледж',
      TECHNICAL: 'Техникум',
      VOCATIONAL: 'Профессионально-техническое училище',
      SCHOOL: 'Школа'
    };
    return types[type as keyof typeof types] || type;
  };

  const getAgeStatus = (age: number) => {
    if (age <= 21) {
      return { text: 'Включается в состав семьи', color: 'text-green-600' };
    } else {
      return { text: 'Исключается из состава семьи', color: 'text-red-600' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Обучающиеся в семье ({students.length})
        </h3>
      </div>

      {/* Список студентов */}
      {students.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="ri-graduation-cap-line text-4xl mb-2"></i>
          <p>Нет данных об обучающихся</p>
        </div>
      ) : (
        <div className="space-y-3">
          {students.map((student) => {
            const ageStatus = getAgeStatus(student.age);
            const educationData = student.educationData;
            
            return (
              <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{student.fullName}</h4>
                      <span className={`text-sm ${ageStatus.color}`}>
                        {ageStatus.text}
                      </span>
                      <span className="text-sm text-gray-500">
                        {student.age} лет
                      </span>
                    </div>
                    
                    {educationData && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Учебное заведение:</span>
                          <p className="font-medium">{educationData.institutionName}</p>
                          <p className="text-xs text-gray-400">
                            {getInstitutionTypeText(educationData.institutionType)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Стипендия:</span>
                          <p className="font-medium">
                            {educationData.scholarshipAmount ? 
                              `${educationData.scholarshipAmount.toLocaleString()} сом/мес` : 
                              'Не получает'
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Оплата обучения:</span>
                          <p className="font-medium">
                            {educationData.tuitionFeeMonthly ? 
                              `${educationData.tuitionFeeMonthly.toLocaleString()} сом/мес` : 
                              'Бесплатно'
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Источник финансирования:</span>
                          <p className="font-medium">
                            {getFundingSourceText(educationData.fundingSource)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
