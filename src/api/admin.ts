import { apiClient } from './client'
import type {
  DashboardStats, DesignMarketplaceItem, CommunitySubmission,
  Suggestion, FeatureRequest, BugReport, ContactMessage,
  Announcement, ActivityLog, SiteSetting, Backup,
  SubmissionStatus, SuggestionStatus, BugStatus, BugPriority,
  DesignType, Asset, AssetCollection, AssetVersion, AssetUsage, AssetType, AssetModule,
} from '@/types/admin'

function qs(params?: Record<string, unknown>): string {
  if (!params) return ''
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  if (entries.length === 0) return ''
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
}

// ─── Dashboard ─────────────────────────────────────────────────────────

export const adminDashboard = {
  getStats: () => apiClient.get<DashboardStats>('/admin/dashboard/stats'),
  getAnalytics: (params?: { period?: string; days?: number }) =>
    apiClient.get(`/admin/dashboard/analytics${qs(params)}`),
}

// ─── Users ─────────────────────────────────────────────────────────────

export const adminUsers = {
  list: (params?: { search?: string; role?: string; status?: string; page?: number; limit?: number; sort?: string; order?: string }) =>
    apiClient.get<{ users: Array<{ id: string; display_name: string; email: string; username: string; avatar_url: string; role: string; is_suspended: boolean; created_at: string }>; total: number }>(`/admin/users${qs(params)}`),
  setRole: (id: string, role: string) => apiClient.put(`/admin/users/${id}/role`, { role }),
  suspend: (id: string, suspend: boolean, reason?: string) => apiClient.put(`/admin/users/${id}/suspend`, { suspend, reason }),
  delete: (id: string) => apiClient.delete(`/admin/users/${id}`),
}

// ─── Design Marketplace ────────────────────────────────────────────────

export const adminDesigns = {
  list: (params?: { search?: string; type?: DesignType; category?: string; status?: string; is_premium?: boolean; is_featured?: boolean; page?: number; limit?: number; sort?: string; order?: string }) =>
    apiClient.get<{ designs: DesignMarketplaceItem[]; total: number }>(`/admin/designs${qs(params)}`),
  get: (id: string) =>
    apiClient.get<{ design: DesignMarketplaceItem }>(`/admin/designs/${id}`),
  create: (data: Partial<DesignMarketplaceItem>) => apiClient.post<{ design: DesignMarketplaceItem }>('/admin/designs', data),
  update: (id: string, data: Partial<DesignMarketplaceItem>) => apiClient.put<{ design: DesignMarketplaceItem }>(`/admin/designs/${id}`, data),
  delete: (id: string) => apiClient.delete(`/admin/designs/${id}`),
  feature: (id: string, is_featured: boolean) => apiClient.put(`/admin/designs/${id}/feature`, { is_featured }),
}

// ─── Community Submissions ─────────────────────────────────────────────

export const adminSubmissions = {
  list: (params?: { search?: string; type?: DesignType; status?: SubmissionStatus; page?: number; limit?: number; sort?: string; order?: string }) =>
    apiClient.get<{ submissions: CommunitySubmission[]; total: number }>(`/admin/submissions${qs(params)}`),
  get: (id: string) =>
    apiClient.get<{ submission: CommunitySubmission }>(`/admin/submissions/${id}`),
  update: (id: string, data: Partial<Pick<CommunitySubmission, 'title' | 'description' | 'type' | 'category' | 'tags' | 'metadata' | 'status' | 'admin_notes'>>) =>
    apiClient.put<{ submission: CommunitySubmission }>(`/admin/submissions/${id}`, data),
  approve: (id: string, admin_reply?: string) => apiClient.put(`/admin/submissions/${id}/approve`, { admin_reply }),
  reject: (id: string, admin_reply?: string, reason?: string) => apiClient.put(`/admin/submissions/${id}/reject`, { admin_reply, reason }),
  requestChanges: (id: string, admin_notes: string) => apiClient.put(`/admin/submissions/${id}/changes`, { admin_notes }),
}

// ─── Suggestions ───────────────────────────────────────────────────────

export const adminSuggestions = {
  list: (params?: { status?: SuggestionStatus; category?: string; sort?: string; page?: number; limit?: number }) =>
    apiClient.get<{ suggestions: Suggestion[]; total: number }>(`/admin/suggestions${qs(params)}`),
  update: (id: string, data: { status?: SuggestionStatus; admin_notes?: string; admin_reply?: string }) =>
    apiClient.put(`/admin/suggestions/${id}`, data),
}

// ─── Bug Reports ───────────────────────────────────────────────────────

export const adminBugs = {
  list: (params?: { status?: BugStatus; priority?: BugPriority; page?: number; limit?: number }) =>
    apiClient.get<{ bugs: BugReport[]; total: number }>(`/admin/bugs${qs(params)}`),
  update: (id: string, data: Partial<BugReport>) => apiClient.put(`/admin/bugs/${id}`, data),
}

// ─── Contact Messages ──────────────────────────────────────────────────

export const adminMessages = {
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ messages: ContactMessage[]; total: number }>(`/admin/messages${qs(params)}`),
  update: (id: string, data: { status?: string; admin_reply?: string }) => apiClient.put(`/admin/messages/${id}`, data),
}

// ─── Announcements ─────────────────────────────────────────────────────

export const adminAnnouncements = {
  list: () => apiClient.get<{ announcements: Announcement[] }>('/admin/announcements'),
  create: (data: Partial<Announcement>) => apiClient.post<{ announcement: Announcement }>('/admin/announcements', data),
  update: (id: string, data: Partial<Announcement>) => apiClient.put(`/admin/announcements/${id}`, data),
  delete: (id: string) => apiClient.delete(`/admin/announcements/${id}`),
}

// ─── Feature Requests ──────────────────────────────────────────────────

export const adminFeatures = {
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ features: FeatureRequest[]; total: number }>(`/admin/features${qs(params)}`),
  update: (id: string, data: Partial<FeatureRequest>) => apiClient.put(`/admin/features/${id}`, data),
}

// ─── Reports ───────────────────────────────────────────────────────────

export const adminReports = {
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ reports: Array<{ id: string; reason: string; description: string; status: string; created_at: string; users: { display_name: string }; design_marketplace: { title: string } }>; total: number }>(`/admin/reports${qs(params)}`),
}

// ─── Activity Logs ─────────────────────────────────────────────────────

export const adminActivity = {
  list: (params?: { action?: string; entity_type?: string; user_id?: string; page?: number; limit?: number }) =>
    apiClient.get<{ logs: ActivityLog[]; total: number }>(`/admin/activity${qs(params)}`),
}

// ─── Site Settings ─────────────────────────────────────────────────────

export const adminSettings = {
  get: (category?: string) => apiClient.get<{ settings: SiteSetting[] }>(`/admin/settings${qs(category ? { category } : undefined)}`),
  update: (settings: Record<string, unknown>) => apiClient.put('/admin/settings', { settings }),
}

// ─── Backups ───────────────────────────────────────────────────────────

export const adminBackups = {
  list: () => apiClient.get<{ backups: Backup[] }>('/admin/backups'),
  create: (name?: string, type?: string) => apiClient.post<{ backup: Backup }>('/admin/backups', { name, type }),
}

// ─── Notifications ─────────────────────────────────────────────────────

export const adminNotifications = {
  listForUser: (userId: string) => apiClient.get(`/admin/notifications/${userId}`),
  send: (data: { user_id?: string; title: string; message: string; type?: string; category?: string; target?: string }) =>
    apiClient.post('/admin/notifications', data),
}

// ─── Global Asset Engine ───────────────────────────────────────────────

export const adminAssets = {
  list: (params?: {
    asset_type?: AssetType; category?: string; subcategory?: string; search?: string;
    tags?: string; module?: AssetModule; premium?: boolean; featured?: boolean;
    visibility?: string; pinned?: boolean; sort?: string; order?: string;
    page?: number; limit?: number;
  }) => apiClient.get<{ assets: Asset[]; total: number; page: number; limit: number }>(`/assets${qs(params)}`),

  get: (id: string) => apiClient.get<{ asset: Asset }>(`/assets/${id}`),

  create: (data: Partial<Asset>) => apiClient.post<{ asset: Asset }>('/assets', data),

  update: (id: string, data: Partial<Asset>) => apiClient.put<{ asset: Asset }>(`/assets/${id}`, data),

  delete: (id: string) => apiClient.delete(`/assets/${id}`),
  forceDelete: (id: string) => apiClient.delete(`/assets/${id}/force`),

  bulk: (ids: string[], action: string, value?: unknown) =>
    apiClient.post<{ updated?: number; deleted?: number }>('/assets/bulk', { ids, action, value }),

  versions: (id: string) => apiClient.get<{ versions: AssetVersion[] }>(`/assets/${id}/versions`),
  createVersion: (id: string, description?: string) =>
    apiClient.post<{ version: AssetVersion }>(`/assets/${id}/versions`, { description }),
  restoreVersion: (id: string, versionId: string) =>
    apiClient.post<{ restored: boolean }>(`/assets/${id}/versions/restore/${versionId}`, {}),

  usage: (id: string) => apiClient.get<{ usage: AssetUsage[]; total: number }>(`/assets/${id}/usage`),
  track: (assetId: string, entityType: string, entityId: string) =>
    apiClient.post('/assets/track', { asset_id: assetId, entity_type: entityType, entity_id: entityId }),

  stats: () => apiClient.get<{ total: number; byType: Record<string, number>; collections: number; topUsed: Array<{ name: string; usage_count: number; asset_type: string }> }>('/assets/stats/overview'),

  collections: {
    list: () => apiClient.get<{ collections: AssetCollection[] }>('/assets/collections/all'),
    create: (data: Partial<AssetCollection>) => apiClient.post<{ collection: AssetCollection }>('/assets/collections', data),
    update: (id: string, data: Partial<AssetCollection>) => apiClient.put<{ collection: AssetCollection }>(`/assets/collections/${id}`, data),
    delete: (id: string) => apiClient.delete(`/assets/collections/${id}`),
    addAssets: (id: string, assetIds: string[]) => apiClient.post<{ added: number }>(`/assets/collections/${id}/assets`, { asset_ids: assetIds }),
    removeAsset: (id: string, assetId: string) => apiClient.delete(`/assets/collections/${id}/assets/${assetId}`),
  },

  export: (collectionId: string) => apiClient.get<{ export: { collection: AssetCollection; assets: Asset[] } }>(`/assets/export/${collectionId}`),
  import: (data: { collection: Partial<AssetCollection>; assets: Partial<Asset>[] }) =>
    apiClient.post<{ imported: number }>('/assets/import', data),
}
