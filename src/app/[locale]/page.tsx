import { NameChecker } from '@/components/name-checker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchContainer } from '@/components/search-container'
import { AccountTracker } from '@/components/account-tracker'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function Home({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = await getTranslations('checker')

  return (
    <SearchContainer title={t('title')} activeTab="checker">
      <NameChecker locale={locale} />
      <h2>{t('checkGenerateTrack')}</h2>
      <p>{t('toolDescription')}</p>

      <h2>{t('howItWorks')}</h2>
      <p>{t('howItWorksDescription')}</p>

      <h2>{t('nameGenerator')}</h2>
      <p>{t('nameGeneratorDescription')} <Link href={`/${locale}/generator`}>Generator</Link>.</p>

      <h2>{t('accountTracker')}</h2>
      <p>{t('accountTrackerDescription')} <Link href={`/${locale}/tracker`}>Account Tracker</Link></p>
    </SearchContainer>
  )
}
