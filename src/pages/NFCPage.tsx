import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Wifi,
  Plus,
  Trash2,
  Power,
  Edit2,
  ExternalLink,
  Link2,
  Cpu,
  Check,
  RefreshCw,
  X,
  CreditCard,
  Smartphone,
  ChevronRight,
  Palette,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { useNotification } from '@/hooks/useNotification'
import { nfcAPI } from '@/api/nfc'
import { qrAPI } from '@/api/qr'
import { pagesAPI } from '@/api/pages'
import type { NFCCard, CardDesign } from '@/types/nfc'
import type { QRCode } from '@/types/qr'
import { CardThumb } from '@/components/nfcCardDesignSystem'
import type { NFCTemplate } from '@/components/nfcCardDesignSystem'
import { TEMPLATES } from '@/components/nfcCardTemplates'
import { CardCanvasEditor } from '@/components/CardCanvasEditor'

interface PageOption {
  id: string
  slug: string
  title: string
}


// ─── Template Picker Modal ────────────────────────────────────────────────────

function TemplatePickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (template: NFCTemplate) => void
  onClose: () => void
}) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
      <div className="bg-[#0E0E18] border border-neutral-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-extrabold text-white">{t('nfc.templatePicker.title')}</h2>
            <p className="text-sm text-neutral-500 mt-0.5">{t('nfc.templatePicker.subtitle')}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
          {TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              onMouseEnter={() => setHovered(template.id)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                hovered === template.id
                  ? 'border-indigo-500 shadow-xl shadow-indigo-500/20 scale-[1.02]'
                  : 'border-neutral-700 hover:border-neutral-500'
              }`}
            >
              <CardThumb template={template} cardSize="standard" />
              <div className="px-3 py-2.5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
                <p className="text-xs font-bold text-white truncate">{template.name}</p>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-all ${hovered === template.id ? 'text-indigo-400 translate-x-0.5' : 'text-neutral-600'}`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Create Card Modal ────────────────────────────────────────────────────────

function CreateCardModal({
  template,
  pages,
  onCreate,
  onBack,
  onClose,
}: {
  template: NFCTemplate
  pages: PageOption[]
  onCreate: (data: { title: string; description: string; pageId: string }) => void
  onBack: () => void
  onClose: () => void
}) {
  const { t } = useTranslation()
  const [form, setForm] = useState({ title: '', description: '', pageId: pages[0]?.id || '' })

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0E0E18] border border-neutral-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <div>
              <h2 className="text-lg font-extrabold text-white">{t('nfc.cardDetails')}</h2>
              <p className="text-xs text-neutral-500">{t('nfc.templatePicker.using')} <span className="text-indigo-400">{template.name}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template preview */}
        <div className="px-6 pt-5">
          <div className="rounded-2xl overflow-hidden border border-neutral-800 max-w-[200px] mx-auto">
            <CardThumb template={template} />
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">{t('nfc.fields.cardName')} *</label>
            <input
              type="text"
              placeholder={t('nfc.placeholders.cardName')}
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">{t('nfc.fields.description')}</label>
            <textarea
              placeholder={t('nfc.placeholders.description')}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none h-20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">{t('nfc.fields.destinationPage')}</label>
            <select
              value={form.pageId}
              onChange={e => setForm({ ...form, pageId: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            >
              {pages.length === 0
                ? <option value="">{t('nfc.placeholders.createPageFirst')}</option>
                : pages.map(p => <option key={p.id} value={p.id}>{p.title} (/{p.slug})</option>)}
            </select>
          </div>

          <button
            onClick={() => form.title.trim() && onCreate(form)}
            disabled={!form.title.trim()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-40 mt-2"
          >
            {t('nfc.buttons.createAndDesign')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Card Grid Item ───────────────────────────────────────────────────────────

function CardItem({
  card, pages, onEdit, onDesign, onSimulate, onToggle, onDelete,
}: {
  card: NFCCard
  pages: PageOption[]
  onEdit: () => void
  onDesign: () => void
  onSimulate: () => void
  onToggle: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const linkedPage = pages.find(p => p.id === card.pageId)
  const hasDesign = Boolean(card.cardDesign)

  return (
    <div className={`bg-white dark:bg-neutral-950 rounded-2xl border transition-all hover:shadow-lg flex flex-col overflow-hidden ${card.isActive ? 'border-neutral-200 dark:border-neutral-800' : 'border-neutral-100 dark:border-neutral-900 opacity-60'}`}>
      {/* Card visual header */}
      <div className="p-5 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 relative overflow-hidden h-36 flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${card.isActive ? 'bg-green-400 animate-pulse' : 'bg-neutral-600'}`} />
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">{t('nfc.cardLabel')}</span>
          </div>
          <Cpu className={`w-5 h-5 ${card.isActive ? 'text-indigo-400' : 'text-neutral-600'}`} />
        </div>
        <div className="z-10">
          <h3 className="font-bold text-lg text-white tracking-tight truncate">{card.title}</h3>
          <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">{card.description || t('nfc.placeholders.noDescription')}</p>
        </div>
        <div className="flex items-center justify-between z-10 border-t border-white/5 pt-2">
          <span className="text-[9px] text-neutral-600 font-mono">
            {card.tagId ? `UID: ${card.tagId.substring(0, 12)}...` : t('nfc.placeholders.tagNotLinked')}
          </span>
          {hasDesign && (
            <span className="text-[9px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">
              {t('nfc.labels.customDesign')}
            </span>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500 font-medium">{t('nfc.labels.redirectsTo')}</span>
          {linkedPage ? (
            <a href={`https://linkora.app/${linkedPage.slug}`} target="_blank" rel="noreferrer"
              className="text-indigo-500 hover:text-indigo-400 font-bold flex items-center gap-1 transition-colors">
              /{linkedPage.slug}
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-neutral-500 italic">{t('nfc.labels.noPageLinked')}</span>
          )}
        </div>

        {/* Design button — prominent */}
        <button
          onClick={onDesign}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs shadow-md shadow-indigo-600/20"
        >
          <Palette className="w-3.5 h-3.5" />
          {hasDesign ? t('nfc.buttons.editDesign') : t('nfc.buttons.createDesign')}
        </button>

        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-900 gap-1">
          <button onClick={onSimulate} className="flex items-center gap-1 text-xs font-bold px-2.5 py-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors">
            <Link2 className="w-3 h-3" />
            {t('nfc.buttons.linkTag')}
          </button>
          <div className="flex items-center gap-1">
            <button onClick={onToggle} className={`p-2 rounded-lg transition-colors ${card.isActive ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20' : 'text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`} title={card.isActive ? t('nfc.buttons.deactivate') : t('nfc.buttons.activate')}>
              <Power className="w-4 h-4" />
            </button>
            <button onClick={onEdit} className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main NFCPage ─────────────────────────────────────────────────────────────

export function NFCPage() {
  const { t } = useTranslation()
  const notification = useNotification()

  const [cards, setCards] = useState<NFCCard[]>([])
  const [pages, setPages] = useState<PageOption[]>([])
  const [qrCodes, setQRCodes] = useState<QRCode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal states
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<NFCTemplate>(TEMPLATES[0])
  const [designingCard, setDesigningCard] = useState<NFCCard | null>(null)

  // Edit card modal
  const [editingCard, setEditingCard] = useState<NFCCard | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', pageId: '' })

  // Simulator
  const [showSimulator, setShowSimulator] = useState(false)
  const [simulatorCard, setSimulatorCard] = useState<NFCCard | null>(null)
  const [simTagId, setSimTagId] = useState('')
  const [isSimulating, setIsSimulating] = useState(false)
  const [simSuccess, setSimSuccess] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [nfcRes, pagesRes, qrRes] = await Promise.all([
        nfcAPI.list(),
        pagesAPI.list(),
        qrAPI.list(),
      ])
      setCards(nfcRes.cards)
      setPages(pagesRes.pages || [])
      setQRCodes(qrRes.qrCodes || [])
    } catch {
      notification.error(t('nfc.toasts.loadFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  // ── Handlers ────────────────────────────────────────────────────────────────



  const handleTemplateSelect = (template: NFCTemplate) => {
    setSelectedTemplate(template)
    setShowTemplatePicker(false)
    setShowCreateModal(true)
  }

  const handleCreateCard = async (data: { title: string; description: string; pageId: string }) => {
    try {
      const initialDesign: CardDesign = {
        templateId: selectedTemplate.id,
        bgType: 'template',
        elements: [],
        showGrid: false,
        ...selectedTemplate
      } as any
      const { card } = await nfcAPI.create({
        title: data.title,
        description: data.description,
        pageId: data.pageId || undefined,
        isActive: true,
      })
      setCards(prev => [...prev, card])
      setShowCreateModal(false)
      // Open designer immediately
      setDesigningCard({ ...card, cardDesign: initialDesign })
      notification.success(t('nfc.toasts.created'))
    } catch {
      notification.error(t('nfc.toasts.createFailed'))
    }
  }

  const handleSaveDesign = async (design: CardDesign) => {
    if (!designingCard) return
    try {
      const { card } = await nfcAPI.saveDesign(designingCard.id, design)
      setCards(prev => prev.map(c => c.id === card.id ? card : c))
      notification.success(t('nfc.toasts.designSaved'))
    } catch {
      notification.error(t('nfc.toasts.designFailed'))
    }
  }

  const handleOpenDesigner = (card: NFCCard) => {
    setDesigningCard(card)
  }

  const handleToggleActive = async (id: string) => {
    try {
      const { card } = await nfcAPI.toggleActive(id)
      setCards(prev => prev.map(c => c.id === id ? card : c))
      notification.success(card.isActive ? t('nfc.toasts.activated') : t('nfc.toasts.deactivated'))
    } catch {
      notification.error(t('nfc.toasts.toggleFailed'))
    }
  }

  const handleDeleteCard = async (id: string) => {
    if (!window.confirm(t('nfc.confirmDelete'))) return
    try {
      await nfcAPI.delete(id)
      setCards(prev => prev.filter(c => c.id !== id))
      notification.success(t('nfc.toasts.deleted'))
    } catch {
      notification.error(t('nfc.toasts.deleteFailed'))
    }
  }

  const handleOpenEdit = (card: NFCCard) => {
    setEditingCard(card)
    setEditForm({ title: card.title, description: card.description || '', pageId: card.pageId || (pages[0]?.id || '') })
  }

  const handleSaveEdit = async () => {
    if (!editingCard) return
    try {
      const { card } = await nfcAPI.update(editingCard.id, { title: editForm.title, description: editForm.description, pageId: editForm.pageId })
      setCards(prev => prev.map(c => c.id === editingCard.id ? card : c))
      setEditingCard(null)
      notification.success(t('nfc.toasts.updated'))
    } catch {
      notification.error(t('nfc.toasts.updateFailed'))
    }
  }

  const handleOpenSimulator = (card: NFCCard) => {
    setSimulatorCard(card)
    setSimTagId(card.tagId || `04:${Math.random().toString(16).substring(2, 10).toUpperCase().match(/.{1,2}/g)?.join(':')}`)
    setSimSuccess(false)
    setIsSimulating(false)
    setShowSimulator(true)
  }

  const handleSimulateWrite = async () => {
    if (!simulatorCard) return
    setIsSimulating(true)
    try {
      await new Promise(r => setTimeout(r, 1500))
      await nfcAPI.write(simulatorCard.id, simTagId)
      setCards(prev => prev.map(c => c.id === simulatorCard.id ? { ...c, tagId: simTagId } : c))
      setSimSuccess(true)
      notification.success(t('nfc.toasts.tagLinked'))
    } catch {
      notification.error(t('nfc.toasts.simulationFailed'))
    } finally {
      setIsSimulating(false)
    }
  }

  const activeCards = cards.filter(c => c.isActive).length

  // ── Card Designer Mode ───────────────────────────────────────────────────────

  if (designingCard) {
    return (
      <CardCanvasEditor
        cardId={designingCard.id}
        initialDesign={designingCard.cardDesign}
        onSave={handleSaveDesign}
        onClose={() => setDesigningCard(null)}
        qrCodes={qrCodes}
      />
    )
  }

  // ── Main Page ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8 px-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-indigo-500" />
            </span>
            {t('nfc.title')}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1.5 ml-1">
            {t('nfc.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setShowTemplatePicker(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {t('nfc.addCard')}
        </button>
      </div>

      {/* Stats */}
      {!isLoading && cards.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: t('nfc.stats.totalCards'), value: cards.length, icon: CreditCard, color: 'indigo' },
            { label: t('nfc.stats.active'), value: activeCards, icon: Power, color: 'green' },
            { label: t('nfc.stats.linkedTags'), value: cards.filter(c => c.tagId).length, icon: Wifi, color: 'purple' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-11 h-11 bg-${color}-50 dark:bg-${color}-950/30 rounded-xl flex items-center justify-center text-${color}-500`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
                <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white">{value}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cards Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-neutral-500">{t('nfc.loading')}</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white dark:bg-neutral-950 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 p-16 text-center max-w-xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-950/40 rounded-3xl flex items-center justify-center text-indigo-500 mx-auto">
            <Wifi className="w-10 h-10 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">{t('nfc.emptyTitle')}</h3>
            <p className="text-neutral-500 text-sm mt-1 max-w-sm mx-auto">
              {t('nfc.emptyDesc')}
            </p>
          </div>
          <button
            onClick={() => setShowTemplatePicker(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4" />
            {t('nfc.createFirst')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map(card => (
            <CardItem
              key={card.id}
              card={card}
              pages={pages}
              onEdit={() => handleOpenEdit(card)}
              onDesign={() => handleOpenDesigner(card)}
              onSimulate={() => handleOpenSimulator(card)}
              onToggle={() => handleToggleActive(card.id)}
              onDelete={() => handleDeleteCard(card.id)}
            />
          ))}
        </div>
      )}

      {/* ── Modals ───────────────────────────────────────────────────────────── */}



      {/* Template Picker */}
      {showTemplatePicker && (
        <TemplatePickerModal
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}

      {/* Create Card */}
      {showCreateModal && (
        <CreateCardModal
          template={selectedTemplate}
          pages={pages}
          onCreate={handleCreateCard}
          onBack={() => { setShowCreateModal(false); setShowTemplatePicker(true) }}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Card Modal */}
      {editingCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-md w-full shadow-2xl p-6 relative">
            <button onClick={() => setEditingCard(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white mb-5">{t('nfc.editCard')}</h3>
            <div className="space-y-4">
              {[
                { label: t('nfc.fields.cardName'), key: 'title' as const, placeholder: t('nfc.placeholders.cardNameEdit'), type: 'text' },
                { label: t('nfc.fields.description'), key: 'description' as const, placeholder: t('nfc.placeholders.descriptionEdit'), type: 'textarea' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">{label}</label>
                  {type === 'textarea' ? (
                    <textarea
                      placeholder={placeholder}
                      value={editForm[key]}
                      onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={editForm[key]}
                      onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">{t('nfc.fields.destinationPage')}</label>
                <select
                  value={editForm.pageId}
                  onChange={e => setEditForm({ ...editForm, pageId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {pages.map(p => <option key={p.id} value={p.id}>{p.title} (/{p.slug})</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSaveEdit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all">{t('nfc.buttons.save')}</button>
                <button onClick={() => setEditingCard(null)} className="flex-1 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold py-2.5 rounded-xl transition-all">{t('nfc.buttons.cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NFC Tag Simulator */}
      {showSimulator && simulatorCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white">{t('nfc.simulator.title')}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{t('nfc.simulator.subtitle')}</p>
              </div>
              <button onClick={() => setShowSimulator(false)} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 rounded-2xl py-10 border border-neutral-200/50 dark:border-neutral-800/50">
                <div className={`w-32 h-20 bg-gradient-to-br from-neutral-800 to-neutral-950 rounded-xl flex flex-col items-center justify-center gap-1 text-white border border-neutral-700 relative z-10 transition-all ${isSimulating ? 'animate-pulse scale-105' : ''}`}>
                  <Cpu className="w-6 h-6 text-indigo-400" />
                  <span className="text-[10px] text-neutral-400">{t('nfc.simulator.cardTarget')}</span>
                </div>
                <div className={`mt-6 flex flex-col items-center gap-1.5 transition-all duration-700 ${isSimulating ? '-translate-y-2' : ''}`}>
                  <Smartphone className={`w-8 h-8 ${isSimulating ? 'text-indigo-500 animate-bounce' : 'text-neutral-400'}`} />
                  <span className="text-[10px] text-neutral-400">{t('nfc.simulator.placePhone')}</span>
                </div>
                {isSimulating && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-40 h-40 border-2 border-indigo-500/20 rounded-full animate-ping" /></div>}
                {simSuccess && (
                  <div className="absolute inset-0 bg-white/95 dark:bg-neutral-950/95 flex flex-col items-center justify-center gap-2 z-20 rounded-2xl">
                    <div className="w-14 h-14 bg-green-50 dark:bg-green-950 rounded-full flex items-center justify-center text-green-500 animate-bounce"><Check className="w-8 h-8" /></div>
                    <span className="font-bold text-neutral-900 dark:text-white">{t('nfc.simulator.tagLinked')}</span>
                    <span className="text-xs text-neutral-500 text-center px-6">UID {simTagId} linked to "{simulatorCard.title}"</span>
                  </div>
                )}
              </div>
              {!simSuccess ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">{t('nfc.simulator.tagUid')}</label>
                    <div className="flex gap-2">
                      <input
                        type="text" value={simTagId}
                        onChange={e => setSimTagId(e.target.value)}
                        placeholder={t('nfc.simulator.uidPlaceholder')}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => setSimTagId(`04:${Math.random().toString(16).substring(2, 10).toUpperCase().match(/.{1,2}/g)?.join(':')}`)}
                        className="px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 text-xs font-bold"
                      >
                        {t('nfc.simulator.random')}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleSimulateWrite}
                    disabled={isSimulating || !simTagId.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-600/25 disabled:opacity-50"
                  >
                    {isSimulating ? t('nfc.simulator.writing') : t('nfc.simulator.startSimulation')}
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowSimulator(false)} className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold py-3 rounded-xl">{t('nfc.simulator.done')}</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
