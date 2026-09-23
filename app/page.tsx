"use client";
import React, { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  // --- ESTADOS MÓDULO 1: RESTAURACIÓN (CodeFormer) ---
  const [resBefore, setResBefore] = useState("/antes.png");
  const [resAfter, setResAfter] = useState("/despues.png");
  const [resSlider, setResSlider] = useState(50);
  const [resLoading, setResLoading] = useState(false);

  // --- ESTADOS MÓDULO 2: THERIAN (Nano-Banana) ---
  const [theBefore, setTheBefore] = useState("/humano.png");
  const [theAfter, setTheAfter] = useState("/therian.png");
  const [theSlider, setTheSlider] = useState(50);
  const [theLoading, setTheLoading] = useState(false);

  const [ideaLoading, setIdeaLoading] = useState(false);

  // ✨ FUNCIÓN: GENERADOR DE IDEAS IA (Gemini)
  const sugerirIdeaIA = async () => {
    setIdeaLoading(true);
    setPrompt("✨ Gemini está pensando una idea brillante...");
    try {
      const res = await fetch('/api/generate-idea', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industria: "general" }) 
      });
      const data = await res.json();
      if (data.idea) setPrompt(data.idea);
    } catch (err) {
      setPrompt("Un spa de lujo llamado AURA, con estética zen y colores arena.");
    } finally {
      setIdeaLoading(false);
    }
  };

  // --- PROCESAMIENTO DE ARCHIVOS (HEIC a JPG) ---
  const preprocessFile = async (file: File): Promise<File | null> => {
    if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
      try {
        const heic2any = (await import("heic2any")).default;
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8
        });
        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        return new File([blob], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
      } catch (error) {
        console.error("Error HEIC:", error);
        return null;
      }
    }
    return file;
  };

  // --- LÓGICA DE DESCARGA ---
  const handleDownload = async (imageUrl: string, moduleName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TMZ-${moduleName}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      window.open(imageUrl, '_blank');
    }
  };

  // --- PROCESO 1: RESTAURAR ---
  const processRestaurar = async (e: ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;
    setResLoading(true);
    const processedFile = await preprocessFile(file);
    if (!processedFile) { setResLoading(false); return; }
    setResBefore(URL.createObjectURL(processedFile));
    const reader = new FileReader();
    reader.readAsDataURL(processedFile);
    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/restaurar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: reader.result }),
        });
        const data = await res.json();
        setResAfter(Array.isArray(data.output) ? data.output[0] : data.output);
      } finally { setResLoading(false); }
    };
  };

  // --- PROCESO 2: THERIAN ---
  const processTherian = async (e: ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;
    setTheLoading(true);
    const processedFile = await preprocessFile(file);
    if (!processedFile) { setTheLoading(false); return; }
    setTheBefore(URL.createObjectURL(processedFile));
    const reader = new FileReader();
    reader.readAsDataURL(processedFile);
    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/therian", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: reader.result }),
        });
        const data = await res.json();
        setTheAfter(Array.isArray(data.output) ? data.output[0] : data.output);
      } finally { setTheLoading(false); }
    };
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 overflow-x-hidden relative font-sans">
      
      {/* FONDO AMBIENTAL CLÁSICO */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[700px] h-[700px] bg-indigo-900/20 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25"></div>
      </div>

      {/* NAVBAR */}
{/* NAVBAR ACTUALIZADO */}
      <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold italic underline">IA</span>
          </div>
          <span className="italic uppercase font-black">TmzSolutions</span>
        </div>
        
        <div className="hidden md:flex gap-8 lg:gap-12 text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold font-sans">
          <Link href="/servicios" className="text-emerald-400 hover:text-white transition-colors border-b border-emerald-500/30 pb-1">Servicios</Link>
          <Link href="/generador-web" className="hover:text-white transition-colors">Web Builder</Link>
          <Link href="/studio/talentos" className="hover:text-white transition-colors">Talent Scout</Link>
          <Link href="/videos" className="hover:text-white transition-colors">Cine IA</Link>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center mt-12 px-6 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black tracking-[0.2em] mb-8 uppercase text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          Therian & Restoration Engine v2.5 Online
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter max-w-5xl leading-[0.85] mb-8 uppercase text-white">
          DISEÑA TU MUNDO <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500 italic font-sans">
            EN SEGUNDOS.
          </span>
        </h1>

        {/* INPUT PRINCIPAL + CHISPA */}
        <div className="w-full max-w-3xl bg-white/5 border border-white/10 p-2 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl mb-24 hover:border-emerald-500/40 transition-all group relative">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 w-full text-left flex items-center">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Escribe el nombre de tu proyecto o usa la chispa ✨"
                className="flex-1 bg-transparent px-8 py-5 outline-none text-sm placeholder:text-gray-700 font-bold tracking-tight text-white"
              />
              <button 
                onClick={sugerirIdeaIA}
                className="mr-4 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all active:scale-90 shadow-inner"
              >
                {ideaLoading ? "..." : "✨"}
              </button>
            </div>
            <button className="w-full md:w-auto bg-emerald-600 text-white px-10 py-5 rounded-[2.2rem] font-black text-[11px] uppercase italic tracking-widest hover:bg-emerald-500 transition-all shadow-xl">
              COMIENZA A DISEÑAR
            </button>
          </div>
        </div>

        {/* SECCIÓN 1: RESTAURADOR HD */}
        <section className="w-full max-w-5xl mx-auto mb-20 px-6 text-left">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Optimización de Activos</h2>
            <div className="flex-1 h-[1px] bg-white/10"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <span className="text-[10px] font-black bg-emerald-500/20 px-3 py-1.5 rounded text-emerald-400 uppercase tracking-tighter mb-6 inline-block border border-emerald-500/10">Módulo: CodeFormer HD</span>
              <h4 className="text-4xl md:text-5xl font-black text-white uppercase mb-4 tracking-tighter leading-[0.9]">
                Tus imágenes, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 italic">en Alta Definición.</span>
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed font-medium mb-8">Restaura la nitidez de fotos antiguas o borrosas al instante.</p>
              
              <div className="flex flex-wrap gap-4">
                <label className="cursor-pointer bg-white text-black text-[11px] font-black px-10 py-5 rounded-full uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-xl">
                  {resLoading ? 'PROCESANDO...' : 'RESTAURAR IMAGEN'}
                  <input type="file" className="hidden" accept="image/*" onChange={processRestaurar} disabled={resLoading} />
                </label>
                {resAfter !== "/despues.png" && (
                  <button onClick={() => handleDownload(resAfter, "HD-Restoration")} className="bg-white/5 border border-white/10 text-white text-[11px] font-black px-10 py-5 rounded-full uppercase hover:bg-white hover:text-black transition-all">Descargar HD</button>
                )}
              </div>
            </div>

<div className="lg:col-span-3 relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 aspect-[3/4]">              {resLoading && <div className="absolute inset-0 z-40 bg-black/60 flex items-center justify-center font-black text-emerald-400 animate-pulse text-[10px] uppercase">Reconstruyendo...</div>}
              <img src={resBefore} alt="Original" className="w-full h-full object-cover grayscale-[0.5]" />
              <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 0 0 ${resSlider}%)` }}>
                <img src={resAfter} alt="Restored" className="w-full h-full object-cover" />
              </div>
              <input type="range" min="0" max="100" value={resSlider} onChange={(e) => setResSlider(+e.target.value)} className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-col-resize" />
              <div className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.6)]" style={{ left: `${resSlider}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <div className="flex gap-0.5"><div className="w-0.5 h-3 bg-black/30" /><div className="w-0.5 h-3 bg-black/30" /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: THERIAN IDENTITY LAB */}
        <section className="w-full max-w-5xl mx-auto mb-32 px-6 text-left">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500/50 font-sans">Identidad Visual Multimodal</h2>
            <div className="flex-1 h-[1px] bg-emerald-500/10"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <span className="text-[10px] font-black bg-emerald-500/20 px-3 py-1.5 rounded text-emerald-400 uppercase tracking-tighter mb-6 inline-block border border-emerald-500/10">Módulo: Google Nano-Banana</span>
              <h4 className="text-4xl md:text-6xl font-black text-white uppercase mb-4 tracking-tighter leading-[0.85]">
                DESCUBRE TU <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500 italic font-sans">ALTER EGO.</span>
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed font-medium mb-8">Inyectamos tu identidad en un theriotipo artesanal conservando tu esencia humana.</p>
              
              <div className="flex flex-wrap gap-4">
                <label className="cursor-pointer bg-emerald-600 text-white text-[11px] font-black px-10 py-5 rounded-full uppercase tracking-widest hover:bg-emerald-400 hover:text-black transition-all shadow-xl shadow-emerald-600/20 active:scale-95">
                  {theLoading ? 'INVOCANDO...' : 'REVELAR MI THERIAN'}
                  <input type="file" className="hidden" accept="image/*" onChange={processTherian} disabled={theLoading} />
                </label>
                {theAfter !== "/therian.png" && (
                  <button onClick={() => handleDownload(theAfter, "Therian-Avatar")} className="bg-white/5 border border-white/10 text-white text-[11px] font-black px-10 py-5 rounded-full uppercase hover:bg-white hover:text-black transition-all">Descargar Avatar</button>
                )}
              </div>
            </div>

<div className="lg:col-span-3 relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 aspect-[3/4]">              {theLoading && <div className="absolute inset-0 z-40 bg-black/80 flex items-center justify-center font-black text-emerald-400 animate-pulse text-[10px] uppercase">Inyectando ADN...</div>}
              <img src={theBefore} alt="Humano" className="w-full h-full object-cover" />
              <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 0 0 ${theSlider}%)` }}>
                <img src={theAfter} alt="Therian" className="w-full h-full object-cover border-l-2 border-emerald-400 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]" />
              </div>
              <input type="range" min="0" max="100" value={theSlider} onChange={(e) => setTheSlider(+e.target.value)} className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-col-resize" />
              <div className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-20 pointer-events-none shadow-[0_0_15px_rgba(52,211,153,0.8)]" style={{ left: `${theSlider}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                    <div className="flex gap-0.5"><div className="w-0.5 h-3 bg-white" /><div className="w-0.5 h-3 bg-white" /></div>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 z-10 text-[9px] font-black uppercase bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">Humano</div>
              <div className="absolute bottom-6 right-6 z-10 text-[9px] font-black uppercase bg-emerald-500 text-white px-4 py-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]">Therian</div>
            </div>
          </div>
        </section>

      </main>
      
      <footer className="py-12 text-center opacity-40 border-t border-white/5 font-sans">
        <p className="text-[9px] tracking-[0.6em] uppercase font-black">© 2026 TMZ Solutions Studio • Hecho en Ecuador 🇪🇨</p>
      </footer>
    </div>
  );
}