import { useNotificationStore } from '@/stores/notificationStore'
import { Check, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

export function NotificationContainer() {
  const notifications = useNotificationStore((state) => state.notifications)
  const remove = useNotificationStore((state) => state.remove)

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return null
    }
  }

  const getBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900'
      case 'error':
        return 'bg-red-50 dark:bg-red-900'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900'
      default:
        return 'bg-neutral-50 dark:bg-neutral-900'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBg(notification.type)} border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 flex items-start gap-3 shadow-lg pointer-events-auto animate-in fade-in slide-in-from-top-2`}
        >
          <div className="flex-shrink-0">{getIcon(notification.type)}</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => remove(notification.id)}
            className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
