import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import {
  Menu,
  X,
  Home,
  FileText,
  QrCode,
  Zap,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
  Globe,
  Shield,
  Sparkles,
} from 'lucide-react'
import { Logo } from './Logo'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme, language, setLanguage } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/pages', label: 'My Pages', icon: FileText },
    { path: '/qr', label: 'QR Codes', icon: QrCode },
    { path: '/nfc', label: 'NFC Cards', icon: Zap },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/community/submit', label: 'Submit Template', icon: Sparkles },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  if (user?.role && ['super_admin', 'admin', 'editor', 'support', 'designer', 'viewer'].includes(user.role)) {
    menuItems.push({ path: '/admin', label: 'Admin Panel', icon: Shield })
  }

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 shadow-md transition-all active:scale-95"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 w-64 h-screen bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between z-40 transition-transform lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section: Logo & Nav */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
            <Link to="/" className="flex items-center" onClick={() => setIsSidebarOpen(false)}>
              <Logo />
            </Link>
            {/* Close button inside sidebar on mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${
                  isActive(item.path)
                    ? 'bg-accent-600 text-white font-semibold shadow-md shadow-accent-600/10'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Profile & Actions */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-4">
          {/* User Profile Card */}
          <Link
            to="/profile"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-9 h-9 rounded-full object-cover border border-neutral-200 dark:border-neutral-800"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-neutral-800 dark:text-white truncate">{user?.displayName}</p>
              <p className="text-[10px] text-neutral-500 truncate">@{user?.username}</p>
            </div>
          </Link>

          {/* Quick Actions Row */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex-1 flex justify-center p-2.5 rounded-xl border border-neutral-205 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 transition-all active:scale-95"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex-1 flex justify-center p-2.5 rounded-xl border border-neutral-205 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 transition-all active:scale-95"
              title="Change language"
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex-1 flex justify-center p-2.5 rounded-xl border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-all active:scale-95"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative lg:p-4">
        {/* Top spacer for mobile floating button */}
        <div className="h-16 lg:hidden" />
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
