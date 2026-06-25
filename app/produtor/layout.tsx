'use client';

import { Coffee, Package, User, BarChart, Settings, LogOut, DollarSign, Truck } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function ProdutorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { href: '/produtor', icon: BarChart, label: 'Visão Geral' },
    { href: '/produtor/lotes', icon: Package, label: 'Meus Lotes' },
    { href: '/produtor/vendas', icon: Truck, label: 'Vendas & Envios' },
    { href: '/produtor/financeiro', icon: DollarSign, label: 'Financeiro' },
    { href: '/produtor/perfil', icon: User, label: 'Perfil da Fazenda' },
    { href: '/produtor/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-[#fdfcf0] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#4a2c2a] text-white p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#f97316] flex items-center justify-center">
            <Coffee size={20} />
          </div>
          <span className="font-display text-2xl font-bold">Pingado</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/produtor' && pathname.startsWith(link.href));
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-3 text-white/70 hover:text-white px-4 py-3 mt-10 transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
