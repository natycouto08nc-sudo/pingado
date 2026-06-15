'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Perfil, PerfilSensorial } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  perfil: Perfil | null;
  perfilSensorial: PerfilSensorial | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshPerfil: () => Promise<void>;
  refreshPerfilSensorial: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  perfil: null,
  perfilSensorial: null,
  loading: true,
  signOut: async () => {},
  refreshPerfil: async () => {},
  refreshPerfilSensorial: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [perfilSensorial, setPerfilSensorial] = useState<PerfilSensorial | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPerfil = async (userId: string) => {
    const { data } = await supabase
      .from('usuários')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    setPerfil(data);
  };

  const fetchPerfilSensorial = async (userId: string) => {
    const { data } = await supabase
      .from('perfis_sensoriais')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      const preferencias = Array.isArray(data.preferencias)
        ? data.preferencias
        : typeof data.preferencias === 'string'
        ? JSON.parse(data.preferencias || '[]')
        : [];
      setPerfilSensorial({ ...data, preferencias });
    } else {
      setPerfilSensorial(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        Promise.all([
          fetchPerfil(session.user.id),
          fetchPerfilSensorial(session.user.id),
        ]).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchPerfil(session.user.id);
        fetchPerfilSensorial(session.user.id);
      } else {
        setPerfil(null);
        setPerfilSensorial(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshPerfil = async () => {
    if (user) await fetchPerfil(user.id);
  };

  const refreshPerfilSensorial = async () => {
    if (user) await fetchPerfilSensorial(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, session, perfil, perfilSensorial, loading, signOut, refreshPerfil, refreshPerfilSensorial }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
