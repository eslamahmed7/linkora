-- ═══════════════════════════════════════════════════════════════════════════
-- 004_functions_triggers_storage.sql
-- RPC functions, auto-update triggers, missing columns, storage setup
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. RPC FUNCTIONS ──────────────────────────────────────────────────

-- Generic increment function (used by asset usage tracking)
CREATE OR REPLACE FUNCTION increment_column(
  table_name TEXT,
  column_name TEXT,
  row_id UUID
) RETURNS VOID AS $$
BEGIN
  EXECUTE format(
    'UPDATE %I SET %I = COALESCE(%I, 0) + 1 WHERE id = $1',
    table_name, column_name, column_name
  ) USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment QR code scan count
CREATE OR REPLACE FUNCTION increment_qr_scan(qr_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE qr_codes SET scan_count = scan_count + 1 WHERE id = qr_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment NFC tag scan count
CREATE OR REPLACE FUNCTION increment_nfc_scan(nfc_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE nfc_tags SET scan_count = scan_count + 1 WHERE id = nfc_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment link click count
CREATE OR REPLACE FUNCTION increment_link_click(link_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE links SET click_count = click_count + 1 WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment page view count
CREATE OR REPLACE FUNCTION increment_page_view(page_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE link_pages SET view_count = view_count + 1 WHERE id = page_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment page click count (sum of all link clicks)
CREATE OR REPLACE FUNCTION refresh_page_click_count(target_page_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE link_pages SET click_count = (
    SELECT COALESCE(SUM(click_count), 0) FROM links WHERE page_id = target_page_id AND deleted_at IS NULL
  ) WHERE id = target_page_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 2. AUTO-UPDATE TIMESTAMPS ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_link_pages_updated_at') THEN
    CREATE TRIGGER set_link_pages_updated_at BEFORE UPDATE ON link_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_links_updated_at') THEN
    CREATE TRIGGER set_links_updated_at BEFORE UPDATE ON links FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_qr_codes_updated_at') THEN
    CREATE TRIGGER set_qr_codes_updated_at BEFORE UPDATE ON qr_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_nfc_tags_updated_at') THEN
    CREATE TRIGGER set_nfc_tags_updated_at BEFORE UPDATE ON nfc_tags FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_users_updated_at') THEN
    CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_assets_updated_at') THEN
    CREATE TRIGGER set_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_asset_collections_updated_at') THEN
    CREATE TRIGGER set_asset_collections_updated_at BEFORE UPDATE ON asset_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- ─── 3. MISSING COLUMNS (defensive ALTER TABLE) ────────────────────────

-- Ensure users table has all columns the app expects
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'username') THEN
    ALTER TABLE users ADD COLUMN username TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'display_name') THEN
    ALTER TABLE users ADD COLUMN display_name TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'first_name') THEN
    ALTER TABLE users ADD COLUMN first_name TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_name') THEN
    ALTER TABLE users ADD COLUMN last_name TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'password_hash') THEN
    ALTER TABLE users ADD COLUMN password_hash TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url') THEN
    ALTER TABLE users ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'cover_url') THEN
    ALTER TABLE users ADD COLUMN cover_url TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bio') THEN
    ALTER TABLE users ADD COLUMN bio TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_login') THEN
    ALTER TABLE users ADD COLUMN last_login TIMESTAMPTZ;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'deleted_at') THEN
    ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'theme') THEN
    ALTER TABLE users ADD COLUMN theme TEXT DEFAULT 'dark';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'language') THEN
    ALTER TABLE users ADD COLUMN language TEXT DEFAULT 'en';
  END IF;
END $$;

-- Ensure users has unique username
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_username_unique') THEN
    CREATE UNIQUE INDEX idx_users_username_unique ON users(username) WHERE username IS NOT NULL AND deleted_at IS NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
    CREATE INDEX idx_users_email ON users(email);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_deleted') THEN
    CREATE INDEX idx_users_deleted ON users(deleted_at);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_role') THEN
    CREATE INDEX idx_users_role ON users(role);
  END IF;
END $$;

-- Ensure link_pages has missing columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'link_pages' AND column_name = 'background_image') THEN
    ALTER TABLE link_pages ADD COLUMN background_image TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'link_pages' AND column_name = 'profile_image_position') THEN
    ALTER TABLE link_pages ADD COLUMN profile_image_position TEXT DEFAULT 'center';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'link_pages' AND column_name = 'custom_domain') THEN
    ALTER TABLE link_pages ADD COLUMN custom_domain TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'link_pages' AND column_name = 'seo_title') THEN
    ALTER TABLE link_pages ADD COLUMN seo_title TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'link_pages' AND column_name = 'seo_description') THEN
    ALTER TABLE link_pages ADD COLUMN seo_description TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'link_pages' AND column_name = 'meta_keywords') THEN
    ALTER TABLE link_pages ADD COLUMN meta_keywords TEXT DEFAULT '{}';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'link_pages' AND column_name = 'view_count') THEN
    ALTER TABLE link_pages ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'link_pages' AND column_name = 'click_count') THEN
    ALTER TABLE link_pages ADD COLUMN click_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Ensure qr_codes has missing columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'qr_codes' AND column_name = 'name') THEN
    ALTER TABLE qr_codes ADD COLUMN name TEXT DEFAULT 'My QR Code';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'qr_codes' AND column_name = 'url') THEN
    ALTER TABLE qr_codes ADD COLUMN url TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'qr_codes' AND column_name = 'content') THEN
    ALTER TABLE qr_codes ADD COLUMN content TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'qr_codes' AND column_name = 'is_active') THEN
    ALTER TABLE qr_codes ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'qr_codes' AND column_name = 'scan_count') THEN
    ALTER TABLE qr_codes ADD COLUMN scan_count INTEGER DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'qr_codes' AND column_name = 'customization') THEN
    ALTER TABLE qr_codes ADD COLUMN customization JSONB DEFAULT '{}';
  END IF;
END $$;

-- Ensure nfc_tags has missing columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nfc_tags' AND column_name = 'title') THEN
    ALTER TABLE nfc_tags ADD COLUMN title TEXT DEFAULT 'My NFC Card';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nfc_tags' AND column_name = 'description') THEN
    ALTER TABLE nfc_tags ADD COLUMN description TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nfc_tags' AND column_name = 'tag_id') THEN
    ALTER TABLE nfc_tags ADD COLUMN tag_id TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nfc_tags' AND column_name = 'scan_count') THEN
    ALTER TABLE nfc_tags ADD COLUMN scan_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Ensure links has missing columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'links' AND column_name = 'type') THEN
    ALTER TABLE links ADD COLUMN type TEXT DEFAULT 'link';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'links' AND column_name = 'content') THEN
    ALTER TABLE links ADD COLUMN content TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'links' AND column_name = 'platform') THEN
    ALTER TABLE links ADD COLUMN platform TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'links' AND column_name = 'metadata') THEN
    ALTER TABLE links ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'links' AND column_name = 'click_count') THEN
    ALTER TABLE links ADD COLUMN click_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- ─── 4. ANALYTICS TABLE REPAIR ─────────────────────────────────────────

-- If analytics_events exists but was created as 'click_events' in some prior version,
-- ensure the correct table name exists. (The repos use 'analytics_events')

-- Add missing columns to analytics_events if table already existed
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_events' AND column_name = 'link_id') THEN
    ALTER TABLE analytics_events ADD COLUMN link_id UUID REFERENCES links(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_events' AND column_name = 'qr_code_id') THEN
    ALTER TABLE analytics_events ADD COLUMN qr_code_id UUID REFERENCES qr_codes(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_events' AND column_name = 'nfc_card_id') THEN
    ALTER TABLE analytics_events ADD COLUMN nfc_card_id UUID REFERENCES nfc_tags(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_events' AND column_name = 'device_type') THEN
    ALTER TABLE analytics_events ADD COLUMN device_type TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_events' AND column_name = 'country') THEN
    ALTER TABLE analytics_events ADD COLUMN country TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_events' AND column_name = 'city') THEN
    ALTER TABLE analytics_events ADD COLUMN city TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_events' AND column_name = 'referrer_url') THEN
    ALTER TABLE analytics_events ADD COLUMN referrer_url TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_events' AND column_name = 'browser') THEN
    ALTER TABLE analytics_events ADD COLUMN browser TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_events' AND column_name = 'os') THEN
    ALTER TABLE analytics_events ADD COLUMN os TEXT;
  END IF;
END $$;

-- ─── 5. ADDITIONAL TABLES (marketplace ecosystem) ──────────────────────

-- Uploaded files metadata (if uploads route exists)
CREATE TABLE IF NOT EXISTS uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT,
  file_size INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  bucket TEXT DEFAULT 'uploads',
  path TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_uploaded_files_user ON uploaded_files(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_bucket ON uploaded_files(bucket);

ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own uploads' AND tablename = 'uploaded_files') THEN
    CREATE POLICY "Users can manage own uploads" ON uploaded_files FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view public uploads' AND tablename = 'uploaded_files') THEN
    CREATE POLICY "Public can view public uploads" ON uploaded_files FOR SELECT USING (is_public = true);
  END IF;
END $$;

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_method JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan ON user_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own subscriptions' AND tablename = 'user_subscriptions') THEN
    CREATE POLICY "Users can view own subscriptions" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  description TEXT,
  invoice_url TEXT,
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own invoices' AND tablename = 'invoices') THEN
    CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- ─── 6. MISSING INDEXES ────────────────────────────────────────────────

-- design_marketplace
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_design_marketplace_author') THEN
    CREATE INDEX idx_design_marketplace_author ON design_marketplace(author_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_design_marketplace_slug') THEN
    CREATE INDEX idx_design_marketplace_slug ON design_marketplace(slug);
  END IF;
END $$;

-- community_submissions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_submissions_slug') THEN
    CREATE INDEX idx_submissions_slug ON community_submissions(slug);
  END IF;
END $$;

-- template_ratings
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_template_ratings_template') THEN
    CREATE INDEX idx_template_ratings_template ON template_ratings(template_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_template_ratings_user') THEN
    CREATE INDEX idx_template_ratings_user ON template_ratings(user_id);
  END IF;
END $$;

-- template_bookmarks
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_template_bookmarks_template') THEN
    CREATE INDEX idx_template_bookmarks_template ON template_bookmarks(template_id);
  END IF;
END $$;

-- template_reports
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_template_reports_template') THEN
    CREATE INDEX idx_template_reports_template ON template_reports(template_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_template_reports_status') THEN
    CREATE INDEX idx_template_reports_status ON template_reports(status);
  END IF;
END $$;

-- suggestions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_suggestions_status') THEN
    CREATE INDEX idx_suggestions_status ON suggestions(status);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_suggestions_category') THEN
    CREATE INDEX idx_suggestions_category ON suggestions(category);
  END IF;
END $$;

-- feature_requests
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_features_status') THEN
    CREATE INDEX idx_features_status ON feature_requests(status);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_features_votes') THEN
    CREATE INDEX idx_features_votes ON feature_requests(vote_count DESC);
  END IF;
END $$;

-- bug_reports
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bugs_status') THEN
    CREATE INDEX idx_bugs_status ON bug_reports(status);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bugs_priority') THEN
    CREATE INDEX idx_bugs_priority ON bug_reports(priority);
  END IF;
END $$;

-- contact_messages
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_status') THEN
    CREATE INDEX idx_messages_status ON contact_messages(status);
  END IF;
END $$;

-- announcements
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_announcements_active') THEN
    CREATE INDEX idx_announcements_active ON announcements(is_active) WHERE is_active = true;
  END IF;
END $$;

-- creator_profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_creator_profiles_user') THEN
    CREATE INDEX idx_creator_profiles_user ON creator_profiles(user_id);
  END IF;
END $$;

-- backups
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_backups_status') THEN
    CREATE INDEX idx_backups_status ON backups(status);
  END IF;
END $$;

-- subscriptions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscription_plans_slug') THEN
    CREATE INDEX idx_subscription_plans_slug ON subscription_plans(slug);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscription_plans_active') THEN
    CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active);
  END IF;
END $$;

-- coupons
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_coupons_code') THEN
    CREATE INDEX idx_coupons_code ON coupons(code);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_coupons_active') THEN
    CREATE INDEX idx_coupons_active ON coupons(is_active) WHERE is_active = true;
  END IF;
END $$;

-- ─── 7. MISSING RLS POLICIES ───────────────────────────────────────────

-- Admin full access policies for tables that need admin management

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all link_pages' AND tablename = 'link_pages') THEN
    CREATE POLICY "Admins can manage all link_pages" ON link_pages
      FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all qr_codes' AND tablename = 'qr_codes') THEN
    CREATE POLICY "Admins can manage all qr_codes" ON qr_codes
      FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all nfc_tags' AND tablename = 'nfc_tags') THEN
    CREATE POLICY "Admins can manage all nfc_tags" ON nfc_tags
      FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all links' AND tablename = 'links') THEN
    CREATE POLICY "Admins can manage all links" ON links
      FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
      );
  END IF;
END $$;

-- Admin access for subscription/billing tables
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage subscriptions' AND tablename = 'user_subscriptions') THEN
    CREATE POLICY "Admins can manage subscriptions" ON user_subscriptions
      FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage invoices' AND tablename = 'invoices') THEN
    CREATE POLICY "Admins can manage invoices" ON invoices
      FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage coupons' AND tablename = 'coupons') THEN
    CREATE POLICY "Admins can manage coupons" ON coupons
      FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage subscription plans' AND tablename = 'subscription_plans') THEN
    CREATE POLICY "Admins can manage subscription plans" ON subscription_plans
      FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
      );
  END IF;
END $$;

-- Public read for subscription plans (already exists but ensure)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view active subscription plans' AND tablename = 'subscription_plans') THEN
    CREATE POLICY "Public can view active subscription plans" ON subscription_plans
      FOR SELECT USING (is_active = true);
  END IF;
END $$;

-- ─── 8. AUTH SYNC TRIGGER ──────────────────────────────────────────────
-- Auto-create public.users row when a new auth user signs up

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, username, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- ─── 9. REALTIME SUBSCRIPTIONS ─────────────────────────────────────────
-- Enable realtime for key tables (notifications, activity)

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'notifications') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'activity_logs') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'announcements') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- REPAIR SUMMARY
-- ═══════════════════════════════════════════════════════════════════════════
-- Created:
--   - 6 RPC functions (increment_column, increment_qr/nfc/link/page, refresh_page_click_count)
--   - 8 auto-update triggers (updated_at)
--   - 3 new tables (uploaded_files, user_subscriptions, invoices)
--   - 30+ missing columns across users, link_pages, qr_codes, nfc_tags, links, analytics_events
--   - 25+ missing indexes across all tables
--   - 12+ missing RLS policies for admin access
--   - 1 auth sync trigger (auth.users → public.users)
--   - 3 realtime publications
-- ═══════════════════════════════════════════════════════════════════════════
