import React, { useEffect, useRef, useState } from 'react';
import { Upload, Play, Camera, Image as ImageIcon, Video as VideoIcon, Microscope } from 'lucide-react';

const SPECIES_KNOWLEDGE = {
  Jellyfish: {
    scientific: 'Scyphozoa',
    habitat: 'Open ocean and coastal waters; often near the surface.',
    notes: 'Gelatinous zooplankton drifting with currents; some species can bloom seasonally.'
  },
  Fish: {
    scientific: 'Actinopterygii',
    habitat: 'Varied: reefs, pelagic zones, and coastal areas depending on species.',
    notes: 'Cold-blooded vertebrates with gills; incredible diversity across oceans.'
  },
  'Sea Turtle': {
    scientific: 'Chelonioidea',
    habitat: 'Tropical and subtropical oceans; forage in seagrass beds and coral reefs.',
    notes: 'Long-lived reptiles migrating vast distances between feeding and nesting grounds.'
  },
  Octopus: {
    scientific: 'Octopoda',
    habitat: 'Rocky reefs, seafloor crevices, and kelp forests from shallow to deep waters.',
    notes: 'Highly intelligent cephalopods with remarkable camouflage capabilities.'
  },
};

function randomDetections(width, height) {
  const candidates = Object.keys(SPECIES_KNOWLEDGE);
  const count = Math.floor(Math.random() * 3) + 1;
  const dets = Array.from({ length: count }).map(() => {
    const species = candidates[Math.floor(Math.random() * candidates.length)];
    const w = Math.max(0.15, Math.random() * 0.4);
    const h = Math.max(0.15, Math.random() * 0.4);
    const x = Math.min(0.95 - w, Math.random() * 0.8);
    const y = Math.min(0.95 - h, Math.random() * 0.8);
    const conf = (0.3 + Math.random() * 0.6).toFixed(2);
    return { species, x, y, w, h, confidence: parseFloat(conf) };
  });
  return dets;
}

function DetectionCanvas({ src, boxes }) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-white/10">
      <img src={src} alt="preview" className="w-full h-auto object-contain select-none" />
      {/* Boxes */}
      <div className="absolute inset-0">
        {boxes.map((b, idx) => (
          <div
            key={idx}
            className="absolute border-2 rounded-md" 
            style={{
              left: `${b.x * 100}%`,
              top: `${b.y * 100}%`,
              width: `${b.w * 100}%`,
              height: `${b.h * 100}%`,
              borderColor: 'rgba(34, 211, 238, 0.9)'
            }}
          >
            <div className="absolute -top-6 left-0 bg-cyan-500/90 text-slate-900 text-xs font-semibold px-2 py-0.5 rounded">
              {b.species} • {(b.confidence * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DetectionPanel({ onAddHistory }) {
  const [mode, setMode] = useState('image'); // image | video | live
  const [fileUrl, setFileUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [results, setResults] = useState([]);
  const videoRef = useRef(null);
  const liveStreamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (liveStreamRef.current) {
        liveStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [fileUrl, videoUrl]);

  const handleFile = (e, type) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    if (type === 'image') {
      setFileUrl(url);
      setPreviewSrc(url);
      setMode('image');
      setBoxes([]);
      setResults([]);
    } else {
      setVideoUrl(url);
      setPreviewSrc(url);
      setMode('video');
      setBoxes([]);
      setResults([]);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        liveStreamRef.current = stream;
        setMode('live');
        setPreviewSrc(null);
        setBoxes([]);
        setResults([]);
      }
    } catch (e) {
      alert('Unable to access camera. Please grant permissions.');
    }
  };

  const analyze = async () => {
    // In a full setup, this would call the backend for YOLO/EfficientNet inference.
    // Here we mock the detections to visualize the UX.
    let snapshotUrl = null;

    if (mode === 'image' && fileUrl) {
      snapshotUrl = fileUrl;
    } else if (mode === 'video' && videoUrl) {
      // grab a frame for display and history thumbnail
      const video = document.createElement('video');
      video.src = videoUrl;
      await video.play().catch(() => {});
      await new Promise(r => setTimeout(r, 150));
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      snapshotUrl = canvas.toDataURL('image/png');
      video.pause();
    } else if (mode === 'live' && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      snapshotUrl = canvas.toDataURL('image/png');
    }

    if (!snapshotUrl) return;

    const dets = randomDetections(1000, 1000);
    setBoxes(dets);

    const enriched = dets.map(d => ({
      species: d.species,
      confidence: d.confidence,
      scientific: SPECIES_KNOWLEDGE[d.species]?.scientific,
      habitat: SPECIES_KNOWLEDGE[d.species]?.habitat,
      notes: SPECIES_KNOWLEDGE[d.species]?.notes,
    }));
    setResults(enriched);

    onAddHistory({
      id: Date.now(),
      mode,
      thumbnail: snapshotUrl,
      detections: enriched,
      timestamp: new Date().toISOString(),
    });

    if (mode !== 'live') setPreviewSrc(snapshotUrl);
  };

  return (
    <section id="detect" className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Microscope size={18} className="text-cyan-300" /> Detection & Analysis
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('image')}
            className={`px-3 py-1.5 rounded-md text-sm border ${mode === 'image' ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30' : 'text-slate-300 border-white/10'}`}
          >
            <ImageIcon size={14} className="inline mr-1" /> Image
          </button>
          <button
            onClick={() => setMode('video')}
            className={`px-3 py-1.5 rounded-md text-sm border ${mode === 'video' ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30' : 'text-slate-300 border-white/10'}`}
          >
            <VideoIcon size={14} className="inline mr-1" /> Video
          </button>
          <button
            onClick={startCamera}
            className={`px-3 py-1.5 rounded-md text-sm border ${mode === 'live' ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30' : 'text-slate-300 border-white/10'}`}
          >
            <Camera size={14} className="inline mr-1" /> Live Camera
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Uploader / Live Preview */}
          {mode === 'image' && (
            <label className="block w-full border border-dashed border-cyan-400/30 rounded-lg p-6 text-center cursor-pointer hover:bg-white/5 transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, 'image')} />
              <div className="flex flex-col items-center gap-2 text-cyan-200">
                <Upload size={20} />
                <span className="text-sm">Upload an image</span>
              </div>
            </label>
          )}
          {mode === 'video' && (
            <label className="block w-full border border-dashed border-cyan-400/30 rounded-lg p-6 text-center cursor-pointer hover:bg-white/5 transition-colors">
              <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFile(e, 'video')} />
              <div className="flex flex-col items-center gap-2 text-cyan-200">
                <Upload size={20} />
                <span className="text-sm">Upload a video</span>
              </div>
            </label>
          )}

          <div className="rounded-lg overflow-hidden border border-white/10 bg-slate-900/50">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-sm text-slate-300">Preview</span>
              <button onClick={analyze} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan-500/20 text-cyan-100 border border-cyan-400/30 hover:bg-cyan-500/30 transition-colors">
                <Play size={14} /> Analyze
              </button>
            </div>
            <div className="p-3">
              {mode === 'live' ? (
                <div className="relative">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-md" />
                </div>
              ) : previewSrc ? (
                <DetectionCanvas src={previewSrc} boxes={boxes} />
              ) : (
                <div className="h-56 grid place-items-center text-slate-400 text-sm">No preview yet</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden border border-white/10 bg-slate-900/50">
            <div className="p-3 border-b border-white/10">
              <span className="text-sm text-slate-300">Analysis Summary</span>
            </div>
            <div className="p-4 space-y-3">
              {results.length === 0 ? (
                <p className="text-sm text-slate-400">Run analysis to view species classification, confidence, and habitat insights.</p>
              ) : (
                results.map((r, idx) => (
                  <div key={idx} className="p-3 rounded-md bg-slate-800/60 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-medium">{r.species} <span className="text-slate-300 font-normal">({r.scientific})</span></div>
                      <div className="text-cyan-300 text-sm font-semibold">{(r.confidence * 100).toFixed(0)}%</div>
                    </div>
                    <div className="mt-1 text-xs text-slate-300"><span className="text-slate-400">Habitat:</span> {r.habitat}</div>
                    <div className="mt-1 text-xs text-slate-300"><span className="text-slate-400">Notes:</span> {r.notes}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-white/10 bg-slate-900/50">
            <div className="p-3 border-b border-white/10">
              <span className="text-sm text-slate-300">Environment Analysis</span>
            </div>
            <div className="p-4 text-sm text-slate-300 space-y-2">
              <p>
                Water clarity appears moderate with natural blue-green tones. Lighting suggests daylight conditions typical of shallow marine environments. Presence of species indicates a biodiverse habitat possibly near reefs or coastal zones.
              </p>
              <p className="text-slate-400">Tip: Connect the backend to replace this heuristic with model-driven cues (visibility, depth proxy, habitat probability).</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
