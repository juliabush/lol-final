import { notFound } from 'next/navigation'
import { SearchContainer } from '@/components/search-container'
import { AccountTracker } from '@/components/account-tracker'
import { PlayerInfo } from '@/components/player-info'
import { PuuidCopyBox } from '@/components/puuid-copy-box'

async function getAccountByPuuid(puuid: string) {
  try {
    // Make sure we're using the correct URL format
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = new URL(`/api/puuid/${puuid}`, baseUrl);
    
    const response = await fetch(url.toString(), { 
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Account not found');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching account:', error);
    throw error;
  }
}

export default async function TrackerResult(
  props: { 
    params?: Promise<{ puuid?: string }> 
  }
) {
  const params = await props.params;
  params = await params
  const puuid = params?.puuid

  if (!puuid) {
    return (
      <SearchContainer title="LoL and Riot Account Tracker">
        <AccountTracker />
      </SearchContainer>
    )
  }

  try {
    const account = await getAccountByPuuid(puuid)
    
    return (
      <SearchContainer title="LoL and Riot Account Tracker">
        <AccountTracker 
          defaultUsername={account.gameName}
          defaultTagline={account.tagLine}
        />
        
        <div className="pt-2 pb-2 pl-4 pr-4 rounded-lg bg-gray-100">
          <h2>
            Player {account.gameName}#{account.tagLine} found!
          </h2>
          
          <div className="p-8 flex">
            <PlayerInfo 
              puuid={account.puuid}
              gameName={account.gameName}
              tagLine={account.tagLine}
            />
          </div>
          <div className="mt-4 space-y-2">
            <p>To track this user, save their permanent user ID (PUUID):</p>
            <PuuidCopyBox puuid={account.puuid} />
            <p>Or just bookmark this page to check on this account anytime!</p>
          </div>
        </div>
      </SearchContainer>
    )
  } catch (error) {
    return notFound()
  }
}
