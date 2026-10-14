/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Initialize supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required. Please set it in your .env file.');
}

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required. Please set it in your .env file.');
}

// Create supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'inmocore-app',
    },
  },
});

// Helper functions for common Supabase operations
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (data.user && !error) {
    // Create user profile
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
  const { data: { user} } = await supabase.auth.getUser();
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

export async function listProperties(filters: {
  city?: string;
  property_type?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  featured?: boolean;
}) {
  let query = supabase.from('properties').select('*');

  if (filters.city) query = query.eq('city', filters.city);
  if (filters.property_type) query = query.eq('property_type', filters.property_type);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.min_price !== undefined) query = query.gte('price', filters.min_price);
  if (filters.max_price !== undefined) query = query.lte('price', filters.max_price);
  if (filters.min_bedrooms !== undefined) query = query.gte('bedrooms', filters.min_bedrooms);
  if (filters.featured !== undefined) query = query.eq('featured', filters.featured);

  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
}

export async function getProperty(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

export async function updateProperty(id: string, data: Partial<any>) {
  const { data: result, error } = await supabase
    .from('properties')
    .update(data)
    .eq('id', id)
    .single();

  return { data: result, error };
}

export async function deleteProperty(id: string) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  return { error };
}

// Lead operations
export async function createLead(data: {
  name: string;
  email: string;
  phone?: string;
  source?: string;
  property_id?: string;
  notes?: string;
}) {
  const { data: result, error } = await supabase.from('leads').insert([data]).single();

  return { data: result, error };
}

// Inquiry operations
export async function createInquiry(data: {
  lead_id: string;
  property_id: string;
  message: string;
}) {
  const { data: result, error } = await supabase
    .from('property_inquiries')
    .insert([data])
    .single();

  return { data: result, error };
}

// Analytics
export async function trackView(propertyId: string) {
  const user = await getCurrentUser();
  const leadId = user?.id ? user.id : undefined;

  const { error } = await supabase.from('analytics').insert([
    {
      event_type: 'view',
      property_id: propertyId,
      lead_id: leadId,
      metadata: {
        source: 'website',
        device: navigator.userAgent,
      },
    },
  ]);

  return { error };
}