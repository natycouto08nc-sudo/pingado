'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Package, Heart, Coffee, Sliders, ChevronRight } from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import CafeCard from '@/components/cafe-card';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { calcularCompatibilidade } from '@/lib/recommendations';
import type { Cafe, Favorito, Assinatura, Caixa } from '@/lib/types';

const ATRIBUTOS = ['acidez', 'docura', 'corpo', 'amargor', 'intensidade'] as const;
const ATRIBUTO_LABELS: Record<string, string> = {
  acidez: 'Acidez', docura: 'Doçura', corpo: 'Corpo', amargor: 'Amargor', intensidade: 'Intensidade',
};

export default function DashboardPage() {
  const { user, perfil, perfilSensorial } = useAuth();
  const router = useRouter();
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [caixaAtual, setCaixaAtual] = useState<Caixa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const [cafesRes, favRes, assRes, caixaRes] = await Promise.all([
      supabase.from('cafés').select('*, produtores(*)').eq('ativo', true),
      supabase.from('favoritos').select('*').eq('user_id', user!.id),
      supabase.from('assinaturas').select('*').eq('user_id', user!.id).maybeSingle(),
      supabase.from('caixas').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ]);
    if (cafesRes.data) setCafes(cafesRes.data);
    if (favRes.data) setFavoritos(favRes.data);
    if (assRes.data) setAssinatura(assRes.data);
    if (caixaRes.data) setCaixaAtual(caixaRes.data);
    setLoading(false);
  };

  const cafesComCompat = cafes
    .map(cafe => ({ ...cafe, compatibilidade: perfilSensorial ? calcularCompatibilidade(cafe, perfilSensorial) : undefined }))
    .sort((a, b) => (b.compatibilidade ?? 0) - (a.compatibilidade ?? 0));

  const recomendados = cafesComCompat.slice(0, 4);
  const favoritosIds = new Set(favoritos.map(f => f.cafe_id));

  const toggleFavorito = async (cafeId: string) => {
    if (!user) return;
    if (favoritosIds.has(cafeId)) {
      await supabase.from('favoritos').delete().eq('user_id', user.id).eq('cafe_id', cafeId);
      setFavoritos(prev => prev.filter(f => f.cafe_id !== cafeId));
    } else {
      const { data } = await supabase.from('favoritos').insert({ user_id: user.id, cafe_id: cafeId }).select().single();
      if (data) setFavoritos(prev => [...prev, data]);
    }
  };

  if (!user) return null;

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const nomeExibido = perfil?.nome || user.email?.split('@')[0] || 'Barista';

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[#6b5b58] text-sm mb-1">{saudacao},</p>
            <h1 className="font-display text-3xl font-bold text-[#4a2c2a]">{nomeExibido}</h1>
          </div>
          {!perfilSensorial && (
            <Link href="/onboarding" className="inline-flex items-center gap-2 bg-[#f97316] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200">
              <Sliders size={16} />
              Criar perfil sensorial
            </Link>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Coffee, label: 'Cafés disponíveis', value: cafes.length.toString(), color: 'text-orange-500 bg-orange-50' },
            { icon: Heart, label: 'Favoritos', value: favoritos.length.toString(), color: 'text-rose-500 bg-rose-50' },
            { icon: Package, label: 'Caixas recebidas', value: caixaAtual ? '1' : '0', color: 'text-amber-600 bg-amber-50' },
            { icon: Sliders, label: 'Compatibilidade max.', value: recomendados[0]?.compatibilidade ? `${recomendados[0].compatibilidade}%` : '—', color: 'text-green-600 bg-green-50' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="pingado-card p-5">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-[#4a2c2a] mb-1">{value}</p>
              <p className="text-xs text-[#6b5b58]">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sensorial profile */}
          <div className="pingado-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold text-[#4a2c2a]">Perfil Sensorial</h2>
              <Link href="/perfil" className="text-xs text-[#f97316] hover:text-[#ea580c] transition-colors font-medium">
                Editar
              </Link>
            </div>
            {perfilSensorial ? (
              <div className="space-y-4">
                {ATRIBUTOS.map(attr => (
                  <div key={attr}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-[#4a2c2a]">{ATRIBUTO_LABELS[attr]}</span>
                      <span className="text-[#f97316] font-bold">{perfilSensorial[attr]}/5</span>
                    </div>
                    <div className="sensorial-bar">
                      <div className="sensorial-bar-fill" style={{ width: `${(perfilSensorial[attr] / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
                {(perfilSensorial.preferencias?.length > 0) && (
                  <div className="pt-3 border-t border-[#4a2c2a]/5">
                    <p className="text-xs font-medium text-[#6b5b58] mb-2">Preferências</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(perfilSensorial.preferencias || []).map(pref => (
                        <span key={pref} className="text-xs bg-orange-50 text-[#f97316] px-2.5 py-1 rounded-full border border-orange-100">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Sliders size={20} className="text-[#f97316]" />
                </div>
                <p className="text-sm text-[#6b5b58] mb-4">Configure seu perfil sensorial para receber recomendações personalizadas.</p>
                <Link href="/onboarding" className="text-sm text-[#f97316] font-medium hover:text-[#ea580c] transition-colors">
                  Criar perfil →
                </Link>
              </div>
            )}
          </div>

          {/* Next box */}
          <div className="pingado-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold text-[#4a2c2a]">Próxima Caixa</h2>
              <Link href="/minha-caixa" className="text-xs text-[#f97316] hover:text-[#ea580c] transition-colors font-medium">
                Ver tudo
              </Link>
            </div>
            {assinatura ? (
              <div>
                <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 ${
                  assinatura.status === 'ativa' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${assinatura.status === 'ativa' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {assinatura.status === 'ativa' ? 'Assinatura ativa' : assinatura.status}
                </div>
                <p className="text-sm font-medium text-[#4a2c2a] capitalize mb-1">Plano {assinatura.plano}</p>
                {assinatura.proxima_entrega && (
                  <p className="text-xs text-[#6b5b58]">
                    Próxima entrega: {new Date(assinatura.proxima_entrega).toLocaleDateString('pt-BR')}
                  </p>
                )}
                {caixaAtual && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs font-medium text-amber-800">Caixa atual</p>
                    <p className="text-sm text-amber-700 capitalize">{caixaAtual.status}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Package size={20} className="text-amber-600" />
                </div>
                <p className="text-sm text-[#6b5b58] mb-4">Assine e receba cafés especiais selecionados para você mensalmente.</p>
                <Link href="/assinatura" className="text-sm text-[#f97316] font-medium hover:text-[#ea580c] transition-colors">
                  Ver planos →
                </Link>
              </div>
            )}
          </div>

          {/* Favorites */}
          <div className="pingado-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold text-[#4a2c2a]">Favoritos</h2>
              <Link href="/favoritos" className="text-xs text-[#f97316] hover:text-[#ea580c] transition-colors font-medium">
                Ver todos
              </Link>
            </div>
            {favoritos.length > 0 ? (
              <div className="space-y-3">
                {cafes.filter(c => favoritosIds.has(c.id)).slice(0, 4).map(cafe => (
                  <Link key={cafe.id} href={`/cafes/${cafe.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Coffee size={16} className="text-[#f97316]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#4a2c2a] truncate group-hover:text-[#f97316] transition-colors">{cafe.nome}</p>
                      {cafe.produtores && <p className="text-xs text-[#6b5b58] truncate">{cafe.produtores.nome}</p>}
                    </div>
                    <Heart size={14} className="text-rose-400 flex-shrink-0" fill="currentColor" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Heart size={20} className="text-rose-400" />
                </div>
                <p className="text-sm text-[#6b5b58] mb-4">Adicione cafés aos favoritos para acessá-los rapidamente.</p>
                <Link href="/catalogo" className="text-sm text-[#f97316] font-medium hover:text-[#ea580c] transition-colors">
                  Explorar catálogo →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#4a2c2a]">Recomendações para você</h2>
              {perfilSensorial && <p className="text-sm text-[#6b5b58] mt-1">Baseado no seu perfil sensorial</p>}
            </div>
            <Link href="/catalogo" className="flex items-center gap-1 text-sm text-[#f97316] font-medium hover:text-[#ea580c] transition-colors">
              Ver catálogo <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="pingado-card overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recomendados.map((cafe, i) => (
                <CafeCard
                  key={cafe.id}
                  cafe={cafe}
                  index={i}
                  compatibilidade={cafe.compatibilidade}
                  isFavorite={favoritosIds.has(cafe.id)}
                  onToggleFavorite={toggleFavorito}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
