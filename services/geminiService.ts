import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the Gemini AI client
// Note: In a real production app, you might proxy this through a backend to hide the key,
// but for this demo, we use it directly as per instructions.
const ai = new GoogleGenAI({ apiKey });

export const getGeminiResponse = async (userMessage: string): Promise<string> => {
  if (!apiKey) {
    return "I'm sorry, but I can't connect to the AI service right now (API Key missing). Please try browsing manually.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are "TicketBot", a helpful and enthusiastic movie and event concierge for the TicketWise platform. 
        Your goal is to help users decide what to watch or attend.
        
        Style: Friendly, concise, and using emojis occasionally.
        
        Context:
        - The platform sells tickets for Movies, Concerts, Sports, and Theater.
        - Popular movies right now: Cyberpunk Horizons (Sci-Fi), The Last Symphony (Drama), Galactic Racers (Action).
        - Popular events: Neon Music Festival, Championship Finals.
        
        If a user asks for recommendations, ask them about their mood or preferred genre.
        If they ask about a specific movie from the list above, give a short exciting teaser.
        Keep responses under 50 words unless asked for more detail.`,
      }
    });

    return response.text || "I'm having trouble thinking of a response right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having a bit of a connection issue. Can you ask that again?";
  }
};
