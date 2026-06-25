'use client';

import { Plus, Coffee, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function LotesPage() {
  const lotesMock = [
    { id: 'LT-001', name: 'Catuaí Amarelo - Fermentado', safra: '2023', score: '88', total: 500, vendido: 320, status: 'Ativo' },
    { id: 'LT-002', name: 'Bourbon Vermelho', safra: '2024', score: '86', total: 300, vendido: 50, status: 'Ativo' },
    { id: 'LT-003', name: 'Mundo Novo - Natural', safra: '2023', score: '84', total: 650, vendido: 650, status: 'Esgotado' },
    { id: 'LT-004', name: 'Arara - Lavado', safra: '2024', score: '85', total: 400, vendido: 0, status: 'Em Análise' },
  ];

  return (
    <div className="p-8">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#4a2c2a] mb-1">Gestão de Lotes</h1>
          <p className="text-[#6b5b58]">Controle seus cafés e acompanhe as vendas.</p>
        </div>
        <Link href="/produtor/lotes/novo" className="flex items-center justify-center gap-2 bg-[#f97316] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200">
          <Plus size={18} />
          Cadastrar Novo Lote
        </Link>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por lote, variedade..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#4a2c2a]/15 bg-white text-[#4a2c2a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#4a2c2a]/15 text-[#4a2c2a] font-medium rounded-xl hover:bg-[#4a2c2a]/5 transition-colors">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      {/* Tabela de Lotes */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#4a2c2a]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4a2c2a]/5 border-b border-[#4a2c2a]/10 text-[#4a2c2a]">
                <th className="p-4 font-semibold text-sm">Identificação do Lote</th>
                <th className="p-4 font-semibold text-sm">Safra</th>
                <th className="p-4 font-semibold text-sm">Score</th>
                <th className="p-4 font-semibold text-sm">Status</th>
                <th className="p-4 font-semibold text-sm">Disponível (Kg)</th>
                <th className="p-4 font-semibold text-sm">Vendido (Kg)</th>
              </tr>
            </thead>
            <tbody>
              {lotesMock.map((lote) => (
                <tr key={lote.id} className="border-b border-[#4a2c2a]/5 hover:bg-[#fdfcf0]/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                        <Coffee size={14} className="text-[#f97316]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#4a2c2a]">{lote.name}</p>
                        <p className="text-xs text-[#6b5b58]">{lote.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#6b5b58]">{lote.safra}</td>
                  <td className="p-4 text-[#6b5b58] font-medium">{lote.score} pts</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                      ${lote.status === 'Ativo' ? 'bg-green-100 text-green-700' : 
                        lote.status === 'Esgotado' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {lote.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#4a2c2a] font-semibold">{lote.total - lote.vendido} kg</td>
                  <td className="p-4 text-[#6b5b58]">
                    <div className="flex items-center gap-2">
                      <span>{lote.vendido} kg</span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${lote.vendido === lote.total ? 'bg-red-500' : 'bg-green-500'}`} 
                          style={{ width: `${(lote.vendido / lote.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
