-- ═══════════════════════════════════════════════════════════════════════════
-- 003_core_tables_repair.sql
-- Repairs missing columns in core tables and sets up RLS policies
-- Safe to run multiple times.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. LINK PAGES ─────────────────────────────────────────────────────
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS background_image TEXT;
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Indices
CREATE UNIQUE INDEX IF NOT EXISTS idx_link_pages_username ON link_pages(username) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_link_pages_user_id ON link_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_link_pages_published ON link_pages(is_published) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_link_pages_deleted ON link_pages(deleted_at);

-- RLS
ALTER TABLE link_pages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own pages' AND tablename = 'link_pages') THEN
    CREATE POLICY "Users can view own pages" ON link_pages FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own pages' AND tablename = 'link_pages') THEN
    CREATE POLICY "Users can manage own pages" ON link_pages FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view published pages' AND tablename = 'link_pages') THEN
    CREATE POLICY "Public can view published pages" ON link_pages FOR SELECT USING (is_published = true AND deleted_at IS NULL);
  END IF;
END $$;

-- ─── 2. LINKS ──────────────────────────────────────────────────────────
ALTER TABLE links ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'link';
ALTER TABLE links ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE links ADD COLUMN IF NOT EXISTS platform TEXT;
ALTER TABLE links ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_links_page_id ON links(page_id);
CREATE INDEX IF NOT EXISTS idx_links_display_order ON links(page_id, display_order) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_links_deleted ON links(deleted_at);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage links on own pages' AND tablename = 'links') THEN
    CREATE POLICY "Users can manage links on own pages" ON links
      FOR ALL USING (
        EXISTS (SELECT 1 FROM link_pages WHERE id = links.page_id AND user_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view links on published pages' AND tablename = 'links') THEN
    CREATE POLICY "Public can view links on published pages" ON links
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM link_pages WHERE id = links.page_id AND is_published = true AND deleted_at IS NULL)
      );
  END IF;
END $$;

-- ─── 3. QR CODES ───────────────────────────────────────────────────────
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'My QR Code';
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS customization JSONB DEFAULT '{}';
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_page_id ON qr_codes(page_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_link_id ON qr_codes(link_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_code_data ON qr_codes(code_data);
CREATE INDEX IF NOT EXISTS idx_qr_codes_deleted ON qr_codes(deleted_at);

ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- If user_id is null on existing rows, we fallback to checking the page's user_id
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own QR codes' AND tablename = 'qr_codes') THEN
    CREATE POLICY "Users can manage own QR codes" ON qr_codes FOR ALL USING (
      auth.uid() = user_id OR EXISTS (SELECT 1 FROM link_pages WHERE id = qr_codes.page_id AND user_id = auth.uid())
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view active QR codes' AND tablename = 'qr_codes') THEN
    CREATE POLICY "Public can view active QR codes" ON qr_codes FOR SELECT USING (is_active = true);
  END IF;
END $$;

-- ─── 4. NFC TAGS ───────────────────────────────────────────────────────
ALTER TABLE nfc_tags ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE nfc_tags ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'My NFC Card';
ALTER TABLE nfc_tags ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE nfc_tags ADD COLUMN IF NOT EXISTS tag_id TEXT;
ALTER TABLE nfc_tags ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_nfc_tags_user_id ON nfc_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_page_id ON nfc_tags(page_id);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_nfc_id ON nfc_tags(nfc_id);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_deleted ON nfc_tags(deleted_at);

ALTER TABLE nfc_tags ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own NFC tags' AND tablename = 'nfc_tags') THEN
    CREATE POLICY "Users can manage own NFC tags" ON nfc_tags FOR ALL USING (
      auth.uid() = user_id OR EXISTS (SELECT 1 FROM link_pages WHERE id = nfc_tags.page_id AND user_id = auth.uid())
    );
  END IF;
END $$;

-- ─── 5. ANALYTICS EVENTS ───────────────────────────────────────────────
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS nfc_card_id UUID REFERENCES nfc_tags(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_analytics_events_page_id ON analytics_events(page_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_link_id ON analytics_events(link_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_qr_code_id ON analytics_events(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_nfc_card_id ON analytics_events(nfc_card_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page_date ON analytics_events(page_id, created_at DESC);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view analytics on own pages' AND tablename = 'analytics_events') THEN
    CREATE POLICY "Users can view analytics on own pages" ON analytics_events
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM link_pages WHERE id = analytics_events.page_id AND user_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'System can insert analytics events' AND tablename = 'analytics_events') THEN
    CREATE POLICY "System can insert analytics events" ON analytics_events FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all analytics' AND tablename = 'analytics_events') THEN
    CREATE POLICY "Admins can view all analytics" ON analytics_events
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
      );
  END IF;
END $$;
