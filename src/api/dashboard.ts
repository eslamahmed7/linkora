import { apiClient } from './client'

export interface DashboardStats {
  pagesCount: number
  qrCount: number
  scansCount: number
  clickCount: number
  storageUsage: number
}

export interface RecentActivity {
  id: string
  type: 'page' | 'qr'
  title: string
  handle?: string
  isPublished?: boolean
  createdAt: string
}

export const dashboardAPI = {
  async getStats(): Promise<{ stats: DashboardStats }> {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats')
    return { stats: response.data as DashboardStats }
  },

  async getRecentActivity(): Promise<{ activities: RecentActivity[] }> {
    const response = await apiClient.get<{ activities: RecentActivity[] }>('/dashboard/activity')
    const data = response.data as any
    return { activities: data?.activities || [] }
  }
}
