"use client";

import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import "../globals.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="px-4 lg:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center h-full" title="Home">
          <span className="text-2xl font-bold text-red-600 RaceSport flex items-center">
            LITS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex gap-4 sm:gap-6">
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
            href="/events"
            title="Events"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Events
          </Link>
        </nav>

        {/* Burger Menu Button */}
        <button
          className="sm:hidden text-gray-700 text-2xl"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col bg-white shadow-md">
          <Link
            href="/standings"
            title="Standings"
            className="py-2 px-4 text-sm font-medium hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            Standings
          </Link>
          <Link
            href="/game"
            title="Game"
            className="py-2 px-4 text-sm font-medium hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            Game
          </Link>
          <Link
            href="/events"
            title="Events"
            className="py-2 px-4 text-sm font-medium hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            Events
          </Link>
        </div>
      )}
    </header>
  );
}
