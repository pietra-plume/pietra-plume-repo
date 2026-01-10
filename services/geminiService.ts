import { GoogleGenAI, Type } from "@google/genai";
import { DesignProfile, UserSelection, Artist, PlannerItem } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const getDesignOracleConsultation = async (prompt: string): Promise<DesignProfile> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following design request and provide a professional architectural profile based on the Pietra & Plume methodology (balancing "Pietra" - the solid, heavy, historical, and "Plume" - the light, airy, modern). 

    Include a "sustainabilityScore" reflecting how eco-conscious the suggested materials and design would be (0-100), and a "lightingType" that best fits the atmospheric mood.

    Request: "${prompt}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          archetype: { type: Type.STRING },
          pietraRatio: { type: Type.NUMBER, description: "Degree of solid/stone elements (0-100)" },
          plumeRatio: { type: Type.NUMBER, description: "Degree of light/airy elements (0-100)" },
          palette: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Hex codes for a sophisticated color palette"
          },
          materials: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Suggested materials like 'Carrara Marble', 'Smoked Glass', etc."
          },
          philosophy: { type: Type.STRING, description: "A poetic 2-sentence description of the design intent." },
          sustainabilityScore: { type: Type.NUMBER, description: "A score from 0 to 100 representing environmental impact awareness." },
          lightingType: { type: Type.STRING, description: "The primary lighting approach, e.g., 'Diffused Natural', 'Dramatic Chiaroscuro', 'Ethereal Ambient'." }
        },
        required: ["archetype", "pietraRatio", "plumeRatio", "palette", "materials", "philosophy", "sustainabilityScore", "lightingType"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateDesignMoodboard = async (profile: DesignProfile): Promise<string | null> => {
  const ai = getAIClient();
  const prompt = `A professional architectural mood board for a design concept titled "${profile.archetype}". 
    The composition should feature high-end textures including ${profile.materials.join(', ')}. 
    The color palette uses ${profile.palette.join(', ')}. 
    The aesthetic is a balance of heavy, grounding stone (Pietra) and light, ethereal glass or air (Plume). 
    Primary lighting: ${profile.lightingType}.
    Luxury, minimal, photorealistic architecture, soft natural lighting.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  return null;
};

export const generateRoomImage = async (
  roomType: string,
  selections: UserSelection,
  artist: Artist | null
): Promise<string | null> => {
  const ai = getAIClient();
  let prompt = `Photorealistic architectural interior design of a ${roomType}. `;
  
  if (selections) {
    Object.entries(selections).forEach(([category, value]) => {
      prompt += `${category}: ${value}. `;
    });
  }

  if (artist) {
    prompt += `The design should be inspired by the artistic style of ${artist.name} (${artist.styleDescription}). `;
  }

  prompt += "High end, luxury, cinematic lighting, 8k resolution, interior design magazine style.";

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateDesignSummary = async (
  roomType: string,
  selections: UserSelection,
  artist: Artist | null
): Promise<string> => {
  const ai = getAIClient();
  let prompt = `Write a sophisticated, 2-sentence architectural description for a ${roomType} design. 
  Features: ${JSON.stringify(selections)}. `;
  
  if (artist) {
    prompt += `Style inspiration: ${artist.name}. `;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text || "A bespoke design concept.";
};

export const generateLayoutSuggestion = async (
  roomType: string,
  width: number,
  depth: number,
  items: PlannerItem[],
  palette: string
): Promise<{ reasoning: string; items: { name: string; x: number; y: number; rotation: number }[] }> => {
  const ai = getAIClient();
  
  const itemsList = items.map(i => `${i.name} (${i.width}x${i.depth})`).join(", ");
  const prompt = `I have a ${roomType} with dimensions ${width}ft x ${depth}ft. 
  I have these furniture items to place: ${itemsList}. 
  Suggest an optimal layout. Return coordinates x, y as percentages (0-100) of the room dimensions, and rotation (0, 90, 180, 270).
  Consider flow, functionality, and the aesthetic: ${palette}.
  Also provide a short reasoning (max 20 words).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reasoning: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                rotation: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    }
  });
  
  return JSON.parse(response.text);
};

export const getChatResponse = async (history: { role: string, parts: { text: string }[] }[], message: string): Promise<string> => {
    const ai = getAIClient();
    // Filter history to ensure role is either 'user' or 'model'
    const validHistory = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: h.parts
    }));
    
    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: validHistory as any
    });
    const result = await chat.sendMessage({ message });
    return result.text;
};

export const generateVeoVideo = async (image: string, prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> => {
    const ai = getAIClient();
    
    // Convert base64 data URL to raw base64 string
    // Format: data:image/png;base64,....
    const base64Data = image.split(',')[1];
    const mimeType = image.substring(image.indexOf(':') + 1, image.indexOf(';'));

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
            imageBytes: base64Data,
            mimeType: mimeType,
        },
        config: {
            numberOfVideos: 1,
            aspectRatio: aspectRatio,
            resolution: '720p'
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation failed");
    
    // Append API key for frontend consumption as per docs
    return `${videoUri}&key=${process.env.API_KEY}`;
};
