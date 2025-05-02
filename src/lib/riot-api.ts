export interface RiotAccount {
  puuid: string
  gameName: string
  tagLine: string
}

export async function getAccountByRiotId(username: string, tagline: string): Promise<RiotAccount | null> {
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
      if (response.status === 404) return null
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Failed to fetch account:', error)
    throw error
  }
}

export async function getAccountByPuuid(puuid: string): Promise<RiotAccount | null> {
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
    console.error('Failed to fetch account:', error)
    throw error
  }
}
