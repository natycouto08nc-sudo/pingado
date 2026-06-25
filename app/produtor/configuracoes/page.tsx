'use client';

import { Settings } from 'lucide-react';

export default function ConfiguracoesPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#4a2c2a] mb-1">Configurações</h1>
        <p className="text-[#6b5b58]">Gerencie suas preferências de conta e notificações.</p>
      </header>
      
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-[#4a2c2a]/5 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mb-4">
          <Settings size={32} />
        </div>
        <h2 className="font-display text-xl font-bold text-[#4a2c2a] mb-2">Página em Construção</h2>
        <p className="text-[#6b5b58] max-w-md">
          Em breve você poderá ajustar configurações de segurança, preferências de recebimento e dados bancários.
        </p>
      </div>
    </div>
  );
}
