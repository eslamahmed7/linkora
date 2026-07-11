// ─── Admin Roles ───────────────────────────────────────────────────────

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'support' | 'designer' | 'viewer' | 'user'

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  support: 'Support',
  designer: 'Designer',
  viewer: 'Viewer',
  user: 'User',
}

export const ROLE_COLORS: Record<AdminRole, string> = {
  super_admin: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  admin: 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
  editor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  support: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  designer: 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
  viewer: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
  user: 'bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-500',
}

// ─── Design Marketplace ────────────────────────────────────────────────

export type DesignType =
  | 'link_page_template' | 'qr_template' | 'nfc_template'
  | 'background' | 'qr_frame' | 'qr_style' | 'icon' | 'pattern'
  | 'texture' | 'animation' | 'font' | 'color_pack' | 'gradient_pack'
  | 'glass_pack' | 'svg_pack' | 'sticker_pack' | 'shape_pack'

export const DESIGN_TYPE_LABELS: Record<DesignType, string> = {
  link_page_template: 'Link Page Template',
  qr_template: 'QR Template',
  nfc_template: 'NFC Template',
  background: 'Background',
  qr_frame: 'QR Frame',
  qr_style: 'QR Style',
  icon: 'Icon',
  pattern: 'Pattern',
  texture: 'Texture',
  animation: 'Animation',
  font: 'Font',
  color_pack: 'Color Pack',
  gradient_pack: 'Gradient Pack',
  glass_pack: 'Glass Pack',
  svg_pack: 'SVG Pack',
  sticker_pack: 'Sticker Pack',
  shape_pack: 'Shape Pack',
}

export interface DesignMarketplaceItem {
  id: string
  title: string
  slug: string
  description?: string
  type: DesignType
  category: string
  tags: string[]
  thumbnail_url?: string
  preview_url?: string
  file_url?: string
  file_size: number
  file_type?: string
  author_id?: string
  author?: { display_name: string; avatar_url: string }
  version: string
  is_premium: boolean
  is_featured: boolean
  is_published: boolean
  status: 'draft' | 'published' | 'archived'
  download_count: number
  usage_count: number
  view_count: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

// ─── Community Submissions ─────────────────────────────────────────────

export type SubmissionStatus = 'draft' | 'submitted' | 'pending_review' | 'needs_changes' | 'approved' | 'rejected' | 'published' | 'archived'

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  pending_review: 'Pending Review',
  needs_changes: 'Needs Changes',
  approved: 'Approved',
  rejected: 'Rejected',
  published: 'Published',
  archived: 'Archived',
}

export const SUBMISSION_STATUS_COLORS: Record<SubmissionStatus, string> = {
  draft: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  pending_review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  needs_changes: 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
  archived: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500',
}

export interface CommunitySubmission {
  id: string
  user_id: string
  user?: { display_name: string; avatar_url: string; username: string }
  title: string
  slug: string
  description?: string
  type: DesignType
  category: string
  tags: string[]
  thumbnail_url?: string
  preview_urls: string[]
  file_url?: string
  file_size: number
  file_type?: string
  metadata?: Record<string, unknown>
  version: string
  license: string
  notes?: string
  status: SubmissionStatus
  admin_notes?: string
  admin_reply?: string
  reviewer_id?: string
  reviewed_at?: string
  published_at?: string
  marketplace_id?: string
  download_count: number
  rating_avg: number
  rating_count: number
  created_at: string
  updated_at: string
}

// ─── Suggestions ───────────────────────────────────────────────────────

export type SuggestionStatus = 'new' | 'in_review' | 'accepted' | 'rejected' | 'completed'

export interface Suggestion {
  id: string
  user_id: string
  user?: { display_name: string; avatar_url: string }
  title: string
  description?: string
  category: string
  priority: string
  status: SuggestionStatus
  admin_notes?: string
  admin_reply?: string
  vote_count: number
  created_at: string
  updated_at: string
}

// ─── Feature Requests ──────────────────────────────────────────────────

export type FeatureStatus = 'open' | 'accepted' | 'rejected' | 'merged' | 'scheduled' | 'in_progress' | 'completed'

export interface FeatureRequest {
  id: string
  user_id: string
  user?: { display_name: string; avatar_url: string }
  title: string
  description?: string
  category: string
  status: FeatureStatus
  admin_notes?: string
  vote_count: number
  scheduled_date?: string
  created_at: string
  updated_at: string
}

// ─── Bug Reports ───────────────────────────────────────────────────────

export type BugStatus = 'new' | 'in_progress' | 'fixed' | 'wont_fix' | 'duplicate'
export type BugPriority = 'low' | 'medium' | 'high' | 'critical'

export interface BugReport {
  id: string
  user_id: string
  user?: { display_name: string; avatar_url: string; email: string }
  title: string
  description?: string
  screenshot_url?: string
  browser?: string
  device?: string
  os?: string
  console_logs?: string
  url?: string
  priority: BugPriority
  status: BugStatus
  admin_notes?: string
  fix_version?: string
  created_at: string
  updated_at: string
}

// ─── Contact Messages ──────────────────────────────────────────────────

export interface ContactMessage {
  id: string
  user_id?: string
  name: string
  email: string
  subject?: string
  message: string
  status: 'unread' | 'read' | 'replied' | 'archived'
  admin_reply?: string
  replied_at?: string
  created_at: string
}

// ─── Announcements ─────────────────────────────────────────────────────

export interface Announcement {
  id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'maintenance'
  target: 'all' | 'premium' | 'specific'
  target_user_ids: string[]
  channel: 'in_app' | 'email' | 'banner' | 'all'
  is_active: boolean
  starts_at: string
  expires_at?: string
  created_by?: string
  created_at: string
}

// ─── Activity Logs ─────────────────────────────────────────────────────

export interface ActivityLog {
  id: string
  user_id?: string
  user?: { display_name: string; avatar_url: string }
  action: string
  entity_type?: string
  entity_id?: string
  details?: Record<string, unknown>
  ip_address?: string
  created_at: string
}

// ─── Site Settings ─────────────────────────────────────────────────────

export interface SiteSetting {
  id: string
  key: string
  value: unknown
  category: string
  description?: string
  updated_at: string
}

// ─── Dashboard Stats ───────────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  premiumUsers: number
  totalPages: number
  totalQRCodes: number
  totalNFCCards: number
  totalDesigns: number
  totalSubmissions: number
  totalSuggestions: number
  totalBugReports: number
  totalViews: number
  totalScans: number
  dailyRegistrations: number
  weeklyRegistrations: number
  recentActivity: ActivityLog[]
  recentSubmissions: CommunitySubmission[]
  recentSuggestions: Suggestion[]
  designsByType: Record<string, number>
  submissionsByStatus: Record<string, number>
  bugsByPriority: Record<string, number>
}

// ─── Backups ───────────────────────────────────────────────────────────

export interface Backup {
  id: string
  name: string
  type: string
  file_url?: string
  file_size: number
  status: string
  created_at: string
}

// ─── Global Asset Engine ───────────────────────────────────────────────

export type AssetType =
  | 'pattern' | 'texture' | 'icon' | 'qr_frame' | 'qr_preset'
  | 'gradient' | 'material' | 'border' | 'shadow' | 'typography'
  | 'animation' | 'color' | 'sticker' | 'shape' | 'component'
  | 'theme' | 'font' | 'background'

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  pattern: 'Pattern', texture: 'Texture', icon: 'Icon', qr_frame: 'QR Frame',
  qr_preset: 'QR Preset', gradient: 'Gradient', material: 'Material', border: 'Border',
  shadow: 'Shadow', typography: 'Typography', animation: 'Animation', color: 'Color',
  sticker: 'Sticker', shape: 'Shape', component: 'Component', theme: 'Theme',
  font: 'Font', background: 'Background',
}

export const ASSET_MODULE_OPTIONS = [
  'link_pages', 'qr_designer', 'nfc_cards', 'business_cards',
  'restaurant_menus', 'events', 'cv_builder', 'bio_links', 'admin',
] as const

export type AssetModule = typeof ASSET_MODULE_OPTIONS[number]

export interface Asset {
  id: string
  name: string
  slug: string
  description?: string
  asset_type: AssetType
  subcategory: string
  category: string
  data: Record<string, unknown>
  preview_url?: string
  thumbnail_url?: string
  preview_html?: string
  tags: string[]
  version: string
  file_type?: string
  file_size: number
  is_premium: boolean
  is_featured: boolean
  is_active: boolean
  is_pinned: boolean
  visibility: 'public' | 'private' | 'unlisted'
  supported_modules: AssetModule[]
  usage_count: number
  download_count: number
  view_count: number
  favorite_count: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface AssetCollection {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color: string
  is_premium: boolean
  is_active: boolean
  sort_order: number
  created_by?: string
  created_at: string
  updated_at: string
  asset_count?: number
}

export interface AssetVersion {
  id: string
  asset_id: string
  version_number: number
  data: Record<string, unknown>
  name?: string
  description?: string
  created_by?: string
  created_at: string
}

export interface AssetUsage {
  id: string
  asset_id: string
  entity_type: string
  entity_id: string
  used_at: string
}
