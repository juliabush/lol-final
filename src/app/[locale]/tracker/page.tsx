import { SearchContainer } from '@/components/search-container'
import { AccountTracker } from '@/components/account-tracker'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  
  return {
    alternates: {
      canonical: `https://lolnames.gg/${locale}/tracker`
    }
  }
}

export default async function TrackerPage() {
  const t = await getTranslations('tracker')

  return (
    <SearchContainer title={t('title')} activeTab="tracker">
      <AccountTracker />
    </SearchContainer>
  )
}
