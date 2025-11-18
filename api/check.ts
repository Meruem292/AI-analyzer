// This is a Vercel Serverless Function, which will be available at the /api/check route.

import { getLatestPhotoUrl } from '../services/supabaseService';
import { imageUrlToBase64 } from '../utils/imageUtils';

// This function communicates directly with the Gemini REST API using fetch.
// This avoids using the @google/genai SDK, which caused dependency issues in the serverless environment.
async function checkForTrashAndBottleOnServer(base64ImageData: string, mimeType: string): Promise<{ hasTrash: boolean; hasPlasticBottle: boolean; }> {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    // This will cause a 500 error, which is appropriate for a missing server-side configuration.
    throw new Error("API_KEY is not configured on the server.");
  }
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [{
      parts: [
        { text: "Analyze this image. Does it contain any trash or litter? Does it contain a plastic bottle? Answer only in the requested JSON format." },
        { inline_data: { mime_type: mimeType, data: base64ImageData } }
      ]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          hasTrash: { type: "BOOLEAN", description: "Is there any trash or litter visible in the image?" },
          hasPlasticBottle: { type: "BOOLEAN", description: "Is there a plastic bottle visible in the image?" }
        },
        required: ["hasTrash", "hasPlasticBottle"]
      }
    }
  };

  const apiResponse = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!apiResponse.ok) {
    const errorData = await apiResponse.json().catch(() => ({})); // Avoid crashing if error response isn't JSON
    console.error("Gemini REST API Error:", errorData);
    throw new Error(`Gemini API request failed: ${errorData.error?.message || apiResponse.statusText}`);
  }

  const responseData = await apiResponse.json();
  const jsonString = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!jsonString) {
      console.error("Invalid response structure from Gemini API:", responseData);
      throw new Error("Failed to parse Gemini API response.");
  }

  return JSON.parse(jsonString);
}


// The Vercel build environment provides the correct types for req and res.
export default async function handler(req: any, res: any) {
  // Set CORS headers to allow requests from any origin, which is useful for devices like ESP32.
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Vercel may send an OPTIONS request for preflight checks.
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // This endpoint only supports GET requests.
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: `Method ${req.method} Not Allowed`,
    });
  }

  try {
    const photoUrl = await getLatestPhotoUrl();
    const { base64, mimeType } = await imageUrlToBase64(photoUrl);
    // Use the self-contained server-side function
    const analysis = await checkForTrashAndBottleOnServer(base64, mimeType);
    
    const responseData = {
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        photoUrl,
        analysis,
      },
    };
    
    // Set caching headers for Vercel's edge network.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(responseData);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown server error occurred.';
    // Log the full error object for better debugging in Vercel logs
    console.error("API Endpoint Full Error:", err);
    
    const errorResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: errorMessage,
    };
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(errorResponse);
  }
}
