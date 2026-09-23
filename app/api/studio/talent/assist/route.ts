import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Bypass de tipos exacto al de tu Home
const genAI: any = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt, forceNew } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    // Si forceNew es true, ignoramos el prompt actual para no quedar en bucle
    const instruccion = (forceNew || !prompt || prompt.includes("Gemini está"))
      ? "GENERA UN PERSONAJE TOTALMENTE NUEVO. Obligatorio: Cambia el género (50% hombre / 50% mujer), elige una edad aleatoria entre 18 y 25 años, y una etnia distinta a la anterior."
      : `Refina este ADN técnico: ${prompt}`;

    const systemPrompt = `
   Eres un generador de prompts fotográficos hiperrealistas para una influencer ADULTA (mínimo 21 años). Debes cumplir reglas estrictas y devolver SOLO 4 líneas con el formato exacto solicitado, sin listas, sin metáforas, sin frases tipo “mirada hipnótica” ni “historias en la piel”.
      ${instruccion}
      
IDENTIDAD FIJA (mantener constante en todas las generaciones):
Persona adulta de {EDAD} años (mínimo 21), {GENERO}, complexión {COMPLEXION}, altura aproximada {ALTURA_CM} cm, tono de piel {TONO_PIEL}, subtono {SUBTONO}. Rostro {FORMA_ROSTRO}, cejas {CEJAS}, nariz {NARIZ}, labios {LABIOS}, ojos {COLOR_OJOS} con forma {FORMA_OJOS}. 
Pelo: color exacto {COLOR_PELO} (especifica si es teñido o natural), textura {TEXTURA_PELO}, largo {LARGO_PELO}, peinado {PEINADO}.
Detalles de realismo obligatorios: incluir al menos 2 de estos rasgos y mantenerlos siempre: pecas (sí/no y dónde), vitíligo (sí/no y zona), pequeña cicatriz (ubicación exacta), lunar o marca de nacimiento (ubicación exacta), ligera ojeras (sí/no), textura de piel visible (poros).

REGLA 2 (TIPO DE TOMA, OBLIGATORIO según TOMA_ID):
Si {TOMA_ID}=1: cuerpo completo (full body).
Si {TOMA_ID}=2: sentado/a tomando café.
Si {TOMA_ID}=3: acostado/a en la cama.
Si {TOMA_ID}=4: plano medio (waist up).

REGLA 3 (ENTORNO):
Inventa UN lugar realista diferente cada vez (ej.: metro, mercado, lavandería, bosque, calle, oficina, etc.), con 2–3 detalles concretos del sitio (materiales, objetos, clima, hora aproximada). No repitas lugares.

REGLA 4 (FOTOGRAFÍA):
Retrato 35mm, luz natural, estética “no makeup”, piel cruda con textura real (poros, microbrillo), color realista sin look glam. Sin retoque fuerte. Nada de iluminación de estudio.

PROHIBICIONES:
Nada de metáforas. Nada de “mirada hipnótica”. Nada sexual, nada de desnudez, nada de lencería. Ropa cotidiana realista.

SALIDA (OBLIGATORIA: SOLO estas 4 líneas, sin texto extra):
FÍSICO: [describe el físico con los detalles obligatorios y constantes]
POSA: [acción + toma según TOMA_ID, describiendo postura y manos]
ENTORNO: [lugar inventado realista con detalles concretos]
FOTOGRAFÍA: [35mm, luz natural, parámetros técnicos: apertura, velocidad, ISO, WB, enfoque, DOF, grano sutil]

    `;

    const result = await model.generateContent(systemPrompt);
    const mejorado = result.response.text().trim();

    return NextResponse.json({ mejorado });
  } catch (error: any) {
    return NextResponse.json({ mejorado: "PERSONAJE: Mujer, 28 años, latina, atlética. ENTORNO: Loft industrial. FOTOGRAFÍA: 35mm." });
  }
}