import { useState, useEffect } from 'react'
import {
  Megaphone, Plus, X, Trash2, Eye, EyeOff,
  Info, AlertTriangle, CheckCircle2, Wrench,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminAnnouncements } from '@/api/admin'
import type { Announcement } from '@/types/admin'

const TYPE_OPTIONS: Announcement['type'][] = ['info', 'warning', 'success', 'maintenance']
const TARGET_OPTIONS: Announcement['target'][] = ['all', 'premium', 'specific']
const CHANNEL_OPTIONS: Announcement['channel'][] = ['in_app', 'email', 'banner', 'all']

const TYPE_STYLES: Record<Announcement['type'], string> = {
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  success: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  maintenance: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
}

const TYPE_ICONS: Record<Announcement['type'], typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  maintenance: Wrench,
}

interface ModalForm {
  title: string
  content: string
  type: Announcement['type']
  target: Announcement['target']
  channel: Announcement['channel']
  is_active: boolean
  starts_at: string
  expires_at: string
}

const EMPTY_FORM: ModalForm = {
  title: '',
  content: '',
  type: 'info',
  target: 'all',
  channel: 'in_app',
  is_active: true,
  starts_at: '',
  expires_at: '',
}

export function AdminAnnouncementsPage() {
  const { t } = useTranslation()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [form, setForm] = useState<ModalForm>(EMPTY_FORM)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => { loadAnnouncements() }, [])

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true)
      const res = await adminAnnouncements.list()
      if (res.data) setAnnouncements(res.data.announcements)
    } catch {} finally { setIsLoading(false) }
  }

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (a: Announcement) => {
    setEditing(a)
    setForm({
      title: a.title,
      content: a.content,
      type: a.type,
      target: a.target,
      channel: a.channel,
      is_active: a.is_active,
      starts_at: a.starts_at ? a.starts_at.slice(0, 16) : '',
      expires_at: a.expires_at ? a.expires_at.slice(0, 16) : '',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const payload: Partial<Announcement> = {
        title: form.title,
        content: form.content,
        type: form.type,
        target: form.target,
        channel: form.channel,
        is_active: form.is_active,
        starts_at: form.starts_at || undefined,
        expires_at: form.expires_at || undefined,
      }
      if (editing) {
        await adminAnnouncements.update(editing.id, payload)
        setAnnouncements(announcements.map(a =>
          a.id === editing.id ? { ...a, ...payload } : a
        ))
      } else {
        const res = await adminAnnouncements.create(payload)
        if (res.data?.announcement) setAnnouncements([res.data.announcement, ...announcements])
      }
      setShowModal(false)
    } catch {} finally { setIsSaving(false) }
  }

  const handleDelete = async (id: string) => {
    try {
      await adminAnnouncements.delete(id)
      setAnnouncements(announcements.filter(a => a.id !== id))
      setDeleteConfirm(null)
    } catch {}
  }

  const toggleActive = async (a: Announcement) => {
    try {
      await adminAnnouncements.update(a.id, { is_active: !a.is_active })
      setAnnouncements(announcements.map(x =>
        x.id === a.id ? { ...x, is_active: !x.is_active } : x
      ))
    } catch {}
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{t('admin.announcements.title')}</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{t('admin.announcements.subtitle', { count: announcements.length })}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('admin.announcements.newAnnouncement')}
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.announcements.table.title')}</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden md:table-cell">{t('admin.announcements.table.content')}</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.announcements.table.type')}</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">{t('admin.announcements.table.target')}</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">{t('admin.announcements.table.channel')}</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.announcements.table.active')}</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden md:table-cell">{t('admin.announcements.table.date')}</th>
                <th className="text-right px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{t('admin.announcements.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-5 py-4"><div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" /></td></tr>
                ))
              ) : announcements.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-neutral-400">{t('admin.announcements.empty')}</td></tr>
              ) : announcements.map(a => {
                const TypeIcon = TYPE_ICONS[a.type]
                return (
                  <tr
                    key={a.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    onClick={() => openEdit(a)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Megaphone className="w-4 h-4 text-accent-500 shrink-0" />
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate max-w-[200px]">{a.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <p className="text-xs text-neutral-400 truncate max-w-[250px]">{a.content}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${TYPE_STYLES[a.type]}`}>
                        <TypeIcon className="w-3 h-3" />
                        {a.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className="text-xs text-neutral-500 capitalize">{a.target}</span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className="text-xs text-neutral-500">{a.channel.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={e => { e.stopPropagation(); toggleActive(a) }}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${a.is_active ? 'bg-accent-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${a.is_active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <p className="text-xs text-neutral-500">{new Date(a.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {a.is_active ? (
                          <Eye className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                        )}
                        {deleteConfirm === a.id ? (
                          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <button onClick={() => handleDelete(a.id)} className="px-2 py-1 rounded-lg bg-red-600 text-white text-[10px] font-bold hover:bg-red-700">{t('common.yes')}</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-[10px] font-bold hover:bg-neutral-300 dark:hover:bg-neutral-600">{t('common.no')}</button>
                          </div>
                        ) : (
                          <button
                            onClick={e => { e.stopPropagation(); setDeleteConfirm(a.id) }}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="font-bold text-neutral-900 dark:text-white">{editing ? t('admin.announcements.editTitle') : t('admin.announcements.createTitle')}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.announcements.fields.title')}</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder={t('admin.announcements.placeholders.title')}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-600"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.announcements.fields.content')}</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder={t('admin.announcements.placeholders.content')}
                  rows={4}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-600 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.announcements.fields.type')}</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value as Announcement['type'] })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
                  >
                    {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.announcements.fields.target')}</label>
                  <select
                    value={form.target}
                    onChange={e => setForm({ ...form, target: e.target.value as Announcement['target'] })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
                  >
                    {TARGET_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.announcements.fields.channel')}</label>
                <select
                  value={form.channel}
                  onChange={e => setForm({ ...form, channel: e.target.value as Announcement['channel'] })}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
                >
                  {CHANNEL_OPTIONS.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.announcements.fields.active')}</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? 'bg-accent-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.announcements.fields.startsAt')}</label>
                  <input
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={e => setForm({ ...form, starts_at: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('admin.announcements.fields.expiresAt')}</label>
                  <input
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={e => setForm({ ...form, expires_at: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving || !form.title}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {isSaving ? t('common.saving') : editing ? t('common.save') : t('common.create') + ' ' + t('admin.announcements.title')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
