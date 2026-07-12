import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { authAPI } from '@/api/auth'
import { supabase } from '@/lib/supabase'

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

  const initialized = useRef(false)

  // Restore session on mount using Supabase session (not localStorage)
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const restoreSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        if (!user) setLoading(true)
        try {
          const response = await authAPI.getCurrentUser()
          setUser(response.user)
          setToken(session.access_token)
        } catch {
          logout()
        } finally {
          setLoading(false)
        }
      }
    }

    restoreSession()

    // Listen for Supabase auth state changes (e.g. tab focus token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          logout()
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setToken(session.access_token)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
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
