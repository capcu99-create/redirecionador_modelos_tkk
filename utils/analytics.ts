import { supabase } from '../supabaseClient';
import { StatsMap } from '../types';

// Função para buscar estatísticas do banco
export const fetchStatsFromDb = async (period: 'all' | 'day' | 'week' | 'month' = 'all'): Promise<StatsMap> => {
  let query = supabase.from('analytics_events').select('model_id, event_type, language, created_at');

  if (period !== 'all') {
    const now = new Date();
    let startDate = new Date();
    
    if (period === 'day') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    }
    
    query = query.gte('created_at', startDate.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar stats:', error);
    return {};
  }

  const statsMap: StatsMap = {};
  
  if (data) {
    data.forEach((row: any) => {
      const slug = row.model_id;
      if (!statsMap[slug]) {
        statsMap[slug] = {
          views: 0,
          clicks: 0,
          pt_views: 0,
          pt_clicks: 0,
          default_views: 0,
          default_clicks: 0
        };
      }
      
      const isPt = row.language === 'pt';
      
      if (row.event_type === 'view') {
        statsMap[slug].views++;
        if (isPt) statsMap[slug].pt_views++;
        else statsMap[slug].default_views++;
      } else if (row.event_type === 'click') {
        statsMap[slug].clicks++;
        if (isPt) statsMap[slug].pt_clicks++;
        else statsMap[slug].default_clicks++;
      }
    });
  }

  return statsMap;
};

// Registra uma visualização de página
export const trackView = async (modelId: string, language: string) => {
  const normalizedId = modelId.toLowerCase();
  const langType = language === 'pt' ? 'pt' : 'default';
  
  const { error } = await supabase.from('analytics_events').insert([
    { model_id: normalizedId, event_type: 'view', language: langType }
  ]);

  if (error) {
    console.error('Erro ao registrar view:', error);
  }
};

// Registra um clique
export const trackClick = async (modelId: string, language: string) => {
  const normalizedId = modelId.toLowerCase();
  const langType = language === 'pt' ? 'pt' : 'default';

  const { error } = await supabase.from('analytics_events').insert([
    { model_id: normalizedId, event_type: 'click', language: langType }
  ]);

  if (error) {
    console.error('Erro ao registrar click:', error);
  }
};

export const resetStats = async () => {
  console.warn("Reset de estatísticas via frontend desabilitado por segurança com banco de dados.");
};
