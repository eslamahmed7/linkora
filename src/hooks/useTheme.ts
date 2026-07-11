import { useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'

export function useTheme() {
  const { theme, setTheme, toggleTheme, language, setLanguage } = useThemeStore()

  useEffect(() => {
    // Initialize theme on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Initialize language direction
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [theme, language])

  return { theme, setTheme, toggleTheme, language, setLanguage }
}
