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

  // Calculate current step
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
          className="bg-white shadow-sm placeholder-gray-500 text-gray-900"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-purple-700 hover:bg-purple-800 text-white shadow-sm"
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
          <div
            className="absolute left-8 top-3 -translate-x-1/2 transition-all duration-500 bg-purple-600"
            style={{
              width: '3px',
              height: `${Math.min(currentStep, progressSteps.length - 1) * 55}px`,
              zIndex: 0,
              transformOrigin: 'top'
            }}
          />
          <div className="space-y-6">
            {progressSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="w-6 h-6 rounded-full flex items-center justify-center border-2"
                  style={{
                    backgroundColor: index < currentStep ? '#9333ea' : 'white',
                    borderColor: '#9333ea',
                    zIndex: 1,
                    position: 'relative'
                  }}>
                  {index < currentStep && <Check size={16} color="white" />}
                </div>
                <span className="ml-3"
                  style={{
                    fontWeight: index === currentStep ? '800' : '400',
                    color: '#1a1a1a'
                  }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Results Section */}
      <div className="mt-6 space-y-6">
        {/* Keyword Results */}
        {keywordData && (
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Industry Analysis</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800">Category</h3>
                <p className="mt-1 text-gray-700">{keywordData.category}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Keywords</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywordData.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm border border-purple-100"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {keywordData.competitors && (
                <div>
                  <h3 className="font-semibold text-gray-800">Main Competitors</h3>
                  <ul className="mt-2 space-y-1">
                    {keywordData.competitors.map((comp, i) => (
                      <li key={i} className="text-gray-700 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                        {comp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ranking Results */}
        {rankingData && (
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Market Position</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800">Ranking</h3>
                <p className="mt-1 text-gray-700">{rankingData.ranking_position}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Market Context</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="text-gray-600">Market Size</span>
                    <span className="font-medium text-gray-900">{rankingData.market_context.market_size}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="text-gray-600">Growth</span>
                    <span className="font-medium text-gray-900">{rankingData.market_context.growth_projections}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Top Competitors</h3>
                <div className="mt-2 space-y-2">
                  {rankingData.comparison_to_leaders.top_competitors.map((tc, i) => (
                    <div key={i} className="flex items-center justify-between bg-purple-50 p-3 rounded-md">
                      <span className="text-purple-900 font-medium">{tc.company}</span>
                      <div className="text-purple-700">
                        Rank {tc.rank} • {tc.market_share}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-gray-700 bg-gray-50 p-4 rounded-md italic">
                  {rankingData.comparison_to_leaders.summary}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}