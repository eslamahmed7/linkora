import { Request, Response, NextFunction } from 'express';
import { isAPIError, APIError } from '../utils/errors';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { config } from '../config/env';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const requestId = req.metadata?.requestId;

  if (isAPIError(err)) {
    logger.warn(`API Error: ${err.code}`, {
      requestId,
      statusCode: err.statusCode,
      message: err.message,
    });

    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    logger.warn(`Validation Error: ${err.message}`, { requestId });
    return sendError(res, 400, 'VALIDATION_ERROR', err.message);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    logger.warn(`JWT Error: ${err.message}`, { requestId });
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    logger.warn('Token expired', { requestId });
    return sendError(res, 401, 'AUTHENTICATION_ERROR', 'Token expired');
  }

  // Log unexpected errors
  logger.error('Unexpected error', err, { requestId });

  // Return generic error in production
  if (config.NODE_ENV === 'production') {
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred');
  }

  // Return detailed error in development
  return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
