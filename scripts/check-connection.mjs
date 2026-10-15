#!/usr/bin/env node
/**
 * Verificador de conexión Supabase (auth + PostgREST) usado por `npm run check:supabase`.
 * Carga .env y hace un fetch mínimo a /rest/v1/; reporta errores legibles.
 */
import { readFileSync, existsSync } from 'node:fs';

function loadEnv() {
  const env = {};
  for (const f of ['.env.local', '.env']) {
    if (!existsSync(f)) continue;
    for (const line of readFileSync(f, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/i);
      if (m && !(m[1] in env)) env[m[1]] = m[2].trim();
    }
  }
  return env;
}

const { VITE_SUPABASE_URL: url, VITE_SUPABASE_ANON_KEY: key } = { ...loadEnv(), ...process.env };

if (!url) {
  console.error('❌ VITE_SUPABASE_URL no está definida en .env');
  process.exit(1);
}
if (!key || key.length < 40 || !key.startsWith('eyJ')) {
  console.error('❌ VITE_SUPABASE_ANON_KEY no es una JWT válida (está vacía o es un placeholder).');
  console.error('   Pega la anon key real desde: Supabase Dashboard → Settings → API → anon public.');
  process.exit(1);
}

try {
  const res = await fetch(`${url}/rest/v1/?select=count&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15000),
  });
  if (res.ok || res.status === 404) {
    console.log(`✅ Conexión Supabase OK (HTTP ${res.status}) → ${url}`);
  } else {
    const body = await res.text();
    console.error(`❌ Supabase respondió HTTP ${res.status}: ${body.slice(0, 300)}`);
    process.exit(1);
  }
} catch (e) {
  console.error('❌ No se pudo contactar el proyecto:', e.message);
  process.exit(1);
}
