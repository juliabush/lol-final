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
  
  return {
    alternates: {
      canonical: `https://lolnames.gg/${locale}/generator`
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
