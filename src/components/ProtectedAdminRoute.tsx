import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AdminLayout } from '@/components/admin/AdminLayout'

const ADMIN_ROLES = ['super_admin', 'admin', 'editor', 'support', 'designer', 'viewer']

interface ProtectedAdminRouteProps {
  children: React.ReactNode
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  const role = user?.role
  if (!role || !ADMIN_ROLES.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <AdminLayout>{children}</AdminLayout>
}
