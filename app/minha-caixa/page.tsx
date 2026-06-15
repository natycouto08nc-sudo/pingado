'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Coffee, Star, ChevronRight, Clock } from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { Caixa, CaixaCafe, Cafe } from '@/lib/types';

interface CaixaComCafes extends Caixa {
  caixa_cafes: Array<CaixaCafe & { cafes: Cafe & { produtores?: { nome: string } } }>;
}

const COFFEE_IMAGES = [
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=400',
];

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  preparando: { label: 'Preparando', color: 'bg-amber-50 text-amber-700 border border-amber-100', dot: 'bg-amber-500' },
  enviada: { label: 'Enviada', color: 'bg-blue-50 text-blue-700 border border-blue-100', dot: 'bg-blue-500' },
  entregue: { label: 'Entregue', color: 'bg-green-50 text-green-700 border border-green-100', dot: 'bg-green-500' },
};

export default function MinhaCaixaPage() {
  const { user } = useAuth();
  const [caixas, setCaixas] = useState<CaixaComCafes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadCaixas();
  }, [user]);

  const loadCaixas = async () => {
    const { data } = await supabase
      .from('caixas')
      .select('*, caixa_cafes:caixa_itens(*, cafes:cafés(*, produtores(nome)))')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    if (data) setCaixas(data as any);
    setLoading(false);
  };

  const caixaAtual = caixas[0];
  const historico = caixas.slice(1);

  return (
    <AppLayout>
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Package size={20} className="text-amber-600" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-[#4a2c2a]">Minha Caixa</h1>
            <p className="text-[#6b5b58] text-sm">Cafés selecionados especialmente para você</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="pingado-card p-6 animate-pulse h-64" />
          </div>
        ) : caixas.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-amber-400" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#4a2c2a] mb-3">Nenhuma caixa ainda</h2>
            <p className="text-[#6b5b58] mb-8 max-w-sm mx-auto">
              Assine o Pingado e receba caixas de cafés especiais selecionados para o seu perfil mensalmente.
            </p>
            <Link href="/assinatura" className="inline-flex items-center gap-2 bg-[#f97316] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200">
              <Package size={18} />
              Ver planos de assinatura
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current box */}
            {caixaAtual && (
              <div>
                <h2 className="font-display text-xl font-bold text-[#4a2c2a] mb-4">Caixa Atual</h2>
                <div className="pingado-card overflow-hidden">
                  <div className="p-6 border-b border-[#4a2c2a]/8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          {caixaAtual.mes_referencia && (
                            <span className="font-display text-lg font-bold text-[#4a2c2a]">{caixaAtual.mes_referencia}</span>
                          )}
                          <span className={cn('text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5', statusConfig[caixaAtual.status].color)}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', statusConfig[caixaAtual.status].dot)} />
                            {statusConfig[caixaAtual.status].label}
                          </span>
                        </div>
                        <p className="text-sm text-[#6b5b58]">
                          {new Date(caixaAtual.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      {caixaAtual.caixa_cafes.length > 0 && (
                        <div className="text-sm text-[#6b5b58]">
                          {caixaAtual.caixa_cafes.length} {caixaAtual.caixa_cafes.length === 1 ? 'café' : 'cafés'}
                        </div>
                      )}
                    </div>
                    {caixaAtual.justificativa && (
                      <p className="mt-3 text-sm text-[#6b5b58] bg-orange-50 px-4 py-3 rounded-xl border border-orange-100">
                        {caixaAtual.justificativa}
                      </p>
                    )}
                  </div>

                  {caixaAtual.caixa_cafes.length > 0 ? (
                    <div className="p-6">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {caixaAtual.caixa_cafes.map((cc, i) => (
                          <Link key={cc.id} href={`/cafes/${cc.cafe_id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-[#4a2c2a]/8">
                            <img
                              src={COFFEE_IMAGES[i % COFFEE_IMAGES.length]}
                              alt={cc.cafes.nome}
                              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#4a2c2a] truncate">{cc.cafes.nome}</p>
                              {cc.cafes.produtores && <p className="text-xs text-[#6b5b58] truncate">{cc.cafes.produtores.nome}</p>}
                              {cc.score_compatibilidade && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Star size={10} className="text-[#f97316]" fill="currentColor" />
                                  <span className="text-xs text-[#f97316] font-medium">{cc.score_compatibilidade}% compat.</span>
                                </div>
                              )}
                            </div>
                            <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-sm text-[#6b5b58]">
                      <Coffee size={24} className="text-gray-300 mx-auto mb-2" />
                      Cafés sendo selecionados para você...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History */}
            {historico.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-[#4a2c2a] mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-[#6b5b58]" />
                  Histórico de Caixas
                </h2>
                <div className="space-y-4">
                  {historico.map(caixa => (
                    <div key={caixa.id} className="pingado-card p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {caixa.mes_referencia && (
                              <span className="font-semibold text-[#4a2c2a]">{caixa.mes_referencia}</span>
                            )}
                            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', statusConfig[caixa.status].color)}>
                              {statusConfig[caixa.status].label}
                            </span>
                          </div>
                          <p className="text-xs text-[#6b5b58]">
                            {new Date(caixa.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <p className="text-sm text-[#6b5b58]">
                          {caixa.caixa_cafes.length} {caixa.caixa_cafes.length === 1 ? 'café' : 'cafés'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
