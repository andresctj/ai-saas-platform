import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: Request) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return NextResponse.json({ error: "API Token no configurado" }, { status: 500 });

  const replicate = new Replicate({ auth: token });

  try {
    const { image, audio, prompt, start_time, end_time } = await req.json();

    if (!image || !audio) {
      return NextResponse.json({ error: "Faltan archivos de imagen o audio" }, { status: 400 });
    }

    // Parámetros oficiales del modelo Omni-Human 1.5
    const input = {
      image: image,    // Base64 o URL
      audio: audio,    // Base64 o URL (Máximo 35 segundos)
      prompt: prompt || "A person talking naturally to the camera",
      start_time: start_time || 0,
      end_time: end_time || 15,
      fast_mode: false // Calidad cinematográfica activada
    };

    console.log("🎬 Iniciando renderizado en ByteDance...");

    const output: any = await replicate.run("bytedance/omni-human-1.5", { input });

    // Extraer la URL del video generado
    const videoUrl = typeof output === 'string' ? output : output.url?.() || output;

    return NextResponse.json({ video: videoUrl });

  } catch (error: any) {
    console.error("❌ ERROR REPLICATE:", error.message);
    
    // Captura de errores de seguridad (Sensitive)
    if (error.message.includes("sensitive")) {
      return NextResponse.json({ error: "Filtro de seguridad: El contenido fue marcado como sensible." }, { status: 422 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}