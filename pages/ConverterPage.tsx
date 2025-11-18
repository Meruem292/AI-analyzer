import React, { useState, useCallback } from 'react';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { Base64Input } from '../components/Base64Input';
import { ImagePreview } from '../components/ImagePreview';
import { detectMimeType } from '../utils/imageUtils';

const ConverterPage: React.FC = () => {
  const [base64, setBase64] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvertClick = useCallback(() => {
    setError(null);
    setImageUrl(null);

    const trimmedBase64 = base64.trim();
    if (!trimmedBase64) {
      setError("Please paste a Base64 string.");
      return;
    }

    // Handle full data URL
    if (trimmedBase64.startsWith('data:image/')) {
      setImageUrl(trimmedBase64);
      return;
    }

    // Detect mime type and construct data URL
    const mimeType = detectMimeType(trimmedBase64);
    if (mimeType) {
      setImageUrl(`data:${mimeType};base64,${trimmedBase64}`);
    } else {
      setError("Could not detect image type. Please provide a full data URL (e.g., data:image/png;base64,...).");
    }

  }, [base64]);

  const handleImageError = useCallback(() => {
    setError("The provided Base64 string is either invalid or represents an unsupported image format.");
    setImageUrl(null);
  }, []);
  
  return (
    <main>
      <Base64Input 
        base64={base64}
        onBase64Change={setBase64}
        onConvertClick={handleConvertClick}
      />
      <div className="mt-8">
        {error && <ErrorDisplay message={error} />}
        {imageUrl && !error && <ImagePreview imageUrl={imageUrl} onImageError={handleImageError} />}
      </div>
    </main>
  );
};

export default ConverterPage;