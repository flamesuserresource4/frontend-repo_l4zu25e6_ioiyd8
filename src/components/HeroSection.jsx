import React from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[60vh] md:h-[70vh] w-full overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/poZi6bJ4-Htwt04i/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/40 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 mb-4">
            <Sparkles size={16} className="text-cyan-300" />
            <span className="text-xs text-cyan-200">Ocean waves • Nature • Real-time AI</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">
            Explore the ocean with real-time marine species intelligence
          </h2>
          <p className="mt-4 text-slate-300 max-w-2xl">
            Detect, track, and classify marine life from images, videos, and live camera feeds. Get detailed insights like common and scientific names, habitats, and environmental context.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#detect" className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-200 hover:text-white hover:bg-cyan-500/30 border border-cyan-400/30 px-4 py-2 rounded-md transition-colors">
              <Rocket size={16} />
              Start Detection
            </a>
            <a href="#history" className="inline-flex items-center gap-2 bg-white/5 text-white hover:bg-white/10 border border-white/10 px-4 py-2 rounded-md transition-colors">
              View History
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
