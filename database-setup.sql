-- Supabase Setup para InmoCore
-- Proyecto: cgscbiqhzmsfmxieschl
-- URL: https://cgscbiqhzmsfmxieschl.supabase.co/rest/v1/
--
-- Instrucciones:
-- 1. Ir a Supabase Dashboard → SQL Editor
-- 2. Pegar este script y ejecutarlo
-- 3. Las tablas se crearán con RLS (Row Level Security)

SET statement_timeout = 0;

-- =============================================
-- TABLA: properties (Propiedades)
-- =============================================
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'Mexico',
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

COMMENT ON TABLE properties IS 'Catálogo de propiedades inmobiliarias';

CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_featured ON properties(featured);

-- =============================================
-- TABLA: leads (Clientes potenciales)
-- =============================================
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

COMMENT ON TABLE leads IS 'Base de datos de clientes potenciales';

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_property ON leads(property_id);
CREATE INDEX idx_leads_email ON leads(email);

-- =============================================
-- TABLA: agenda_events (Agenda/Citas)
-- =============================================
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

COMMENT ON TABLE agenda_events IS 'Agenda de citas y eventos';

CREATE INDEX idx_agenda_start ON agenda_events(start_time);
CREATE INDEX idx_agenda_lead ON agenda_events(lead_id);
CREATE INDEX idx_agenda_status ON agenda_events(status);

-- =============================================
-- TABLA: property_inquiries (Incidencias/contactos)
-- =============================================
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

CREATE INDEX idx_inquiries_status ON property_inquiries(status);
CREATE INDEX idx_inquiries_property ON property_inquiries(property_id);

-- =============================================
-- TABLA: analytics (Métricas de uso)
-- =============================================
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE analytics IS 'Registro de eventos de analítica';
CREATE INDEX idx_analytics_type ON analytics(event_type);

-- =============================================
-- TABLA: users_perfiles (Perfiles de usuario)
-- =============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'agent',
    avatar_url TEXT,
    company TEXT,
    phone TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);

-- =============================================
-- FUNCIONES / TRIGGERS
-- =============================================

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agenda_events_updated_at BEFORE UPDATE ON agenda_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_inquiries_updated_at BEFORE UPDATE ON property_inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para contar visitas a propiedades
CREATE OR REPLACE FUNCTION increment_property_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE properties SET views_count = views_count + 1 WHERE id = NEW.property_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_property_views AFTER INSERT ON analytics
    FOR EACH ROW WHEN (NEW.event_type = 'view')
    EXECUTE FUNCTION increment_property_views();

-- =============================================
-- RLS (Row Level Security)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para anon user (frontend)
CREATE POLICY "Propiedades públicas: leer" ON properties FOR SELECT
    USING (true);
CREATE POLICY "Propiedades públicas: insertar" ON properties FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Leads: leer" ON leads FOR SELECT
    USING (true);
CREATE POLICY "Leads: insertar" ON leads FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Agenda: leer" ON agenda_events FOR SELECT
    USING (true);
CREATE POLICY "Agenda: insertar" ON agenda_events FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Incidencias: leer" ON property_inquiries FOR SELECT
    USING (true);
CREATE POLICY "Incidencias: insertar" ON property_inquiries FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Analítica: leer" ON analytics FOR SELECT
    USING (true);
CREATE POLICY "Analítica: insertar" ON analytics FOR INSERT
    WITH CHECK (true);

-- =============================================
-- DATOS DE EJEMPLO (opcional - eliminar en producción)
-- =============================================

-- INSERT INTO properties (title, description, price, address, city, property_type, bedrooms, bathrooms, area, image_url, status) VALUES
-- ('Casa Moderna en el Centro', 'Hermosa casa moderna con todas las amenidades', 2500000, 'Av. Principal 123', 'Ciudad', 'casa', 3, 2, 150, 'https://example.com/img1.jpg', 'available'),
-- ('Departamento de Lujo', 'Departamento con vista panorámica', 1800000, 'Calle Libertad 456', 'Ciudad', 'departamento', 2, 2, 95, 'https://example.com/img2.jpg', 'available');
