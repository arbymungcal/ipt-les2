"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function TopNav() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Gallery", href: "/" },
    { name: "Featured", href: "#featured" },
    { name: "About", href: "#about" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-emerald-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors relative group"
        >
          MangaVault
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-emerald-400 transition-all group-hover:w-full"></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-gray-300 font-medium text-lg">
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="relative group hover:text-emerald-400 transition-colors"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-emerald-400 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <SignedOut>
            <SignInButton>
              <button className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/30 transform hover:scale-105 transition-all duration-300">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-11 h-11 rounded-full border-2 border-emerald-500 shadow-md hover:shadow-emerald-400/40 transition-transform hover:scale-105",
                },
              }}
            />
          </SignedIn>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-emerald-400 hover:bg-zinc-800 transition"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900/95 backdrop-blur-lg border-t border-emerald-500/20 shadow-lg">
          <div className="flex flex-col items-center py-6 gap-6 text-lg font-medium text-gray-300">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="hover:text-emerald-400 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <SignedOut>
              <SignInButton>
                <button className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/30 transform hover:scale-105 transition-all duration-300">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}
