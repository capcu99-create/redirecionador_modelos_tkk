import { supabase } from '../supabaseClient';
import { StatsMap } from '../types';

type TimePeriod = 'all' | 'day' | 'week' | 'month';

// Função para buscar estatísticas do banco
export const fetchStatsFromDb = async (period: TimePeriod = 'all'): Promise<StatsMap> => {
  // 1. Busca os dados agregados antigos (para compatibilidade)
  const { data: oldData, error: oldError } = await supabase
    .from('model_stats')
    .select('slug, views, clicks');

  if (oldError) {
    console.error('Erro ao buscar stats antigos:', oldError);
  }

  const statsMap: StatsMap = {};
  
  if (oldData) {
    oldData.forEach((row: any) => {
      statsMap[row.slug] = {
        views: row.views || 0,
        clicks: row.clicks || 0,
        pt_views: 0,
        pt_clicks: 0,
        default_views: 0,
        default_clicks: 0
      };
    });
  }

  // 2. Busca os dados novos da tabela de eventos baseados no período
  let query = supabase.from('analytics_events').select('*');
  
  if (period !== 'all') {
    const now = new Date();
    let startDate = new Date();
    
    if (period === 'day') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setDate(now.getDate() - 30);
    }
    
    query = query.gte('created_at', startDate.toISOString());
  }

  const { data: newEvents, error: newError } = await query;

  if (newError) {
    console.error('Erro ao buscar novos eventos:', newError);
    return statsMap; // Retorna o que conseguiu dos antigos
  }

  // 3. Agrega os novos eventos
  if (newEvents) {
    // Se for um período específico, zeramos os antigos para mostrar apenas o período
    if (period !== 'all') {
      Object.keys(statsMap).forEach(key => {
        statsMap[key] = {
          views: 0, clicks: 0, pt_views: 0, pt_clicks: 0, default_views: 0, default_clicks: 0
        };
      });
    }

    newEvents.forEach((event: any) => {
      const slug = event.model_id;
      if (!statsMap[slug]) {
        statsMap[slug] = {
          views: 0, clicks: 0, pt_views: 0, pt_clicks: 0, default_views: 0, default_clicks: 0
        };
      }

      const isPt = event.language === 'pt';

      if (event.event_type === 'view') {
        statsMap[slug].views += 1;
        if (isPt) statsMap[slug].pt_views = (statsMap[slug].pt_views || 0) + 1;
        else statsMap[slug].default_views = (statsMap[slug].default_views || 0) + 1;
      } else if (event.event_type === 'click') {
        statsMap[slug].clicks += 1;
        if (isPt) statsMap[slug].pt_clicks = (statsMap[slug].pt_clicks || 0) + 1;
        else statsMap[slug].default_clicks = (statsMap[slug].default_clicks || 0) + 1;
      }
    });
  }

  return statsMap;
};

// Registra uma visualização de página
export const trackView = async (modelId: string, lang: string = 'default') => {
  const normalizedId = modelId.toLowerCase();
  
  // 1. Mantém a compatibilidade com a tabela antiga
  const { error: oldError } = await supabase.rpc('increment_view', { 
    row_slug: normalizedId 
  });

  if (oldError) {
    console.error('Erro ao registrar view (antigo):', oldError);
  }

  // 2. Registra na nova tabela de eventos
  const { error: newError } = await supabase.from('analytics_events').insert([
    {
      model_id: normalizedId,
      event_type: 'view',
      language: lang
    }
  ]);

  if (newError) {
    console.error('Erro ao registrar view (novo):', newError);
  }
};

// Registra um clique
export const trackClick = async (modelId: string, lang: string = 'default') => {
  const normalizedId = modelId.toLowerCase();

  // 1. Mantém a compatibilidade com a tabela antiga
  const { error: oldError } = await supabase.rpc('increment_click', { 
    row_slug: normalizedId 
  });

  if (oldError) {
    console.error('Erro ao registrar click (antigo):', oldError);
  }

  // 2. Registra na nova tabela de eventos
  const { error: newError } = await supabase.from('analytics_events').insert([
    {
      model_id: normalizedId,
      event_type: 'click',
      language: lang
    }
  ]);

  if (newError) {
    console.error('Erro ao registrar click (novo):', newError);
  }
};

// Reset agora precisa de permissão ou ser feito via tabela, 
// por segurança vamos apenas logar, pois deletar dados do banco via front é perigoso sem auth
export const resetStats = async () => {
  console.warn("Reset de estatísticas via frontend desabilitado por segurança com banco de dados.");
};
