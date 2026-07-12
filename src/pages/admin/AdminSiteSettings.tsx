import { useState, useEffect } from 'react'
import { Save, RotateCcw, Settings as SettingsIcon, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminSettings } from '@/api/admin'
import type { SiteSetting } from '@/types/admin'

const CATEGORIES = [
  { id: 'general', labelKey: 'admin.settings.categories.general' },
  { id: 'seo', labelKey: 'admin.settings.categories.seo' },
  { id: 'mail', labelKey: 'admin.settings.categories.mail' },
  { id: 'storage', labelKey: 'admin.settings.categories.storage' },
  { id: 'auth', labelKey: 'admin.settings.categories.authentication' },
  { id: 'maintenance', labelKey: 'admin.settings.categories.maintenance' },
  { id: 'feature_flags', labelKey: 'admin.settings.categories.featureFlags' },
]

function parseValue(val: unknown): { type: 'boolean' | 'number' | 'text'; display: string | boolean | number } {
  if (typeof val === 'boolean') return { type: 'boolean', display: val }
  if (typeof val === 'number') return { type: 'number', display: val }
  if (typeof val === 'string') {
    if (val === 'true') return { type: 'boolean', display: true }
    if (val === 'false') return { type: 'boolean', display: false }
    const num = Number(val)
    if (!isNaN(num) && val !== '') return { type: 'number', display: num }
    return { type: 'text', display: val }
  }
  return { type: 'text', display: String(val ?? '') }
}

export function AdminSiteSettingsPage() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [activeCategory, setActiveCategory] = useState('general')
  const [edits, setEdits] = useState<Record<string, unknown>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { loadSettings() }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const res = await adminSettings.get()
      if (res.data) setSettings(res.data.settings)
    } catch {} finally { setIsLoading(false) }
  }

  const filtered = settings.filter(s => s.category === activeCategory)
  const hasChanges = Object.keys(edits).length > 0

  const handleChange = (key: string, value: unknown) => {
    setEdits(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await adminSettings.update(edits)
      setEdits({})
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      await loadSettings()
    } catch {} finally { setIsSaving(false) }
  }

  const handleDiscard = () => { setEdits({}) }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{t('admin.settings.title')}</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{t('admin.settings.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <>
              <button onClick={handleDiscard}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                <RotateCcw className="w-4 h-4" /> {t('common.undo')}
              </button>
              <button onClick={handleSave} disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 text-white text-sm font-bold hover:bg-accent-700 transition-all disabled:opacity-50">
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? t('admin.settings.saved') : isSaving ? t('common.saving') : t('common.save')}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Category Tabs */}
        <div className="lg:w-48 shrink-0 flex lg:flex-col gap-1 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-accent-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}>
              <SettingsIcon className="w-4 h-4" />
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Settings Form */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <SettingsIcon className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
              <p className="text-neutral-500 text-sm">No settings in this category</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(setting => {
                const currentVal = edits[setting.key] !== undefined ? edits[setting.key] : setting.value
                const { type } = parseValue(currentVal)
                const isEdited = setting.key in edits

                return (
                  <div key={setting.id}
                    className={`bg-white dark:bg-neutral-900 rounded-2xl border p-4 transition-colors ${
                      isEdited ? 'border-accent-500 dark:border-accent-500/50 ring-1 ring-accent-500/20' : 'border-neutral-200 dark:border-neutral-800'
                    }`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <label className="text-sm font-bold text-neutral-900 dark:text-white block">
                          {setting.key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </label>
                        {setting.description && (
                          <p className="text-[11px] text-neutral-400 mt-0.5">{setting.description}</p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {type === 'boolean' ? (
                          <button onClick={() => handleChange(setting.key, !currentVal)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              currentVal ? 'bg-accent-600' : 'bg-neutral-300 dark:bg-neutral-700'
                            }`}>
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                              currentVal ? 'translate-x-5' : ''
                            }`} />
                          </button>
                        ) : type === 'number' ? (
                          <input type="number" value={currentVal as number}
                            onChange={e => handleChange(setting.key, Number(e.target.value))}
                            className="w-32 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white text-right focus:outline-none focus:ring-2 focus:ring-accent-600" />
                        ) : (
                          <input type="text" value={currentVal as string}
                            onChange={e => handleChange(setting.key, e.target.value)}
                            className="w-64 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-600" />
                        )}
                      </div>
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1.5">
                      Last updated: {new Date(setting.updated_at).toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
