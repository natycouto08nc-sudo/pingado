'use client';

import { DollarSign, ArrowUpRight, ArrowDownRight, Wallet, Download } from 'lucide-react';

export default function FinanceiroPage() {
  const extratoMock = [
    { id: 'REC-2026', data: '12/06/2026', lote: 'Bourbon Vermelho (LT-002)', bruto: 'R$ 1.500,00', taxa: 'R$ 225,00', liquido: 'R$ 1.275,00', status: 'Concluído' },
    { id: 'REC-2027', data: '18/06/2026', lote: 'Catuaí Amarelo (LT-001)', bruto: 'R$ 1.500,00', taxa: 'R$ 225,00', liquido: 'R$ 1.275,00', status: 'Pendente' },
    { id: 'REC-2028', data: '05/06/2026', lote: 'Mundo Novo (LT-003)', bruto: 'R$ 5.000,00', taxa: 'R$ 750,00', liquido: 'R$ 4.250,00', status: 'Concluído' },
  ];

  return (
    <div className="p-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#4a2c2a] mb-1">Controle Financeiro</h1>
          <p className="text-[#6b5b58]">Acompanhe seus recebimentos e saldos da plataforma Pingado.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#4a2c2a]/15 text-[#4a2c2a] font-medium rounded-xl hover:bg-[#4a2c2a]/5 transition-colors">
          <Download size={18} />
          Exportar Relatório
        </button>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#4a2c2a] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Wallet size={120} />
          </div>
          <p className="text-white/80 font-medium mb-2 relative z-10">Saldo Disponível (Liberado)</p>
          <p className="font-display text-4xl font-bold mb-4 relative z-10">R$ 5.525,00</p>
          <button className="w-full py-2.5 bg-[#f97316] text-white rounded-xl font-semibold hover:bg-[#ea580c] transition-colors relative z-10">
            Solicitar Saque
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#4a2c2a]/5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[#6b5b58] font-medium">A Receber (Em Trânsito)</p>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-[#4a2c2a] mb-2">R$ 1.275,00</p>
          <p className="text-sm text-gray-500">Liberação estimada em 20/06</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#4a2c2a]/5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[#6b5b58] font-medium">Taxas da Plataforma (Mês)</p>
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <ArrowDownRight size={16} />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-[#4a2c2a] mb-2">R$ 975,00</p>
          <p className="text-sm text-gray-500">15% sobre as vendas</p>
        </div>
      </div>

      {/* Extrato */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#4a2c2a]/5 overflow-hidden">
        <div className="p-6 border-b border-[#4a2c2a]/5">
          <h2 className="font-display text-xl font-bold text-[#4a2c2a]">Extrato de Repasses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4a2c2a]/5 border-b border-[#4a2c2a]/10 text-[#4a2c2a]">
                <th className="p-4 font-semibold text-sm">ID Repasse</th>
                <th className="p-4 font-semibold text-sm">Data</th>
                <th className="p-4 font-semibold text-sm">Lote Referente</th>
                <th className="p-4 font-semibold text-sm">Valor Bruto</th>
                <th className="p-4 font-semibold text-sm text-red-600">Taxa (15%)</th>
                <th className="p-4 font-semibold text-sm text-green-600">Valor Líquido</th>
                <th className="p-4 font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {extratoMock.map((item) => (
                <tr key={item.id} className="border-b border-[#4a2c2a]/5 hover:bg-[#fdfcf0]/50 transition-colors">
                  <td className="p-4 font-medium text-[#4a2c2a]">{item.id}</td>
                  <td className="p-4 text-[#6b5b58]">{item.data}</td>
                  <td className="p-4 text-[#6b5b58]">{item.lote}</td>
                  <td className="p-4 text-[#6b5b58]">{item.bruto}</td>
                  <td className="p-4 text-red-500 font-medium">-{item.taxa}</td>
                  <td className="p-4 text-green-600 font-bold">{item.liquido}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                      ${item.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.status}
                    </span>
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
