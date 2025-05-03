import { SearchContainer } from '@/components/search-container'
import { AccountTracker } from '@/components/account-tracker'
import { getTranslations } from 'next-intl/server'

export default async function TrackerPage() {
  const t = await getTranslations('tracker')

  return (
    <SearchContainer title={t('title')} activeTab="tracker">
      <AccountTracker />
    </SearchContainer>
  )
}
