import { SearchContainer } from '@/components/search-container'
import { NameGenerator } from '@/components/name-generator'
import { getTranslations } from 'next-intl/server'

export default async function GeneratorPage() {
  const t = await getTranslations('generator')

  return (
    <SearchContainer title={t('title')} activeTab="generator">
      <NameGenerator />
    </SearchContainer>
  )
}
