import { Analytics } from '../types/index';
import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';

export class AnalyticsRepository {
  async create(analyticsData: Omit<Analytics, 'id'>): Promise<Analytics> {
    const id = uuidv4();
    
    const dbData = {
      id,
      link_id: analyticsData.linkId || null,
      page_id: analyticsData.pageId,
      qr_code_id: analyticsData.qrCodeId || null,
      event_type: analyticsData.type,
      user_agent: analyticsData.userAgent,
      ip_address: analyticsData.ipAddress,
      country: analyticsData.country || null,
      city: analyticsData.city || null,
      device_type: analyticsData.deviceType,
      referrer_url: analyticsData.referer || null,
      created_at: analyticsData.timestamp.toISOString(),
    };

    const { data, error } = await supabase
      .from('analytics_events')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Failed to create analytics event', error);
      // We don't throw to prevent breaking the main flow for analytics
      return { ...analyticsData, id };
    }

    // Cleanup old records occasionally or in background, here we skip doing it synchronously on every request
    return this.mapToAnalytics(data);
  }

  async findByPageId(pageId: string, skip: number = 0, take: number = 100): Promise<{ analytics: Analytics[]; total: number }> {
    const [{ data, error }, { count }] = await Promise.all([
      supabase
        .from('analytics_events')
        .select('*')
        .eq('page_id', pageId)
        .order('created_at', { ascending: false })
        .range(skip, skip + take - 1),
      supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('page_id', pageId)
    ]);

    if (error || !data) return { analytics: [], total: 0 };

    return {
      analytics: data.map(this.mapToAnalytics),
      total: count || 0,
    };
  }

  async findByLinkId(linkId: string): Promise<Analytics[]> {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('link_id', linkId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapToAnalytics);
  }

  async findByQRCodeId(qrCodeId: string): Promise<Analytics[]> {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('qr_code_id', qrCodeId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapToAnalytics);
  }

  async getStats(pageId: string): Promise<{
    totalViews: number;
    totalClicks: number;
    totalQRScans: number;
    totalNFCTaps: number;
  }> {
    // In a real production app, this would be a GROUP BY query via RPC
    // For simplicity, we can fetch all and count or do 4 separate count queries.
    // Let's do a single count grouped by event_type using RPC if available, or just fetch if small.
    // Assuming we do it the simplest way supported by standard Supabase JS:
    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_type')
      .eq('page_id', pageId);

    if (error || !data) {
      return { totalViews: 0, totalClicks: 0, totalQRScans: 0, totalNFCTaps: 0 };
    }

    return {
      totalViews: data.filter(a => a.event_type === 'page_view').length,
      totalClicks: data.filter(a => a.event_type === 'link_click').length,
      totalQRScans: data.filter(a => a.event_type === 'qr_scan').length,
      totalNFCTaps: data.filter(a => a.event_type === 'nfc_tap').length,
    };
  }

  async getDeviceStats(pageId: string): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('device_type')
      .eq('page_id', pageId);

    const stats: Record<string, number> = {
      mobile: 0,
      tablet: 0,
      desktop: 0,
      unknown: 0,
    };

    if (error || !data) return stats;

    for (const analytics of data) {
      const type = analytics.device_type as keyof typeof stats;
      if (stats[type] !== undefined) {
        stats[type]++;
      } else {
        stats.unknown++;
      }
    }

    return stats;
  }

  async deleteByPageId(pageId: string): Promise<number> {
    const { data, error } = await supabase
      .from('analytics_events')
      .delete()
      .eq('page_id', pageId)
      .select('id');

    if (error) return 0;
    return data ? data.length : 0;
  }

  private mapToAnalytics(dbAnalytics: any): Analytics {
    return {
      id: dbAnalytics.id,
      pageId: dbAnalytics.page_id,
      linkId: dbAnalytics.link_id || undefined,
      qrCodeId: dbAnalytics.qr_code_id || undefined,
      type: dbAnalytics.event_type as any,
      userAgent: dbAnalytics.user_agent || '',
      ipAddress: dbAnalytics.ip_address || '',
      country: dbAnalytics.country || undefined,
      city: dbAnalytics.city || undefined,
      deviceType: dbAnalytics.device_type as any,
      referer: dbAnalytics.referrer_url || undefined,
      timestamp: new Date(dbAnalytics.created_at),
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();
