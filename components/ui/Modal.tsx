'use client';

import { ReactNode, useEffect } from 'react';
import { useModalFocus } from '@/lib/hooks/useModalFocus';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '',
  showCloseButton = true,
  closeOnOverlayClick = true
}: ModalProps) {
  const modalRef = useModalFocus(isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    'sm': 'max-w-sm md:max-w-md',
    'md': 'max-w-md md:max-w-lg',
    'lg': 'max-w-lg md:max-w-2xl',
    'xl': 'max-w-2xl md:max-w-4xl',
    'full': 'max-w-full mx-2 md:mx-4',
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div 
        ref={modalRef}
        className={`modal-content w-full ${sizeClasses[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {title && (
          <div className="flex items-center justify-between mb-4 md:mb-6 sticky top-0 bg-white z-10 pb-4 border-b border-neutral-200">
            <h2 id="modal-title" className="text-lg md:text-xl font-semibold text-neutral-900 pr-4">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-full hover:bg-neutral-100 flex-shrink-0"
                aria-label="Закрыть модальное окно"
              >
                <i className="ri-close-line text-lg md:text-xl"></i>
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
