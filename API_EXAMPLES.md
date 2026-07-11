# Linkora API Examples

## Testing the API

You can test the API using curl, Postman, or any HTTP client.

### 1. Register a User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe",
      "plan": "free",
      "createdAt": "2024-07-09T12:00:00Z",
      "updatedAt": "2024-07-09T12:00:00Z"
    },
    "token": "jwt-token-here"
  },
  "meta": {
    "timestamp": "2024-07-09T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Create a Link Page

```bash
curl -X POST http://localhost:3001/api/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "handle": "mypage",
    "title": "My Link Page",
    "description": "Welcome to my link page",
    "theme": "dark"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "page-uuid",
    "userId": "user-uuid",
    "handle": "mypage",
    "title": "My Link Page",
    "description": "Welcome to my link page",
    "theme": "dark",
    "isPublished": false,
    "isNFCEnabled": false,
    "createdAt": "2024-07-09T12:00:00Z",
    "updatedAt": "2024-07-09T12:00:00Z"
  },
  "meta": {
    "timestamp": "2024-07-09T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### 4. Get User's Pages

```bash
curl http://localhost:3001/api/pages \
  -H "Authorization: Bearer your-jwt-token"
```

### 5. Add a Link to Page

```bash
curl -X POST http://localhost:3001/api/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "pageId": "page-uuid",
    "title": "My Website",
    "url": "https://example.com",
    "description": "Check out my website",
    "icon": "globe"
  }'
```

### 6. Get Page Links

```bash
curl http://localhost:3001/api/links/page/page-uuid
```

### 7. Generate QR Code

```bash
curl -X POST http://localhost:3001/api/qrcodes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "pageId": "page-uuid",
    "format": "png",
    "size": 300,
    "errorCorrection": "M",
    "designStyle": "standard"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "qr-uuid",
    "pageId": "page-uuid",
    "code": "abc12345",
    "format": "png",
    "size": 300,
    "errorCorrection": "M",
    "designStyle": "standard",
    "redirectUrl": "http://localhost:3001/r/abc12345",
    "createdAt": "2024-07-09T12:00:00Z",
    "updatedAt": "2024-07-09T12:00:00Z"
  },
  "meta": {
    "timestamp": "2024-07-09T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### 8. Publish Link Page

```bash
curl -X POST http://localhost:3001/api/pages/page-uuid/publish \
  -H "Authorization: Bearer your-jwt-token"
```

### 9. Get Page Stats

```bash
curl http://localhost:3001/api/pages/page-uuid/stats \
  -H "Authorization: Bearer your-jwt-token"
```

### 10. Record Link Click

```bash
curl -X POST http://localhost:3001/api/links/link-uuid/click
```

### 11. Get Analytics

```bash
curl http://localhost:3001/api/analytics/page/page-uuid \
  -H "Authorization: Bearer your-jwt-token"
```

### 12. Record Page View

```bash
curl -X POST http://localhost:3001/api/analytics/page/page-uuid/view
```

### 13. Update Link

```bash
curl -X PUT http://localhost:3001/api/links/link-uuid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "title": "Updated Title",
    "url": "https://updated-url.com"
  }'
```

### 14. Reorder Links

```bash
curl -X POST http://localhost:3001/api/links/page-uuid/reorder \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "links": [
      { "id": "link-1", "order": 0 },
      { "id": "link-2", "order": 1 },
      { "id": "link-3", "order": 2 }
    ]
  }'
```

### 15. Resolve QR Code

```bash
curl -L http://localhost:3001/r/abc12345
```

This will redirect to the target page or link.

## Error Examples

### Validation Error

Request:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "username": "ab",
    "password": "weak"
  }'
```

Response:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format",
      "username": "Username must be at least 3 characters",
      "password": "Password must contain uppercase, lowercase, number and special character"
    }
  },
  "meta": {
    "timestamp": "2024-07-09T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### Authentication Error

```bash
curl http://localhost:3001/api/pages \
  -H "Authorization: Bearer invalid-token"
```

Response:
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid or expired token"
  },
  "meta": {
    "timestamp": "2024-07-09T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### Not Found Error

```bash
curl http://localhost:3001/api/pages/non-existent-id \
  -H "Authorization: Bearer your-jwt-token"
```

Response:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "LinkPage not found"
  },
  "meta": {
    "timestamp": "2024-07-09T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### Authorization Error

```bash
curl -X PUT http://localhost:3001/api/pages/other-users-page-id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{"title": "Hacked"}'
```

Response:
```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "You do not own this page"
  },
  "meta": {
    "timestamp": "2024-07-09T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### Conflict Error

```bash
curl -X POST http://localhost:3001/api/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "handle": "existing-handle",
    "title": "New Page"
  }'
```

Response:
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Handle already taken"
  },
  "meta": {
    "timestamp": "2024-07-09T12:00:00Z",
    "version": "1.0.0"
  }
}
```

## Using Postman

1. Create a new Postman collection
2. Create environment variables:
   - `base_url`: http://localhost:3001
   - `token`: (populate after login)
   - `page_id`: (populate after creating a page)
   - `link_id`: (populate after creating a link)

3. Use these in requests:
   ```
   GET {{base_url}}/api/pages
   Authorization: Bearer {{token}}
   ```

## Rate Limiting

The API implements rate limiting (default: 100 requests per 15 minutes).

If you exceed the limit, you'll receive:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests"
  },
  "meta": {
    "timestamp": "2024-07-09T12:00:00Z",
    "version": "1.0.0"
  }
}
```

Adjust the rate limit in `.env`:
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```
