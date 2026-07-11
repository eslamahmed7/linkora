import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Palette, Layers, Lightbulb,
  Bug, Mail, Megaphone, Activity, Settings, Shield, Database,
  ChevronLeft, ChevronRight, Search, Bell, Menu, X, LogOut,
  BarChart3, Image, Sparkles,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { Logo } from '@/components/Logo'

interface AdminLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  group: string
  minRole?: string
}

const NAV_ITEMS: NavItem[] = [
  { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, group: 'Overview' },
  { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, group: 'Overview' },

  { path: '/admin/users', label: 'Users', icon: <Users className="w-4 h-4" />, group: 'Management' },
  { path: '/admin/templates', label: 'Design Marketplace', icon: <Palette className="w-4 h-4" />, group: 'Management' },
  { path: '/admin/community', label: 'Community', icon: <Layers className="w-4 h-4" />, group: 'Management' },
  { path: '/admin/assets', label: 'Asset Manager', icon: <Layers className="w-4 h-4" />, group: 'Management' },
  { path: '/admin/files', label: 'File Manager', icon: <Image className="w-4 h-4" />, group: 'Management' },

  { path: '/admin/suggestions', label: 'Suggestions', icon: <Lightbulb className="w-4 h-4" />, group: 'Feedback' },
  { path: '/admin/features', label: 'Feature Requests', icon: <Sparkles className="w-4 h-4" />, group: 'Feedback' },
  { path: '/admin/bugs', label: 'Bug Reports', icon: <Bug className="w-4 h-4" />, group: 'Feedback' },
  { path: '/admin/messages', label: 'Messages', icon: <Mail className="w-4 h-4" />, group: 'Feedback' },

  { path: '/admin/announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" />, group: 'Communication' },

  { path: '/admin/activity', label: 'Activity Logs', icon: <Activity className="w-4 h-4" />, group: 'System' },
  { path: '/admin/settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, group: 'System' },
  { path: '/admin/backups', label: 'Backups', icon: <Database className="w-4 h-4" />, group: 'System' },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = user?.role && ['super_admin', 'admin', 'editor', 'support', 'designer', 'viewer'].includes(user.role)

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Access Denied</h1>
          <p className="text-neutral-500">You don't have admin permissions.</p>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-accent-600 text-white rounded-xl">
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const groups = NAV_ITEMS.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {} as Record<string, NavItem[]>)

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[260px]'}`}>
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-neutral-200 dark:border-neutral-800 ${collapsed ? 'justify-center' : ''}`}>
          {!collapsed && <Logo />}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 ml-auto">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{group}</p>
              )}
              {items.map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-accent-50 dark:bg-accent-950/30 text-accent-600 dark:text-accent-400'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white'
                  } ${collapsed ? 'justify-center px-2' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => navigate('/dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <ChevronLeft className="w-4 h-4" />
            {!collapsed && <span>Back to App</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto">
            <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-200 dark:border-neutral-800">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="py-3 px-2 space-y-4">
              {Object.entries(groups).map(([group, items]) => (
                <div key={group}>
                  <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">{group}</p>
                  {items.map(item => (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setMobileOpen(false) }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive(item.path)
                          ? 'bg-accent-50 dark:bg-accent-950/30 text-accent-600 dark:text-accent-400'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl px-3 py-2 w-64">
              <Search className="w-4 h-4 text-neutral-400" />
              <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none flex-1 text-neutral-900 dark:text-white placeholder-neutral-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-100 dark:bg-accent-950/30 text-accent-600 dark:text-accent-400">
              <Shield className="w-3 h-3" />
              {user?.role?.replace('_', ' ')}
            </span>
            <button className="relative p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Bell className="w-5 h-5 text-neutral-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={logout} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
