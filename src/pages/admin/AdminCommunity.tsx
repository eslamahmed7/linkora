import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Search, Check, X, MessageSquare, ChevronLeft, ChevronRight,
  Layers, AlertCircle, ExternalLink, Tag, User, Palette, Clock,
} from 'lucide-react'
import { adminSubmissions } from '@/api/admin'
import { SUBMISSION_STATUS_LABELS, SUBMISSION_STATUS_COLORS, type CommunitySubmission, type SubmissionStatus } from '@/types/admin'

export function AdminCommunityPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [actionModal, setActionModal] = useState<{ submission: CommunitySubmission; action: 'approve' | 'reject' | 'changes' } | null>(null)
  const [actionNote, setActionNote] = useState('')
  const limit = 20

  useEffect(() => { loadSubmissions() }, [page, statusFilter])

  const loadSubmissions = async () => {
    try {
      setIsLoading(true)
      const res = await adminSubmissions.list({ search, status: statusFilter as SubmissionStatus || undefined, page, limit })
      if (res.data) { setSubmissions(res.data.submissions); setTotal(res.data.total) }
    } catch {} finally { setIsLoading(false) }
  }

  const handleSearch = () => { setPage(1); loadSubmissions() }

  const handleAction = async () => {
    if (!actionModal) return
    try {
      if (actionModal.action === 'approve') {
        await adminSubmissions.approve(actionModal.submission.id, actionNote)
        setSubmissions(submissions.map(s => s.id === actionModal.submission.id ? { ...s, status: 'approved' as const } : s))
      } else if (actionModal.action === 'reject') {
        await adminSubmissions.reject(actionModal.submission.id, actionNote)
        setSubmissions(submissions.map(s => s.id === actionModal.submission.id ? { ...s, status: 'rejected' as const } : s))
      } else {
        await adminSubmissions.requestChanges(actionModal.submission.id, actionNote)
        setSubmissions(submissions.map(s => s.id === actionModal.submission.id ? { ...s, status: 'needs_changes' as const } : s))
      }
      setActionModal(null)
      setActionNote('')
    } catch {}
  }

  const openInEditor = (submission: CommunitySubmission) => {
    navigate(`/admin/community/${submission.id}/edit`)
  }

  const totalPages = Math.ceil(total / limit)
  const statuses: SubmissionStatus[] = ['submitted', 'pending_review', 'needs_changes', 'approved', 'rejected', 'published']

  const renderActionModal = () => {
    if (!actionModal) return null
    const sub = actionModal.submission
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full shadow-2xl">
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {actionModal.action === 'approve' && t('admin.community.modals.approveTitle')}
              {actionModal.action === 'reject' && t('admin.community.modals.rejectTitle')}
              {actionModal.action === 'changes' && t('admin.community.requestChanges')}
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              {actionModal.action === 'approve'
                ? t('admin.community.modals.approveMessage', { title: sub.title })
                : actionModal.action === 'reject'
                  ? t('admin.community.modals.rejectMessage', { title: sub.title })
                  : t('admin.community.modals.changesMessage', { title: sub.title })}
            </p>
          </div>
          <div className="p-6">
            <textarea
              value={actionNote} onChange={e => setActionNote(e.target.value)}
              placeholder={
                actionModal.action === 'approve'
                  ? t('admin.community.modals.approvePlaceholder')
                  : actionModal.action === 'reject'
                    ? t('admin.community.modals.rejectPlaceholder')
                    : t('admin.community.modals.changesPlaceholder')
              }
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white resize-none h-24 focus:outline-none focus:ring-2 focus:ring-accent-600"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={handleAction}
                className={`flex-1 py-2.5 rounded-xl font-bold text-white transition-all ${
                  actionModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  actionModal.action === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-yellow-600 hover:bg-yellow-700'
                }`}>
                {actionModal.action === 'approve' ? t('admin.community.approve') : actionModal.action === 'reject' ? t('admin.community.reject') : t('admin.community.requestChanges')}
              </button>
              <button onClick={() => { setActionModal(null); setActionNote('') }}
                className="flex-1 py-2.5 rounded-xl font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{t('admin.community.title')}</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{t('admin.community.subtitle')}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
          <div className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800">
            {t('admin.community.submissionCount', { total })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder={t('admin.community.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600">
          <option value="">{t('common.all')}</option>
          {statuses.map(s => <option key={s} value={s}>{SUBMISSION_STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-40 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 animate-pulse" />
          ))
        ) : submissions.length === 0 ? (
          <div className="text-center py-16">
            <Layers className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-500">{t('admin.community.empty')}</p>
          </div>
        ) : submissions.map(sub => (
          <div key={sub.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Thumbnail */}
              <div className="w-full sm:w-36 h-24 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                {sub.thumbnail_url ? (
                  <img src={sub.thumbnail_url} alt={sub.title} className="w-full h-full object-cover" />
                ) : (
                  <Layers className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* Title + Status */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">{sub.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${SUBMISSION_STATUS_COLORS[sub.status]}`}>
                        {SUBMISSION_STATUS_LABELS[sub.status]}
                      </span>
                    </div>
                    {/* Meta line */}
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="font-medium text-neutral-600 dark:text-neutral-300">{sub.user?.display_name || t('common.unknown')}</span>
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Palette className="w-3 h-3" />
                        {sub.type}
                      </span>
                      <span>·</span>
                      <span>{sub.category}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {/* Description */}
                    {sub.description && (
                      <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2">{sub.description}</p>
                    )}
                    {/* Tags */}
                    {sub.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        <Tag className="w-3 h-3 text-neutral-300 dark:text-neutral-600" />
                        {sub.tags.map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
                    {/* Open in Editor */}
                    <button onClick={() => openInEditor(sub)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent-600 text-white text-[11px] font-bold hover:bg-accent-700 transition-colors"
                      title={t('admin.community.openInTemplateEditor')}>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">{t('admin.community.openInEditor')}</span>
                    </button>
                    {/* Review actions */}
                    {(sub.status === 'submitted' || sub.status === 'pending_review' || sub.status === 'needs_changes') && (
                      <>
                        <button onClick={() => setActionModal({ submission: sub, action: 'approve' })}
                          className="p-2 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-600 hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors" title={t('admin.community.approve')}>
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setActionModal({ submission: sub, action: 'changes' })}
                          className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-950/30 transition-colors" title={t('admin.community.requestChanges')}>
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button onClick={() => setActionModal({ submission: sub, action: 'reject' })}
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors" title={t('admin.community.reject')}>
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {/* Admin Notes */}
                {sub.admin_notes && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-yellow-50 dark:bg-yellow-950/10 border border-yellow-200 dark:border-yellow-900/30 text-xs text-yellow-700 dark:text-yellow-400">
                    <AlertCircle className="w-3 h-3 inline mr-1" />{sub.admin_notes}
                  </div>
                )}
                {sub.admin_reply && (
                  <div className="mt-2 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/10 border border-blue-200 dark:border-blue-900/30 text-xs text-blue-700 dark:text-blue-400">
                    <MessageSquare className="w-3 h-3 inline mr-1" />{t('admin.community.adminReply')}{sub.admin_reply}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-500">{t('common.pageOf', { page, total: totalPages })}</p>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {renderActionModal()}
    </div>
  )
}
