import { supabase } from '../supabaseClient';
import { StatsMap } from '../types';

// Função para buscar estatísticas do banco
export const fetchStatsFromDb = async (): Promise<StatsMap> => {
  const { data, error } = await supabase
    .from('model_stats')
    .select('slug, views, clicks');

  if (error) {
    console.error('Erro ao buscar stats:', error);
    return {};
  }

  const statsMap: StatsMap = {};
  
  if (data) {
    data.forEach((row: any) => {
      statsMap[row.slug] = {
        views: row.views,
        clicks: row.clicks
      };
    });
  }

  return statsMap;
};

// Registra uma visualização de página usando RPC (Atomic Increment)
export const trackView = async (modelId: string) => {
  const normalizedId = modelId.toLowerCase();
  
  // Chama a função SQL 'increment_view' que criamos no banco
  const { error } = await supabase.rpc('increment_view', { 
    row_slug: normalizedId 
  });

  if (error) {
    console.error('Erro ao registrar view:', error);
  }
};

// Registra um clique usando RPC (Atomic Increment)
export const trackClick = async (modelId: string) => {
  const normalizedId = modelId.toLowerCase();

  // Chama a função SQL 'increment_click' que criamos no banco
  const { error } = await supabase.rpc('increment_click', { 
    row_slug: normalizedId 
  });

  if (error) {
    console.error('Erro ao registrar click:', error);
  }
};

// Reset agora precisa de permissão ou ser feito via tabela, 
// por segurança vamos apenas logar, pois deletar dados do banco via front é perigoso sem auth
export const resetStats = async () => {
  console.warn("Reset de estatísticas via frontend desabilitado por segurança com banco de dados.");
};
