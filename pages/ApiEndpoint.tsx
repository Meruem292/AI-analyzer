import React, { useEffect } from 'react';
import { getLatestPhotoUrl } from '../services/supabaseService';
import { checkForTrashAndBottle } from '../services/geminiService';
import { imageUrlToBase64 } from '../utils/imageUtils';

interface ApiResponse {
  status: 'success' | 'error';
  timestamp: string;
  data?: {
    photoUrl: string;
    analysis: {
      hasTrash: boolean;
      hasPlasticBottle: boolean;
    };
  };
  error?: string;
}

const ApiEndpoint: React.FC = () => {
  useEffect(() => {
    const runCheck = async () => {
      let response: ApiResponse;
      try {
        const photoUrl = await getLatestPhotoUrl();
        const { base64, mimeType } = await imageUrlToBase64(photoUrl);
        const analysis = await checkForTrashAndBottle(base64, mimeType);
        
        response = {
          status: 'success',
          timestamp: new Date().toISOString(),
          data: {
            photoUrl,
            analysis,
          },
        };
      } catch (err) {
        response = {
          status: 'error',
          timestamp: new Date().toISOString(),
          error: err instanceof Error ? err.message : 'An unknown error occurred.',
        };
      }

      // Overwrite the document content with the JSON response
      if (document.body) {
        document.body.innerHTML = ''; // Clear the body
        document.body.style.fontFamily = 'monospace';
        document.body.style.whiteSpace = 'pre';
        document.body.style.wordWrap = 'break-word';
        document.body.style.backgroundColor = '#0f172a'; // bg-slate-900
        document.body.style.color = '#cbd5e1'; // text-slate-300
        document.body.style.padding = '1rem';
        document.body.style.margin = '0';
        document.body.textContent = JSON.stringify(response, null, 2);
      }
    };

    runCheck();
  }, []);

  return null; // This component doesn't render anything itself
};

export default ApiEndpoint;
