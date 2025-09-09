'use client';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  className?: string;
}

export default function LanguageSwitcher({ 
  currentLanguage, 
  onLanguageChange, 
  className = '' 
}: LanguageSwitcherProps) {
  return (
    <div className={`flex bg-neutral-100 rounded-full p-1 ${className}`}>
      <button
        onClick={() => onLanguageChange('ru')}
        className={`px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
          currentLanguage === 'ru'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-600 hover:text-neutral-900'
        }`}
      >
        <span className="hidden sm:inline">Русский</span>
        <span className="sm:hidden">RU</span>
      </button>
      <button
        onClick={() => onLanguageChange('ky')}
        className={`px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
          currentLanguage === 'ky'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-600 hover:text-neutral-900'
        }`}
      >
        <span className="hidden sm:inline">Кыргызча</span>
        <span className="sm:hidden">KY</span>
      </button>
    </div>
  );
}
