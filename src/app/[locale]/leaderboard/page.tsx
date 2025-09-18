import { SearchContainer } from '@/components/search-container'
import { getTranslations } from 'next-intl/server'

export default async function LeaderboardPage() {
  const t = await getTranslations('leaderboard')

  return (
    <SearchContainer title={t('title')} activeTab="leaderboard">
        <p>{t('description')}</p>
    </SearchContainer>
  )
}
