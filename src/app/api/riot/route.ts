import { NextRequest, NextResponse } from 'next/server';
import { getSummoner, getMatches, getMatch, getAccountByRiotId, getAccountByPuuid } from '@/lib/riot-api';

export async function POST(request: NextRequest) {
  const { action, region, puuid, matchId, username, tagline } = await request.json();

  try {
    let data;
    switch (action) {
      case 'getSummoner':
        data = await getSummoner(region, puuid);
        break;
      case 'getMatches':
        data = await getMatches(region, puuid);
        break;
      case 'getMatch':
        data = await getMatch(region, matchId);
        break;
      case 'getAccountByRiotId':
        data = await getAccountByRiotId(username, tagline);
        break;
      case 'getAccountByPuuid':
        data = await getAccountByPuuid(puuid);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
