'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, MapPin, Star, ArrowLeft, Award, Zap } from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { calcularCompatibilidade, getCompatibilidadeColor } from '@/lib/recommendations';
import { cn } from '@/lib/utils';
import type { Cafe, Favorito } from '@/lib/types';

const COFFEE_IMAGES = [
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/2061122/pexels-photo-2061122.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1187317/pexels-photo-1187317.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/3879495/pexels-photo-3879495.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

const ATRIBUTOS = [
  { key: 'acidez', label: 'Acidez' },
  { key: 'docura', label: 'Doçura' },
  { key: 'corpo', label: 'Corpo' },
  { key: 'amargor', label: 'Amargor' },
  { key: 'intensidade', label: 'Intensidade' },
] as const;

export default function CafeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, perfilSensorial } = useAuth();
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [favorito, setFavorito] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    loadCafe();
  }, [params.id]);

  const loadCafe = async () => {
    const [cafeRes, favRes] = await Promise.all([
      supabase.from('cafés').select('*, produtores(*)').eq('id', params.id).single(),
      user ? supabase.from('favoritos').select('id').eq('user_id', user.id).eq('cafe_id', params.id).maybeSingle() : Promise.resolve({ data: null }),
    ]);
    if (cafeRes.data) setCafe(cafeRes.data);
    setFavorito(!!favRes.data);
    setLoading(false);
  };

  const handleToggleFavorito = async () => {
    if (!user || !cafe) return;
    setToggling(true);
    if (favorito) {
      await supabase.from('favoritos').delete().eq('user_id', user.id).eq('cafe_id', cafe.id);
      setFavorito(false);
    } else {
      await supabase.from('favoritos').insert({ user_id: user.id, cafe_id: cafe.id });
      setFavorito(true);
    }
    setToggling(false);
  };

  const compatibilidade = cafe && perfilSensorial ? calcularCompatibilidade(cafe, perfilSensorial) : null;

  const imageIndex = cafe ? Math.abs(cafe.nome.charCodeAt(0) % COFFEE_IMAGES.length) : 0;
  const imageUrl = cafe?.imagem_url || COFFEE_IMAGES[imageIndex];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-[#f97316] border-t-transparent animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!cafe) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="text-[#4a2c2a] font-medium">Café não encontrado.</p>
          <Link href="/catalogo" className="text-[#f97316] text-sm mt-2 hover:text-[#ea580c]">Voltar ao catálogo</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div>
        <Link href="/catalogo" className="inline-flex items-center gap-2 text-sm text-[#6b5b58] hover:text-[#4a2c2a] transition-colors mb-6">
          <ArrowLeft size={16} />
          Voltar ao catálogo
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square lg:aspect-auto lg:h-full min-h-64 rounded-3xl overflow-hidden">
              <img src={imageUrl} alt={cafe.nome} className="w-full h-full object-cover" />
            </div>
            {compatibilidade !== null && (
              <div className={cn('absolute top-4 left-4 text-sm font-bold px-4 py-2 rounded-full shadow-lg', getCompatibilidadeColor(compatibilidade))}>
                {compatibilidade}% compatível
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#4a2c2a] mb-2">{cafe.nome}</h1>
                {cafe.produtores && (
                  <p className="text-[#f97316] font-semibold text-lg">{cafe.produtores.nome}</p>
                )}
              </div>
              <button
                onClick={handleToggleFavorito}
                disabled={toggling}
                className={cn(
                  'flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all',
                  favorito
                    ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                    : 'bg-gray-100 text-gray-400 hover:bg-rose-50 hover:text-rose-500'
                )}
              >
                <Heart size={22} fill={favorito ? 'currentColor' : 'none'} />
              </button>
            </div>

            {cafe.regiao && (
              <div className="flex items-center gap-2 text-[#6b5b58] text-sm mb-4">
                <MapPin size={15} />
                <span>{cafe.regiao}</span>
                {cafe.produtores?.estado && <span>• {cafe.produtores.estado}</span>}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              {cafe.score_sca && (
                <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-2 rounded-xl border border-amber-100">
                  <Award size={16} />
                  <span className="text-sm font-bold">SCA {cafe.score_sca}</span>
                </div>
              )}
              {cafe.intensidade && (
                <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-xl border border-orange-100">
                  <Zap size={16} />
                  <span className="text-sm font-medium">Intensidade {cafe.intensidade}/5</span>
                </div>
              )}
              {cafe.preco && (
                <div className="bg-[#4a2c2a]/5 text-[#4a2c2a] px-4 py-2 rounded-xl">
                  <span className="text-sm font-bold">R$ {cafe.preco.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
            </div>

            {cafe.descricao && (
              <p className="text-[#6b5b58] leading-relaxed mb-6">{cafe.descricao}</p>
            )}

            {cafe.notas_sensoriais && cafe.notas_sensoriais.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-[#4a2c2a] mb-3">Notas sensoriais</p>
                <div className="flex flex-wrap gap-2">
                  {cafe.notas_sensoriais.map(nota => (
                    <span key={nota} className="bg-amber-50 text-amber-800 text-sm px-4 py-1.5 rounded-full border border-amber-100 font-medium">
                      {nota}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sensorial bars */}
            <div className="bg-[#fdfcf0] rounded-2xl p-5 border border-[#4a2c2a]/8">
              <p className="text-sm font-semibold text-[#4a2c2a] mb-4">Perfil Sensorial</p>
              <div className="space-y-3">
                {ATRIBUTOS.map(({ key, label }) => {
                  const val = cafe[key] as number | null;
                  if (val == null) return null;
                  const userVal = perfilSensorial?.[key];
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs text-[#6b5b58] mb-1">
                        <span className="font-medium text-[#4a2c2a]">{label}</span>
                        <span className="font-bold text-[#f97316]">{val}/5{userVal ? ` (você: ${userVal})` : ''}</span>
                      </div>
                      <div className="sensorial-bar">
                        <div className="sensorial-bar-fill" style={{ width: `${(val / 5) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {cafe.produtores?.descricao && (
              <div className="mt-6 p-5 bg-white rounded-2xl border border-[#4a2c2a]/8">
                <p className="text-xs font-semibold text-[#6b5b58] uppercase tracking-wider mb-2">Sobre o Produtor</p>
                <p className="font-medium text-[#4a2c2a] text-sm mb-1">{cafe.produtores.nome}</p>
                <p className="text-sm text-[#6b5b58]">{cafe.produtores.descricao}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
