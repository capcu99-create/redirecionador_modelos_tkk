import React, { useEffect, useState } from 'react';
import { fetchStatsFromDb } from '../utils/analytics';
import { StatsMap, StatData } from '../types';
import { MODELS } from '../constants';

type TimePeriod = 'all' | 'day' | 'week' | 'month';

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<StatsMap>({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<TimePeriod>('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const dbStats = await fetchStatsFromDb(period);
      setStats(dbStats);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Atualiza a cada 10 segundos
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [period]);

  const calculateCTR = (clicks: number, views: number) => {
    if (!views || views === 0) return '0%';
    return ((clicks / views) * 100).toFixed(1) + '%';
  };

  // Prepara dados combinando configuração local com dados do banco
  const getDisplayData = (key: string) => {
    return stats[key] || { 
      views: 0, 
      clicks: 0,
      pt_views: 0,
      pt_clicks: 0,
      default_views: 0,
      default_clicks: 0
    };
  };

  // Calcula totais
  const totalViews = Object.values(stats).reduce((acc, curr) => acc + curr.views, 0);
  const totalClicks = Object.values(stats).reduce((acc, curr) => acc + curr.clicks, 0);
  const totalCTR = calculateCTR(totalClicks, totalViews);

  return (
    <div className="min-h-screen bg-bg text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-roxo uppercase tracking-wider">
              Painel Administrativo
            </h1>
            <button 
              onClick={() => window.location.hash = '/'} 
              className="text-gray-500 text-xs hover:text-white mt-1 underline"
            >
              ← Voltar para o site
            </button>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={period} 
              onChange={(e) => setPeriod(e.target.value as TimePeriod)}
              className="bg-card border border-borda-card text-white text-sm rounded-lg focus:ring-roxo focus:border-roxo block p-2.5"
            >
              <option value="all">Todo o tempo</option>
              <option value="day">Hoje</option>
              <option value="week">Últimos 7 dias</option>
              <option value="month">Últimos 30 dias</option>
            </select>
            {loading && <span className="text-xs text-gray-500 animate-pulse">Atualizando...</span>}
            <button 
              onClick={() => loadData()}
              className="text-xs font-bold text-white border border-white/30 px-3 py-2 rounded hover:bg-white/10 transition-colors"
            >
              🔄 ATUALIZAR
            </button>
          </div>
        </div>

        {/* Status Conexão */}
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl mb-8 text-sm text-green-200">
          <p className="font-bold flex items-center gap-2">
            ⚡ Conectado ao Supabase
          </p>
          <p className="mt-1 opacity-80">
            Os dados agora estão salvos na nuvem. Você pode ver os mesmos números de qualquer dispositivo.
            <br/>
            <span className="text-yellow-400 font-bold mt-2 block">⚠️ ATENÇÃO: Para que as estatísticas por período e idioma funcionem, você precisa criar a tabela `analytics_events` no seu Supabase. Veja as instruções abaixo.</span>
          </p>
        </div>

        {/* Card de Resumo */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-borda-card p-5 rounded-xl text-center">
            <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Total Visitas</h3>
            <p className="text-3xl font-bold text-white">{totalViews}</p>
          </div>
          <div className="bg-card border border-borda-card p-5 rounded-xl text-center">
            <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Total Telegram</h3>
            <p className="text-3xl font-bold text-roxo">{totalClicks}</p>
          </div>
          <div className="bg-card border border-borda-card p-5 rounded-xl text-center">
            <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Conversão (CTR)</h3>
            <p className="text-3xl font-bold text-green-400">{totalCTR}</p>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-card border border-borda-card rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#222] text-gray-400 text-xs uppercase tracking-wider border-b border-borda-card">
                  <th className="p-4 font-bold">Modelo (Slug)</th>
                  <th className="p-4 font-bold text-right">Visitas (PT / Gringo)</th>
                  <th className="p-4 font-bold text-right">Telegram (PT / Gringo)</th>
                  <th className="p-4 font-bold text-right">Conv. % (PT / Gringo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borda-card">
                {Object.keys(MODELS).map((key) => {
                  const data = getDisplayData(key);
                  return (
                    <tr key={key} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-white capitalize">{key}</span>
                        <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]" title={`PT: ${MODELS[key].pt}\nOutros: ${MODELS[key].default}`}>
                          PT: {MODELS[key].pt}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                          Outros: {MODELS[key].default}
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-gray-300">
                        <div className="font-bold text-white text-lg">{data.views}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="text-green-400" title="Português">{data.pt_views}</span> / <span className="text-blue-400" title="Gringo">{data.default_views}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-roxo font-bold">
                        <div className="text-lg">{data.clicks}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="text-green-400" title="Português">{data.pt_clicks}</span> / <span className="text-blue-400" title="Gringo">{data.default_clicks}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-green-400">
                        <div className="text-lg">{calculateCTR(data.clicks, data.views)}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="text-green-400" title="Português">{calculateCTR(data.pt_clicks, data.pt_views)}</span> / <span className="text-blue-400" title="Gringo">{calculateCTR(data.default_clicks, data.default_views)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {Object.keys(MODELS).length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhum modelo configurado em constants.ts
            </div>
          )}
        </div>

        {/* Instruções SQL */}
        <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-xl">
          <h2 className="text-lg font-bold text-white mb-4">Instruções para o Supabase (MUITO IMPORTANTE)</h2>
          <p className="text-gray-400 mb-4 text-sm">
            Para que o filtro de tempo (hoje, semana, mês) e a separação por idioma funcionem, você precisa criar uma nova tabela no seu banco de dados Supabase. 
            Acesse o <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-roxo underline">Dashboard do Supabase</a>, vá em <strong>SQL Editor</strong> e rode o seguinte comando:
          </p>
          <pre className="bg-black p-4 rounded-lg text-green-400 text-xs overflow-x-auto border border-[#333]">
{`-- Cria a tabela para registrar cada evento individualmente
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  model_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'view' ou 'click'
  language TEXT NOT NULL -- 'pt' ou 'default'
);

-- Permite que qualquer pessoa insira dados (necessário para o frontend)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserção anônima em analytics_events" 
ON analytics_events FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Permitir leitura anônima em analytics_events" 
ON analytics_events FOR SELECT 
TO anon 
USING (true);`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
