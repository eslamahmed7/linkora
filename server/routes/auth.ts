import { Router, Request, Response } from 'express';
import { authService } from '../services/AuthService';
import { sendSuccess, sendError } from '../utils/response';
import { authenticateToken, asyncHandler } from '../middleware/auth';

const router = Router();

// Register (Create public user)
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  // We skip validateRegister here because Supabase Auth already validated email/password.
  // We just need to ensure the user is created in our public.users table.
  
  if (!data.id || !data.email || !data.username) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'id, email, and username are required');
  }

  const result = await authService.register(data);
  sendSuccess(res, result, 201);
}));

// Get current user
router.get('/me', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }
  
  const user = await authService.getUserById(req.user.userId);
  if (!user) {
    return sendError(res, 404, 'NOT_FOUND', 'User not found');
  }
  
  sendSuccess(res, user);
}));

// Update profile
router.put('/profile', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Not authenticated');
  }

  const { firstName, lastName, avatar, displayName, username, bio, cover } = req.body;
  const user = await authService.updateProfile(req.user.userId, {
    firstName,
    lastName,
    avatar: avatar || cover,
    displayName,
    username,
    bio,
  } as any);

  if (!user) {
    return sendError(res, 404, 'NOT_FOUND', 'User not found');
  }

  sendSuccess(res, user);
}));

export default router;
