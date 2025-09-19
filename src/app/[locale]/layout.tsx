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
  title: "LolNames.gg",
  description:
    "League of Legends Name Checker, Name Generator, Account Tracker, Leaderboard and Match Lookup.",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale}>
          <Navbar locale={locale} navLabels={navLabels} />
          <main className="container mx-auto p-4 mt-6">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
