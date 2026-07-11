import { Analytics } from '../types/index';
import { analyticsRepository } from '../repositories/AnalyticsRepository';
import { linkPageRepository } from '../repositories/LinkPageRepository';
import { AuthorizationError, NotFoundError } from '../utils/errors';

export class AnalyticsService {
  async getPageAnalytics(
    pageId: string,
    userId: string,
    skip: number = 0,
    take: number = 100
  ): Promise<{ analytics: Analytics[]; total: number }> {
    // Verify ownership
    const page = await linkPageRepository.findById(pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError('You do not own this page');
    }

    return analyticsRepository.findByPageId(pageId, skip, take);
  }

  async getPageStats(pageId: string, userId: string) {
    // Verify ownership
    const page = await linkPageRepository.findById(pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError('You do not own this page');
    }

    const stats = await analyticsRepository.getStats(pageId);
    const deviceStats = await analyticsRepository.getDeviceStats(pageId);

    return {
      summary: stats,
      devices: deviceStats,
      topReferrers: this.getTopReferrers(pageId),
      topCountries: this.getTopCountries(pageId),
    };
  }

  async recordPageView(
    pageId: string,
    metadata: {
      userAgent: string;
      ipAddress: string;
      referer?: string;
    }
  ): Promise<Analytics> {
    const page = await linkPageRepository.findById(pageId);
    if (!page) {
      throw new NotFoundError('LinkPage');
    }

    const deviceType = this.detectDeviceType(metadata.userAgent);

    return analyticsRepository.create({
      pageId,
      type: 'page_view',
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
      deviceType,
      referer: metadata.referer,
      timestamp: new Date(),
    });
  }

  async recordNFCTap(
    pageId: string,
    metadata: {
      userAgent: string;
      ipAddress: string;
      referer?: string;
    }
  ): Promise<Analytics> {
    const page = await linkPageRepository.findById(pageId);
    if (!page) {
      throw new NotFoundError('LinkPage');
    }

    const deviceType = this.detectDeviceType(metadata.userAgent);

    return analyticsRepository.create({
      pageId,
      type: 'nfc_tap',
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
      deviceType,
      referer: metadata.referer,
      timestamp: new Date(),
    });
  }

  async getTopReferrers(pageId: string, limit: number = 10): Promise<Array<{ referrer: string; count: number }>> {
    const { analytics } = await analyticsRepository.findByPageId(pageId, 0, 10000);
    const referrerCounts: Record<string, number> = {};

    for (const entry of analytics) {
      if (entry.referer) {
        referrerCounts[entry.referer] = (referrerCounts[entry.referer] || 0) + 1;
      }
    }

    return Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  private getTopCountries(pageId: string, limit: number = 10): Array<{ country: string; count: number }> {
    // Placeholder - in production, would use IP geolocation service
    return [];
  }

  private detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
    if (/mobile|android|iphone|ipod/i.test(userAgent)) return 'mobile';
    if (/tablet|ipad/i.test(userAgent)) return 'tablet';
    if (/windows|macintosh|linux/i.test(userAgent)) return 'desktop';
    return 'unknown';
  }

  async getRetentionMetrics(pageId: string, userId: string) {
    // Verify ownership
    const page = await linkPageRepository.findById(pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError('You do not own this page');
    }

    // In production, calculate actual retention metrics
    return {
      dayOneRetention: 0,
      daySevenRetention: 0,
      thirtyDayRetention: 0,
    };
  }
}

export const analyticsService = new AnalyticsService();
