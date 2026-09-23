import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: Request) {
  // Verificamos que el token de Replicate esté configurado
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Token de Replicate no encontrado" }, { status: 500 });
  }

  const replicate = new Replicate({ auth: token });

  try {
    const { image, prompt } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No se proporcionó ninguna imagen" }, { status: 400 });
    }

    // Limpieza de Base64 para evitar errores de formato en la API
    const cleanImage = image.includes(",") ? image.split(",")[1] : image;

    // Prompt optimizado para productos de Riverlabs y seguridad alimentaria
    const visionPrompt = `Analiza este producto microbiológico. 
    Contexto adicional: ${prompt}.
    Extrae estrictamente en formato JSON:
    1. "product_name": Nombre del producto o empresa (ej: Riverlabs).
    2. "colors": 3 colores HEX dominantes para un diseño de laboratorio (ej: ["#0056b3", "#FFFFFF", "#e9ecef"]).
    3. "style": Definir como "Professional Laboratory" o "Clinical Corporate".
    4. "marketing_copy": Un titular sobre seguridad alimentaria e ISO 11133:2014.
    5. "technical_focus": Menciona si es para aguas, bebidas o alimentos.`;

    // Ejecución del modelo NVIDIA Nemotron Nano VL
    const output: any = await replicate.run(
      "nvidia/nemotron-nano-v2-12b-vl",
      {
        input: {
          image: cleanImage,
          prompt: visionPrompt
        }
      }
    );

    // Intentamos parsear la salida para asegurar que sea un JSON válido
    let analysis;
    try {
      // Algunos modelos devuelven strings con markdown, limpiamos si es necesario
      const jsonString = typeof output === 'string' ? output.replace(/```json|```/g, "").trim() : output;
      analysis = JSON.parse(jsonString);
    } catch (e) {
      console.error("Error parseando JSON de la IA:", output);
      // Fallback en caso de que la IA no devuelva un JSON perfecto
      analysis = {
        product_name: "Riverlabs Solutions",
        colors: ["#004a99", "#ffffff", "#f4f4f4"],
        style: "Modern Laboratory",
        marketing_copy: "Excelencia en Inocuidad Alimentaria e ISO 11133:2014"
      };
    }

    return NextResponse.json({ analysis });

  } catch (error: any) {
    console.error("❌ REPLICATE ERROR:", error.message);
    return NextResponse.json({ 
      error: "Error en el servidor de IA", 
      details: error.message 
    }, { status: 500 });
  }
}