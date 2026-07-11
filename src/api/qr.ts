import { apiClient } from './client'
import type { QRCode, CreateQRRequest, UpdateQRRequest, QRAnalytics } from '@/types/qr'

export const qrAPI = {
  async list(): Promise<{ qrCodes: QRCode[]; total: number }> {
    const response = await apiClient.get<any>(
      '/qr'
    )
    if (response.data) {
      return { qrCodes: response.data.items || [], total: response.data.total || 0 }
    }
    return { qrCodes: [], total: 0 }
  },

  async get(id: string): Promise<{ qrCode: QRCode }> {
    const response = await apiClient.get<QRCode>(`/qr/${id}`)
    return { qrCode: response.data as QRCode }
  },

  async create(data: CreateQRRequest): Promise<{ qrCode: QRCode }> {
    const response = await apiClient.post<QRCode>('/qr', data)
    return { qrCode: response.data as QRCode }
  },

  async update(id: string, data: UpdateQRRequest): Promise<{ qrCode: QRCode }> {
    const response = await apiClient.put<QRCode>(`/qr/${id}`, data)
    return { qrCode: response.data as QRCode }
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/qr/${id}`)
  },

  async toggle(id: string): Promise<{ qrCode: QRCode }> {
    const response = await apiClient.post<QRCode>(
      `/qr/${id}/toggle`,
      {}
    )
    return { qrCode: response.data as QRCode }
  },

  async getAnalytics(id: string): Promise<{ analytics: QRAnalytics }> {
    const response = await apiClient.get<QRAnalytics>(
      `/qr/${id}/analytics`
    )
    return { analytics: response.data as QRAnalytics }
  },

  async download(id: string, format: 'png' | 'svg'): Promise<Blob> {
    const token = localStorage.getItem('authToken')
    const response = await fetch(`/api/qr/${id}/download?format=${format}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    if (!response.ok) throw new Error(`Failed to download QR code: ${response.statusText}`)
    return await response.blob()
  },
}
