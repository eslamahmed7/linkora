import { Router, Request, Response } from 'express';
import { authenticateToken, asyncHandler } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { supabase } from '../utils/supabase';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const userId = req.user.userId;

  // Get pages owned by user
  const { data: pages } = await supabase
    .from('link_pages')
    .select('id')
    .eq('user_id', userId)
    .is('deleted_at', null);

  const pageIds = (pages || []).map((p: any) => p.id);

  // Count QR codes
  let qrCount = 0;
  if (pageIds.length > 0) {
    const { count } = await supabase
      .from('qr_codes')
      .select('id', { count: 'exact', head: true })
      .in('page_id', pageIds);
    qrCount = count || 0;
  }

  // Count total scans (analytics events of type 'qr_scan' or 'page_view')
  let scansCount = 0;
  if (pageIds.length > 0) {
    const { count } = await supabase
      .from('analytics_events')
      .select('id', { count: 'exact', head: true })
      .in('page_id', pageIds);
    scansCount = count || 0;
  }

  // Count total link clicks
  let clickCount = 0;
  if (pageIds.length > 0) {
    const { data: linksData } = await supabase
      .from('links')
      .select('click_count')
      .in('page_id', pageIds)
      .is('deleted_at', null);
    clickCount = (linksData || []).reduce((sum: number, l: any) => sum + (l.click_count || 0), 0);
  }

  sendSuccess(res, {
    pagesCount: pageIds.length,
    qrCount,
    scansCount,
    clickCount,
    storageUsage: 0,
  });
}));

// GET /api/dashboard/activity
router.get('/activity', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const userId = req.user.userId;

  // Get recent pages
  const { data: recentPages } = await supabase
    .from('link_pages')
    .select('id, title, username, created_at, updated_at, is_published')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
    .limit(5);

  // Get recent QR codes
  const { data: pages } = await supabase
    .from('link_pages')
    .select('id')
    .eq('user_id', userId)
    .is('deleted_at', null);
  
  const pageIds = (pages || []).map((p: any) => p.id);
  
  let recentQRs: any[] = [];
  if (pageIds.length > 0) {
    const { data } = await supabase
      .from('qr_codes')
      .select('id, name, created_at')
      .in('page_id', pageIds)
      .order('created_at', { ascending: false })
      .limit(3);
    recentQRs = data || [];
  }

  const activities = [
    ...(recentPages || []).map((p: any) => ({
      id: p.id,
      type: 'page',
      title: p.title,
      handle: p.username,
      isPublished: p.is_published,
      createdAt: p.updated_at || p.created_at,
    })),
    ...recentQRs.map((q: any) => ({
      id: q.id,
      type: 'qr',
      title: q.name || 'QR Code',
      createdAt: q.created_at,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  sendSuccess(res, { activities });
}));

export default router;
