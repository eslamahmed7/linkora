import { NFCCard, CardDesign } from '../types/index';
import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';

export class NFCRepository {
  async create(cardData: Omit<NFCCard, 'id' | 'createdAt' | 'updatedAt'>): Promise<NFCCard> {
    const id = uuidv4();
    const now = new Date();

    const dbData = {
      id,
      page_id: cardData.pageId ? cardData.pageId : null,
      link_id: null,
      nfc_id: cardData.title || id,
      nfc_uri: cardData.description || '',
      nfc_type: 'card',
      is_active: cardData.isActive ?? true,
      scan_count: 0,
      card_design: cardData.cardDesign ? JSON.stringify(cardData.cardDesign) : null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    console.log('Inserting NFC with dbData:', JSON.stringify(dbData));

    const { data, error } = await supabase
      .from('nfc_tags')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create NFC card: ${error.message}`);
    }

    return this.mapToNFCCard(data);
  }

  async findById(id: string): Promise<NFCCard | null> {
    const { data, error } = await supabase
      .from('nfc_tags')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToNFCCard(data);
  }

  async findByUserId(userId: string): Promise<NFCCard[]> {
    const { data: pages } = await supabase
      .from('link_pages')
      .select('id')
      .eq('user_id', userId);
      
    if (!pages || pages.length === 0) return [];
    
    const pageIds = pages.map(p => p.id);
    const { data, error } = await supabase
      .from('nfc_tags')
      .select('*')
      .in('page_id', pageIds);

    if (error || !data) return [];
    return data.map(d => this.mapToNFCCard(d, userId));
  }

  async update(id: string, updates: Partial<NFCCard>): Promise<NFCCard | null> {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    
    if (updates.title !== undefined) dbUpdates.nfc_id = updates.title;
    if (updates.description !== undefined) dbUpdates.nfc_uri = updates.description || '';
    if (updates.tagId !== undefined) dbUpdates.nfc_type = updates.tagId;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.cardDesign !== undefined) {
      dbUpdates.card_design = updates.cardDesign ? JSON.stringify(updates.cardDesign) : null;
    }

    const { data, error } = await supabase
      .from('nfc_tags')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return null;
    return this.mapToNFCCard(data);
  }

  async saveDesign(id: string, cardDesign: CardDesign): Promise<NFCCard | null> {
    const { data, error } = await supabase
      .from('nfc_tags')
      .update({
        card_design: JSON.stringify(cardDesign),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return null;
    return this.mapToNFCCard(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('nfc_tags')
      .delete()
      .eq('id', id);

    return !error;
  }

  async deleteByPageId(pageId: string): Promise<number> {
    const { data, error } = await supabase
      .from('nfc_tags')
      .delete()
      .eq('page_id', pageId)
      .select('id');

    if (error) return 0;
    return data ? data.length : 0;
  }

  private mapToNFCCard(dbCard: any, userId?: string): NFCCard {
    let cardDesign: CardDesign | undefined;
    if (dbCard.card_design) {
      try {
        cardDesign = typeof dbCard.card_design === 'string'
          ? JSON.parse(dbCard.card_design)
          : dbCard.card_design;
      } catch {
        cardDesign = undefined;
      }
    }

    return {
      id: dbCard.id,
      userId: userId || '',
      pageId: dbCard.page_id || '',
      title: dbCard.nfc_id,
      description: dbCard.nfc_uri,
      tagId: dbCard.nfc_type !== 'card' ? dbCard.nfc_type : undefined,
      isActive: dbCard.is_active,
      cardDesign,
      createdAt: new Date(dbCard.created_at),
      updatedAt: new Date(dbCard.updated_at),
    };
  }
}

export const nfcRepository = new NFCRepository();
