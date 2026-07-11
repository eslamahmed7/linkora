import { apiClient } from './client'
import type { AnalyticsResponse, AnalyticsStats, ClickEvent } from '@/types/analytics'

export const analyticsAPI = {
  async getPageStats(pageId: string): Promise<AnalyticsResponse> {
    const response = await apiClient.get<AnalyticsResponse>(
      `/analytics/${pageId}`
    )
    return response.data as AnalyticsResponse || ({
      stats: {
        totalClicks: 0,
        uniqueVisitors: 0,
        clicksToday: 0,
        visitorsToday: 0,
        topLinks: [],
        topCountries: [],
        deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
        browserStats: [],
      },
      dailyStats: [],
      lastUpdated: new Date().toISOString(),
    })
  },

  async getLinkStats(linkId: string): Promise<AnalyticsStats> {
    const response = await apiClient.get<AnalyticsStats>(
      `/analytics/link/${linkId}`
    )
    return response.data as AnalyticsStats || ({
      totalClicks: 0,
      uniqueVisitors: 0,
      clicksToday: 0,
      visitorsToday: 0,
      topLinks: [],
      topCountries: [],
      deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
      browserStats: [],
    })
  },

  async getQRStats(qrCodeId: string): Promise<AnalyticsStats> {
    const response = await apiClient.get<AnalyticsStats>(
      `/analytics/qr/${qrCodeId}`
    )
    return response.data as AnalyticsStats || ({
      totalClicks: 0,
      uniqueVisitors: 0,
      clicksToday: 0,
      visitorsToday: 0,
      topLinks: [],
      topCountries: [],
      deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
      browserStats: [],
    })
  },

  async getEvents(pageId: string): Promise<{ events: ClickEvent[] }> {
    const response = await apiClient.get<any>(
      `/analytics/${pageId}/events`
    )
    if (response.data) {
      return { events: response.data.items || [] }
    }
    return { events: [] }
  },

  async trackClick(data: {
    pageId?: string
    linkId?: string
    qrCodeId?: string
    nfcCardId?: string
  }): Promise<void> {
    await apiClient.post('/analytics/track', data)
  },

  async getDashboardStats(): Promise<AnalyticsResponse> {
    const response = await apiClient.get<AnalyticsResponse>('/analytics/dashboard')
    return response.data || ({
      stats: {
        totalClicks: 0,
        uniqueVisitors: 0,
        clicksToday: 0,
        visitorsToday: 0,
        topLinks: [],
        topCountries: [],
        deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
        browserStats: [],
      },
      dailyStats: [],
      lastUpdated: new Date().toISOString(),
    })
  },
}
