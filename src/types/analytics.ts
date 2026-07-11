export interface ClickEvent {
  id: string
  pageId: string
  linkId?: string
  qrCodeId?: string
  nfcCardId?: string
  timestamp: string
  referrer?: string
  userAgent: string
  ipAddress: string
  country?: string
  city?: string
  device: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
}

export interface AnalyticsStats {
  totalClicks: number
  uniqueVisitors: number
  clicksToday: number
  visitorsToday: number
  topLinks: Array<{
    linkId: string
    title: string
    clicks: number
    percentage: number
  }>
  topCountries: Array<{
    country: string
    clicks: number
    percentage: number
  }>
  deviceBreakdown: {
    desktop: number
    mobile: number
    tablet: number
  }
  browserStats: Array<{
    browser: string
    clicks: number
    percentage: number
  }>
}

export interface AnalyticsPeriod {
  date: string
  clicks: number
  uniqueVisitors: number
}

export interface AnalyticsResponse {
  stats: AnalyticsStats
  dailyStats: AnalyticsPeriod[]
  lastUpdated: string
}
