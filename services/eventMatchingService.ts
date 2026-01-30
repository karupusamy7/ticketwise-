import { GoogleGenAI } from "@google/genai";
import { MOCK_MOVIES, MOCK_EVENTS } from '../constants';
import { Movie, Event } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface EventRecommendation {
    item: Movie | Event;
    explanation: string;
    matchScore: number;
}

export interface MatchResult {
    recommendations: EventRecommendation[];
    interpretedIntent: string;
    error?: string;
}

// Combine all events for matching
const ALL_EVENTS = [
    ...MOCK_MOVIES.map(m => ({
        ...m,
        category: 'movie',
        keywords: [...m.genre, 'movie', 'film', 'cinema', m.title.toLowerCase()]
    })),
    ...MOCK_EVENTS.map(e => ({
        ...e,
        category: e.type,
        keywords: [e.type, e.title.toLowerCase(), e.venue.toLowerCase()]
    }))
];

export const matchEventsWithAI = async (userQuery: string): Promise<MatchResult> => {
    if (!apiKey) {
        // Fallback: basic keyword matching
        return fallbackMatch(userQuery);
    }

    try {
        const eventList = ALL_EVENTS.map(e => ({
            id: e.id,
            title: e.title,
            category: e.category,
            description: e.description,
            type: 'type' in e ? e.type : 'movie'
        }));

        const prompt = `You are an event recommendation AI. The user is looking for something to do.

User's request: "${userQuery}"

Available events:
${JSON.stringify(eventList, null, 2)}

Analyze the user's intent and recommend 1-3 events that best match. Return JSON only:
{
  "interpretedIntent": "Brief description of what the user is looking for",
  "recommendations": [
    {
      "id": "event_id",
      "explanation": "2-3 sentence explanation of why this matches their request. Be specific and personal.",
      "matchScore": 0.95
    }
  ]
}

Focus on:
- Topic/interest alignment
- Mood/vibe matching
- Any time or social preferences mentioned
- Return fewer if not enough good matches`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const result = JSON.parse(response.text || '{}');

        // Map IDs back to full event objects
        const recommendations: EventRecommendation[] = (result.recommendations || [])
            .map((rec: any) => {
                const item = [...MOCK_MOVIES, ...MOCK_EVENTS].find(e => e.id === rec.id);
                if (!item) return null;
                return {
                    item,
                    explanation: rec.explanation,
                    matchScore: rec.matchScore
                };
            })
            .filter(Boolean)
            .slice(0, 3);

        return {
            recommendations,
            interpretedIntent: result.interpretedIntent || 'Finding events for you...'
        };

    } catch (error) {
        console.error("AI Matching Error:", error);
        return fallbackMatch(userQuery);
    }
};

// Fallback for when AI is unavailable
const fallbackMatch = (query: string): MatchResult => {
    const lowerQuery = query.toLowerCase();

    const scored = ALL_EVENTS.map(event => {
        let score = 0;
        const keywords = event.keywords || [];

        keywords.forEach(kw => {
            if (lowerQuery.includes(kw.toLowerCase())) score += 2;
        });

        if (lowerQuery.includes(event.title.toLowerCase())) score += 5;
        if (event.description && lowerQuery.split(' ').some(word =>
            event.description.toLowerCase().includes(word) && word.length > 3
        )) score += 1;

        return { event, score };
    })
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    if (scored.length === 0) {
        // Return top 3 popular events as fallback
        const popular = [...MOCK_MOVIES.slice(0, 2), MOCK_EVENTS[0]];
        return {
            recommendations: popular.map(item => ({
                item,
                explanation: "This is one of our most popular events right now!",
                matchScore: 0.5
            })),
            interpretedIntent: "Showing you our top picks"
        };
    }

    return {
        recommendations: scored.map(s => ({
            item: s.event as Movie | Event,
            explanation: `This matches what you're looking for based on your interests.`,
            matchScore: Math.min(s.score / 10, 1)
        })),
        interpretedIntent: `Looking for: ${query}`
    };
};
