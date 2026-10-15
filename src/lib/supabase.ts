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

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Configúralas en .env (local) o en los secrets del repo (CI).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: { 'X-Client-Info': 'inmocore-app' },
  },
});

/* ---------- Autenticación ---------- */

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, fullName: string) {
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
