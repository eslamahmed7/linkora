# Linkora - Deployment Guide

## Overview

This guide covers deploying Linkora to production. The application consists of:
- **Frontend**: React + Vite (static files)
- **Backend**: Express.js + TypeScript (Node.js server)
- **Database**: PostgreSQL (recommended) or any SQL database
- **Storage**: Optional - for QR code images and user uploads

## Pre-Deployment Checklist

### Backend Requirements
- [ ] Node.js 18+ installed
- [ ] Database configured (PostgreSQL recommended)
- [ ] Environment variables set in `.env`
- [ ] JWT_SECRET generated (use `openssl rand -base64 32`)
- [ ] All environment variables from `.env.example` configured
- [ ] Database migrations run
- [ ] Email service configured (Nodemailer)

### Frontend Requirements
- [ ] `VITE_API_URL` points to your backend API
- [ ] All environment variables set
- [ ] Build process tested locally

## Database Setup

### PostgreSQL (Recommended)

```bash
# Create database
createdb linkora_production

# Run migrations (create tables)
psql linkora_production < database/schema.sql

# Create indexes for performance
psql linkora_production < database/indexes.sql

# Seed with initial data (optional)
psql linkora_production < database/seed.sql
```

### Alternative Databases
- MySQL: Update connection string in `server/config/database.ts`
- MongoDB: Refactor repositories to use Mongoose
- SQLite: Good for development, not recommended for production

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=3001
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d
DATABASE_URL=postgresql://user:password@host:5432/linkora_production
CORS_ORIGIN=https://yourdomain.com
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
QR_CODE_SIZE=300
STORAGE_TYPE=local
STORAGE_PATH=/var/linkora/storage
LOG_LEVEL=info
ANALYTICS_RETENTION_DAYS=365
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### Frontend (.env)
```
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Linkora
VITE_APP_VERSION=1.0.0
```

## Deployment Options

### Option 1: Vercel (Recommended for Simplicity)

#### Backend (Vercel Functions)
```bash
# Create vercel.json
{
  "buildCommand": "pnpm build:server",
  "outputDirectory": "dist",
  "framework": "express"
}

# Deploy
vercel deploy
```

#### Frontend
```bash
# Deploy from root
vercel deploy
```

### Option 2: Railway, Render, or Heroku

```bash
# Build
pnpm build
pnpm build:server

# The platforms will detect package.json and run start script
```

### Option 3: Docker (Complete Control)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build && pnpm build:server

EXPOSE 3001

CMD ["pnpm", "start"]
```

```bash
# Build and run
docker build -t linkora:latest .
docker run -p 3001:3001 --env-file .env linkora:latest
```

### Option 4: VPS (AWS EC2, DigitalOcean, Linode)

```bash
# SSH into server
ssh user@your-server.com

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Clone repository
git clone https://github.com/yourusername/linkora.git
cd linkora

# Setup environment
cp .env.example .env
# Edit .env with your values

# Install dependencies
npm install -g pnpm
pnpm install

# Build
pnpm build
pnpm build:server

# Setup systemd service
sudo cp deploy/linkora.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable linkora
sudo systemctl start linkora

# Setup nginx reverse proxy
sudo apt-get install -y nginx
sudo cp deploy/nginx.conf /etc/nginx/sites-available/linkora
sudo ln -s /etc/nginx/sites-available/linkora /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Production Optimizations

### Backend Optimization
```typescript
// Use clustering for multiple CPU cores
import cluster from 'cluster'
import os from 'os'

if (cluster.isMaster) {
  const numWorkers = os.cpus().length
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork()
  }
} else {
  startServer()
}
```

### Caching Strategy
```typescript
// Implement Redis caching for frequently accessed data
import redis from 'redis'

const cache = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
})

// Cache link pages for 1 hour
app.get('/pages/:username', async (req, res) => {
  const cached = await cache.get(`page:${req.params.username}`)
  if (cached) return res.json(JSON.parse(cached))
  
  const page = await PageService.getByUsername(req.params.username)
  await cache.set(`page:${req.params.username}`, JSON.stringify(page), 'EX', 3600)
  res.json(page)
})
```

### Database Optimization
```sql
-- Create indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_link_pages_username ON link_pages(username);
CREATE INDEX idx_links_page_id ON links(page_id);
CREATE INDEX idx_analytics_link_id ON analytics(link_id);
CREATE INDEX idx_qr_codes_link_id ON qr_codes(link_id);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM link_pages WHERE username = 'user123';
```

### Frontend Optimization
```javascript
// Vite configuration for production
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'i18n': ['i18next', 'react-i18next'],
        }
      }
    }
  }
}
```

## Monitoring and Logging

### Backend Logging
```typescript
// All API requests logged
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userId: req.user?.id,
    timestamp: new Date().toISOString(),
  })
  next()
})
```

### Error Tracking (Sentry)
```typescript
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})

app.use(Sentry.Handlers.errorHandler())
```

### Performance Monitoring
```bash
# Enable Node.js performance monitoring
node --enable-source-maps --inspect=0.0.0.0:9229 server/index.ts
```

## Security Hardening

### HTTPS/TLS
- Use Let's Encrypt (free) or commercial certificates
- Enable HSTS header
- Redirect HTTP to HTTPS

### Security Headers
```typescript
import helmet from 'helmet'

app.use(helmet())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
  }
}))
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
})

app.use('/api/', limiter)
```

### CORS Configuration
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))
```

## Backup and Disaster Recovery

### Database Backups
```bash
# Daily backup
0 2 * * * pg_dump linkora_production | gzip > /backups/linkora_$(date +\%Y\%m\%d).sql.gz

# Upload to S3
aws s3 cp /backups/linkora_$(date +\%Y\%m\%d).sql.gz s3://your-backup-bucket/
```

### File Backups
```bash
# Backup storage directory
0 3 * * * tar -czf /backups/storage_$(date +\%Y\%m\%d).tar.gz /var/linkora/storage
```

### Recovery Procedure
```bash
# Restore database
gunzip /backups/linkora_20240101.sql.gz
psql linkora_production < /backups/linkora_20240101.sql

# Restore files
tar -xzf /backups/storage_20240101.tar.gz -C /var/linkora/
```

## Performance Benchmarks

### Expected Performance
- Page load: < 2 seconds (with caching)
- API response: < 200ms (average)
- QR code generation: < 500ms
- Analytics processing: < 1 second

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 https://api.yourdomain.com/api/pages

# Using wrk
wrk -t4 -c100 -d30s https://api.yourdomain.com/api/pages
```

## Troubleshooting

### Backend won't start
```bash
# Check logs
journalctl -u linkora -n 50

# Check port
lsof -i :3001

# Check environment
env | grep DATABASE_URL
```

### Database connection issues
```bash
# Test connection
psql $DATABASE_URL

# Check firewall
sudo ufw status
```

### High memory usage
```bash
# Monitor
node --expose-gc server/index.ts
# Trigger garbage collection periodically
```

## Maintenance

### Regular Tasks
- Monitor error logs (daily)
- Review performance metrics (weekly)
- Update dependencies (monthly)
- Database maintenance (weekly)
- Backup verification (weekly)
- Security updates (as needed)

### Dependency Updates
```bash
pnpm update --latest
pnpm audit
```

## Support

For deployment issues:
1. Check `.env` configuration
2. Review application logs
3. Verify database connectivity
4. Check firewall/security group rules
5. Contact support team

