import { MODELS } from '../constants';
import { StatsMap } from '../types';

const STORAGE_KEY = 'bridge_app_analytics';

// Recupera as estatísticas atuais
export const getStats = (): StatsMap => {
  if (typeof localStorage === 'undefined') return {};
  
  const stored = localStorage.getItem(STORAGE_KEY);
  const data: StatsMap = stored ? JSON.parse(stored) : {};
  
  // Garante que todos os modelos configurados existam no objeto, mesmo que zerados
  Object.keys(MODELS).forEach(key => {
    if (!data[key]) {
      data[key] = { views: 0, clicks: 0 };
    }
  });
  
  return data;
};

// Registra uma visualização de página
export const trackView = (modelId: string) => {
  if (typeof localStorage === 'undefined') return;
  
  const normalizedId = modelId.toLowerCase();
  const stats = getStats();
  
  if (!stats[normalizedId]) {
    stats[normalizedId] = { views: 0, clicks: 0 };
  }
  
  stats[normalizedId].views += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

// Registra um clique no botão de acesso
export const trackClick = (modelId: string) => {
  if (typeof localStorage === 'undefined') return;

  const normalizedId = modelId.toLowerCase();
  const stats = getStats();
  
  if (!stats[normalizedId]) {
    stats[normalizedId] = { views: 0, clicks: 0 };
  }
  
  stats[normalizedId].clicks += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

// Reinicia as estatísticas
export const resetStats = () => {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
