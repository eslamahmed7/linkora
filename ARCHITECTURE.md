# Linkora Architecture Documentation

## System Overview

Linkora is a full-stack SaaS application built with a modern, scalable architecture designed for production deployment.

## Architecture Layers

### 1. Presentation Layer (Frontend)
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Internationalization**: i18next (Arabic/English)
- **Location**: `/src`

### 2. API Layer (Backend)
- **Framework**: Express.js
- **Language**: TypeScript
- **Port**: 3001 (configurable)
- **Location**: `/server`

### 3. Service Layer
Implements business logic and orchestrates repositories:
- `AuthService`: User authentication and profile management
- `LinkPageService`: Link page CRUD and publishing
- `LinkService`: Link management and click tracking
- `QRCodeService`: QR code generation and resolution
- `AnalyticsService`: Analytics collection and reporting

### 4. Repository Layer
Data access abstraction (ready for database integration):
- `UserRepository`: User data operations
- `LinkPageRepository`: Link page data operations
- `LinkRepository`: Link data operations
- `QRCodeRepository`: QR code data operations
- `AnalyticsRepository`: Analytics data operations

### 5. Middleware Layer
- `auth.ts`: Authentication and request metadata
- `errorHandler.ts`: Centralized error handling

### 6. Utility Layer
- `jwt.ts`: JWT token generation and verification
- `password.ts`: Password hashing and verification
- `validators.ts`: Input validation with Joi
- `response.ts`: Standardized response formatting
- `logger.ts`: Structured logging
- `errors.ts`: Custom error classes

## Data Flow

```
Request
  ↓
Middleware (addRequestMetadata, optionalAuth/authenticateToken)
  ↓
Route Handler
  ↓
Service Layer (business logic)
  ↓
Repository Layer (data access)
  ↓
In-Memory Store (or database in production)
  ↓
Service Layer (format response)
  ↓
Response Formatter (sendSuccess/sendError)
  ↓
Response
```

## Entity Relationships

```
User (1)
  ├─ (1 to many) → LinkPage
         ├─ (1 to many) → Link
         │    └─ (1 to many) → Analytics
         └─ (1 to many) → QRCode
              └─ (1 to many) → Analytics

LinkPage (1)
  ├─ (1 to many) → Analytics (page views)
  └─ (1 to many) → QRCode
```

## API Endpoint Structure

```
/api
  /auth
    POST   /register           - User registration
    POST   /login              - User login
    GET    /me                 - Get current user
    PUT    /profile            - Update user profile
    POST   /change-password    - Change password

  /pages
    POST   /                   - Create link page
    GET    /                   - Get user's pages
    GET    /handle/:handle     - Get page by handle
    GET    /:pageId            - Get page by ID
    PUT    /:pageId            - Update page
    POST   /:pageId/publish    - Publish page
    POST   /:pageId/unpublish  - Unpublish page
    GET    /:pageId/stats      - Get page stats
    DELETE /:pageId            - Delete page

  /links
    POST   /                   - Create link
    GET    /page/:pageId       - Get page links
    PUT    /:linkId            - Update link
    POST   /:pageId/reorder    - Reorder links
    POST   /:linkId/toggle     - Toggle link active
    POST   /:linkId/click      - Record link click
    DELETE /:linkId            - Delete link

  /qrcodes
    POST   /                   - Generate QR code
    GET    /page/:pageId       - Get page QR codes
    GET    /:qrCodeId          - Get QR code
    PUT    /:qrCodeId          - Update QR code
    DELETE /:qrCodeId          - Delete QR code
    GET    /resolve/:code      - Resolve QR code (public)

  /analytics
    GET    /page/:pageId       - Get page analytics
    GET    /page/:pageId/stats - Get page stats
    GET    /page/:pageId/retention - Get retention metrics
    POST   /page/:pageId/view  - Record page view
    POST   /page/:pageId/nfc-tap - Record NFC tap

/r/:code                        - QR code redirect
```

## Authentication Flow

```
1. User registers with email, username, password
2. Password hashed with bcryptjs (12 salt rounds)
3. User created in repository
4. JWT token generated with user ID, email, username
5. Token sent to client

Subsequent requests:
1. Client includes token in Authorization header
2. Middleware verifies token signature and expiry
3. User ID extracted from token and stored in request
4. Route handler uses req.user.userId for authorization
```

## Error Handling Strategy

```
Error Hierarchy:
- APIError (base)
  ├─ ValidationError (400)
  ├─ AuthenticationError (401)
  ├─ AuthorizationError (403)
  ├─ NotFoundError (404)
  ├─ ConflictError (409)
  ├─ RateLimitError (429)
  └─ InternalServerError (500)

Flow:
1. Error thrown in service/middleware
2. Express catches error
3. errorHandler middleware processes
4. Standardized JSON response sent
5. Error logged for debugging
```

## Analytics Collection

```
Analytics Types:
- page_view: User visits a link page
- link_click: User clicks a link
- qr_scan: User scans a QR code
- nfc_tap: User taps an NFC tag

Collection:
1. Event trigger (click, scan, tap, view)
2. Device type detection (mobile, tablet, desktop)
3. Analytics record created
4. Stored in analytics repository
5. Available for querying and reporting

Retention:
- Default: 90 days (configurable)
- Automatic cleanup on new events
```

## QR Code Generation

```
Process:
1. Unique code generated from page/link ID + timestamp
2. Redirect URL created: {QR_REDIRECT_URL}/{code}
3. QRCode library generates image
4. Multiple formats supported: PNG, SVG, WebP
5. Design options: standard, rounded, gradient, custom
6. QR record stored with code and metadata

Resolution:
1. GET /r/{code}
2. Code looked up in QR repository
3. Analytics recorded
4. Redirect to target (page or specific link)
```

## Caching Strategy

```
Current: In-memory caching with node-cache
- User lookups by ID, email, username
- Link page handles
- Frequently accessed data

Future: Redis/Memcached
- Distributed caching
- Cache invalidation
- TTL policies
```

## Security Considerations

```
Implemented:
✓ Password hashing with bcryptjs (12 rounds)
✓ JWT authentication with expiry
✓ CORS configuration
✓ Input validation on all endpoints
✓ SQL injection prevention (ready for SQL)
✓ XSS prevention (React escaping)
✓ CSRF protection ready (headers)
✓ Rate limiting support
✓ Request tracking/logging
✓ Error message sanitization

To Implement:
- HTTPS enforcement
- CSP headers
- Security headers (Helmet)
- IP whitelisting
- Two-factor authentication
- Session management
- API key authentication
```

## Scalability Considerations

```
Current:
- Single server instance
- In-memory storage
- Vertical scaling only

For Horizontal Scaling:
1. Replace in-memory store with database
2. Implement Redis for caching
3. Add message queue (Bull, RabbitMQ)
4. Use load balancer (nginx, HAProxy)
5. Implement database replication
6. Use CDN for static assets
7. Implement file storage (S3, Azure Blob)
```

## Performance Optimization

```
Implemented:
- Efficient data indexing
- Lazy loading support
- Pagination support (100 items max)
- Request validation early
- Error handling without database lookups

To Implement:
- Database query optimization
- Connection pooling
- Response compression (gzip)
- HTTP caching headers
- Database indexing strategy
- Query result caching
- Batch operations
```

## Deployment Strategy

```
Environment Configuration:
.env variables for:
- Database connection
- JWT secret
- API URLs
- Feature flags
- Rate limiting
- Logging level

Docker Ready:
- Dockerfile can be created
- docker-compose for local dev
- Health check endpoints
- Graceful shutdown

CI/CD Ready:
- TypeScript compilation
- Linting
- Testing hooks
- Build optimization
```

## Type Safety

```
Full TypeScript Implementation:
- Entity types (User, LinkPage, Link, etc.)
- API request/response types
- Service method signatures
- Repository method signatures
- Middleware types

Benefits:
- Compile-time error detection
- IDE autocomplete
- Self-documenting code
- Refactoring safety
```

## Testing Strategy (Ready to Implement)

```
Unit Tests:
- Service methods
- Validation functions
- Utility functions
- Password hashing

Integration Tests:
- API endpoints
- Error handling
- Authorization flows
- Data persistence

E2E Tests:
- User workflows
- QR code generation
- Analytics collection
```

## Database Migration Path

```
Current:
- In-memory repositories
- No persistence between restarts

Step 1: PostgreSQL Integration
- Replace repositories with SQL queries
- Implement migrations
- Add connection pooling

Step 2: Supabase/Neon
- Use managed PostgreSQL
- Auth integration
- Real-time features

Step 3: Caching Layer
- Redis for session data
- Query result caching
- Rate limiting

Step 4: File Storage
- Cloud storage (S3, Azure Blob)
- QR code image storage
- User avatars/images
```

## Monitoring & Logging

```
Implemented:
- Request ID tracking
- Structured logging
- Error logging with stack traces
- Development vs production logging

To Add:
- Prometheus metrics
- Grafana dashboards
- Error tracking (Sentry)
- APM (New Relic, DataDog)
- Log aggregation (ELK, Splunk)
- Performance monitoring
```

## API Versioning

```
Current: v1 (implied)

Strategy:
- Version in URL: /api/v1/...
- Version in Accept header
- Deprecation warnings
- Backward compatibility
```

This architecture provides a solid foundation for a production-grade SaaS application with clear separation of concerns, type safety, and a clear path to horizontal scaling.
