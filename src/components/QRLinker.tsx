import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QrCode, Link as LinkIcon, CheckCircle2 } from 'lucide-react'
import { qrAPI } from '@/api/qr'
import type { QRCode } from '@/types/qr'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'

export function QRLinker() {
  const { t } = useTranslation()
  const { page } = usePageBuilderStore()
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedQrId, setSelectedQrId] = useState<string>('')
  const [isLinking, setIsLinking] = useState(false)
  const [linkedSuccess, setLinkedSuccess] = useState(false)

  // Current live URL of the page (fallback to id if slug is missing and it exists)
  const pageUrl = page?.settings?.slug 
    ? `https://linkora.io/${page.settings.slug}`
    : page?.id ? `https://linkora.io/p/${page.id}` : '';

  useEffect(() => {
    fetchQRCodes()
  }, [])

  const fetchQRCodes = async () => {
    try {
      setIsLoading(true)
      const response = await qrAPI.list()
      // Auto-select if a QR code already points to this page
      const codes = response.qrCodes || []
      setQrCodes(codes)
      
      if (pageUrl) {
        const existingLink = codes.find(qr => qr.url === pageUrl)
        if (existingLink) {
          setSelectedQrId(existingLink.id)
        }
      }
    } catch (error) {
      console.error('Failed to load QR codes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkQR = async () => {
    if (!selectedQrId) return
    
    try {
      setIsLinking(true)
      setLinkedSuccess(false)
      
      // Update the selected QR Code's data to point to this page's URL
      // We'll also update its name/title so the user knows what it's for
      await qrAPI.update(selectedQrId, {
        name: `${page.settings.title || 'Page'} QR`,
        url: pageUrl
      })
      
      setLinkedSuccess(true)
      setTimeout(() => setLinkedSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to link QR code:', error)
    } finally {
      setIsLinking(false)
    }
  }

  return (
    <div className="mt-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="w-5 h-5 text-accent-600" />
        <h3 className="text-md font-bold text-neutral-900 dark:text-white">{t('components.qrLinker.title')}</h3>
      </div>
      
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        {t('components.qrLinker.description')}
      </p>

      {isLoading ? (
        <div className="text-sm text-neutral-500">{t('components.qrLinker.loading')}</div>
      ) : qrCodes.length === 0 ? (
        <div className="text-sm text-neutral-500 bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
          {t('components.qrLinker.noQr')}
        </div>
      ) : (
        <div className="flex gap-3">
          <select
            value={selectedQrId}
            onChange={(e) => setSelectedQrId(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-600"
          >
            <option value="" disabled>{t('components.qrLinker.selectPlaceholder')}</option>
            {qrCodes.map((qr) => (
              <option key={qr.id} value={qr.id}>
                {qr.name} {qr.url === pageUrl ? t('components.qrLinker.currentlyLinked') : ''}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleLinkQR}
            disabled={!selectedQrId || isLinking}
            className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLinking ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : linkedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {t('components.qrLinker.linked')}
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4" />
                {t('components.qrLinker.link')}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
