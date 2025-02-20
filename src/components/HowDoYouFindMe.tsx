'use client';

import React, { useState, useEffect } from 'react';
import { SearchStreamer } from '@/components/SearchStreamer';
import { Globe, Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HowDoYouFindMe() {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect System Preference and User Preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userPreference = localStorage.getItem('theme');
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (userPreference === 'dark' || (!userPreference && systemPreference)) {
        document.documentElement.classList.add('dark');
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setDarkMode(false);
      }
    }
  }, []);

  // Toggle dark mode and force override system settings
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      localStorage.setItem('theme-mode-override', 'true'); // Mark override
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white dark:from-gray-800 dark:to-gray-700">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8" />
            <span className="text-2xl font-bold">HowYouFindMe</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Button variant="ghost" className="text-white dark:text-gray-200 hover:bg-white/20">
              About
            </Button>
            <Button variant="ghost" className="text-white dark:text-gray-200 hover:bg-white/20">
              Contact
            </Button>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="p-2 bg-white/10 rounded-md hover:bg-white/20">
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </nav>

        {/* Mobile Slide-down Menu */}
        <div
          className={`md:hidden flex flex-col items-center space-y-4 bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? 'max-h-40 py-4' : 'max-h-0 py-0'
          }`}
        >
          <Button variant="ghost" className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
            About
          </Button>
          <Button variant="ghost" className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
            Contact
          </Button>
        </div>
        {/* Hero Section */}
        <section className="py-10 px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Discover Your AI Presence</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find out how visible your company, brand, or product is across the web.
          </p>
        </section>
      </header>

      {/* Search Section */}
      <section className="py-10 flex-grow bg-gray-50 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-4">
          <SearchStreamer />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2025 HowYouFindMe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
