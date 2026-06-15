'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, BookOpen } from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import CafeCard from '@/components/cafe-card';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { calcularCompatibilidade } from '@/lib/recommendations';
import type { Cafe, Favorito } from '@/lib/types';

export default function FavoritosPage() {
  const { user, perfilSensorial } = useAuth();
  const [favoritos, setFavoritos] = useState<Array<Favorito & { cafes: Cafe }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadFavoritos();
  }, [user]);

  const loadFavoritos = async () => {
    const { data } = await supabase
      .from('favoritos')
      .select('*, cafes:cafés(*, produtores(*))')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    if (data) setFavoritos(data as any);
    setLoading(false);
  };

  const handleRemoveFavorito = async (cafeId: string) => {
    if (!user) return;
    await supabase.from('favoritos').delete().eq('user_id', user.id).eq('cafe_id', cafeId);
    setFavoritos(prev => prev.filter(f => f.cafe_id !== cafeId));
  };

  const favoritosIds = new Set(favoritos.map(f => f.cafe_id));

  return (
    <AppLayout>
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
            <Heart size={20} className="text-rose-500" fill="currentColor" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-[#4a2c2a]">Meus Favoritos</h1>
            <p className="text-[#6b5b58] text-sm">{favoritos.length} {favoritos.length === 1 ? 'café salvo' : 'cafés salvos'}</p>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        ) : favoritos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-rose-300" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#4a2c2a] mb-3">Nenhum favorito ainda</h2>
            <p className="text-[#6b5b58] mb-8 max-w-sm mx-auto">
              Explore o catálogo e adicione cafés aos favoritos para acessá-los rapidamente aqui.
            </p>
            <Link href="/catalogo" className="inline-flex items-center gap-2 bg-[#f97316] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-200">
              <BookOpen size={18} />
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritos.map((fav, i) => (
              <CafeCard
                key={fav.id}
                cafe={fav.cafes}
                index={i}
                compatibilidade={perfilSensorial ? calcularCompatibilidade(fav.cafes, perfilSensorial) : undefined}
                isFavorite={true}
                onToggleFavorite={handleRemoveFavorito}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
