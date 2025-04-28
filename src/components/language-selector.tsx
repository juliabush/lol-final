'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ko', name: 'Korean' }
]

export function LanguageSelector() {
  const router = useRouter()
  
  const handleLanguageChange = (value: string) => {
    // Get current path
    const path = window.location.pathname
    
    // Replace language code in path or add it if not present
    const newPath = path.replace(/^\/[a-z]{2}\//, `/${value}/`)
    
    // If path didn't change, it means there was no language code
    const redirectPath = newPath === path 
      ? `/${value}${path === '/' ? '' : path}`
      : newPath
      
    router.push(redirectPath)
  }
  
  return (
    <Select onValueChange={handleLanguageChange} defaultValue="en">
      <SelectTrigger 
        className="w-[110px] bg-white border-none text-gray-800 focus:ring-0"
      >
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="bg-white text-gray-800">
        {languages.map(lang => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
