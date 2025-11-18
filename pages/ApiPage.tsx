import React, { useState, useEffect, useCallback } from 'react';
import { ImagePreview } from '../components/ImagePreview';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { detectMimeType } from '../utils/imageUtils';
import { CodeIcon } from '../components/icons/CodeIcon';
import { addToHistory } from '../utils/historyUtils';

const ApiPage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processHash = useCallback(() => {
    setImageUrl(null);
    setError(null);
    
    if (window.location.hash.length < 2) {
      return; // No hash or just '#', so show instructions
    }

    try {
      const searchParams = new URLSearchParams(window.location.hash.substring(1));
      const base64 = searchParams.get('b64');

      if (!base64 || base64.trim() === '') {
        // No b64 param, show instructions
        return;
      }
      
      const mimeType = detectMimeType(base64);
      if (mimeType) {
        const fullImageUrl = `data:${mimeType};base64,${base64}`;
        setImageUrl(fullImageUrl);
        addToHistory(fullImageUrl);
      } else {
        setError("Could not detect image type from the Base64 string in the URL.");
      }
    } catch (e) {
      console.error("Error parsing URL hash:", e);
      setError("Failed to parse the Base64 data from the URL. Please check the format.");
    }
  }, []);

  useEffect(() => {
    processHash();
    window.addEventListener('hashchange', processHash);
    return () => {
      window.removeEventListener('hashchange', processHash);
    };
  }, [processHash]);

  const handleImageError = useCallback(() => {
    setError("The Base64 string from the URL is invalid or represents an unsupported image format.");
    setImageUrl(null);
  }, []);

  const instructionBlock = (
    <div className="bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl p-6 flex flex-col items-start transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <CodeIcon className="w-8 h-8 text-cyan-400" />
        <h2 className="text-2xl font-bold text-slate-200">How to use API Mode</h2>
      </div>
      <p className="text-slate-400 mb-4">
        You can render an image directly by providing a URL-encoded Base64 string in the URL hash. This acts like a client-side API endpoint for displaying images.
      </p>
      <p className="text-slate-300 font-medium mb-2">URL Format:</p>
      <code className="w-full bg-slate-900 text-cyan-300 p-3 rounded-md text-sm break-words">
        {window.location.origin + window.location.pathname}#b64=[URL-encoded Base64]
      </code>
      <p className="text-slate-400 mt-4 mb-2 text-sm">
        <strong>Important:</strong> Your Base64 string must be properly URL-encoded to work correctly as a parameter. You can use JavaScript's <code className="bg-slate-700 p-1 rounded">encodeURIComponent()</code> function for this.
      </p>
    </div>
  );

  return (
    <main className="animate-fade-in">
      {error && <div className="mb-8"><ErrorDisplay message={error} /></div>}
      {imageUrl && !error && <ImagePreview imageUrl={imageUrl} onImageError={handleImageError} />}
      {!imageUrl && !error && instructionBlock}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default ApiPage;