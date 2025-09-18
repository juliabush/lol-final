import { SearchContainer } from '@/components/search-container'
import { getTranslations } from 'next-intl/server'

export default async function MatchPage() {
  const t = await getTranslations('match')

  return (
    <SearchContainer title={t('title')} activeTab="matchLookup">
        <p>{t('description')}</p>
        </SearchContainer>
  )
}
