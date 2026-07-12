import { Router, Request, Response } from 'express';
import { analyticsService } from '../services/AnalyticsService.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import { authenticateToken, asyncHandler } from '../middleware/auth.js';

const router = Router();

// Get page analytics
router.get('/page/:pageId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const skip = parseInt(req.query.skip as string) || 0;
  const take = Math.min(parseInt(req.query.take as string) || 100, 500);
  
  const result = await analyticsService.getPageAnalytics(
    req.params.pageId,
    req.user.userId,
    skip,
    take
  );

  sendPaginated(res, result.analytics, result.total, Math.floor(skip / take) + 1, take);
}));

// Get page stats
router.get('/page/:pageId/stats', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const stats = await analyticsService.getPageStats(req.params.pageId, req.user.userId);
  sendSuccess(res, stats);
}));

// Get retention metrics
router.get('/page/:pageId/retention', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const metrics = await analyticsService.getRetentionMetrics(req.params.pageId, req.user.userId);
  sendSuccess(res, metrics);
}));

// Record page view (public)
router.post('/page/:pageId/view', asyncHandler(async (req: Request, res: Response) => {
  const analytics = await analyticsService.recordPageView(req.params.pageId, {
    userAgent: req.metadata?.userAgent || 'unknown',
    ipAddress: req.metadata?.ipAddress || 'unknown',
    referer: req.get('referer'),
  });

  sendSuccess(res, analytics, 201);
}));

// Record NFC tap (public)
router.post('/page/:pageId/nfc-tap', asyncHandler(async (req: Request, res: Response) => {
  const analytics = await analyticsService.recordNFCTap(req.params.pageId, {
    userAgent: req.metadata?.userAgent || 'unknown',
    ipAddress: req.metadata?.ipAddress || 'unknown',
    referer: req.get('referer'),
  });

  sendSuccess(res, analytics, 201);
}));

export default router;
