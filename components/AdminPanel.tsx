import React, { useEffect, useState } from 'react';
import { fetchStatsFromDb } from '../utils/analytics';
import { StatsMap, StatData } from '../types';
import { MODELS } from '../constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

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

  // Prepara dados para os gráficos
  const chartData = Object.keys(MODELS).map(key => {
    const data = getDisplayData(key);
    return {
      name: key.charAt(0).toUpperCase() + key.slice(1),
      Visitas: data.views,
      Cliques: data.clicks,
    };
  }).filter(item => item.Visitas > 0 || item.Cliques > 0);

  const totalPtViews = Object.values(stats).reduce((acc, curr) => acc + (curr.pt_views || 0), 0);
  const totalDefaultViews = Object.values(stats).reduce((acc, curr) => acc + (curr.default_views || 0), 0);
  
  const pieData = [
    { name: 'Português', value: totalPtViews, color: '#4ade80' },
    { name: 'Gringo', value: totalDefaultViews, color: '#3b82f6' }
  ].filter(item => item.value > 0);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-borda-card p-6 rounded-xl text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
            <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Total Visitas</h3>
            <p className="text-4xl font-bold text-white">{totalViews}</p>
          </div>
          <div className="bg-card border border-borda-card p-6 rounded-xl text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-roxo/50"></div>
            <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Total Telegram</h3>
            <p className="text-4xl font-bold text-roxo">{totalClicks}</p>
          </div>
          <div className="bg-card border border-borda-card p-6 rounded-xl text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50"></div>
            <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Conversão (CTR)</h3>
            <p className="text-4xl font-bold text-green-400">{totalCTR}</p>
          </div>
        </div>

        {/* Gráficos */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Gráfico de Barras */}
            <div className="bg-card border border-borda-card p-6 rounded-xl shadow-lg lg:col-span-2">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                📊 Visitas vs Cliques por Modelo
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#888" tick={{fill: '#888', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#888" tick={{fill: '#888', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                    <Bar dataKey="Visitas" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    <Bar dataKey="Cliques" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico de Pizza (Público) */}
            <div className="bg-card border border-borda-card p-6 rounded-xl shadow-lg">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                🌍 Distribuição de Público
              </h3>
              <div className="h-[300px] w-full flex items-center justify-center">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        formatter={(value: number) => [value, 'Visitas']}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-500 text-sm flex flex-col items-center gap-2">
                    <span className="text-2xl">🤷‍♂️</span>
                    Sem dados de idioma suficientes
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabela */}
        <div className="bg-card border border-borda-card rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="p-6 border-b border-borda-card bg-[#1a1a1a]">
            <h3 className="text-white font-bold flex items-center gap-2">
              📋 Detalhamento Completo
            </h3>
          </div>
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
                        <span className="font-bold text-white capitalize text-lg">{key}</span>
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]" title={`PT: ${MODELS[key].pt}\nOutros: ${MODELS[key].default}`}>
                          PT: <a href={MODELS[key].pt} target="_blank" rel="noreferrer" className="hover:text-roxo transition-colors">{MODELS[key].pt}</a>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                          Outros: <a href={MODELS[key].default} target="_blank" rel="noreferrer" className="hover:text-roxo transition-colors">{MODELS[key].default}</a>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-gray-300">
                        <div className="font-bold text-white text-xl">{data.views}</div>
                        <div className="text-xs text-gray-500 mt-1 bg-black/30 inline-block px-2 py-1 rounded">
                          <span className="text-green-400 font-bold" title="Português">{data.pt_views}</span> <span className="text-gray-600">/</span> <span className="text-blue-400 font-bold" title="Gringo">{data.default_views}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-roxo font-bold">
                        <div className="text-xl">{data.clicks}</div>
                        <div className="text-xs text-gray-500 mt-1 bg-black/30 inline-block px-2 py-1 rounded">
                          <span className="text-green-400 font-bold" title="Português">{data.pt_clicks}</span> <span className="text-gray-600">/</span> <span className="text-blue-400 font-bold" title="Gringo">{data.default_clicks}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-green-400">
                        <div className="text-xl">{calculateCTR(data.clicks, data.views)}</div>
                        <div className="text-xs text-gray-500 mt-1 bg-black/30 inline-block px-2 py-1 rounded">
                          <span className="text-green-400 font-bold" title="Português">{calculateCTR(data.pt_clicks, data.pt_views)}</span> <span className="text-gray-600">/</span> <span className="text-blue-400 font-bold" title="Gringo">{calculateCTR(data.default_clicks, data.default_views)}</span>
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

      </div>
    </div>
  );
};

export default AdminPanel;
