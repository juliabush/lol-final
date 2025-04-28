import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link'
import { LanguageSelector } from '@/components/language-selector'

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
  description: "Check League of Legends and Riot Games name availability",
  icons: {
    icon: '/favicon.png'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="bg-primary text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-3xl font-bold hover:no-underline text-white">
                LolNames.gg
              </Link>
              
              <nav>
                <div className="flex items-center gap-6">
                  <Link href="/" className="nav-link">Name Checker</Link>
                  <Link href="/en/generator" className="nav-link">Generator</Link>
                  <Link href="/en/tracker" className="nav-link">Tracker</Link>
                  <Link href="/en/leaderboard" className="nav-link">Leaderboard</Link>
                  <Link href="/en/match" className="nav-link">Match Lookup</Link>
                  <Link href="/en/faq" className="nav-link">FAQ</Link>
                  <LanguageSelector />
                </div>
              </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 mt-6">
          {children}
        </main>
      </body>
    </html>
  );
}
