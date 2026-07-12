import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AuthToken } from '../types/index.js';
import { AuthenticationError } from './errors.js';

export function generateToken(payload: Omit<AuthToken, 'iat' | 'exp'>): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY as any,
  });
}

export function verifyToken(token: string): AuthToken {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthToken;
    return decoded;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
}

export function decodeToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.decode(token) as AuthToken;
    return decoded;
  } catch {
    return null;
  }
}

export function refreshToken(token: string): string {
  try {
    const decoded = verifyToken(token);
    const { iat, exp, ...payload } = decoded;
    return generateToken(payload as Omit<AuthToken, 'iat' | 'exp'>);
  } catch (error) {
    throw new AuthenticationError('Cannot refresh token');
  }
}
