# Linkora - Database Schema

## Overview

Linkora uses a relational database (PostgreSQL recommended) with the following core tables and relationships.

## Core Tables

### Users
Stores user account information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  verified_email BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_token_expires_at TIMESTAMP,
  password_reset_token VARCHAR(255),
  password_reset_token_expires_at TIMESTAMP,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP -- Soft delete
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
```

### Link Pages
Main entity representing a user's link collection page.

```sql
CREATE TABLE link_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  theme VARCHAR(20) DEFAULT 'dark', -- dark or light
  background_color VARCHAR(7) DEFAULT '#000000',
  background_image_url TEXT,
  profile_image_url TEXT,
  profile_image_position VARCHAR(20) DEFAULT 'center', -- top or center
  custom_domain VARCHAR(255),
  custom_domain_verified BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_link_pages_user_id ON link_pages(user_id);
CREATE INDEX idx_link_pages_username ON link_pages(username);
CREATE INDEX idx_link_pages_custom_domain ON link_pages(custom_domain);
CREATE INDEX idx_link_pages_is_published ON link_pages(is_published);
```

### Links
Individual links on a link page.

```sql
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES link_pages(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  url VARCHAR(2000) NOT NULL,
  description TEXT,
  icon_url TEXT,
  color VARCHAR(7) DEFAULT '#0066FF',
  button_style VARCHAR(50) DEFAULT 'default', -- default, rounded, shadow, neon
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER NOT NULL,
  click_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_links_page_id ON links(page_id);
CREATE INDEX idx_links_display_order ON links(page_id, display_order);
```

### QR Codes
QR code data and metadata.

```sql
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES link_pages(id) ON DELETE CASCADE,
  code_data TEXT NOT NULL,
  image_url TEXT,
  image_base64 TEXT,
  size INTEGER DEFAULT 300,
  error_correction_level VARCHAR(1) DEFAULT 'M', -- L, M, Q, H
  format VARCHAR(10) DEFAULT 'png', -- png, svg, jpg
  style VARCHAR(50) DEFAULT 'default',
  color_dark VARCHAR(7) DEFAULT '#000000',
  color_light VARCHAR(7) DEFAULT '#FFFFFF',
  logo_url TEXT,
  border_width INTEGER DEFAULT 0,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_qr_codes_link_id ON qr_codes(link_id);
CREATE INDEX idx_qr_codes_page_id ON qr_codes(page_id);
```

### Analytics Events
Detailed click and view analytics.

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  page_id UUID REFERENCES link_pages(id) ON DELETE CASCADE,
  qr_code_id UUID REFERENCES qr_codes(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL, -- page_view, link_click, qr_scan, nfc_scan
  user_agent TEXT,
  ip_address VARCHAR(45),
  country VARCHAR(2),
  city VARCHAR(100),
  device_type VARCHAR(50), -- desktop, mobile, tablet
  browser_name VARCHAR(100),
  browser_version VARCHAR(50),
  os_name VARCHAR(100),
  os_version VARCHAR(50),
  referrer_url TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_content VARCHAR(100),
  utm_term VARCHAR(100),
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_link_id ON analytics_events(link_id);
CREATE INDEX idx_analytics_page_id ON analytics_events(page_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_country ON analytics_events(country);
```

### NFC Tags
NFC tag mappings for mobile integration.

```sql
CREATE TABLE nfc_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  page_id UUID REFERENCES link_pages(id) ON DELETE CASCADE,
  nfc_id VARCHAR(255) UNIQUE NOT NULL,
  nfc_uri TEXT NOT NULL,
  nfc_type VARCHAR(50), -- NDEF_URI, NDEF_TEXT, NDEF_SMART_POSTER
  is_active BOOLEAN DEFAULT TRUE,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_nfc_tags_link_id ON nfc_tags(link_id);
CREATE INDEX idx_nfc_tags_nfc_id ON nfc_tags(nfc_id);
```

### Themes (Predefined)
Predefined theme templates.

```sql
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE,
  background_color VARCHAR(7),
  background_image_url TEXT,
  button_style VARCHAR(50),
  text_color VARCHAR(7),
  accent_color VARCHAR(7),
  is_default BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Domains (Custom)
Custom domain mappings.

```sql
CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES link_pages(id) ON DELETE CASCADE,
  domain VARCHAR(255) UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verification_method VARCHAR(50), -- dns, file, email
  dns_records JSONB,
  ssl_certificate TEXT,
  ssl_certificate_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_custom_domains_user_id ON custom_domains(user_id);
CREATE INDEX idx_custom_domains_domain ON custom_domains(domain);
```

### Subscriptions
Subscription and payment information.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) NOT NULL, -- free, pro, business, enterprise
  status VARCHAR(50) DEFAULT 'active', -- active, canceled, expired
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
```

## Relationships Diagram

```
users (1) ──────────────── (M) link_pages
  │
  ├── (1) ────────────────── (M) custom_domains
  ├── (1) ────────────────── (1) subscriptions
  └── (1) ────────────────── (M) analytics_events


link_pages (1) ──────────────── (M) links
  │
  ├── (1) ────────────────── (M) qr_codes
  ├── (1) ────────────────── (M) nfc_tags
  └── (1) ────────────────── (M) analytics_events


links (1) ──────────────── (M) qr_codes
  │
  ├── (1) ────────────────── (M) nfc_tags
  └── (1) ────────────────── (M) analytics_events


qr_codes (1) ──────────────── (M) analytics_events
nfc_tags (1) ──────────────── (M) analytics_events
```

## Query Examples

### Get user's link page with all links and analytics
```sql
SELECT 
  lp.id,
  lp.username,
  lp.title,
  COUNT(DISTINCT l.id) as link_count,
  COUNT(DISTINCT ae.id) as total_events,
  SUM(CASE WHEN ae.event_type = 'link_click' THEN 1 ELSE 0 END) as total_clicks,
  SUM(CASE WHEN ae.event_type = 'page_view' THEN 1 ELSE 0 END) as total_views
FROM link_pages lp
LEFT JOIN links l ON l.page_id = lp.id
LEFT JOIN analytics_events ae ON ae.page_id = lp.id
WHERE lp.username = $1 AND lp.is_published = TRUE
GROUP BY lp.id, lp.username, lp.title;
```

### Get top links by clicks
```sql
SELECT 
  l.id,
  l.title,
  COUNT(ae.id) as click_count,
  COUNT(DISTINCT ae.session_id) as unique_visitors,
  MAX(ae.created_at) as last_click
FROM links l
LEFT JOIN analytics_events ae ON ae.link_id = l.id AND ae.event_type = 'link_click'
WHERE l.page_id = $1
GROUP BY l.id, l.title
ORDER BY click_count DESC
LIMIT 10;
```

### Get analytics by country
```sql
SELECT 
  ae.country,
  COUNT(*) as event_count,
  COUNT(DISTINCT ae.session_id) as unique_sessions,
  COUNT(DISTINCT CASE WHEN ae.event_type = 'link_click' THEN ae.id END) as clicks
FROM analytics_events ae
WHERE ae.page_id = $1 AND ae.created_at >= NOW() - INTERVAL '30 days'
GROUP BY ae.country
ORDER BY event_count DESC;
```

## Performance Optimization

### Partitioning
For very large analytics tables, use date-based partitioning:

```sql
CREATE TABLE analytics_events_2024_01 PARTITION OF analytics_events
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE analytics_events_2024_02 PARTITION OF analytics_events
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

### Materialized Views
For frequently accessed aggregations:

```sql
CREATE MATERIALIZED VIEW page_analytics_summary AS
SELECT 
  page_id,
  COUNT(*) as total_events,
  COUNT(DISTINCT session_id) as unique_visitors,
  COUNT(DISTINCT CASE WHEN event_type = 'link_click' THEN id END) as total_clicks
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_id;

CREATE INDEX idx_page_analytics_summary_page_id ON page_analytics_summary(page_id);
```

## Backup Strategy

### Daily Backups
```bash
pg_dump linkora_production | gzip > backups/linkora_$(date +%Y%m%d).sql.gz
```

### Point-in-time Recovery
Enable WAL archiving for complete recovery:

```sql
-- Enable archive mode in postgresql.conf
archive_mode = on
archive_command = 'cp %p /archive/%f'
```

