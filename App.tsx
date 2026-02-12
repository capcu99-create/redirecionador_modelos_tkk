import React, { useState, useEffect } from 'react';
import BridgePage from './components/BridgePage';
import AdminPanel from './components/AdminPanel';
import { ADMIN_ROUTE, MODELS } from './constants';

const App: React.FC = () => {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Normalizar rota: #/rota -> /rota
  const getPath = (h: string) => {
    const clean = h.replace(/^#/, '');
    return clean.startsWith('/') ? clean : '/' + clean;
  };

  const currentPath = getPath(hash);
  const modelId = currentPath.substring(1).toLowerCase(); // Remove a barra inicial e normaliza

  // Lógica de Redirecionamento Inteligente
  useEffect(() => {
    // Pega o primeiro modelo da lista (no caso, anaaclara)
    const defaultModel = Object.keys(MODELS)[0];
    
    // Verifica se o modelo na URL existe na nossa lista
    const isValidModel = Object.keys(MODELS).includes(modelId);
    
    // Se for a raiz, ou vazio, ou um modelo que não existe (e não for o painel admin)
    // Redireciona para o modelo padrão (anaaclara)
    if (
      currentPath !== ADMIN_ROUTE && 
      (currentPath === '/' || currentPath === '' || !isValidModel)
    ) {
      if (defaultModel) {
        // Pequeno delay para garantir que o redirecionamento aconteça suavemente
        setTimeout(() => {
           window.location.hash = '/' + defaultModel;
        }, 100);
      }
    }
  }, [currentPath, modelId]);

  // Enquanto redireciona ou se não houver modelos configurados
  const isValidModel = Object.keys(MODELS).includes(modelId);
  if ((currentPath === '/' || currentPath === '' || !isValidModel) && currentPath !== ADMIN_ROUTE) {
    // Exibe um loading em vez de retornar null (tela preta)
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-10 h-10 border-4 border-roxo border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Rota Admin
  if (currentPath === ADMIN_ROUTE) {
    return <AdminPanel />;
  }

  return <BridgePage modelId={modelId} />;
};

export default App;
