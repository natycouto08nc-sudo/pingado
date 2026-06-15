'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import CafeCard from '@/components/cafe-card';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { calcularCompatibilidade } from '@/lib/recommendations';
import type { Cafe, Favorito } from '@/lib/types';

const NOTAS_OPTIONS = ['Chocolate', 'Caramelo', 'Castanhas', 'Floral', 'Frutas Vermelhas', 'Frutas Cítricas', 'Mel', 'Especiarias'];

export default function CatalogoPage() {
  const { user, perfilSensorial } = useAuth();
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regiaoFilter, setRegiaoFilter] = useState('');
  const [notaFilter, setNotaFilter] = useState('');
  const [intensidadeFilter, setIntensidadeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const [cafesRes, favRes] = await Promise.all([
      supabase.from('cafés').select('*, produtores(*)').eq('ativo', true).order('nome'),
      supabase.from('favoritos').select('*').eq('user_id', user!.id),
    ]);
    if (cafesRes.data) setCafes(cafesRes.data);
    if (favRes.data) setFavoritos(favRes.data);
    setLoading(false);
  };

  const regioes = useMemo(() => Array.from(new Set(cafes.map(c => c.regiao).filter(Boolean) as string[])).sort(), [cafes]);

  const cafesComCompat = useMemo(() =>
    cafes
      .map((cafe, i) => ({
        ...cafe,
        compatibilidade: perfilSensorial ? calcularCompatibilidade(cafe, perfilSensorial) : undefined,
        _index: i,
      }))
      .sort((a, b) => (b.compatibilidade ?? 0) - (a.compatibilidade ?? 0)),
    [cafes, perfilSensorial]
  );

  const filteredCafes = useMemo(() => {
    let result = cafesComCompat;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.nome.toLowerCase().includes(q) ||
        c.produtores?.nome.toLowerCase().includes(q) ||
        c.regiao?.toLowerCase().includes(q)
      );
    }

    if (regiaoFilter) {
      result = result.filter(c => c.regiao === regiaoFilter);
    }

    if (notaFilter) {
      result = result.filter(c =>
        c.notas_sensoriais?.some(n => n.toLowerCase().includes(notaFilter.toLowerCase()))
      );
    }

    if (intensidadeFilter) {
      const val = parseInt(intensidadeFilter);
      result = result.filter(c => c.intensidade === val);
    }

    return result;
  }, [cafesComCompat, search, regiaoFilter, notaFilter, intensidadeFilter]);

  const favoritosIds = new Set(favoritos.map(f => f.cafe_id));
  const hasFilters = regiaoFilter || notaFilter || intensidadeFilter;

  const clearFilters = () => {
    setRegiaoFilter('');
    setNotaFilter('');
    setIntensidadeFilter('');
  };

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

  return (
    <AppLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[#4a2c2a] mb-2">Catálogo de Cafés</h1>
          <p className="text-[#6b5b58]">
            {perfilSensorial
              ? 'Ordenado por compatibilidade com seu perfil sensorial'
              : 'Explore nossa seleção de cafés especiais brasileiros'}
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar café, produtor ou região..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#4a2c2a]/12 bg-white text-[#4a2c2a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
              hasFilters
                ? 'bg-[#f97316] text-white border-[#f97316]'
                : 'bg-white text-[#4a2c2a] border-[#4a2c2a]/12 hover:border-[#f97316]/40'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filtros
            {hasFilters && <span className="w-2 h-2 bg-white rounded-full" />}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-[#4a2c2a]/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-[#4a2c2a]">Filtros</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[#f97316] hover:text-[#ea580c] transition-colors">
                  <X size={13} />Limpar filtros
                </button>
              )}
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#6b5b58] mb-2 uppercase tracking-wider">Região</label>
                <select
                  value={regiaoFilter}
                  onChange={e => setRegiaoFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#4a2c2a]/12 text-sm text-[#4a2c2a] bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                >
                  <option value="">Todas as regiões</option>
                  {regioes.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6b5b58] mb-2 uppercase tracking-wider">Nota sensorial</label>
                <select
                  value={notaFilter}
                  onChange={e => setNotaFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#4a2c2a]/12 text-sm text-[#4a2c2a] bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                >
                  <option value="">Todas as notas</option>
                  {NOTAS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6b5b58] mb-2 uppercase tracking-wider">Intensidade</label>
                <select
                  value={intensidadeFilter}
                  onChange={e => setIntensidadeFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#4a2c2a]/12 text-sm text-[#4a2c2a] bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                >
                  <option value="">Todas as intensidades</option>
                  <option value="1">1 — Muito suave</option>
                  <option value="2">2 — Suave</option>
                  <option value="3">3 — Médio</option>
                  <option value="4">4 — Intenso</option>
                  <option value="5">5 — Muito intenso</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-[#6b5b58] mb-6">
          {filteredCafes.length} {filteredCafes.length === 1 ? 'café encontrado' : 'cafés encontrados'}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="pingado-card overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCafes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <p className="text-[#4a2c2a] font-medium mb-2">Nenhum café encontrado</p>
            <p className="text-[#6b5b58] text-sm">Tente ajustar os filtros ou a busca.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCafes.map((cafe, i) => (
              <CafeCard
                key={cafe.id}
                cafe={cafe}
                index={cafe._index}
                compatibilidade={cafe.compatibilidade}
                isFavorite={favoritosIds.has(cafe.id)}
                onToggleFavorite={toggleFavorito}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
