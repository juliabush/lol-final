import { SearchContainer } from '@/components/search-container'

export default function FaqPage() {
  return (
    <SearchContainer title="LolNames.gg FAQ">
      <h2>How frequently do the lists update?</h2>
      <p>The lists will update about once every hour. A full rescan is done every week.</p>

      <h2>Why can't I take a name on a new account?</h2>
      <p>If a name is already taken by an account you can only obtain it via a name change. These names are shown with a green background. If a name isn't taken by a current user you can take it on a brand new account. These names are shown with a blue background.</p>

      <h2>What if the account is banned?</h2>
      <p>If the account is banned it may be shown as being free, however it will remain unavailable indefinitely unless Riot changes their policy on banned accounts. <a href="https://support.riotgames.com/hc/en-us/articles/202647784-Account-Deletion-FAQ#h2q2" target="_blank" rel="noopener">Riot's stance.</a></p>

      <h2>How can I get a 2 letter name?</h2>
      <p>The minimum characters for League of Legends names are 3. You can put a space between the characters to fix this.</p>

      <h2>What timezone is used?</h2>
      <p>All timezones are in UTC. Use this <a href="https://www.timeanddate.com/worldclock/converter.html?p1=1440" target="_blank" rel="noopener">timezone converter</a> to adjust them to your local time.</p>

      <h2>When exactly will the name become available?</h2>
      <p>Normally names are cleaned up at midnight UTC. However, in some cases I've found it has taken 48 hours. Check every few hours on the day it is listed.</p>

      <h2>Can you remove a name from a list for me?</h2>
      <p>No. All the names are automatically scanned.</p>

      <h2>Why are no pre Xayah and Rakan champion names allowed?</h2>
      <p><a href="https://boards.oce.leagueoflegends.com/en/c/miscellaneous/miF2IpMd-so-a-few-days-back-i-made-a-post-asking-about-why-the-xayah-and-rakan-names-were-open-and-riot-said" target="_blank" rel="noopener">Riot has said they will no longer reserve names of new champions.</a> However they banned the accounts of the old names so they will never expire.</p>
    </SearchContainer>
  )
}
