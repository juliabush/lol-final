import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lolnames.gg'
  const locales = ['en', 'de', 'fr', 'hu', 'da', 'it', 'pl', 'pt', 'ro', 'ru', 'es', 'tr', 'ko', 'ja']
  
  // Static pages for each locale
  const staticPages = [
    '',
    '/generator',
    '/tracker', 
    '/leaderboard',
    '/match',
    '/faq'
  ]
  
  const sitemap: MetadataRoute.Sitemap = []
  
  // Add pages for each locale
  locales.forEach(locale => {
    staticPages.forEach(page => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map(loc => [
              loc,
              `${baseUrl}/${loc}${page}`
            ])
          )
        }
      })
    })
  })
  
  // Add root domain
  sitemap.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  })
  
  return sitemap
}
