"use client";
import React, { useState, useRef } from 'react';

export default function TMZImageStudio() {
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelo, setModelo] = useState('gemini-3-pro-image-preview');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [resolution, setResolution] = useState('1K');
  const [referencias, setReferencias] = useState<string[]>([]); // Soporta hasta 14 imágenes
  const [pensamiento, setPensamiento] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const manejarSubidaImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (referencias.length >= 14) return; // Límite de Nano Banana Pro
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferencias(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const manejarGeneracion = async () => {
    if (!prompt) return;
    setLoading(true);
    setPensamiento(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          model: modelo,
          aspect_ratio: aspectRatio,
          resolution,
          images: referencias, // Enviamos el array de referencias
          use_search: true    // Habilita Google Search Grounding
        }),
      });

      const data = await response.json();
      if (data.image) {
        setResultado(data.image);
        if (data.thought) setPensamiento(data.thought); // Captura el proceso de razonamiento
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Fallo en la red neuronal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-purple-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Pro</span>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">TMZ Studio</h1>
          </div>
          <p className="text-gray-500 font-medium">Nano Banana Pro: Generación Editorial y Coherencia de Identidad.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Panel de Control Izquierdo */}
          <div className="lg:col-span-4 space-y-6 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
            
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-purple-400 block mb-3">Motor de Inteligencia</label>
              <select 
                value={modelo} 
                onChange={(e) => setModelo(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-purple-500 transition-all shadow-2xl"
              >
                <option value="gemini-3-pro-image-preview">Nano Banana Pro (Thinking Mode)</option>
                <option value="gemini-2.5-flash-image">Nano Banana Fast (High Volume)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-purple-400 block mb-3">Resolución</label>
                <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs outline-none">
                  <option value="1K">1K HD</option>
                  <option value="2K">2K QHD</option>
                  <option value="4K">4K Ultra</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-purple-400 block mb-3">Aspecto</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs outline-none">
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Cinema</option>
                  <option value="9:16">9:16 Vertical</option>
                </select>
              </div>
            </div>

            {/* Referencias (Hasta 14) */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Referencias ({referencias.length}/14)</label>
                <button onClick={() => fileInputRef.current?.click()} className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors text-gray-300">+ Agregar</button>
              </div>
              <input type="file" multiple hidden ref={fileInputRef} onChange={manejarSubidaImagen} accept="image/*" />
              <div className="grid grid-cols-4 gap-2">
                {referencias.map((ref, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10">
                    <img src={ref} className="w-full h-full object-cover" alt={`Ref ${i}`} />
                    <button onClick={() => setReferencias(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Área de Prompt y Resultado */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative group">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe la escena con detalle cinematográfico..."
                className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-3xl p-8 outline-none focus:border-purple-500/50 transition-all text-xl font-light placeholder:text-gray-700 resize-none shadow-2xl"
              />
              <button 
                onClick={manejarGeneracion}
                disabled={loading || !prompt}
                className="absolute bottom-6 right-6 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-purple-600 hover:text-white transition-all disabled:opacity-20 shadow-2xl active:scale-95"
              >
                {loading ? 'Pensando...' : 'Renderizar'}
              </button>
            </div>

            <div className="relative aspect-[16/10] bg-white/[0.01] border border-white/5 rounded-[40px] overflow-hidden flex items-center justify-center group">
              {loading ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] tracking-[0.3em] uppercase text-purple-400 animate-pulse">Analizando composición...</p>
                </div>
              ) : resultado ? (
                <>
                  <img src={resultado} alt="AI" className="w-full h-full object-contain animate-in fade-in duration-1000" />
                  {pensamiento && (
                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity max-h-32 overflow-y-auto">
                      <p className="text-[10px] text-purple-400 font-bold mb-2 uppercase tracking-widest">Thought Process</p>
                      <p className="text-xs text-gray-300 leading-relaxed font-mono">{pensamiento}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center space-y-2 opacity-20">
                  <div className="text-6xl">✦</div>
                  <p className="text-[10px] uppercase tracking-widest font-bold">Laboratorio de Luz TMZ</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}