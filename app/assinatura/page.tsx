'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Check, Package, Zap, Crown, Calendar, RefreshCw } from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Assinatura } from '@/lib/types';

const PLANOS = [
  {
    id: 'basico',
    nome: 'Básico',
    preco: 'R$ 89',
    periodo: '/mês',
    icon: Package,
    descricao: 'Perfeito para quem está começando',
    beneficios: ['2 cafés especiais por mês', 'Perfil sensorial personalizado', 'Recomendações por IA', 'Acesso ao catálogo completo'],
    color: 'border-[#4a2c2a]/15',
    popular: false,
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco: 'R$ 149',
    periodo: '/mês',
    icon: Zap,
    descricao: 'Nossa opção mais popular',
    beneficios: ['4 cafés especiais por mês', 'Perfil sensorial personalizado', 'Recomendações por IA', 'Acesso ao catálogo completo', 'Notas de degustação exclusivas', 'Acesso à IA Sommelier'],
    color: 'border-[#f97316]',
    popular: true,
  },
  {
    id: 'plus',
    nome: 'Plus',
    preco: 'R$ 229',
    periodo: '/mês',
    icon: Crown,
    descricao: 'Para os verdadeiros apaixonados',
    beneficios: ['6 cafés especiais por mês', 'Perfil sensorial personalizado', 'Recomendações por IA', 'Acesso ao catálogo completo', 'Notas de degustação exclusivas', 'Acesso à IA Sommelier', 'Cafés de microlote exclusivos', 'Acesso antecipado a lançamentos'],
    color: 'border-[#4a2c2a]/15',
    popular: false,
  },
] as const;

export default function AssinaturaPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadAssinatura();
  }, [user]);

  const loadAssinatura = async () => {
    const { data } = await supabase.from('assinaturas').select('*').eq('user_id', user!.id).maybeSingle();
    setAssinatura(data);
    setLoading(false);
  };

  const handleSubscribe = async (plano: string) => {
    if (!user) return;
    setSubscribing(plano);

    const proximaEntrega = new Date();
    proximaEntrega.setMonth(proximaEntrega.getMonth() + 1);

    if (assinatura) {
      const { data, error } = await supabase
        .from('assinaturas')
        .update({ plano, status: 'ativa', proxima_entrega: proximaEntrega.toISOString().split('T')[0], updated_at: new Date().toISOString() })
        .eq('id', assinatura.id)
        .select()
        .single();
      if (!error && data) {
        setAssinatura(data);
        toast({ title: 'Plano atualizado!', description: `Você agora está no plano ${plano}.` });
      }
    } else {
      const { data, error } = await supabase
        .from('assinaturas')
        .insert({ user_id: user.id, plano, status: 'ativa', proxima_entrega: proximaEntrega.toISOString().split('T')[0] })
        .select()
        .single();
      if (!error && data) {
        setAssinatura(data);
        toast({ title: 'Assinatura criada!', description: `Bem-vindo ao plano ${plano}!` });
      }
    }
    setSubscribing(null);
  };

  const handleCancelar = async () => {
    if (!assinatura) return;
    setCanceling(true);
    const { data, error } = await supabase
      .from('assinaturas')
      .update({ status: 'cancelada', updated_at: new Date().toISOString() })
      .eq('id', assinatura.id)
      .select()
      .single();
    if (!error && data) {
      setAssinatura(data);
      toast({ title: 'Assinatura cancelada', description: 'Sua assinatura foi cancelada com sucesso.' });
    }
    setCanceling(false);
  };

  return (
    <AppLayout>
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#f97316]/10 flex items-center justify-center">
            <CreditCard size={20} className="text-[#f97316]" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[#4a2c2a]">Assinatura</h1>
        </div>
        <p className="text-[#6b5b58] mb-10">Escolha o plano ideal para sua jornada no mundo dos cafés especiais</p>

        {/* Current subscription */}
        {!loading && assinatura && (
          <div className="pingado-card p-6 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#6b5b58] uppercase tracking-wider mb-1">Plano Atual</p>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-xl font-bold text-[#4a2c2a] capitalize">{assinatura.plano}</h2>
                  <span className={cn(
                    'text-xs font-semibold px-3 py-1 rounded-full',
                    assinatura.status === 'ativa' ? 'bg-green-50 text-green-700' :
                    assinatura.status === 'pausada' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-700'
                  )}>
                    {assinatura.status === 'ativa' ? 'Ativa' : assinatura.status === 'pausada' ? 'Pausada' : 'Cancelada'}
                  </span>
                </div>
                {assinatura.proxima_entrega && assinatura.status === 'ativa' && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-[#6b5b58]">
                    <Calendar size={14} />
                    Próxima entrega: {new Date(assinatura.proxima_entrega).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
              {assinatura.status === 'ativa' && (
                <button
                  onClick={handleCancelar}
                  disabled={canceling}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {canceling ? <RefreshCw size={14} className="animate-spin" /> : null}
                  Cancelar assinatura
                </button>
              )}
            </div>
          </div>
        )}

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANOS.map(plano => {
            const Icon = plano.icon;
            const isCurrentPlan = assinatura?.plano === plano.id && assinatura.status === 'ativa';
            return (
              <div key={plano.id} className={cn('relative pingado-card p-6 border-2 transition-all', plano.color)}>
                {plano.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#f97316] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      Mais popular
                    </span>
                  </div>
                )}

                <div className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center mb-5',
                  plano.popular ? 'bg-[#f97316] text-white' : 'bg-[#4a2c2a]/8 text-[#4a2c2a]'
                )}>
                  <Icon size={22} />
                </div>

                <h3 className="font-display text-xl font-bold text-[#4a2c2a] mb-1">{plano.nome}</h3>
                <p className="text-sm text-[#6b5b58] mb-4">{plano.descricao}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-3xl font-bold text-[#4a2c2a]">{plano.preco}</span>
                  <span className="text-sm text-[#6b5b58]">{plano.periodo}</span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plano.beneficios.map(b => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-[#4a2c2a]">
                      <div className={cn('w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', plano.popular ? 'bg-[#f97316]/15 text-[#f97316]' : 'bg-green-50 text-green-600')}>
                        <Check size={11} strokeWidth={3} />
                      </div>
                      {b}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plano.id)}
                  disabled={isCurrentPlan || subscribing === plano.id}
                  className={cn(
                    'w-full py-3 rounded-xl font-semibold text-sm transition-all',
                    isCurrentPlan
                      ? 'bg-green-50 text-green-700 cursor-default'
                      : plano.popular
                      ? 'bg-[#f97316] text-white hover:bg-[#ea580c] shadow-lg shadow-orange-200'
                      : 'bg-[#4a2c2a] text-white hover:bg-[#3d2422]'
                  )}
                >
                  {subscribing === plano.id ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto" />
                  ) : isCurrentPlan ? (
                    'Plano atual'
                  ) : assinatura?.status === 'ativa' ? (
                    'Mudar para este plano'
                  ) : (
                    'Assinar agora'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
