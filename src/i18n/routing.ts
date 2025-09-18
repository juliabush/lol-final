import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'de', 'fr', 'hu', 'da', 'it', 'pl', 'pt', 'ro', 'ru', 'es', 'tr', 'ko', 'ja'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});