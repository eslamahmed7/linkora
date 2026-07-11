import { useState, useEffect } from 'react'
import {
  Mail, ChevronLeft, ChevronRight, X, Send,
  Calendar, CircleDot, Archive, CheckCircle2,
} from 'lucide-react'
import { adminMessages } from '@/api/admin'
import type { ContactMessage } from '@/types/admin'

type MessageStatus = 'unread' | 'read' | 'replied' | 'archived'

const STATUS_OPTIONS: MessageStatus[] = ['unread', 'read', 'replied', 'archived']

const STATUS_STYLES: Record<MessageStatus, string> = {
  unread: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  read: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  replied: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  archived: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500',
}

const STATUS_ICONS: Record<MessageStatus, typeof Mail> = {
  unread: CircleDot,
  read: Mail,
  replied: CheckCircle2,
  archived: Archive,
}

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<MessageStatus | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [editStatus, setEditStatus] = useState<MessageStatus>('unread')
  const [replyText, setReplyText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const limit = 20

  useEffect(() => { loadMessages() }, [page, statusFilter])

  const loadMessages = async () => {
    try {
      setIsLoading(true)
      const res = await adminMessages.list({
        status: statusFilter || undefined,
        page,
        limit,
      })
      if (res.data) { setMessages(res.data.messages); setTotal(res.data.total) }
    } catch {} finally { setIsLoading(false) }
  }

  const openDetail = async (message: ContactMessage) => {
    setSelected(message)
    setEditStatus(message.status === 'unread' ? 'read' : message.status as MessageStatus)
    setReplyText(message.admin_reply || '')

    if (message.status === 'unread') {
      try {
        await adminMessages.update(message.id, { status: 'read' })
        setMessages(messages.map(m =>
          m.id === message.id ? { ...m, status: 'read' as const } : m
        ))
        setSelected({ ...message, status: 'read' })
      } catch {}
    }
  }

  const handleSave = async () => {
    if (!selected) return
    try {
      setIsSaving(true)
      await adminMessages.update(selected.id, {
        status: editStatus,
        admin_reply: replyText || undefined,
      })
      setMessages(messages.map(m =>
        m.id === selected.id ? { ...m, status: editStatus as MessageStatus, admin_reply: replyText || undefined } : m
      ))
      setSelected(null)
    } catch {} finally { setIsSaving(false) }
  }

  const totalPages = Math.ceil(total / limit)

  const unreadCount = messages.filter(m => m.status === 'unread').length

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Messages</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          {total} total messages{unreadCount > 0 && <span className="ml-1 text-blue-500 font-medium">({unreadCount} unread)</span>}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => { setStatusFilter(''); setPage(1) }}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
            statusFilter === ''
              ? 'bg-accent-600 text-white'
              : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map(s => {
          const Icon = STATUS_ICONS[s]
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-accent-600 text-white'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Icon className="w-3 h-3" />
                {s}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className={`bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex-1 ${selected ? 'hidden lg:block' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">From</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">Subject</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">Message</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" /></td></tr>
                  ))
                ) : messages.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-neutral-400">No messages found</td></tr>
                ) : messages.map(msg => (
                  <tr
                    key={msg.id}
                    onClick={() => openDetail(msg)}
                    className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${selected?.id === msg.id ? 'bg-accent-50 dark:bg-accent-950/10' : ''} ${msg.status === 'unread' ? 'bg-blue-50/50 dark:bg-blue-950/5' : ''}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-300 shrink-0">
                          {msg.name?.[0] || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm truncate ${msg.status === 'unread' ? 'font-bold text-neutral-900 dark:text-white' : 'font-medium text-neutral-700 dark:text-neutral-300'}`}>
                            {msg.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <p className="text-sm text-neutral-500 truncate max-w-[180px]">{msg.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className={`text-sm truncate max-w-[180px] ${msg.status === 'unread' ? 'font-semibold text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
                        {msg.subject || '(no subject)'}
                      </p>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <p className="text-xs text-neutral-400 truncate max-w-[200px]">{msg.message}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[msg.status as MessageStatus]}`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <p className="text-xs text-neutral-500">{new Date(msg.created_at).toLocaleDateString()}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

        {/* Detail Panel */}
        {selected && (
          <div className="w-full lg:w-[440px] shrink-0 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="font-bold text-neutral-900 dark:text-white text-sm">Message</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Sender Info */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-600 dark:text-neutral-300 shrink-0">
                  {selected.name?.[0] || '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-neutral-900 dark:text-white">{selected.name}</p>
                  <p className="text-xs text-neutral-500">{selected.email}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Subject */}
              {selected.subject && (
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Subject</label>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">{selected.subject}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Message</label>
                <div className="mt-1 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as MessageStatus)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-600"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Reply */}
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Admin Reply</label>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={5}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-600 resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save & Reply'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
