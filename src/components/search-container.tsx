"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SearchContainerProps {
  title: string;
  children: React.ReactNode;
  activeTab?: string;
}

export function SearchContainer({
  title,
  children,
  activeTab,
}: SearchContainerProps) {
  return (
    <div className="max-w-[1200px] w-full mx-auto px-6 py-8">{children}</div>
  );
}
