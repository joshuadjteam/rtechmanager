
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getServerInsights = async (stats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these Linux server stats: 
      RAM: ${stats.ramUsed}/${stats.ramTotal} GB, 
      CPU: ${stats.cpuUsage}%, 
      HDD: ${stats.hddUsed}/${stats.hddTotal} TB. 
      Provide a brief 1-sentence health summary for rTechManager.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "System running stable. No immediate concerns detected.";
  }
};
