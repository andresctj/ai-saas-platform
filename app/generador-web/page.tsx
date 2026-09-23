"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function GeneratorContent() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState(searchParams.get('prompt') || "");
  const [industria, setIndustria] = useState("general");
  const [status, setStatus] = useState("idle"); 
  const [image, setImage] = useState("");
  
  const [formData, setFormData] = useState({ nombre: "", pais: "+593", whatsapp: "", email: "" });
  const [enviado, setEnviado] = useState(false);

  // NUEVA FUNCIÓN CONECTADA A GEMINI 2.5 FLASH LITE
  const inspiracionAlAzar = async () => {
  setPrompt("✨ Gemini está pensando..."); 
  
  try {
    const res = await fetch('/api/generate-idea', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industria }) // Enviamos la industria seleccionada
    });
    const data = await res.json();
    
    if (data.idea) {
      setPrompt(data.idea);
    }
  } catch (err) {
    setPrompt("Un spa de lujo llamado AURA, con estética zen y colores arena.");
  }
};

  useEffect(() => {
    const detectarPais = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_calling_code) setFormData(prev => ({ ...prev, pais: data.country_calling_code }));
      } catch (error) { }
    };
    detectarPais();
  }, []);

  const generarBosquejoInteligente = async () => {
    if (!prompt || prompt.includes("Gemini está pensando")) return;
    setStatus("designing");
    setImage("");
    setEnviado(false);
    try {
      const res = await fetch('/api/generate-image-web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, industria }) 
      });
      const data = await res.json();
      if (data.imageUrl) { setImage(data.imageUrl); setStatus("ready"); }
    } catch (err) { setStatus("idle"); }
  };

  const enviarLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: formData.nombre, whatsapp: `${formData.pais} ${formData.whatsapp}`, email: formData.email, imagenUrl: image })
      });
      if (res.ok) setEnviado(true);
    } catch (err) { }
    setStatus("ready");
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-12 font-sans selection:bg-indigo-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* PANEL DE CONTROL */}
        <div className="lg:col-span-1 space-y-8 bg-white/[0.03] p-10 rounded-[3.5rem] border border-white/10 h-fit backdrop-blur-3xl shadow-2xl">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-[10px] font-black text-gray-600 hover:text-indigo-400 uppercase tracking-widest">
              ← TMZ Solutions
            </Link>
            <button 
              onClick={inspiracionAlAzar} 
              disabled={prompt.includes("Gemini está pensando")}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 p-3 rounded-2xl transition-all active:scale-90 disabled:opacity-50" 
              title="Idea Aleatoria"
            >
              ✨
            </button>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none">AI Website</h2>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.3em]">Bosquejos instantáneos</p>
          </div>

          <div className="space-y-6">
            {/* SELECTOR DE INDUSTRIA */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Tipo de Negocio</label>
              <select 
                value={industria} 
                onChange={(e) => setIndustria(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-sm text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer transition-all"
              >
                <option value="general">💼 Negocio General</option>
                <option value="spa">🧖‍♀️ Spa y Bienestar</option>
                <option value="supermercado">🛒 Supermercado</option>
                <option value="fabrica">🏭 Fábrica / Industrial</option>
                <option value="mecanica">🔧 Taller Mecánico</option>
                <option value="turismo">✈️ Agencia de Viajes</option>
                <option value="belleza">💄 Belleza y Cosméticos</option>
                <option value="salud">🏥 Salud / Clínica</option>
                <option value="veterinaria">🐾 Veterinaria</option>
                <option value="agencia">🚀 Agencia Digital</option>
                <option value="portafolio">👤 Portafolio Personal</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Escribe el nombre de la empresa o idea</label>
              <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] p-6 text-sm text-white h-32 resize-none focus:border-indigo-500 outline-none transition-all shadow-inner" 
                placeholder="Ej: AURA SPA..." 
              />
            </div>

            <button 
              onClick={generarBosquejoInteligente} 
              disabled={status === "designing" || !prompt || prompt.includes("Gemini")} 
              className="w-full py-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {status === "designing" ? "Analizando..." : "Lanzar Storyboard"}
            </button>
          </div>
        </div>

        {/* VISUALIZADOR */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative aspect-video w-full bg-white/[0.01] border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl flex items-center justify-center">
            {status === "designing" && (
              <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_40px_rgba(99,102,241,0.3)]"></div>
                <p className="text-white text-[9px] uppercase tracking-widest italic animate-pulse px-10">Generando diseño de 4 vistas especializado...</p>
              </div>
            )}
            {image ? (
              <img src={image} className="w-full h-full object-contain animate-in fade-in zoom-in duration-700" alt="Result" />
            ) : (
              <div className="flex h-full items-center justify-center flex-col gap-8 opacity-10">
                <div className="w-32 h-32 border-2 border-dashed border-white/20 rounded-full animate-[spin_30s_linear_infinite]"></div>
                <p className="font-black uppercase tracking-[1em] text-[10px] italic">Esperando ADN Visual</p>
              </div>
            )}
          </div>

          {/* FORMULARIO DE VENTAS */}
          {image && (
            <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 space-y-10 animate-in slide-in-from-bottom-10 duration-700 backdrop-blur-md">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                <div className="space-y-3">
                  <h3 className="text-4xl font-black uppercase italic leading-none">Sitio <span className="text-indigo-500 underline">4 vistas</span></h3>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xl line-through font-bold decoration-red-500/50">ANTES $350</span>
                    <p className="text-white text-5xl font-black mt-1">OFERTA $200</p>
                  </div>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest bg-indigo-500/10 py-2 px-4 rounded-full inline-block">
                    Incluye Hosting + Dominio .com (1 año GRATIS)
                  </p>
                </div>
                <div className="bg-indigo-600 text-white px-10 py-5 rounded-full font-black uppercase text-xl italic shadow-2xl shadow-indigo-600/40 animate-bounce">¡LO QUIERO!</div>
              </div>

              {!enviado ? (
                <form className="space-y-4 border-t border-white/5 pt-10" onSubmit={enviarLead}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" required placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="bg-white/5 border border-white/10 rounded-3xl p-5 text-sm outline-none focus:border-indigo-500" />
                    <input type="email" required placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-white/5 border border-white/10 rounded-3xl p-5 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={formData.pais} onChange={(e) => setFormData({...formData, pais: e.target.value})} className="bg-white/5 border border-white/10 rounded-3xl p-5 text-sm outline-none appearance-none cursor-pointer">
                      <option value="+593">🇪🇨 EC (+593)</option>
                      <option value="+1">🇺🇸 US (+1)</option>
                      <option value="+34">🇪🇸 ES (+34)</option>
                      <option value="+57">🇨🇴 CO (+57)</option>
                      <option value="+52">🇲🇽 MX (+52)</option>
                    </select>
                    <input type="tel" required placeholder="WhatsApp" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="bg-white/5 border border-white/10 rounded-3xl p-5 text-sm outline-none focus:border-indigo-500" />
                    <button type="submit" disabled={status === "sending"} className="bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-3xl hover:bg-indigo-600 hover:text-white transition-all shadow-xl disabled:opacity-50">
                      {status === "sending" ? "Procesando..." : "Confirmar Mi Sitio"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-indigo-600/20 border border-indigo-500/50 p-10 rounded-[3rem] text-center">
                  <p className="text-white font-black uppercase text-sm tracking-[0.3em] animate-pulse">🚀 ¡Cupo de Oferta Reservado!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WebGeneratorPage() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen" />}>
      <GeneratorContent />
    </Suspense>
  );
}