'use client';

import { useEffect, useState } from 'react';
import { User, Camera, Save, Sliders } from 'lucide-react';
import Link from 'next/link';
import AppLayout from '@/components/layout/app-layout';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ATRIBUTOS = [
  { key: 'acidez', label: 'Acidez' },
  { key: 'docura', label: 'Doçura' },
  { key: 'corpo', label: 'Corpo' },
  { key: 'amargor', label: 'Amargor' },
  { key: 'intensidade', label: 'Intensidade' },
] as const;

export default function PerfilPage() {
  const { user, perfil, perfilSensorial, refreshPerfil } = useAuth();
  const { toast } = useToast();
  const [nome, setNome] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (perfil) setNome(perfil.nome || '');
  }, [perfil]);

  const handleSavePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('usuários')
      .update({ nome, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (!error) {
      await refreshPerfil();
      toast({ title: 'Perfil atualizado!', description: 'Suas informações foram salvas.' });
    } else {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-[#4a2c2a]/10 flex items-center justify-center">
            <User size={20} className="text-[#4a2c2a]" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[#4a2c2a]">Meu Perfil</h1>
        </div>

        {/* Avatar + basic info */}
        <div className="pingado-card p-6 mb-6">
          <h2 className="font-semibold text-[#4a2c2a] mb-5">Informações pessoais</h2>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#4a2c2a] flex items-center justify-center text-white text-2xl font-bold">
                {(nome || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <p className="font-semibold text-[#4a2c2a]">{nome || user?.email?.split('@')[0]}</p>
              <p className="text-sm text-[#6b5b58]">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Membro desde {user ? new Date(user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : ''}
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePerfil} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4a2c2a] mb-2">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border border-[#4a2c2a]/15 bg-[#fdfcf0] text-[#4a2c2a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4a2c2a] mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-[#4a2c2a]/15 bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1.5">O email não pode ser alterado</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#f97316] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200 disabled:opacity-60"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              Salvar alterações
            </button>
          </form>
        </div>

        {/* Sensorial profile summary */}
        <div className="pingado-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#4a2c2a]">Perfil Sensorial</h2>
            <Link href="/onboarding" className="flex items-center gap-1.5 text-sm text-[#f97316] font-medium hover:text-[#ea580c] transition-colors">
              <Sliders size={14} />
              {perfilSensorial ? 'Atualizar' : 'Criar'}
            </Link>
          </div>

          {perfilSensorial ? (
            <div className="space-y-4">
              {ATRIBUTOS.map(({ key, label }) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-[#4a2c2a]">{label}</span>
                    <span className="text-[#f97316] font-bold">{perfilSensorial[key]}/5</span>
                  </div>
                  <div className="sensorial-bar">
                    <div className="sensorial-bar-fill" style={{ width: `${(perfilSensorial[key] / 5) * 100}%` }} />
                  </div>
                </div>
              ))}

              {(perfilSensorial.preferencias?.length > 0) && (
                <div className="pt-4 border-t border-[#4a2c2a]/5">
                  <p className="text-sm font-medium text-[#4a2c2a] mb-3">Preferências sensoriais</p>
                  <div className="flex flex-wrap gap-2">
                    {(perfilSensorial.preferencias || []).map(pref => (
                      <span key={pref} className="text-sm bg-orange-50 text-[#f97316] px-3 py-1.5 rounded-full border border-orange-100 font-medium">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 pt-2">
                Última atualização: {new Date(perfilSensorial.updated_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sliders size={22} className="text-[#f97316]" />
              </div>
              <p className="text-sm text-[#6b5b58] mb-4">Você ainda não criou seu perfil sensorial.</p>
              <Link href="/onboarding" className="inline-flex items-center gap-2 bg-[#f97316] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200">
                <Sliders size={15} />
                Criar perfil sensorial
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
