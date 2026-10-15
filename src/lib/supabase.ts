/**
 * ÚNICO cliente Supabase de InmoCore (Auth + CRUD vía SDK).
 *
 * El SDK adjunta automáticamente el JWT del usuario autenticado a cada
 * request, por lo que las políticas RLS de Supabase distinguen usuarios.
 * (La antigua capa REST manual enviaba siempre la anon key → RLS ineficaz.)
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Validación temprana de credenciales: si faltan o son placeholders, la app
 * entra en "modo demo" (ver services/api.ts) en lugar de crashear con un
 * error no capturado que deja la pantalla en blanco.
 */
const isJwtLike = (k: string) => k.startsWith('eyJ') && k.length > 40;
export const hasValidSupabaseConfig =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  /^https?:\/\//.test(supabaseUrl) &&
  isJwtLike(supabaseAnonKey);

if (!hasValidSupabaseConfig) {
  // eslint-disable-next-line no-console
  console.warn(
    '[InmoCore] Configuración de Supabase ausente o inválida (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
      'La app funcionará en modo demo con datos locales. ' +
      'Pega la anon key real en .env (local) o en los secrets del repo (CI): ' +
      'Supabase Dashboard → Project Settings → API Keys → anon public.'
  );
}

// createClient lanza si el URL no es sintácticamente válido; se protege para
// permitir el arranque en modo demo cuando .env está vacío o incompleto.
export const supabase = (() => {
  try {
    return createClient(supabaseUrl ?? 'http://localhost:1', supabaseAnonKey ?? 'public-anon-key-placeholder', {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: { 'X-Client-Info': 'inmocore-app' },
      },
    });
  } catch {
    // URL sintácticamente inválido → cliente inerte; los servicios caerán a modo demo.
    return createClient('http://localhost:1', 'public-anon-key-placeholder');
  }
})();

/* ---------- Autenticación ---------- */

export async function signIn(email: string, password: string) {
  if (!hasValidSupabaseConfig) {
    throw new Error(
      'Supabase no está configurado. Añade la anon key real en .env (Settings → API Keys → anon public).'
    );
  }
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, fullName: string) {
  if (!hasValidSupabaseConfig) {
    throw new Error(
      'Supabase no está configurado. Añade la anon key real en .env (Settings → API Keys → anon public).'
    );
  }
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (data.user && !error) {
    await supabase.from('user_profiles').insert({
      user_id: data.user.id,
      full_name: fullName,
      role: 'agent',
    });
  }

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return { data, error };
}
