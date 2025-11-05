import React from 'react';
import { History, Images } from 'lucide-react';

export default function HistoryGallery({ items }) {
  const totalAnalyses = items.length;
  const imageAnalyses = items.filter(i => i.mode === 'image').length;
  const videoAnalyses = items.filter(i => i.mode !== 'image').length;
  const uniqueSpecies = new Set(items.flatMap(i => i.detections.map(d => d.species))).size;
  const avgConfidence = items.length
    ? Math.round(
        (items.reduce((acc, i) => acc + (i.detections.reduce((a, d) => a + d.confidence, 0) / (i.detections.length || 1)), 0) / items.length) * 100
      )
    : 0;

  return (
    <section id="history" className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <History size={18} className="text-cyan-300" /> History & Statistics
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Analyses" value={totalAnalyses} />
        <StatCard label="Unique Species" value={uniqueSpecies} />
        <StatCard label="Avg Confidence" value={`${avgConfidence}%`} />
        <StatCard label="Images / Videos" value={`${imageAnalyses} / ${videoAnalyses}`} />
      </div>

      {items.length === 0 ? (
        <div className="h-40 grid place-items-center text-slate-400 text-sm border border-white/10 rounded-md">
          No detections yet. Run an analysis to populate history.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg overflow-hidden border border-white/10 bg-slate-900/50">
              <div className="aspect-video overflow-hidden">
                <img src={item.thumbnail} alt="detection" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                  <span className="capitalize">{item.mode}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.detections.map((d, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-100 border border-cyan-400/30">
                      {d.species} • {Math.round(d.confidence * 100)}%
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-900/60 p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-xl font-semibold text-white mt-1">{value}</div>
    </div>
  );
}
