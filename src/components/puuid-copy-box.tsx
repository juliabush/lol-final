'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PuuidCopyBoxProps {
  puuid: string
}

export function PuuidCopyBox({ puuid }: PuuidCopyBoxProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyPuuid = async () => {
    if (puuid) {
      await navigator.clipboard.writeText(puuid)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div 
      className="bg-white/50 p-2 rounded-md font-mono text-[10px] flex items-center justify-between cursor-pointer hover:bg-white/60"
      onClick={handleCopyPuuid}
    >
      <code className='flex-1 break-all'>{puuid}</code>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )
}
