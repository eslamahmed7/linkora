-- Fix missing columns in community_submissions and reload schema cache
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS preview_urls TEXT[] DEFAULT '{}';
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS file_size INTEGER DEFAULT 0;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS file_type TEXT;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0';
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS license TEXT DEFAULT 'free';
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'submitted';
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE community_submissions ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Reload Supabase PostgREST schema cache
NOTIFY pgrst, 'reload schema';
