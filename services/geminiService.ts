
import { GoogleGenAI } from "@google/genai";

export const getSearchResponse = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No response generated.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return { text: "Search failed. Ensure API key is valid.", sources: [] };
  }
};

export const getServerInsights = async (stats: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these Linux server stats: 
      RAM: ${stats.ramUsed.toFixed(1)}/${stats.ramTotal.toFixed(1)} GB, 
      CPU: ${stats.cpuUsage.toFixed(1)}%, 
      HDD: ${stats.hddUsed.toFixed(1)}/${stats.hddTotal.toFixed(1)} GB. 
      Provide a brief 1-sentence health summary for rTechManager.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "System running stable. No immediate concerns detected.";
  }
};
