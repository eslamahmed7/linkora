# Linkora - Testing Guide

## Testing Strategy

Linkora uses a comprehensive testing strategy covering:
- Unit Tests
- Integration Tests
- End-to-End Tests
- Performance Tests
- Security Tests

## Unit Tests

### Backend Services
```typescript
// tests/services/AuthService.test.ts
import { AuthService } from '../../server/services/AuthService'
import { UserRepository } from '../../server/repositories/UserRepository'

describe('AuthService', () => {
  let authService: AuthService
  let userRepository: jest.Mocked<UserRepository>

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    } as any
    authService = new AuthService(userRepository)
  })

  describe('register', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      }

      userRepository.create.mockResolvedValue({
        id: '1',
        ...userData,
        createdAt: new Date(),
      })

      const result = await authService.register(userData)
      
      expect(result.id).toBe('1')
      expect(result.email).toBe('test@example.com')
    })

    it('should throw error if email already exists', async () => {
      userRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
      } as any)

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
      ).rejects.toThrow('Email already registered')
    })
  })

  describe('login', () => {
    it('should return user and token on valid credentials', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        passwordHash: await hashPassword('password123'),
      }

      userRepository.findByEmail.mockResolvedValue(user)

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.user.id).toBe('1')
      expect(result.token).toBeDefined()
    })

    it('should throw error on invalid password', async () => {
      userRepository.findByEmail.mockResolvedValue(null)

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials')
    })
  })
})
```

### Frontend Components
```typescript
// tests/components/LinkPage.test.tsx
import { render, screen } from '@testing-library/react'
import { LinkPage } from '../../src/pages/LinkPage'

describe('LinkPage', () => {
  it('should render link page with title', () => {
    render(<LinkPage username="testuser" />)
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('should display links', () => {
    render(<LinkPage username="testuser" />)
    expect(screen.getByTestId('links-container')).toBeInTheDocument()
  })

  it('should apply correct theme', () => {
    const { container } = render(<LinkPage username="testuser" />)
    expect(container.querySelector('.dark')).toHaveClass('dark')
  })
})
```

## Integration Tests

### API Integration
```typescript
// tests/integration/auth.integration.test.ts
import request from 'supertest'
import { app } from '../../server'
import { database } from '../../server/database'

describe('Auth API Integration', () => {
  beforeAll(async () => {
    await database.connect()
  })

  afterAll(async () => {
    await database.disconnect()
  })

  afterEach(async () => {
    await database.clearAllTables()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe('test@example.com')
      expect(response.body.data.token).toBeDefined()
    })

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password456',
          firstName: 'Another',
          lastName: 'User',
        })

      expect(response.status).toBe(409)
      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
    })

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })

      expect(response.status).toBe(200)
      expect(response.body.data.token).toBeDefined()
    })

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})
```

## End-to-End Tests

### User Flow
```typescript
// tests/e2e/user-flow.e2e.test.ts
import { test, expect } from '@playwright/test'

test('Complete user flow', async ({ page }) => {
  // Register
  await page.goto('http://localhost:5173')
  await page.click('text=Sign Up')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.fill('input[name="firstName"]', 'Test')
  await page.fill('input[name="lastName"]', 'User')
  await page.click('button:has-text("Create Account")')
  
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard')
  expect(page).toHaveURL(/.*dashboard/)

  // Create link page
  await page.click('text=Create New Page')
  await page.fill('input[name="title"]', 'My Links')
  await page.fill('input[name="description"]', 'My awesome links')
  await page.click('button:has-text("Create")')

  // Add links
  await page.click('text=Add Link')
  await page.fill('input[name="title"]', 'My Website')
  await page.fill('input[name="url"]', 'https://example.com')
  await page.click('button:has-text("Add")')

  // Generate QR Code
  await page.click('text=Generate QR')
  await expect(page.locator('canvas')).toBeVisible()

  // Publish page
  await page.click('button:has-text("Publish")')
  await expect(page).toContainText('Page published successfully')
})
```

## Performance Tests

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 50 http://localhost:3001/api/pages/testuser

# Using wrk
wrk -t4 -c100 -d30s http://localhost:3001/api/pages

# Using k6
k6 run tests/performance/load-test.js
```

### k6 Load Test Script
```javascript
// tests/performance/load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
}

export default function () {
  let response = http.get('http://localhost:3001/api/pages')
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })
  sleep(1)
}
```

## Security Tests

### OWASP Testing
```bash
# Using OWASP ZAP
zaproxy -cmd -quickurl http://localhost:3001 -quickout /tmp/zap-report.html

# Using npm audit
npm audit

# Using Snyk
snyk test
```

### SQL Injection Tests
```typescript
test('should prevent SQL injection', async () => {
  const response = await request(app)
    .get('/api/pages')
    .query({ username: "'; DROP TABLE users; --" })
  
  expect(response.status).toBe(400)
})
```

## Running Tests

### All Tests
```bash
pnpm test
```

### Specific Test Suite
```bash
pnpm test -- tests/services/AuthService.test.ts
```

### With Coverage
```bash
pnpm test -- --coverage
```

### Watch Mode
```bash
pnpm test -- --watch
```

### Integration Tests
```bash
pnpm test:integration
```

### E2E Tests
```bash
pnpm test:e2e
```

### Performance Tests
```bash
pnpm test:performance
```

## Test Coverage Goals

- Overall: >= 80%
- Services: >= 90%
- Controllers: >= 85%
- Utilities: >= 90%
- Components: >= 75%

