import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { useNotification } from '@/hooks/useNotification'
import { pagesAPI } from '@/api/pages'
import { PageSettings } from '@/components/PageSettings'
import { LinkEditor } from '@/components/LinkEditor'
import { DesignEditor } from '@/components/DesignEditor'
import { PagePreview } from '@/components/PagePreview'
import {
  Save, Eye, EyeOff, ArrowLeft,
  Settings2, Link2, Palette, Monitor
} from 'lucide-react'

type SidebarTab = 'settings' | 'links' | 'design'

const SIDEBAR_TABS: { id: SidebarTab; label: string; icon: any; desc: string }[] = [
  { id: 'settings', label: 'Settings', icon: Settings2, desc: 'Page info & URL handle' },
  { id: 'links',    label: 'Links',    icon: Link2,     desc: 'Add & manage your links' },
  { id: 'design',   label: 'Design',   icon: Palette,   desc: 'Colors, fonts & layout' },
]

export function PageEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notification = useNotification()
  const { page, previewMode, togglePreview, setPage } = usePageBuilderStore()
  const [isLoading, setIsLoading] = useState(!!id)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<SidebarTab>('settings')

  useEffect(() => {
    if (id) {
      const fetchPage = async () => {
        try {
          const response = await pagesAPI.get(id)
          const pageState: typeof page = {
            id: response.page.id,
            settings: {
              slug: response.page.handle,
              title: response.page.title,
              description: response.page.description,
              bio: response.page.bio,
              visibility: response.page.isPublished ? 'public' : 'private',
              status: response.page.isPublished ? 'published' : 'draft',
            },
            design: {
              backgroundColor: response.page.backgroundColor || '#ffffff',
              profileImageUrl: response.page.profileImageUrl,
              profileImagePosition: response.page.profileImagePosition || 'top',
              linkStyle: 'rounded',
              linkBackgroundColor: '#0066ff',
              linkTextColor: '#ffffff',
              linkBorderWidth: 0,
              linkBorderRadius: 8,
              linkSpacing: 12,
              fontFamily: 'system-ui',
              headingSize: 28,
              textSize: 16,
              headingColor: '#000000',
              textColor: '#666666',
              profileBorderRadius: 50,
              profileImageSize: 'medium',
              showBio: true,
              animationEnabled: true,
              ...(response.page as any).design,
            },
            links: response.page.links || [],
          }
          setPage(pageState)
        } catch (error) {
          notification.error('Failed to load page')
          navigate('/pages')
        } finally {
          setIsLoading(false)
        }
      }
      fetchPage()
    }
  }, [id])

  const handleSave = async () => {
    if (!page.settings.title) {
      notification.error('Title is required')
      return
    }

    setIsSaving(true)
    try {
      if (id) {
        await pagesAPI.update(id, {
          ...page.settings,
          links: page.links,
          design: page.design,
        })
        notification.success('Page updated successfully')
      } else {
        const response = await pagesAPI.create({
          handle: page.settings.slug || '',
          title: page.settings.title,
          description: page.settings.description || '',
        })
        notification.success('Page created successfully')
        navigate(`/pages/${response.page.id}`)
      }
    } catch (error: any) {
      console.error('Failed to save page:', error)
      notification.error(error?.message || 'Failed to save page')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-accent-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-neutral-500">Loading page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-0 -mx-4 sm:-mx-6 lg:-mx-8">

      {/* ── Top Header Bar ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/pages')}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
              {id ? (page.settings.title || 'Edit Page') : 'New Page'}
            </h1>
            <p className="text-xs text-neutral-400">
              {id ? `linkora.app/p/${page.settings.slug || '...'}` : 'Design your link page'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            page.settings.status === 'published'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${page.settings.status === 'published' ? 'bg-green-500' : 'bg-neutral-400'}`} />
            {page.settings.status === 'published' ? 'Published' : 'Draft'}
          </span>

          <button
            onClick={togglePreview}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors"
          >
            {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{previewMode ? 'Edit' : 'Preview'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm shadow-accent-600/20"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {previewMode ? (
        // ── Full Preview Mode ──
        <div className="flex-1 overflow-hidden">
          <PagePreview />
        </div>
      ) : (
        // ── Edit Mode: sidebar + preview ──
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left vertical nav tabs ── */}
          <div className="flex-shrink-0 w-16 sm:w-52 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col py-3 gap-1">
            {SIDEBAR_TABS.map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-left transition-all group ${
                    active
                      ? 'bg-accent-600 text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:block">
                    <span className="block text-sm font-semibold leading-tight">{tab.label}</span>
                    <span className={`block text-[10px] mt-0.5 leading-tight ${active ? 'text-white/70' : 'text-neutral-400 dark:text-neutral-500'}`}>
                      {tab.desc}
                    </span>
                  </span>
                </button>
              )
            })}

            {/* Divider + Preview shortcut */}
            <div className="mx-4 border-t border-neutral-200 dark:border-neutral-800 my-2" />
            <button
              onClick={togglePreview}
              className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all"
            >
              <Monitor className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:block text-sm font-medium">Full Preview</span>
            </button>
          </div>

          {/* ── Panel content ── */}
          <div className="flex-shrink-0 w-80 sm:w-[28rem] lg:w-[32rem] bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'settings' && <PageSettings />}
              {activeTab === 'links'    && <LinkEditor />}
              {activeTab === 'design'   && <DesignEditor />}
            </div>
          </div>

          {/* ── Live preview ── */}
          <div className="flex-1 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <PagePreview />
          </div>
        </div>
      )}
    </div>
  )
}
