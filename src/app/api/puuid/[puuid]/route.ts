import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { puuid: string } }
) {
  params = await params
  const { puuid } = params
  const apiKey = process.env.RIOT_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

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
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 })
  }
}
