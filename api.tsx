import { getLatestPhotoUrl } from './services/supabaseService';
import { checkForTrashAndBottle } from './services/geminiService';
import { imageUrlToBase64 } from './utils/imageUtils';

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
    document.body.textContent = JSON.stringify(response, null, 2);
  }
};

runCheck();
