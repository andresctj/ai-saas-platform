import { NextResponse } from "next/server";
import Replicate from "replicate";

export const maxDuration = 300; 

export async function POST(req: Request) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return NextResponse.json({ error: "API Token missing" }, { status: 500 });

  const replicate = new Replicate({ auth: token });

  try {
    const { analysis, prompt } = await req.json();

    // System Prompt ultra-específico para evitar basura estructural
    const systemPrompt = `Eres el Arquitecto de TMZ Solutions. Genera una Landing Page PREMIUM.
    MARCA: ${analysis?.product_name || "Aura Essences"}
    CONCEPTO: ${prompt}
    
    REGLA DE IMÁGENES: Usa EXACTAMENTE estos IDs: "GENERATING_IMAGE_HERO", "GENERATING_IMAGE_PRODUCT".
    Pon la descripción visual (sin mencionar 'web' ni 'landing') en el atributo data-prompt.
    
    IMPORTANTE: Devuelve SOLO el contenido HTML que va dentro del <body>. 
    NO incluyas etiquetas <html>, <head> ni <body>. NO uses Markdown.`;

    const output: any = await replicate.run(
      "ibm-granite/granite-3.2-8b-instruct",
      {
        input: {
          prompt: systemPrompt,
          max_new_tokens: 4000,
          temperature: 0.7
        }
      }
    );

    let htmlRaw = typeof output === 'string' ? output : output.join("");
    
    // 1. LIMPIEZA TOTAL: Eliminamos cualquier residuo de etiquetas estructurales o Markdown
    const bodyLimpio = htmlRaw
      .replace(/```html|```css|```/g, "") 
      .replace(/<html[^>]*>|<\/html>|<body[^>]*>|<\/body>|<head[^>]*>|<\/head>|<!DOCTYPE[^>]*>/gi, "")
      .replace(/#+/g, '')
      .trim();

    // 2. CONSTRUCCIÓN DEL DOCUMENTO FINAL (URLS BLINDADAS CON CONCATENACIÓN)
    const finalDocument = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="${"https://cdn" + "." + "tailwindcss.com"}"></script>
    <link rel="stylesheet" href="${"https://cdnjs" + "." + "[cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css](https://cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css)"}">
    <style>
        @import url('${"https://fonts" + "." + "[googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;700&display=swap](https://googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;700&display=swap)"}');
        
        body { 
            font-family: 'Inter', sans-serif; 
            background-color: #fdfbf7; 
            color: #1a1a1a; 
            margin: 0; 
            padding: 0;
        }
        
        h1, h2, h3 { 
            font-family: 'Playfair Display', serif; 
        }

        /* Animación Skeleton para la inyección de Flux */
        img[src^="GENERATING_IMAGE"] {
            background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
            background-size: 200% 100%;
            animation: loading-pulse 1.5s infinite;
            min-height: 350px;
            display: block;
        }

        @keyframes loading-pulse {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    </style>
</head>
<body class="p-0 m-0 overflow-x-hidden">
    ${bodyLimpio} 
</body>
</html>
    `.trim();

    return NextResponse.json({ html: finalDocument });

  } catch (error: any) {
    console.error("❌ ERROR MOTOR:", error.message);
    return NextResponse.json({ error: "Error de arquitectura" }, { status: 500 });
  }
}