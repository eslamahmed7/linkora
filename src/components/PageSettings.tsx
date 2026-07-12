import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { Settings, Upload, Image as ImageIcon, Copy } from 'lucide-react'
import { ImageCropperModal } from './ImageCropperModal'
import { useNotification } from '@/hooks/useNotification'
import { qrAPI } from '@/api/qr'
import type { QRCode } from '@/types/qr'

export function PageSettings() {
  const { t } = useTranslation()
  const { page, updateSettings, updateDesign } = usePageBuilderStore()
  const { settings, design } = page
  const notification = useNotification()

  const [cropperState, setCropperState] = useState<{
    isOpen: boolean
    imageUrl: string
    type: 'profile' | 'background' | null
  }>({
    isOpen: false,
    imageUrl: '',
    type: null,
  })

  const [qrCodes, setQrCodes] = useState<QRCode[]>([])

  useEffect(() => {
    qrAPI.list().then(res => {
      setQrCodes(res.qrCodes)
    }).catch(() => {})
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'background') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCropperState({
          isOpen: true,
          imageUrl: reader.result as string,
          type,
        })
      }
      reader.readAsDataURL(file)
    }
    // reset input so the same file can be selected again if needed
    e.target.value = ''
  }

  const handleCropSave = (croppedImageUrl: string) => {
    if (cropperState.type === 'profile') {
      updateDesign({ profileImageUrl: croppedImageUrl })
    } else if (cropperState.type === 'background') {
      updateDesign({ backgroundImage: croppedImageUrl })
    }
    setCropperState({ isOpen: false, imageUrl: '', type: null })
  }

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-accent-600" />
        <h2 className="text-lg font-bold">{t('components.pageSettings.title')}</h2>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
            {t('components.pageSettings.fields.pageTitle')}
          </label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => updateSettings({ title: e.target.value })}
            placeholder={t('components.pageSettings.fields.pageTitlePlaceholder')}
            className="w-full px-3 py-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
          />
        </div>

        {/* Slug / Page URL */}
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
            {t('components.pageSettings.fields.slug')}
          </label>
          <div className="flex rounded border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <span className="px-3 py-2 text-neutral-500 font-medium whitespace-nowrap border-r border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
              {window.location.host}/p/
            </span>
            <input
              type="text"
              value={settings.slug || ''}
              onChange={(e) =>
                updateSettings({
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                })
              }
              placeholder={t('components.pageSettings.fields.slugPlaceholder')}
              className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:outline-none"
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {settings.slug ? t('components.pageSettings.fields.linkHelper') : t('components.pageSettings.fields.slugHelper')}
            </p>
            {settings.slug && (
              <button 
                onClick={() => {
                  const baseUrl = window.location.origin;
                  navigator.clipboard.writeText(`${baseUrl}/p/${settings.slug}`);
                  notification.success(t('components.pageSettings.toasts.linkCopied'));
                }}
                className="text-xs font-bold text-accent-600 hover:text-accent-700 flex items-center gap-1 bg-accent-50 dark:bg-accent-900/20 px-2 py-1 rounded"
              >
                <Copy className="w-3 h-3" /> {t('components.pageSettings.buttons.copyLink')}
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
            {t('components.pageSettings.fields.description')}
          </label>
          <textarea
            value={settings.description || ''}
            onChange={(e) =>
              updateSettings({ description: e.target.value })
            }
            placeholder={t('components.pageSettings.fields.descPlaceholder')}
            rows={3}
            className="w-full px-3 py-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
            {t('components.pageSettings.fields.bio')}
          </label>
          <textarea
            value={settings.bio || ''}
            onChange={(e) => updateSettings({ bio: e.target.value })}
            placeholder={t('components.pageSettings.fields.bioPlaceholder')}
            rows={3}
            className="w-full px-3 py-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
          />
        </div>

        {/* Profile Image Upload */}
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
            {t('components.pageSettings.fields.profileImage')}
          </label>
          <div className="flex items-center gap-4">
            {design.profileImageUrl ? (
              <img
                src={design.profileImageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-neutral-400" />
              </div>
            )}
            <label className="cursor-pointer px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {t('components.pageSettings.buttons.uploadImage')}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e, 'profile')}
              />
            </label>
            {design.profileImageUrl && (
              <button
                onClick={() => updateDesign({ profileImageUrl: '' })}
                className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
              >
                {t('components.pageSettings.buttons.remove')}
              </button>
            )}
          </div>
        </div>

        {/* Background Image Upload */}
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
            {t('components.pageSettings.fields.bgImage')}
          </label>
          <div className="flex flex-col gap-3">
            {design.backgroundImage && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                <img
                  src={design.backgroundImage}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                {t('components.pageSettings.buttons.uploadBg')}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, 'background')}
                />
              </label>
              {design.backgroundImage && (
                <button
                  onClick={() => updateDesign({ backgroundImage: '' })}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                >
                  {t('components.pageSettings.buttons.remove')}
                </button>
              )}
            </div>

            {/* Customization controls for Background Image */}
            {design.backgroundImage && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                    {t('components.pageSettings.fields.sizeScale')}
                  </label>
                  <select
                    value={design.backgroundImageSize || 'cover'}
                    onChange={(e) => updateDesign({ backgroundImageSize: e.target.value as any })}
                    className="w-full px-2 py-1.5 text-sm rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
                  >
                    <option value="cover">{t('components.pageSettings.sizeOptions.cover')}</option>
                    <option value="contain">{t('components.pageSettings.sizeOptions.contain')}</option>
                    <option value="auto">{t('components.pageSettings.sizeOptions.auto')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                    {t('components.pageSettings.fields.position')}
                  </label>
                  <select
                    value={design.backgroundImagePosition || 'center'}
                    onChange={(e) => updateDesign({ backgroundImagePosition: e.target.value as any })}
                    className="w-full px-2 py-1.5 text-sm rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
                  >
                    <option value="center">{t('components.pageSettings.positionOptions.center')}</option>
                    <option value="top">{t('components.pageSettings.positionOptions.top')}</option>
                    <option value="bottom">{t('components.pageSettings.positionOptions.bottom')}</option>
                    <option value="left">{t('components.pageSettings.positionOptions.left')}</option>
                    <option value="right">{t('components.pageSettings.positionOptions.right')}</option>
                  </select>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Link with QR Code */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
            {t('components.pageSettings.fields.linkQR')}
          </label>
          <select
            value={design.linkedQrId || ''}
            onChange={async (e) => {
              const qrId = e.target.value
              updateDesign({ linkedQrId: qrId })
              if (qrId && page.id) {
                const selectedQr = qrCodes.find(q => q.id === qrId)
                if (selectedQr) {
                  const baseUrl = window.location.origin
                  const pageUrl = `${baseUrl}/p/${settings.slug || page.id}`
                  try {
                    await qrAPI.update(qrId, {
                      pageId: page.id,
                      url: pageUrl,
                      customization: {
                        ...(selectedQr.customization || {}),
                        dataType: 'landing-page',
                        data: { pageId: page.id, url: pageUrl }
                      } as any
                    })
                    notification.success(t('components.pageSettings.toasts.qrLinked'))
                  } catch (error) {
                    notification.error(t('components.pageSettings.toasts.qrFailed'))
                  }
                }
              }
            }}
            className="w-full px-3 py-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
          >
            <option value="">{t('components.pageSettings.fields.selectQR')}</option>
            {qrCodes.map(qr => (
              <option key={qr.id} value={qr.id}>{qr.name || qr.url || qr.id}</option>
            ))}
          </select>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {t('components.pageSettings.fields.linkQRHelper')}
          </p>
        </div>
      </div>



      {cropperState.isOpen && cropperState.imageUrl && (
        <ImageCropperModal
          imageUrl={cropperState.imageUrl}
          aspectRatio={cropperState.type === 'profile' ? 1 : 9 / 16}
          circularCrop={cropperState.type === 'profile'}
          onSave={handleCropSave}
          onCancel={() => setCropperState({ isOpen: false, imageUrl: '', type: null })}
        />
      )}
    </div>
  )
}
