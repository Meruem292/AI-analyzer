import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import ConverterPage from './pages/ConverterPage';
import AnalyzerPage from './pages/AnalyzerPage';
import ApiPage from './pages/ApiPage';
import CodeGeneratorPage from './pages/CodeGeneratorPage';
import RecentImagesPage from './pages/RecentImagesPage';
import LatestPhotoPage from './pages/LatestPhotoPage';
import ApiEndpoint from './pages/ApiEndpoint';

const params = new URLSearchParams(window.location.search);
const isApiMode = params.get('api') === 'true';

const pageConfig = {
  converter: {
    title: 'Base64 to Image Converter',
    subtitle: 'Paste your Base64 string to instantly see the image.'
  },
  analyzer: {
    title: 'AI Image Analyzer',
    subtitle: 'Upload an image and let AI describe its contents.'
  },
  api: {
    title: 'API Mode',
    subtitle: 'Render an image directly from a URL parameter.'
  },
  codeGenerator: {
    title: 'Code Generator',
    subtitle: 'Paste your code snippet and let AI generate the API Mode URL.'
  },
  recent: {
    title: 'Recent Images',
    subtitle: 'A history of the latest images generated via API Mode.'
  },
  polyBite: {
    title: 'Latest PolyBite Photo',
    subtitle: 'The most recent photo from the public PolyBite collection.'
  },
}

const App: React.FC = () => {
  if (isApiMode) {
    return <ApiEndpoint />;
  }
  
  const getPageFromHash = () => {
    const hash = window.location.hash.slice(1);
    // Special case for API mode which uses a different hash format
    if (hash.startsWith('b64=')) {
      return 'api';
    }
    const params = new URLSearchParams(hash);
    const page = params.get('page');
    if (page && pageConfig.hasOwnProperty(page)) {
      return page;
    }
    return 'converter'; // Default page
  };

  const [currentPage, setCurrentPage] = useState(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  const config = pageConfig[currentPage as keyof typeof pageConfig];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header title={config.title} subtitle={config.subtitle} />
        <Navbar currentPage={currentPage} />
        {currentPage === 'converter' && <ConverterPage />}
        {currentPage === 'analyzer' && <AnalyzerPage />}
        {currentPage === 'api' && <ApiPage />}
        {currentPage === 'codeGenerator' && <CodeGeneratorPage />}
        {currentPage === 'recent' && <RecentImagesPage />}
        {currentPage === 'polyBite' && <LatestPhotoPage />}
      </div>
    </div>
  );
};

export default App;