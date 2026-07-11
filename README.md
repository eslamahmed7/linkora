# Linkora - Premium Link Page Creator

A production-ready SaaS platform for creating beautiful, customizable link pages with dynamic QR codes, NFC support, and advanced analytics.

## Features

### Core Features
- 🔗 **Link Pages**: Create beautiful link pages with custom themes and branding
- 🎨 **Customization**: Full theme customization with light/dark mode support
- 🇸🇦 **Bilingual**: Full Arabic/English support with RTL/LTR automatic switching
- 👥 **Multi-language**: Support for both Arabic and English interfaces

### Advanced Features
- **Dynamic QR Codes**: Generate and customize QR codes with multiple formats (PNG, SVG, WebP)
- **NFC Support**: Embed link pages in NFC tags for seamless mobile tap interactions
- **Advanced Analytics**: Detailed tracking of page views, link clicks, and device statistics
- **Link Management**: Drag-and-drop reordering, activation/deactivation, and expiration dates
- **Social Integration**: Built-in social media link management

### Backend Infrastructure
- **Authentication**: JWT-based authentication with secure password hashing
- **Authorization**: Role-based access control with page ownership verification
- **Data Validation**: Comprehensive input validation using Joi
- **Error Handling**: Standardized error responses with detailed error codes
- **Request Tracking**: Request ID tracking for debugging and logging
- **Rate Limiting**: Built-in support for API rate limiting

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite for fast development and builds
- Tailwind CSS for styling
- Framer Motion for animations
- i18next for internationalization
- Zustand for state management

### Backend
- Node.js with Express
- TypeScript for type safety
- JWT for authentication
- bcryptjs for password hashing
- QRCode library for QR generation
- Joi for validation

## Project Structure

```
linkora/
├── src/                          # Frontend code
│   ├── components/               # React components
│   ├── hooks/                    # Custom hooks
│   ├── i18n/                     # Internationalization
│   ├── stores/                   # Zustand stores
│   ├── styles/                   # Global styles
│   ├── utils/                    # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── server/                       # Backend code
│   ├── config/                   # Configuration
│   ├── middleware/               # Express middleware
│   ├── repositories/             # Data access layer
│   ├── routes/                   # API routes
│   ├── services/                 # Business logic
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Utility functions
│   └── index.ts                  # Server entry point
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your configuration

### Development

Run both frontend and backend:
```bash
pnpm run dev
```

This starts:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

Or run them separately:
```bash
# Frontend only
pnpm run dev:client

# Backend only
pnpm run dev:server
```

### Building

Build both frontend and backend:
```bash
pnpm run build
```

### Production

Start production server:
```bash
pnpm start
```

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response: { user, token }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: { user, token }
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Link Pages Endpoints

#### Create Page
```
POST /api/pages
Authorization: Bearer <token>
Content-Type: application/json

{
  "handle": "my-page",
  "title": "My Link Page",
  "description": "Check out my links",
  "theme": "dark"
}
```

#### Get User's Pages
```
GET /api/pages?skip=0&take=10
Authorization: Bearer <token>
```

#### Get Page by Handle
```
GET /api/pages/handle/:handle
```

#### Get Page Stats
```
GET /api/pages/:pageId/stats
Authorization: Bearer <token>
```

### Links Endpoints

#### Create Link
```
POST /api/links
Authorization: Bearer <token>
Content-Type: application/json

{
  "pageId": "page-id",
  "title": "My Website",
  "url": "https://example.com",
  "description": "Visit my website",
  "icon": "globe"
}
```

#### Get Page Links
```
GET /api/links/page/:pageId
```

#### Record Link Click
```
POST /api/links/:linkId/click
```

### QR Code Endpoints

#### Generate QR Code
```
POST /api/qrcodes
Authorization: Bearer <token>
Content-Type: application/json

{
  "pageId": "page-id",
  "format": "png",
  "size": 300,
  "errorCorrection": "M",
  "designStyle": "standard"
}
```

#### Get Page QR Codes
```
GET /api/qrcodes/page/:pageId?skip=0&take=10
Authorization: Bearer <token>
```

#### Resolve QR Code
```
GET /r/:code
Redirects to the target page or link
```

### Analytics Endpoints

#### Get Page Analytics
```
GET /api/analytics/page/:pageId?skip=0&take=100
Authorization: Bearer <token>
```

#### Get Page Stats
```
GET /api/analytics/page/:pageId/stats
Authorization: Bearer <token>
```

#### Record Page View
```
POST /api/analytics/page/:pageId/view
```

#### Record NFC Tap
```
POST /api/analytics/page/:pageId/nfc-tap
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2024-07-09T12:00:00.000Z",
    "version": "1.0.0"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { /* additional details */ }
  },
  "meta": {
    "timestamp": "2024-07-09T12:00:00.000Z",
    "version": "1.0.0"
  }
}
```

## Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Authentication failed or token invalid
- `AUTHORIZATION_ERROR` - User does not have permission for this action
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists or handle is taken
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_SERVER_ERROR` - Server error

## Security

- Passwords are hashed with bcryptjs (12 salt rounds)
- JWT tokens with configurable expiry
- CORS enabled for frontend origin
- Input validation on all endpoints
- Request tracking with unique request IDs
- Protected routes require authentication

## Performance Optimizations

- In-memory caching with node-cache
- Automatic analytics retention (configurable, default 90 days)
- Efficient data indexing
- Lazy loading support
- Database query optimization ready

## Database (Ready for Integration)

The application is structured to easily integrate with:
- PostgreSQL (Neon)
- Supabase
- Any PostgreSQL-compatible database

Repository layer can be replaced with actual database queries without changing service or route layers.

## Internationalization

Supports full Arabic/English with:
- Automatic RTL/LTR switching
- Complete string externalization
- Translation files in `src/i18n/`

## Future Enhancements

- [ ] Real database integration (PostgreSQL)
- [ ] Email verification and password reset
- [ ] Social OAuth integrations
- [ ] Advanced analytics dashboards
- [ ] Team collaboration features
- [ ] Custom domain support
- [ ] API webhooks
- [ ] Advanced QR code customization
- [ ] A/B testing support
- [ ] Link shortening service

## License

Proprietary - Linkora Team

## Support

For issues, feature requests, or questions, please contact support@linkora.io
