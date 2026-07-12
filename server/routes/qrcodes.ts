import { Router, Request, Response } from 'express';
import { qrCodeService } from '../services/QRCodeService.js';
import { validateQRCodeCreate } from '../utils/validators.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import { authenticateToken, asyncHandler } from '../middleware/auth.js';

const router = Router();

// Generate QR code
router.post('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const { pageId, ...qrData } = req.body;
  const data = validateQRCodeCreate(qrData);
  
  const qrCode = await qrCodeService.generateQRCode(pageId, req.user.userId, data);
  sendSuccess(res, qrCode, 201);
}));

// List all user QR codes
router.get('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const skip = parseInt(req.query.skip as string) || 0;
  const take = Math.min(parseInt(req.query.take as string) || 10, 100);
  
  const result = await qrCodeService.getUserQRCodes(req.user.userId, skip, take);
  sendPaginated(res, result.qrCodes, result.total, Math.floor(skip / take) + 1, take);
}));

// Get page QR codes
router.get('/page/:pageId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const skip = parseInt(req.query.skip as string) || 0;
  const take = Math.min(parseInt(req.query.take as string) || 10, 100);
  
  const result = await qrCodeService.getPageQRCodes(req.params.pageId, req.user.userId, skip, take);
  sendPaginated(res, result.qrCodes, result.total, Math.floor(skip / take) + 1, take);
}));

// Get QR code
router.get('/:qrCodeId', asyncHandler(async (req: Request, res: Response) => {
  const qrCode = await qrCodeService.getQRCode(req.params.qrCodeId);
  sendSuccess(res, qrCode);
}));

// Update QR code
router.put('/:qrCodeId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const { pageId, designStyle, customColors, customLogo, name, url, customization, errorCorrection, size, format, foregroundColor, backgroundColor, isActive } = req.body;
  
  const qrCode = await qrCodeService.updateQRCode(req.params.qrCodeId, req.user.userId, {
    pageId,
    designStyle,
    customColors: customColors || { dark: foregroundColor, light: backgroundColor },
    customLogo,
    name,
    url,
    customization,
    errorCorrection,
    size,
    format,
    isActive
  });

  sendSuccess(res, qrCode);
}));

// Toggle QR code active status
router.post('/:qrCodeId/toggle', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const qrCode = await qrCodeService.toggleQRCode(req.params.qrCodeId, req.user.userId);
  sendSuccess(res, qrCode);
}));

// Delete QR code
router.delete('/:qrCodeId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  await qrCodeService.deleteQRCode(req.params.qrCodeId, req.user.userId);
  sendSuccess(res, { message: 'QR code deleted successfully' });
}));

// Resolve QR code (public)
router.get('/resolve/:code', asyncHandler(async (req: Request, res: Response) => {
  const targetUrl = await qrCodeService.resolveQRCode(req.params.code, {
    userAgent: req.metadata?.userAgent || 'unknown',
    ipAddress: req.metadata?.ipAddress || 'unknown',
    referer: req.get('referer'),
  });

  res.redirect(302, targetUrl);
}));

export default router;
