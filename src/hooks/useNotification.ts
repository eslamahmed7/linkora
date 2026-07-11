import { useNotificationStore } from '@/stores/notificationStore'

export function useNotification() {
  const { add, remove, clear } = useNotificationStore()

  const success = (message: string, duration?: number) => {
    return add(message, 'success', duration)
  }

  const error = (message: string, duration?: number) => {
    return add(message, 'error', duration || 7000)
  }

  const warning = (message: string, duration?: number) => {
    return add(message, 'warning', duration)
  }

  const info = (message: string, duration?: number) => {
    return add(message, 'info', duration)
  }

  return {
    success,
    error,
    warning,
    info,
    remove,
    clear,
  }
}
