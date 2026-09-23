"use client";
import React, { useState } from 'react';
import { Venus, Mars, Fingerprint, Zap, Download, ChevronRight, History } from 'lucide-react';

export default function TalentScoutPage() {
  const [prompt, setPrompt] = useState('');
  const [genero, setGenero] = useState<'hombre' | 'mujer' | null>(null);
  const [candidato, setCandidato] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState<string[]>([]);

  const rasgos = [
    { label: 'DNA', opciones: ['Latina', 'Nórdica', 'Asiática', 'Afro', 'Eslava'] },
    { label: 'ESTILO', opciones: ['Streetwear', 'Cyber', 'Elegante', 'Bikini'] },
  ];

  const addTag = (tag: string) => {
    setPrompt(prev => prev.includes(tag) ? prev : prev ? `${prev}, ${tag}` : tag);
  };

  const forjar = async () => {
    if (!prompt.trim() || !genero) return;
    setLoading(true);
    const descriptionFinal = `${prompt.trim()}, ${genero === 'hombre' ? 'man' : 'woman'}`;

    try {
      const res = await fetch('/api/studio/talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: descriptionFinal, gender: genero }),
      });
      const data = await res.json();
      if (data.url) {
        setCandidato(data.url);
        setHistorial(prev => [data.url, ...prev]);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <div className={`min-h-screen bg-black text-white font-sans transition-all duration-1000 overflow-x-hidden ${genero === 'mujer' ? 'selection:bg-pink-500' : 'selection:bg-emerald-500'}`}>
      
      {/* ATMÓSFERA DE COLOR */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[140px] transition-all duration-1000 ${genero === 'mujer' ? 'bg-pink-600/20' : 'bg-emerald-600/10'}`} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
            TALENT <span className={`transition-all duration-700 ${genero === 'mujer' ? 'text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]' : 'text-emerald-400'}`}>SCOUT</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA: CONTROLES */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex gap-4">
              <button onClick={() => setGenero('hombre')} className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${genero === 'hombre' ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-white/5 bg-neutral-900/40'}`}>
                <Mars size={20} className={genero === 'hombre' ? 'text-emerald-400' : 'text-white/40'} />
                <span className="text-[10px] font-black uppercase tracking-widest">Male</span>
              </button>
              <button onClick={() => setGenero('mujer')} className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${genero === 'mujer' ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_20px_rgba(236,72,153,0.2)]' : 'border-white/5 bg-neutral-900/40'}`}>
                <Venus size={20} className={genero === 'mujer' ? 'text-pink-500' : 'text-white/40'} />
                <span className="text-[10px] font-black uppercase tracking-widest">Female</span>
              </button>
            </div>

            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describir identidad..."
              className="w-full h-32 bg-neutral-900/60 border border-white/10 rounded-3xl p-5 outline-none focus:border-white/20 text-lg font-light resize-none"
            />

            <div className="flex flex-wrap gap-2">
              {rasgos.flatMap(r => r.opciones).map(opt => (
                <button key={opt} onClick={() => addTag(opt)} className="text-[9px] font-bold px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 uppercase transition-all">
                  + {opt}
                </button>
              ))}
            </div>

            <button 
              onClick={forjar}
              disabled={loading || !prompt.trim() || !genero}
              className={`w-full py-6 rounded-full font-black text-lg italic tracking-tighter uppercase transition-all flex items-center justify-center gap-3 relative overflow-hidden ${
                genero === 'mujer' ? 'bg-pink-600 shadow-[0_0_40px_rgba(236,72,153,0.4)]' : 
                genero === 'hombre' ? 'bg-emerald-500 text-black shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'bg-white text-black'
              }`}
            >
              {loading ? 'SINCRONIZANDO...' : 'FORJAR IDENTIDAD'}
              <ChevronRight size={20} />
            </button>
          </div>

    {/* COLUMNA CENTRAL: FOTO CON ALTURA LIMITADA PARA QUE NO SEA LARGUÍSIMA */}
<div className="lg:col-span-5 flex justify-center items-start pt-4">
  <div className={`relative w-full max-w-[280px] max-h-[580px] aspect-[624/1280] rounded-[2.5rem] border-2 transition-all duration-1000 overflow-hidden shadow-2xl ${
    genero === 'mujer' ? 'border-pink-500/30' : 'border-emerald-500/30'
  }`}>
    
    {/* LOADING */}
    {loading && (
      <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
        <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin ${genero === 'mujer' ? 'border-pink-500' : 'border-emerald-500'}`} />
      </div>
    )}

    {/* IMAGEN */}
    {candidato ? (
      <>
        <img src={candidato} className="w-full h-full object-cover" alt="Result" />
        <button className={`absolute bottom-5 right-5 p-3 rounded-full shadow-2xl transition-all hover:scale-110 ${
          genero === 'mujer' ? 'bg-pink-500 text-white' : 'bg-white text-black'
        }`}>
          <Download size={18} />
        </button>
      </>
    ) : (
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <Zap size={60} />
      </div>
    )}
  </div>
</div>

          {/* COLUMNA DERECHA: HISTORIAL EN LISTA VERTICAL */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-4 opacity-40">
              <History size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Recent_Log</span>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {historial.length === 0 && <div className="h-20 border border-white/5 rounded-2xl bg-white/[0.02]" />}
              {historial.slice().reverse().map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setCandidato(img)}
                  className={`relative cursor-pointer group rounded-2xl overflow-hidden border-2 transition-all aspect-[624/1280] w-full max-w-[120px] mx-auto lg:mx-0 ${
                    candidato === img ? (genero === 'mujer' ? 'border-pink-500' : 'border-emerald-500') : 'border-white/10'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="History log" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Zap size={16} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}