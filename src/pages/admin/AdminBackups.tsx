import { useState, useEffect } from 'react'
import { Database, Plus, HardDrive, Clock, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminBackups } from '@/api/admin'
import type { Backup } from '@/types/admin'

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle; color: string; labelKey: string }> = {
  completed: { icon: CheckCircle, color: 'text-green-600', labelKey: 'admin.backups.completed' },
  pending: { icon: Loader2, color: 'text-yellow-600', labelKey: 'admin.backups.pending' },
  failed: { icon: AlertCircle, color: 'text-red-600', labelKey: 'admin.backups.failed' },
}

export function AdminBackupsPage() {
  const { t } = useTranslation()
  const [backups, setBackups] = useState<Backup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('full')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => { loadBackups() }, [])

  const loadBackups = async () => {
    try {
      setIsLoading(true)
      const res = await adminBackups.list()
      if (res.data) setBackups(res.data.backups)
    } catch {} finally { setIsLoading(false) }
  }

  const handleCreate = async () => {
    try {
      setIsCreating(true)
      const res = await adminBackups.create(newName || undefined, newType)
      if (res.data) setBackups([res.data.backup, ...backups])
      setShowCreate(false)
      setNewName('')
      setNewType('full')
    } catch {} finally { setIsCreating(false) }
  }

  const totalSize = backups.reduce((sum, b) => sum + b.file_size, 0)
  const completedCount = backups.filter(b => b.status === 'completed').length

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{t('admin.backups.title')}</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{t('admin.backups.subtitle', { count: completedCount, size: formatBytes(totalSize) })}</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 text-white text-sm font-bold hover:bg-accent-700 transition-all">
          <Plus className="w-4 h-4" /> {t('admin.backups.newBackup')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Database, label: t('admin.backups.stats.totalBackups'), value: backups.length, color: 'text-accent-600' },
          { icon: HardDrive, label: t('admin.backups.stats.totalSize'), value: formatBytes(totalSize), color: 'text-blue-600' },
          { icon: Clock, label: t('admin.backups.stats.lastBackup'), value: backups.length > 0 ? new Date(backups[0].created_at).toLocaleDateString() : t('admin.backups.never'), color: 'text-green-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">{label}</p>
              <p className="text-lg font-extrabold text-neutral-900 dark:text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-neutral-50 dark:bg-neutral-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : backups.length === 0 ? (
          <div className="text-center py-16">
            <Database className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
            <p className="text-neutral-500 text-sm">{t('admin.backups.empty')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">{t('admin.backups.table.name')}</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">{t('admin.backups.table.type')}</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">{t('admin.backups.table.size')}</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">{t('admin.backups.table.status')}</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">{t('admin.backups.table.created')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
                {backups.map(backup => {
                  const cfg = STATUS_CONFIG[backup.status] || STATUS_CONFIG.pending
                  return (
                    <tr key={backup.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-neutral-900 dark:text-white">{backup.name}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase">{backup.type}</span>
                      </td>
                      <td className="px-5 py-3.5 text-neutral-500">{formatBytes(backup.file_size)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${cfg.color}`}>
                          <cfg.icon className={`w-3.5 h-3.5 ${backup.status === 'pending' ? 'animate-spin' : ''}`} />
                          {t(cfg.labelKey)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-neutral-400">{new Date(backup.created_at).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">{t('admin.backups.newBackup')}</h3>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-500 mb-1 block">{t('admin.backups.fields.name')}</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder={t('admin.backups.fields.namePlaceholder')}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 mb-1 block">{t('admin.backups.fields.type')}</label>
                <select value={newType} onChange={e => setNewType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent-600">
                  <option value="full">{t('admin.backups.types.full')}</option>
                  <option value="database">{t('admin.backups.types.database')}</option>
                  <option value="media">{t('admin.backups.types.media')}</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreate} disabled={isCreating}
                className="flex-1 py-2.5 rounded-xl bg-accent-600 text-white font-bold text-sm hover:bg-accent-700 disabled:opacity-50 transition-all">
                {isCreating ? t('admin.backups.creating') : t('admin.backups.createBackup')}
              </button>
              <button onClick={() => setShowCreate(false)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
