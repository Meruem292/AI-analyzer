
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <div className="w-12 h-12 border-4 border-t-transparent border-violet-500 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-medium">AI is analyzing your image...</p>
    </div>
  );
};
