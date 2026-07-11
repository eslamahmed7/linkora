import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotification } from '@/hooks/useNotification'
import { authAPI } from '@/api/auth'
import { Mail, ArrowLeft } from 'lucide-react'

export function ForgotPasswordPage() {
  const notification = useNotification()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await authAPI.requestPasswordReset(email)
      setIsSubmitted(true)
      notification.success('Password reset link sent to your email')
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Failed to send reset link. Please try again.'
      setError(message)
      notification.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-800">
          <Link
            to="/auth/login"
            className="flex items-center gap-2 text-accent-600 dark:text-accent-400 hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">
              Reset Password
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Enter your email address and we&apos;ll send you a link to reset
              your password
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent-600"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-2 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 text-center">
              <p className="text-green-800 dark:text-green-200">
                Check your email for a password reset link. It may take a few
                minutes to arrive.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
