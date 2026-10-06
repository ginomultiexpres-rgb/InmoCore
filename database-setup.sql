-- Supabase Setup para InmoCore (idempotente - seguro re-ejecutar)
-- Proyecto: cgscbiqhzmsfmxieschl
-- URL: https://cgscbiqhzmsfmxieschl.supabase.co/rest/v1/

-- =============================================
-- TABLAS
-- =============================================
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'PEN',
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Arequipa',
    state TEXT DEFAULT 'Arequipa',
    zip_code TEXT,
    country TEXT DEFAULT 'Peru',
    property_type TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area NUMERIC,
    price_per_sqm NUMERIC,
    lot_size NUMERIC,
    status TEXT DEFAULT 'available',
    featured BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    amenities JSONB DEFAULT '[]'::jsonb,
    latitude NUMERIC,
    longitude NUMERIC,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'new',
    source TEXT DEFAULT 'website',
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    notes TEXT,
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agenda_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    event_type TEXT DEFAULT 'meeting',
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    location TEXT,
    address TEXT,
    description TEXT,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    attendees JSONB DEFAULT '[]'::jsonb,
    reminder_sent BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS property_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    message TEXT,
    status TEXT DEFAULT 'unread',
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'agent',
    avatar_url TEXT,
    company TEXT,
    phone TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ÍNDICES (IF NOT EXISTS - PostgreSQL 15+)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_property ON leads(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

CREATE INDEX IF NOT EXISTS idx_agenda_start ON agenda_events(start_time);
CREATE INDEX IF NOT EXISTS idx_agenda_lead ON agenda_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_agenda_status ON agenda_events(status);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON property_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_property ON property_inquiries(property_id);

CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics(event_type);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);

-- =============================================
-- FUNCIONES / TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agenda_events_updated_at ON agenda_events;
CREATE TRIGGER update_agenda_events_updated_at BEFORE UPDATE ON agenda_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_property_inquiries_updated_at ON property_inquiries;
CREATE TRIGGER update_property_inquiries_updated_at BEFORE UPDATE ON property_inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION increment_property_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE properties SET views_count = views_count + 1 WHERE id = NEW.property_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_property_views ON analytics;
CREATE TRIGGER track_property_views AFTER INSERT ON analytics
    FOR EACH ROW WHEN (NEW.event_type = 'view')
    EXECUTE FUNCTION increment_property_views();

-- =============================================
-- RLS (Row Level Security)
-- =============================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Propiedades públicas: leer" ON properties;
DROP POLICY IF EXISTS "Propiedades públicas: insertar" ON properties;
CREATE POLICY "Propiedades públicas: leer" ON properties FOR SELECT USING (true);
CREATE POLICY "Propiedades públicas: insertar" ON properties FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Leads: leer" ON leads;
DROP POLICY IF EXISTS "Leads: insertar" ON leads;
CREATE POLICY "Leads: leer" ON leads FOR SELECT USING (true);
CREATE POLICY "Leads: insertar" ON leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Agenda: leer" ON agenda_events;
DROP POLICY IF EXISTS "Agenda: insertar" ON agenda_events;
CREATE POLICY "Agenda: leer" ON agenda_events FOR SELECT USING (true);
CREATE POLICY "Agenda: insertar" ON agenda_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Incidencias: leer" ON property_inquiries;
DROP POLICY IF EXISTS "Incidencias: insertar" ON property_inquiries;
CREATE POLICY "Incidencias: leer" ON property_inquiries FOR SELECT USING (true);
CREATE POLICY "Incidencias: insertar" ON property_inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Analítica: leer" ON analytics;
DROP POLICY IF EXISTS "Analítica: insertar" ON analytics;
CREATE POLICY "Analítica: leer" ON analytics FOR SELECT USING (true);
CREATE POLICY "Analítica: insertar" ON analytics FOR INSERT WITH CHECK (true);

-- =============================================
-- DATOS DE DEMOSTRACIÓN - AREQUIPA, PERÚ (PEN)
-- Usa ON CONFLICT DO NOTHING para evitar duplicados
-- =============================================

-- Propiedades
INSERT INTO properties (title, description, price, currency, address, city, state, country, property_type, bedrooms, bathrooms, area, price_per_sqm, status, featured, image_url, latitude, longitude) VALUES
('Casa Colonial en Yanahuara', 'Casa de 3 dormitorios con jardín y vista al Misti, cerca del centro histórico.', 485000.00, 'PEN', 'Calle Yanahuara 302', 'Arequipa', 'Arequipa', 'Peru', 'casa', 3, 2, 180, 2694.44, 'available', true, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800', -16.409047, -71.537451),
('Departamento Moderno en Cayma', 'Departamento de lujo con terraza, piscina y gimnasio, ideal para jóvenes profesionales.', 620000.00, 'PEN', 'Av. Cayma 1450, Urb. San Gabriel', 'Arequipa', 'Arequipa', 'Peru', 'departamento', 2, 2, 95, 6526.32, 'available', true, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800', -16.385000, -71.539000),
('Terreno en Sachaca', 'Terreno para construcción de vivienda unifamiliar, zona tranquila cerca de colegios.', 320000.00, 'PEN', 'Camino a Sachaca Km 3.5', 'Arequipa', 'Arequipa', 'Peru', 'terreno', 0, 0, 450, 711.11, 'available', false, 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800', -16.403000, -71.555000),
('Casa en Vallecito', 'Casa familiar con 4 dormitorios, cochera para 2 autos y patio amplio.', 750000.00, 'PEN', 'Urb. Vallecito Mz. B Lote 12', 'Arequipa', 'Arequipa', 'Peru', 'casa', 4, 3, 220, 3409.09, 'available', false, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800', -16.420000, -71.520000)
ON CONFLICT DO NOTHING;

-- Leads
INSERT INTO leads (name, email, phone, status, source, property_id, notes) VALUES
('María Elena Vargas', 'maria.vargas@email.com', '+51 959 123 456', 'new', 'website', (SELECT id FROM properties WHERE title = 'Departamento Moderno en Cayma'), 'Interesada en departamento en Cayma, presupuesto hasta 650k PEN.'),
('Carlos Rojas', 'carlos.rojas@email.com', '+51 954 789 012', 'new', 'website', (SELECT id FROM properties WHERE title = 'Casa Colonial en Yanahuara'), 'Busca casa en Yanahuara, prefiere zonas con historia.'),
('Lucía Fernández', 'lucia.fernandez@email.com', '+51 987 654 321', 'contacted', 'referral', (SELECT id FROM properties WHERE title = 'Terreno en Sachaca'), 'Referida por cliente anterior. Quiere construir en zona tranquila.')
ON CONFLICT DO NOTHING;

-- Agenda events
INSERT INTO agenda_events (title, event_type, start_time, end_time, location, address, description, lead_id, property_id, status) VALUES
('Visita Casa Yanahuara - María Vargas', 'visit', '2026-10-08 10:00:00-05', '2026-10-08 11:00:00-05', 'Casa Yanahuara', 'Calle Yanahuara 302, Arequipa', 'Visita con María Vargas para ver casa colonial.', (SELECT id FROM leads WHERE name = 'María Elena Vargas'), (SELECT id FROM properties WHERE title = 'Casa Colonial en Yanahuara'), 'scheduled'),
('Visita Departamento Cayma - Carlos Rojas', 'visit', '2026-10-09 15:30:00-05', '2026-10-09 16:30:00-05', 'Departamento Cayma', 'Av. Cayma 1450, Urb. San Gabriel', 'Segunda visita con Carlos Rojas para ver departamento.', (SELECT id FROM leads WHERE name = 'Carlos Rojas'), (SELECT id FROM properties WHERE title = 'Departamento Moderno en Cayma'), 'scheduled')
ON CONFLICT DO NOTHING;

-- Property inquiries
INSERT INTO property_inquiries (lead_id, property_id, message, status) VALUES
((SELECT id FROM leads WHERE name = 'Lucía Fernández'), (SELECT id FROM properties WHERE title = 'Terreno en Sachaca'), 'Me gustaría saber si el terreno tiene acceso a servicios básicos (agua, luz, desagüe).', 'unread')
ON CONFLICT DO NOTHING;

-- Analytics
INSERT INTO analytics (event_type, property_id, lead_id, metadata) VALUES
('view', (SELECT id FROM properties WHERE title = 'Departamento Moderno en Cayma'), NULL, '{"source":"website","device":"mobile","region":"Arequipa"}'),
('view', (SELECT id FROM properties WHERE title = 'Casa Colonial en Yanahuara'), NULL, '{"source":"website","device":"desktop","region":"Arequipa"}')
ON CONFLICT DO NOTHING;

-- User profiles
INSERT INTO user_profiles (full_name, role, company, phone) VALUES
('Juan Pérez Agente', 'agent', 'InmoCore Arequipa', '+51 954 321 098'),
('Ana López Coordinadora', 'admin', 'InmoCore Arequipa', '+51 987 654 321')
ON CONFLICT DO NOTHING;