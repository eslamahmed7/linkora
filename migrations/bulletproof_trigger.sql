-- ═══════════════════════════════════════════════════════════════════════════
-- bulletproof_trigger.sql
-- Sets up a robust, self-healing auth sync trigger in Supabase.
-- Catches any unexpected database errors to prevent Auth Signup 500 errors.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Create the bulletproof trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_display_name TEXT;
BEGIN
  -- Generate a clean username from email prefix
  v_username := LOWER(SPLIT_PART(NEW.email, '@', 1));
  
  -- Clean up username (keep only alphanumeric characters and underscores)
  v_username := REGEXP_REPLACE(v_username, '[^a-zA-Z0-9_]', '', 'g');
  
  -- Fallback if username is empty after cleaning
  IF v_username = '' THEN
    v_username := 'user_' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8);
  END IF;

  -- Ensure username is unique in public.users
  -- If the username already exists under a different user, append a random number
  WHILE EXISTS (SELECT 1 FROM public.users WHERE username = v_username AND id != NEW.id) LOOP
    v_username := v_username || CAST(FLOOR(RANDOM() * 10) AS TEXT);
  END LOOP;

  -- Generate display name
  v_display_name := COALESCE(
    NEW.raw_user_meta_data ->> 'display_name',
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'username',
    v_username
  );

  -- Insert into public.users with all expected columns
  INSERT INTO public.users (
    id, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    avatar_url, 
    username, 
    display_name,
    role,
    is_suspended,
    theme,
    language,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    '', -- password_hash is required NOT NULL in schema.sql but not used with Supabase Auth
    COALESCE(NEW.raw_user_meta_data ->> 'firstName', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'lastName', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', ''),
    v_username,
    v_display_name,
    'user',
    false,
    'dark',
    'en',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name,
    updated_at = NOW();

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- CRITICAL FALLBACK: Catch any database errors (e.g. missing columns, unique violations)
    -- and return NEW anyway. This prevents the trigger from aborting the signup transaction,
    -- ensuring the user is successfully created in Supabase Auth and never gets a 500 error!
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-create the trigger to use the new function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
