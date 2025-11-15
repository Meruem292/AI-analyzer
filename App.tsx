
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { Loader } from './components/Loader';
import { analyzeImage } from './services/geminiService';
import { ErrorDisplay } from './components/ErrorDisplay';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    setAnalysis(null);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);
  
  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile || !imageUrl) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      // Convert data URL to base64
      const base64Data = imageUrl.split(',')[1];
      const result = await analyzeImage(base64Data, imageFile.type);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, imageUrl]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <ImageUpload 
            onImageSelect={handleImageSelect}
            onAnalyzeClick={handleAnalyzeClick}
            imageUrl={imageUrl}
            isLoading={isLoading}
          />
          <div className="mt-8">
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {analysis && !isLoading && <AnalysisResult analysis={analysis} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
