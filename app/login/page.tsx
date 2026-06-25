'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: 'Erro ao entrar', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fdfcf0] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#4a2c2a] p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-[#f97316] blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-orange-300 blur-3xl" />
        </div>
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-[#f97316] flex items-center justify-center">
            <Coffee size={20} />
          </div>
          <span className="font-display text-2xl font-bold">Pingado</span>
        </Link>
        <div className="relative z-10">
          <blockquote className="font-display text-3xl font-bold leading-relaxed mb-6">
            "O café perfeito começa com o perfil certo"
          </blockquote>
          <p className="text-white/70 text-base leading-relaxed max-w-sm">
            Descubra cafés especiais selecionados exclusivamente para o seu paladar único.
          </p>
        </div>
        <p className="text-white/40 text-sm relative z-10">© 2025 Pingado</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-[#f97316] flex items-center justify-center">
              <Coffee size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-[#4a2c2a]">Pingado</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-[#4a2c2a] mb-2">Bem-vindo de volta</h1>
          <p className="text-[#6b5b58] mb-8">Entre na sua conta para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#4a2c2a] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-[#4a2c2a]/15 bg-white text-[#4a2c2a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#4a2c2a]">Senha</label>
                <Link href="/recuperar-senha" className="text-xs text-[#f97316] hover:text-[#ea580c] transition-colors">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[#4a2c2a]/15 bg-white text-[#4a2c2a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4a2c2a] transition-colors"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#f97316] text-white font-semibold rounded-xl hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Entrar'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#fdfcf0] text-gray-500">Área do Produtor</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push('/produtor')}
              className="w-full py-3.5 bg-transparent border-2 border-[#4a2c2a] text-[#4a2c2a] font-semibold rounded-xl hover:bg-[#4a2c2a]/5 transition-all flex items-center justify-center gap-2"
            >
              Entrar como Produtor (Bypass)
            </button>
          </form>

          <p className="text-center text-sm text-[#6b5b58] mt-8">
            Não tem conta?{' '}
            <Link href="/cadastro" className="text-[#f97316] font-medium hover:text-[#ea580c] transition-colors">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
