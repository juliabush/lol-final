import { SearchContainer } from '@/components/search-container'
import { NameGenerator } from '@/components/name-generator'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('generator')
  
  return {
    title: `${t('metaTitle')} | LolNames.gg`,
    description: t('metaDescription'),
    alternates: {
      canonical: `https://lolnames.gg/${locale}/generator`
    },
    openGraph: {
      title: `${t('metaTitle')} | LolNames.gg`,
      description: t('metaDescription'),
      url: `https://lolnames.gg/${locale}/generator`,
      siteName: "LolNames.gg",
      type: "website",
    }
  }
}

export default async function GeneratorPage() {
  const t = await getTranslations('generator')

  return (
    <SearchContainer title={t('title')} activeTab="generator">
      <NameGenerator />
    </SearchContainer>
  )
}
