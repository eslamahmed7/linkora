import { APIError } from '../types/index.js';
export { APIError };

export class ValidationError extends APIError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication failed') {
    super(401, 'AUTHENTICATION_ERROR', message);
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Access denied') {
    super(403, 'AUTHORIZATION_ERROR', message);
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} not found`);
  }
}

export class ConflictError extends APIError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Too many requests') {
    super(429, 'RATE_LIMIT_EXCEEDED', message);
  }
}

export class InternalServerError extends APIError {
  constructor(message: string = 'Internal server error') {
    super(500, 'INTERNAL_SERVER_ERROR', message);
  }
}

export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}
