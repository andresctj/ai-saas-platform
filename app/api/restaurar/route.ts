import { NextResponse } from "next/server";
import Replicate from "replicate";

// Configuración de tiempo de ejecución para procesos pesados de IA
export const maxDuration = 60; 

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No se proporcionó imagen" }, { status: 400 });
    }

    /**
     * RAZONAMIENTO DE LA SOLUCIÓN:
     * 1. Limpiamos cualquier prefijo previo para evitar duplicidad de encabezados.
     * 2. Reconstruimos el formato 'uri' (Data URI) que exige Replicate.
     * 3. Esto elimina el error 422 "Does not match format 'uri'".
     */
    const rawBase64 = image.includes("base64,") ? image.split(",")[1] : image;
    const formattedUri = `data:image/jpeg;base64,${rawBase64}`;

    // Ejecución con la versión exacta certificada del modelo CodeFormer
    const output: any = await replicate.run(
      "sczhou/codeformer:cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2",
      {
        input: {
          image: formattedUri, 
          codeformer_fidelity: 0.5, // Balance entre restauración y realismo
          upscale: 2,
          face_upsample: true,
          background_enhance: true
        }
      }
    );

    // Validación y extracción de la URL de salida
    const finalUrl = typeof output === 'string' ? output : output.url ? output.url() : output[0];

    if (!finalUrl) {
      throw new Error("El motor no devolvió un resultado válido.");
    }

    return NextResponse.json({ output: finalUrl });

  } catch (error: any) {
    // Log detallado para depuración en la terminal
    console.error("DEBUG REPLICATE ERROR:", error.message);
    
    return NextResponse.json(
      { error: "Error en el motor de restauración: " + error.message }, 
      { status: 500 }
    );
  }
}