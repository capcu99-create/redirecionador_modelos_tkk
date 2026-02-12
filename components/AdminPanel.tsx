import React, { useEffect, useState } from 'react';
import { getStats, resetStats } from '../utils/analytics';
import { StatsMap, StatData } from '../types';
import { MODELS } from '../constants';

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<StatsMap>({});

  const loadData = () => {
    setStats(getStats());
  };

  useEffect(() => {
    loadData();
    // Atualiza a cada 5 segundos para ver mudanças em tempo real se tiver abas abertas
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja zerar todas as estatísticas?')) {
      resetStats();
      loadData();
    }
  };

  const calculateCTR = (clicks: number, views: number) => {
    if (views === 0) return '0%';
    return ((clicks / views) * 100).toFixed(1) + '%';
  };

  // Calcula totais
  const statsValues = Object.values(stats) as StatData[];
  const totalViews = statsValues.reduce((acc, curr) => acc + curr.views, 0);
  const totalClicks = statsValues.reduce((acc, curr) => acc + curr.clicks, 0);
  const totalCTR = calculateCTR(totalClicks, totalViews);

  return (
    <div className="min-h-screen bg-bg text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
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
          <button 
            onClick={handleReset}
            className="text-xs font-bold text-red-500 border border-red-500/30 px-3 py-2 rounded hover:bg-red-500/10 transition-colors"
          >
            ZERAR ESTATÍSTICAS
          </button>
        </div>

        {/* Aviso sobre LocalStorage */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mb-8 text-sm text-yellow-200">
          <p className="font-bold flex items-center gap-2">
            ⚠️ Modo Demonstração (Sem Banco de Dados)
          </p>
          <p className="mt-1 opacity-80">
            Este painel mostra apenas os dados salvos no <strong>cache deste navegador</strong>. 
            Como o site não possui um banco de dados online, você não verá os acessos de outros usuários, apenas os seus próprios testes.
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
        <div className="bg-card border border-borda-card rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#222] text-gray-400 text-xs uppercase tracking-wider border-b border-borda-card">
                  <th className="p-4 font-bold">Modelo (Slug)</th>
                  <th className="p-4 font-bold text-right">Visitas</th>
                  <th className="p-4 font-bold text-right">Telegram</th>
                  <th className="p-4 font-bold text-right">Conv. %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borda-card">
                {Object.keys(MODELS).map((key) => {
                  const data = stats[key] || { views: 0, clicks: 0 };
                  return (
                    <tr key={key} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-white capitalize">{key}</span>
                        <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                          {MODELS[key]}
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-gray-300">{data.views}</td>
                      <td className="p-4 text-right font-mono text-roxo font-bold">{data.clicks}</td>
                      <td className="p-4 text-right font-mono text-green-400">{calculateCTR(data.clicks, data.views)}</td>
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

        <div className="mt-6 text-center text-xs text-gray-600">
          <p>Os dados são salvos localmente no navegador. Limpar o cache apagará esses dados.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;