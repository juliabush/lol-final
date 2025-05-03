'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { routing } from '@/i18n/routing'

export function LanguageSelector() {
  const router = useRouter()
  const locale = useLocale()
  
  const handleLanguageChange = (value: string) => {
    const path = window.location.pathname
    const redirectPath = path.replace(/^\/[a-z]{2}/, `/${value}`)
    router.push(redirectPath)
  }
  
  return (
    <Select onValueChange={handleLanguageChange} defaultValue={locale}>
      <SelectTrigger 
        className="w-[110px] bg-white border-none text-gray-800 focus:ring-0"
      >
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="bg-white text-gray-800">
        {routing.locales.map(locale => (
          <SelectItem key={locale} value={locale}>
            {locale.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
