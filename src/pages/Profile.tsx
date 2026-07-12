import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useNotification } from '@/hooks/useNotification'
import { authAPI } from '@/api/auth'
import { Upload, Camera } from 'lucide-react'

export function ProfilePage() {
  const { t } = useTranslation()
  const { user, updateUser } = useAuth()
  const notification = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    email: user?.email || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      const formDataToSend = new FormData()
      formDataToSend.append('avatar', file)

      const response = await authAPI.updateProfile({
        avatar: URL.createObjectURL(file),
      })
      updateUser(response)
      notification.success(t('profile.avatarSuccess'))
    } catch (error) {
      notification.error(t('profile.avatarFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCoverUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      const formDataToSend = new FormData()
      formDataToSend.append('cover', file)

      const response = await authAPI.updateProfile({
        cover: URL.createObjectURL(file),
      })
      updateUser(response)
      notification.success(t('profile.coverSuccess'))
    } catch (error) {
      notification.error(t('profile.coverFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authAPI.updateProfile(formData)
      updateUser(response)
      notification.success(t('profile.profileSuccess'))
    } catch (error) {
      notification.error(t('profile.profileFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          {t('profile.title')}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          {t('profile.subtitle')}
        </p>
      </div>

      {/* Cover Image */}
      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-accent-600 to-accent-400">
          {user?.cover && (
            <img
              src={user.cover}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            className="hidden"
          />
        </div>

        {/* Avatar */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-6">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-32 h-32 rounded-xl object-cover border-4 border-white dark:border-neutral-950"
                />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-neutral-200 dark:bg-neutral-800 border-4 border-white dark:border-neutral-950 flex items-center justify-center">
                  <span className="text-4xl">📷</span>
                </div>
              )}
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {user?.email}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('profile.memberSince')}{' '}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
              {t('profile.fields.displayName')}
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
              {t('profile.fields.username')}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
              {t('profile.fields.bio')}
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
              placeholder={t('profile.bioPlaceholder')}
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
              {t('profile.fields.email')}
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-not-allowed"
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {t('profile.emailHelper')}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('profile.saving') : t('profile.saveChanges')}
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                displayName: user?.displayName || '',
                username: user?.username || '',
                bio: user?.bio || '',
                email: user?.email || '',
              })
            }
            className="px-6 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            {t('profile.discard')}
          </button>
        </div>
      </form>
    </div>
  )
}
