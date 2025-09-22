'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function NameGenerator({ 
  defaultUsername = ''
}: { 
  defaultUsername?: string
}) {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const tCommon = useTranslations('common')
  const tChecker = useTranslations('checker')
  const tGenerator = useTranslations('generator')
  const tErrors = useTranslations('errors')
  // Initialize state with correct priority: URL params > localStorage > empty
  const [username, setUsername] = useState(() => {
    return defaultUsername || (typeof window !== 'undefined' ? localStorage.getItem('riotUsername') : null) || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update state when URL parameters change
  useEffect(() => {
    const finalUsername = defaultUsername || (typeof window !== 'undefined' ? localStorage.getItem('riotUsername') : null) || ''
    setUsername(finalUsername)
  }, [defaultUsername])

  // Save values when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && username) {
      localStorage.setItem('riotUsername', username)
    }
  }, [username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) return

    setIsLoading(true)
    setError(null)

    try {
      // Validate the username
      if (username.length < 3) {
        throw new Error(tErrors('minLength'))
      }
      
      // Redirect to the generator results page
      router.push(`/${locale}/generator/${encodeURIComponent(username)}`)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(tCommon('error'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            {tChecker('inGameName')}
          </label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={tChecker('enterUsername')}
            required
          />
        </div>

        <div className="flex items-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : tGenerator('findAvailableTaglines')}
          </Button>
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </form>
  )
}
