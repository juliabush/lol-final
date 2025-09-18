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

export async function getMatch(region: string, matchId: string): Promise<any> {
  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) throw new Error('API key not configured');

  try {
    console.log(`Fetching match details for ${matchId} in region ${region}`);
    const response = await fetch(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
      {
        headers: {
          'X-Riot-Token': apiKey
        }
      }
    );

    if (!response.ok) {
      console.error(`Match API error: ${response.status} ${response.statusText}`);
      throw new Error('Match not found');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch match details:', error);
    throw error;
  }
}

export async function getMatches(region: string, puuid: string): Promise<any> {
  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) throw new Error('API key not configured');

  try {
    const response = await fetch(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=1`,
      {
        headers: {
          'X-Riot-Token': apiKey
        }
      }
    );

    if (!response.ok) {
      throw new Error('Match history not found');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch match history:', error);
    throw error;
  }
}

export async function getSummoner(region: string, puuid: string): Promise<any> {
  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) throw new Error('API key not configured');

  try {
    console.log(`Fetching summoner info for puuid ${puuid} in region ${region}`);
    const response = await fetch(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': apiKey
        }
      }
    );

    if (!response.ok) {
      console.error(`Summoner API error: ${response.status} ${response.statusText}`);
      throw new Error('Summoner not found');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch summoner:', error);
    throw error;
  }
}
