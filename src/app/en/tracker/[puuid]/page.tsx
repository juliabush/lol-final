import { notFound } from 'next/navigation'
import { SearchContainer } from '@/components/search-container'
import { AccountTracker } from '@/components/account-tracker'
import { PlayerInfo } from '@/components/player-info'
import { PuuidCopyBox } from '@/components/puuid-copy-box'

async function getPlayerData(puuid: string) {
  const apiKey = process.env.RIOT_API_KEY
  if (!apiKey) throw new Error('API key not configured')

  try {
    // Step 1: Get account info
    const accountResponse = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': apiKey
        }
      }
    )

    if (!accountResponse.ok) {
      if (accountResponse.status === 404) return null
      throw new Error(`Account API error: ${accountResponse.status}`)
    }

    const account = await accountResponse.json()

    // Step 2: Find player's region by checking match history
    const regions = ['americas', 'asia', 'europe', 'sea']
    let routingRegion = null
    let matchId = null

    for (const region of regions) {
      try {
        const matchResponse = await fetch(
          `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=1`,
          {
            headers: {
              'X-Riot-Token': apiKey
            }
          }
        )

        if (matchResponse.ok) {
          const matchIds = await matchResponse.json()
          if (matchIds.length > 0) {
            routingRegion = region
            matchId = matchIds[0]
            break
          }
        }
      } catch (error) {
        console.error(`Error checking matches in ${region}:`, error)
      }
    }

    if (!routingRegion || !matchId) {
      throw new Error('Could not find recent matches for this player')
    }

    const platformId = matchId.split('_')[0]

    const summonerRegion = platformId.toLowerCase()

    // Step 3: Fetch match details and summoner info in parallel
    const [matchDetailsResponse, summonerResponse] = await Promise.all([
      fetch(
        `https://${routingRegion}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
        {
          headers: {
            'X-Riot-Token': apiKey
          }
        }
      ),
      fetch(
        `https://${summonerRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
        {
          headers: {
            'X-Riot-Token': apiKey
          }
        }
      )
    ])

    let lastMatchTime = null
    if (matchDetailsResponse.ok) {
      const matchDetails = await matchDetailsResponse.json()
      lastMatchTime = matchDetails.info.gameEndTimestamp
    }

    if (!summonerResponse.ok) {
      throw new Error('Failed to fetch summoner info')
    }

    const summonerData = await summonerResponse.json()

    return {
      account,
      summonerInfo: {
        id: summonerData.id,
        name: summonerData.name,
        profileIconId: summonerData.profileIconId,
        summonerLevel: summonerData.summonerLevel
      },
      region: routingRegion,
      platformId,
      lastMatchTime
    }
  } catch (error) {
    console.error('Error fetching player data:', error)
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

  try {
    const playerData = await getPlayerData(puuid)
    if (!playerData) return notFound()
    
    return (
      <SearchContainer title="LoL and Riot Account Tracker">
        <AccountTracker 
          defaultUsername={playerData.account.gameName}
          defaultTagline={playerData.account.tagLine}
        />
        
        <div className="pt-2 pb-2 pl-4 pr-4 rounded-lg bg-gray-100">
          <h2>
            Player {playerData.account.gameName}#{playerData.account.tagLine} found!
          </h2>
          
          <div className="p-8 flex">
            <PlayerInfo 
              puuid={playerData.account.puuid}
              gameName={playerData.account.gameName}
              tagLine={playerData.account.tagLine}
              summonerInfo={playerData.summonerInfo}
              region={playerData.region}
              platformId={playerData.platformId}
              lastMatchTime={playerData.lastMatchTime}
            />
          </div>
          <div className="mt-4 space-y-2">
            <p>To track this user, save their permanent user ID (PUUID):</p>
            <PuuidCopyBox puuid={playerData.account.puuid} />
            <p>Or just bookmark this page to check on this account anytime!</p>
          </div>
        </div>
      </SearchContainer>
    )
  } catch (error) {
    return notFound()
  }
}
