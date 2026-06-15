'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, Star, Leaf, ChevronRight, Award, MapPin } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#f97316] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf0]">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f97316] flex items-center justify-center shadow-lg shadow-orange-200">
            <Coffee size={20} className="text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-[#4a2c2a]">Pingado</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-[#4a2c2a] hover:text-[#f97316] transition-colors px-4 py-2">
            Entrar
          </Link>
          <Link href="/cadastro" className="text-sm font-medium bg-[#f97316] text-white px-5 py-2.5 rounded-xl hover:bg-[#ea580c] transition-colors shadow-lg shadow-orange-200">
            Começar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-50 text-[#f97316] text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-orange-100">
              <Star size={12} fill="currentColor" />
              Cafés especiais do Brasil
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-[#4a2c2a] leading-tight mb-6">
              Descubra o café
              <br />
              <span className="text-[#f97316]">perfeito</span> para você
            </h1>
            <p className="text-[#6b5b58] text-lg leading-relaxed mb-10 max-w-lg">
              Plataforma de assinatura que usa inteligência artificial para recomendar cafés especiais brasileiros com base no seu perfil sensorial único.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/cadastro" className="flex items-center gap-2 bg-[#f97316] text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-[#ea580c] transition-all shadow-xl shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5">
                Criar meu perfil sensorial
                <ChevronRight size={18} />
              </Link>
              <Link href="/login" className="text-[#4a2c2a] font-medium text-base hover:text-[#f97316] transition-colors">
                Já tenho conta
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-50 rounded-3xl" />
            <img
              src="https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Café especial"
              className="relative rounded-3xl w-full h-96 object-cover shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-orange-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <Award size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Score SCA</p>
                  <p className="text-sm font-bold text-[#4a2c2a]">90+ pontos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-[#4a2c2a] mb-4">Como funciona</h2>
          <p className="text-[#6b5b58] text-lg max-w-xl mx-auto">Uma experiência personalizada do campo à sua xícara</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Coffee,
              title: 'Perfil Sensorial',
              desc: 'Responda perguntas sobre suas preferências de acidez, doçura, corpo e amargor.',
              color: 'bg-orange-50 text-[#f97316]',
            },
            {
              icon: Star,
              title: 'Recomendação IA',
              desc: 'Nossa IA analisa seu perfil e encontra os cafés com maior compatibilidade.',
              color: 'bg-amber-50 text-amber-600',
            },
            {
              icon: Leaf,
              title: 'Entrega Mensal',
              desc: 'Receba uma caixa com cafés especiais selecionados exclusivamente para você.',
              color: 'bg-green-50 text-green-600',
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="pingado-card p-8">
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5`}>
                <Icon size={22} />
              </div>
              <h3 className="font-display text-xl font-bold text-[#4a2c2a] mb-3">{title}</h3>
              <p className="text-[#6b5b58] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coffee regions */}
      <section className="bg-[#4a2c2a] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-12">
            <MapPin size={20} className="text-[#f97316]" />
            <h2 className="font-display text-3xl font-bold text-white">Das melhores regiões do Brasil</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Mantiqueira de Minas', 'Sul de Minas', 'Cerrado Mineiro', 'Chapada Diamantina'].map(region => (
              <div key={region} className="bg-white/10 rounded-2xl p-5 text-white hover:bg-white/15 transition-colors">
                <Coffee size={20} className="text-[#f97316] mb-3" />
                <p className="font-medium text-sm">{region}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-4xl font-bold text-[#4a2c2a] mb-6">Pronto para descobrir seu café ideal?</h2>
        <p className="text-[#6b5b58] text-lg mb-10 max-w-lg mx-auto">
          Crie seu perfil sensorial gratuitamente e receba recomendações personalizadas de cafés especiais brasileiros.
        </p>
        <Link href="/cadastro" className="inline-flex items-center gap-2 bg-[#f97316] text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-[#ea580c] transition-all shadow-xl shadow-orange-200">
          Começar agora
          <ChevronRight size={20} />
        </Link>
      </section>

      <footer className="border-t border-[#4a2c2a]/10 py-8 text-center">
        <p className="text-[#6b5b58] text-sm">© 2025 Pingado. Cafés especiais brasileiros.</p>
      </footer>
    </div>
  );
}
