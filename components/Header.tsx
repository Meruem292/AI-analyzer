import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4">
        <SparklesIcon className="w-10 h-10 text-cyan-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
          {title}
        </h1>
      </div>
      <p className="mt-4 text-lg text-slate-400">
        {subtitle}
      </p>
    </header>
  );
};
