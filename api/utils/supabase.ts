import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Missing Supabase credentials. Backend requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

// Create a lazy initialized supabase client to prevent Vercel boot crashes
let supabaseClient: any = null;

export const supabase = new Proxy({}, {
  get(target, prop) {
    if (!supabaseClient) {
      if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Missing Supabase credentials: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is empty in Vercel Environment Variables');
      }
      supabaseClient = createClient(
        config.SUPABASE_URL,
        config.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );
    }
    return supabaseClient[prop];
  }
}) as any;
