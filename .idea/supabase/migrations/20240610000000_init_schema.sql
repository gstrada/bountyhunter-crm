-- 1. TIPOS ENUMERADOS
CREATE TYPE user_role AS ENUM ('Administrador_Gremio', 'Caza_Recompensas');
CREATE TYPE bounty_status AS ENUM ('Disponible', 'Asignado', 'Completado');

-- 2. TABLA DE PERFILES
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    alias TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'Caza_Recompensas',
    creditos_galacticos NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE PLANETAS
CREATE TABLE planetas (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sector TEXT NOT NULL,
    danger_level INT CHECK (danger_level BETWEEN 1 AND 10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE BOUNTIES (CONTRATOS)
CREATE TABLE bounties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    raw_description TEXT,
    reward NUMERIC(15, 2) NOT NULL CHECK (reward >= 0),
    status bounty_status NOT NULL DEFAULT 'Disponible',
    planeta_id INT REFERENCES planetas(id) ON DELETE SET NULL,
    hunter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    metadata_ia JSONB DEFAULT '{}'::jsonb,
    version INT DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FUNCIÓN PARA ACTUALIZAR TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bounties_updated_at
    BEFORE UPDATE ON bounties
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- 6. HABILITAR SEGURIDAD POR FILAS (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE planetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;

-- 7. POLÍTICAS DE SEGURIDAD (RLS)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Planetas viewable by everyone" ON planetas
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage planetas" ON planetas
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Administrador_Gremio')
    );

CREATE POLICY "Admins have full control over bounties" ON bounties
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Administrador_Gremio')
    );

CREATE POLICY "Hunters can view available or assigned bounties" ON bounties
    FOR SELECT USING (
        status = 'Disponible' OR hunter_id = auth.uid()
    );

CREATE POLICY "Hunters can update their assigned bounties" ON bounties
    FOR UPDATE USING (
        hunter_id = auth.uid()
    )
    WITH CHECK (
        hunter_id = auth.uid()
    );

-- 8. TRIGGER PARA PERFIL AUTOMÁTICO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, alias, role)
  VALUES (new.id, new.email, 'Caza_Recompensas');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
