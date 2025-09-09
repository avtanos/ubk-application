'use client';

import { ReactNode, useEffect, useState } from 'react';
import Modal from './Modal';

interface MobileOptimizedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  mobileFullscreen?: boolean;
}

export default function MobileOptimizedModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '',
  showCloseButton = true,
  closeOnOverlayClick = true,
  mobileFullscreen = false
}: MobileOptimizedModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getResponsiveSize = () => {
    if (isMobile && mobileFullscreen) {
      return 'full';
    }
    return size;
  };

  const getResponsiveClassName = () => {
    const baseClasses = className;
    
    if (isMobile) {
      return `${baseClasses} ${mobileFullscreen ? 'h-screen' : 'max-h-[95vh]'}`;
    }
    
    return baseClasses;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={getResponsiveSize()}
      className={getResponsiveClassName()}
      showCloseButton={showCloseButton}
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
        {children}
      </div>
    </Modal>
  );
}
