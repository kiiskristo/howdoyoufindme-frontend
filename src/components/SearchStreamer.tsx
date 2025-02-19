import React, { useState, useEffect } from 'react';
import { useStreamingSearch } from '@/hooks/useStreamingSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Check } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

export function SearchStreamer() {
  const [query, setQuery] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    loading,
    errorMessage,
    statusMessages,
    keywordData,
    rankingData,
    startSearch,
  } = useStreamingSearch();

  // Check for query parameter on component mount
  useEffect(() => {
    const queryParam = searchParams.get('query');
    if (queryParam) {
      setQuery(queryParam);
      startSearch(queryParam);
    }
  }, [searchParams, startSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Update URL with the search query
      router.push(`/?query=${encodeURIComponent(query.trim())}`);
      startSearch(query);
    }
  };

  const getCurrentStep = () => {
    if (!loading && !statusMessages.length) return 0;
    if (!loading && rankingData) return 4;

    const isAnalyzing = statusMessages.some(msg => msg.includes('Analyzing'));
    const isRanking = statusMessages.some(msg => msg.includes('Determining ranking'));

    if (isRanking) return 3;
    if (isAnalyzing || keywordData) return 2;
    return 1;
  };

  const currentStep = getCurrentStep();

  const progressSteps = [
    "Starting analysis",
    "Analyzing industry and competitors",
    "Determining market position",
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
          className="bg-white dark:bg-gray-800 shadow-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-200"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-purple-700 hover:bg-purple-800 text-white shadow-sm"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
          Analyze
        </Button>
      </form>

      {/* Progress Section */}
      {(loading || statusMessages.length > 0) && (
        <div className="mt-8 mb-8 relative px-5" style={{ fontFamily: 'Archivo, sans-serif', fontSize: '18px' }}>
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
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${index < currentStep
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white'
                    }`}
                    style={{ zIndex: 1 }}
                >
                  {index < currentStep && <Check size={16} />}
                </div>
                <span
                  className={`ml-3 ${index === currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}
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
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg text-red-600 dark:text-red-200">
          {errorMessage}
        </div>
      )}

      {/* Results Section */}
      <div className="mt-6 space-y-6">
        {/* Keyword Results */}
        {keywordData && (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Industry Analysis</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-300">Category</h3>
                <p className="mt-1 text-gray-700 dark:text-gray-400">{keywordData.category}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-300">Keywords</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywordData.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-100 dark:border-purple-700"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {keywordData.competitors && (
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-300">Main Competitors</h3>
                  <ul className="mt-2 space-y-1">
                    {keywordData.competitors.map((comp, i) => (
                      <li key={i} className="text-gray-700 dark:text-gray-400 flex items-center">
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
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Market Position</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-300">Ranking</h3>
                <p className="mt-1 text-gray-700 dark:text-gray-400">{rankingData.ranking_position}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-300">Market Context</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                    <span className="text-gray-600 dark:text-gray-300">Market Size</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-right">{rankingData.market_context.market_size}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                    <span className="text-gray-600 dark:text-gray-300">Growth</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-right">{rankingData.market_context.growth_projections}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-300">Top Competitors</h3>
                <div className="mt-2 space-y-2">
                  {rankingData.comparison_to_leaders.top_competitors.map((tc, i) => (
                    <div key={i} className="flex items-center justify-between bg-purple-50 dark:bg-purple-900 p-3 rounded-md">
                      <span className="text-purple-900 dark:text-purple-200 font-medium">{tc.company}</span>
                      <div className="text-purple-700 dark:text-purple-300">
                        Rank {tc.rank} • {tc.market_share}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-gray-800 dark:text-gray-300 bg-gray-50 p-4 bg-gray-50 dark:bg-gray-900 rounded-md italic">
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