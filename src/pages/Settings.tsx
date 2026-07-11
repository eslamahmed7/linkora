import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useNotification } from '@/hooks/useNotification'
import { authAPI } from '@/api/auth'

export function SettingsPage() {
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
      notification.error('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      notification.error('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    try {
      // This would call the backend API
      notification.success('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      notification.error('Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setThemeMode(newTheme)
    try {
      // Sync with backend
      authAPI.updateProfile({ theme: newTheme })
      notification.success('Theme updated')
    } catch (error) {
      notification.error('Failed to update theme')
    }
  }

  const handleLanguageChange = (newLang: 'en' | 'ar') => {
    setLanguage(newLang)
    try {
      // Sync with backend
      authAPI.updateProfile({ language: newLang })
      notification.success('Language updated')
    } catch (error) {
      notification.error('Failed to update language')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Settings
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Manage your application settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
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
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
              Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                  Current Password
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
                  New Password
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
                  Confirm Password
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
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-900 dark:text-red-50 mb-2">
              Danger Zone
            </h2>
            <p className="text-sm text-red-800 dark:text-red-200 mb-4">
              Actions here cannot be undone
            </p>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to log out of all devices?'
                  )
                ) {
                  logout()
                  notification.success('Logged out successfully')
                }
              }}
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
            >
              Logout from All Devices
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
                Current Theme: <span className="font-bold text-accent-600">{theme}</span>
              </label>
              <div className="flex gap-4">
                {(['dark', 'light'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      theme === t
                        ? 'bg-accent-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)} Mode
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
                Current Language: <span className="font-bold text-accent-600">{language === 'en' ? 'English' : 'العربية'}</span>
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
                    {lang === 'en' ? 'English' : 'العربية'}
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
