'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CommandMenu } from './CommandMenu';
import { Menu, X } from 'lucide-react';

// Define our navigation links in an array for easier mapping
const navLinks = [
  { href: '/play', label: 'Play' },
  { href: '/leaderboards', label: 'Leaderboards' },
  { href: '/typing-test', label: 'Typing Test' },
  { href: '/how-to-play', label: 'How to Play' },
  { href: '/about', label: 'About' },
];

export const Navbar = () => {
  const [isCommandMenuOpen, setCommandMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side: Logo and Desktop Links */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-white tracking-wider">
                NEXT.NAV
              </Link>
              {/* Desktop Links - Hidden on mobile */}
              <div className="hidden md:flex md:space-x-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Command Trigger and Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setCommandMenuOpen(true)}
                className="px-3 py-2 text-sm text-gray-400 border border-gray-700 rounded-md hover:text-white hover:border-gray-500 transition-colors"
              >
                Search...
                <kbd className="ml-2 hidden sm:inline-block px-1.5 py-0.5 text-xs font-mono bg-gray-800 border border-gray-700 rounded">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Menu Hamburger Button - Hidden on desktop */}
              <div className="ml-2 md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown - Conditionally rendered */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
      <CommandMenu open={isCommandMenuOpen} setOpen={setCommandMenuOpen} />
    </>
  );
};