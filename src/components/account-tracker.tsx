'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function AccountTracker({ 
  defaultUsername = '', 
  defaultTagline = '' 
}: { 
  defaultUsername?: string
  defaultTagline?: string 
}) {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('tracker')
  
  const [username, setUsername] = useState(defaultUsername)
  const [tagline, setTagline] = useState(defaultTagline)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load saved values on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('riotUsername') || defaultUsername
    const savedTagline = localStorage.getItem('riotTagline') || defaultTagline
    
    setUsername(savedUsername)
    setTagline(savedTagline)
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
    e.preventDefault();
    if (!username || !tagline) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/riot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getAccountByRiotId',
          username,
          tagline,
        }),
      });

      if (!response.ok) {
        throw new Error('Account not found');
      }

      const data = await response.json();
      if (data.puuid) {
        router.push(`/${locale}/tracker/${data.puuid}`);
      }
    } catch (error) {
      setError(t('playerNotFound', {
        gameName: username,
        tagLine: tagline,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              In-game name
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="relative w-24">
            <label htmlFor="tagline" className="block text-sm font-medium mb-1">
              Tagline
            </label>
            <Input
              id="tagline"
              value={tagline}
              onChange={handleTaglineChange}
              placeholder="TAG"
              maxLength={5}
              minLength={3}
              required
            />
            {showTooltip && (
              <div className="absolute top-full mt-2 px-2 py-1 text-xs bg-destructive text-white rounded shadow-sm whitespace-nowrap">
                Only letters and numbers allowed
              </div>
            )}
          </div>

          <div className="flex items-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Track'}
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-8 p-4 rounded-lg bg-gray-100">
          <h2 className="text-xl font-semibold mb-4">
            {error}
          </h2>
        </div>
      )}
    </>
  )
}
