'use client';

import React, { useState } from 'react';
import { useStreamingSearch } from '@/hooks/useStreamingSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Check } from 'lucide-react';

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

  // Calculate what step we're on
  const currentStep = loading ? 
    (rankingData ? 3 : keywordData ? 2 : 1) : 
    (rankingData ? 4 : keywordData ? 2 : 0);

  const progressSteps = [
    "Starting analysis",
    "Analyzing industry and competitors",
    "Researching market position",
    "Analysis complete"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
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

      {/* Progress Section */}
      {(loading || statusMessages.length > 0) && (
        <div className="mt-8 mb-8 relative px-5" style={{ fontFamily: 'Archivo, sans-serif', fontSize: '20px' }}>
          {/* Vertical Progress Line */}
          <div 
            className="absolute left-8 top-3 -translate-x-1/2 bg-purple-600" 
            style={{ 
              width: '3px', 
              height: `${(progressSteps.length - 1) * 28}px`,
              zIndex: 0 
            }} 
          />
          
          {/* Steps */}
          <div className="space-y-6">
            {progressSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center border-2"
                  style={{ 
                    backgroundColor: index < currentStep ? '#9333ea' : 'white',
                    borderColor: '#9333ea',
                    zIndex: 1,
                    position: 'relative'
                  }}
                >
                  {index < currentStep && <Check size={16} color="white" />}
                </div>
                <span 
                  className="ml-3"
                  style={{ 
                    fontWeight: index === currentStep ? '800' : '400',
                    color: '#1a1a1a'
                  }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-600 mt-4">
          {errorMessage}
        </p>
      )}

      {/* Results Section */}
      <div className="mt-6 text-gray-900">
        {/* Keyword Results */}
        {keywordData && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">Industry Analysis</h2>
              <p className="mt-2">{keywordData.category}</p>
              
              <h3 className="font-semibold mt-4">Keywords</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {keywordData.keywords.map((kw, i) => (
                  <span key={i} className="text-purple-700">#{kw}</span>
                ))}
              </div>

              <h3 className="font-semibold mt-4">Main Competitors</h3>
              <ul className="list-disc list-inside mt-2">
                {keywordData.competitors?.map((comp, i) => (
                  <li key={i}>{comp}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Ranking Results */}
        {rankingData && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold">Market Position</h2>
            <p>{rankingData.ranking_position}</p>

            <div>
              <h3 className="font-semibold">Market Context</h3>
              <p>Market Size: {rankingData.market_context.market_size}</p>
              <p>Growth: {rankingData.market_context.growth_projections}</p>
            </div>

            <div>
              <h3 className="font-semibold">Top Competitors</h3>
              <ul className="space-y-2">
                {rankingData.comparison_to_leaders.top_competitors.map((tc, i) => (
                  <li key={i}>
                    {tc.company} - Rank {tc.rank}, {tc.market_share}
                  </li>
                ))}
              </ul>
              <p className="mt-2">{rankingData.comparison_to_leaders.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}