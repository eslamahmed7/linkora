import { useState, useEffect } from 'react'
import {
  Search, MoreHorizontal, Ban, Trash2,
  ChevronLeft, ChevronRight, UserCheck, UserX,
} from 'lucide-react'
import { adminUsers } from '@/api/admin'
import { ROLE_LABELS, ROLE_COLORS, type AdminRole } from '@/types/admin'

interface AdminUser {
  id: string; display_name: string; email: string; username: string
  avatar_url: string; role: string; is_suspended: boolean; created_at: string
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const limit = 20

  useEffect(() => { loadUsers() }, [page, roleFilter, statusFilter])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const res = await adminUsers.list({ search, role: roleFilter, status: statusFilter, page, limit })
      if (res.data) { setUsers(res.data.users); setTotal(res.data.total) }
    } catch {} finally { setIsLoading(false) }
  }

  const handleSearch = () => { setPage(1); loadUsers() }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminUsers.setRole(userId, newRole)
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      setOpenMenu(null)
    } catch {}
  }

  const handleSuspend = async (userId: string, suspend: boolean) => {
    try {
      await adminUsers.suspend(userId, suspend)
      setUsers(users.map(u => u.id === userId ? { ...u, is_suspended: suspend } : u))
      setOpenMenu(null)
    } catch {}
  }

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    try {
      await adminUsers.delete(userId)
      setUsers(users.filter(u => u.id !== userId))
      setTotal(total - 1)
      setOpenMenu(null)
    } catch {}
  }

  const totalPages = Math.ceil(total / limit)
  const roles: AdminRole[] = ['super_admin', 'admin', 'editor', 'support', 'designer', 'viewer', 'user']

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">User Management</h1>
        <p className="text-sm text-neutral-500 mt-0.5">{total} total users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text" placeholder="Search users..."
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
          />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1) }}
          className="px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600">
          <option value="">All Roles</option>
          {roles.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">User</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden md:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">Role</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden sm:table-cell">Status</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">Joined</th>
                <th className="text-right px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" /></td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-neutral-400">No users found</td></tr>
              ) : users.map(user => (
                <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-600 dark:text-neutral-300 overflow-hidden shrink-0">
                        {user.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : user.display_name?.[0] || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{user.display_name || 'No Name'}</p>
                        <p className="text-[10px] text-neutral-400">@{user.username || 'unknown'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-[200px]">{user.email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${ROLE_COLORS[user.role as AdminRole] || ROLE_COLORS.user}`}>
                      {ROLE_LABELS[user.role as AdminRole] || user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    {user.is_suspended ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400">
                        <Ban className="w-2.5 h-2.5" /> Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                        <UserCheck className="w-2.5 h-2.5" /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <p className="text-xs text-neutral-500">{new Date(user.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="relative inline-block">
                      <button onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenu === user.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 z-20 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl py-1.5">
                            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">Change Role</div>
                            {roles.map(r => (
                              <button key={r} onClick={() => handleRoleChange(user.id, r)}
                                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${user.role === r ? 'text-accent-600 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                {ROLE_LABELS[r]}
                              </button>
                            ))}
                            <div className="border-t border-neutral-100 dark:border-neutral-800 my-1.5" />
                            <button onClick={() => handleSuspend(user.id, !user.is_suspended)}
                              className="w-full text-left px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                              {user.is_suspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                              {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                            </button>
                            <button onClick={() => handleDelete(user.id)}
                              className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 flex items-center gap-2">
                              <Trash2 className="w-3.5 h-3.5" /> Delete User
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-xs text-neutral-500">Page {page} of {totalPages}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
