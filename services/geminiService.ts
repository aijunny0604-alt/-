import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client only if API key is present
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const sendMessageToGemini = async (message: string, history: string[]): Promise<string> => {
  if (!ai) {
    return "데모 모드: API 키가 설정되지 않았습니다. (process.env.API_KEY 설정을 확인해주세요)";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // Construct a context-aware prompt
    const systemInstruction = `
      You are the AI digital avatar for a Creative Developer's portfolio.
      Your name is "Portfolio Bot".
      Tone: Professional, minimalist, slightly witty, yet helpful.
      Language: **Always respond in Korean.**
      
      User's Context: The user is browsing a portfolio website inspired by high-end French interactive design.
      
      Your knowledge base:
      - The developer is based in Seoul.
      - Specializes in React, TypeScript, Tailwind, and Motion Design.
      - Values minimalism, clean code, and accessibility.
      - Projects include: Ethereal Commerce, Lumina Branding, Kinetic Type, Orbit Dashboard.
      
      Instructions:
      - Answer questions about the developer's skills, work, or availability.
      - Keep answers concise (under 3 sentences usually) to fit the chat widget.
      - If asked about contact, suggest emailing: hello@portfolio.dev
    `;

    // We simple append history for context in a single prompt for stateless simplicity in this demo,
    // or use the Chat API. Let's use the Chat API for better context management.
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    // In a real app, we would persist the chat history object. 
    // Here we just send the new message as a fresh turn for simplicity or basic continuity.
    // For a robust implementation, we'd map the 'history' string array to Content objects.
    // However, for this specific stateless function signature, let's just generate content.
    
    const result = await ai.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: `Previous Context: ${history.join('\n')}` }] },
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return result.text || "생각 중입니다...";
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "죄송합니다. 현재 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.";
  }
};