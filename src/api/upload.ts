import { apiClient } from './client'
import type { UploadedFile } from '@/types/upload'

export const uploadAPI = {
  async uploadImage(file: File): Promise<{ file: UploadedFile }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  },

  async uploadFile(file: File): Promise<{ file: UploadedFile }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'file')

    try {
      const response = await fetch('/api/upload/file', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  },

  async listFiles(): Promise<{ files: UploadedFile[] }> {
    const response = await apiClient.get<any>('/upload/files')
    if (response.data) {
      return { files: response.data.items || [] }
    }
    return { files: [] }
  },

  async deleteFile(id: string): Promise<void> {
    await apiClient.delete(`/upload/files/${id}`)
  },

  async updateFilePermissions(
    id: string,
    isPublic: boolean
  ): Promise<{ file: UploadedFile }> {
    const response = await apiClient.put<UploadedFile>(
      `/upload/files/${id}`,
      { isPublic }
    )
    return { file: response.data as UploadedFile }
  },
}
