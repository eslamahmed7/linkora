// API Client for frontend-backend communication
import { supabase } from '@/lib/supabase';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  status: number
  message: string
  code: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }

      const fetchOptions: RequestInit = {
        ...options,
        cache: 'no-store',
      };

      if (options.headers && typeof options.headers === 'object') {
        Object.assign(headers, options.headers)
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: { message: response.statusText },
        }))
        const errorMessage = error.error?.message || error.message || `HTTP ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error');
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }
}

export const apiClient = new ApiClient()
