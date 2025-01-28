'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Globe } from 'lucide-react';

interface RankingData {
    ranking_position: string;
    market_context: string;
    comparison_to_leaders: string;
}

interface KeywordData {
    category: string;
    competitors?: string[];
    keywords: string[];
}

interface TaskOutput {
    name: string;
    raw: string;
}

interface SearchResults {
    tasks_output: TaskOutput[];
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';

const HowDoYouFindMe = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResults | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/api/search-rank`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();
            console.log("API Response:", data); // Debugging

            setResults(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Extract tasks safely
    const rankingTask = results?.tasks_output?.find(task => task.name === "ranking_task");
    const keywordTask = results?.tasks_output?.find(task => task.name === "generate_keywords_task");

    let rankingData: RankingData | null = null;
    let keywordData: KeywordData | null = null;

    try {
        if (rankingTask?.raw) rankingData = JSON.parse(rankingTask.raw);
        if (keywordTask?.raw) keywordData = JSON.parse(keywordTask.raw);
    } catch (error) {
        console.error("Error parsing API response:", error);
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <nav className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Globe className="h-8 w-8" />
                            <span className="text-2xl font-bold">HowDoYouFindMe</span>
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
            </header>

            {/* Hero Section with Search */}
            <section className="bg-gradient-to-b from-purple-600 to-purple-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">Discover Your Online Presence</h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Find out how visible your company, brand, or product is across the web.
                    </p>

                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Enter company, brand, or product name..."
                                className="bg-white/10 text-white placeholder-white/60 border-white/20"
                            />
                            <Button type="submit" className="bg-white text-purple-600 hover:bg-white/90" disabled={loading}>
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4" />
                                )}
                                Search
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Results Section */}
            {results && (
                <section className="py-12 bg-gray-50 flex-grow">
                    <div className="container mx-auto px-4">
                        <div className="grid gap-8 max-w-4xl mx-auto">
                            
                            {/* Competitors Section */}
                            {keywordData?.competitors && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Competitors</h2>
                                        <ul className="list-disc pl-6 text-gray-700">
                                            {keywordData.competitors.map((competitor, index) => (
                                                <li key={index}>{competitor}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Keywords Section */}
                            {keywordData?.keywords && (
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Relevant Keywords</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {keywordData.keywords.map((keyword, index) => (
                                                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Rankings Section */}
                            {rankingData ? (
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Search Rankings</h2>
                                        <div className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
                                            <h3 className="font-semibold text-gray-800">{rankingData.ranking_position}</h3>
                                            <p className="text-sm text-gray-700">{rankingData.market_context}</p>
                                            <p className="text-sm text-gray-700">{rankingData.comparison_to_leaders}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <p className="text-gray-700">No ranking data available</p>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        &copy; 2025 HowDoYouFindMe. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HowDoYouFindMe;
