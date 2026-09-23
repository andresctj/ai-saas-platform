import { NextResponse } from "next/server";
import Replicate from "replicate";

export const maxDuration = 300; 

export async function POST(req: Request) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return NextResponse.json({ error: "API Token missing" }, { status: 500 });

  const replicate = new Replicate({ auth: token });

  try {
    const { analysis, prompt } = await req.json();

    const systemPrompt = `
      Actúa como un Desarrollador Senior de TMZ Solutions. Tu misión es crear una Landing Page PROFESIONAL y COMPLETA.
      
      NEGOCIO A DISEÑAR:
      - Descripción: "${prompt}"
      - Marca: ${analysis?.product_name || "Empresa Pro"}
      - Paleta de Colores: ${analysis?.colors?.join(", ") || "#6366f1, #000000"}

      INSTRUCCIONES TÉCNICAS DE IMÁGENES (CRÍTICO):
      1. No uses imágenes de stock externas ni placeholders de colores.
      2. En el Hero, usa exactamente: <img id="hero-img" src="GENERATING_IMAGE_HERO" alt="Hero Principal" class="w-full h-full object-cover">.
      3. En la sección de productos o servicios, usa: <img src="GENERATING_IMAGE_PRODUCT" class="rounded-xl">.
      4. Mi sistema reemplazará esos textos por fotos reales generadas por IA.

      ESTRUCTURA DE CÓDIGO:
      - Usa HTML5 y Tailwind CSS puro.
      - El diseño debe ser "Premium": usa espaciados amplios (py-20), tipografía Inter y sombras suaves.
      - Si el negocio es industrial (como Riverlabs), añade una sección de "Certificaciones e Inocuidad".
      - Si es de servicios (como AutoTech), añade un botón flotante de WhatsApp.

      ENTREGA:
      - DEVUELVE ÚNICAMENTE EL CÓDIGO HTML (sin markdown como \`\`\`html).
    `;

    const output: any = await replicate.run(
      "ibm-granite/granite-3.2-8b-instruct",
      {
        input: {
          prompt: systemPrompt,
          max_new_tokens: 3800, // Aumentado para páginas más largas y terminadas
          temperature: 0.7
        }
      }
    );

    let htmlContent = typeof output === 'string' ? output : output.join("");
    htmlContent = htmlContent.replace(/```html|```css|```/g, "").trim();

    // ENVOLTURA DE ALTA DEFINICIÓN
    const finalDocument = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>
          <link rel="stylesheet" href="[https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css)">
          <style>
            @import url('[https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap)');
            body { font-family: 'Inter', sans-serif; scroll-behavior: smooth; }
            /* Animación de carga para las imágenes que aún se están generando */
            img[src^="GENERATING_IMAGE"] {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: skeleton-loading 1.5s infinite;
              min-height: 300px;
            }
            @keyframes skeleton-loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          </style>
        </head>
        <body class="bg-white text-slate-900">
          ${htmlContent}
        </body>
      </html>
    `;

    return NextResponse.json({ html: finalDocument });

  } catch (error: any) {
    console.error("❌ ERROR GENERADOR:", error.message);
    return NextResponse.json({ error: "Error en el motor de arquitectura" }, { status: 500 });
  }
}