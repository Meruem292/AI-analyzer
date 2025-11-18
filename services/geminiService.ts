
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function analyzeImage(base64ImageData: string, mimeType: string): Promise<string> {
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageData,
      },
    };

    const textPart = {
      text: "Analyze the content of this image in detail. Provide a descriptive analysis, identifying objects, settings, potential themes, and any notable visual elements."
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error analyzing image with Gemini API:", error);
    if (error instanceof Error) {
        return Promise.reject(new Error(`Failed to analyze image: ${error.message}`));
    }
    return Promise.reject(new Error("An unexpected error occurred while analyzing the image."));
  }
}

export async function generateApiUrl(prototypeCode: string): Promise<string> {
  const targetUrl = `${window.location.origin}${window.location.pathname}`;
  const prompt = `
    You are a code generation assistant. The user will provide a code snippet. 
    Your task is to find the Base64 string within it. After finding the Base64 string, you must URL-encode it. 
    Finally, construct a complete URL using the following template:

    ${targetUrl}#b64=[URL-encoded_Base64_string]

    Only return the final, complete URL and nothing else. Do not add any explanation, code fences, or extra text.

    User's code snippet:
    ---
    ${prototypeCode}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating API URL with Gemini API:", error);
     if (error instanceof Error) {
        return Promise.reject(new Error(`Failed to generate URL: ${error.message}`));
    }
    return Promise.reject(new Error("An unexpected error occurred while generating the URL."));
  }
}

export async function checkForTrashAndBottle(base64ImageData: string, mimeType: string): Promise<{ hasTrash: boolean; hasPlasticBottle: boolean; }> {
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageData,
      },
    };
    
    const textPart = {
      text: "Analyze this image. Does it contain any trash or litter? Does it contain a plastic bottle? Answer only in the requested JSON format."
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasTrash: {
              type: Type.BOOLEAN,
              description: 'Is there any trash or litter visible in the image?',
            },
            hasPlasticBottle: {
              type: Type.BOOLEAN,
              description: 'Is there a plastic bottle visible in the image?',
            },
          },
          required: ['hasTrash', 'hasPlasticBottle'],
        }
      }
    });
    
    const jsonString = response.text;
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Error checking for trash/bottle with Gemini API:", error);
    if (error instanceof Error) {
        return Promise.reject(new Error(`Failed to perform AI check: ${error.message}`));
    }
    return Promise.reject(new Error("An unexpected error occurred during the AI check."));
  }
}
