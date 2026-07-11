import { Link } from '../types/index';
import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';

export class LinkRepository {
  async create(linkData: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>): Promise<Link> {
    const id = uuidv4();
    const now = new Date();

    const dbData = {
      id,
      page_id: linkData.pageId,
      title: linkData.title,
      url: linkData.url,
      description: linkData.description || null,
      icon_url: linkData.icon || null,
      color: linkData.color || null,
      is_active: linkData.isActive,
      display_order: linkData.order,
      click_count: linkData.clicks,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    const { data, error } = await supabase
      .from('links')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create link: ${error.message}`);
    }

    return this.mapToLink(data);
  }

  async findById(id: string): Promise<Link | null> {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error || !data) return null;
    return this.mapToLink(data);
  }

  async findByPageId(pageId: string): Promise<Link[]> {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('page_id', pageId)
      .is('deleted_at', null)
      .order('display_order', { ascending: true });

    if (error || !data) return [];
    return data.map(this.mapToLink);
  }

  async update(id: string, updates: Partial<Link>): Promise<Link | null> {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.url !== undefined) dbUpdates.url = updates.url;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.icon !== undefined) dbUpdates.icon_url = updates.icon;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.order !== undefined) dbUpdates.display_order = updates.order;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.clicks !== undefined) dbUpdates.click_count = updates.clicks;

    const { data, error } = await supabase
      .from('links')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return null;
    return this.mapToLink(data);
  }

  async incrementClicks(id: string): Promise<Link | null> {
    // using rpc would be better, but we can do a read and update or a postgres specific logic
    // for simplicity, we'll read then update.
    const link = await this.findById(id);
    if (!link) return null;
    return this.update(id, { clicks: link.clicks + 1 });
  }

  async reorder(pageId: string, links: { id: string; order: number }[]): Promise<Link[]> {
    // Note: A single bulk update would be better, but iterating is fine for now
    const updatedLinks: Link[] = [];
    for (const { id, order } of links) {
      const link = await this.update(id, { order });
      if (link) updatedLinks.push(link);
    }
    return updatedLinks;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('links')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  }

  async deleteByPageId(pageId: string): Promise<number> {
    const { data, error } = await supabase
      .from('links')
      .update({ deleted_at: new Date().toISOString() })
      .eq('page_id', pageId)
      .is('deleted_at', null)
      .select('id');

    if (error) return 0;
    return data ? data.length : 0;
  }

  private mapToLink(dbLink: any): Link {
    return {
      id: dbLink.id,
      pageId: dbLink.page_id,
      title: dbLink.title,
      url: dbLink.url,
      description: dbLink.description || undefined,
      icon: dbLink.icon_url || undefined,
      color: dbLink.color || undefined,
      order: dbLink.display_order,
      clicks: dbLink.click_count || 0,
      isActive: dbLink.is_active,
      createdAt: new Date(dbLink.created_at),
      updatedAt: new Date(dbLink.updated_at),
    };
  }
}

export const linkRepository = new LinkRepository();
