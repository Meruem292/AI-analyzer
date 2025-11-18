import React, { useState, useCallback } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { Loader } from '../components/Loader';
import { AnalysisResult } from '../components/AnalysisResult';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { analyzeImage } from '../services/geminiService';

const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const mimeType = result.split(';')[0].split(':')[1];
            const base64 = result.split(',')[1];
            resolve({ base64, mimeType });
        };
        reader.onerror = error => reject(error);
    });
};

const AnalyzerPage: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setAnalysis(null);
    setError(null);
  }, []);

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    setError(null);
    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const result = await analyzeImage(base64, mimeType);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <main>
      <ImageUpload
        onImageSelect={handleImageSelect}
        onAnalyzeClick={handleAnalyzeClick}
        imageUrl={imageUrl}
        isLoading={isLoading}
      />
      <div className="mt-8">
        {isLoading && <Loader />}
        {error && <ErrorDisplay message={error} />}
        {analysis && !isLoading && !error && <AnalysisResult analysis={analysis} />}
      </div>
    </main>
  );
};

export default AnalyzerPage;
