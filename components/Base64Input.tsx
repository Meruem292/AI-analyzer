import React from 'react';
import { ImageIcon } from './icons/ImageIcon';

interface Base64InputProps {
  base64: string;
  onBase64Change: (value: string) => void;
  onConvertClick: () => void;
}

export const Base64Input: React.FC<Base64InputProps> = ({ base64, onBase64Change, onConvertClick }) => {
  return (
    <div className="w-full bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl p-6 flex flex-col items-center transition-all duration-300 hover:border-cyan-500 hover:bg-slate-800">
      <label htmlFor="base64-input" className="sr-only">Base64 Input</label>
      <textarea
        id="base64-input"
        value={base64}
        onChange={(e) => onBase64Change(e.target.value)}
        placeholder="Paste your Base64 string here..."
        className="w-full h-40 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
        aria-label="Base64 Input"
      />
      <button
        onClick={onConvertClick}
        disabled={!base64.trim()}
        className="mt-4 flex items-center justify-center gap-3 px-8 py-3 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500"
      >
        <ImageIcon className="w-6 h-6" />
        Convert to Image
      </button>
    </div>
  );
};
