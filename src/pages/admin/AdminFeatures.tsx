import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Sparkles, ChevronLeft, ChevronRight, X, Save,
  ThumbsUp, Calendar, User,
} from 'lucide-react'
import { adminFeatures } from '@/api/admin'
import type { FeatureRequest, FeatureStatus } from '@/types/admin'

const STATUS_OPTIONS: FeatureStatus[] = ['open', 'accepted', 'rejected', 'merged', 'scheduled', 'in_progress', 'completed']

const STATUS_STYLES: Record<FeatureStatus, string> = {
  open: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  accepted: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  merged: 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
  scheduled: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  in_progress: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
}

export function AdminFeaturesPage() {
  const { t } = useTranslation()
  const [features, setFeatures] = useState<FeatureRequest[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<FeatureStatus | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<FeatureRequest | null>(null)
  const [editStatus, setEditStatus] = useState<FeatureStatus>('open')
  const [editNotes, setEditNotes] = useState('')
  const [editScheduledDate, setEditScheduledDate] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const limit = 20

  useEffect(() => { loadFeatures() }, [page, statusFilter])

  const loadFeatures = async () => {
    try {
      setIsLoading(true)
      const res = await adminFeatures.list({
        status: statusFilter || undefined,
        page,
        limit,
      })
      if (res.data) { setFeatures(res.data.features); setTotal(res.data.total) }
    } catch {} finally { setIsLoading(false) }
  }

  const openDetail = (feature: FeatureRequest) => {
    setSelected(feature)
    setEditStatus(feature.status)
    setEditNotes(feature.admin_notes || '')
    setEditScheduledDate(feature.scheduled_date ? feature.scheduled_date.split('T')[0] : '')
  }

  const handleSave = async () => {
    if (!selected) return
    try {
      setIsSaving(true)
      await adminFeatures.update(selected.id, {
        status: editStatus,
        admin_notes: editNotes,
        scheduled_date: editScheduledDate || undefined,
      })
      setFeatures(features.map(f =>
        f.id === selected.id ? { ...f, status: editStatus, admin_notes: editNotes, scheduled_date: editScheduledDate || undefined } : f
      ))
      setSelected(null)
    } catch {} finally { setIsSaving(false) }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{t('admin.features.title')}</h1>
        <p className="text-sm text-neutral-500 mt-0.5">{t('admin.features.subtitle', { total })}</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => { setStatusFilter(''); setPage(1) }}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
            statusFilter === ''
              ? 'bg-accent-600 text-white'
              : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
          }`}
        >
          {t('common.all')}
        </button>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-accent-600 text-white'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className={`bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex-1 ${selected ? 'hidden lg:block' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.features.table.feature')}</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden md:table-cell">{t('admin.features.table.user')}</th>
                  <th className="text-center px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.features.table.votes')}</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.features.table.status')}</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">{t('admin.features.table.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" /></td></tr>
                  ))
                ) : features.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-neutral-400">{t('admin.features.empty')}</td></tr>
                ) : features.map(feature => (
                  <tr
                    key={feature.id}
                    onClick={() => openDetail(feature)}
                    className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${selected?.id === feature.id ? 'bg-accent-50 dark:bg-accent-950/10' : ''}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{feature.title}</p>
                          {feature.description && (
                            <p className="text-xs text-neutral-400 truncate max-w-[250px]">{feature.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-300 shrink-0">
                          {feature.user?.display_name?.[0] || '?'}
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-[120px]">{feature.user?.display_name || t('common.unknown')}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-700 dark:text-neutral-300">
                          <ThumbsUp className="w-3 h-3" />
                          {feature.vote_count}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[feature.status]}`}>
                        {feature.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <p className="text-xs text-neutral-500">{new Date(feature.created_at).toLocaleDateString()}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-xs text-neutral-500">{t('common.pageOf', { page, total: totalPages })}</p>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-full lg:w-[400px] shrink-0 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="font-bold text-neutral-900 dark:text-white text-sm">{t('admin.features.detailTitle')}</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{selected.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{selected.user?.display_name || t('common.unknown')}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(selected.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{t('admin.features.votesCount', { count: selected.vote_count })}</span>
                </div>
              </div>

              {selected.description && (
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.features.fields.description')}</label>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1 whitespace-pre-wrap">{selected.description}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.features.fields.status')}</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as FeatureStatus)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.features.fields.scheduledDate')}</label>
                <input
                  type="date"
                  value={editScheduledDate}
                  onChange={e => setEditScheduledDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.features.fields.adminNotes')}</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder={t('admin.features.notesPlaceholder')}
                  rows={4}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-600 resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSaving ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
