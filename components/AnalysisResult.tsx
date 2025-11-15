
import React from 'react';

interface AnalysisResultProps {
  analysis: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  // Simple paragraph splitting for better readability
  const paragraphs = analysis.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">Analysis Result</h2>
      <div className="prose prose-invert max-w-none text-slate-300">
        {paragraphs.map((para, index) => (
          <p key={index} className="mb-4 last:mb-0">{para}</p>
        ))}
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
