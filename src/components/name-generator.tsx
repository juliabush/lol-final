'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function NameGenerator({ 
  defaultUsername = ''
}: { 
  defaultUsername?: string
}) {
  const router = useRouter()
  const [username, setUsername] = useState(defaultUsername)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load saved values on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('riotUsername') || defaultUsername
    setUsername(savedUsername)
  }, [defaultUsername])

  // Save values when they change
  useEffect(() => {
    if (username) localStorage.setItem('riotUsername', username)
  }, [username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) return

    setIsLoading(true)
    setError(null)

    try {
      // Validate the username
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters')
      }
      
      // Redirect to the generator results page
      router.push(`/en/generator/${encodeURIComponent(username)}`)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
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

        <div className="flex items-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Find available taglines'}
          </Button>
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </form>
  )
}
