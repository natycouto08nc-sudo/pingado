'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Coffee, LayoutDashboard, BookOpen, Heart, Package, CreditCard, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/catalogo', label: 'Catálogo', icon: BookOpen },
  { href: '/favoritos', label: 'Favoritos', icon: Heart },
  { href: '/minha-caixa', label: 'Minha Caixa', icon: Package },
  { href: '/assinatura', label: 'Assinatura', icon: CreditCard },
  { href: '/perfil', label: 'Perfil', icon: User },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, perfil } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#4a2c2a] text-white fixed left-0 top-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f97316] flex items-center justify-center">
              <Coffee size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white">Pingado</span>
          </Link>
        </div>

        {perfil && (
          <div className="p-4 mx-4 mt-4 rounded-xl bg-white/5">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Bem-vindo</p>
            <p className="text-sm font-medium text-white truncate">{perfil.nome || perfil.email}</p>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 mt-4">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                pathname.startsWith(href)
                  ? 'bg-[#f97316] text-white shadow-lg shadow-orange-900/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all w-full"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#4a2c2a] text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f97316] flex items-center justify-center">
            <Coffee size={16} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold">Pingado</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-white/10 transition">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <nav
            className="absolute top-0 right-0 bottom-0 w-72 bg-[#4a2c2a] text-white pt-20 pb-6 px-4 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    pathname.startsWith(href)
                      ? 'bg-[#f97316] text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all w-full mt-4"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
