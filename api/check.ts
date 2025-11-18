// This is a Vercel Serverless Function, which will be available at the /api/check route.

import { getLatestPhotoUrl } from '../services/supabaseService';
import { checkForTrashAndBottle } from '../services/geminiService';
import { imageUrlToBase64 } from '../utils/imageUtils';

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
    const analysis = await checkForTrashAndBottle(base64, mimeType);
    
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
    console.error("API Endpoint Error:", errorMessage);
    
    const errorResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: errorMessage,
    };
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(errorResponse);
  }
}
