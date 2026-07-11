import { Link } from '../types/index';
import { linkRepository } from '../repositories/LinkRepository';
import { linkPageRepository } from '../repositories/LinkPageRepository';
import { analyticsRepository } from '../repositories/AnalyticsRepository';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { linkPageService } from './LinkPageService';

export class LinkService {
  async createLink(
    pageId: string,
    userId: string,
    linkData: {
      title: string;
      url: string;
      description?: string;
      icon?: string;
    }
  ): Promise<Link> {
    // Verify page ownership
    const page = await linkPageRepository.findById(pageId);
    if (!page) {
      throw new NotFoundError('LinkPage');
    }
    if (page.userId !== userId) {
      throw new AuthorizationError('You do not own this page');
    }

    // Get current max order
    const pageLinks = await linkRepository.findByPageId(pageId);
    const maxOrder = pageLinks.length > 0 ? Math.max(...pageLinks.map(l => l.order)) : -1;

    return linkRepository.create({
      pageId,
      title: linkData.title,
      url: linkData.url,
      description: linkData.description,
      icon: linkData.icon,
      order: maxOrder + 1,
      clicks: 0,
      isActive: true,
    });
  }

  async getLink(linkId: string): Promise<Link> {
    const link = await linkRepository.findById(linkId);
    if (!link) {
      throw new NotFoundError('Link');
    }
    return link;
  }

  async getPageLinks(pageId: string): Promise<Link[]> {
    return linkRepository.findByPageId(pageId);
  }

  async updateLink(
    linkId: string,
    userId: string,
    updates: Partial<Link>
  ): Promise<Link> {
    const link = await this.getLink(linkId);

    // Verify ownership through page
    const page = await linkPageRepository.findById(link.pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError('You do not own this link');
    }

    const updated = await linkRepository.update(linkId, updates);
    if (!updated) {
      throw new NotFoundError('Link');
    }

    return updated;
  }

  async reorderLinks(
    pageId: string,
    userId: string,
    links: { id: string; order: number }[]
  ): Promise<Link[]> {
    // Verify ownership
    const page = await linkPageRepository.findById(pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError('You do not own this page');
    }

    return linkRepository.reorder(pageId, links);
  }

  async toggleLink(linkId: string, userId: string): Promise<Link> {
    const link = await this.getLink(linkId);

    // Verify ownership
    const page = await linkPageRepository.findById(link.pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError('You do not own this link');
    }

    const updated = await linkRepository.update(linkId, {
      isActive: !link.isActive,
    });

    if (!updated) {
      throw new NotFoundError('Link');
    }

    return updated;
  }

  async deleteLink(linkId: string, userId: string): Promise<void> {
    const link = await this.getLink(linkId);

    // Verify ownership
    const page = await linkPageRepository.findById(link.pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError('You do not own this link');
    }

    // Delete analytics
    const analytics = await analyticsRepository.findByLinkId(linkId);
    for (const entry of analytics) {
      // In production, bulk delete
    }

    await linkRepository.delete(linkId);
  }

  async recordLinkClick(linkId: string, metadata: {
    userAgent: string;
    ipAddress: string;
    referer?: string;
  }): Promise<Link> {
    const link = await this.getLink(linkId);

    // Increment clicks
    const updated = await linkRepository.incrementClicks(linkId);

    // Record analytics
    const page = await linkPageRepository.findById(link.pageId);
    if (page) {
      const deviceType = this.detectDeviceType(metadata.userAgent);
      await analyticsRepository.create({
        pageId: link.pageId,
        linkId,
        type: 'link_click',
        userAgent: metadata.userAgent,
        ipAddress: metadata.ipAddress,
        deviceType,
        referer: metadata.referer,
        timestamp: new Date(),
      });
    }

    return updated || link;
  }

  private detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
    if (/mobile|android|iphone|ipod/i.test(userAgent)) return 'mobile';
    if (/tablet|ipad/i.test(userAgent)) return 'tablet';
    if (/windows|macintosh|linux/i.test(userAgent)) return 'desktop';
    return 'unknown';
  }
}

export const linkService = new LinkService();
