import { LinkPage } from '../types/index.js';
import { supabase } from '../utils/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export class LinkPageRepository {
  async create(pageData: Omit<LinkPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<LinkPage> {
    const id = uuidv4();
    const now = new Date();

    // Check handle uniqueness
    const { data: existingHandle } = await supabase
      .from('link_pages')
      .select('id')
      .eq('username', pageData.handle.toLowerCase())
      .single();

    if (existingHandle) {
      throw new Error('Handle already taken');
    }

    const dbData = {
      id,
      user_id: pageData.userId,
      username: pageData.handle.toLowerCase(),
      title: pageData.title,
      description: pageData.description || null,
      bio: pageData.bio || null,
      theme: pageData.theme,
      background_color: pageData.customColors?.background || '#000000',
      profile_image_url: pageData.avatar || null,
      design: (pageData as any).design || null,
      is_published: pageData.isPublished,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    const { data, error } = await supabase
      .from('link_pages')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create link page: ${error.message}`);
    }

    return this.mapToLinkPage(data);
  }

  async findById(id: string): Promise<LinkPage | null> {
    const { data, error } = await supabase
      .from('link_pages')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error || !data) return null;
    return this.mapToLinkPage(data);
  }

  async findByHandle(handle: string): Promise<LinkPage | null> {
    const { data, error } = await supabase
      .from('link_pages')
      .select('*')
      .eq('username', handle.toLowerCase())
      .is('deleted_at', null)
      .single();

    if (error || !data) return null;
    return this.mapToLinkPage(data);
  }

  async findByUserId(userId: string): Promise<LinkPage[]> {
    const { data, error } = await supabase
      .from('link_pages')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null);

    if (error || !data) return [];
    return data.map(this.mapToLinkPage);
  }

  async update(id: string, updates: Partial<LinkPage>): Promise<LinkPage | null> {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    
    if (updates.handle !== undefined) dbUpdates.username = updates.handle.toLowerCase();
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.theme !== undefined) dbUpdates.theme = updates.theme;
    if (updates.avatar !== undefined) dbUpdates.profile_image_url = updates.avatar;
    if ((updates as any).design !== undefined) dbUpdates.design = (updates as any).design;
    if (updates.isPublished !== undefined) dbUpdates.is_published = updates.isPublished;
    if (updates.customColors?.background) dbUpdates.background_color = updates.customColors.background;

    const { data, error } = await supabase
      .from('link_pages')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    if (!data) return null;
    return this.mapToLinkPage(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('link_pages')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  }

  async list(userId: string, skip: number = 0, take: number = 10): Promise<{ pages: LinkPage[]; total: number }> {
    const [{ data, error }, { count }] = await Promise.all([
      supabase
        .from('link_pages')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .range(skip, skip + take - 1),
      supabase
        .from('link_pages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .is('deleted_at', null)
    ]);

    if (error || !data) return { pages: [], total: 0 };

    return {
      pages: data.map(this.mapToLinkPage),
      total: count || 0,
    };
  }

  async handleExists(handle: string): Promise<boolean> {
    const { data } = await supabase
      .from('link_pages')
      .select('id')
      .eq('username', handle.toLowerCase())
      .single();
      
    return !!data;
  }

  private mapToLinkPage(dbPage: any): LinkPage {
    return {
      id: dbPage.id,
      userId: dbPage.user_id,
      handle: dbPage.username,
      title: dbPage.title,
      description: dbPage.description || undefined,
      bio: dbPage.bio || undefined,
      theme: dbPage.theme as any,
      customColors: dbPage.background_color ? { 
        primary: '', secondary: '', text: '', background: dbPage.background_color 
      } : undefined,
      avatar: dbPage.profile_image_url || undefined,
      design: dbPage.design || undefined,
      isPublished: dbPage.is_published,
      isNFCEnabled: false,
      createdAt: new Date(dbPage.created_at),
      updatedAt: new Date(dbPage.updated_at),
    };
  }
}

export const linkPageRepository = new LinkPageRepository();
