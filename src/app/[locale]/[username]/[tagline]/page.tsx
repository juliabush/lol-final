import { NameChecker } from '@/components/name-checker'
import { SearchContainer } from '@/components/search-container'
import { PlayerInfo } from '@/components/player-info'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: Promise<{ username: string; tagline: string; locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  
  return {
    alternates: {
      canonical: `https://lolnames.gg/${locale}`
    }
  }
}

async function checkNameAvailability(username: string, tagline: string) {
  try {
    // Use the Riot API function directly instead of making a fetch call to our own API
    const { getAccountByRiotId } = await import('@/lib/riot-api');
    const account = await getAccountByRiotId(username, tagline);

    return {
      isAvailable: !account,
      account,
      error: false,
    };
  } catch (error) {
    console.error('Error checking name:', error);
    return {
      isAvailable: false,
      account: null,
      error: true,
    };
  }
}

export default async function NameResult({
  params
}: {
  params: Promise<{ username: string; tagline: string; locale: string }>
}) {
  const { username, tagline, locale } = await params
  const decodedUsername = decodeURIComponent(username)
  const result = await checkNameAvailability(decodedUsername, tagline)
  const t = await getTranslations('checker')

  return (
    <SearchContainer title={t('title')}>
      <NameChecker 
        defaultUsername={decodedUsername}
        defaultTagline={tagline}
      />
      
      <div className="pt-2 pb-2 pl-4 pr-4 rounded-lg bg-gray-100">
        {result.error ? (
          <div className="text-red-600">
            <h2>{t('connectionError')}</h2>
            <p>{t('tryAgain')}</p>
          </div>
        ) : (
          <>
            <h2>
              {result.isAvailable 
                ? t('isAvailable', { username: decodedUsername, tagline })
                : t('isExisting', { username: decodedUsername, tagline })}
            </h2>

            <p>
              {result.isAvailable 
                ? t('availableDescription')
                : t('takenDescription')}
            </p>

            {!result.isAvailable && result.account && (
              <>
                <div className="p-2 sm:p-8 flex items-center justify-between">
                  <div className="flex-1">
                    <PlayerInfo 
                      puuid={result.account.puuid}
                      gameName={result.account.gameName}
                      tagLine={result.account.tagLine}
                    />
                  </div>
                  
                  <Link 
                    href={`/${locale}/tracker/${result.account.puuid}`}
                    className="ml-4 w-[140px] inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    {t('trackAccount')}
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <h2>{t('checkGenerateTrack')}</h2>
      <p>{t('toolDescription')}</p>

      <h2>{t('howItWorks')}</h2>
      <p>{t('howItWorksDescription')}</p>

      <h2>{t('nameGenerator')}</h2>
      <p>{t('nameGeneratorDescription')} <Link href={`/${locale}/generator`}>{t('generatorLink')}</Link>.</p>

      <h2>{t('accountTracker')}</h2>
      <p>{t('accountTrackerDescription')} <Link href={`/${locale}/tracker`}>{t('trackerLink')}</Link></p>
    </SearchContainer>
  )
}
