'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function NameChecker({ 
  defaultUsername = '', 
  defaultTagline = '' 
}: { 
  defaultUsername?: string
  defaultTagline?: string 
}) {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const tCommon = useTranslations('common')
  const tChecker = useTranslations('checker')
  // Initialize state with correct priority: URL params > localStorage > empty
  const [username, setUsername] = useState(() => {
    return defaultUsername || localStorage.getItem('riotUsername') || ''
  })
  const [tagline, setTagline] = useState(() => {
    return defaultTagline || localStorage.getItem('riotTagline') || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Update state when URL parameters change
  useEffect(() => {
    // Use URL parameters if available, otherwise fall back to localStorage, then defaults
    const finalUsername = defaultUsername || localStorage.getItem('riotUsername') || ''
    const finalTagline = defaultTagline || localStorage.getItem('riotTagline') || ''
    
    setUsername(finalUsername)
    setTagline(finalTagline)
  }, [defaultUsername, defaultTagline])

  // Save values when they change
  useEffect(() => {
    if (username) localStorage.setItem('riotUsername', username)
    if (tagline) localStorage.setItem('riotTagline', tagline)
  }, [username, tagline])

  const handleTaglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const isValid = /^[A-Za-z0-9]*$/.test(value)
    
    if (!isValid && value !== '') {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 2000)
      return
    }

    if (value.length <= 5) setTagline(value.toUpperCase())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !tagline) return

    setIsLoading(true)
    try {
      // Navigate directly to the name check page
      router.push(`/${locale}/${encodeURIComponent(username)}/${tagline}`)
    } catch (error) {
      console.error('Error navigating to name check page:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-4 mb-6 justify-center">
        <div className="w-32">
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

        <div className="w-24">
          <label htmlFor="tagline" className="block text-sm font-medium mb-1">
            {tChecker('tagline')}
          </label>
          <Input
            id="tagline"
            value={tagline}
            onChange={handleTaglineChange}
            placeholder={tChecker('tagPlaceholder')}
            maxLength={5}
            minLength={3}
            required
          />
          {showTooltip && (
            <div className="absolute top-full mt-2 px-2 py-1 text-xs bg-destructive text-white rounded shadow-sm whitespace-nowrap">
              {tChecker('onlyLettersNumbers')}
            </div>
          )}
        </div>

        <div className="flex items-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : tCommon('check')}
          </Button>
        </div>
      </div>
    </form>
  )
}
