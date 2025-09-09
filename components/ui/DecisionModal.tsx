'use client';

import { useState } from 'react';
import MobileOptimizedModal from './MobileOptimizedModal';
import AccessibleButton from './AccessibleButton';

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  onSaveDecision: (decision: 'approved' | 'rejected', reason?: string, comment?: string) => void;
}

export default function DecisionModal({ isOpen, onClose, applicationId, onSaveDecision }: DecisionModalProps) {
  const [selectedDecision, setSelectedDecision] = useState<'approved' | 'rejected' | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const handleSave = () => {
    if (selectedDecision) {
      onSaveDecision(selectedDecision, selectedReason, comment);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedDecision(null);
    setSelectedReason('');
    setComment('');
    onClose();
  };

  const handleDecisionSelect = (decision: 'approved' | 'rejected') => {
    setSelectedDecision(decision);
    if (decision === 'approved') {
      setSelectedReason('');
    }
  };

  return (
    <MobileOptimizedModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Принятие решения по заявке" 
      size="lg"
      mobileFullscreen={false}
    >
      <div className="space-y-4 md:space-y-6">
        {/* Decision Tools */}
        <div>
          <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Инструменты принятия решений</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            <button 
              onClick={() => handleDecisionSelect('approved')}
              className={`px-4 md:px-6 py-4 md:py-5 rounded-lg transition-all duration-200 flex items-center justify-center min-h-[80px] ${
                selectedDecision === 'approved' 
                  ? 'bg-green-600 text-white shadow-lg transform scale-105' 
                  : 'bg-green-50 border-2 border-green-200 text-green-700 hover:bg-green-100 hover:shadow-md'
              }`}
              aria-pressed={selectedDecision === 'approved'}
            >
              <i className="ri-check-line mr-2 text-lg md:text-xl flex-shrink-0"></i>
              <div className="text-left">
                <div className="font-semibold text-sm md:text-base">Одобрить</div>
                <div className="text-xs md:text-sm opacity-90">Все требования выполнены</div>
              </div>
            </button>

            <button 
              onClick={() => handleDecisionSelect('rejected')}
              className={`px-4 md:px-6 py-4 md:py-5 rounded-lg transition-all duration-200 flex items-center justify-center min-h-[80px] ${
                selectedDecision === 'rejected' 
                  ? 'bg-red-600 text-white shadow-lg transform scale-105' 
                  : 'bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100 hover:shadow-md'
              }`}
              aria-pressed={selectedDecision === 'rejected'}
            >
              <i className="ri-close-line mr-2 text-lg md:text-xl flex-shrink-0"></i>
              <div className="text-left">
                <div className="font-semibold text-sm md:text-base">Отклонить</div>
                <div className="text-xs md:text-sm opacity-90">С указанием причины</div>
              </div>
            </button>
          </div>
        </div>

        {/* Rejection Reasons */}
        {selectedDecision === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-5 mb-4 md:mb-6">
            <h5 className="font-semibold mb-3 md:mb-4 text-sm md:text-base text-red-900">Коды причин отклонения:</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
              <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-red-100 cursor-pointer">
                <input 
                  type="radio" 
                  name="reason" 
                  value="income_exceeded" 
                  checked={selectedReason === 'income_exceeded'}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="text-red-600 focus:ring-red-500" 
                />
                <span className="text-red-800">R001: Превышение ГМД</span>
              </label>
              <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-red-100 cursor-pointer">
                <input 
                  type="radio" 
                  name="reason" 
                  value="incomplete_docs" 
                  checked={selectedReason === 'incomplete_docs'}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="text-red-600 focus:ring-red-500" 
                />
                <span className="text-red-800">R002: Неполные документы</span>
              </label>
              <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-red-100 cursor-pointer">
                <input 
                  type="radio" 
                  name="reason" 
                  value="false_info" 
                  checked={selectedReason === 'false_info'}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="text-red-600 focus:ring-red-500" 
                />
                <span className="text-red-800">R003: Ложная информация</span>
              </label>
              <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-red-100 cursor-pointer">
                <input 
                  type="radio" 
                  name="reason" 
                  value="duplicate" 
                  checked={selectedReason === 'duplicate'}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="text-red-600 focus:ring-red-500" 
                />
                <span className="text-red-800">R004: Дублирование</span>
              </label>
            </div>
          </div>
        )}

        {/* Specialist Comment */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Комментарий специалиста:
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            placeholder="Дополнительные комментарии..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-neutral-200">
          <AccessibleButton
            onClick={handleClose}
            variant="ghost"
            size="md"
            className="sm:w-auto w-full"
          >
            Отмена
          </AccessibleButton>
          <AccessibleButton 
            onClick={handleSave}
            disabled={!selectedDecision || (selectedDecision === 'rejected' && !selectedReason)}
            variant={selectedDecision === 'approved' ? 'success' : 'danger'}
            size="md"
            className="sm:w-auto w-full"
          >
            {selectedDecision === 'approved' ? 'Одобрить заявку' : 'Отклонить заявку'}
          </AccessibleButton>
        </div>
      </div>
    </MobileOptimizedModal>
  );
}
