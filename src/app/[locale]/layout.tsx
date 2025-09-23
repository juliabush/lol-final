import Script from 'next/script'
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "../globals.css"
import { NextIntlClientProvider } from "next-intl"
import { getTranslations } from "next-intl/server"
import { Providers } from '.././providers'
import { Navbar } from "@/components/navbar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata({
  params
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations("metadata")
  
  return {
    title: t("defaultTitle"),
    description: t("defaultDescription"),
    openGraph: {
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      url: "https://lolnames.gg",
      siteName: t("siteName"),
      type: "website",
    },
    icons: {
      icon: "/favicon.png",
    },
  }
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
    <html lang={locale} suppressHydrationWarning>
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
        <Providers>
          <NextIntlClientProvider locale={locale}>
            <Navbar locale={locale} navLabels={navLabels} />
            <main className="container mx-auto p-4 mt-6">{children}</main>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
