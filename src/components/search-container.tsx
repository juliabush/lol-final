'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SearchContainerProps {
  title: string
  children: React.ReactNode
  activeTab?: string
}

export function SearchContainer({ title, children, activeTab }: SearchContainerProps) {
  return (
      <div className="max-w-[650px] mx-auto p-8">
        <h1>{title}</h1>
        {children}
      </div>
  )
}
