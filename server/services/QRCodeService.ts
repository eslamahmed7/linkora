import { QRCode } from '../types/index.js';
import { qrCodeRepository } from '../repositories/QRCodeRepository.js';
import { linkPageRepository } from '../repositories/LinkPageRepository.js';
import { analyticsRepository } from '../repositories/AnalyticsRepository.js';
import { NotFoundError, AuthorizationError } from '../utils/errors.js';
import { config } from '../config/env.js';
import QRCodeLib from 'qrcode';
import crypto from 'crypto';

export class QRCodeService {
  async generateQRCode(
    pageId: string | undefined,
    userId: string,
    options: {
      linkId?: string;
      format: 'png' | 'svg' | 'webp';
      size?: number;
      errorCorrection?: 'L' | 'M' | 'Q' | 'H';
      designStyle?: 'standard' | 'rounded' | 'gradient' | 'custom';
      name?: string;
      url?: string;
      customization?: any;
    }
  ): Promise<QRCode> {
    // Verify ownership
    let targetPageId = pageId;
    if (!targetPageId) {
      const userPages = await linkPageRepository.list(userId, 0, 1);
      if (userPages.pages.length === 0) {
        // Auto-create a default page if they don't have one
        const { linkPageService } = await import('./LinkPageService');
        const newPage = await linkPageService.createPage(userId, {
          title: 'My Link Page',
          description: 'Automatically created for QR Code',
          theme: 'dark'
        });
        targetPageId = newPage.id;
      } else {
        targetPageId = userPages.pages[0].id;
      }
    }

    const page = await linkPageRepository.findById(targetPageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError('You do not own this page');
    }

    // Generate unique code
    const code = this.generateUniqueCode(targetPageId, options.linkId);

    // Generate redirect URL
    const redirectUrl = `${config.QR_REDIRECT_URL}/${code}`;

    // Create QR code record
    try {
      const qrCode = await qrCodeRepository.create({
        pageId: targetPageId,
        linkId: options.linkId,
        code,
        format: options.format,
        size: options.size || 300,
        errorCorrection: options.errorCorrection || 'M',
        designStyle: options.designStyle || 'standard',
        redirectUrl,
        name: options.name,
        url: options.url,
        customization: options.customization,
      });
      return qrCode;
    } catch (error) {
      console.error('Failed to create QR code record in DB:', error);
      throw error;
    }
  }

  async getQRCode(qrCodeId: string): Promise<QRCode> {
    const qrCode = await qrCodeRepository.findById(qrCodeId);
    if (!qrCode) {
      throw new NotFoundError('QRCode');
    }
    return qrCode;
  }

  async getUserQRCodes(userId: string, skip: number = 0, take: number = 10) {
    // Get all page IDs for this user in one query
    const pagesResult = await linkPageRepository.list(userId, 0, 1000);
    const pageIds = pagesResult.pages.map(p => p.id);
    if (pageIds.length === 0) return { qrCodes: [], total: 0 };

    // Fetch all QR codes for all user pages in ONE query using .in()
    const allQrCodes = await qrCodeRepository.listByPageIds(pageIds);

    // In-memory pagination
    const paginated = allQrCodes.slice(skip, skip + take);
    return { qrCodes: paginated, total: allQrCodes.length };
  }

  async getPageQRCodes(pageId: string, userId: string, skip: number = 0, take: number = 10) {
    // Verify ownership
    const page = await linkPageRepository.findById(pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError('You do not own this page');
    }

    return qrCodeRepository.list(pageId, skip, take);
  }

  async updateQRCode(
    qrCodeId: string,
    userId: string,
    updates: Partial<QRCode>
  ): Promise<QRCode> {
    const qrCode = await this.getQRCode(qrCodeId);

    // Verify ownership
    const page = await linkPageRepository.findById(qrCode.pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError('You do not own this QR code');
    }

    if (updates.pageId) {
      const targetPage = await linkPageRepository.findById(updates.pageId);
      if (!targetPage || targetPage.userId !== userId) {
        throw new AuthorizationError('You do not own the target page');
      }
    }

    const updated = await qrCodeRepository.update(qrCodeId, {
      ...updates,
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new NotFoundError('QRCode');
    }

    return updated;
  }

  async toggleQRCode(qrCodeId: string, userId: string): Promise<QRCode> {
    const qrCode = await this.getQRCode(qrCodeId);

    // Verify ownership
    const page = await linkPageRepository.findById(qrCode.pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError('You do not own this QR code');
    }

    const currentIsActive = qrCode.isActive;
    return this.updateQRCode(qrCodeId, userId, { isActive: !currentIsActive });
  }

  async deleteQRCode(qrCodeId: string, userId: string): Promise<void> {
    const qrCode = await this.getQRCode(qrCodeId);

    // Verify ownership
    const page = await linkPageRepository.findById(qrCode.pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError('You do not own this QR code');
    }

    await qrCodeRepository.delete(qrCodeId);
  }

  async resolveQRCode(code: string, metadata: {
    userAgent: string;
    ipAddress: string;
    referer?: string;
  }): Promise<string> {
    const qrCode = await qrCodeRepository.findByCode(code);
    if (!qrCode) {
      throw new NotFoundError('QRCode');
    }

    // Record analytics
    const deviceType = this.detectDeviceType(metadata.userAgent);
    await analyticsRepository.create({
      pageId: qrCode.pageId,
      linkId: qrCode.linkId,
      qrCodeId: qrCode.id,
      type: 'qr_scan',
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
      deviceType,
      referer: metadata.referer,
      timestamp: new Date(),
    });

    // Return target URL
    if (qrCode.linkId) {
      // If linked to a specific link, fetch its URL
      const { linkRepository } = await import('../repositories/LinkRepository.js');
      const link = await linkRepository.findById(qrCode.linkId);
      if (link && link.url) {
        return link.url;
      }
    }

    // Otherwise return page URL by handle
    const page = await linkPageRepository.findById(qrCode.pageId);
    if (page && page.slug) {
      return `/p/${page.slug}`;
    }
    
    return `/p/${qrCode.pageId}`;
  }

  private generateUniqueCode(pageId: string, linkId?: string): string {
    const data = `${pageId}${linkId || ''}${Date.now()}${Math.random()}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash.substring(0, 8);
  }

  private detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
    if (/mobile|android|iphone|ipod/i.test(userAgent)) return 'mobile';
    if (/tablet|ipad/i.test(userAgent)) return 'tablet';
    if (/windows|macintosh|linux/i.test(userAgent)) return 'desktop';
    return 'unknown';
  }
}

export const qrCodeService = new QRCodeService();
