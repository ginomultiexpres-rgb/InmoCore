/**
 * Fuente única de verdad de la sesión/perfil.
 * Un solo fetch de perfil por cambio de auth (no por componente consumidor).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase, getProfile } from '../lib/supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  email: string;
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

type AuthContextValue = AuthState & {
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadProfile(userId: string, email: string): Promise<UserProfile | null> {
  const result = await getProfile();
  if (!result || result.error) return null;
  const profile = result.data as Omit<UserProfile, 'id' | 'email'> | null;
  if (!profile) return null;
  return {
    id: userId,
    full_name: profile.full_name ?? '',
    role: profile.role ?? 'agent',
    email,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const applySession = async (userId: string | null, email: string) => {
      if (!userId) {
        if (mounted) setState({ user: null, loading: false, error: null });
        return;
      }
      try {
        const profile = await loadProfile(userId, email);
        if (mounted) setState({ user: profile, loading: false, error: null });
      } catch (err) {
        if (mounted) {
          setState({
            user: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Error de autenticación',
          });
        }
      }
    };

    // Una sola inicialización de sesión para toda la app.
    supabase.auth
      .getUser()
      .then(({ data }) => applySession(data.user?.id ?? null, data.user?.email ?? ''))
      .catch(() => mounted && setState({ user: null, loading: false, error: 'Error de red' }));

    // Reacciona a login/logout sin recargar la página.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        void applySession(session?.user.id ?? null, session?.user.email ?? '');
      } else if (event === 'SIGNED_OUT') {
        if (mounted) setState({ user: null, loading: false, error: null });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(() => ({ ...state, signOut }), [state, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Consumo del estado global de auth; lanza si falta el provider. */
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>');
  return ctx;
}
