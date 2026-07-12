import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bug, ChevronLeft, ChevronRight, X, Save,
  Calendar, User, Monitor, Globe,
} from 'lucide-react'
import { adminBugs } from '@/api/admin'
import type { BugReport, BugStatus, BugPriority } from '@/types/admin'

const STATUS_OPTIONS: BugStatus[] = ['new', 'in_progress', 'fixed', 'wont_fix', 'duplicate']
const PRIORITY_OPTIONS: BugPriority[] = ['low', 'medium', 'high', 'critical']

const STATUS_STYLES: Record<BugStatus, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  in_progress: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  fixed: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  wont_fix: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  duplicate: 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
}

const PRIORITY_STYLES: Record<BugPriority, string> = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
}

const PRIORITY_DOTS: Record<BugPriority, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
}

export function AdminBugsPage() {
  const { t } = useTranslation()
  const [bugs, setBugs] = useState<BugReport[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<BugStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<BugPriority | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<BugReport | null>(null)
  const [editStatus, setEditStatus] = useState<BugStatus>('new')
  const [editNotes, setEditNotes] = useState('')
  const [editFixVersion, setEditFixVersion] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const limit = 20

  useEffect(() => { loadBugs() }, [page, statusFilter, priorityFilter])

  const loadBugs = async () => {
    try {
      setIsLoading(true)
      const res = await adminBugs.list({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        page,
        limit,
      })
      if (res.data) { setBugs(res.data.bugs); setTotal(res.data.total) }
    } catch {} finally { setIsLoading(false) }
  }

  const openDetail = (bug: BugReport) => {
    setSelected(bug)
    setEditStatus(bug.status)
    setEditNotes(bug.admin_notes || '')
    setEditFixVersion(bug.fix_version || '')
  }

  const handleSave = async () => {
    if (!selected) return
    try {
      setIsSaving(true)
      await adminBugs.update(selected.id, {
        status: editStatus,
        admin_notes: editNotes,
        fix_version: editFixVersion || undefined,
      })
      setBugs(bugs.map(b =>
        b.id === selected.id ? { ...b, status: editStatus, admin_notes: editNotes, fix_version: editFixVersion || undefined } : b
      ))
      setSelected(null)
    } catch {} finally { setIsSaving(false) }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{t('admin.bugs.title')}</h1>
        <p className="text-sm text-neutral-500 mt-0.5">{t('admin.bugs.subtitle', { total })}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setStatusFilter(''); setPage(1) }}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === '' && priorityFilter === ''
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
        <div className="h-px sm:h-auto sm:w-px bg-neutral-200 dark:bg-neutral-800 self-stretch sm:self-auto" />
        <div className="flex gap-2 flex-wrap">
          {PRIORITY_OPTIONS.map(p => (
            <button
              key={p}
              onClick={() => { setPriorityFilter(priorityFilter === p ? '' : p); setPage(1) }}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                priorityFilter === p
                  ? 'bg-accent-600 text-white'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${PRIORITY_DOTS[p]}`} />
                {p}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className={`bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex-1 ${selected ? 'hidden lg:block' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.bugs.table.bug')}</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden md:table-cell">{t('admin.bugs.table.user')}</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.bugs.table.priority')}</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.bugs.table.status')}</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden md:table-cell">{t('admin.bugs.table.device')}</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">{t('admin.bugs.table.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" /></td></tr>
                  ))
                ) : bugs.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-neutral-400">{t('admin.bugs.empty')}</td></tr>
                ) : bugs.map(bug => (
                  <tr
                    key={bug.id}
                    onClick={() => openDetail(bug)}
                    className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${selected?.id === bug.id ? 'bg-accent-50 dark:bg-accent-950/10' : ''}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Bug className="w-4 h-4 text-red-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{bug.title}</p>
                          {bug.description && (
                            <p className="text-xs text-neutral-400 truncate max-w-[250px]">{bug.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-300 shrink-0">
                          {bug.user?.display_name?.[0] || '?'}
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-[120px]">{bug.user?.display_name || t('common.unknown')}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${PRIORITY_STYLES[bug.priority]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOTS[bug.priority]}`} />
                        {bug.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[bug.status]}`}>
                        {bug.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        {bug.device && <span className="flex items-center gap-1"><Monitor className="w-3 h-3" />{bug.device}</span>}
                        {bug.browser && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{bug.browser}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <p className="text-xs text-neutral-500">{new Date(bug.created_at).toLocaleDateString()}</p>
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
          <div className="w-full lg:w-[420px] shrink-0 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="font-bold text-neutral-900 dark:text-white text-sm">{t('admin.bugs.detailTitle')}</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{selected.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{selected.user?.display_name || t('common.unknown')}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(selected.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Priority & Status badges */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${PRIORITY_STYLES[selected.priority]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOTS[selected.priority]}`} />
                  {selected.priority}
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[selected.status]}`}>
                  {selected.status.replace(/_/g, ' ')}
                </span>
              </div>

              {selected.description && (
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.bugs.fields.description')}</label>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1 whitespace-pre-wrap">{selected.description}</p>
                </div>
              )}

              {/* Environment info */}
              {(selected.device || selected.browser || selected.os || selected.url) && (
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.bugs.fields.environment')}</label>
                  <div className="mt-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 space-y-1.5">
                    {selected.device && <p className="text-xs text-neutral-600 dark:text-neutral-400"><span className="font-medium">{t('admin.bugs.fields.device')}:</span> {selected.device}</p>}
                    {selected.browser && <p className="text-xs text-neutral-600 dark:text-neutral-400"><span className="font-medium">{t('admin.bugs.fields.browser')}:</span> {selected.browser}</p>}
                    {selected.os && <p className="text-xs text-neutral-600 dark:text-neutral-400"><span className="font-medium">{t('admin.bugs.fields.os')}:</span> {selected.os}</p>}
                    {selected.url && <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate"><span className="font-medium">{t('admin.bugs.fields.url')}:</span> {selected.url}</p>}
                  </div>
                </div>
              )}

              {selected.screenshot_url && (
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.bugs.fields.screenshot')}</label>
                  <img src={selected.screenshot_url} alt={t('admin.bugs.screenshot')} className="mt-1 w-full rounded-xl border border-neutral-200 dark:border-neutral-800" />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.bugs.fields.status')}</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as BugStatus)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.bugs.fields.fixVersion')}</label>
                <input
                  type="text"
                  value={editFixVersion}
                  onChange={e => setEditFixVersion(e.target.value)}
                  placeholder={t('admin.bugs.placeholders.fixVersion')}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.bugs.fields.adminNotes')}</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder={t('admin.bugs.placeholders.internalNotes')}
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
