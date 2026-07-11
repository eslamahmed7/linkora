import { apiClient } from './client'

export interface LinkPage {
  id: string
  userId: string
  handle: string
  title: string
  description?: string
  bio?: string
  isPublished: boolean
  theme: string
  backgroundColor?: string
  backgroundImage?: string
  profileImageUrl?: string
  profileImagePosition?: 'top' | 'center'
  customDomain?: string
  design?: any
  links: any[]
  qrCodes: any[]
  analytics?: {
    totalClicks: number
    uniqueVisitors: number
    topCountries: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface CreatePageRequest {
  handle: string
  title: string
  description?: string
}

export interface UpdatePageRequest {
  title?: string
  description?: string
  slug?: string
  visibility?: 'public' | 'private'
  status?: 'draft' | 'published'
  theme?: string
  backgroundColor?: string
  profileImageUrl?: string
  [key: string]: any
}

export const pagesAPI = {
  async list(): Promise<{ pages: { id: string; slug: string; title: string; status: 'draft' | 'published'; createdAt: string; updatedAt: string }[]; total: number }> {
    const response = await apiClient.get<any>(
      '/pages'
    )
    if (response.data) {
      return { pages: response.data.items || [], total: response.data.total || 0 }
    }
    return { pages: [], total: 0 }
  },

  async get(id: string): Promise<{ page: LinkPage }> {
    const response = await apiClient.get<LinkPage>(`/pages/${id}`)
    return { page: response.data as LinkPage }
  },

  async create(data: CreatePageRequest): Promise<{ page: LinkPage }> {
    const response = await apiClient.post<LinkPage>(
      '/pages',
      data
    )
    return { page: response.data as LinkPage }
  },

  async update(
    id: string,
    data: UpdatePageRequest
  ): Promise<{ page: LinkPage }> {
    const response = await apiClient.put<LinkPage>(
      `/pages/${id}`,
      data
    )
    return { page: response.data as LinkPage }
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/pages/${id}`)
  },

  async duplicate(id: string): Promise<{ page: LinkPage }> {
    const response = await apiClient.post<LinkPage>(
      `/pages/${id}/duplicate`,
      {}
    )
    return { page: response.data as LinkPage }
  },

  async archive(id: string): Promise<{ page: LinkPage }> {
    const response = await apiClient.put<LinkPage>(
      `/pages/${id}`,
      { status: 'archived' }
    )
    return { page: response.data as LinkPage }
  },

  async restore(id: string): Promise<{ page: LinkPage }> {
    const response = await apiClient.put<LinkPage>(
      `/pages/${id}`,
      { status: 'published' }
    )
    return { page: response.data as LinkPage }
  },

  async getPublic(slug: string): Promise<{ page: LinkPage }> {
    const response = await apiClient.get<LinkPage>(
      `/public/${slug}`
    )
    return { page: response.data as LinkPage }
  },
}
