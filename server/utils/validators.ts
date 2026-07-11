import Joi from 'joi';
import { ValidationError } from './errors';
import { AuthCredentials, RegisterData } from '../types';

// Validation schemas
export const schemas = {
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character',
      'any.required': 'Password is required',
    }),

  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only letters and numbers',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must not exceed 30 characters',
      'any.required': 'Username is required',
    }),

  handle: Joi.string()
    .pattern(/^[a-z0-9_-]+$/)
    .min(3)
    .max(30)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Handle must contain only lowercase letters, numbers, hyphens, and underscores',
      'string.min': 'Handle must be at least 3 characters',
      'string.max': 'Handle must not exceed 30 characters',
    }),

  url: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'Invalid URL format',
      'any.required': 'URL is required',
    }),

  title: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.min': 'Title is required',
      'string.max': 'Title must not exceed 255 characters',
      'any.required': 'Title is required',
    }),

  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 1000 characters',
    }),

  hexColor: Joi.string()
    .pattern(/^#[0-9A-F]{6}$/i)
    .messages({
      'string.pattern.base': 'Invalid hex color format',
    }),
};

// Auth validators
export const validateLogin = (data: unknown): AuthCredentials => {
  const schema = Joi.object({
    email: schemas.email,
    password: Joi.string().required(),
  });

  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.reduce((acc, detail) => {
      acc[detail.path.join('.')] = detail.message;
      return acc;
    }, {} as Record<string, string>);
    throw new ValidationError('Validation failed', details);
  }
  return value;
};

export const validateRegister = (data: unknown): RegisterData => {
  const schema = Joi.object({
    email: schemas.email,
    username: schemas.username,
    password: schemas.password,
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
  });

  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.reduce((acc, detail) => {
      acc[detail.path.join('.')] = detail.message;
      return acc;
    }, {} as Record<string, string>);
    throw new ValidationError('Validation failed', details);
  }
  return value;
};

// LinkPage validators
export const validateLinkPageCreate = (data: unknown) => {
  const schema = Joi.object({
    handle: schemas.handle,
    title: schemas.title,
    description: schemas.description,
    theme: Joi.string().valid('light', 'dark', 'custom'),
  });

  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.reduce((acc, detail) => {
      acc[detail.path.join('.')] = detail.message;
      return acc;
    }, {} as Record<string, string>);
    console.error('Validation failed for LinkPageCreate:', details);
    throw new ValidationError('Validation failed', details);
  }
  return value;
};

// Link validators
export const validateLinkCreate = (data: unknown) => {
  const schema = Joi.object({
    title: schemas.title,
    url: schemas.url,
    description: schemas.description,
    icon: Joi.string().optional(),
  });

  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.reduce((acc, detail) => {
      acc[detail.path.join('.')] = detail.message;
      return acc;
    }, {} as Record<string, string>);
    throw new ValidationError('Validation failed', details);
  }
  return value;
};

// QR Code validators
export const validateQRCodeCreate = (data: unknown) => {
  const schema = Joi.object({
    format: Joi.string().valid('png', 'svg', 'webp').default('png'),
    size: Joi.number().min(100).max(1000).default(300),
    errorCorrection: Joi.string().valid('L', 'M', 'Q', 'H').default('M'),
    designStyle: Joi.string().valid('standard', 'rounded', 'gradient', 'custom').default('standard'),
  }).unknown(true);

  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.reduce((acc, detail) => {
      acc[detail.path.join('.')] = detail.message;
      return acc;
    }, {} as Record<string, string>);
    throw new ValidationError('Validation failed', details);
  }
  return value;
};
