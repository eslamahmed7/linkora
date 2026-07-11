import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Missing Supabase credentials. Backend requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

// Create a single supabase client for interacting with your database
// Note: This uses the SERVICE_ROLE key, which bypasses Row Level Security (RLS).
// This is appropriate for backend services acting on behalf of the application,
// but all authorization must be handled by the application logic (Service layer).
export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
