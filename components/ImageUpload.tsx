
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onAnalyzeClick: () => void;
  imageUrl: string | null;
  isLoading: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, onAnalyzeClick, imageUrl, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl p-6 flex flex-col items-center transition-all duration-300 hover:border-cyan-500 hover:bg-slate-800">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />

      {imageUrl ? (
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-md mb-6 rounded-lg overflow-hidden shadow-lg shadow-black/30">
            <img src={imageUrl} alt="Selected preview" className="w-full h-auto object-contain" />
          </div>
        </div>
      ) : (
        <div 
          className="text-center cursor-pointer py-10" 
          onClick={handleUploadClick}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              onImageSelect(e.dataTransfer.files[0]);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <UploadIcon className="w-16 h-16 mx-auto text-slate-500 mb-4" />
          <p className="text-xl font-semibold text-slate-300">Click to upload or drag & drop</p>
          <p className="text-slate-400 mt-1">PNG, JPG, or WEBP</p>
        </div>
      )}

      <button
        onClick={onAnalyzeClick}
        disabled={!imageUrl || isLoading}
        className="mt-4 flex items-center justify-center gap-3 px-8 py-3 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500"
      >
        <BrainCircuitIcon className="w-6 h-6" />
        {isLoading ? 'Analyzing...' : 'Analyze Image'}
      </button>
    </div>
  );
};
