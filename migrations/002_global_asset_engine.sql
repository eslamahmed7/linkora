-- ═══════════════════════════════════════════════════════════════════════════
-- 002_global_asset_engine.sql
-- Centralized Asset Library shared across entire Linkora platform
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. ASSETS (Master Table) ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  asset_type TEXT NOT NULL,
  subcategory TEXT DEFAULT 'general',
  category TEXT DEFAULT 'general',
  data JSONB NOT NULL DEFAULT '{}',
  preview_url TEXT,
  thumbnail_url TEXT,
  preview_html TEXT,
  tags TEXT[] DEFAULT '{}',
  version TEXT DEFAULT '1.0.0',
  file_type TEXT,
  file_size INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,
  visibility TEXT DEFAULT 'public',
  supported_modules TEXT[] DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_slug ON assets(slug);
CREATE INDEX IF NOT EXISTS idx_assets_active ON assets(is_active);
CREATE INDEX IF NOT EXISTS idx_assets_tags ON assets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_assets_modules ON assets USING GIN(supported_modules);

-- ─── 2. ASSET COLLECTIONS ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS asset_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#6366f1',
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS asset_collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES asset_collections(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(collection_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_items ON asset_collection_items(collection_id);

-- ─── 3. ASSET VERSIONS ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS asset_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  data JSONB NOT NULL,
  name TEXT,
  description TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_versions ON asset_versions(asset_id);

-- ─── 4. ASSET USAGE TRACKING ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS asset_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  used_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_usage ON asset_usage(asset_id);

-- ─── 5. ASSET FAVORITES ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS asset_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, asset_id)
);

-- ─── 6. RLS Policies ────────────────────────────────────────────────────

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assets public read" ON assets FOR SELECT USING (is_active = true AND visibility = 'public');
CREATE POLICY "Assets auth read" ON assets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Assets admin manage" ON assets FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin','admin','editor')));

CREATE POLICY "Collections public read" ON asset_collections FOR SELECT USING (is_active = true);
CREATE POLICY "Collections admin manage" ON asset_collections FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin','admin','editor')));

CREATE POLICY "Collection items admin" ON asset_collection_items FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin','admin','editor')));
CREATE POLICY "Versions admin" ON asset_versions FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin','admin','editor')));
CREATE POLICY "Usage insert" ON asset_usage FOR INSERT WITH CHECK (true);
CREATE POLICY "Usage admin read" ON asset_usage FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin','admin','editor')));
CREATE POLICY "Favorites own" ON asset_favorites FOR ALL USING (auth.uid() = user_id);
