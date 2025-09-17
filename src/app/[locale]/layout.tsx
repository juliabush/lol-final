import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Link from 'next/link'
import { LanguageSelector } from '@/components/language-selector'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'

// Import messages statically
import enMessages from '../../locales/en.json'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LolNames.gg",
  description: "League of Legends Name Checker, Name Generator, Account Tracker, Leaderboard and Match Lookup.",
  icons: {
    icon: "/favicon.png",
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('nav')
  
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale}>
          <header className="bg-primary text-white py-4">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-3xl font-bold hover:no-underline text-white">
                  LolNames.gg
                </Link>
                
                <nav>
                  <div className="flex items-center gap-6">
                    <Link href="/" className="nav-link">{t('nameChecker')}</Link>
                    <Link href={`/${locale}/generator`} className="nav-link">{t('generator')}</Link>
                    <Link href={`/${locale}/tracker`} className="nav-link">{t('tracker')}</Link>
                    <Link href={`/${locale}/leaderboard`} className="nav-link">{t('leaderboard')}</Link>
                    <Link href={`/${locale}/match`} className="nav-link">{t('matchLookup')}</Link>
                    <Link href={`/${locale}/faq`} className="nav-link">{t('faq')}</Link>
                    <LanguageSelector />
                  </div>
                </nav>
              </div>
            </div>
          </header>
          <main className="container mx-auto p-4 mt-6">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
