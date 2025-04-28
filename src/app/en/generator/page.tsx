import { SearchContainer } from '@/components/search-container'
import { NameGenerator } from '@/components/name-generator'

export default function GeneratorPage() {
  return (
    <SearchContainer title="LoL and Riot Tagline Generator" activeTab="generator">
      <NameGenerator />
      </SearchContainer>
  )
}
