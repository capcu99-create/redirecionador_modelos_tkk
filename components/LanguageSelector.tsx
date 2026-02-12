import React, { useState, useRef, useEffect } from 'react';
import { LangCode } from '../types';

interface LanguageSelectorProps {
  currentLang: LangCode;
  onChange: (lang: LangCode) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSelect = (lang: LangCode) => {
    onChange(lang);
    setIsOpen(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFlag = (lang: LangCode) => {
    switch (lang) {
      case 'pt': return '🇧🇷';
      case 'es': return '🇪🇸';
      case 'en': return '🇺🇸';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleOpen}
        className="bg-[#262626] px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 text-sm border border-[#333] font-semibold text-white hover:bg-[#333] transition-colors"
      >
        <span>{getFlag(currentLang)}</span>
        <span>{currentLang.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-[#262626] rounded-xl z-50 border border-[#444] min-w-[120px] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div onClick={() => handleSelect('pt')} className="px-6 py-3 cursor-pointer border-b border-[#333] hover:bg-[#333] transition-colors">🇧🇷 PT</div>
          <div onClick={() => handleSelect('es')} className="px-6 py-3 cursor-pointer border-b border-[#333] hover:bg-[#333] transition-colors">🇪🇸 ES</div>
          <div onClick={() => handleSelect('en')} className="px-6 py-3 cursor-pointer hover:bg-[#333] transition-colors">🇺🇸 EN</div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
