"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSelector } from "./language-selector";
import { ThemeSwitch } from "./theme-switch";

type NavbarProps = {
  locale: string;
  navLabels: {
    nameChecker: string;
    generator: string;
    tracker: string;
    leaderboard: string;
    matchLookup: string;
    faq: string;
  };
};

export function Navbar({ locale, navLabels }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: `/${locale}`, label: navLabels.nameChecker },
    { href: `/${locale}/generator`, label: navLabels.generator },
    { href: `/${locale}/tracker`, label: navLabels.tracker },
    { href: `/${locale}/leaderboard/level`, label: navLabels.leaderboard },
    { href: `/${locale}/match`, label: navLabels.matchLookup },
    { href: `/${locale}/faq`, label: navLabels.faq },
  ];

  const isOtherLinkActive =
    pathname !== `/${locale}` &&
    navLinks.some(
      (link) =>
        link.href !== `/${locale}` &&
        (pathname === link.href || pathname.startsWith(`${link.href}/`))
    );

  const renderNavLink = (link: (typeof navLinks)[0]) => {
    const isActive =
      link.href === `/${locale}`
        ? !isOtherLinkActive
        : pathname === link.href || pathname.startsWith(`${link.href}/`);

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={closeMenu}
        className={`text-sm px-4 py-2.5 rounded transition-all duration-200 ${
          isActive
            ? "font-bold text-white border-b-2 border-yellow-400"
            : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md py-5">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href={`/${locale}`} className="text-3xl font-bold">
          LolNames.gg
        </Link>

        <button
          className="lg:hidden flex flex-col justify-center items-center w-8 h-8 relative"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white mb-1 transition-transform duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white mb-1 transition-opacity duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>

        <nav className="hidden lg:flex items-center gap-6 pl-6 lg:pl-0">
          {navLinks.map(renderNavLink)}
          <div className="flex items-center gap-4 ml-auto">
            <LanguageSelector />
            <ThemeSwitch />
          </div>
        </nav>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ${
          isOpen ? "max-h-96 mt-4" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-2 px-4 pb-4">
          {navLinks.map(renderNavLink)}
          <LanguageSelector />
          <ThemeSwitch />
        </nav>
      </div>
    </header>
  );
}
