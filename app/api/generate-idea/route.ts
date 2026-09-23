import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Bypass de tipos para evitar errores de VS Code
const genAI: any = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { industria } = await req.json(); // Recibimos la industria del frontend

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    // Personalizamos el prompt con la industria seleccionada
    const prompt = `Actúa como un experto en branding. 
    Genera una idea de negocio creativa específicamente para el sector de: ${industria}.
    Responde en una sola frase con este formato: 
    "Un [TIPO DE NEGOCIO] llamado [NOMBRE], con estética [ESTILO] y colores [PALETA]."`;

    const result = await model.generateContent(prompt);
    const idea = result.response.text().trim();

    return NextResponse.json({ idea });
  } catch (error: any) {
    return NextResponse.json({ 
      idea: "Un spa de lujo llamado AURA, con estética zen y colores arena y turquesa." 
    });
  }
}