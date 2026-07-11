import { Response } from 'express';
import { APIResponse, PaginatedResponse } from '../types/index';

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
): Response {
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
