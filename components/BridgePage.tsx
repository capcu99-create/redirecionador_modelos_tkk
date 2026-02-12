import React, { useState, useEffect, useRef } from 'react';
import { checkEnvironment } from '../utils/browserCheck';
import { trackView, trackClick } from '../utils/analytics';
import { TEXTS, MODELS, DEFAULT_GIF } from '../constants';
import { LangCode } from '../types';
import LanguageSelector from './LanguageSelector';

interface BridgePageProps {
  modelId: string;
}

const BridgePage: React.FC<BridgePageProps> = ({ modelId }) => {
  const [lang, setLang] = useState<LangCode>('pt');
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLangModal, setShowLangModal] = useState(true);
  
  // UseRef para evitar contagem dupla em StrictMode/Dev
  const hasTrackedView = useRef(false);

  // If the modelId from URL doesn't exist in our config, verify it
  const targetUrl = modelId ? MODELS[modelId.toLowerCase()] : null;

  useEffect(() => {
    // Analytics: Registrar visualização
    if (modelId && targetUrl && !hasTrackedView.current) {
      trackView(modelId);
      hasTrackedView.current = true;
    }

    // Simulate the 800ms delay from the original script
    const timer = setTimeout(() => {
      const allowed = checkEnvironment();
      setIsAllowed(allowed);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [modelId, targetUrl]);

  const handleAccess = () => {
    if (isAllowed && targetUrl && modelId) {
      // Analytics: Registrar clique
      trackClick(modelId);
      window.location.href = targetUrl;
    }
  };

  const handleLanguageSelect = (selectedLang: LangCode) => {
    setLang(selectedLang);
    setShowLangModal(false);
  };

  // If URL is invalid (e.g. /#/unknown), redirect to a safe fallback or show error
  if (!targetUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Modelo não encontrado</h1>
          <p>Verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  const t = TEXTS[lang];

  return (
    <div className="min-h-screen flex justify-center bg-bg text-white p-5 relative overflow-hidden">
      
      {/* LANGUAGE MODAL / POP-UP */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-card border border-borda-card p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <h2 className="text-center text-lg font-bold text-white mb-2 uppercase tracking-wider">
              Select Language
            </h2>
            <p className="text-center text-gray-400 text-sm mb-6">
              Selecione seu idioma para continuar
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={() => handleLanguageSelect('pt')}
                className="w-full flex items-center p-4 bg-[#262626] hover:bg-roxo/20 border border-[#333] hover:border-roxo rounded-xl transition-all duration-200 group"
              >
                <span className="text-2xl mr-4">🇧🇷</span>
                <span className="font-bold text-white group-hover:text-roxo transition-colors">Português</span>
              </button>

              <button 
                onClick={() => handleLanguageSelect('es')}
                className="w-full flex items-center p-4 bg-[#262626] hover:bg-roxo/20 border border-[#333] hover:border-roxo rounded-xl transition-all duration-200 group"
              >
                <span className="text-2xl mr-4">🇪🇸</span>
                <span className="font-bold text-white group-hover:text-roxo transition-colors">Español</span>
              </button>

              <button 
                onClick={() => handleLanguageSelect('en')}
                className="w-full flex items-center p-4 bg-[#262626] hover:bg-roxo/20 border border-[#333] hover:border-roxo rounded-xl transition-all duration-200 group"
              >
                <span className="text-2xl mr-4">🇺🇸</span>
                <span className="font-bold text-white group-hover:text-roxo transition-colors">English</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[420px] flex flex-col items-center pt-5">
        
        {/* Header */}
        <div className="w-full flex justify-end mb-6">
          <LanguageSelector currentLang={lang} onChange={setLang} />
        </div>

        {/* Title */}
        <h1 className="text-lg font-extrabold mb-5 uppercase tracking-wide text-center">
          {t.title}
        </h1>

        {/* GIF Preview */}
        <div className="w-full aspect-video bg-black rounded-2xl flex justify-center items-center mb-6 border border-[#222] overflow-hidden relative shadow-lg">
          <img 
            src={DEFAULT_GIF} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tutorial Steps */}
        <div className="bg-card border-[1.5px] border-borda-card border-l-[5px] border-l-roxo rounded-2xl p-6 w-full mb-6 text-left shadow-md">
          {t.steps.map((stepHtml, index) => (
            <p 
              key={index} 
              className="mb-4 last:mb-0 text-[15px] font-semibold leading-relaxed text-gray-200"
              dangerouslySetInnerHTML={{ __html: stepHtml }} 
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleAccess}
          disabled={!isAllowed}
          className={`
            w-full p-5 rounded-2xl flex justify-center items-center 
            border-none text-white font-bold uppercase text-[15px] min-h-[60px]
            transition-all duration-300
            ${loading ? 'bg-[#222] cursor-wait' : ''}
            ${!loading && isAllowed 
              ? 'bg-roxo cursor-pointer shadow-[0_0_25px_rgba(138,43,226,0.4)] hover:scale-[1.02]' 
              : 'bg-[#222] cursor-default'}
          `}
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white/10 border-t-gray-500 rounded-full animate-spin"></div>
          ) : (
            <span className={isAllowed ? 'block' : 'opacity-50'}>
              {t.btn}
            </span>
          )}
        </button>

        {/* Footer */}
        <div className="mt-6 text-roxo font-extrabold uppercase text-[13px] tracking-wide text-center">
          {t.footer}
        </div>

      </div>
    </div>
  );
};

export default BridgePage;