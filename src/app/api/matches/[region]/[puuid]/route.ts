import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { region: string; puuid: string } }
) {
  params = await params
  const { region, puuid } = params
  const apiKey = process.env.RIOT_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=1`,
      {
        headers: {
          'X-Riot-Token': apiKey
        }
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Match history not found' }, { status: 404 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch match history' }, { status: 500 })
  }
}
