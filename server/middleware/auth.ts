import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '../utils/errors';
import { AuthToken, RequestMetadata } from '../types/index';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../utils/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: AuthToken;
      metadata?: RequestMetadata;
    }
  }
}

export function addRequestMetadata(req: Request, res: Response, next: NextFunction) {
  req.metadata = {
    requestId: uuidv4(),
    timestamp: new Date(),
    userAgent: req.get('user-agent') || 'unknown',
    ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'unknown',
  };
  next();
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return next(new AuthenticationError('No authentication token provided'));
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next(new AuthenticationError('Invalid or expired token'));
    }

    req.user = {
      userId: user.id,
      email: user.email || '',
      username: user.user_metadata?.username || '',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    req.metadata!.userId = user.id;
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid or expired token'));
  }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token) {
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        req.user = {
          userId: user.id,
          email: user.email || '',
          username: user.user_metadata?.username || '',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        };
        req.metadata!.userId = user.id;
      }
    } catch {
      // Ignore auth errors in optional auth
    }
  }

  next();
}

export function asyncHandler(fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
