'use client';

import React from 'react';
import { SearchStreamer } from '@/components/SearchStreamer';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HowDoYouFindMe() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <nav className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8" />
              <span className="text-2xl font-bold">HowYouFindMe</span>
            </div>
            <div className="space-x-4">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                About
              </Button>
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                Contact
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section with Search */}
        <div className="py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Discover Your Online Presence</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find out how visible your company, brand, or product is across the web.
          </p>
          
          
        </div>
      </header>

      {/* Results Section */}
      <section className="py-10 flex-grow bg-gray-50">
        {/* Move SearchStreamer into hero section */}
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