import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  displayName: string
  username: string
  avatar?: string
  cover?: string
  bio?: string
  role?: string
  is_suspended?: boolean
  theme: 'dark' | 'light'
  language: 'en' | 'ar'
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: localStorage.getItem('authToken'),
      isLoading: false,
      isAuthenticated: !!localStorage.getItem('authToken'),

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => {
        if (token) {
          localStorage.setItem('authToken', token)
        } else {
          localStorage.removeItem('authToken')
        }
        set({ token, isAuthenticated: !!token })
      },

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () => {
        localStorage.removeItem('authToken')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...updates,
              }
            : null,
        })),
    }),
    {
      name: 'auth-store',
    }
  )
)
