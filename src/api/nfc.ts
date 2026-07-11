import { apiClient } from './client'
import type { NFCCard, NFCWriteResult, CardDesign } from '@/types/nfc'

export const nfcAPI = {
  async list(): Promise<{ cards: NFCCard[] }> {
    const response = await apiClient.get<any>('/nfc')
    if (response.data) {
      return { cards: response.data.items || [] }
    }
    return { cards: [] }
  },

  async get(id: string): Promise<{ card: NFCCard }> {
    const response = await apiClient.get<NFCCard>(`/nfc/${id}`)
    return { card: response.data as NFCCard }
  },

  async create(data: Partial<NFCCard>): Promise<{ card: NFCCard }> {
    const response = await apiClient.post<NFCCard>('/nfc', data)
    return { card: response.data as NFCCard }
  },

  async update(id: string, data: Partial<NFCCard>): Promise<{ card: NFCCard }> {
    const response = await apiClient.put<NFCCard>(`/nfc/${id}`, data)
    return { card: response.data as NFCCard }
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/nfc/${id}`)
  },

  async write(id: string, tagId: string): Promise<NFCWriteResult> {
    const response = await apiClient.post<NFCWriteResult>(
      `/nfc/${id}/write`,
      { tagId }
    )
    return response.data as NFCWriteResult || ({ success: false, message: 'Write failed' })
  },

  async read(): Promise<{ data: any }> {
    const response = await apiClient.post<any>('/nfc/read', {})
    return { data: response.data || null }
  },

  async toggleActive(id: string): Promise<{ card: NFCCard }> {
    const response = await apiClient.put<NFCCard>(
      `/nfc/${id}/toggle`,
      {}
    )
    return { card: response.data as NFCCard }
  },

  async saveDesign(id: string, cardDesign: CardDesign): Promise<{ card: NFCCard }> {
    const response = await apiClient.put<NFCCard>(
      `/nfc/${id}/design`,
      { cardDesign }
    )
    return { card: response.data as NFCCard }
  },
}
