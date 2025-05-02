import { SearchContainer } from '@/components/search-container'
import { NameGenerator } from '@/components/name-generator'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { headers } from 'next/headers'

/**
 * Generates a random alphanumeric tagline of random length between min and max
 */
function generateRandomTagline(minLength: number = 3, maxLength: number = 5): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Generates an array of unique random taglines with lengths between 3-5 characters
 */
function generateRandomTaglines(count: number = 10): string[] {
  const taglines = new Set<string>()
  
  while (taglines.size < count) {
    taglines.add(generateRandomTagline(3, 5))
  }
  
  return Array.from(taglines)
}

/**
 * Checks if a name and tagline combination is available
 */
async function checkNameAvailability(username: string, tagline: string) {
  const apiKey = process.env.RIOT_API_KEY
  if (!apiKey) throw new Error('API key not configured')

  try {
    const response = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(username)}/${tagline}`,
      {
        headers: {
          'X-Riot-Token': apiKey
        }
      }
    )

    if (!response.ok) {
      if (response.status === 404) return { isAvailable: true, account: null }
      throw new Error(`API error: ${response.status}`)
    }

    const account = await response.json()
    return { isAvailable: false, account }
  } catch (error) {
    console.error('Error checking name availability inner:', error)
    throw error
  }
}

export default async function GeneratorResult({
  params
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const decodedUsername = decodeURIComponent(username)

  // Generate 10 random taglines with lengths between 3-5 characters
  const taglines = generateRandomTaglines(10)

  // Check availability for each tagline
  const results = await Promise.all(
    taglines.map(async (tagline) => {
      try {
        const { isAvailable } = await checkNameAvailability(decodedUsername, tagline)
        return { tagline, isAvailable }
      } catch (error) {
        console.error('Error checking name availability:', error)
        return { tagline, error: true }
      }
    })
  )

  // Check if any requests resulted in an error
  const hasError = results.some(result => 'error' in result)
  
  // Filter available taglines (only if no errors occurred)
  const availableTaglines = hasError ? [] : results.filter(result => result.isAvailable)

  return (
    <SearchContainer title="LoL and Riot Tagline Generator">
      <NameGenerator defaultUsername={decodedUsername} />
      
      <div className="pt-2 pb-4 pl-4 pr-4 rounded-lg bg-gray-100">
        {hasError ? (
          <div className="text-red-600">
            <h2>We couldn't connect to Riot servers.</h2>
            <p>Please try again later or contact support if the problem persists..</p>
          </div>
        ) : (
          <>
            <h2>
              Available taglines for {decodedUsername}
            </h2>
            
            {availableTaglines.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableTaglines.map(({ tagline }) => (
                  <Link 
                    key={tagline}
                    href={`/en/${encodeURIComponent(decodedUsername)}/${tagline}`}
                    className="p-4 bg-white rounded-lg text-center hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-lg font-medium">{tagline}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center py-6">
                No available taglines found. Try a different username or generate more options.
              </p>
            )}
          </>
        )}
      </div>
    </SearchContainer>
  )
}
