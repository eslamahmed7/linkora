import { supabase } from '@/lib/supabase';
import { User } from '@/stores/authStore';
import { apiClient } from './client';

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
    
    const token = data.session?.access_token || '';
    
    const response = await apiClient.get<User>('/auth/me');
    
    return {
      user: response.data!,
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

    const token = authData.session?.access_token || '';

    // Wait a brief moment for the Supabase Auth trigger to insert the user into public.users
    await new Promise(resolve => setTimeout(resolve, 500));

    const response = await apiClient.get<User>('/auth/me');

    if (!response.success) {
      console.error("Backend sync failed:", response);
      throw new Error(response.message || response.error || 'Failed to sync user from database');
    }

    return {
      user: response.data!,
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

    const response = await apiClient.get<User>('/auth/me');
    return { user: response.data! };
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
    
    const response = await apiClient.put<User>('/auth/profile', updates);
    return response.data!;
  }
};
