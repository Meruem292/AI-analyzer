import React, { useState, useEffect, useCallback } from 'react';
import { getHistory, clearHistory } from '../utils/historyUtils';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { HistoryIcon } from '../components/icons/HistoryIcon';

const RecentImagesPage: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setImages(getHistory());
    } catch (e) {
      setError("Could not load image history.");
      console.error(e);
    }
  }, []);

  const handleClearHistory = useCallback(() => {
    try {
      clearHistory();
      setImages([]);
    } catch (e) {
      setError("Could not clear image history.");
      console.error(e);
    }
  }, []);

  return (
    <main className="animate-fade-in">
      {error && <ErrorDisplay message={error} />}
      
      {images.length > 0 ? (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-800/50 text-red-300 font-semibold rounded-lg shadow-md hover:bg-red-700/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500"
            >
              <HistoryIcon className="w-5 h-5" />
              Clear History
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="bg-slate-800 rounded-lg overflow-hidden shadow-lg shadow-black/30 aspect-square group animate-fade-in-item" style={{ animationDelay: `${index * 50}ms` }}>
                <img
                  src={imageUrl}
                  alt={`Recent image ${index + 1}`}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl p-10">
          <h2 className="text-2xl font-bold text-slate-300">No Recent Images</h2>
          <p className="text-slate-400 mt-2">
            Images converted using API Mode will appear here.
          </p>
        </div>
      )}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes fade-in-item {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-item {
          animation: fade-in-item 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  );
};

export default RecentImagesPage;
