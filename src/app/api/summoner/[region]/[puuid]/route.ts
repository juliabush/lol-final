import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { region: string; puuid: string } }
) {
  params = await params
  const { region, puuid } = params
  const apiKey = process.env.RIOT_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    console.log(`Fetching summoner info for puuid ${puuid} in region ${region}`)
    
    const response = await fetch(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': apiKey
        }
      }
    )

    if (!response.ok) {
      console.error(`Summoner API error: ${response.status} ${response.statusText}`)
      return NextResponse.json({ error: 'Summoner not found' }, { status: 404 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch summoner:', error)
    return NextResponse.json({ error: 'Failed to fetch summoner' }, { status: 500 })
  }
}
