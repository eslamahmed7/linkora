import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute'
import { NotificationContainer } from './components/Notification'
import { Layout } from './components/Layout'

// Auth Pages
import { LoginPage } from './pages/auth/Login'
import { RegisterPage } from './pages/auth/Register'
import { ForgotPasswordPage } from './pages/auth/ForgotPassword'

// App Pages (core - eagerly loaded)
import { DashboardPage } from './pages/Dashboard'
import { MyPagesPage } from './pages/MyPages'
import { PageEditorPage } from './pages/PageEditor'
import { ProfilePage } from './pages/Profile'
import { SettingsPage } from './pages/Settings'
import { QRCodesListPage } from './pages/QRCodesList'
import { QRCodeEditorPage } from './pages/QRCodeEditor'
import { NFCPage } from './pages/NFCPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { PublicPageView } from './pages/PublicPage'
import { CommunitySubmitPage } from './pages/CommunitySubmit'

// Admin Pages (lazy loaded)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsersPage })))
const AdminTemplatesPage = lazy(() => import('./pages/admin/AdminTemplates').then(m => ({ default: m.AdminTemplatesPage })))
const AdminCommunityPage = lazy(() => import('./pages/admin/AdminCommunity').then(m => ({ default: m.AdminCommunityPage })))
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalyticsPage })))
const AdminSuggestionsPage = lazy(() => import('./pages/admin/AdminSuggestions').then(m => ({ default: m.AdminSuggestionsPage })))
const AdminFeaturesPage = lazy(() => import('./pages/admin/AdminFeatures').then(m => ({ default: m.AdminFeaturesPage })))
const AdminBugsPage = lazy(() => import('./pages/admin/AdminBugs').then(m => ({ default: m.AdminBugsPage })))
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessages').then(m => ({ default: m.AdminMessagesPage })))
const AdminAnnouncementsPage = lazy(() => import('./pages/admin/AdminAnnouncements').then(m => ({ default: m.AdminAnnouncementsPage })))
const AdminActivityPage = lazy(() => import('./pages/admin/AdminActivity').then(m => ({ default: m.AdminActivityPage })))
const AdminSiteSettingsPage = lazy(() => import('./pages/admin/AdminSiteSettings').then(m => ({ default: m.AdminSiteSettingsPage })))
const AdminBackupsPage = lazy(() => import('./pages/admin/AdminBackups').then(m => ({ default: m.AdminBackupsPage })))
const AdminAssetManagerPage = lazy(() => import('./pages/admin/AdminAssetManager').then(m => ({ default: m.AdminAssetManagerPage })))
const AdminFileManagerPage = lazy(() => import('./pages/admin/AdminFileManager').then(m => ({ default: m.AdminFileManagerPage })))
const AdminTemplateEditorLazy = lazy(() => import('./pages/admin/AdminTemplateEditor').then(m => ({ default: m.AdminTemplateEditor })))

import './styles/globals.css'

import { Loader2 } from 'lucide-react'

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-accent-500 animate-spin" />
      </div>
    }>
      {children}
    </Suspense>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages"
        element={
          <ProtectedRoute>
            <Layout>
              <MyPagesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/new"
        element={
          <ProtectedRoute>
            <Layout>
              <PageEditorPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <PageEditorPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/qr"
        element={
          <ProtectedRoute>
            <Layout>
              <QRCodesListPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/qr/new"
        element={
          <ProtectedRoute>
            <Layout>
              <QRCodeEditorPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/qr/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <QRCodeEditorPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nfc"
        element={
          <ProtectedRoute>
            <Layout>
              <NFCPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <AnalyticsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Community Routes */}
      <Route path="/community/submit" element={<ProtectedRoute><Layout><CommunitySubmitPage /></Layout></ProtectedRoute>} />
      <Route path="/community/submit/:id" element={<ProtectedRoute><Layout><CommunitySubmitPage /></Layout></ProtectedRoute>} />

      {/* Admin Routes (lazy loaded) */}
      <Route path="/admin" element={<ProtectedAdminRoute><SuspenseWrapper><AdminDashboard /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/users" element={<ProtectedAdminRoute><SuspenseWrapper><AdminUsersPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/templates" element={<ProtectedAdminRoute><SuspenseWrapper><AdminTemplatesPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/templates/new" element={<ProtectedAdminRoute><SuspenseWrapper><AdminTemplateEditorLazy /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/templates/:id/edit" element={<ProtectedAdminRoute><SuspenseWrapper><AdminTemplateEditorLazy /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/community" element={<ProtectedAdminRoute><SuspenseWrapper><AdminCommunityPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/community/:id/edit" element={<ProtectedAdminRoute><SuspenseWrapper><AdminTemplateEditorLazy mode="community" /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/analytics" element={<ProtectedAdminRoute><SuspenseWrapper><AdminAnalyticsPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/suggestions" element={<ProtectedAdminRoute><SuspenseWrapper><AdminSuggestionsPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/features" element={<ProtectedAdminRoute><SuspenseWrapper><AdminFeaturesPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/bugs" element={<ProtectedAdminRoute><SuspenseWrapper><AdminBugsPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/messages" element={<ProtectedAdminRoute><SuspenseWrapper><AdminMessagesPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/announcements" element={<ProtectedAdminRoute><SuspenseWrapper><AdminAnnouncementsPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/activity" element={<ProtectedAdminRoute><SuspenseWrapper><AdminActivityPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/settings" element={<ProtectedAdminRoute><SuspenseWrapper><AdminSiteSettingsPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/backups" element={<ProtectedAdminRoute><SuspenseWrapper><AdminBackupsPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/assets" element={<ProtectedAdminRoute><SuspenseWrapper><AdminAssetManagerPage /></SuspenseWrapper></ProtectedAdminRoute>} />
      <Route path="/admin/files" element={<ProtectedAdminRoute><SuspenseWrapper><AdminFileManagerPage /></SuspenseWrapper></ProtectedAdminRoute>} />

      {/* Public Page Route - must be before the wildcard */}
      <Route path="/p/:handle" element={<PublicPageView />} />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppRoutes />
        <NotificationContainer />
      </Router>
    </ThemeProvider>
  )
}
