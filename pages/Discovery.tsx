import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, MapPin, Calendar, Star, TrendingUp } from 'lucide-react';
import { matchEventsWithAI, EventRecommendation, MatchResult } from '../services/eventMatchingService';
import { Movie, Event } from '../types';

const EXAMPLE_PROMPTS = [
    "Something fun for a date night this weekend",
    "I want an adrenaline rush - action or sports",
    "Relaxing evening with good music",
    "A movie that will make me think"
];

const Discovery = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MatchResult | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setHasSearched(true);

        try {
            const matchResult = await matchEventsWithAI(searchQuery);
            setResult(matchResult);
        } catch (error) {
            console.error('Search error:', error);
            setResult({
                recommendations: [],
                interpretedIntent: 'Something went wrong',
                error: 'Unable to find events. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(query);
    };

    const handleExampleClick = (prompt: string) => {
        setQuery(prompt);
        handleSearch(prompt);
    };

    const isMovie = (item: Movie | Event): item is Movie => 'posterUrl' in item;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative py-20 px-4 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-dark-bg to-purple-900/20" />
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-500/30 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

                <div className="relative max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/30 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-brand-400" />
                        <span className="text-brand-400 text-sm font-medium">AI-Powered Discovery</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        What are you in the mood for?
                    </h1>

                    <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
                        Tell us what you're looking for in plain English. We'll find the perfect event for you.
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g., Something exciting for the weekend..."
                                className="w-full bg-dark-card/80 backdrop-blur-sm border-2 border-slate-700 hover:border-slate-600 focus:border-brand-500 rounded-2xl py-5 pl-14 pr-32 text-white text-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder-slate-500"
                            />
                            <button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Find <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Example Prompts */}
                    {!hasSearched && (
                        <div className="flex flex-wrap justify-center gap-3">
                            {EXAMPLE_PROMPTS.map((prompt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleExampleClick(prompt)}
                                    className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 rounded-full text-sm text-slate-400 hover:text-white transition-all"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            {hasSearched && (
                <div className="max-w-5xl mx-auto px-4 pb-20">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-6" />
                            <p className="text-xl text-slate-400">Finding the perfect events for you...</p>
                        </div>
                    ) : result?.error ? (
                        <div className="text-center py-16 bg-dark-card rounded-2xl border border-slate-700">
                            <p className="text-red-400 mb-4">{result.error}</p>
                            <button
                                onClick={() => { setHasSearched(false); setResult(null); }}
                                className="text-brand-400 hover:text-brand-300"
                            >
                                Try again
                            </button>
                        </div>
                    ) : result && result.recommendations.length > 0 ? (
                        <>
                            {/* Intent Display */}
                            <div className="text-center mb-10">
                                <p className="text-slate-400 mb-2">We understood you're looking for:</p>
                                <p className="text-xl text-white font-medium">{result.interpretedIntent}</p>
                            </div>

                            {/* Recommendations */}
                            <div className="space-y-6">
                                {result.recommendations.map((rec, index) => (
                                    <RecommendationCard key={rec.item.id} rec={rec} index={index} isMovie={isMovie} />
                                ))}
                            </div>

                            {/* Search Again */}
                            <div className="text-center mt-12">
                                <button
                                    onClick={() => { setHasSearched(false); setResult(null); setQuery(''); }}
                                    className="text-brand-400 hover:text-brand-300 font-medium"
                                >
                                    ← Search for something else
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 bg-dark-card rounded-2xl border border-slate-700">
                            <p className="text-slate-400 mb-4">No events matched your request.</p>
                            <button
                                onClick={() => { setHasSearched(false); setResult(null); }}
                                className="text-brand-400 hover:text-brand-300"
                            >
                                Try a different search
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

interface RecommendationCardProps {
    rec: EventRecommendation;
    index: number;
    isMovie: (item: Movie | Event) => item is Movie;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ rec, index, isMovie }) => {
    const item = rec.item;
    const movie = isMovie(item);
    const linkPath = movie ? `/movie/${item.id}` : `/event/${item.id}`;

    return (
        <Link
            to={linkPath}
            className="group block bg-dark-card border border-slate-700 hover:border-brand-500/50 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:shadow-brand-500/10"
        >
            <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                    <img
                        src={movie ? item.posterUrl : (item as Event).imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {index === 0 && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Top Match
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-brand-400 transition-colors">
                                {item.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                {movie ? (
                                    <>
                                        <span>{(item as Movie).genre.join(', ')}</span>
                                        <span>•</span>
                                        <span>{(item as Movie).duration}</span>
                                        <span className="flex items-center gap-1 text-yellow-400">
                                            <Star className="w-4 h-4 fill-current" /> {(item as Movie).rating}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" /> {(item as Event).venue}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" /> {(item as Event).date}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-2 text-brand-400 group-hover:translate-x-1 transition-transform">
                            Book Now <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>

                    {/* AI Explanation */}
                    <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-4 mt-4">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                            <p className="text-slate-300 text-sm leading-relaxed">{rec.explanation}</p>
                        </div>
                    </div>

                    {/* Match Score */}
                    <div className="flex items-center gap-2 mt-4">
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all"
                                style={{ width: `${rec.matchScore * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-slate-500">{Math.round(rec.matchScore * 100)}% match</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Discovery;
