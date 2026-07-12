import { Router, Request, Response } from 'express';
import { authenticateToken, asyncHandler } from '../middleware/auth.js';
import { nfcService } from '../services/NFCService.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = Router();

// Get all NFC cards for user
router.get('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const cards = await nfcService.getUserCards(req.user.userId);
  sendSuccess(res, { items: cards }); // Note: frontend expects { items: [] }
}));

// Create new NFC card
router.post('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const card = await nfcService.createCard(req.user.userId, req.body);
  sendSuccess(res, card, 201); // frontend expects the raw card object in response.data, or inside { card }? 
  // Wait, frontend nfc.ts says: `return { card: response.data as NFCCard }`
  // so if we do sendSuccess(res, card), response.data will BE the card!
}));

// Get specific NFC card
router.get('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const card = await nfcService.getCard(req.params.id, req.user.userId);
  sendSuccess(res, card);
}));

// Update NFC card
router.put('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const card = await nfcService.updateCard(req.params.id, req.user.userId, req.body);
  sendSuccess(res, card);
}));

// Delete NFC card
router.delete('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  await nfcService.deleteCard(req.params.id, req.user.userId);
  sendSuccess(res, null, 204);
}));

// Toggle active status
router.put('/:id/toggle', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const card = await nfcService.toggleActive(req.params.id, req.user.userId);
  sendSuccess(res, card);
}));

// Write to NFC tag
router.post('/:id/write', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const { tagId } = req.body;
  if (!tagId) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'tagId is required');
  }

  const result = await nfcService.writeTag(req.params.id, req.user.userId, tagId);
  sendSuccess(res, result);
}));

// Save card design (customization)
router.put('/:id/design', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const { cardDesign } = req.body;
  if (!cardDesign) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'cardDesign is required');
  }

  const card = await nfcService.saveDesign(req.params.id, req.user.userId, cardDesign);
  sendSuccess(res, card);
}));

export default router;
