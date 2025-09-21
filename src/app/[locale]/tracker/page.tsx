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

export default async function TrackerPage() {
  const t = await getTranslations('tracker')

  return (
    <SearchContainer title={t('title')} activeTab="tracker">
      <AccountTracker />
    </SearchContainer>
  )
}
