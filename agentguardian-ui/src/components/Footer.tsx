import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-white/5 bg-slate-900/20 backdrop-blur-sm z-10 relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
        <p className="text-slate-400 text-sm flex items-center gap-2">
          Made with <span className="text-red-500 animate-pulse">❤️</span> by <span className="text-cyan-400 font-semibold tracking-wide hover:text-cyan-300 transition-colors cursor-pointer">Satyam Kumar</span>
        </p>
        <p className="text-slate-500 text-xs mt-1.5">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};
