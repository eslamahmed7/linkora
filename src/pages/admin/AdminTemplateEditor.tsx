import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Save, Eye, Palette, QrCode, Image, Sparkles,
  Grid3X3, CreditCard, FileText, Frame, Loader2, X,
  ChevronDown, Tag, Star, Info, Sun, Snowflake, Zap,
  Activity, Hexagon, Triangle, Diamond, Crown, Cloud, Music, Camera,
  Moon, Map, Heart, Shield, PenTool, Anchor, Briefcase, Target, Phone,
  Smile, Coffee, RefreshCw,
} from 'lucide-react'
import { adminDesigns, adminSubmissions } from '@/api/admin'
import type { DesignType, DesignMarketplaceItem } from '@/types/admin'

import { CardCanvasEditor } from '@/components/CardCanvasEditor'
import type { CardDesign } from '@/types/nfc'

import { DesignEditor } from '@/components/DesignEditor'
import { PagePreview } from '@/components/PagePreview'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import type { PageDesign, Link } from '@/types/pageBuilder'

import { QRGenerator } from '@/components/QRGenerator'
import type { QRCustomization } from '@/types/qr'

// ─── Types ───────────────────────────────────────────────────────────────────

type TemplateCategory = 'general' | 'premium' | 'business' | 'creative' | 'tech' | 'lifestyle'
type TemplateStatus = 'draft' | 'published' | 'archived'

interface TemplateMeta {
  title: string
  description: string
  type: DesignType
  category: TemplateCategory
  tags: string
  is_premium: boolean
  is_featured: boolean
  status: TemplateStatus
}

interface BackgroundConfig {
  type: 'solid' | 'linear-gradient' | 'radial-gradient' | 'pattern'
  color: string
  color2: string
  angle: number
  pattern: string
}

interface PatternConfig {
  id: string
  color: string
  opacity: number
}

interface FrameConfig {
  frameStyle: string
  frameColor: string
  frameText: string
  frameTextColor: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TEMPLATE_TYPES: Array<{
  type: DesignType
  label: string
  description: string
  icon: any
  color: string
  bgColor: string
}> = [
  { type: 'nfc_template', label: 'NFC Card', description: 'Design NFC card templates with canvas editor', icon: CreditCard, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { type: 'link_page_template', label: 'Link Page', description: 'Create link-in-bio page templates', icon: FileText, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { type: 'qr_template', label: 'QR Code', description: 'Design customizable QR code templates', icon: QrCode, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  { type: 'background', label: 'Background', description: 'Gradients, solids, and patterns', icon: Image, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  { type: 'pattern', label: 'Pattern', description: 'Decorative overlay patterns', icon: Grid3X3, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
  { type: 'qr_frame', label: 'QR Frame', description: 'Decorative frames for QR codes', icon: Frame, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
]

const CATEGORIES: Array<{ value: TemplateCategory; label: string }> = [
  { value: 'general', label: 'General' },
  { value: 'premium', label: 'Premium' },
  { value: 'business', label: 'Business' },
  { value: 'creative', label: 'Creative' },
  { value: 'tech', label: 'Tech' },
  { value: 'lifestyle', label: 'Lifestyle' },
]

const PATTERN_OPTIONS = [
  { id: 'none', label: 'None', Icon: X },
  { id: 'dots', label: 'Dots', Icon: Grid3X3 },
  { id: 'organic-waves', label: 'Waves', Icon: Activity },
  { id: 'double-waves', label: 'Multi-Wave', Icon: Activity },
  { id: 'zigzag', label: 'Zigzag', Icon: RefreshCw },
  { id: 'fluid-blobs', label: 'Blobs', Icon: Cloud },
  { id: 'hex-grid', label: 'Hex Grid', Icon: Hexagon },
  { id: 'diamonds', label: 'Diamonds', Icon: Diamond },
  { id: 'concentric', label: 'Circles', Icon: Sparkles },
  { id: 'geo-triangles', label: 'Triangles', Icon: Triangle },
  { id: 'stars-scatter', label: 'Stars', Icon: Star },
  { id: 'clouds-scatter', label: 'Clouds', Icon: Cloud },
  { id: 'nature-mix', label: 'Nature', Icon: Sun },
  { id: 'luxury-mix', label: 'Luxury', Icon: Crown },
  { id: 'creative-mix', label: 'Creative', Icon: Palette },
  { id: 'music-mix', label: 'Music', Icon: Music },
  { id: 'space-mix', label: 'Space', Icon: Moon },
  { id: 'travel-mix', label: 'Travel', Icon: Map },
  { id: 'love-mix', label: 'Love', Icon: Heart },
  { id: 'crypto-mix', label: 'Security', Icon: Shield },
  { id: 'random-shapes', label: 'Shapes', Icon: Hexagon },
  { id: 'tools-mix', label: 'Tools', Icon: PenTool },
  { id: 'nautical-mix', label: 'Nautical', Icon: Anchor },
  { id: 'weather-mix', label: 'Weather', Icon: Snowflake },
  { id: 'media-mix', label: 'Media', Icon: Camera },
  { id: 'office-mix', label: 'Office', Icon: Briefcase },
  { id: 'sports-mix', label: 'Sports', Icon: Target },
  { id: 'communication-mix', label: 'Comms', Icon: Phone },
  { id: 'magic-mix', label: 'Magic', Icon: Sparkles },
  { id: 'random-1', label: 'Random 1', Icon: Smile },
  { id: 'random-2', label: 'Random 2', Icon: Coffee },
  { id: 'random-3', label: 'Random 3', Icon: Zap },
]

const QR_FRAME_STYLES = [
  'none', 'bubble', 'border', 'badge', 'solid', 'shadow',
  'vintage', 'ticket', 'minimal', 'polaroid', 'browser',
  'neon', 'glass', 'cyberpunk', 'glowing', 'retro',
]

const BG_PRESETS = [
  { label: 'Midnight', color: '#0C0F1D', color2: '#1a1a2e' },
  { label: 'Ocean', color: '#0077b6', color2: '#00b4d8' },
  { label: 'Sunset', color: '#ff6b6b', color2: '#feca57' },
  { label: 'Forest', color: '#1B4332', color2: '#2D6A4F' },
  { label: 'Lavender', color: '#7B2CBF', color2: '#C77DFF' },
  { label: 'Peach', color: '#ff9a9e', color2: '#fecfef' },
  { label: 'Slate', color: '#334155', color2: '#64748b' },
  { label: 'Cherry', color: '#9B2335', color2: '#C53030' },
  { label: 'Teal', color: '#0D9488', color2: '#2DD4BF' },
  { label: 'Gold', color: '#B8860B', color2: '#FFD700' },
]

const DEFAULT_QR_CUSTOMIZATION: QRCustomization = {
  dotStyle: 'square',
  eyeFrameStyle: 'square',
  eyeBallStyle: 'square',
  gradientEnabled: false,
  gradientType: 'linear',
  gradientRotation: 0,
  gradientScale: 50,
  foregroundColor: '#000000',
  foregroundColor2: '#000000',
  bgGradientEnabled: false,
  bgGradientType: 'linear',
  bgGradientRotation: 0,
  bgGradientScale: 50,
  backgroundColor: '#ffffff',
  backgroundColor2: '#ffffff',
  frameStyle: 'none',
  frameText: 'SCAN ME',
  frameColor: '#000000',
  frameTextColor: '#ffffff',
  textGradientEnabled: false,
  textGradientType: 'linear',
  textGradientRotation: 0,
  textGradientScale: 50,
  frameTextColor2: '#ffffff',
  frameFontFamily: 'sans-serif',
  frameTextPosition: 'bottom',
  logoSize: 20,
  logoPadding: true,
  logoName: '',
  dataType: 'url',
  data: { url: 'https://linkora.app' },
}

const DEFAULT_BG_CONFIG: BackgroundConfig = {
  type: 'solid',
  color: '#0C0F1D',
  color2: '#1a1a2e',
  angle: 135,
  pattern: 'none',
}

const DEFAULT_PATTERN_CONFIG: PatternConfig = {
  id: 'dots',
  color: '#ffffff',
  opacity: 10,
}

const DEFAULT_FRAME_CONFIG: FrameConfig = {
  frameStyle: 'none',
  frameColor: '#000000',
  frameText: 'SCAN ME',
  frameTextColor: '#ffffff',
}

const DEFAULT_META: TemplateMeta = {
  title: '',
  description: '',
  type: 'nfc_template',
  category: 'general',
  tags: '',
  is_premium: false,
  is_featured: false,
  status: 'draft',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getBgStyle(bg: BackgroundConfig): React.CSSProperties {
  if (bg.type === 'linear-gradient') {
    return { background: `linear-gradient(${bg.angle}deg, ${bg.color}, ${bg.color2})` }
  }
  if (bg.type === 'radial-gradient') {
    return { background: `radial-gradient(circle, ${bg.color}, ${bg.color2})` }
  }
  return { backgroundColor: bg.color }
}

function patternToSVG(patternId: string, color: string, opacity: number): string {
  const o = opacity / 100
  const patterns: Record<string, string> = {
    dots: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="1.5" fill="${color}" opacity="${o}"/></svg>`,
    'organic-waves': `<svg width="40" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M0 10 Q10 0 20 10 Q30 20 40 10" fill="none" stroke="${color}" stroke-width="1" opacity="${o}"/></svg>`,
    diamonds: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><polygon points="10,2 18,10 10,18 2,10" fill="none" stroke="${color}" stroke-width="1" opacity="${o}"/></svg>`,
    'hex-grid': `<svg width="28" height="24" xmlns="http://www.w3.org/2000/svg"><polygon points="14,2 24,8 24,16 14,22 4,16 4,8" fill="none" stroke="${color}" stroke-width="1" opacity="${o}"/></svg>`,
    'geo-triangles': `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><polygon points="10,2 18,18 2,18" fill="none" stroke="${color}" stroke-width="1" opacity="${o}"/></svg>`,
    concentric: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="none" stroke="${color}" stroke-width="0.5" opacity="${o}"/><circle cx="10" cy="10" r="4" fill="none" stroke="${color}" stroke-width="0.5" opacity="${o}"/></svg>`,
    zigzag: `<svg width="30" height="12" xmlns="http://www.w3.org/2000/svg"><polyline points="0,10 7.5,2 15,10 22.5,2 30,10" fill="none" stroke="${color}" stroke-width="1" opacity="${o}"/></svg>`,
  }
  const svg = patterns[patternId] || patterns.dots
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function TypeSelector({ onSelect }: { onSelect: (t: DesignType) => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <Sparkles className="w-10 h-10 text-accent-500 mx-auto mb-3" />
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Create New Template
          </h1>
          <p className="text-neutral-500 mt-2">Choose a template type to get started</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATE_TYPES.map(({ type, label, description, icon: Icon, color, bgColor }) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-accent-500 dark:hover:border-accent-500 hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">{label}</h3>
              <p className="text-sm text-neutral-500 mt-1">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MetadataPanel({
  meta,
  onChange,
  onSave,
  saving,
  isEdit,
}: {
  meta: TemplateMeta
  onChange: (m: Partial<TemplateMeta>) => void
  onSave: () => void
  saving: boolean
  isEdit: boolean
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-4">
      <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
        <Info className="w-4 h-4 text-accent-500" />
        Template Details
      </h3>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1">Name *</label>
        <input
          type="text"
          value={meta.title}
          onChange={e => onChange({ title: e.target.value })}
          placeholder="My Awesome Template"
          className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600 placeholder:text-neutral-400"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1">Description</label>
        <textarea
          value={meta.description}
          onChange={e => onChange({ description: e.target.value })}
          placeholder="Brief description of this template..."
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600 placeholder:text-neutral-400 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1">Type</label>
        <div className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-sm">
          {TEMPLATE_TYPES.find(t => t.type === meta.type)?.label || meta.type}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1">Category</label>
        <div className="relative">
          <select
            value={meta.category}
            onChange={e => onChange({ category: e.target.value as TemplateCategory })}
            className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600 appearance-none"
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1">
          <Tag className="w-3 h-3 inline mr-1" />
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={meta.tags}
          onChange={e => onChange({ tags: e.target.value })}
          placeholder="modern, minimal, dark"
          className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600 placeholder:text-neutral-400"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1">Status</label>
        <div className="relative">
          <select
            value={meta.status}
            onChange={e => onChange({ status: e.target.value as TemplateStatus })}
            className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600 appearance-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={meta.is_premium}
            onChange={e => onChange({ is_premium: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
          />
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Premium</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={meta.is_featured}
            onChange={e => onChange({ is_featured: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
          />
          <Sparkles className="w-3.5 h-3.5 text-accent-500" />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Featured</span>
        </label>
      </div>

      <button
        onClick={onSave}
        disabled={saving || !meta.title.trim()}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? 'Saving...' : isEdit ? 'Update Template' : 'Save as Template'}
      </button>
    </div>
  )
}

function NfcEditor({ design, setDesign, qrCodes }: { design: CardDesign; setDesign: (d: CardDesign) => void; qrCodes: any[] }) {
  return (
    <CardCanvasEditor
      cardId="admin-template"
      initialDesign={design}
      onSave={async (d) => { setDesign(d) }}
      onClose={() => {}}
      qrCodes={qrCodes}
    />
  )
}

function LinkPageEditor({ design, links, setDesign, setLinks }: {
  design: PageDesign
  links: Link[]
  setDesign: (d: PageDesign) => void
  setLinks: (l: Link[]) => void
}) {
  const store = usePageBuilderStore()

  useEffect(() => {
    store.setPage({
      settings: { slug: 'preview', title: 'Preview', visibility: 'public', status: 'draft' },
      design,
      links,
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
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      <div className="flex-1 overflow-y-auto">
        <DesignEditor />
      </div>
      <div className="w-full lg:w-[360px] shrink-0">
        <div className="sticky top-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent-500" />
              <span className="text-sm font-bold text-neutral-900 dark:text-white">Live Preview</span>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              <div className="w-[280px] mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                <PagePreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QrEditor({ customization, setCustomization }: {
  customization: QRCustomization
  setCustomization: (c: QRCustomization) => void
}) {
  const update = (patch: Partial<QRCustomization>) => setCustomization({ ...customization, ...patch })

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 space-y-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-accent-500" />
            QR Code Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">Data / URL</label>
              <input
                type="text"
                value={customization.data?.url || ''}
                onChange={e => update({ data: { ...customization.data, url: e.target.value } })}
                placeholder="https://example.com"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">Dot Style</label>
              <div className="relative">
                <select
                  value={customization.dotStyle}
                  onChange={e => update({ dotStyle: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600 appearance-none"
                >
                  {['square', 'dots', 'rounded', 'classy', 'star', 'diamond', 'hexagon', 'fluid', 'cross', 'heart', 'triangle', 'drop', 'ninja', 'sparkle', 'pill'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">Eye Frame Style</label>
              <div className="relative">
                <select
                  value={customization.eyeFrameStyle}
                  onChange={e => update({ eyeFrameStyle: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600 appearance-none"
                >
                  {['square', 'rounded', 'circle', 'leaf', 'octagon', 'star', 'shield', 'hexagon', 'diamond', 'triangle', 'drop', 'ninja', 'sparkle', 'pill'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">Eye Ball Style</label>
              <div className="relative">
                <select
                  value={customization.eyeBallStyle}
                  onChange={e => update({ eyeBallStyle: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600 appearance-none"
                >
                  {['square', 'rounded', 'circle', 'leaf', 'diamond', 'cross', 'star', 'shield', 'hexagon', 'triangle', 'drop', 'ninja', 'sparkle', 'pill'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">Foreground Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={customization.foregroundColor}
                  onChange={e => update({ foregroundColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.foregroundColor}
                  onChange={e => update({ foregroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">Background Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={customization.backgroundColor}
                  onChange={e => update({ backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.backgroundColor}
                  onChange={e => update({ backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-600"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-neutral-500 mb-1">Gradient</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={customization.gradientEnabled}
                onChange={e => update({ gradientEnabled: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">Enable foreground gradient</span>
            </label>
            {customization.gradientEnabled && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Color 2</label>
                  <input
                    type="color"
                    value={customization.foregroundColor2}
                    onChange={e => update({ foregroundColor2: e.target.value })}
                    className="w-full h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Rotation ({customization.gradientRotation}&deg;)</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={customization.gradientRotation}
                    onChange={e => update({ gradientRotation: Number(e.target.value) })}
                    className="w-full accent-accent-600"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[320px] shrink-0">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sticky top-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-accent-500" />
            Preview
          </h3>
          <div className="flex items-center justify-center p-6 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
            <QRGenerator
              value={customization.data?.url || 'https://linkora.app'}
              size={200}
              customization={customization}
              previewMode
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function BackgroundEditor({ config, setConfig }: {
  config: BackgroundConfig
  setConfig: (c: BackgroundConfig) => void
}) {
  const update = (patch: Partial<BackgroundConfig>) => setConfig({ ...config, ...patch })

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <Image className="w-4 h-4 text-accent-500" />
          Background Settings
        </h3>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-neutral-500 mb-2">Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['solid', 'linear-gradient', 'radial-gradient', 'pattern'] as const).map(t => (
              <button
                key={t}
                onClick={() => update({ type: t })}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  config.type === t
                    ? 'border-accent-500 bg-accent-500/10 text-accent-600 dark:text-accent-400'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {t === 'solid' ? 'Solid' : t === 'linear-gradient' ? 'Linear' : t === 'radial-gradient' ? 'Radial' : 'Pattern'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">
                {config.type === 'solid' ? 'Color' : 'Color 1'}
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={config.color}
                  onChange={e => update({ color: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={config.color}
                  onChange={e => update({ color: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-600"
                />
              </div>
            </div>
            {config.type !== 'solid' && config.type !== 'pattern' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Color 2</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={config.color2}
                    onChange={e => update({ color2: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.color2}
                    onChange={e => update({ color2: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-600"
                  />
                </div>
              </div>
            )}
          </div>

          {config.type === 'linear-gradient' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">
                Angle ({config.angle}&deg;)
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={config.angle}
                onChange={e => update({ angle: Number(e.target.value) })}
                className="w-full accent-accent-600"
              />
            </div>
          )}

          {config.type === 'pattern' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-2">Pattern</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {PATTERN_OPTIONS.filter(p => p.id !== 'none').map(p => (
                  <button
                    key={p.id}
                    onClick={() => update({ pattern: p.id })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[10px] transition-colors ${
                      config.pattern === p.id
                        ? 'border-accent-500 bg-accent-500/10 text-accent-600 dark:text-accent-400'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300'
                    }`}
                  >
                    <p.Icon className="w-4 h-4" />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-neutral-500 mb-2">Presets</label>
          <div className="flex flex-wrap gap-2">
            {BG_PRESETS.map(preset => (
              <button
                key={preset.label}
                onClick={() => update({ color: preset.color, color2: preset.color2, type: 'linear-gradient' })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400 transition-colors"
              >
                <div className="w-4 h-4 rounded-full" style={{ background: `linear-gradient(135deg, ${preset.color}, ${preset.color2})` }} />
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Preview</h3>
        <div
          className="w-full h-48 rounded-xl border border-neutral-200 dark:border-neutral-700"
          style={config.type === 'pattern'
            ? {
                backgroundColor: config.color,
                backgroundImage: config.pattern !== 'none' ? patternToSVG(config.pattern, '#ffffff', 15) : 'none',
              }
            : getBgStyle(config)
          }
        />
      </div>
    </div>
  )
}

function PatternEditor({ config, setConfig }: {
  config: PatternConfig
  setConfig: (c: PatternConfig) => void
}) {
  const update = (patch: Partial<PatternConfig>) => setConfig({ ...config, ...patch })

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-accent-500" />
          Pattern Settings
        </h3>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-neutral-500 mb-2">Pattern Style</label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {PATTERN_OPTIONS.filter(p => p.id !== 'none').map(p => (
              <button
                key={p.id}
                onClick={() => update({ id: p.id })}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-[10px] font-medium transition-colors ${
                  config.id === p.id
                    ? 'border-accent-500 bg-accent-500/10 text-accent-600 dark:text-accent-400'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300'
                }`}
              >
                <p.Icon className="w-5 h-5" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1">Pattern Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={config.color}
                onChange={e => update({ color: e.target.value })}
                className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer"
              />
              <input
                type="text"
                value={config.color}
                onChange={e => update({ color: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1">
              Opacity ({config.opacity}%)
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={config.opacity}
              onChange={e => update({ opacity: Number(e.target.value) })}
              className="w-full accent-accent-600"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Preview</h3>
        <div
          className="w-full h-48 rounded-xl border border-neutral-200 dark:border-neutral-700"
          style={{
            backgroundColor: '#0C0F1D',
            backgroundImage: patternToSVG(config.id, config.color, config.opacity),
            backgroundSize: '20px 20px',
          }}
        />
      </div>
    </div>
  )
}

function FrameEditor({ config, setConfig }: {
  config: FrameConfig
  setConfig: (c: FrameConfig) => void
}) {
  const update = (patch: Partial<FrameConfig>) => setConfig({ ...config, ...patch })

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <Frame className="w-4 h-4 text-accent-500" />
          QR Frame Settings
        </h3>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-neutral-500 mb-2">Frame Style</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {QR_FRAME_STYLES.map(style => (
              <button
                key={style}
                onClick={() => update({ frameStyle: style })}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border capitalize transition-colors ${
                  config.frameStyle === style
                    ? 'border-accent-500 bg-accent-500/10 text-accent-600 dark:text-accent-400'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {config.frameStyle !== 'none' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Frame Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={config.frameColor}
                    onChange={e => update({ frameColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.frameColor}
                    onChange={e => update({ frameColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Text Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={config.frameTextColor}
                    onChange={e => update({ frameTextColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.frameTextColor}
                    onChange={e => update({ frameTextColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-600"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">Frame Text</label>
              <input
                type="text"
                value={config.frameText}
                onChange={e => update({ frameText: e.target.value })}
                placeholder="SCAN ME"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Preview</h3>
        <div className="flex items-center justify-center p-6 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
          <QRGenerator
            value="https://linkora.app"
            size={180}
            customization={{
              ...DEFAULT_QR_CUSTOMIZATION,
              frameStyle: config.frameStyle as any,
              frameColor: config.frameColor,
              frameText: config.frameText,
              frameTextColor: config.frameTextColor,
            }}
            previewMode
          />
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface AdminTemplateEditorProps {
  mode?: 'template' | 'community'
}

export function AdminTemplateEditor({ mode = 'template' }: AdminTemplateEditorProps) {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const typeParam = searchParams.get('type') as DesignType | null

  const [selectedType, setSelectedType] = useState<DesignType | null>(typeParam)
  const [meta, setMeta] = useState<TemplateMeta>({ ...DEFAULT_META, type: typeParam || 'nfc_template' })
  const [saving, setSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(!!id)

  const isEdit = !!id

  // Editor-specific state
  const [cardDesign, setCardDesign] = useState<CardDesign>({
    bgType: 'solid',
    bgColor: '#0C0F1D',
    elements: [
      { id: 'name', type: 'name', x: 5, y: 55, visible: true, color: '#FFFFFF', fontSize: 'xl', fontWeight: 'bold' },
      { id: 'job', type: 'job', x: 5, y: 72, visible: true, color: '#A0A0A0', fontSize: 'sm', fontWeight: 'medium' },
      { id: 'company', type: 'company', x: 5, y: 82, visible: true, color: '#808080', fontSize: 'xs', fontWeight: 'semibold' },
      { id: 'qr', type: 'qr', x: 68, y: 45, visible: true, size: 'lg' },
    ],
    showGrid: false,
    pattern: 'none',
    patternOpacity: 0.05,
  })
  const [pageDesign, setPageDesign] = useState<PageDesign>({
    backgroundColor: '#111827',
    backgroundType: 'color',
    profileImagePosition: 'top',
    profileImageSize: 'medium',
    profileBorderRadius: 50,
    linkStyle: 'solid',
    linkBackgroundColor: '#1f2937',
    linkTextColor: '#ffffff',
    linkBorderWidth: 0,
    linkBorderRadius: 12,
    linkSpacing: 8,
    fontFamily: 'Inter',
    headingSize: 24,
    textSize: 14,
    headingColor: '#ffffff',
    textColor: '#d1d5db',
    showBio: true,
    animationEnabled: false,
  })
  const [pageLinks, setPageLinks] = useState<Link[]>([])
  const [qrCustomization, setQrCustomization] = useState<QRCustomization>({ ...DEFAULT_QR_CUSTOMIZATION })
  const [bgConfig, setBgConfig] = useState<BackgroundConfig>({ ...DEFAULT_BG_CONFIG })
  const [patternConfig, setPatternConfig] = useState<PatternConfig>({ ...DEFAULT_PATTERN_CONFIG })
  const [frameConfig, setFrameConfig] = useState<FrameConfig>({ ...DEFAULT_FRAME_CONFIG })

  // Load existing template in edit mode
  useEffect(() => {
    if (!id) return
    const loadItem = async () => {
      try {
        setIsLoading(true)
        if (mode === 'community') {
          const res = await adminSubmissions.get(id)
          if (res.data) {
            const sub = res.data.submission
            setSelectedType(sub.type)
            setMeta({
              title: sub.title,
              description: sub.description || '',
              type: sub.type,
              category: (sub.category as TemplateCategory) || 'general',
              tags: (sub.tags || []).join(', '),
              is_premium: false,
              is_featured: false,
              status: 'draft',
            })
            if (sub.metadata && Object.keys(sub.metadata).length > 0) {
              hydrateEditor({ type: sub.type, metadata: sub.metadata } as DesignMarketplaceItem)
            }
          }
        } else {
          const res = await adminDesigns.get(id)
          if (res.data) {
            const found = res.data.design
            setSelectedType(found.type)
            setMeta({
              title: found.title,
              description: found.description || '',
              type: found.type,
              category: (found.category as TemplateCategory) || 'general',
              tags: (found.tags || []).join(', '),
              is_premium: found.is_premium,
              is_featured: found.is_featured,
              status: found.status || 'draft',
            })
            hydrateEditor(found)
          }
        }
      } catch {
      } finally {
        setIsLoading(false)
      }
    }
    loadItem()
  }, [id, mode])

  const hydrateEditor = (item: DesignMarketplaceItem) => {
    const m = item.metadata || {}
    switch (item.type) {
      case 'nfc_template':
        if (m.cardDesign) setCardDesign(m.cardDesign as CardDesign)
        break
      case 'link_page_template':
        if (m.pageDesign) setPageDesign(m.pageDesign as PageDesign)
        if (m.links) setPageLinks(m.links as Link[])
        break
      case 'qr_template':
        if (m.qrCustomization) setQrCustomization({ ...DEFAULT_QR_CUSTOMIZATION, ...m.qrCustomization as QRCustomization })
        break
      case 'background':
        if (m.background) setBgConfig(m.background as BackgroundConfig)
        break
      case 'pattern':
        if (m.pattern) setPatternConfig(m.pattern as PatternConfig)
        break
      case 'qr_frame':
        if (m.frame) setFrameConfig(m.frame as FrameConfig)
        break
    }
  }

  const handleSave = async () => {
    if (!meta.title.trim()) return
    if (!selectedType) return

    setSaving(true)
    try {
      let metadata: Record<string, unknown> = {}

      switch (selectedType) {
        case 'nfc_template':
          metadata = { cardDesign }
          break
        case 'link_page_template':
          metadata = { pageDesign, links: pageLinks }
          break
        case 'qr_template':
          metadata = { qrCustomization, qrData: qrCustomization.data }
          break
        case 'background':
          metadata = { background: bgConfig }
          break
        case 'pattern':
          metadata = { pattern: patternConfig }
          break
        case 'qr_frame':
          metadata = { frame: frameConfig }
          break
      }

      const payload: Partial<DesignMarketplaceItem> = {
        title: meta.title.trim(),
        description: meta.description.trim() || undefined,
        type: selectedType,
        category: meta.category,
        tags: meta.tags.split(',').map(t => t.trim()).filter(Boolean),
        is_premium: meta.is_premium,
        is_featured: meta.is_featured,
        is_published: meta.status === 'published',
        status: meta.status,
        metadata,
        file_size: JSON.stringify(metadata).length,
      }

      if (mode === 'community' && isEdit && id) {
        await adminSubmissions.update(id, {
          title: meta.title.trim(),
          description: meta.description.trim() || undefined,
          type: selectedType,
          category: meta.category,
          tags: meta.tags.split(',').map(t => t.trim()).filter(Boolean),
          metadata,
        })
      } else if (isEdit && id) {
        await adminDesigns.update(id, payload)
      } else {
        await adminDesigns.create(payload)
      }

      navigate('/admin/templates')
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const handleTypeSelect = (type: DesignType) => {
    setSelectedType(type)
    setMeta(prev => ({ ...prev, type }))
  }

  const handleBack = () => {
    if (selectedType && !isEdit) {
      setSelectedType(null)
    } else {
      navigate('/admin/templates')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-accent-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading template...</p>
        </div>
      </div>
    )
  }

  if (!selectedType) {
    return <TypeSelector onSelect={handleTypeSelect} />
  }

  const renderEditor = () => {
    switch (selectedType) {
      case 'nfc_template':
        return <NfcEditor design={cardDesign} setDesign={setCardDesign} qrCodes={[]} />
      case 'link_page_template':
        return <LinkPageEditor design={pageDesign} links={pageLinks} setDesign={setPageDesign} setLinks={setPageLinks} />
      case 'qr_template':
        return <QrEditor customization={qrCustomization} setCustomization={setQrCustomization} />
      case 'background':
        return <BackgroundEditor config={bgConfig} setConfig={setBgConfig} />
      case 'pattern':
        return <PatternEditor config={patternConfig} setConfig={setPatternConfig} />
      case 'qr_frame':
        return <FrameEditor config={frameConfig} setConfig={setFrameConfig} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 max-w-[1800px] mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
            <div>
              <h1 className="text-base font-bold text-neutral-900 dark:text-white">
                {isEdit ? 'Edit Template' : 'New Template'}
              </h1>
              <p className="text-xs text-neutral-500">
                {TEMPLATE_TYPES.find(t => t.type === selectedType)?.label}
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !meta.title.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-4 lg:px-6 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Editor Area */}
          <div className="flex-1 min-w-0">
            {renderEditor()}
          </div>

          {/* Metadata Sidebar */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="sticky top-[73px]">
              <MetadataPanel
                meta={meta}
                onChange={m => setMeta(prev => ({ ...prev, ...m }))}
                onSave={handleSave}
                saving={saving}
                isEdit={isEdit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
