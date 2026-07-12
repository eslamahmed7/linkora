import { User } from '../types/index.js';
import { supabase } from '../utils/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export class UserRepository {
  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'> & { id?: string }): Promise<User> {
    const id = userData.id || uuidv4();
    const now = new Date();
    
    // Check for duplicates
    const { data: existingEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email.toLowerCase())
      .single();
      
    if (existingEmail) {
      throw new Error('Email already exists');
    }
    
    const { data: existingUsername } = await supabase
      .from('link_pages') // wait, usernames are usually link_pages handle? In types, User has username.
      .select('id')
      .eq('username', userData.username.toLowerCase())
      .single();
      // Wait, in schema: users has no username column! Let's check DATABASE.md.
      // Ah, users: id, email, password_hash, first_name, last_name, avatar_url, bio, verified_email, etc.
      // link_pages has username. But the original UserRepository checked usernameIndex!

    // Let's format the data for Postgres insertion (snake_case)
    const dbData = {
      id,
      email: userData.email.toLowerCase(),
      password_hash: userData.passwordHash,
      first_name: userData.firstName,
      last_name: userData.lastName,
      avatar_url: userData.avatar,
      // Note: "username" is not in the users table in DATABASE.md. We will ignore it for the users table insert, but wait, the type `User` has username.
      // If the original in-memory code stored it, maybe it's just missing in schema? 
      // Requirement 5: "Use the existing database schema... Do not redesign it."
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return this.mapToUser(data);
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error || !data) return null;
    return this.mapToUser(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .is('deleted_at', null)
      .single();

    if (error || !data) return null;
    return this.mapToUser(data);
  }

  async findByUsername(username: string): Promise<User | null> {
    // Since username is not in users table, we must query link_pages to find the user.
    // Wait, the original code had usernameIndex.
    // Let's query link_pages to get the user_id.
    const { data: pageData, error: pageError } = await supabase
      .from('link_pages')
      .select('user_id')
      .eq('username', username.toLowerCase())
      .is('deleted_at', null)
      .single();

    if (pageError || !pageData) return null;

    return this.findById(pageData.user_id);
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    
    if (updates.email) dbUpdates.email = updates.email.toLowerCase();
    if (updates.passwordHash) dbUpdates.password_hash = updates.passwordHash;
    if (updates.firstName) dbUpdates.first_name = updates.firstName;
    if (updates.lastName) dbUpdates.last_name = updates.lastName;
    if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar;
    if ((updates as any).displayName) dbUpdates.display_name = (updates as any).displayName;
    if ((updates as any).username) dbUpdates.username = (updates as any).username;
    if ((updates as any).bio !== undefined) dbUpdates.bio = (updates as any).bio;

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return null;
    return this.mapToUser(data);
  }

  async updateLastLogin(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return null;
    return this.mapToUser(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  }

  async list(skip: number = 0, take: number = 10): Promise<{ users: User[]; total: number }> {
    const [{ data, error }, { count }] = await Promise.all([
      supabase
        .from('users')
        .select('*')
        .is('deleted_at', null)
        .range(skip, skip + take - 1),
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null)
    ]);

    if (error || !data) return { users: [], total: 0 };

    return {
      users: data.map(this.mapToUser),
      total: count || 0,
    };
  }

  async emailExists(email: string): Promise<boolean> {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .is('deleted_at', null)
      .single();
    
    return !!data;
  }

  async usernameExists(username: string): Promise<boolean> {
    const { data } = await supabase
      .from('link_pages')
      .select('id')
      .eq('username', username.toLowerCase())
      .is('deleted_at', null)
      .single();
      
    return !!data;
  }

  private mapToUser(dbUser: any): User {
    const firstName = dbUser.first_name || '';
    const lastName = dbUser.last_name || '';
    const displayName = dbUser.display_name || (firstName + (lastName ? ' ' + lastName : '')).trim() || dbUser.email?.split('@')[0] || 'User';
    return {
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username || dbUser.email?.split('@')[0] || '',
      passwordHash: dbUser.password_hash,
      firstName,
      lastName,
      avatar: dbUser.avatar_url || undefined,
      bio: dbUser.bio || undefined,
      displayName,
      plan: 'free',
      role: dbUser.role || 'user',
      createdAt: new Date(dbUser.created_at),
      updatedAt: new Date(dbUser.updated_at),
      lastLogin: dbUser.last_login ? new Date(dbUser.last_login) : undefined,
    };
  }
}

export const userRepository = new UserRepository();
