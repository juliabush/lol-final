import { NameChecker } from '@/components/name-checker'
import { SearchContainer } from '@/components/search-container'
import { PlayerInfo } from '@/components/player-info'
import Link from 'next/link'
import { GitCommitVertical } from 'lucide-react'
import { getAccountByRiotId, RiotAccount } from '@/lib/riot-api'

async function checkNameAvailability(username: string, tagline: string) {
  try {
    const account = await getAccountByRiotId(username, tagline)
    return { 
      isAvailable: !account, 
      account,
      error: false 
    }
  } catch (error) {
    console.error('Error checking name:', error)
    return { 
      isAvailable: false, 
      account: null, 
      error: true,
      errorMessage: 'Failed to check name availability. Please try again later.'
    }
  }
}

export default async function NameResult({
  params
}: {
  params: Promise <{ username: string; tagline: string }>
}) {
  const { username, tagline } = await params
  const decodedUsername = decodeURIComponent(username)
  const result = await checkNameAvailability(decodedUsername, tagline)

  return (
    <SearchContainer title="LoL and Riot Name Checker">
      <NameChecker 
        defaultUsername={decodedUsername}
        defaultTagline={tagline}
      />
      
      <div className="pt-2 pb-2 pl-4 pr-4 rounded-lg bg-gray-100">
        {result.error ? (
          <div className="text-red-600">
            <h2>Unable to Check Name</h2>
            <p>{result.errorMessage}</p>
          </div>
        ) : (
          <>
            <h2>
              {result.isAvailable 
                ? `${decodedUsername}#${tagline} is available!` 
                : `${decodedUsername}#${tagline} is an existing account.`}
            </h2>

            <p>
              {result.isAvailable 
                ? "This in-game name and tagline combination is available! You can use it for an existing account or to create a new one."
                : "This in-game name and tagline combination is taken by another player:"}
            </p>

            {!result.isAvailable && result.account && (
              <>
                <div className="flex items-center justify-between p-8">
                  <div className="flex-1">
                    <PlayerInfo 
                      puuid={result.account.puuid}
                      gameName={result.account.gameName}
                      tagLine={result.account.tagLine}
                    />
                  </div>
                  
                  <Link 
                    href={`/en/tracker/${result.account.puuid}`}
                    className="ml-4 w-[140px] inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Track account
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <h2>Check, Generate, and Track LoL Names</h2>
      <p>Our tool is designed to help you check, generate, and track League of Legends (LoL) names quickly and easily. Whether you're looking for the perfect in-game name, checking if a name is available, or keeping an eye on a specific account, we have everything you need in one place.</p>

      <h2>How LoL Names Work</h2>
      <p>Since Riot introduced the universal Riot ID system, every player now has an in-game name (your Riot ID) and a tagline. Your Riot ID is what everyone sees, while your tagline (a short code like #NA1 or #1234) helps differentiate you from other players who might have the same display name.</p>

      <h2>Name Generator</h2>
      <p>Looking for a free tagline for your dream in-game name? Try the <Link href="/en/generator">Generator</Link>.</p>

      <h2>Account Tracker</h2>
      <p>Want to follow a specific account through name changes? Use the <Link href="/en/tracker">Account Tracker</Link></p>
    </SearchContainer>
  )
}
