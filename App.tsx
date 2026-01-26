
import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Проверка, запущено ли как PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWA(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-6">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-sm transform transition-all duration-500 hover:scale-[1.02]">
        <div className="flex flex-col items-center">
          {/* Icon/Logo */}
          <div className="w-20 h-20 bg-white rounded-3xl shadow-inner flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h1 className="text-4xl font-black text-white text-center tracking-tight mb-2">
            Hello World
          </h1>
          
          <p className="text-indigo-100 text-center text-sm font-medium opacity-70 mb-8">
            {isPWA ? 'Запущено как приложение' : 'Ваше первое PWA готово'}
          </p>

          <div className="space-y-4 w-full">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Offline Ready
              </span>
            </div>

            {installPrompt && !isPWA && (
              <button 
                onClick={handleInstallClick}
                className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-bold shadow-xl hover:bg-indigo-50 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Установить на телефон
              </button>
            )}
            
            <p className="text-[10px] text-white/40 text-center uppercase tracking-widest mt-4">
              Ready for GitHub Pages
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
