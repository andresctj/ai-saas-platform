"use client";
import React from 'react';
import Link from 'next/link';

const services = [
  {
    category: "AI CREATIVE STUDIO",
    items: [
      { title: "Composición Musical IA", desc: "Generación de pistas, letras y arreglos profesionales con Lyria 3.", icon: "🎵" },
      { title: "Generación de Imagen Pro", desc: "Arte conceptual y fotorrealismo avanzado con Nano-Banana 2.", icon: "🎨" },
      { title: "Videos Comerciales", desc: "Producción cinematográfica de alta fidelidad con tecnología Veo.", icon: "🎬" },
      { title: "Entrenamiento de Modelos", desc: "Fine-tuning de modelos IA personalizados para tu marca.", icon: "🧠" },
    ]
  },
  {
    category: "SOFTWARE & E-COMMERCE",
    items: [
      { title: "Webs Modernas & Apps", desc: "Desarrollo de alto rendimiento con Next.js 15 y Node.js.", icon: "⚡" },
      { title: "E-commerce Medusa.js", desc: "Tiendas escalables con integración total de pagos y logística.", icon: "🛒" },
      { title: "Sistemas ERP/CRM", desc: "Implementación y personalización de ERPNext, SAP y CRMs modulares.", icon: "📊" },
      { title: "Juegos Web Dinámicos", desc: "Experiencias interactivas y gamificación para eventos masivos.", icon: "🕹️" },
    ]
  },
  {
    category: "STRATEGY & GROWTH",
    items: [
      { title: "Consultoría SEO & SEM", desc: "Posicionamiento orgánico y campañas de pago de alto impacto.", icon: "🚀" },
      { title: "Campañas Digitales", desc: "Estrategia 360° para lanzamientos y presencia de marca.", icon: "📱" },
      { title: "Automatización Mautic", desc: "Email marketing y flujos de trabajo inteligentes.", icon: "📧" },
    ]
  }
];

export default function Servicios() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 overflow-x-hidden relative font-sans">
      
      {/* FONDO AMBIENTAL */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* NAVBAR SIMPLIFICADO */}
      <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xs italic">TMZ</span>
          </div>
          <span className="italic uppercase text-lg">Solutions</span>
        </Link>
        <Link href="/" className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all">
          Volver
        </Link>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24">
        
        {/* HEADER DE PÁGINA */}
        <header className="mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-[9px] font-black tracking-[0.3em] mb-6 uppercase text-emerald-400">
            Full Stack AI & Dev Agency
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
            NUESTRO <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600 italic">ARSENAL</span>
          </h1>
          <p className="mt-8 text-gray-500 max-w-2xl font-medium leading-relaxed">
            Fusionamos la potencia de la Inteligencia Artificial con el desarrollo de software de élite para transformar ideas en productos digitales de alto impacto.
          </p>
        </header>

        {/* CUADRÍCULA DE SERVICIOS */}
        <div className="space-y-32">
          {services.map((group, idx) => (
            <section key={idx}>
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-xs font-black uppercase tracking-[0.5em] text-emerald-500/60">{group.category}</h2>
                <div className="flex-1 h-[1px] bg-white/5"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {group.items.map((item, i) => (
                  <div key={i} className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:bg-white/[0.04]">
                    <div className="text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                    <h3 className="text-lg font-black uppercase tracking-tight mb-3 text-white group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA FINAL */}
        <section className="mt-40 p-12 md:p-24 rounded-[3rem] bg-gradient-to-br from-emerald-600/20 to-indigo-900/20 border border-white/10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">¿Listo para el siguiente nivel?</h2>
            <button className="bg-emerald-500 text-black px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all shadow-2xl">
              Agenda una consultoría gratuita
            </button>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        </section>

      </main>

      <footer className="py-12 text-center opacity-30 border-t border-white/5">
        <p className="text-[9px] tracking-[0.6em] uppercase font-black">TMZ SOLUTIONS • {new Date().getFullYear()} • ECUADOR</p>
      </footer>
    </div>
  );
}