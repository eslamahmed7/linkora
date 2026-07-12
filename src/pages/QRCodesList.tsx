import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { qrAPI } from '@/api/qr'
import { pagesAPI } from '@/api/pages'
import { useNotification } from '@/hooks/useNotification'
import { Plus, Search, Trash2, Copy, Edit2, Power, Layout } from 'lucide-react'
import type { QRCode } from '@/types/qr'

export function QRCodesListPage() {
  const { t } = useTranslation()
  const notification = useNotification()
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [pages, setPages] = useState<{ id: string; slug: string; title: string }[]>([])

  useEffect(() => {
    fetchQRCodes()
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const res = await pagesAPI.list()
      setPages(res.pages)
    } catch (e) {}
  }

  const fetchQRCodes = async () => {
    try {
      setIsLoading(true)
      const response = await qrAPI.list()
      setQrCodes(response.qrCodes)
    } catch (error) {
      notification.error(t('qrList.toasts.loadFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('qrList.confirmDelete'))) {
      return
    }

    try {
      await qrAPI.delete(id)
      setQrCodes((prev) => prev.filter((qr) => qr.id !== id))
      notification.success(t('qrList.toasts.deleted'))
    } catch (error) {
      notification.error(t('qrList.toasts.deleteFailed'))
    }
  }

  const handleToggle = async (id: string) => {
    try {
      const response = await qrAPI.toggle(id)
      setQrCodes((prev) =>
        prev.map((qr) => (qr.id === id ? response.qrCode : qr))
      )
      notification.success(
        response.qrCode.isActive ? t('qrList.toasts.activated') : t('qrList.toasts.deactivated')
      )
    } catch (error) {
      notification.error(t('qrList.toasts.updateFailed'))
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    notification.success(t('qrList.toasts.urlCopied'))
  }

  const filteredQRCodes = qrCodes.filter((qr) =>
    qr.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            {t('qrList.title')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {t('qrList.subtitle')}
          </p>
        </div>
        <Link
          to="/qr/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('qrList.createQR')}
        </Link>
      </div>

      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('qrList.searchPlaceholder')}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
        />
      </div>

      {/* QR Codes Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredQRCodes.length > 0 ? (
        <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  {t('qrList.table.name')}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  {t('qrList.table.url')}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  {t('qrList.table.scans')}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  {t('qrList.table.status')}
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold">
                  {t('qrList.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQRCodes.map((qr) => (
                <tr
                  key={qr.id}
                  className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex flex-col">
                      <span>{qr.name}</span>
                      {qr.customization?.dataType === 'landing-page' && pages.find(p => p.id === qr.pageId) && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded w-max">
                          <Layout className="w-3 h-3" />
                          {t('qrList.linkedTo')} {pages.find(p => p.id === qr.pageId)?.title}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-xs">
                    {qr.url}
                  </td>
                  <td className="px-6 py-4 text-sm">{qr.scans}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        qr.isActive
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {qr.isActive ? t('common.active') : t('common.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/qr/${qr.id}`}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        title={t('qrList.actions.edit')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleCopyUrl(qr.url)}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        title={t('qrList.actions.copyUrl')}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggle(qr.id)}
                        className={`p-2 rounded-lg ${
                          qr.isActive
                            ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600'
                            : 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600'
                        }`}
                        title={qr.isActive ? t('qrList.actions.deactivate') : t('qrList.actions.activate')}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(qr.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                        title={t('qrList.actions.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            {t('qrList.empty')}
          </p>
          <Link
            to="/qr/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('qrList.createQR')}
          </Link>
        </div>
      )}
    </div>
  )
}
