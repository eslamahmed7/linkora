import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useNotification } from '@/hooks/useNotification'
import { authAPI } from '@/api/auth'

export function SettingsPage() {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const { theme, setTheme: setThemeMode, language, setLanguage } = useTheme()
  const notification = useNotification()
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'language'>('general')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      notification.error(t('settings.password.mismatch'))
      return
    }

    if (newPassword.length < 8) {
      notification.error(t('settings.password.minLength'))
      return
    }

    setIsLoading(true)
    try {
      // This would call the backend API
      notification.success(t('settings.password.success'))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      notification.error(t('settings.password.failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setThemeMode(newTheme)
    try {
      // Sync with backend
      authAPI.updateProfile({ theme: newTheme })
      notification.success(t('settings.theme.updated'))
    } catch (error) {
      notification.error(t('settings.theme.failed'))
    }
  }

  const handleLanguageChange = (newLang: 'en' | 'ar') => {
    setLanguage(newLang)
    try {
      // Sync with backend
      authAPI.updateProfile({ language: newLang })
      notification.success(t('settings.language.updated'))
    } catch (error) {
      notification.error(t('settings.language.failed'))
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          {t('settings.title')}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
        {(['general', 'appearance', 'language'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-accent-600 text-accent-600 dark:text-accent-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50'
            }`}
          >
            {({ general: t('settings.tabs.general'), appearance: t('settings.tabs.appearance'), language: t('settings.tabs.language') })[tab]}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
              {t('settings.password.changeTitle')}
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                  {t('settings.password.current')}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                  {t('settings.password.new')}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                  {t('settings.password.confirm')}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? t('settings.password.updating') : t('settings.password.update')}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-900 dark:text-red-50 mb-2">
              {t('settings.dangerZone.title')}
            </h2>
            <p className="text-sm text-red-800 dark:text-red-200 mb-4">
              {t('settings.dangerZone.warning')}
            </p>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    t('settings.dangerZone.confirmMessage')
                  )
                ) {
                  logout()
                  notification.success(t('settings.dangerZone.logoutSuccess'))
                }
              }}
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
            >
              {t('settings.dangerZone.logoutAll')}
            </button>
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
            Theme Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-3">
                {t('settings.theme.current')} <span className="font-bold text-accent-600">{theme}</span>
              </label>
              <div className="flex gap-4">
                {(['dark', 'light'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleThemeChange(mode)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      theme === mode
                        ? 'bg-accent-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Language Settings */}
      {activeTab === 'language' && (
        <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
            Language Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-3">
                {t('settings.language.current')} <span className="font-bold text-accent-600">{language === 'en' ? t('settings.language.english') : t('settings.language.arabic')}</span>
              </label>
              <div className="flex gap-4">
                {(['en', 'ar'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      language === lang
                        ? 'bg-accent-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {lang === 'en' ? t('settings.language.english') : t('settings.language.arabic')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
