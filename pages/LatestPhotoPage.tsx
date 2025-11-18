import React, { useState, useEffect, useCallback } from 'react';
import { getLatestPhotoUrl } from '../services/supabaseService';
import { checkForTrashAndBottle } from '../services/geminiService';
import { imageUrlToBase64 } from '../utils/imageUtils';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { ImagePreview } from '../components/ImagePreview';
import { RefreshIcon } from '../components/icons/RefreshIcon';
import { BrainCircuitIcon } from '../components/icons/BrainCircuitIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';

const LatestPhotoPage: React.FC = () => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{ hasTrash: boolean; hasPlasticBottle: boolean; } | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fetchLatestPhoto = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPhotoUrl(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    try {
      const url = await getLatestPhotoUrl();
      setPhotoUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestPhoto();
  }, [fetchLatestPhoto]);

  const handleAnalyzeClick = useCallback(async () => {
    if (!photoUrl) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    try {
      const { base64, mimeType } = await imageUrlToBase64(photoUrl);
      const result = await checkForTrashAndBottle(base64, mimeType);
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [photoUrl]);


  const handleImageError = useCallback(() => {
    setError("Failed to load the image. The file might be corrupt or no longer available.");
    setPhotoUrl(null);
  }, []);

  return (
    <main className="animate-fade-in">
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={fetchLatestPhoto}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 font-semibold rounded-lg shadow-md hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-wait transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
          aria-label="Refresh latest photo"
        >
          <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
        <button
          onClick={handleAnalyzeClick}
          disabled={isLoading || isAnalyzing || !photoUrl}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300"
          aria-label="Run AI Checker"
        >
          <BrainCircuitIcon className={`w-5 h-5 ${isAnalyzing ? 'animate-pulse' : ''}`} />
          {isAnalyzing ? 'Checking...' : 'AI Checker'}
        </button>
      </div>
      
      <div className="mt-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4 p-4">
            <div className="w-12 h-12 border-4 border-t-transparent border-violet-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium">Fetching the latest photo...</p>
          </div>
        )}
        {error && <ErrorDisplay message={error} />}
        {photoUrl && !error && <ImagePreview imageUrl={photoUrl} onImageError={handleImageError} />}
        
        {isAnalyzing && (
            <div className="flex flex-col items-center justify-center space-y-4 p-4 mt-8">
                <div className="w-12 h-12 border-4 border-t-transparent border-cyan-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium">AI is checking the image...</p>
            </div>
        )}
        {analysisError && <div className="mt-8"><ErrorDisplay message={analysisError} /></div>}
        {analysisResult && !isAnalyzing && (
          <div className="bg-slate-800 rounded-xl shadow-lg p-6 mt-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">AI Check Results</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-lg">
                {analysisResult.hasTrash ? 
                  <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" /> : 
                  <XCircleIcon className="w-6 h-6 text-red-400 flex-shrink-0" />
                }
                <span className="font-medium text-slate-300">Trash Detected:</span>
                <span className={`font-bold ${analysisResult.hasTrash ? 'text-green-400' : 'text-red-400'}`}>
                  {analysisResult.hasTrash ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                {analysisResult.hasPlasticBottle ? 
                  <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" /> : 
                  <XCircleIcon className="w-6 h-6 text-red-400 flex-shrink-0" />
                }
                <span className="font-medium text-slate-300">Plastic Bottle Detected:</span>
                 <span className={`font-bold ${analysisResult.hasPlasticBottle ? 'text-green-400' : 'text-red-400'}`}>
                  {analysisResult.hasPlasticBottle ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}

        {!photoUrl && !isLoading && !error && (
          <div className="text-center bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl p-10">
            <h2 className="text-2xl font-bold text-slate-300">No Photo Found</h2>
            <p className="text-slate-400 mt-2">
              Could not find any photos in the collection, or the collection is empty.
            </p>
          </div>
        )}
      </div>
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

export default LatestPhotoPage;
