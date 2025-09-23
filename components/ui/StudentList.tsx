'use client';

import { useState } from 'react';
import { FamilyMember, StudentEducation } from '@/lib/types';
import StudentEducationForm from './StudentEducationForm';

interface StudentListProps {
  familyMembers: FamilyMember[];
  onUpdateStudent: (memberId: number, educationData: StudentEducation) => void;
  onRemoveStudent: (memberId: number) => void;
}

export default function StudentList({
  familyMembers,
  onUpdateStudent,
  onRemoveStudent
}: StudentListProps) {
  const [editingStudent, setEditingStudent] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Фильтруем только студентов
  const students = familyMembers.filter(member => member.isStudent);

  const handleEditStudent = (memberId: number) => {
    setEditingStudent(memberId);
    setShowAddForm(false);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowAddForm(true);
  };

  const handleSaveStudent = (memberId: number, educationData: StudentEducation) => {
    onUpdateStudent(memberId, educationData);
    setEditingStudent(null);
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setShowAddForm(false);
  };

  const getFundingSourceText = (source: string) => {
    const sources = {
      government: 'Государство',
      parents: 'Родители',
      grant: 'Грант',
      other: 'Иное'
    };
    return sources[source as keyof typeof sources] || source;
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
      {/* Заголовок и кнопка добавления */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Обучающиеся в семье ({students.length})
        </h3>
        <button
          onClick={handleAddStudent}
          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Добавить обучающегося
        </button>
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
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditStudent(student.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Редактировать"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                    <button
                      onClick={() => onRemoveStudent(student.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Удалить"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Форма редактирования/добавления */}
      {(editingStudent || showAddForm) && (
        <div className="mt-6">
          <StudentEducationForm
            familyMemberId={editingStudent || 0}
            familyMemberName={
              editingStudent 
                ? students.find(s => s.id === editingStudent)?.fullName || 'Неизвестно'
                : 'Новый студент'
            }
            initialData={editingStudent ? students.find(s => s.id === editingStudent)?.educationData : undefined}
            onSave={(data) => handleSaveStudent(editingStudent || 0, data)}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
    </div>
  );
}
