import { useState, useMemo } from 'react'
import { X, Search } from 'lucide-react'
import { AVAILABLE_ICONS } from '../utils/iconMap'

interface IconPickerModalProps {
  onSelect: (iconId: string, iconColor: string) => void
  onClose: () => void
}

export function IconPickerModal({ onSelect, onClose }: IconPickerModalProps) {
  const [search, setSearch] = useState('')

  const filteredIcons = useMemo(() => {
    if (!search) return AVAILABLE_ICONS
    const lowerSearch = search.toLowerCase()
    return AVAILABLE_ICONS.filter(icon => icon.name.toLowerCase().includes(lowerSearch))
  }, [search])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Choose Icon</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="relative">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search icons (e.g. WhatsApp, TikTok)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-accent-600 outline-none"
            />
          </div>
        </div>

        {/* Icons Grid */}
        <div className="p-4 overflow-y-auto flex-1 no-scrollbar grid grid-cols-4 sm:grid-cols-5 gap-3">
          {filteredIcons.map((icon) => {
            const IconComponent = icon.component
            
            return (
              <button
                key={icon.id}
                onClick={() => onSelect(icon.id, icon.color)}
                className="flex flex-col items-center justify-center p-3 gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-accent-600 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all group"
                title={icon.name}
              >
                <IconComponent className="w-7 h-7" style={{ color: icon.color }} />
                <span className="text-[10px] font-medium text-neutral-500 truncate w-full text-center group-hover:text-neutral-900 dark:group-hover:text-white">
                  {icon.name}
                </span>
              </button>
            )
          })}
          {filteredIcons.length === 0 && (
            <div className="col-span-full text-center py-8 text-neutral-500">
              No icons found for "{search}"
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
