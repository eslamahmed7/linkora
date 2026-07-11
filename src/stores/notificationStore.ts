import { create } from 'zustand'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  duration?: number
}

export interface NotificationState {
  notifications: Notification[]
  add: (message: string, type: NotificationType, duration?: number) => string
  remove: (id: string) => void
  clear: () => void
}

export const useNotificationStore = create<NotificationState>((set) => {
  const generateId = () => Math.random().toString(36).substr(2, 9)

  return {
    notifications: [],

    add: (message, type, duration = 5000) => {
      const id = generateId()
      set((state) => ({
        notifications: [
          ...state.notifications,
          { id, message, type, duration },
        ],
      }))

      if (duration > 0) {
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }))
        }, duration)
      }

      return id
    },

    remove: (id) =>
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),

    clear: () => set({ notifications: [] }),
  }
})
