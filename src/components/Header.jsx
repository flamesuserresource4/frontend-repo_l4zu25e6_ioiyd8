import React from 'react';
import { Ship, Image as ImageIcon, Video, History as HistoryIcon, Home } from 'lucide-react';

const tabs = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'detect', label: 'Detection', icon: Ship },
  { key: 'history', label: 'History', icon: HistoryIcon },
];

export default function Header({ activeTab, onChange }) {
  return (
    <header className="w-full sticky top-0 z-20 bg-gradient-to-b from-slate-900/80 to-slate-900/60 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-cyan-500/20 border border-cyan-400/30 grid place-items-center">
            <Ship className="text-cyan-400" size={20} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-white">Marine Vision AI</h1>
            <p className="text-xs text-slate-300/80">Advanced Marine Species Detection & Classification</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-md text-sm transition-colors border ${
                activeTab === key
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
                  : 'text-slate-300 hover:text-white border-white/10 hover:border-white/20'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
