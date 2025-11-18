import React from 'react';

interface NavbarProps {
  currentPage: string;
}

const NavLink: React.FC<{
  page: string;
  currentPage: string;
  children: React.ReactNode;
}> = ({ page, currentPage, children }) => {
  const isActive = currentPage === page;
  const activeClasses = 'bg-slate-700 text-white';
  const inactiveClasses = 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200';
  
  const href = `#page=${page}`;

  return (
    <a
      href={href}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  return (
    <nav className="w-full max-w-4xl mx-auto flex justify-center my-8" aria-label="Main navigation">
      <div className="flex flex-wrap justify-center space-x-2 bg-slate-800 p-1 rounded-lg shadow-md">
        <NavLink page="converter" currentPage={currentPage}>
          Base64 Converter
        </NavLink>
        <NavLink page="analyzer" currentPage={currentPage}>
          AI Image Analyzer
        </NavLink>
        <NavLink page="api" currentPage={currentPage}>
          API Mode
        </NavLink>
        <NavLink page="codeGenerator" currentPage={currentPage}>
          Code Generator
        </NavLink>
        <NavLink page="recent" currentPage={currentPage}>
          Recent Images
        </NavLink>
        <NavLink page="polyBite" currentPage={currentPage}>
          PolyBite Photo
        </NavLink>
        <a
          href="/api/check"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
          title="Open the raw JSON endpoint in a new tab"
        >
          JSON API
        </a>
      </div>
    </nav>
  );
};