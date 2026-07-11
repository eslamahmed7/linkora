# Linkora - Project Structure

## Complete Directory Layout

```
linkora/
├── src/                              # Frontend (React + Vite)
│   ├── api/                         # API client layer
│   │   ├── client.ts               # Base HTTP client
│   │   ├── auth.ts                 # Authentication API
│   │   ├── pages.ts                # Link pages API
│   │   ├── links.ts                # Links API (to be created)
│   │   ├── qrcodes.ts              # QR codes API (to be created)
│   │   └── analytics.ts            # Analytics API (to be created)
│   │
│   ├── components/                  # React components
│   │   ├── ThemeProvider.tsx        # Theme context provider
│   │   ├── Button.tsx              # Reusable button component
│   │   ├── Input.tsx               # Reusable input component
│   │   ├── Card.tsx                # Reusable card component
│   │   └── ... (other components)
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useTheme.ts            # Theme management hook
│   │   └── ... (other hooks)
│   │
│   ├── pages/                       # Page components
│   │   ├── Dashboard.tsx            # User dashboard (to be created)
│   │   ├── Editor.tsx              # Link page editor (to be created)
│   │   ├── PublicPage.tsx          # Public link page view (to be created)
│   │   ├── Analytics.tsx           # Analytics page (to be created)
│   │   ├── QRDesigner.tsx          # QR code designer (to be created)
│   │   └── ... (other pages)
│   │
│   ├── stores/                      # State management (Zustand)
│   │   └── themeStore.ts           # Theme state store
│   │
│   ├── styles/                      # Global styles
│   │   └── globals.css             # Global CSS and Tailwind
│   │
│   ├── utils/                       # Utility functions
│   │   └── cn.ts                   # Class name utility
│   │
│   ├── i18n/                        # Internationalization
│   │   ├── config.ts               # i18n configuration
│   │   ├── en.json                 # English translations
│   │   └── ar.json                 # Arabic translations
│   │
│   ├── App.tsx                      # Main App component
│   └── main.tsx                     # React entry point
│
├── server/                          # Backend (Express + TypeScript)
│   ├── config/                      # Configuration
│   │   ├── env.ts                  # Environment configuration
│   │   ├── database.ts             # Database configuration (to be created)
│   │   └── cors.ts                 # CORS configuration (to be created)
│   │
│   ├── middleware/                  # Express middleware
│   │   ├── auth.ts                 # Authentication middleware
│   │   ├── errorHandler.ts         # Error handling middleware
│   │   ├── logger.ts               # Logging middleware (to be created)
│   │   └── rateLimit.ts            # Rate limiting (to be created)
│   │
│   ├── routes/                      # API routes
│   │   ├── auth.ts                 # Authentication endpoints
│   │   ├── pages.ts                # Link pages endpoints
│   │   ├── links.ts                # Links endpoints
│   │   ├── qrcodes.ts              # QR codes endpoints
│   │   ├── analytics.ts            # Analytics endpoints
│   │   ├── nfc.ts                  # NFC endpoints (to be created)
│   │   └── index.ts                # Route aggregator (to be created)
│   │
│   ├── controllers/                 # Request handlers (to be created)
│   │   ├── AuthController.ts
│   │   ├── PageController.ts
│   │   ├── LinkController.ts
│   │   ├── QRCodeController.ts
│   │   └── AnalyticsController.ts
│   │
│   ├── services/                    # Business logic
│   │   ├── AuthService.ts          # Authentication service
│   │   ├── LinkPageService.ts      # Link page service
│   │   ├── LinkService.ts          # Link service
│   │   ├── QRCodeService.ts        # QR code generation
│   │   ├── AnalyticsService.ts     # Analytics processing
│   │   ├── EmailService.ts         # Email sending (to be created)
│   │   └── StorageService.ts       # File storage (to be created)
│   │
│   ├── repositories/                # Data access layer
│   │   ├── UserRepository.ts       # User data access
│   │   ├── LinkPageRepository.ts   # Link page data access
│   │   ├── LinkRepository.ts       # Link data access
│   │   ├── QRCodeRepository.ts     # QR code data access
│   │   └── AnalyticsRepository.ts  # Analytics data access
│   │
│   ├── types/                       # TypeScript types
│   │   └── index.ts                # Global type definitions
│   │
│   ├── utils/                       # Utility functions
│   │   ├── errors.ts               # Custom error classes
│   │   ├── validators.ts           # Input validation
│   │   ├── response.ts             # Response formatting
│   │   ├── jwt.ts                  # JWT utilities
│   │   ├── password.ts             # Password hashing
│   │   └── logger.ts               # Logging utility
│   │
│   └── index.ts                     # Server entry point
│
├── database/                        # Database scripts (to be created)
│   ├── schema.sql                  # Database schema
│   ├── indexes.sql                 # Index creation
│   ├── seed.sql                    # Initial data
│   └── migrations/                 # Migration files
│
├── tests/                          # Test files (to be created)
│   ├── unit/                       # Unit tests
│   │   ├── services/
│   │   ├── utils/
│   │   └── repositories/
│   │
│   ├── integration/                # Integration tests
│   │   ├── auth.integration.test.ts
│   │   ├── pages.integration.test.ts
│   │   └── ...
│   │
│   ├── e2e/                        # End-to-end tests
│   │   └── user-flow.e2e.test.ts
│   │
│   └── performance/                # Performance tests
│       └── load-test.js
│
├── public/                          # Static files
│   ├── favicon.ico
│   ├── images/                     # Static images
│   └── ...
│
├── config files
│   ├── vite.config.ts              # Vite configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── tsconfig.server.json        # Server TypeScript config
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── postcss.config.js           # PostCSS configuration
│   ├── package.json                # Dependencies and scripts
│   ├── pnpm-lock.yaml              # Dependency lock file
│   ├── .env.example                # Environment variables template
│   └── .gitignore                  # Git ignore rules
│
├── documentation
│   ├── README.md                   # Project overview
│   ├── ARCHITECTURE.md             # Architecture overview
│   ├── API_EXAMPLES.md             # API usage examples
│   ├── DATABASE.md                 # Database schema docs
│   ├── DEPLOYMENT.md               # Deployment guide
│   ├── TESTING.md                  # Testing guide
│   ├── PRODUCTION_CHECKLIST.md     # Production readiness
│   └── PROJECT_STRUCTURE.md        # This file
```

## Module Breakdown

### Frontend (src/)

#### API Layer (`src/api/`)
- **Responsibility**: Communicate with backend API
- **Pattern**: API client with typed responses
- **Files Created**:
  - `client.ts` - Base HTTP client with error handling
  - `auth.ts` - Authentication endpoints
  - `pages.ts` - Link pages endpoints
- **Files to Create**:
  - `links.ts` - Link management
  - `qrcodes.ts` - QR code endpoints
  - `analytics.ts` - Analytics endpoints

#### Components (`src/components/`)
- **Responsibility**: Reusable UI components
- **Pattern**: Functional components with TypeScript
- **Files Created**:
  - `ThemeProvider.tsx` - Theme management provider
- **Files to Create**:
  - UI components (Button, Input, Card, Modal, etc.)
  - Layout components (Sidebar, Header, Footer)
  - Feature components (LinkCard, QRCodeViewer, Analytics)

#### Pages (`src/pages/`)
- **Responsibility**: Full page components
- **Pattern**: Route-level components
- **Files to Create**:
  - `Dashboard.tsx` - User dashboard
  - `Editor.tsx` - Link page editor
  - `PublicPage.tsx` - Public link page view
  - `Analytics.tsx` - Analytics page
  - `QRDesigner.tsx` - QR code designer

#### State Management (`src/stores/`)
- **Responsibility**: Global state management
- **Pattern**: Zustand stores
- **Files Created**:
  - `themeStore.ts` - Theme and language state
- **Files to Create**:
  - `authStore.ts` - Authentication state
  - `pageStore.ts` - Current page state
  - `uiStore.ts` - UI state (modals, notifications)

### Backend (server/)

#### Middleware (`server/middleware/`)
- **auth.ts**: Validates JWT tokens and attaches user to request
- **errorHandler.ts**: Catches and formats all errors
- **Files to Create**:
  - `logger.ts` - Request/response logging
  - `rateLimit.ts` - Rate limiting
  - `validation.ts` - Input validation

#### Routes (`server/routes/`)
- **auth.ts**: `/api/auth/*` endpoints (login, register, etc.)
- **pages.ts**: `/api/pages/*` endpoints (CRUD operations)
- **links.ts**: `/api/links/*` endpoints
- **qrcodes.ts**: `/api/qrcodes/*` endpoints
- **analytics.ts**: `/api/analytics/*` endpoints
- **Files to Create**:
  - `nfc.ts` - NFC integration
  - `index.ts` - Route aggregator

#### Services (`server/services/`)
- **AuthService**: User authentication, JWT, password handling
- **LinkPageService**: Link page business logic
- **LinkService**: Individual link operations
- **QRCodeService**: QR code generation and management
- **AnalyticsService**: Analytics processing and aggregation
- **Files to Create**:
  - `EmailService` - Email sending
  - `StorageService` - File upload/download
  - `CacheService` - Caching layer

#### Repositories (`server/repositories/`)
- **Pattern**: Data access objects (DAO)
- **Responsibility**: All database operations
- **Files Created**:
  - `UserRepository.ts` - User CRUD
  - `LinkPageRepository.ts` - Link page CRUD
  - `LinkRepository.ts` - Link CRUD
  - `QRCodeRepository.ts` - QR code CRUD
  - `AnalyticsRepository.ts` - Analytics queries

#### Utilities (`server/utils/`)
- **errors.ts**: Custom error classes and handling
- **validators.ts**: Input validation schemas (Joi)
- **response.ts**: Standardized API responses
- **jwt.ts**: JWT token generation and verification
- **password.ts**: Password hashing and verification
- **logger.ts**: Centralized logging

## Data Flow

### Authentication Flow
```
Frontend (Login) 
  → POST /api/auth/login 
  → AuthController 
  → AuthService 
  → UserRepository 
  → Database
  ← Generate JWT token
  → Store in localStorage
  → Redirect to dashboard
```

### Link Page Creation Flow
```
Frontend (Create page form)
  → POST /api/pages
  → authMiddleware (verify token)
  → PageController
  → LinkPageService
  → LinkPageRepository
  → Create in database
  ← Return page data
  → Update frontend state
```

### Analytics Tracking Flow
```
Public Link Page (Click)
  → POST /api/analytics/track
  → AnalyticsController
  → AnalyticsService
  → AnalyticsRepository
  → Insert analytics event
  → Update link click count
  ← Return success response
  → Redirect to target URL
```

## Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Internationalization**: i18next
- **Animations**: Framer Motion

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **Validation**: Joi
- **Database**: PostgreSQL (recommended)
- **Caching**: node-cache (in-memory)
- **QR Generation**: qrcode library
- **Logging**: Winston (to be added)

### DevOps
- **Package Manager**: pnpm
- **Version Control**: Git
- **Runtime**: Node.js 18+
- **Database**: PostgreSQL 12+
- **Deployment**: Vercel, Railway, Docker

## Development Workflow

### Setup
```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env

# Start development servers
pnpm dev        # Both frontend and backend
pnpm dev:client # Frontend only
pnpm dev:server # Backend only
```

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API: http://localhost:3001/api

### Building
```bash
# Build frontend
pnpm build

# Build backend
pnpm build:server

# Both
pnpm build && pnpm build:server
```

### Testing
```bash
pnpm test              # All tests
pnpm test:integration # Integration tests
pnpm test:e2e        # E2E tests
pnpm test:performance # Performance tests
```

## Key Architectural Decisions

### 1. Separation of Concerns
- Frontend and backend are separate applications
- Clear API boundary between layers
- Each service has a single responsibility

### 2. Type Safety
- Full TypeScript for frontend and backend
- Shared type definitions
- Runtime validation with Joi

### 3. Error Handling
- Centralized error handling middleware
- Custom error classes for different scenarios
- Consistent error response format

### 4. Authentication
- JWT-based stateless authentication
- Secure password hashing with bcrypt
- Token refresh mechanism

### 5. Analytics
- Event-based tracking system
- Aggregate data for performance
- Support for complex queries

### 6. Scalability
- Repository pattern for database independence
- Service layer for business logic isolation
- Middleware for cross-cutting concerns
- Prepared for caching layer

## Performance Considerations

### Frontend
- Code splitting with Vite
- Image optimization
- Lazy loading of routes
- Caching strategies

### Backend
- Database indexing
- Query optimization
- Caching layer (Redis-ready)
- Rate limiting

### Database
- Proper indexing strategy
- Query optimization
- Partitioning for large tables
- Regular maintenance

## Security Considerations

### Authentication
- JWT token validation
- Secure password storage
- Token expiration and refresh

### Authorization
- Role-based access control (RBAC) ready
- User can only access own data
- Admin functions protected

### Data Protection
- Input validation with Joi
- SQL injection prevention with parameterized queries
- CORS configuration
- Rate limiting

### Infrastructure
- HTTPS/TLS encryption
- Environment variable management
- Secrets management (ready for Vault)

