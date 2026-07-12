import { supabase } from '@/lib/supabase';
import { User } from '@/stores/authStore';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authAPI = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    const user = data.session?.user;
    if (!user) throw new Error('No user returned from Auth');
    const token = data.session?.access_token || '';

    // Fetch user details directly from public.users table instead of /api/auth/me
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError) throw dbError;

    return {
      user: {
        id: userData.id,
        email: userData.email,
        avatar: userData.avatar_url,
        displayName: userData.display_name,
        username: userData.username,
        role: userData.role,
        bio: userData.bio,
        cover: userData.cover,
        theme: userData.theme,
        language: userData.language,
        isSuspended: userData.is_suspended,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at
      } as User,
      token,
    };
  },

  async register(email: string, password: string, username: string): Promise<AuthResponse> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        }
      }
    });

    if (authError) throw authError;

    const user = authData.session?.user;
    if (!user) throw new Error('No user returned from Auth');
    const token = authData.session?.access_token || '';

    // Wait a brief moment for the Supabase Auth trigger to insert the user into public.users
    await new Promise(resolve => setTimeout(resolve, 500));

    // Fetch user details directly from public.users table instead of /api/auth/me
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError) {
      console.error("Backend DB sync failed:", dbError);
      throw new Error('Failed to sync user from database');
    }

    return {
      user: {
        id: userData.id,
        email: userData.email,
        avatar: userData.avatar_url,
        displayName: userData.display_name,
        username: userData.username,
        role: userData.role,
        bio: userData.bio,
        cover: userData.cover,
        theme: userData.theme,
        language: userData.language,
        isSuspended: userData.is_suspended,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at
      } as User,
      token,
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    // Fetch user details directly from public.users table instead of /api/auth/me
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (dbError) throw dbError;

    return { 
      user: {
        id: userData.id,
        email: userData.email,
        avatar: userData.avatar_url,
        displayName: userData.display_name,
        username: userData.username,
        role: userData.role,
        bio: userData.bio,
        cover: userData.cover,
        theme: userData.theme,
        language: userData.language,
        isSuspended: userData.is_suspended,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at
      } as User
    };
  },

  async googleLogin(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) throw error;
  },

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
  },

  async resetPassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');
    
    // Map camelCase User fields back to snake_case DB fields
    const dbUpdates: any = {};
    if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar;
    if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
    if (updates.username !== undefined) dbUpdates.username = updates.username;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.cover !== undefined) dbUpdates.cover = updates.cover;
    if (updates.theme !== undefined) dbUpdates.theme = updates.theme;
    if (updates.language !== undefined) dbUpdates.language = updates.language;

    const { data: userData, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: userData.id,
      email: userData.email,
      avatar: userData.avatar_url,
      displayName: userData.display_name,
      username: userData.username,
      role: userData.role,
      bio: userData.bio,
      cover: userData.cover,
      theme: userData.theme,
      language: userData.language,
      isSuspended: userData.is_suspended,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at
    } as User;
  }
};
