import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const animales = ["red fox", "grey wolf", "lynx", "calico cat", "snow leopard", "coyote"];

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Falta configurar GEMINI_API_KEY en Vercel.");

    const ai = new GoogleGenAI({ apiKey });
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: "Falta la imagen" }, { status: 400 });

    const animal = animales[Math.floor(Math.random() * animales.length)];
    const base64Data = image.split(",")[1] || image;

    console.log(`⚡ Procesando con Nano Banana (Gemini 2.5 Flash Image)...`);

    // Seguimos la estructura oficial: prompt + imagen en el array de contents
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        { text: `Raw candid full-body photo of a person in a misty forest. The person is wearing a realistic handmade ${animal} mask (accessory) over their face and a matching fluffy ${animal} tail, Dynamic quadruped pose in a foggy,Authentic textures, natural handheld camera aesthetic, shot on 35mm lens, f/1.8, slight motion blur, strictly preserving the user's original clothing and hair. No digital art style, no CGI, high-fidelity photographic realism` },
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Data,
          },
        },
      ],
    });

    // ✨ LÓGICA DE EXTRACCIÓN SEGÚN DOCUMENTACIÓN ✨
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No se recibieron partes en la respuesta de Gemini.");
    }

    // Buscamos la parte que contiene los datos de la imagen (inlineData)
    const imagePart = parts.find((part: any) => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      const generatedBase64 = imagePart.inlineData.data;
      
      // Enviamos el Base64 listo para que el frontend lo use en el <img>
      return NextResponse.json({ 
        output: `data:image/png;base64,${generatedBase64}` 
      });
    }

    throw new Error("El modelo respondió con texto pero sin la imagen generada.");

  } catch (error: any) {
    console.error("❌ Error en el motor de Google:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}