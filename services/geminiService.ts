import { GoogleGenAI, Type } from "@google/genai";
import { UserSelection, RoomType, Artist, LayoutSuggestion, FurnitureItem } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure your API_KEY to use AI features.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateRoomImage = async (roomType: RoomType, selections: UserSelection, inspiration?: Artist | null): Promise<string> => {
  const ai = getAI();
  // Construct a vivid prompt from the user selections
  const attributes = Object.values(selections).join(', ');
  
  let prompt = `Photorealistic, high-end interior design photography of a ${roomType}.`;
  
  if (inspiration) {
    prompt += ` The design is heavily inspired by the artistic style of ${inspiration.name} (${inspiration.period}). 
    Key stylistic elements to include: ${inspiration.styleDescription}. 
    Imagine if ${inspiration.name} designed this ${roomType} today.`;
  }
  
  prompt += ` The design includes specific features selected by the client: ${attributes}. 
  The overall atmosphere should be modern, corporate yet homely, 8k resolution, architectural digest style, cinematic lighting.
  Ensure the perspective shows a wide angle view of the room highlighting the selected features and the artistic influence.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
         // flash-image doesn't support aspect ratio in config typically via generateContent, 
         // but the prompt can guide it. We rely on the model default or text guidance.
      }
    });

    // Check for inline data (the image)
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data returned from Gemini.");

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};

export const generateDesignSummary = async (roomType: RoomType, selections: UserSelection, inspiration?: Artist | null): Promise<string> => {
  const ai = getAI();
  const attributes = Object.values(selections).join(', ');
  
  let prompt = `Act as a senior interior designer at Pietra Plume. 
  Write a short, professional, and alluring description (max 80 words) of the ${roomType} design based on these choices: ${attributes}.`;
  
  if (inspiration) {
    prompt += ` Mention that this design is inspired by the legendary style of ${inspiration.name}, incorporating elements like ${inspiration.styleDescription}.`;
  }
  
  prompt += ` Emphasize the 'Art of Possible' and how this design fits a modern lifestyle.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Experience the perfect blend of style and function.";
  } catch (error) {
    console.error("Gemini Text Generation Error:", error);
    throw error;
  }
};

export const generateLayoutSuggestion = async (
  roomType: RoomType, 
  width: number, 
  depth: number, 
  items: FurnitureItem[],
  colorPalette: string
): Promise<LayoutSuggestion> => {
  const ai = getAI();
  const itemNames = items.map(i => i.name).join(', ');
  
  const prompt = `
    You are an expert architect and interior planner. 
    I have a ${roomType} with dimensions ${width}ft x ${depth}ft.
    The color palette is ${colorPalette}.
    
    I need to place the following items: ${itemNames}.
    
    Determine the optimal 2D position for these items.
    Items should be arranged logically (e.g., bed against wall, TV opposite sofa, fridge accessible).
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            x: { type: Type.NUMBER, description: "Percentage position (0-100) of x-axis" },
            y: { type: Type.NUMBER, description: "Percentage position (0-100) of y-axis" },
            rotation: { type: Type.NUMBER, description: "Rotation in degrees (0, 90, 180, 270)" }
          },
          required: ["name", "x", "y", "rotation"]
        }
      },
      reasoning: { type: Type.STRING }
    },
    required: ["items", "reasoning"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("No text returned");
    
    return JSON.parse(text) as LayoutSuggestion;
  } catch (error) {
    console.error("Gemini Layout Generation Error:", error);
    throw error;
  }
};

export const generateVeoVideo = async (
  imageBase64: string, 
  prompt: string, 
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string> => {
    // Check for API Key selection (Required for Veo)
    const win = window as any;
    if (win.aistudio) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await win.aistudio.openSelectKey();
        }
    }
    
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Please set the API_KEY environment variable.");
    }

    // MANDATORY: Create fresh instance right before call as per guidelines
    const veoAi = new GoogleGenAI({ apiKey });

    // Extract mimeType and clean base64 data
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : 'image/png';
    const cleanData = matches ? matches[2] : imageBase64;

    let operation = await veoAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || "Cinematic camera movement, high quality, photorealistic interior design tour.",
      image: {
        imageBytes: cleanData,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await veoAi.operations.getVideosOperation({operation: operation});
    }

    if (operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
        throw new Error("No video URI returned from Veo.");
    }

    const videoResponse = await fetch(`${videoUri}&key=${apiKey}`);
    if (!videoResponse.ok) {
        throw new Error("Failed to download video content.");
    }
    
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: `You are the "Pietra Plume AI Concierge", a sophisticated and helpful interior design consultant for Pietra Plume.
        
        Key Business Facts you MUST know and use in answers:
        1. We use an 'Agile Methodology' adapted from software development to deliver renovations in exactly 15 days.
        2. We offer a 'Paid Family Holiday' (to Bali, Maldives, or Dubai) for the client's family during the 15-day execution phase so they escape the dust and noise.
        3. We are premium, efficient, and transparent.
        
        Your Tone: Professional, warm, knowledgeable, concise (keep answers under 80 words if possible).
        
        Capabilities:
        - Advise on color palettes (e.g., matching a grey sofa).
        - Explain the Agile process (Sprints, Backlog, Definition of Done).
        - Discuss our tools (Design Studio, Video Generator, Smart Planner).
        
        If asked to book a consultation, guide them to click the 'Consult' button in the navbar.
        `
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I apologize, I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};