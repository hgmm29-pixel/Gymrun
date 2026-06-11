import { GoogleGenAI, Chat } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants.ts';

let chatSession: Chat | null = null;

export const initChatSession = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable is missing.");
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for more deterministic, strict responses
      },
    });
  } catch (error) {
    console.error("Failed to initialize Gemini Chat:", error);
    throw error;
  }
};

export const sendMessageToGemini = async (text: string, imageBase64?: string, mimeType?: string): Promise<string> => {
  if (!chatSession) {
    initChatSession();
  }

  if (!chatSession) {
    throw new Error("Chat session could not be initialized.");
  }

  try {
    let messagePayload: any = text;

    if (imageBase64 && mimeType) {
      // Remove the data URL prefix if present (e.g., "data:image/jpeg;base64,")
      const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      
      messagePayload = [
        { text: text || "Analiza esta imagen según las instrucciones." },
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
      ];
    }

    const response = await chatSession.sendMessage({ message: messagePayload });
    return response.text || "Sin respuesta del modelo.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw new Error("Error al comunicar con el entrenador AI.");
  }
};