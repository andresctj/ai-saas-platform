"use client";
import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';

export default function VideoStudioTMZ() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("A woman singing and walking forward with a nostalgic expression, cinematic lighting");
  const [range, setRange] = useState({ start: 0, end: 10 });

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const regions = useRef<any>(null);

  // Descarga del archivo final
  const descargarVideo = async () => {
    if (!videoUrl) return;
    const res = await fetch(videoUrl);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tmz-render-${Date.now()}.mp4`;
    a.click();
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAudioBase64(base64);
        wavesurfer.current?.load(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (waveformRef.current && !wavesurfer.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#312e81',
        progressColor: '#4f46e5',
        height: 100,
        barWidth: 2,
      });

      regions.current = wavesurfer.current.registerPlugin(RegionsPlugin.create());
      wavesurfer.current.on('ready', () => {
        regions.current.clearRegions();
        regions.current.addRegion({
          start: 0,
          end: 10,
          color: 'rgba(79, 70, 229, 0.3)',
          drag: true,
          resize: true
        });
      });

      regions.current.on('region-updated', (r: any) => setRange({ start: r.start, end: r.end }));
    }
  }, []);

  const generarVideo = async () => {
    if (!imageBase64 || !audioBase64) return alert("Sube imagen y audio.");
    setLoading(true);
    setVideoUrl(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: imageBase64, 
          audio: audioBase64, 
          prompt, 
          start_time: range.start, 
          end_time: range.end 
        }),
      });

      const data = await response.json();
      if (data.video) setVideoUrl(data.video);
      else alert("Error: " + data.error);
    } catch (err) {
      alert("Fallo de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h1 className="text-5xl font-black italic tracking-tighter text-indigo-500 uppercase">Video Studio Pro</h1>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4">1. Identidad Visual</label>
            <input type="file" accept="image/*" onChange={onImageChange} className="block w-full text-xs" />
            {imageBase64 && <img src={imageBase64} className="mt-4 h-48 w-full object-contain rounded-xl bg-black border border-white/5" />}
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4">2. Edición de Audio</label>
            <input type="file" accept="audio/*" onChange={onAudioChange} className="block w-full text-xs" />
            <div ref={waveformRef} className="mt-6 bg-indigo-950/20 rounded-xl" />
            <div className="flex justify-between mt-4">
              <button onClick={() => wavesurfer.current?.playPause()} className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-all text-sm">ESCUCHAR</button>
              <div className="text-right text-xs font-mono text-indigo-400">Rango: {range.start.toFixed(2)}s - {range.end.toFixed(2)}s</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4">3. Prompt Nostálgico</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-xl p-4 text-sm outline-none h-24 focus:border-indigo-500" />
          </div>

          <button onClick={generarVideo} disabled={loading} className="w-full bg-indigo-600 py-6 rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all shadow-2xl disabled:opacity-20 uppercase">
            {loading ? "Sincronizando Labios..." : "Generar Video"}
          </button>
        </div>

        <div className="aspect-[9/16] bg-white/5 border border-white/10 rounded-[3.5rem] flex items-center justify-center relative overflow-hidden group">
          {videoUrl ? (
            <>
              <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
              <button onClick={descargarVideo} className="absolute top-8 right-8 bg-white text-black p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">📥 Descargar</button>
            </>
          ) : (
            <div className="text-center opacity-10 uppercase tracking-[1.5em] text-[10px] font-black">Previsualización</div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest animate-pulse">Renderizando en ByteDance...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}