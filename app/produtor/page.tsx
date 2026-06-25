'use client';

import { Coffee, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProdutorDashboard() {
  return (
    <div className="p-8">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#4a2c2a] mb-1">Visão Geral</h1>
          <p className="text-[#6b5b58]">Bem-vindo de volta! Aqui está o resumo da sua operação.</p>
        </div>
        <Link href="/produtor/lotes/novo" className="flex items-center justify-center gap-2 bg-[#f97316] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200">
          <Plus size={18} />
          Cadastrar Novo Lote
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Lotes Ativos', value: '12', color: 'text-blue-600' },
          { label: 'Qtde Total (Kg)', value: '1.450', color: 'text-gray-800' },
          { label: 'Assinantes Alcançados', value: '340', color: 'text-orange-600' },
          { label: 'Saldo a Receber', value: 'R$ 4.250', color: 'text-green-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#4a2c2a]/5">
            <h3 className="text-[#6b5b58] font-medium mb-2">{stat.label}</h3>
            <p className={`font-display text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Mock */}
      <section className="bg-white rounded-2xl shadow-sm border border-[#4a2c2a]/5 p-6">
        <h2 className="font-display text-xl font-bold text-[#4a2c2a] mb-6">Últimas Atualizações de Lotes</h2>
        <div className="space-y-4">
          {[
            { id: 'LT-001', name: 'Catuaí Amarelo - Fermentado', score: '88 pts', status: 'Em Análise' },
            { id: 'LT-002', name: 'Bourbon Vermelho', score: '86 pts', status: 'Aprovado' },
            { id: 'LT-003', name: 'Mundo Novo - Natural', score: '84 pts', status: 'Aprovado' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#fdfcf0]/50 rounded-xl border border-[#4a2c2a]/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <Coffee size={18} className="text-[#f97316]" />
                </div>
                <div>
                  <p className="font-bold text-[#4a2c2a]">{item.name}</p>
                  <p className="text-sm text-[#6b5b58]">ID: {item.id} • Score SCA: {item.score}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${item.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
