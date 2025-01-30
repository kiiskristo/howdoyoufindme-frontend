'use client';

import React, { useState } from 'react';
import { useStreamingSearch } from '@/hooks/useStreamingSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

export function SearchStreamer() {
  const [query, setQuery] = useState('');
  const {
    loading,
    errorMessage,
    statusMessages,
    keywordData,
    rankingData,
    startSearch,
  } = useStreamingSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startSearch(query);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your company or website name..."
          className="bg-white/90 placeholder-gray-500 text-gray-900"
        />
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-purple-700 hover:bg-purple-800 text-white"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Analyze
        </Button>
      </form>

      {/* Results Section */}
      <div className="text-gray-900">
        {/* Status Messages */}
        <div className="space-y-1">
          {statusMessages.map((msg, idx) => (
            <p key={idx} className="text-gray-700">
              {msg}
            </p>
          ))}
          {errorMessage && (
            <p className="text-red-600 bg-red-50 p-4 rounded">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Keyword Results */}
        {keywordData && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow">
            <h2 className="font-bold text-xl mb-4 text-gray-900">Industry Analysis</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Category</h3>
                <p className="text-gray-700">{keywordData.category}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {keywordData.keywords.map((kw, i) => (
                    <span 
                      key={i} 
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {keywordData.competitors && (
                <div>
                  <h3 className="font-semibold text-gray-800">Main Competitors</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {keywordData.competitors.map((comp, i) => (
                      <li key={i}>{comp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ranking Results */}
        {rankingData && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow">
            <h2 className="font-bold text-xl mb-4 text-gray-900">Market Position</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Ranking</h3>
                <p className="text-gray-700">{rankingData.ranking_position}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Market Context</h3>
                <p className="text-gray-700">Market Size: {rankingData.market_context.market_size}</p>
                <p className="text-gray-700">Growth: {rankingData.market_context.growth_projections}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Top Competitors</h3>
                <ul className="space-y-2">
                  {rankingData.comparison_to_leaders.top_competitors.map((tc, i) => (
                    <li key={i} className="text-gray-700">
                      <strong>{tc.company}</strong> - Rank {tc.rank}, {tc.market_share}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-gray-700">{rankingData.comparison_to_leaders.summary}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}