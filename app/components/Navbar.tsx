"use client";

import {
  faCalendar,
  faGamepad,
  faHome,
  faNewspaper,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../globals.css";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Desktop Navigation - Top */}
      <header className="hidden sm:block fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="px-4 lg:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center h-full" title="Home">
            <span className="text-2xl font-bold text-red-600 RaceSport flex items-center">
              LITS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex gap-4 sm:gap-6">
            <Link
              href="/standings"
              title="Standings"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Standings
            </Link>
            <Link
              href="/game"
              title="Game"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Game
            </Link>
            <Link
              href="/news"
              title="News"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              News
            </Link>
            <Link
              href="/events"
              title="Events"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Events
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile Tab Bar - Bottom */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive("/")
                ? "text-red-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FontAwesomeIcon icon={faHome} className="text-xl mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          <Link
            href="/standings"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive("/standings")
                ? "text-red-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FontAwesomeIcon icon={faTrophy} className="text-xl mb-1" />
            <span className="text-xs font-medium">Standings</span>
          </Link>

          <Link
            href="/game"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive("/game")
                ? "text-red-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FontAwesomeIcon icon={faGamepad} className="text-xl mb-1" />
            <span className="text-xs font-medium">Game</span>
          </Link>

          <Link
            href="/news"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive("/news")
                ? "text-red-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FontAwesomeIcon icon={faNewspaper} className="text-xl mb-1" />
            <span className="text-xs font-medium">News</span>
          </Link>

          <Link
            href="/events"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive("/events")
                ? "text-red-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FontAwesomeIcon icon={faCalendar} className="text-xl mb-1" />
            <span className="text-xs font-medium">Events</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
