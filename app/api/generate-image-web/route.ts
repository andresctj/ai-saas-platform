import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Tiempo de espera extendido para generaciones 4K complejas
export const maxDuration = 300;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// DICCIONARIO CON TUS PROMPTS ORIGINALES COMPLETOS
const PLANTILLAS_MAESTRAS: Record<string, string> = {
  spa: `Genera un ladingpage 4 vistas en una sola imagen, PANTALLA 1, PANTALLA 2, PANTALLA 3, PANTALA 4, en ultra alta resolución (4K), formato mockup profesional tipo Figma/Behance, en una cuadrícula 2x2 (2 filas x 2 columnas). Deben verse 4 pantallas rectangulares SEPARADAS de un sitio web (4 vistas distintas) para un SPA premium. Vista frontal recta (0° tilt), sin perspectiva chueca, sin marcos de celular, con márgenes uniformes entre pantallas y alineación perfecta.
Identidad: Nombre “AURA SPA”, Estética lujo sereno, Paleta marfil + arena + verde salvia + dorado suave
PANTALLA 1: HOME/HERO “Rituales de bienestar para cuerpo y mente”.
PANTALLA 2: SERVICIOS con Masaje Relajante, Piedras Calientes, Facial.
PANTALLA 3: PAQUETES/MEMBRESÍAS con tabla de 3 planes (Esencial, Premium, Elite).
PANTALLA 4: RESERVA con módulo de booking, calendario y formulario limpio.`,

  supermercado: `Genera un ladingpage 4 vistas en una sola imagen, PANTALLA 1, PANTALLA 2, PANTALLA 3, PANTALA 4,  en ultra alta resolución (4K) con formato mockup profesional tipo Figma, en una cuadrícula 2x2 (2 filas x 2 columnas). Deben verse 4 pantallas rectangulares SEPARADAS (4 vistas distintas) de un sitio web para SUPERMERCADOS. Vista frontal recta, sin inclinación.
Identidad: Marca “MARA Supermercados”, Paleta verde + amarillo + blanco.
PANTALLA 1: HOME/HERO con barra de búsqueda grande “¿Qué estás buscando?”.
PANTALLA 2: OFERTAS con badges "-30%", "2x1", filtros laterales de precio y marca.
PANTALLA 3: CATEGORÍA FRESCOS con grid de productos (foto + precio por kg).
PANTALLA 4: CARRITO/CHECKOUT con lista de productos, subtotal y sellos de pago seguro.`,

  fabrica: `Genera un ladingpage 4 vistas en una sola imagen, PANTALLA 1, PANTALLA 2, PANTALLA 3, PANTALA 4,  ultra alta resolución (4K) con formato mockup profesional tipo Figma/Behance, en una cuadrícula 2x2 (2 filas x 2 columnas). Deben verse 4 pantallas rectangulares SEPARADAS de una landing page para una FÁBRICA / INDUSTRIA (B2B). 
Identidad: Marca “[NOMBRE] Manufacturing”, Estilo industrial moderno, Paleta azul marino + gris acero + blanco + naranja.
PANTALLA 1: HOME/HERO “Fabricación industrial de alta precisión” con KPI strip.
PANTALLA 2: CAPACIDADES con cards de CNC, Ensamble, Inyección y Proceso en pasos.
PANTALLA 3: PRODUCTOS/SECTORES con grid técnico y tabla de especificaciones.
PANTALLA 4: CONTACTO/COTIZACIÓN con formulario B2B completo y opción de adjuntar planos.`,

  mecanica: `Genera un ladingpage 4 vistas en una sola imagen, PANTALLA 1, PANTALLA 2, PANTALLA 3, PANTALA 4,  ultra alta resolución (4K) con formato mockup profesional tipo Figma/Behance, en una cuadrícula 2x2 (2 filas x 2 columnas). Deben verse 4 pantallas rectangulares SEPARADAS de una landing page para un TALLER MECÁNICO.
Identidad: Marca “[NOMBRE] Taller Automotriz”, Paleta negro/grafito + gris + blanco + rojo/amarillo.
PANTALLA 1: HOME/HERO “Mecánica confiable y rápida para tu vehículo”.
PANTALLA 2: SERVICIOS con Cambio de aceite, Frenos, Escáner y bloque “¿Cómo trabajamos?”.
PANTALLA 3: PROMOCIONES con paquetes de mantenimiento básico y full servicio.
PANTALLA 4: RESERVA con campos de Placa, Marca/Modelo y mapa de ubicación.`,

  turismo: `Genera un ladingpage 4 vistas en una sola imagen, PANTALLA 1, PANTALLA 2, PANTALLA 3, PANTALA 4,  en ultra alta resolución (4K) con formato mockup profesional tipo Figma/Behance, en una cuadrícula 2x2 (2 filas x 2 columnas). Deben verse 4 pantallas rectangulares SEPARADAS de una landing page para una AGENCIA DE VIAJES.
Identidad: Marca “[NOMBRE] Travel”, Paleta azul océano + blanco + arena + coral.
PANTALLA 1: HOME/HERO con buscador grande (Destino, Fechas, Personas).
PANTALLA 2: DESTINOS DESTACADOS con cards de playa, aventura y lujo.
PANTALLA 3: PAQUETES/ITINERARIOS con timeline de días (Día 1 al Día 5).
PANTALLA 4: COTIZACIÓN con formulario rápido y checkboxes de tipo de viaje.`,

  belleza: `Genera un ladingpage 4 vistas en una sola imagen, PANTALLA 1, PANTALLA 2, PANTALLA 3, PANTALA 4,  ultra alta resolución (4K) con formato mockup profesional tipo Figma/Behance, en una cuadrícula 2x2 (2 filas x 2 columnas). Deben verse 4 pantallas rectangulares SEPARADAS de una landing page para BELLEZA Y COSMÉTICOS.
Identidad: Marca “[NOMBRE] Beauty”, Paleta blanco + rosa nude + dorado suave.
PANTALLA 1: HOME/HERO “Piel radiante, rutina simple” con textura de crema.
PANTALLA 2: BEST SELLERS con badges de “Nuevo” y “Top”, filtros de hidratación.
PANTALLA 3: PRODUCTO DETALLE (Serum Vitamina C) con selector de tamaño y beneficios.
PANTALLA 4: RUTINA / QUIZ con resultado de 3 pasos y formulario newsletter.`,

  salud: `Genera un ladingpage 4 vistas en una sola imagen, PANTALLA 1, PANTALLA 2, PANTALLA 3, PANTALA 4,  ultra alta resolución (4K) con formato mockup profesional tipo Figma/Behance, en una cuadrícula 2x2 (2 filas x 2 columnas). Deben verse 4 pantallas rectangulares SEPARADAS de una landing page para SALUD Y MEDICINA.
Identidad: Marca “CLÍNICA [NOMBRE]”, Paleta blanco + azul médico + verde menta.
PANTALLA 1: HOME/HERO “Atención médica integral y humana”.
PANTALLA 2: ESPECIALIDADES con grid de medicina general, pediatría, cardiología.
PANTALLA 3: SERVICIOS/EXÁMENES con lista de precios y proceso de atención.
PANTALLA 4: CITA ONLINE con selector de modalidad (Presencial/Telemedicina) y FAQ.`,

  veterinaria: `Genera un ladingpage 4 vistas en una sola imagen, PANTALLA 1, PANTALLA 2, PANTALLA 3, PANTALA 4,  ultra alta resolución (4K) con formato mockup profesional tipo Figma/Behance, en una cuadrícula 2x2 (2 filas x 2 columnas). Deben verse 4 pantallas rectangulares SEPARADAS de una landing page para VETERINARIA.
Identidad: Marca “VETCARE [NOMBRE]”, Paleta blanco + verde menta + azul suave + coral.
PANTALLA 1: HOME/HERO “Cuidamos a tu mascota como familia”.
PANTALLA 2: SERVICIOS con Consulta, Vacunas, Cirugía y Grooming.
PANTALLA 3: VACUNAS + PLANES con calendario de vacunas amigable por edades.
PANTALLA 4: CONTACTO/RESERVA con formulario de mascota y bloque de emergencias.`,

  agencia: `Genera un ladingpage 4 vistas en una sola imagen, PANTALLA 1, PANTALLA 2, PANTALLA 3, PANTALA 4,  ultra alta resolución (4K) con formato mockup profesional tipo Figma/Behance, en una cuadrícula 2x2 (2 filas x 2 columnas). Deben verse 4 pantallas rectangulares SEPARADAS de una landing page para una AGENCIA DIGITAL.
Identidad: Marca “[NOMBRE] Digital”, Estilo tech oscuro, Paleta negro/grafito + degradados morado/cian.
PANTALLA 1: HOME/HERO “Impulsamos marcas con estrategia, diseño y performance”.
PANTALLA 2: SERVICIOS con Branding, UX/UI, Ads y automatización.
PANTALLA 3: CASOS DE ÉXITO con métricas KPI (ROAS, Conversión) y testimonios.
PANTALLA 4: CONVERSIÓN con formulario premium y selector de servicios por chips.`,

  portafolio: `Genera un ladingpage 4 vistas en una sola imagen, PANTALLA 1, PANTALLA 2, PANTALLA 3, PANTALA 4,  imagen en ultra alta resolución (4K) con formato mockup profesional tipo Figma/Behance, en una cuadrícula 2x2 (2 filas x 2 columnas). Deben verse 4 pantallas rectangulares SEPARADAS de una página PERSONAL PROFESIONAL.
Identidad: Nombre “[TU NOMBRE]”, Estilo minimalista editorial, Paleta blanco/negro + gris suave.
PANTALLA 1: HOME/HERO “Hola, soy [TU NOMBRE]” con descripción de rol.
PANTALLA 2: PROYECTOS con grid de filtros (Branding, UX, Web).
PANTALLA 3: CASO DE ESTUDIO con Problema, Proceso y Resultados KPI.
PANTALLA 4: SERVICIOS + CONTACTO con formulario y links a redes profesionales.`
};

export async function POST(req: Request) {
  try {
    const { prompt, industria } = await req.json();

    // 1. Selección y personalización del prompt
    const basePrompt = PLANTILLAS_MAESTRAS[industria] || "Diseño web profesional 4K en cuadrícula 2x2.";
    const promptFinal = basePrompt
      .replace(/\[NOMBRE\]/g, prompt)
      .replace(/\[TU NOMBRE\]/g, prompt);

    console.log(`🚀 Generando Web Mockup para industria: ${industria}`);

    // 2. Ejecución con Nano Banana (Gemini 2.5 Flash Image)
    const response: any = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        { text: promptFinal }
      ],
      config: {
        numberOfImages: 1,
        aspectRatio: "1:1",
        // Optimizamos para renderizado de texto de alta fidelidad
        safetySettings: [
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      } as any
    });

    // 3. Extracción de la imagen según la estructura de partes de Google
    const parts = response.candidates?.[0]?.content?.parts;
    const imagePart = parts?.find((part: any) => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      const base64Image = imagePart.inlineData.data;
      // Retornamos el Data URI para que el frontend lo pinte directamente
      return NextResponse.json({ 
        imageUrl: `data:image/png;base64,${base64Image}` 
      });
    }

    throw new Error("El motor Nano Banana no devolvió datos de imagen.");

  } catch (error: any) {
    console.error("❌ Error en Generador Web:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}