import { notFound } from 'next/navigation'
import { SearchContainer } from '@/components/search-container'
import { AccountTracker } from '@/components/account-tracker'
import { PlayerInfo } from '@/components/player-info'
import { PuuidCopyBox } from '@/components/puuid-copy-box'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: Promise<{ puuid: string; locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('tracker')
  
  return {
    title: `${t('metaTitle')} | LolNames.gg`,
    description: t('metaDescription'),
    alternates: {
      canonical: `https://lolnames.gg/${locale}/tracker`
    },
    openGraph: {
      title: `${t('metaTitle')} | LolNames.gg`,
      description: t('metaDescription'),
      url: `https://lolnames.gg/${locale}/tracker`,
      siteName: "LolNames.gg",
      type: "website",
    }
  }
}

async function getAccountByPuuid(puuid: string) {
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
    console.error('Error fetching account:', error)
    throw error
  }
}

export default async function TrackerResult({
  params
}: {
  params: Promise<{ puuid: string; locale: string }>
}) {
  const { puuid, locale } = await params
  const t = await getTranslations('tracker')

  if (!puuid) {
    return (
      <SearchContainer title={t('title')}>
        <AccountTracker />
      </SearchContainer>
    )
  }

  const result = await getAccountByPuuid(puuid)

  return (
    <SearchContainer title={t('title')}>
      <AccountTracker 
        defaultUsername={result?.gameName}
        defaultTagline={result?.tagLine}
      />
      
      <div className="pt-2 pb-2 pl-4 pr-4 rounded-lg bg-gray-100">
        {result.error ? (
          <div className="text-red-600">
            <h2>{t('connectionError')}</h2>
            <p>{t('tryAgain')}</p>
          </div>
        ) : !result ? (
          notFound()
        ) : (
          <>
            <h2>
              {t('playerFound', { 
                gameName: result.gameName, 
                tagLine: result.tagLine 
              })}
            </h2>
            
            <div className="p-2 sm:p-8 flex">
              <PlayerInfo 
                puuid={result.puuid}
                gameName={result.gameName}
                tagLine={result.tagLine}
              />
            </div>
            <div className="mt-4 space-y-2">
              <p>{t('savePuuid')}</p>
              <PuuidCopyBox puuid={result.puuid} />
              <p>{t('bookmarkPage')}</p>
            </div>
          </>
        )}
      </div>
    </SearchContainer>
  )
}
