import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { nfcAPI } from '@/api/nfc'
import { useNotification } from '@/hooks/useNotification'
import { Plus, Trash2, Power } from 'lucide-react'
import type { NFCCard } from '@/types/nfc'

interface NFCManagerProps {
  pageId: string
}

export function NFCManager({ pageId }: NFCManagerProps) {
  const { t } = useTranslation()
  const [cards, setCards] = useState<NFCCard[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '' })
  const notification = useNotification()

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      setIsLoading(true)
      const response = await nfcAPI.list()
      setCards(response.cards)
    } catch (error) {
      notification.error(t('components.nfcManager.toasts.loadFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      if (!formData.title.trim()) {
        notification.error(t('components.nfcManager.toasts.titleRequired'))
        return
      }

      const newCard = await nfcAPI.create({
        ...formData,
        pageId,
        isActive: true,
      })

      if (!newCard || !newCard.card) {
        throw new Error('Failed to create card, invalid response');
      }

      setCards([...cards, newCard.card])
      setFormData({ title: '', description: '' })
      setShowCreateForm(false)
      notification.success(t('components.nfcManager.toasts.created'))
    } catch (error) {
      notification.error(t('components.nfcManager.toasts.createFailed'))
    }
  }

  const handleToggle = async (id: string) => {
    try {
      const updated = await nfcAPI.toggleActive(id)
      setCards(cards.map((c) => (c.id === id ? updated.card : c)))
      notification.success(t('components.nfcManager.toasts.updated'))
    } catch (error) {
      notification.error(t('components.nfcManager.toasts.updateFailed'))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await nfcAPI.delete(id)
      setCards(cards.filter((c) => c.id !== id))
      notification.success(t('components.nfcManager.toasts.deleted'))
    } catch (error) {
      notification.error(t('components.nfcManager.toasts.deleteFailed'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('components.nfcManager.title')}</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('components.nfcManager.newCard')}
        </button>
      </div>

      {showCreateForm && (
        <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-4">
          <input
            type="text"
            placeholder={t('components.nfcManager.cardTitlePlaceholder')}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400"
          />
          <textarea
            placeholder={t('components.nfcManager.cardDescPlaceholder')}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 resize-none h-24"
          />
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white transition-colors"
            >
              {t('components.nfcManager.createCard')}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-neutral-500">{t('components.nfcManager.loading')}</div>
      ) : cards.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          {t('components.nfcManager.empty')}
        </div>
      ) : (
        <div className="grid gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
            >
              <div className="flex-1">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-50">
                  {card.title}
                </h4>
                {card.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {card.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggle(card.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    card.isActive
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Power className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
