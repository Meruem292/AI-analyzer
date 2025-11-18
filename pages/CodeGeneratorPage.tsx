import React, { useState, useCallback } from 'react';
import { generateApiUrl } from '../services/geminiService';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { Loader } from '../components/Loader';
import { WandIcon } from '../components/icons/WandIcon';
import { CopyIcon } from '../components/icons/CopyIcon';

const CodeGeneratorPage: React.FC = () => {
  const [prototypeCode, setPrototypeCode] = useState<string>('');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleGenerateClick = useCallback(async () => {
    if (!prototypeCode.trim()) {
      setError("Please enter some code to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedUrl(null);
    setIsCopied(false);

    try {
      const targetUrl = `${window.location.origin}${window.location.pathname}`;
      const url = await generateApiUrl(prototypeCode, targetUrl);
      setGeneratedUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [prototypeCode]);

  const handleCopyClick = useCallback(() => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [generatedUrl]);

  return (
    <main className="animate-fade-in">
      <div className="w-full bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl p-6 flex flex-col items-center transition-all duration-300 hover:border-cyan-500 hover:bg-slate-800">
        <label htmlFor="code-input" className="sr-only">Code Input</label>
        <textarea
          id="code-input"
          value={prototypeCode}
          onChange={(e) => setPrototypeCode(e.target.value)}
          placeholder="Paste your code snippet here... (e.g., fetch call, variable with base64 string)"
          className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
          aria-label="Code Input"
          spellCheck="false"
        />
        <button
          onClick={handleGenerateClick}
          disabled={!prototypeCode.trim() || isLoading}
          className="mt-4 flex items-center justify-center gap-3 px-8 py-3 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500"
        >
          <WandIcon className="w-6 h-6" />
          {isLoading ? 'Generating...' : 'Generate API URL'}
        </button>
      </div>

      <div className="mt-8">
        {isLoading && <Loader />}
        {error && <ErrorDisplay message={error} />}
        {generatedUrl && !isLoading && !error && (
          <div className="bg-slate-800 rounded-xl shadow-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Generated URL</h2>
            <div className="relative w-full bg-slate-900 text-cyan-300 p-3 pr-12 rounded-md text-sm break-words">
              <code>{generatedUrl}</code>
              <button
                onClick={handleCopyClick}
                className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-slate-400 hover:text-white rounded-md transition-colors"
                aria-label="Copy URL"
              >
                <CopyIcon className="w-5 h-5" />
              </button>
            </div>
            {isCopied && <p className="text-sm text-green-400 mt-2 text-center animate-fade-in">Copied to clipboard!</p>}
          </div>
        )}
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
    </main>
  );
};

export default CodeGeneratorPage;