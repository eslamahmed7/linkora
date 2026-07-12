import { QRCode } from '../types/index.js';
import { supabase } from '../utils/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export class QRCodeRepository {
  async create(qrData: Omit<QRCode, 'id' | 'createdAt' | 'updatedAt'>): Promise<QRCode> {
    const id = uuidv4();
    const now = new Date();

    const dbData = {
      id,
      page_id: qrData.pageId,
      link_id: qrData.linkId || null,
      code_data: qrData.code,
      format: qrData.format,
      size: qrData.size,
      error_correction_level: qrData.errorCorrection,
      style: qrData.designStyle,
      logo_url: qrData.customLogo || null,
      color_dark: qrData.customColors?.dark || '#000000',
      color_light: qrData.customColors?.light || '#FFFFFF',
      image_base64: JSON.stringify({
        name: qrData.name || '',
        url: qrData.url || '',
        customization: qrData.customization,
        is_active: qrData.isActive ?? true,
      }),
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    const { data, error } = await supabase
      .from('qr_codes')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create QR code: ${error.message}`);
    }

    return this.mapToQRCode(data, qrData.redirectUrl); // redirectUrl is not in DB schema, we might need to derive it or it might be missing
  }

  async findById(id: string): Promise<QRCode | null> {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToQRCode(data, '');
  }

  async findByPageId(pageId: string): Promise<QRCode[]> {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('page_id', pageId);

    if (error || !data) return [];
    return data.map(d => this.mapToQRCode(d, ''));
  }

  async findByCode(code: string): Promise<QRCode | null> {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('code_data', code)
      .single();

    if (error || !data) return null;
    return this.mapToQRCode(data, '');
  }

  async update(id: string, updates: Partial<QRCode>): Promise<QRCode | null> {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    
    if (updates.format) dbUpdates.format = updates.format;
    if (updates.size) dbUpdates.size = updates.size;
    if (updates.errorCorrection) dbUpdates.error_correction_level = updates.errorCorrection;
    if (updates.designStyle) dbUpdates.style = updates.designStyle;
    if (updates.customLogo !== undefined) dbUpdates.logo_url = updates.customLogo;
    if (updates.customColors?.dark) dbUpdates.color_dark = updates.customColors.dark;
    if (updates.customColors?.light) dbUpdates.color_light = updates.customColors.light;
    if (updates.pageId) dbUpdates.page_id = updates.pageId;
    if (updates.linkId !== undefined) dbUpdates.link_id = updates.linkId;

    if (updates.customization || updates.name || updates.url || updates.isActive !== undefined) {
      // Fetch existing to merge
      const existing = await this.findById(id);
      if (existing) {
        dbUpdates.image_base64 = JSON.stringify({
          name: updates.name ?? existing.name,
          url: updates.url ?? existing.url,
          customization: updates.customization ?? existing.customization,
          is_active: updates.isActive ?? existing.isActive,
        });
      }
    }

    const { data, error } = await supabase
      .from('qr_codes')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return null;
    return this.mapToQRCode(data, updates.redirectUrl || '');
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('qr_codes')
      .delete()
      .eq('id', id);

    return !error;
  }

  async deleteByPageId(pageId: string): Promise<number> {
    const { data, error } = await supabase
      .from('qr_codes')
      .delete()
      .eq('page_id', pageId)
      .select('id');

    if (error) return 0;
    return data ? data.length : 0;
  }

  async list(pageId: string, skip: number = 0, take: number = 10): Promise<{ qrCodes: QRCode[]; total: number }> {
    const [{ data, error }, { count }] = await Promise.all([
      supabase
        .from('qr_codes')
        .select('*')
        .eq('page_id', pageId)
        .range(skip, skip + take - 1),
      supabase
        .from('qr_codes')
        .select('*', { count: 'exact', head: true })
        .eq('page_id', pageId)
    ]);

    if (error || !data) return { qrCodes: [], total: 0 };

    return {
      qrCodes: data.map(d => this.mapToQRCode(d, '')),
      total: count || 0,
    };
  }

  async listByPageIds(pageIds: string[]): Promise<QRCode[]> {
    if (pageIds.length === 0) return [];
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .in('page_id', pageIds)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(d => this.mapToQRCode(d, ''));
  }

  private mapToQRCode(dbQR: any, redirectUrl: string): QRCode {
    let parsedExtras: any = {};
    if (dbQR.image_base64) {
      try { parsedExtras = JSON.parse(dbQR.image_base64); } catch (e) {}
    }
    
    let custom = parsedExtras.customization;
    if (typeof custom === 'string') {
      try { custom = JSON.parse(custom); } catch(e) { custom = {}; }
    }

    return {
      id: dbQR.id,
      pageId: dbQR.page_id,
      linkId: dbQR.link_id || undefined,
      code: dbQR.code_data,
      format: dbQR.format as any,
      size: dbQR.size,
      errorCorrection: dbQR.error_correction_level as any,
      designStyle: dbQR.style as any,
      customLogo: dbQR.logo_url || undefined,
      customColors: {
        dark: dbQR.color_dark || '#000000',
        light: dbQR.color_light || '#FFFFFF',
      },
      redirectUrl, // This was not in DB, returning passed value or empty
      createdAt: new Date(dbQR.created_at),
      updatedAt: new Date(dbQR.updated_at),
      name: parsedExtras.name || '',
      url: parsedExtras.url || '',
      customization: parsedExtras.customization,
      isActive: parsedExtras.is_active ?? true,
      scans: dbQR.scan_count || 0,
    };
  }
}

export const qrCodeRepository = new QRCodeRepository();
