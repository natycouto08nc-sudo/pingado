'use client';

import { User } from 'lucide-react';

export default function PerfilFazendaPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#4a2c2a] mb-1">Perfil da Fazenda</h1>
        <p className="text-[#6b5b58]">Gerencie as informações públicas da sua propriedade.</p>
      </header>
      
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-[#4a2c2a]/5 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-[#f97316] flex items-center justify-center mb-4">
          <User size={32} />
        </div>
        <h2 className="font-display text-xl font-bold text-[#4a2c2a] mb-2">Página em Construção</h2>
        <p className="text-[#6b5b58] max-w-md">
          Em breve você poderá adicionar a história da sua fazenda, fotos e certificações para que os assinantes conheçam mais sobre a origem do seu café.
        </p>
      </div>
    </div>
  );
}
