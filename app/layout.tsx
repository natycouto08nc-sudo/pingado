import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Pingado — Cafés Especiais',
  description: 'Descubra cafés especiais brasileiros selecionados para o seu perfil sensorial.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
