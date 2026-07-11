-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  verified_email BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_token_expires_at TIMESTAMP,
  password_reset_token VARCHAR(255),
  password_reset_token_expires_at TIMESTAMP,
  last_login TIMESTAMP,
  username VARCHAR(100),
  display_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP -- Soft delete
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- Link Pages Table
CREATE TABLE IF NOT EXISTS link_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  theme VARCHAR(20) DEFAULT 'dark',
  background_color VARCHAR(7) DEFAULT '#000000',
  background_image_url TEXT,
  profile_image_url TEXT,
  profile_image_position VARCHAR(20) DEFAULT 'center',
  design JSONB,
  custom_domain VARCHAR(255),
  custom_domain_verified BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_link_pages_user_id ON link_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_link_pages_username ON link_pages(username);
CREATE INDEX IF NOT EXISTS idx_link_pages_custom_domain ON link_pages(custom_domain);
CREATE INDEX IF NOT EXISTS idx_link_pages_is_published ON link_pages(is_published);

-- Links Table
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES link_pages(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  url VARCHAR(2000) NOT NULL,
  description TEXT,
  icon_url TEXT,
  color VARCHAR(7) DEFAULT '#0066FF',
  button_style VARCHAR(50) DEFAULT 'default',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER NOT NULL,
  click_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_links_page_id ON links(page_id);
CREATE INDEX IF NOT EXISTS idx_links_display_order ON links(page_id, display_order);

-- QR Codes Table
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES link_pages(id) ON DELETE CASCADE,
  code_data TEXT NOT NULL,
  image_url TEXT,
  image_base64 TEXT,
  size INTEGER DEFAULT 300,
  error_correction_level VARCHAR(1) DEFAULT 'M',
  format VARCHAR(10) DEFAULT 'png',
  style VARCHAR(50) DEFAULT 'default',
  color_dark VARCHAR(7) DEFAULT '#000000',
  color_light VARCHAR(7) DEFAULT '#FFFFFF',
  logo_url TEXT,
  border_width INTEGER DEFAULT 0,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_link_id ON qr_codes(link_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_page_id ON qr_codes(page_id);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  page_id UUID REFERENCES link_pages(id) ON DELETE CASCADE,
  qr_code_id UUID REFERENCES qr_codes(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  user_agent TEXT,
  ip_address VARCHAR(45),
  country VARCHAR(2),
  city VARCHAR(100),
  device_type VARCHAR(50),
  browser_name VARCHAR(100),
  browser_version VARCHAR(50),
  os_name VARCHAR(100),
  os_version VARCHAR(50),
  referrer_url TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_content VARCHAR(100),
  utm_term VARCHAR(100),
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analytics_link_id ON analytics_events(link_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page_id ON analytics_events(page_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_country ON analytics_events(country);

-- NFC Tags Table
CREATE TABLE IF NOT EXISTS nfc_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  page_id UUID REFERENCES link_pages(id) ON DELETE CASCADE,
  nfc_id VARCHAR(255) UNIQUE NOT NULL,
  nfc_uri TEXT NOT NULL,
  nfc_type VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  scan_count INTEGER DEFAULT 0,
  card_design JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_nfc_tags_link_id ON nfc_tags(link_id);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_nfc_id ON nfc_tags(nfc_id);

-- Themes Table
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE,
  background_color VARCHAR(7),
  background_image_url TEXT,
  button_style VARCHAR(50),
  text_color VARCHAR(7),
  accent_color VARCHAR(7),
  is_default BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom Domains Table
CREATE TABLE IF NOT EXISTS custom_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES link_pages(id) ON DELETE CASCADE,
  domain VARCHAR(255) UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verification_method VARCHAR(50),
  dns_records JSONB,
  ssl_certificate TEXT,
  ssl_certificate_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_custom_domains_user_id ON custom_domains(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_domains_domain ON custom_domains(domain);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-------------------------------------------------------------------
-- RLS POLICIES (Row Level Security)
-------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Note: We use DROP POLICY IF EXISTS before CREATE POLICY to ensure idempotency.

-- 1. Users table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- 2. Link Pages table policies
DROP POLICY IF EXISTS "Public can view published pages" ON link_pages;
CREATE POLICY "Public can view published pages" ON link_pages FOR SELECT USING (is_published = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own pages" ON link_pages;
CREATE POLICY "Users can insert their own pages" ON link_pages FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own pages" ON link_pages;
CREATE POLICY "Users can update their own pages" ON link_pages FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own pages" ON link_pages;
CREATE POLICY "Users can delete their own pages" ON link_pages FOR DELETE USING (auth.uid() = user_id);

-- 3. Links table policies
DROP POLICY IF EXISTS "Public can view links of published pages" ON links;
CREATE POLICY "Public can view links of published pages" ON links FOR SELECT USING (
  EXISTS (SELECT 1 FROM link_pages WHERE link_pages.id = links.page_id AND (link_pages.is_published = true OR link_pages.user_id = auth.uid()))
);

DROP POLICY IF EXISTS "Users can manage links of their pages" ON links;
CREATE POLICY "Users can manage links of their pages" ON links FOR ALL USING (
  EXISTS (SELECT 1 FROM link_pages WHERE link_pages.id = links.page_id AND link_pages.user_id = auth.uid())
);

-- 4. QR Codes table policies
DROP POLICY IF EXISTS "Users can manage their QR codes" ON qr_codes;
CREATE POLICY "Users can manage their QR codes" ON qr_codes FOR ALL USING (
  EXISTS (SELECT 1 FROM link_pages WHERE link_pages.id = qr_codes.page_id AND link_pages.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Public can view QR codes of published pages" ON qr_codes;
CREATE POLICY "Public can view QR codes of published pages" ON qr_codes FOR SELECT USING (
  EXISTS (SELECT 1 FROM link_pages WHERE link_pages.id = qr_codes.page_id AND link_pages.is_published = true)
);

-- 5. Analytics Events table policies
DROP POLICY IF EXISTS "Public can insert analytics events" ON analytics_events;
CREATE POLICY "Public can insert analytics events" ON analytics_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view analytics for their pages" ON analytics_events;
CREATE POLICY "Users can view analytics for their pages" ON analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM link_pages WHERE link_pages.id = analytics_events.page_id AND link_pages.user_id = auth.uid())
);

-- 6. NFC Tags table policies
DROP POLICY IF EXISTS "Users can manage their NFC tags" ON nfc_tags;
CREATE POLICY "Users can manage their NFC tags" ON nfc_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM link_pages WHERE link_pages.id = nfc_tags.page_id AND link_pages.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Public can view active NFC tags of published pages" ON nfc_tags;
CREATE POLICY "Public can view active NFC tags of published pages" ON nfc_tags FOR SELECT USING (
  is_active = true AND EXISTS (SELECT 1 FROM link_pages WHERE link_pages.id = nfc_tags.page_id AND link_pages.is_published = true)
);

-- 7. Themes table policies
DROP POLICY IF EXISTS "Public can view themes" ON themes;
CREATE POLICY "Public can view themes" ON themes FOR SELECT USING (true);

-- 8. Custom Domains table policies
DROP POLICY IF EXISTS "Users can manage their custom domains" ON custom_domains;
CREATE POLICY "Users can manage their custom domains" ON custom_domains FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can view verified custom domains" ON custom_domains;
CREATE POLICY "Public can view verified custom domains" ON custom_domains FOR SELECT USING (is_verified = true);

-- 9. Subscriptions table policies
DROP POLICY IF EXISTS "Users can view their subscriptions" ON subscriptions;
CREATE POLICY "Users can view their subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-------------------------------------------------------------------
-- SUPABASE AUTH TRIGGER (User Synchronization)
-------------------------------------------------------------------
-- Automatically create a profile in public.users when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, password_hash, first_name, last_name, avatar_url)
  VALUES (
    NEW.id, 
    NEW.email, 
    '', 
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''), 
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-------------------------------------------------------------------
-- STORAGE BUCKETS
-------------------------------------------------------------------
-- Note: These statements use the Supabase Storage API which usually requires executing via Supabase Dashboard.
-- We represent them here for completeness so they can be run in the SQL editor.
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('backgrounds', 'backgrounds', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('qr_codes', 'qr_codes', true) ON CONFLICT DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'backgrounds', 'gallery', 'qr_codes'));

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own uploads" ON storage.objects;
CREATE POLICY "Users can update their own uploads" ON storage.objects FOR UPDATE USING (auth.uid() = owner);

DROP POLICY IF EXISTS "Users can delete their own uploads" ON storage.objects;
CREATE POLICY "Users can delete their own uploads" ON storage.objects FOR DELETE USING (auth.uid() = owner);

-------------------------------------------------------------------
-- MIGRATION: Add Missing Columns
-- Run these ALTER TABLE statements if upgrading an existing database.
-- These are safe to run even if columns already exist (uses IF NOT EXISTS).
-------------------------------------------------------------------

-- Add username and display_name to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(200);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Add bio to link_pages table (used by LinkPageRepository)
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add name column to qr_codes for direct storage (replaces image_base64 workaround)
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS name VARCHAR(200);
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS customization JSONB;
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add card_design to nfc_tags table
ALTER TABLE nfc_tags ADD COLUMN IF NOT EXISTS card_design JSONB;

-- Update the handle_new_user trigger to also set username and display_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
BEGIN
  -- Build a default username from email
  v_username := LOWER(SPLIT_PART(NEW.email, '@', 1));
  
  INSERT INTO public.users (id, email, password_hash, first_name, last_name, avatar_url, username, display_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    '', 
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''), 
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', v_username),
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'firstName', v_username)
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
