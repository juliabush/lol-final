import { SearchContainer } from '@/components/search-container'
import { AccountTracker } from '@/components/account-tracker'

export default function TrackerPage() {
  return (
    <SearchContainer title="LoL and Riot Account Tracker" activeTab="tracker">
      <AccountTracker />
    </SearchContainer>
  )
}
