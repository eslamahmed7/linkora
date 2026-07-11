import { create } from 'zustand'
import {
  PageState,
  PageDesign,
  PageSettings,
  Link,
  DEFAULT_PAGE_DESIGN,
  DEFAULT_PAGE_SETTINGS,
} from '@/types/pageBuilder'

interface PageBuilderStore {
  page: PageState
  previewMode: boolean
  setPage: (page: PageState) => void
  updateSettings: (settings: Partial<PageSettings>) => void
  updateDesign: (design: Partial<PageDesign>) => void
  addLink: (link: Omit<Link, 'id' | 'order' | 'clicks' | 'createdAt'>) => void
  updateLink: (id: string, updates: Partial<Link>) => void
  deleteLink: (id: string) => void
  reorderLinks: (links: Link[]) => void
  togglePreview: () => void
  resetPage: () => void
}

export const usePageBuilderStore = create<PageBuilderStore>((set) => ({
  page: {
    settings: DEFAULT_PAGE_SETTINGS,
    design: DEFAULT_PAGE_DESIGN,
    links: [],
  },
  previewMode: false,

  setPage: (page) => set({ page }),

  updateSettings: (settings) =>
    set((state) => ({
      page: {
        ...state.page,
        settings: {
          ...state.page.settings,
          ...settings,
        },
      },
    })),

  updateDesign: (design) =>
    set((state) => ({
      page: {
        ...state.page,
        design: {
          ...state.page.design,
          ...design,
        },
      },
    })),

  addLink: (link) =>
    set((state) => ({
      page: {
        ...state.page,
        links: [
          ...state.page.links,
          {
            id: Math.random().toString(36).substr(2, 9),
            order: state.page.links.length,
            clicks: 0,
            createdAt: new Date().toISOString(),
            ...link,
          },
        ],
      },
    })),

  updateLink: (id, updates) =>
    set((state) => ({
      page: {
        ...state.page,
        links: state.page.links.map((link) =>
          link.id === id ? { ...link, ...updates } : link
        ),
      },
    })),

  deleteLink: (id) =>
    set((state) => ({
      page: {
        ...state.page,
        links: state.page.links.filter((link) => link.id !== id),
      },
    })),

  reorderLinks: (links) =>
    set((state) => ({
      page: {
        ...state.page,
        links: links.map((link, index) => ({ ...link, order: index })),
      },
    })),

  togglePreview: () => set((state) => ({ previewMode: !state.previewMode })),

  resetPage: () =>
    set({
      page: {
        settings: DEFAULT_PAGE_SETTINGS,
        design: DEFAULT_PAGE_DESIGN,
        links: [],
      },
      previewMode: false,
    }),
}))
