'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Coffee, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function RecuperarSenhaPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nova-senha`,
    });
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-[#f97316] flex items-center justify-center">
            <Coffee size={18} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold text-[#4a2c2a]">Pingado</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#4a2c2a] mb-3">Email enviado!</h1>
            <p className="text-[#6b5b58] mb-8">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <Link href="/login" className="text-[#f97316] font-medium hover:text-[#ea580c] transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={16} />
              Voltar ao login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-bold text-[#4a2c2a] mb-2">Recuperar senha</h1>
            <p className="text-[#6b5b58] mb-8">Informe seu email e enviaremos um link de recuperação.</p>

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
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#f97316] text-white font-semibold rounded-xl hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200 disabled:opacity-60 flex items-center justify-center"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Enviar email de recuperação'}
              </button>
            </form>

            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-[#6b5b58] mt-6 hover:text-[#4a2c2a] transition-colors">
              <ArrowLeft size={15} />
              Voltar ao login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
