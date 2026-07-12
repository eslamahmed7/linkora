import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { Link as LinkIcon, Plus, Trash2, Eye, EyeOff, SmilePlus, Palette } from 'lucide-react'
import { IconPickerModal } from './IconPickerModal'
import { getIconData } from '../utils/iconMap'

export function LinkEditor() {
  const { t } = useTranslation()
  const { page, addLink, updateLink, deleteLink } = usePageBuilderStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newLink, setNewLink] = useState({ title: '', url: '' })
  const [pickingIconForLinkId, setPickingIconForLinkId] = useState<string | null>(null)

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      addLink({
        title: newLink.title,
        url: newLink.url,
        isActive: true,
      })
      setNewLink({ title: '', url: '' })
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <LinkIcon className="w-5 h-5 text-accent-600" />
        <h2 className="text-lg font-bold">{t('components.linkEditor.title')}</h2>
        <span className="ml-auto text-sm text-neutral-500 dark:text-neutral-400">
          {t('components.linkEditor.linksCount', { count: page.links.length })}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {page.links.map((link) => (
          <div
            key={link.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
          >
            <button
              onClick={() => updateLink(link.id, { isActive: !link.isActive })}
              className={`p-2 rounded-lg transition-colors ${link.isActive ? 'text-accent-600 bg-accent-50 dark:bg-accent-900/20' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
              title={link.isActive ? t('components.linkEditor.activeVisible') : t('components.linkEditor.inactiveHidden')}
            >
              {link.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
              <div className="flex-1 min-w-0 space-y-2">
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => updateLink(link.id, { title: e.target.value })}
                  className="w-full bg-transparent font-medium text-neutral-900 dark:text-white focus:outline-none placeholder:text-neutral-400"
                  placeholder={t('components.linkEditor.linkTitle')}
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, { url: e.target.value })}
                  className="w-full bg-transparent text-sm text-neutral-500 dark:text-neutral-400 focus:outline-none placeholder:text-neutral-500"
                  placeholder={t('components.linkEditor.urlPlaceholder')}
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Icon Picker Button */}
                <button
                  onClick={() => setPickingIconForLinkId(link.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 hover:text-accent-600 transition-colors"
                  title={t('components.linkEditor.chooseIcon')}
                >
                  {link.icon ? (
                    (() => {
                      const iconData = getIconData(link.icon)
                      if (iconData) {
                        const IconComponent = iconData.component
                        return <IconComponent className="w-5 h-5" style={{ color: iconData.color }} />
                      }
                      return <SmilePlus className="w-4 h-4" />
                    })()
                  ) : (
                    <SmilePlus className="w-4 h-4" />
                  )}
                </button>
                
                {/* Color Picker Button */}
                <div className="relative w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 overflow-hidden cursor-pointer" title={t('components.linkEditor.customColor')}>
                   <input 
                     type="color" 
                     value={link.color || '#000000'} 
                     onChange={(e) => updateLink(link.id, { color: e.target.value })} 
                     className="absolute -inset-4 w-16 h-16 cursor-pointer opacity-0"
                   />
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ backgroundColor: link.color }}>
                     {!link.color && <Palette className="w-4 h-4 text-neutral-500" />}
                   </div>
                </div>

                <button
                  onClick={() => deleteLink(link.id)}
                  className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="mb-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <input
            type="text"
            placeholder={t('components.linkEditor.newLinkTitle')}
            value={newLink.title}
            onChange={(e) =>
              setNewLink({ ...newLink, title: e.target.value })
            }
            className="w-full px-3 py-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
          />
          <input
            type="url"
            placeholder={t('components.linkEditor.newLinkUrl')}
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            className="w-full px-3 py-2 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddLink}
              disabled={!newLink.title || !newLink.url}
              className="flex-1 px-4 py-2 rounded bg-accent-600 hover:bg-accent-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('components.linkEditor.addLink')}
            </button>
            <button
              onClick={() => {
                setIsAdding(false)
                setNewLink({ title: '', url: '' })
              }}
              className="flex-1 px-4 py-2 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          <Plus className="w-4 h-4" />
          {t('components.linkEditor.addLink')}
        </button>
      )}

      {pickingIconForLinkId && (
        <IconPickerModal
          onSelect={(iconId, iconColor) => {
            // Update both the icon and automatically suggest the brand color for the button
            updateLink(pickingIconForLinkId, { icon: iconId, color: iconColor })
            setPickingIconForLinkId(null)
          }}
          onClose={() => setPickingIconForLinkId(null)}
        />
      )}
    </div>
  )
}
