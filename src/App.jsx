import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import DetectionPanel from './components/DetectionPanel';
import HistoryGallery from './components/HistoryGallery';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [history, setHistory] = useState([]);

  const handleAddHistory = (entry) => {
    setHistory((prev) => [entry, ...prev]);
    if (activeTab !== 'history') setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 selection:text-white">
      <Header activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'home' && (
        <>
          <HeroSection />
          <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
            <ValueCard title="Real-time Detection" desc="Process images, videos, and live feeds with on-device or cloud inference." />
            <ValueCard title="Marine Knowledge" desc="Enriched insights with common & scientific names, habitat, and behavior." />
            <ValueCard title="Beautiful Experience" desc="Ocean-inspired UI with interactive 3D hero and smooth interactions." />
          </section>
        </>
      )}

      {activeTab === 'detect' && (
        <DetectionPanel onAddHistory={handleAddHistory} />
      )}

      {activeTab === 'history' && (
        <HistoryGallery items={history} />
      )}

      <footer className="border-t border-white/10 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-slate-400">
          Built for ocean exploration • Connect your backend to enable YOLOv8/EfficientNet and FathomNet-powered insights.
        </div>
      </footer>
    </div>
  );
}

function ValueCard({ title, desc }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/60 p-5">
      <div className="text-base font-medium mb-1 text-white">{title}</div>
      <div className="text-sm text-slate-300">{desc}</div>
    </div>
  );
}
