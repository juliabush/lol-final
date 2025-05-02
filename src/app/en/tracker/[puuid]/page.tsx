import { notFound } from 'next/navigation'
import { SearchContainer } from '@/components/search-container'
import { AccountTracker } from '@/components/account-tracker'
import { PlayerInfo } from '@/components/player-info'
import { PuuidCopyBox } from '@/components/puuid-copy-box'

async function getAccountByPuuid(puuid: string) {
  const apiKey = process.env.RIOT_API_KEY
  if (!apiKey) throw new Error('API key not configured')

  try {
    const response = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': apiKey
        }
      }
    )

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching account:', error)
    throw error
  }
}

export default async function TrackerResult({
  params
}: {
  params: Promise<{ puuid: string }>
}) {
  const { puuid } = await params

  if (!puuid) {
    return (
      <SearchContainer title="LoL and Riot Account Tracker">
        <AccountTracker />
      </SearchContainer>
    )
  }

  const result = await getAccountByPuuid(puuid)

  return (
    <SearchContainer title="LoL and Riot Account Tracker">
      <AccountTracker 
        defaultUsername={result?.gameName}
        defaultTagline={result?.tagLine}
      />
      
      <div className="pt-2 pb-2 pl-4 pr-4 rounded-lg bg-gray-100">
        {result.error ? (
          <div className="text-red-600">
            <h2>We couldn't connect to Riot servers.</h2>
            <p>Please try again later or contact support if the problem persists.</p>
          </div>
        ) : !result ? (
          notFound()
        ) : (
          <>
            <h2>
              Player {result.gameName}#{result.tagLine} found!
            </h2>
            
            <div className="p-8 flex">
              <PlayerInfo 
                puuid={result.puuid}
                gameName={result.gameName}
                tagLine={result.tagLine}
              />
            </div>
            <div className="mt-4 space-y-2">
              <p>To track this user, save their permanent user ID (PUUID):</p>
              <PuuidCopyBox puuid={result.puuid} />
              <p>Or just bookmark this page to check on this account anytime!</p>
            </div>
          </>
        )}
      </div>
    </SearchContainer>
  )
}
