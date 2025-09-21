"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LanguageSelector } from "./language-selector"

type NavbarProps = {
  locale: string
  navLabels: {
    nameChecker: string
    generator: string
    tracker: string
    leaderboard: string
    matchLookup: string
    faq: string
  }
}

export function Navbar({ locale, navLabels }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const navLinks = [
    { href: `/${locale}`, label: navLabels.nameChecker },
    { href: `/${locale}/generator`, label: navLabels.generator },
    { href: `/${locale}/tracker`, label: navLabels.tracker },
    { href: `/${locale}/leaderboard`, label: navLabels.leaderboard },
    { href: `/${locale}/match`, label: navLabels.matchLookup },
    { href: `/${locale}/faq`, label: navLabels.faq },
  ]

  return (
    <header className="bg-primary text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href={`/${locale}`} className="text-2xl font-bold">
          LolNames.gg
        </Link>

        {/* Hamburger Button (Mobile Only) */}
        <button
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 pl-6 lg:pl-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm hover:underline transition-opacity ${
                  isActive ? "font-bold text-white" : "opacity-80"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <LanguageSelector />
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden mt-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`text-base font-medium transition-opacity ${
                  isActive ? "font-bold text-white" : "opacity-80"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <LanguageSelector />
        </nav>
      )}
    </header>
  )
}
