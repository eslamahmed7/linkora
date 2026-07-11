import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'
type Language = 'en' | 'ar'

interface ThemeStore {
  theme: Theme
  language: Language
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: (localStorage.getItem('theme') as Theme) || 'dark',
      language: (localStorage.getItem('language') as Language) || 'en',
      setTheme: (theme: Theme) => {
        set({ theme })
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
      },
      setLanguage: (language: Language) => {
        set({ language })
        localStorage.setItem('language', language)
        document.documentElement.lang = language
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
      },
      toggleTheme: () => {
        const current = get().theme
        const newTheme: Theme = current === 'dark' ? 'light' : 'dark'
        get().setTheme(newTheme)
      },
    }),
    {
      name: 'theme-store',
      version: 1,
    }
  )
)
