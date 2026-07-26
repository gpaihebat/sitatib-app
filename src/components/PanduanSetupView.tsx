import React from 'react';
import { BookOpen, Copy, Check } from 'lucide-react';
import { PANDUAN_SETUP_TEXT } from '../data/gasCode';

export const PanduanSetupView: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyGuide = () => {
    navigator.clipboard.writeText(PANDUAN_SETUP_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-blue-800/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold border border-blue-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Panduan Lengkap Implementasi & Deployment</span>
            </div>
            <h2 className="text-xl font-bold">Langkah-Langkah Setup SITATIB React (GitHub Pages)</h2>
            <p className="text-xs text-blue-200 max-w-2xl leading-relaxed">
              Panduan langkah demi langkah untuk mendeploy Frontend React ke GitHub Pages dan menghubungkannya dengan API Google Apps Script.
            </p>
          </div>
          <button
            onClick={handleCopyGuide}
            className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 transition-all px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-sm shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Copy Panduan Teks'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm font-mono text-xs text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
        {PANDUAN_SETUP_TEXT}
      </div>
    </div>
  );
};
