import { Router, Request, Response } from 'express';
import { linkService } from '../services/LinkService.js';
import { validateLinkCreate } from '../utils/validators.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { authenticateToken, asyncHandler } from '../middleware/auth.js';

const router = Router();

// Create link
router.post('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const { pageId, ...linkData } = req.body;
  const data = validateLinkCreate(linkData);
  
  const link = await linkService.createLink(pageId, req.user.userId, data);
  sendSuccess(res, link, 201);
}));

// Get page links
router.get('/page/:pageId', asyncHandler(async (req: Request, res: Response) => {
  const links = await linkService.getPageLinks(req.params.pageId);
  sendSuccess(res, links);
}));

// Update link
router.put('/:linkId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const { title, url, description, icon, isActive } = req.body;
  const link = await linkService.updateLink(req.params.linkId, req.user.userId, {
    title,
    url,
    description,
    icon,
    isActive,
  });

  sendSuccess(res, link);
}));

// Reorder links
router.post('/:pageId/reorder', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const { links } = req.body;
  if (!Array.isArray(links)) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'links must be an array');
  }

  const updated = await linkService.reorderLinks(req.params.pageId, req.user.userId, links);
  sendSuccess(res, updated);
}));

// Toggle link active status
router.post('/:linkId/toggle', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const link = await linkService.toggleLink(req.params.linkId, req.user.userId);
  sendSuccess(res, link);
}));

// Delete link
router.delete('/:linkId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  await linkService.deleteLink(req.params.linkId, req.user.userId);
  sendSuccess(res, { message: 'Link deleted successfully' });
}));

// Record link click (public)
router.post('/:linkId/click', asyncHandler(async (req: Request, res: Response) => {
  const link = await linkService.recordLinkClick(req.params.linkId, {
    userAgent: req.metadata?.userAgent || 'unknown',
    ipAddress: req.metadata?.ipAddress || 'unknown',
    referer: req.get('referer'),
  });

  sendSuccess(res, link);
}));

export default router;
