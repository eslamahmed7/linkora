import { create } from 'zustand'
import type { Asset, AssetCollection, AssetType, AssetModule } from '@/types/admin'

export interface AssetFilters {
  asset_type?: AssetType
  category?: string
  subcategory?: string
  search?: string
  tags?: string[]
  module?: AssetModule
  premium?: boolean
  featured?: boolean
  visibility?: string
  pinned?: boolean
  sort?: string
  order?: 'asc' | 'desc'
}

export interface AssetState {
  assets: Asset[]
  total: number
  collections: AssetCollection[]
  stats: { total: number; byType: Record<string, number>; collections: number; topUsed: Array<{ name: string; usage_count: number; asset_type: string }> } | null
  isLoading: boolean
  isSaving: boolean
  filters: AssetFilters
  page: number
  limit: number

  setAssets: (assets: Asset[], total: number) => void
  setCollections: (collections: AssetCollection[]) => void
  setStats: (stats: AssetState['stats']) => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setFilters: (filters: Partial<AssetFilters>) => void
  setPage: (page: number) => void
  resetFilters: () => void

  addAsset: (asset: Asset) => void
  updateAsset: (id: string, updates: Partial<Asset>) => void
  removeAsset: (id: string) => void
  upsertCollection: (collection: AssetCollection) => void
  removeCollection: (id: string) => void
}

const DEFAULT_FILTERS: AssetFilters = {
  sort: 'created_at',
  order: 'desc',
}

export const useAssetStore = create<AssetState>()((set) => ({
  assets: [],
  total: 0,
  collections: [],
  stats: null,
  isLoading: false,
  isSaving: false,
  filters: { ...DEFAULT_FILTERS },
  page: 1,
  limit: 50,

  setAssets: (assets, total) => set({ assets, total }),
  setCollections: (collections) => set({ collections }),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
  setSaving: (isSaving) => set({ isSaving }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters }, page: 1 })),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS }, page: 1 }),

  addAsset: (asset) => set((s) => ({ assets: [asset, ...s.assets], total: s.total + 1 })),
  updateAsset: (id, updates) => set((s) => ({
    assets: s.assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
  })),
  removeAsset: (id) => set((s) => ({ assets: s.assets.filter((a) => a.id !== id), total: s.total - 1 })),

  upsertCollection: (collection) => set((s) => ({
    collections: s.collections.some((c) => c.id === collection.id)
      ? s.collections.map((c) => (c.id === collection.id ? collection : c))
      : [...s.collections, collection],
  })),
  removeCollection: (id) => set((s) => ({ collections: s.collections.filter((c) => c.id !== id) })),
}))
