import { Response } from 'express';
import { APIResponse, PaginatedResponse } from '../types/index.js';

export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): Response {
  const response: APIResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  };
  return res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  pageSize: number,
  statusCode: number = 200
): Response {
  const paginated: PaginatedResponse<T> = {
    items,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  };
  const response: APIResponse<PaginatedResponse<T>> = {
    success: true,
    data: paginated,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
): Response;
export function sendError(
  res: Response,
  message: string,
  statusCode?: number
): Response;
export function sendError(
  res: Response,
  firstParam: number | string,
  secondParam?: string | number,
  thirdParam?: string,
  fourthParam?: Record<string, unknown>
): Response {
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An error occurred';
  let details = fourthParam;

  if (typeof firstParam === 'number') {
    // Standard signature: sendError(res, statusCode, code, message, details)
    statusCode = firstParam;
    code = typeof secondParam === 'string' ? secondParam : 'ERROR';
    message = thirdParam || '';
  } else {
    // Legacy signature: sendError(res, message, statusCode)
    message = firstParam;
    statusCode = typeof secondParam === 'number' ? secondParam : 400;
    if (statusCode === 401 || statusCode === 403) {
      code = 'UNAUTHORIZED';
    } else if (statusCode === 404) {
      code = 'NOT_FOUND';
    } else {
      code = 'BAD_REQUEST';
    }
  }

  const response: APIResponse<null> = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  };
  return res.status(statusCode).json(response);
}
