import { LinkPage } from '../types/index.js';
import { linkPageRepository } from '../repositories/LinkPageRepository.js';
import { linkRepository } from '../repositories/LinkRepository.js';
import { qrCodeRepository } from '../repositories/QRCodeRepository.js';
import { analyticsRepository } from '../repositories/AnalyticsRepository.js';
import { nfcRepository } from '../repositories/NFCRepository.js';
import { NotFoundError, AuthorizationError, ConflictError } from '../utils/errors.js';

export class LinkPageService {
  async createPage(
    userId: string,
    pageData: {
      handle?: string;
      title: string;
      description?: string;
      bio?: string;
      theme?: 'light' | 'dark' | 'custom';
    }
  ): Promise<LinkPage> {
    const finalHandle = pageData.handle ? pageData.handle.toLowerCase() : Math.random().toString(36).substring(2, 8);

    // Check handle availability
    if (pageData.handle && await linkPageRepository.handleExists(finalHandle)) {
      throw new ConflictError('Handle already taken');
    }

    try {
      return await linkPageRepository.create({
        userId,
        handle: finalHandle,
        title: pageData.title,
        description: pageData.description,
        bio: pageData.bio,
        theme: pageData.theme || 'dark',
        isPublished: true,
        isNFCEnabled: false,
      });
    } catch (error) {
      console.error('Failed to create page in DB:', error);
      throw error;
    }
  }

  async getPage(pageId: string): Promise<LinkPage> {
    const page = await linkPageRepository.findById(pageId);
    if (!page) {
      throw new NotFoundError('LinkPage');
    }
    return page;
  }

  async getPageByHandle(handle: string): Promise<LinkPage> {
    const page = await linkPageRepository.findByHandle(handle);
    if (!page) {
      throw new NotFoundError('LinkPage');
    }
    return page;
  }

  async getUserPages(userId: string, skip: number = 0, take: number = 10) {
    return linkPageRepository.list(userId, skip, take);
  }

  async updatePage(
    pageId: string,
    userId: string,
    updates: Partial<LinkPage>
  ): Promise<LinkPage> {
    const page = await this.getPage(pageId);

    // Verify ownership
    if (page.userId !== userId) {
      throw new AuthorizationError('You do not own this page');
    }

    // If handle is being changed, check availability
    if (updates.handle && updates.handle !== page.handle) {
      if (await linkPageRepository.handleExists(updates.handle)) {
        throw new ConflictError('Handle already taken');
      }
    }

    try {
      const updated = await linkPageRepository.update(pageId, {
        ...updates,
        handle: updates.handle?.toLowerCase() || page.handle,
        updatedAt: new Date(),
      });

      if (!updated) {
        throw new NotFoundError('Page');
      }

      return updated;
    } catch (error) {
      console.error('Failed to update page in DB:', error);
      throw error;
    }
  }

  async publishPage(pageId: string, userId: string): Promise<LinkPage> {
    const page = await this.getPage(pageId);

    if (page.userId !== userId) {
      throw new AuthorizationError('You do not own this page');
    }

    return this.updatePage(pageId, userId, { isPublished: true });
  }

  async unpublishPage(pageId: string, userId: string): Promise<LinkPage> {
    const page = await this.getPage(pageId);

    if (page.userId !== userId) {
      throw new AuthorizationError('You do not own this page');
    }

    return this.updatePage(pageId, userId, { isPublished: false });
  }

  async deletePage(pageId: string, userId: string): Promise<void> {
    const page = await this.getPage(pageId);

    if (page.userId !== userId) {
      throw new AuthorizationError('You do not own this page');
    }

    // Delete associated links
    await linkRepository.deleteByPageId(pageId);

    // Delete associated QR codes
    await qrCodeRepository.deleteByPageId(pageId);

    // Delete associated analytics
    await analyticsRepository.deleteByPageId(pageId);

    // Delete associated NFC tags
    await nfcRepository.deleteByPageId(pageId);

    // Delete page
    await linkPageRepository.delete(pageId);
  }

  async getPageStats(pageId: string, userId: string) {
    const page = await this.getPage(pageId);

    if (page.userId !== userId) {
      throw new AuthorizationError('You do not own this page');
    }

    const stats = await analyticsRepository.getStats(pageId);
    const deviceStats = await analyticsRepository.getDeviceStats(pageId);

    return {
      ...stats,
      devices: deviceStats,
    };
  }
}

export const linkPageService = new LinkPageService();
