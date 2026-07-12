import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  
  // QR Code
  // The base URL for the QR code redirect. If empty, the frontend must assemble it.
  // We use a relative path by default or extract it dynamically to avoid localhost hardcoding in prod
  QR_REDIRECT_URL: process.env.QR_REDIRECT_URL || (process.env.NODE_ENV === 'production' ? 'https://linkora-nu.vercel.app/r' : 'http://localhost:3001/r'),
  QR_SIZE: parseInt(process.env.QR_SIZE || '300'),
  
  // Analytics
  ANALYTICS_RETENTION_DAYS: parseInt(process.env.ANALYTICS_RETENTION_DAYS || '90'),
  
  // NFC
  NFC_ENABLED: process.env.NFC_ENABLED === 'true',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:7879',
  
  // API Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // Supabase
  SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};

export default config;
