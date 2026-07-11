export interface UploadedFile {
  id: string
  name: string
  url: string
  type: 'image' | 'document' | 'video' | 'other'
  mimeType: string
  size: number
  uploadedAt: string
  isPublic: boolean
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
export const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
