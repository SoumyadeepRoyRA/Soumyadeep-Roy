
import { GoogleGenAI, Type } from "@google/genai";
import { DataRecord, AnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeData = async (data: DataRecord[]): Promise<AnalysisResponse> => {
  const dataSnippet = JSON.stringify(data.slice(0, 50)); // Send a snippet to avoid token limits
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this dataset from our enterprise databases (SQL Server/MS Access). 
    Data snippet: ${dataSnippet}. 
    Provide a comprehensive analysis including a summary, key insights, and business recommendations.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          insights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['TREND', 'WARNING', 'OPPORTUNITY'] },
                confidence: { type: Type.NUMBER }
              },
              required: ['title', 'description', 'type', 'confidence']
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          suggestedCharts: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['summary', 'insights', 'recommendations', 'suggestedCharts']
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("AI analysis failed to produce valid structural data.");
  }
};
