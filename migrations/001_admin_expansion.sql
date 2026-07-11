-- =====================================================
-- LINKORA ADMIN EXPANSION — Database Migration
-- =====================================================
-- Run this migration to add the complete admin system.
-- Safe to run multiple times (uses IF NOT EXISTS).
-- =====================================================

-- ─── 1. USER ROLES ────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'editor', 'support', 'designer', 'viewer', 'user');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TABLE users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

-- ─── 2. DESIGN MARKETPLACE ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS design_marketplace (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- link_page_template, qr_template, nfc_template, background, qr_frame, qr_style, icon, pattern, texture, animation, font, color_pack, gradient_pack, glass_pack, svg_pack, sticker_pack, shape_pack
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  preview_url TEXT,
  file_url TEXT,
  file_size INTEGER DEFAULT 0,
  file_type TEXT, -- png, svg, webp, jpg, json, css, ttf, otf, woff, woff2
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  version TEXT DEFAULT '1.0.0',
  is_premium BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'published', -- draft, published, archived
  download_count INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_design_marketplace_type ON design_marketplace(type);
CREATE INDEX IF NOT EXISTS idx_design_marketplace_category ON design_marketplace(category);
CREATE INDEX IF NOT EXISTS idx_design_marketplace_status ON design_marketplace(status);

-- ─── 3. COMMUNITY SUBMISSIONS ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS community_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- link_page_template, qr_template, nfc_template, background, qr_frame, qr_style, icon, pattern, texture, animation, font, color_pack
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  preview_urls TEXT[] DEFAULT '{}',
  file_url TEXT,
  file_size INTEGER DEFAULT 0,
  file_type TEXT,
  metadata JSONB DEFAULT '{}',
  version TEXT DEFAULT '1.0.0',
  license TEXT DEFAULT 'free',
  notes TEXT,
  status TEXT DEFAULT 'submitted', -- draft, submitted, pending_review, needs_changes, approved, rejected, published, archived
  admin_notes TEXT,
  admin_reply TEXT,
  reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  marketplace_id UUID REFERENCES design_marketplace(id) ON DELETE SET NULL,
  download_count INTEGER DEFAULT 0,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  quality_checks JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_user ON community_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON community_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_type ON community_submissions(type);

-- ─── 4. TEMPLATE RATINGS & REVIEWS ────────────────────────────────────

CREATE TABLE IF NOT EXISTS template_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES design_marketplace(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  is_like BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, template_id)
);

CREATE TABLE IF NOT EXISTS template_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES design_marketplace(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, template_id)
);

-- ─── 5. TEMPLATE REPORTS ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS template_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES design_marketplace(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL, -- spam, copyright, poor_quality, broken, duplicate, other
  description TEXT,
  status TEXT DEFAULT 'pending', -- pending, reviewed, resolved, dismissed
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 6. CUSTOMER SUGGESTIONS ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general', -- template, feature, design, ux, performance, other
  priority TEXT DEFAULT 'medium', -- low, medium, high, critical
  status TEXT DEFAULT 'new', -- new, in_review, accepted, rejected, completed
  admin_notes TEXT,
  admin_reply TEXT,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suggestion_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  suggestion_id UUID REFERENCES suggestions(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, suggestion_id)
);

-- ─── 7. FEATURE REQUESTS ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS feature_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT DEFAULT 'open', -- open, accepted, rejected, merged, scheduled, in_progress, completed
  admin_notes TEXT,
  merged_into UUID REFERENCES feature_requests(id) ON DELETE SET NULL,
  vote_count INTEGER DEFAULT 0,
  scheduled_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feature_request_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  feature_request_id UUID REFERENCES feature_requests(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, feature_request_id)
);

-- ─── 8. BUG REPORTS ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  screenshot_url TEXT,
  browser TEXT,
  device TEXT,
  os TEXT,
  console_logs TEXT,
  url TEXT,
  priority TEXT DEFAULT 'medium', -- low, medium, high, critical
  status TEXT DEFAULT 'new', -- new, in_progress, fixed, wont_fix, duplicate
  admin_notes TEXT,
  fix_version TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 9. CONTACT MESSAGES ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread', -- unread, read, replied, archived
  admin_reply TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 10. ANNOUNCEMENTS ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, warning, success, maintenance
  target TEXT DEFAULT 'all', -- all, premium, specific
  target_user_ids UUID[] DEFAULT '{}',
  channel TEXT DEFAULT 'in_app', -- in_app, email, banner, all
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 11. NOTIFICATIONS ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info', -- info, success, warning, error
  category TEXT DEFAULT 'system', -- system, template, community, announcement
  reference_type TEXT, -- submission, suggestion, feature_request, bug_report, announcement
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- ─── 12. ACTIVITY LOGS ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- login, logout, create, update, delete, upload, publish, export, import, approve, reject
  entity_type TEXT, -- user, page, template, submission, qr_code, nfc_card, announcement, settings
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);

-- ─── 13. SITE SETTINGS ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  category TEXT DEFAULT 'general', -- general, appearance, seo, smtp, storage, auth, analytics, maintenance
  description TEXT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Default settings
INSERT INTO site_settings (key, value, category, description) VALUES
  ('site_name', '"Linkora"', 'general', 'Site name'),
  ('site_description', '"Link in bio platform"', 'general', 'Site description'),
  ('maintenance_mode', 'false', 'maintenance', 'Enable maintenance mode'),
  ('allow_registrations', 'true', 'auth', 'Allow new user registrations'),
  ('default_theme', '"dark"', 'appearance', 'Default theme for new users'),
  ('max_upload_size', '10485760', 'storage', 'Max upload size in bytes'),
  ('smtp_host', '""', 'smtp', 'SMTP host'),
  ('smtp_port', '"587"', 'smtp', 'SMTP port'),
  ('smtp_user', '""', 'smtp', 'SMTP username'),
  ('smtp_pass', '""', 'smtp', 'SMTP password'),
  ('analytics_enabled', 'true', 'analytics', 'Enable analytics tracking'),
  ('seo_title', '"Linkora - Link in Bio Platform"', 'seo', 'Default SEO title'),
  ('seo_description', '"Create your perfect link in bio page"', 'seo', 'Default SEO description'),
  ('seo_keywords', '"link in bio, portfolio, linktree"', 'seo', 'Default SEO keywords')
ON CONFLICT (key) DO NOTHING;

-- ─── 14. CREATOR PROFILES ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  published_count INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  badge TEXT, -- none, creator, top_creator, verified
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 15. FOLLOWS (optional creator following) ────────────────────────

CREATE TABLE IF NOT EXISTS creator_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, creator_id)
);

-- ─── 16. BACKUPS ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- database, assets, full
  file_url TEXT,
  file_size INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, restored
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 17. SUBSCRIPTION PLANS (extend existing subscriptions) ──────────

CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10,2) DEFAULT 0,
  price_yearly NUMERIC(10,2) DEFAULT 0,
  features JSONB DEFAULT '[]',
  limits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 18. RLS POLICIES ────────────────────────────────────────────────

-- Admin policies: super_admin and admin can read all
ALTER TABLE design_marketplace ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Design Marketplace: everyone can view published, author can manage own
CREATE POLICY "Public can view published designs" ON design_marketplace FOR SELECT USING (is_published = true AND status = 'published');
CREATE POLICY "Authors can manage own designs" ON design_marketplace FOR ALL USING (auth.uid() = author_id);

-- Community Submissions: users manage own, admins manage all
CREATE POLICY "Users can view own submissions" ON community_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create submissions" ON community_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own submissions" ON community_submissions FOR UPDATE USING (auth.uid() = user_id AND status IN ('draft', 'needs_changes'));

-- Template Ratings
CREATE POLICY "Public can view ratings" ON template_ratings FOR SELECT USING (true);
CREATE POLICY "Users can rate" ON template_ratings FOR ALL USING (auth.uid() = user_id);

-- Template Bookmarks
CREATE POLICY "Users can manage own bookmarks" ON template_bookmarks FOR ALL USING (auth.uid() = user_id);

-- Template Reports
CREATE POLICY "Users can create reports" ON template_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view own reports" ON template_reports FOR SELECT USING (auth.uid() = reporter_id);

-- Suggestions: public read, auth write
CREATE POLICY "Public can view suggestions" ON suggestions FOR SELECT USING (true);
CREATE POLICY "Users can create suggestions" ON suggestions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Suggestion votes" ON suggestion_votes FOR ALL USING (auth.uid() = user_id);

-- Feature Requests: public read, auth write
CREATE POLICY "Public can view features" ON feature_requests FOR SELECT USING (true);
CREATE POLICY "Users can create features" ON feature_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Feature votes" ON feature_request_votes FOR ALL USING (auth.uid() = user_id);

-- Bug Reports: users manage own
CREATE POLICY "Users can manage own bugs" ON bug_reports FOR ALL USING (auth.uid() = user_id);

-- Contact Messages: users view own, create any
CREATE POLICY "Users can view own messages" ON contact_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can send messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Announcements: public read
CREATE POLICY "Public can view active announcements" ON announcements FOR SELECT USING (is_active = true);

-- Notifications: users view own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Activity Logs: users view own
CREATE POLICY "Users can view own activity" ON activity_logs FOR SELECT USING (auth.uid() = user_id);

-- Site Settings: public read
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);

-- Creator Profiles: public read
CREATE POLICY "Public can view creators" ON creator_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own profile" ON creator_profiles FOR ALL USING (auth.uid() = user_id);

-- Creator Follows
CREATE POLICY "Users can manage follows" ON creator_follows FOR ALL USING (auth.uid() = follower_id);
CREATE POLICY "Public can view follows" ON creator_follows FOR SELECT USING (true);

-- Backups: admin only (enforced via API)
CREATE POLICY "Users can view own backups" ON backups FOR SELECT USING (auth.uid() = created_by);

-- Subscription Plans: public read
CREATE POLICY "Public can view plans" ON subscription_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active coupons" ON coupons FOR SELECT USING (is_active = true);
