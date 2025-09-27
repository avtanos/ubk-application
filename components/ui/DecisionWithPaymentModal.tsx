'use client';

import { useState } from 'react';
import DecisionModal from './DecisionModal';
import PaymentAssignmentModal from './PaymentAssignmentModal';
import { Application, BenefitAssignment } from '@/lib/types-updated';
import { PaymentRecord } from '@/lib/api/paymentService';

interface DecisionWithPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onDecisionComplete: (decision: 'approved' | 'rejected', payment?: PaymentRecord, assignment?: BenefitAssignment) => void;
}

export default function DecisionWithPaymentModal({ 
  isOpen, 
  onClose, 
  application, 
  onDecisionComplete 
}: DecisionWithPaymentModalProps) {
  const [showDecisionModal, setShowDecisionModal] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);

  const handleDecision = (
    selectedDecision: 'approved' | 'rejected', 
    reason?: string, 
    comment?: string
  ) => {
    setDecision(selectedDecision);
    
    if (selectedDecision === 'approved') {
      // Переходим к назначению выплаты
      setShowDecisionModal(false);
      setShowPaymentModal(true);
    } else {
      // Отклоняем заявку
      onDecisionComplete('rejected');
      handleClose();
    }
  };

  const handlePaymentAssigned = (payment: PaymentRecord, assignment: BenefitAssignment) => {
    onDecisionComplete('approved', payment, assignment);
    handleClose();
  };

  const handleClose = () => {
    setShowDecisionModal(true);
    setShowPaymentModal(false);
    setDecision(null);
    onClose();
  };

  const handlePaymentModalClose = () => {
    // Возвращаемся к принятию решения
    setShowPaymentModal(false);
    setShowDecisionModal(true);
    setDecision(null);
  };

  return (
    <>
      <DecisionModal
        isOpen={showDecisionModal && isOpen}
        onClose={handleClose}
        applicationId={application.applicationNumber}
        onSaveDecision={handleDecision}
      />
      
      <PaymentAssignmentModal
        isOpen={showPaymentModal && isOpen}
        onClose={handlePaymentModalClose}
        application={application}
        onPaymentAssigned={handlePaymentAssigned}
      />
    </>
  );
}
