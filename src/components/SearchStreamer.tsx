'use client';

import React, { useState } from 'react';
import { useStreamingSearch } from '@/hooks/useStreamingSearch'; // adjust path
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
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query..."
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </Button>
      </form>

      {/* Status Messages */}
      <div className="space-y-1">
        {statusMessages.map((msg, idx) => (
          <p key={idx} className="text-blue-600">
            {msg}
          </p>
        ))}
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      </div>

      {/* Keyword Results */}
      {keywordData && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="font-bold text-xl mb-2">Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {keywordData.keywords.map((kw, i) => (
              <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {kw}
              </span>
            ))}
          </div>

          {keywordData.competitors && (
            <>
              <h3 className="font-bold text-lg mt-4">Competitors</h3>
              <ul className="list-disc list-inside">
                {keywordData.competitors.map((comp, i) => (
                  <li key={i}>{comp}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Ranking Results */}
      {rankingData && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="font-bold text-xl mb-2">Ranking Position</h2>
          <p>{rankingData.ranking_position}</p>

          <h3 className="font-bold text-lg mt-4">Market Context</h3>
          <p>{rankingData.market_context.market_size}</p>
          <p><strong>Growth Projections:</strong> {rankingData.market_context.growth_projections}</p>

          <h3 className="font-bold text-lg mt-4">Comparison to Leaders</h3>
          <ul className="list-disc list-inside">
            {rankingData.comparison_to_leaders.top_competitors.map((tc, i) => (
              <li key={i}>
                <strong>{tc.company}</strong> (Rank {tc.rank}): {tc.market_share}
              </li>
            ))}
          </ul>
          <p className="mt-2">{rankingData.comparison_to_leaders.summary}</p>
        </div>
      )}
    </div>
  );
}
