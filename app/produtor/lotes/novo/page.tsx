'use client';

import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NovoLotePage() {
  const router = useRouter();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/produtor/lotes" className="inline-flex items-center gap-2 text-[#6b5b58] hover:text-[#f97316] mb-6 transition-colors">
        <ArrowLeft size={18} />
        Voltar para Meus Lotes
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#4a2c2a] mb-1">Cadastrar Novo Lote</h1>
        <p className="text-[#6b5b58]">Preencha as informações do café. Estes dados serão analisados pela nossa equipe.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#4a2c2a]/5 p-8">
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); router.push('/produtor/lotes'); }}>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-[#4a2c2a] mb-2">Identificação do Lote / Nome</label>
              <input type="text" placeholder="Ex: Catuaí Amarelo Especial" className="w-full px-4 py-3 rounded-xl border border-[#4a2c2a]/15 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4a2c2a] mb-2">Variedade</label>
              <input type="text" placeholder="Ex: Bourbon, Arara, Mundo Novo" className="w-full px-4 py-3 rounded-xl border border-[#4a2c2a]/15 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4a2c2a] mb-2">Processo</label>
              <select className="w-full px-4 py-3 rounded-xl border border-[#4a2c2a]/15 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition bg-white">
                <option value="">Selecione...</option>
                <option value="natural">Natural</option>
                <option value="lavado">Lavado</option>
                <option value="fermentado">Fermentado (Anaeróbico)</option>
                <option value="honey">Honey / Cereja Descascado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4a2c2a] mb-2">Safra</label>
              <input type="text" placeholder="Ex: 2024" className="w-full px-4 py-3 rounded-xl border border-[#4a2c2a]/15 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4a2c2a] mb-2">Altitude (m)</label>
              <input type="number" placeholder="Ex: 1200" className="w-full px-4 py-3 rounded-xl border border-[#4a2c2a]/15 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4a2c2a] mb-2">Pontuação SCA (Se possuir)</label>
              <input type="number" step="0.25" placeholder="Ex: 86.5" className="w-full px-4 py-3 rounded-xl border border-[#4a2c2a]/15 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4a2c2a] mb-2">Quantidade Disponível (Kg)</label>
              <input type="number" placeholder="Sacas ou kg disponíveis" required className="w-full px-4 py-3 rounded-xl border border-[#4a2c2a]/15 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-[#4a2c2a] mb-2">Notas Sensoriais Esperadas</label>
              <textarea rows={3} placeholder="Descreva os aromas e sabores (Ex: Chocolate ao leite, acidez cítrica, final longo e doce)" className="w-full px-4 py-3 rounded-xl border border-[#4a2c2a]/15 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition" />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-[#4a2c2a]/10">
            <button type="button" onClick={() => router.push('/produtor/lotes')} className="px-6 py-3 font-semibold text-[#4a2c2a] hover:bg-[#4a2c2a]/5 rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex items-center gap-2 bg-[#f97316] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200">
              <Save size={18} />
              Salvar Lote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
