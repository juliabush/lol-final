import { NameChecker } from '@/components/name-checker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchContainer } from '@/components/search-container'
import { AccountTracker } from '@/components/account-tracker'
import Link from 'next/link'

export default function Home() {
  return (
    <SearchContainer title="LoL and Riot Name Checker" activeTab="checker">
      <NameChecker />
      <h2>Check, Generate, and Track LoL Names</h2>
  <p>Our tool is designed to help you check, generate, and track League of Legends (LoL) names quickly and easily. Whether you're looking for the perfect in-game name, checking if a name is available, or keeping an eye on a specific account, we have everything you need in one place.</p>

  <h2>How LoL Names Work</h2>
  <p>Since Riot introduced the universal Riot ID system, every player now has an in-game name (your Riot ID) and a tagline. Your Riot ID is what everyone sees, while your tagline (a short code like #NA1 or #1234) helps differentiate you from other players who might have the same display name.</p>

  <h2>Name Generator</h2>
  <p>Looking for a free tagline for your dream in-game name? Try the <Link href="/en/generator">Generator</Link>.</p>

  <h2>Account Tracker</h2>
  <p>Want to follow a specific account through name changes? Use the <Link href="/en/tracker">Account Tracker</Link></p>
    
    </SearchContainer>
  )
}
