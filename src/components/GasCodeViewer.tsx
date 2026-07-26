import React, { useState } from 'react';
import { GAS_FILES, PANDUAN_SETUP_TEXT } from '../data/gasCode';
import { Code, Copy, Check, FileCode, BookOpen, Download, Layers } from 'lucide-react';

export const GasCodeViewer: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentFile = GAS_FILES[activeFileIndex];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-200">
      {/* Code Header Bar */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Kode Backend Google Apps Script (GAS)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Salin dan paste kode berikut ke Google Apps Script Editor untuk mendeploy aplikasi SITATAB
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSetupGuide(!showSetupGuide)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showSetupGuide
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showSetupGuide ? 'Sembunyikan Panduan' : 'Panduan Deployment'}</span>
          </button>

          <button
            onClick={() => handleCopy(showSetupGuide ? PANDUAN_SETUP_TEXT : currentFile.code)}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Kode File Ini'}</span>
          </button>
        </div>
      </div>

      {/* Panduan Banner if Toggled */}
      {showSetupGuide ? (
        <div className="p-6 bg-slate-950/80 border-b border-slate-800 font-mono text-xs text-amber-200/90 whitespace-pre-wrap overflow-x-auto leading-relaxed">
          {PANDUAN_SETUP_TEXT}
        </div>
      ) : (
        <>
          {/* File Tab List */}
          <div className="flex items-center overflow-x-auto bg-slate-950/60 border-b border-slate-800 px-2 pt-2 gap-1">
            {GAS_FILES.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setActiveFileIndex(idx)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-xl text-xs font-mono transition-all border-t border-x ${
                  activeFileIndex === idx
                    ? 'bg-slate-900 text-blue-400 border-slate-700 font-semibold'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.filename}</span>
              </button>
            ))}
          </div>

          {/* Description & File info */}
          <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="truncate">{currentFile.description}</span>
            <span className="font-mono text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
              {currentFile.language.toUpperCase()}
            </span>
          </div>

          {/* Code Viewer Container */}
          <div className="relative p-4 max-h-[600px] overflow-auto font-mono text-xs text-slate-200 leading-relaxed bg-slate-900/90">
            <pre>
              <code>{currentFile.code}</code>
            </pre>
          </div>
        </>
      )}
    </div>
  );
};
