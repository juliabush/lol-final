'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface PlayerInfoProps {
  puuid: string
  gameName?: string
  tagLine?: string
}

interface SummonerInfo {
  id: string
  name: string
  profileIconId: number
  summonerLevel: number
}

interface PlayerData {
  summonerInfo: SummonerInfo | null
  region: string | null
  platformId: string | null
  lastMatchTime: number | null
  loading: boolean
  error: string | null
}

// Map region routing values to display names
const regionDisplayNames: Record<string, string> = {
  'americas': 'NA/BR/LAN/LAS',
  'asia': 'KR/JP',
  'europe': 'EUW/EUNE/TR/RU',
  'sea': 'OCE/PH/SG/TH/TW/VN'
}

// Map platform IDs to summoner API regions
const platformToRegion: Record<string, string> = {
  'NA1': 'na1',
  'BR1': 'br1',
  'LA1': 'la1',
  'LA2': 'la2',
  'KR': 'kr',
  'JP1': 'jp1',
  'EUW1': 'euw1',
  'EUN1': 'eun1',
  'TR1': 'tr1',
  'RU': 'ru',
  'OC1': 'oc1',
  'PH2': 'ph2',
  'SG2': 'sg2',
  'TH2': 'th2',
  'TW2': 'tw2',
  'VN2': 'vn2'
}

// Add this mapping for platform IDs to display names
const platformToDisplayName: Record<string, string> = {
  'NA1': 'NA',
  'BR1': 'BR',
  'LA1': 'LAN',
  'LA2': 'LAS',
  'KR': 'KR',
  'JP1': 'JP',
  'EUW1': 'EUW',
  'EUN1': 'EUNE',
  'TR1': 'TR',
  'RU': 'RU',
  'OC1': 'OCE',
  'PH2': 'SEA',
  'SG2': 'SEA',
  'TH2': 'SEA',
  'TW2': 'TW',
  'VN2': 'VN',
  'ME1': 'ME'
}

// Use relative URLs for API calls

export function PlayerInfo({ puuid, gameName, tagLine }: PlayerInfoProps) {
  const t = useTranslations('tracker')
  console.log('PlayerInfo component mounted with:', { puuid, gameName, tagLine })
  
  const [playerData, setPlayerData] = useState<PlayerData>({
    summonerInfo: null,
    region: null,
    platformId: null,
    lastMatchTime: null,
    loading: true,
    error: null
  })
  const [version, setVersion] = useState('14.8.1') // Default version

  useEffect(() => {
    console.log('PlayerInfo useEffect triggered with puuid:', puuid)
    
    // Fetch the latest game version
    async function fetchGameVersion() {
      try {
        console.log('Fetching game version...')
        const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
        if (response.ok) {
          const versions = await response.json()
          console.log('Game versions fetched:', versions[0])
          setVersion(versions[0]) // Use the latest version
        } else {
          console.error('Failed to fetch game version:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error fetching game version:', error)
      }
    }

    // Fetch player region and match history
    async function fetchPlayerData() {
      try {
        console.log('Starting to fetch player data for puuid:', puuid);
        const regions = ['americas', 'asia', 'europe', 'sea'];
        let routingRegion = null;
        let matchId = null;

        console.log('Trying to find player region from match history...');
        for (const region of regions) {
          try {
            console.log(`Checking matches in region: ${region}`);
            const response = await fetch('/api/riot', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'getMatches',
                region,
                puuid,
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to fetch matches');
            }

            const matchIds = await response.json();
            console.log(`Match IDs from ${region}:`, matchIds);

            if (matchIds.length > 0) {
              routingRegion = region;
              matchId = matchIds[0]; // Get the most recent match
              console.log(`Found matches in ${region}, using matchId:`, matchId);
              break;
            } else {
              console.log(`No matches found in ${region}`);
            }
          } catch (error) {
            console.error(`Error fetching matches from ${region}:`, error);
          }
        }

        if (!routingRegion || !matchId) {
          console.error('Could not find recent matches for this player in any region');
          throw new Error('Could not find recent matches for this player');
        }

        console.log(`Player routing region determined: ${routingRegion}, matchId: ${matchId}`);
        const platformId = matchId.split('_')[0];
        console.log(`Extracted platform ID: ${platformId}`);

        if (!platformId || !platformToRegion[platformId]) {
          console.error(`Invalid platform ID: ${platformId}`);
          throw new Error(`Invalid platform ID: ${platformId}`);
        }

        const summonerRegion = platformToRegion[platformId];
        console.log(`Mapped to summoner region: ${summonerRegion}`);

        console.log(`Fetching match details and summoner info in parallel`);

        const [matchDetailsResponse, summonerResponse] = await Promise.all([
          fetch('/api/riot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'getMatch',
              region: routingRegion,
              matchId,
            }),
          }),
          fetch('/api/riot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'getSummoner',
              region: summonerRegion,
              puuid,
            }),
          }),
        ]);

        if (!matchDetailsResponse.ok || !summonerResponse.ok) {
          throw new Error('Failed to fetch match details or summoner info');
        }

        const matchDetails = await matchDetailsResponse.json();
        const lastMatchTime = matchDetails.info.gameEndTimestamp;
        console.log('Last match time:', new Date(lastMatchTime).toISOString());

        const summonerData = await summonerResponse.json();
        console.log('Summoner data received');

        setPlayerData({
          summonerInfo: {
            id: summonerData.id,
            name: summonerData.name,
            profileIconId: summonerData.profileIconId,
            summonerLevel: summonerData.summonerLevel,
          },
          region: routingRegion,
          platformId: platformId,
          lastMatchTime,
          loading: false,
          error: null,
        });

        console.log('Player data successfully set');
      } catch (error) {
        console.error('Error in fetchPlayerData:', error);
        setPlayerData({
          summonerInfo: null,
          region: null,
          platformId: null,
          lastMatchTime: null,
          loading: false,
          error: error instanceof Error ? error.message : t('connectionError'),
        });
      }
    }

    fetchGameVersion()
    fetchPlayerData()
  }, [puuid])

  console.log('Current player data state:', playerData)

  if (playerData.loading) {
    return (
      <div className="bg-gray-100 rounded-lg">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-blue-500 bg-gray-300">
            {/* Placeholder for profile image */}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{gameName}#{tagLine}</h3>
              <span className="px-1 py-1 text-sm bg-blue-100 text-blue-800 rounded-full flex items-center">
                <Loader2 className="animate-spin h-4 w-4" />
              </span>
            </div>
            <p className="text-base text-gray-600">{t('loadingPlayer')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (playerData.error || !playerData.summonerInfo) {
    console.log('Rendering error state with:', { error: playerData.error, gameName, tagLine })
    return (
      <div className="bg-gray-100 rounded-lg">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 flex-shrink-0 rounded-full overflow-hidden border-3 border-red-500 bg-gray-300">
            {/* Placeholder for profile image */}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium truncate">{gameName}#{tagLine}</h3>
            </div>
            <p className="text-base text-gray-500 break-words">{t('noLolData')}</p>
          </div>
        </div>
      </div>
    )
  }

  const { summonerInfo, region, platformId, lastMatchTime } = playerData
  const iconUrl = summonerInfo.profileIconId && version 
    ? `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${summonerInfo.profileIconId}.png`
    : '/profile.jpg'

  console.log('Icon URL:', iconUrl)
  
  // Display the human-readable region based on the platform ID
  const regionDisplay = platformId ? (platformToDisplayName[platformId] || platformId) : 'Unknown'
  
  return (
    <div className="bg-gray-100 rounded-lg">
      <div className="gap-2 flex items-center sm:gap-6 dark:bg-neutral-900 dark:text-white">
        <div className="relative w-16 h-16 sm:relative sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-blue-500">
          <Image 
            src={iconUrl}
            alt={t('playerFound', { gameName: gameName || summonerInfo.name, tagLine: tagLine || '' })}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex items-star gap-1">
            <h3 className="sm:text-lg font-medium">{gameName || summonerInfo.name}#{tagLine}</h3>
            <span className="px-2 h-8 ml-2 py-2 text-sm bg-blue-100 text-blue-800 rounded-full">
              {regionDisplay}
            </span>
          </div>
          <p className="text-base text-gray-600">
            {t('level', { level: summonerInfo.summonerLevel })}
          </p>
          {lastMatchTime && (
            <p 
              className="text-sm text-gray-500" 
              title={new Date(lastMatchTime).toLocaleString()}
            >
              {t('lastMatch', { 
                time: formatDistanceToNow(new Date(lastMatchTime), { addSuffix: true })
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
