import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { region: string; matchId: string } }
) {
  params = await params
  const { region, matchId } = params
  const apiKey = process.env.RIOT_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    console.log(`Fetching match details for ${matchId} in region ${region}`)
    
    const response = await fetch(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
      {
        headers: {
          'X-Riot-Token': apiKey
        }
      }
    )

    if (!response.ok) {
      console.error(`Match API error: ${response.status} ${response.statusText}`)
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch match details:', error)
    return NextResponse.json({ error: 'Failed to fetch match details' }, { status: 500 })
  }
}
