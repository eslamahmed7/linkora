import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { authAPI } from '@/api/auth'

export function useAuth() {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    setUser,
    setToken,
    setLoading,
    logout,
    updateUser,
  } = useAuthStore()

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      // With Supabase we could get token from session instead of localStorage, 
      // but if we are already authenticated in store, we verify it.
      const storedToken = localStorage.getItem('authToken')
      if (storedToken) {
        // Only set loading if we don't have a cached user yet
        if (!user) setLoading(true)
        try {
          const response = await authAPI.getCurrentUser()
          setUser(response.user)
          setToken(storedToken)
        } catch (error) {
          logout()
        } finally {
          setLoading(false)
        }
      }
    }

    restoreSession()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await authAPI.login(email, password)
      setToken(response.token)
      setUser(response.user)
      return response
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    email: string,
    password: string,
    username: string,
  ) => {
    setLoading(true)
    try {
      const response = await authAPI.register(email, password, username)
      setToken(response.token)
      setUser(response.user)
      return response
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async () => {
    setLoading(true)
    try {
      await authAPI.googleLogin()
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await authAPI.logout()
      logout()
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    googleLogin,
    logout: handleLogout,
    updateUser,
  }
}
