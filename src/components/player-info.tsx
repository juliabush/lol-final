'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Loader2 } from 'lucide-react'

interface PlayerInfoProps {
  puuid: string
  gameName?: string
  tagLine?: string
  summonerInfo: {
    id: string
    name: string
    profileIconId: number
    summonerLevel: number
  }
  region: string
  platformId: string
  lastMatchTime: number | null
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

export function PlayerInfo({ 
  puuid, 
  gameName, 
  tagLine,
  summonerInfo,
  region,
  platformId,
  lastMatchTime
}: PlayerInfoProps) {
  const [version, setVersion] = useState('14.8.1')

  useEffect(() => {
    async function fetchGameVersion() {
      try {
        const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
        if (response.ok) {
          const versions = await response.json()
          setVersion(versions[0])
        }
      } catch (error) {
        console.error('Error fetching game version:', error)
      }
    }

    fetchGameVersion()
  }, [])

  console.log('Current player data state:', { puuid, gameName, tagLine, summonerInfo, region, platformId, lastMatchTime })

  if (lastMatchTime === null) {
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
            <p className="text-base text-gray-600">Loading player information...</p>
          </div>
        </div>
      </div>
    )
  }

  const iconUrl = `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${summonerInfo.profileIconId}.png`
  
  // Display the human-readable region based on the platform ID
  const regionDisplay = platformId ? (platformToDisplayName[platformId] || platformId) : 'Unknown'
  
  return (
    <div className="bg-gray-100 rounded-lg">
      <div className="flex items-center gap-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-blue-500">
          <Image 
            src={iconUrl}
            alt="Summoner Icon"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium">{gameName || summonerInfo.name}#{tagLine}</h3>
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
              {regionDisplay}
            </span>
          </div>
          <p className="text-base text-gray-600">Level {summonerInfo.summonerLevel}</p>
          {lastMatchTime && (
            <p 
              className="text-sm text-gray-500" 
              title={new Date(lastMatchTime).toLocaleString()}
            >
              Last match: {formatDistanceToNow(new Date(lastMatchTime), { addSuffix: true })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
