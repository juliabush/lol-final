
import Script from 'next/script'
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "../globals.css"
import { NextIntlClientProvider } from "next-intl"
import { getTranslations } from "next-intl/server"
import { Navbar } from "@/components/navbar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "LolNames.gg - League of Legends Name Checker & Generator",
  description: "Check League of Legends summoner names, generate unique LoL names, track accounts, view leaderboards, and lookup matches.",
  openGraph: {
    title: "LolNames.gg - League of Legends Name Checker & Generator",
    description: "Check League of Legends summoner names, generate unique LoL names, track accounts, view leaderboards, and lookup matches.",
    url: "https://lolnames.gg",
    siteName: "LolNames.gg",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params
  const t = await getTranslations("nav")

  const navLabels = {
    nameChecker: t("nameChecker"),
    generator: t("generator"),
    tracker: t("tracker"),
    leaderboard: t("leaderboard"),
    matchLookup: t("matchLookup"),
    faq: t("faq"),
  }

  return (
    <html lang={locale}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale}>
          <Navbar locale={locale} navLabels={navLabels} />
          <main className="container mx-auto p-4 mt-6">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
