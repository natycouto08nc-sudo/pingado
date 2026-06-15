'use client';

import Link from 'next/link';
import { Heart, MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCompatibilidadeColor } from '@/lib/recommendations';
import type { Cafe } from '@/lib/types';

const COFFEE_IMAGES = [
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2061122/pexels-photo-2061122.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1187317/pexels-photo-1187317.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3879495/pexels-photo-3879495.jpeg?auto=compress&cs=tinysrgb&w=600',
];

function getCafeImage(cafe: Cafe, index: number = 0): string {
  if (cafe.imagem_url) return cafe.imagem_url;
  return COFFEE_IMAGES[index % COFFEE_IMAGES.length];
}

interface CafeCardProps {
  cafe: Cafe;
  index?: number;
  compatibilidade?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (cafeId: string) => void;
  showCompat?: boolean;
}

export default function CafeCard({ cafe, index = 0, compatibilidade, isFavorite, onToggleFavorite, showCompat = true }: CafeCardProps) {
  return (
    <div className="pingado-card overflow-hidden group">
      <Link href={`/cafes/${cafe.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={getCafeImage(cafe, index)}
            alt={cafe.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {showCompat && compatibilidade !== undefined && (
            <div className={cn('absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full', getCompatibilidadeColor(compatibilidade))}>
              {compatibilidade}% compatível
            </div>
          )}
          {cafe.score_sca && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
              <Star size={11} fill="white" />
              SCA {cafe.score_sca}
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/cafes/${cafe.id}`}>
          <h3 className="font-display font-bold text-[#4a2c2a] text-lg mb-1 hover:text-[#f97316] transition-colors line-clamp-1">{cafe.nome}</h3>
        </Link>

        {cafe.produtores && (
          <p className="text-sm text-[#6b5b58] mb-2 font-medium">{cafe.produtores.nome}</p>
        )}

        {cafe.regiao && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <MapPin size={12} />
            {cafe.regiao}
          </div>
        )}

        {cafe.notas_sensoriais && cafe.notas_sensoriais.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {cafe.notas_sensoriais.slice(0, 3).map(nota => (
              <span key={nota} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100">
                {nota}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          {cafe.preco && (
            <span className="text-sm font-bold text-[#4a2c2a]">
              R$ {cafe.preco.toFixed(2).replace('.', ',')}
            </span>
          )}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(cafe.id)}
              className={cn(
                'p-2 rounded-xl transition-all',
                isFavorite
                  ? 'text-rose-500 bg-rose-50 hover:bg-rose-100'
                  : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'
              )}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
