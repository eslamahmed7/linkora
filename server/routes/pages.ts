import { Router, Request, Response } from 'express';
import { linkPageService } from '../services/LinkPageService';
import { linkRepository } from '../repositories/LinkRepository';
import { validateLinkPageCreate } from '../utils/validators';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { authenticateToken, asyncHandler, optionalAuth } from '../middleware/auth';

const router = Router();

// Create page
router.post('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const data = validateLinkPageCreate(req.body);
  const page = await linkPageService.createPage(req.user.userId, data);
  sendSuccess(res, page, 201);
}));

// Get user's pages
router.get('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const skip = parseInt(req.query.skip as string) || 0;
  const take = Math.min(parseInt(req.query.take as string) || 10, 100);
  
  const result = await linkPageService.getUserPages(req.user.userId, skip, take);
  sendPaginated(res, result.pages, result.total, Math.floor(skip / take) + 1, take);
}));

// Get page by handle (public)
router.get('/handle/:handle', optionalAuth, asyncHandler(async (req: Request, res: Response) => {
  const page = await linkPageService.getPageByHandle(req.params.handle);
  
  // Hide unpublished pages unless owner
  if (!page.isPublished && (!req.user || page.userId !== req.user.userId)) {
    return sendError(res, 404, 'NOT_FOUND', 'Page not found');
  }

  const links = await linkRepository.findByPageId(page.id);

  sendSuccess(res, { ...page, links });
}));

// Get page by ID
router.get('/:pageId', optionalAuth, asyncHandler(async (req: Request, res: Response) => {
  const page = await linkPageService.getPage(req.params.pageId);

  // Hide unpublished pages unless owner
  if (!page.isPublished && (!req.user || page.userId !== req.user.userId)) {
    return sendError(res, 404, 'NOT_FOUND', 'Page not found');
  }

  const links = await linkRepository.findByPageId(page.id);

  sendSuccess(res, { ...page, links });
}));

// Update page
router.put('/:pageId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const { title, description, bio, theme, customColors, avatar, bannerImage, socialLinks, design, links, slug } = req.body;
  const page = await linkPageService.updatePage(req.params.pageId, req.user.userId, {
    handle: slug,
    title,
    description,
    bio,
    theme,
    customColors,
    avatar,
    bannerImage,
    socialLinks,
    design,
  });

  // Update links
  if (links && Array.isArray(links)) {
    await linkRepository.deleteByPageId(req.params.pageId);
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      await linkRepository.create({
        pageId: req.params.pageId,
        title: link.title,
        url: link.url,
        icon: link.icon,
        color: link.color,
        isActive: link.isActive !== false,
        order: link.order ?? i,
        clicks: link.clicks || 0,
      });
    }
  }

  sendSuccess(res, page);
}));

// Publish page
router.post('/:pageId/publish', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const page = await linkPageService.publishPage(req.params.pageId, req.user.userId);
  sendSuccess(res, page);
}));

// Unpublish page
router.post('/:pageId/unpublish', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const page = await linkPageService.unpublishPage(req.params.pageId, req.user.userId);
  sendSuccess(res, page);
}));

// Get page stats
router.get('/:pageId/stats', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const stats = await linkPageService.getPageStats(req.params.pageId, req.user.userId);
  sendSuccess(res, stats);
}));

// Delete page
router.delete('/:pageId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  await linkPageService.deletePage(req.params.pageId, req.user.userId);
  sendSuccess(res, { message: 'Page deleted successfully' });
}));

export default router;
