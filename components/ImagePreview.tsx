import React from 'react';

interface ImagePreviewProps {
  imageUrl: string;
  onImageError: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onImageError }) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 animate-fade-in flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400 self-start">Generated Image</h2>
      <div className="max-w-full rounded-lg overflow-hidden shadow-lg shadow-black/30 bg-black/20">
        <img 
          src={imageUrl} 
          alt="Generated from Base64" 
          className="w-full h-auto object-contain max-h-[70vh]"
          onError={onImageError}
        />
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
