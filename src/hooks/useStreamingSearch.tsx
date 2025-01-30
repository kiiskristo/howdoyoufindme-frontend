'use client';

import { useState, useCallback } from 'react';

// Types for SSE data
interface SSEMessage {
  type: string;             // e.g. "status", "task_complete", "complete", "error"
  message?: string;         // status or error messages
  task?: string;            // which task completed, e.g. "keywords"
  data?: any;               // the parsed JSON from your server for "task_complete"
}

// Optional: define your domain-specific data models:
interface MarketContext {
  market_size: string;
  growth_projections: string;
}

interface TopCompetitor {
  company: string;
  rank: number;
  market_share: string;
}

interface ComparisonToLeaders {
  top_competitors: TopCompetitor[];
  summary: string;
}

export interface RankingData {
  ranking_position: string;
  market_context: MarketContext;
  comparison_to_leaders: ComparisonToLeaders;
}

export interface KeywordData {
  category: string;
  competitors?: string[];
  keywords: string[];
}

/**
 * Custom hook to handle SSE from the /api/search-rank/stream endpoint
 */
export function useStreamingSearch() {
  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // States to store final data
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null);
  const [rankingData, setRankingData] = useState<RankingData | null>(null);

  /**
   * startSearch() - opens an SSE connection and listens for streaming messages
   */
  const startSearch = useCallback((query: string) => {
    setLoading(true);
    setErrorMessage(null);
    setStatusMessages([]);
    setKeywordData(null);
    setRankingData(null);

    // Construct your URL. Usually SSE is a GET endpoint:
    // Make sure FastAPI is also using GET for SSE (instead of POST).
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const url = `${apiUrl}/api/search-rank/stream?query=${encodeURIComponent(query)}`;

    // Open the EventSource connection
    const eventSource = new EventSource(url);

    // Handle incoming messages
    eventSource.onmessage = (event) => {
      if (!event.data) return;
      try {
        const parsed: SSEMessage = JSON.parse(event.data);

        switch (parsed.type) {
          case 'status': {
            // Append a new status message
            if (parsed.message) {
              setStatusMessages((prev) => [...prev, parsed.message!]);
            }
            break;
          }
          case 'task_complete': {
            // Identify which task completed & update the correct state
            if (parsed.task === 'keywords' && parsed.data) {
              setKeywordData(parsed.data as KeywordData);
            } else if (parsed.task === 'ranking' && parsed.data) {
              setRankingData(parsed.data as RankingData);
            }
            break;
          }
          case 'complete': {
            // Entire process is done
            if (parsed.message) {
              setStatusMessages((prev) => [...prev, parsed.message!]);
            }
            setLoading(false);
            eventSource.close();
            break;
          }
          case 'error': {
            // Server encountered an error
            setErrorMessage(parsed.message || 'Unknown error');
            setLoading(false);
            eventSource.close();
            break;
          }
          default: {
            // Unrecognized message type
            console.warn('Unknown SSE message:', parsed);
            break;
          }
        }
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
      }
    };

    // Handle SSE errors
    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      setErrorMessage('Stream connection error.');
      setLoading(false);
      // Close to avoid keeping a broken connection
      eventSource.close();
    };
  }, []);

  return {
    loading,
    errorMessage,
    statusMessages,
    keywordData,
    rankingData,
    startSearch,
  };
}
