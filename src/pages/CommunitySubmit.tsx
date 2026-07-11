import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Save, Send, Loader2, Layers, QrCode, CreditCard,
  Palette, Grid3X3, Frame, Sparkles, CheckCircle2
} from 'lucide-react'
import type { DesignType } from '@/types/admin'
import type { CardDesign, CardCanvasElement } from '@/types/nfc'
import type { Link } from '@/types/pageBuilder'
import type { QRCustomization } from '@/types/qr'
import { supabase } from '@/lib/supabase'
import { useNotification } from '@/hooks/useNotification'
import { useAuthStore } from '@/stores/authStore'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { CardCanvasEditor } from '@/components/CardCanvasEditor'
import { DesignEditor } from '@/components/DesignEditor'
import { PagePreview } from '@/components/PagePreview'
import { QRGenerator } from '@/components/QRGenerator'

type TemplateCategory = 'general' | 'premium' | 'business' | 'creative' | 'tech' | 'lifestyle'

interface BackgroundConfig {
  type: 'solid' | 'linear-gradient' | 'radial-gradient' | 'pattern'
  color: string
  color2: string
  angle: number
  pattern: string
}

const TEMPLATE_TYPES: Array<{
  type: DesignType
  label: string
  description: string
  icon: any
  color: string
  bgColor: string
}> = [
  { type: 'nfc_template', label: 'NFC Card', description: 'Premium NFC card designs', icon: CreditCard, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  { type: 'link_page_template', label: 'Link Page', description: 'Link page layouts & themes', icon: Layers, color: 'text-accent-600', bgColor: 'bg-accent-100 dark:bg-accent-900/30' },
  { type: 'qr_template', label: 'QR Code', description: 'Custom QR code styles', icon: QrCode, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { type: 'background', label: 'Background', description: 'Gradients, colors & patterns', icon: Palette, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  { type: 'pattern', label: 'Pattern', description: 'NFC card patterns & textures', icon: Grid3X3, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  { type: 'qr_frame', label: 'QR Frame', description: 'Decorative QR code frames', icon: Frame, color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
]

const CATEGORIES: TemplateCategory[] = [
  'general', 'premium', 'business', 'creative', 'tech', 'lifestyle',
]

const DEFAULT_QR: QRCustomization = {
  dotStyle: 'square', eyeFrameStyle: 'square', eyeBallStyle: 'square',
  gradientEnabled: false, gradientType: 'linear', gradientRotation: 0, gradientScale: 50,
  foregroundColor: '#000000', foregroundColor2: '#000000',
  bgGradientEnabled: false, bgGradientType: 'linear', bgGradientRotation: 0, bgGradientScale: 50,
  backgroundColor: '#ffffff', backgroundColor2: '#ffffff',
  frameStyle: 'none', frameText: 'SCAN ME', frameColor: '#000000', frameTextColor: '#ffffff',
  textGradientEnabled: false, textGradientType: 'linear', textGradientRotation: 0, textGradientScale: 50,
  frameTextColor2: '#ffffff', frameFontFamily: 'sans-serif', frameTextPosition: 'bottom',
  logoSize: 20, logoPadding: true, logoName: '', dataType: 'url', data: { url: 'https://linkora.app' },
}

function TypeSelector({ onSelect }: { onSelect: (t: DesignType) => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Sparkles className="w-10 h-10 text-accent-500 mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Create a Template</h1>
          <p className="text-sm text-neutral-500 mt-1">Choose a template type to get started</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TEMPLATE_TYPES.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.type}
                onClick={() => onSelect(t.type)}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-accent-400 dark:hover:border-accent-600 hover:shadow-lg transition-all text-left group"
              >
                <div className={`w-10 h-10 rounded-xl ${t.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${t.color}`} />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{t.label}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{t.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CommunityLinkPageEditor({ design, links, setDesign, setLinks }: {
  design: any; links: Link[]; setDesign: (d: any) => void; setLinks: (l: Link[]) => void
}) {
  const store = usePageBuilderStore()
  useEffect(() => {
    store.setPage({
      settings: { slug: 'preview', title: 'Preview', visibility: 'public', status: 'draft' },
      design, links,
    })
  }, [])
  useEffect(() => {
    const unsub = usePageBuilderStore.subscribe((state) => {
      setDesign(state.page.design)
      setLinks(state.page.links)
    })
    return unsub
  }, [])
  return (
    <div className="flex flex-col xl:flex-row gap-4">
      <div className="flex-1 min-w-0"><DesignEditor /></div>
      <div className="w-full xl:w-[320px] shrink-0"><PagePreview /></div>
    </div>
  )
}

export function CommunitySubmitPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const notification = useNotification()
  const { user } = useAuthStore()
  const isEdit = !!id

  const [selectedType, setSelectedType] = useState<DesignType | null>(null)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [meta, setMeta] = useState({
    title: '',
    description: '',
    category: 'general' as TemplateCategory,
    tags: '',
  })

  const DEFAULT_CARD_ELEMENTS: CardCanvasElement[] = [
  { id: 'name', type: 'name', x: 5, y: 55, visible: true, color: '#FFFFFF', fontSize: 'xl', fontWeight: 'bold' },
  { id: 'job', type: 'job', x: 5, y: 72, visible: true, color: '#A0A0A0', fontSize: 'sm', fontWeight: 'medium' },
  { id: 'company', type: 'company', x: 5, y: 82, visible: true, color: '#808080', fontSize: 'xs', fontWeight: 'semibold' },
  { id: 'qr', type: 'qr', x: 68, y: 45, visible: true, size: 'lg' },
]

const [cardDesign, setCardDesign] = useState<CardDesign>({
    bgType: 'gradient', bgColor: '#1a1a2e', bgGradientStart: '#1a1a2e', bgGradientEnd: '#16213e',
    pattern: 'none', elements: DEFAULT_CARD_ELEMENTS,
    cardName: 'Your Name', cardCompany: 'Company', showGrid: false, patternOpacity: 0.05,
  })
  const [pageDesign, setPageDesign] = useState({
    backgroundColor: '#0a0a0a', backgroundGradientRotation: 135, backgroundGradientScale: 100,
    backgroundType: 'solid', backgroundColor2: '#1a1a2e',
    headingColor: '#ffffff', textColor: '#a0a0a0', buttonColor: '#ffffff',
    buttonTextColor: '#000000', linkBgColor: 'rgba(255,255,255,0.05)',
    fontFamily: 'Inter', fontSize: 16, headingSize: 32,
  })
  const [pageLinks, setPageLinks] = useState<Link[]>([])
  const [qrCustomization, setQrCustomization] = useState<QRCustomization>({ ...DEFAULT_QR })
  const [bgConfig, setBgConfig] = useState<BackgroundConfig>({
    type: 'solid', color: '#0C0F1D', color2: '#1a1a2e', angle: 135, pattern: 'none',
  })

  useEffect(() => {
    if (!id || !user) return
    const load = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.from('community_submissions').select('*').eq('id', id).single()
        if (error || !data) throw error
        setSelectedType(data.type)
        setMeta({
          title: data.title || '',
          description: data.description || '',
          category: (data.category as TemplateCategory) || 'general',
          tags: (data.tags || []).join(', '),
        })
        if (data.metadata && Object.keys(data.metadata).length > 0) {
          const m = data.metadata
          if (m.cardDesign) setCardDesign(m.cardDesign as CardDesign)
          if (m.pageDesign) setPageDesign(m.pageDesign)
          if (m.links) setPageLinks(m.links as Link[])
          if (m.qrCustomization) setQrCustomization({ ...DEFAULT_QR, ...m.qrCustomization as QRCustomization })
          if (m.background) setBgConfig(m.background as BackgroundConfig)
        }
      } catch { notification.error('Failed to load submission') }
      finally { setLoading(false) }
    }
    load()
  }, [id, user])

  const buildMetadata = useCallback((): Record<string, unknown> => {
    switch (selectedType) {
      case 'nfc_template': return { cardDesign }
      case 'link_page_template': return { pageDesign, links: pageLinks }
      case 'qr_template': return { qrCustomization }
      case 'background': return { background: bgConfig }
      default: return {}
    }
  }, [selectedType, cardDesign, pageDesign, pageLinks, qrCustomization, bgConfig])

  const handleSaveDraft = async () => {
    if (!meta.title.trim() || !selectedType || !user) return
    setSaving(true)
    try {
      const payload = {
        user_id: user.id,
        title: meta.title.trim(),
        slug: meta.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        description: meta.description.trim() || undefined,
        type: selectedType,
        category: meta.category,
        tags: meta.tags.split(',').map(t => t.trim()).filter(Boolean),
        metadata: buildMetadata(),
        status: 'draft' as const,
        version: '1.0.0',
        license: 'free',
      }
      if (isEdit && id) {
        const { error } = await supabase.from('community_submissions').update({
          title: payload.title, slug: payload.slug, description: payload.description,
          type: payload.type, category: payload.category, tags: payload.tags,
          metadata: payload.metadata, status: 'draft',
        }).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('community_submissions').insert(payload)
        if (error) throw error
      }
      notification.success('Draft saved')
    } catch (err: any) {
      notification.error(err.message || 'Failed to save draft')
    } finally { setSaving(false) }
  }

  const handleSubmit = async () => {
    if (!meta.title.trim() || !selectedType || !user) return
    setSaving(true)
    try {
      const slug = meta.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const metadata = buildMetadata()

      if (isEdit && id) {
        const { error } = await supabase.from('community_submissions').update({
          title: meta.title.trim(), slug, description: meta.description.trim() || undefined,
          type: selectedType, category: meta.category,
          tags: meta.tags.split(',').map(t => t.trim()).filter(Boolean),
          metadata, status: 'submitted',
        }).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('community_submissions').insert({
          user_id: user.id, title: meta.title.trim(), slug,
          description: meta.description.trim() || undefined,
          type: selectedType, category: meta.category,
          tags: meta.tags.split(',').map(t => t.trim()).filter(Boolean),
          metadata, status: 'submitted', version: '1.0.0', license: 'free',
        })
        if (error) throw error
      }
      setSubmitted(true)
    } catch (err: any) {
      notification.error(err.message || 'Failed to submit')
    } finally { setSaving(false) }
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-extrabold text-neutral-900 dark:text-white mb-2">Template Submitted!</h1>
          <p className="text-sm text-neutral-500 mb-6">Your template has been submitted for review. An admin will review it soon.</p>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-semibold text-sm transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
      </div>
    )
  }

  if (!selectedType) {
    return <TypeSelector onSelect={setSelectedType} />
  }

  const metaPanel = (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-4">
      <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Template Details</h3>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1">Title *</label>
        <input
          type="text" value={meta.title} onChange={e => setMeta(p => ({ ...p, title: e.target.value }))}
          placeholder="My Awesome Template"
          className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1">Description</label>
        <textarea value={meta.description} onChange={e => setMeta(p => ({ ...p, description: e.target.value }))}
          rows={3} placeholder="Describe your template..."
          className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600 resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1">Category</label>
        <select value={meta.category} onChange={e => setMeta(p => ({ ...p, category: e.target.value as TemplateCategory }))}
          className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1">Tags (comma-separated)</label>
        <input type="text" value={meta.tags} onChange={e => setMeta(p => ({ ...p, tags: e.target.value }))}
          placeholder="modern, minimal, dark"
          className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={handleSaveDraft} disabled={saving || !meta.title.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold text-sm transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Draft
        </button>
        <button onClick={handleSubmit} disabled={saving || !meta.title.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-semibold text-sm transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Submit
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 max-w-[1800px] mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => { if (isEdit) navigate('/dashboard'); else setSelectedType(null) }}
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
            <div>
              <h1 className="text-base font-bold text-neutral-900 dark:text-white">Submit Template</h1>
              <p className="text-xs text-neutral-500">{TEMPLATE_TYPES.find(t => t.type === selectedType)?.label}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSaveDraft} disabled={saving || !meta.title.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-sm transition-colors disabled:opacity-50">
              <Save className="w-4 h-4" /> Draft
            </button>
            <button onClick={handleSubmit} disabled={saving || !meta.title.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {saving ? 'Sending...' : 'Submit for Review'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 lg:px-6 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="flex-1 min-w-0">
            {selectedType === 'nfc_template' && (
              <CardCanvasEditor
                cardId="community-submit"
                initialDesign={cardDesign}
                onSave={async (d) => { setCardDesign(d) }}
                onClose={() => {}}
                qrCodes={[]}
              />
            )}
            {selectedType === 'link_page_template' && (
              <CommunityLinkPageEditor design={pageDesign} links={pageLinks} setDesign={setPageDesign} setLinks={setPageLinks} />
            )}
            {selectedType === 'qr_template' && (
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 space-y-4">
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">QR Code Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Data / URL</label>
                        <input type="text" value={qrCustomization.data?.url || ''}
                          onChange={e => setQrCustomization(c => ({ ...c, data: { ...c.data, url: e.target.value } }))}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Dot Style</label>
                        <select value={qrCustomization.dotStyle}
                          onChange={e => setQrCustomization(c => ({ ...c, dotStyle: e.target.value as any }))}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600">
                          {['square', 'dots', 'rounded', 'classy', 'star', 'diamond', 'hexagon', 'fluid', 'cross', 'heart'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Foreground</label>
                        <input type="color" value={qrCustomization.foregroundColor}
                          onChange={e => setQrCustomization(c => ({ ...c, foregroundColor: e.target.value }))}
                          className="w-full h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Background</label>
                        <input type="color" value={qrCustomization.backgroundColor}
                          onChange={e => setQrCustomization(c => ({ ...c, backgroundColor: e.target.value }))}
                          className="w-full h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-[320px] shrink-0">
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sticky top-20">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">Preview</h3>
                    <div className="flex items-center justify-center p-6 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                      <QRGenerator value={qrCustomization.data?.url || 'https://linkora.app'} size={200} customization={qrCustomization} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedType === 'background' && (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Background Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1">Type</label>
                    <select value={bgConfig.type}
                      onChange={e => setBgConfig(c => ({ ...c, type: e.target.value as any }))}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm">
                      <option value="solid">Solid</option>
                      <option value="linear-gradient">Linear Gradient</option>
                      <option value="radial-gradient">Radial Gradient</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1">Color</label>
                    <input type="color" value={bgConfig.color}
                      onChange={e => setBgConfig(c => ({ ...c, color: e.target.value }))}
                      className="w-full h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer" />
                  </div>
                  {bgConfig.type !== 'solid' && (
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">Color 2</label>
                      <input type="color" value={bgConfig.color2}
                        onChange={e => setBgConfig(c => ({ ...c, color2: e.target.value }))}
                        className="w-full h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer" />
                    </div>
                  )}
                </div>
                <div className="w-full h-32 rounded-xl border border-neutral-200 dark:border-neutral-800" style={{
                  background: bgConfig.type === 'solid' ? bgConfig.color
                    : bgConfig.type === 'linear-gradient' ? `linear-gradient(${bgConfig.angle}deg, ${bgConfig.color}, ${bgConfig.color2})`
                    : `radial-gradient(circle, ${bgConfig.color}, ${bgConfig.color2})`,
                }} />
              </div>
            )}
          </div>

          <div className="w-full lg:w-[340px] shrink-0">
            <div className="sticky top-[73px]">{metaPanel}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
