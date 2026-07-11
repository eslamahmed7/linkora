import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { logger } from './utils/logger';
import { addRequestMetadata } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { sendSuccess } from './utils/response';

// Routes
import authRoutes from './routes/auth';
import pageRoutes from './routes/pages';
import linkRoutes from './routes/links';
import qrcodeRoutes from './routes/qrcodes';
import nfcRoutes from './routes/nfc';
import analyticsRoutes from './routes/analytics';
import dashboardRoutes from './routes/dashboard';
import adminRoutes from './routes/admin';
import assetRoutes from './routes/assets';
import uploadRoutes from './routes/upload';


const app: Express = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      config.CORS_ORIGIN,
      'http://localhost:8887',
      'http://localhost:3000'
    ];
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(addRequestMetadata);

// Health check
app.get('/health', (req: Request, res: Response) => {
  sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() });
});

// API version
app.get('/api/version', (req: Request, res: Response) => {
  sendSuccess(res, { version: '1.0.0', environment: config.NODE_ENV });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/qrcodes', qrcodeRoutes);
app.use('/api/qr', qrcodeRoutes); // Alias for frontend compatibility
app.use('/api/nfc', nfcRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/upload', uploadRoutes);


// QR code redirect
app.get('/r/:code', (req: Request, res: Response) => {
  // This would be handled by qrCodeService.resolveQRCode
  res.status(302).redirect('/');
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.PORT;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: config.NODE_ENV,
    corsOrigin: config.CORS_ORIGIN,
  });
});



// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
