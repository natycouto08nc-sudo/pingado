'use client';

import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';

export default function VendasEnviosPage() {
  const enviosMock = [
    { id: 'ENV-1001', lote: 'Catuaí Amarelo (LT-001)', qtd: '50 kg', destino: 'Centro de Distribuição SP', data: '18/06/2026', status: 'Pendente' },
    { id: 'ENV-1002', lote: 'Mundo Novo (LT-003)', qtd: '200 kg', destino: 'Centro de Distribuição SP', data: '15/06/2026', status: 'Em Trânsito' },
    { id: 'ENV-1003', lote: 'Bourbon Vermelho (LT-002)', qtd: '50 kg', destino: 'Centro de Distribuição SP', data: '10/06/2026', status: 'Entregue' },
  ];

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#4a2c2a] mb-1">Vendas e Envios</h1>
        <p className="text-[#6b5b58]">Acompanhe os pedidos da plataforma e organize seus despachos.</p>
      </header>

      {/* Cards Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#4a2c2a]/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-[#f97316]">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[#6b5b58] font-medium text-sm">Pendentes de Envio</p>
            <p className="font-display text-2xl font-bold text-[#4a2c2a]">1</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#4a2c2a]/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Truck size={24} />
          </div>
          <div>
            <p className="text-[#6b5b58] font-medium text-sm">Em Trânsito</p>
            <p className="font-display text-2xl font-bold text-[#4a2c2a]">1</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#4a2c2a]/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[#6b5b58] font-medium text-sm">Entregues (Mês)</p>
            <p className="font-display text-2xl font-bold text-[#4a2c2a]">4</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#4a2c2a]/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-[#6b5b58] font-medium text-sm">Total Vendido (Mês)</p>
            <p className="font-display text-2xl font-bold text-[#4a2c2a]">300 kg</p>
          </div>
        </div>
      </div>

      {/* Lista de Envios */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#4a2c2a]/5 overflow-hidden">
        <div className="p-6 border-b border-[#4a2c2a]/5 flex justify-between items-center">
          <h2 className="font-display text-xl font-bold text-[#4a2c2a]">Histórico de Pedidos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4a2c2a]/5 border-b border-[#4a2c2a]/10 text-[#4a2c2a]">
                <th className="p-4 font-semibold text-sm">ID Envio</th>
                <th className="p-4 font-semibold text-sm">Lote Referente</th>
                <th className="p-4 font-semibold text-sm">Quantidade</th>
                <th className="p-4 font-semibold text-sm">Destino Pingado</th>
                <th className="p-4 font-semibold text-sm">Data Limite</th>
                <th className="p-4 font-semibold text-sm">Status</th>
                <th className="p-4 font-semibold text-sm text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {enviosMock.map((envio) => (
                <tr key={envio.id} className="border-b border-[#4a2c2a]/5 hover:bg-[#fdfcf0]/50 transition-colors">
                  <td className="p-4 text-[#4a2c2a] font-medium">{envio.id}</td>
                  <td className="p-4 text-[#6b5b58]">{envio.lote}</td>
                  <td className="p-4 font-semibold text-[#4a2c2a]">{envio.qtd}</td>
                  <td className="p-4 text-[#6b5b58]">{envio.destino}</td>
                  <td className="p-4 text-[#6b5b58]">{envio.data}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                      ${envio.status === 'Entregue' ? 'bg-green-100 text-green-700' : 
                        envio.status === 'Em Trânsito' ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {envio.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {envio.status === 'Pendente' && (
                      <button className="text-sm font-semibold text-[#f97316] hover:text-[#ea580c]">Informar Envio</button>
                    )}
                    {envio.status !== 'Pendente' && (
                      <button className="text-sm font-medium text-gray-500 hover:text-[#4a2c2a]">Ver Rastreio</button>
                    )}
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
