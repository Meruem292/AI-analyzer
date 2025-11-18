import React, { useState, useEffect } from 'react';
import { getLatestPhotoUrl } from '../services/supabaseService';
import { checkForTrashAndBottle } from '../services/geminiService';
import { imageUrlToBase64 } from '../utils/imageUtils';

interface ApiResponse {
  status: 'loading' | 'success' | 'error';
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

const ApiCheckPage: React.FC = () => {
  const [response, setResponse] = useState<ApiResponse>({
    status: 'loading',
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    const runCheck = async () => {
      try {
        const photoUrl = await getLatestPhotoUrl();
        const { base64, mimeType } = await imageUrlToBase64(photoUrl);
        const analysis = await checkForTrashAndBottle(base64, mimeType);
        
        setResponse({
          status: 'success',
          timestamp: new Date().toISOString(),
          data: {
            photoUrl,
            analysis,
          },
        });
      } catch (err) {
        setResponse({
          status: 'error',
          timestamp: new Date().toISOString(),
          error: err instanceof Error ? err.message : 'An unknown error occurred.',
        });
      }
    };

    runCheck();
  }, []);

  return (
    <main className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 font-mono text-sm text-slate-300 whitespace-pre-wrap break-all">
      {JSON.stringify(response, null, 2)}
    </main>
  );
};

export default ApiCheckPage;