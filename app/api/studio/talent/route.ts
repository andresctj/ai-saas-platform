import { NextResponse } from "next/server";
import Replicate from "replicate";
import { translate } from '@vitalets/google-translate-api';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// --- LIBRERÍA DE ESTILOS PULIDOS (Basados en tu lista) ---
const PROMPTS_HOMBRE = [
  "Attractive SUBJECT, a serious and sexy gaze towards the camera, wearing a tight short-sleeved t-shirt that hugs his chest and shows , tight boxer briefs with light details, a large and pronounced bulge noticeable in the boxer briefs, a clearly delineated and detailed semi-erect penis, exposed crotch while sitting casually with his legs open on the sofa, interior of a modern apartment, soft natural light, hyperrealistic and detailed fabric texture in jeans and shirt, cinematic portrait, raw",
  "A realistic social media selfie of a teenage   SUBJECT lying down. He has messy, voluminous 'fluffy' hair and striking, wide-open bright eyes. He is making a playful 'pouty' or slight 'duck face' expression with his lips. He's wearing a dusty hoodie and a thin beaded necklace. The background shows a textured sofa and a pillow. Soft, direct natural lighting, high detail, 4k.",
  "Candid low-light night photograph of SUBJECT, joyful smile, white graphic t-shirt, backwards baseball cap, silver chain, urban setting, blurred window lights, grainy flash-lit aesthetic.",
  "Spontaneous selfie in front of the mirror, SUBJECT if you can see his face, he has an iPhone 16 Pro Max, wavy hair, wearing a football team t-shirt, living room background, realistic fabric folds, unposed snapshot.",
    "Shirtless SUBJECT by a forest stream, wearing tight trunks soaked wet and clinging to the body, anatomically accurate physics, subtle bulge, wet fabric tension, high detail,(full body portrait head to toe no crop:1.4), (wide vertical composition:1.3), (entire head visible with hair:1.2)",
    "Selfie of a SUBJECT on a sofa, wearing a ribbed t-shirt and a pendant, in a living room dimly lit at night, with the warm light of a lamp.",
    "Rebellious portrait of SUBJECT, freckles, nose ring, holding a cigarette, silver chain, torn t-shirt, intense sunlight, daring style.",
    "Candid shot of SUBJECT sitting in a cozy coffee shop, holding a latte art cup, soft window light hitting his face, wooden table, blurred background with espresso machine and plants, wearing a casual sweater, warm aesthetic, 4k resolution.",
    "Candid photo of SUBJECT on a bed, looking back over shoulder, casual top, sunlit bedroom, warm window light.",
"Gripped urban portrait of SUBJECT, disheveled, freckled, nose ring, holding a cigarette, silver chain, torn white t-shirt, direct and intense sunlight, white brick wall."

];

const PROMPTS_MUJER = [
   "Close-up selfie of SUBJECT, straight hair, choppy fringe, striking eyes, rosy blush, lace top, soft side lighting, film grain, blurred bedroom wall",
  "Candid photo of SUBJECT kneeling on a bed, looking back over shoulder,  off-the-shoulder top, light wash jeans, sunlit bedroom, warm window light.",
"A candid outdoor portrait of a young woman with long, wavy light hair, smiling gently at the camera. She is sitting on a large rock, wearing a ruched mini-dress floral with puffed sleeves and a sweetheart neckline. Her skin is sun-kissed, and she wears small hoop earrings and a delicate necklace. The background is a lush green field with trees and bushes under natural daylight,sexy",
"Rebellious portrait of SUBJECT, freckles, nose ring, holding a cigarette, silver chain, torn t-shirt, intense sunlight, daring style.",
"Selfie of a SUBJECT on a sofa, wearing a ribbed t-shirt and a pendant, in a living room dimly lit at night, with the warm light of a lamp.",
  "Candid outdoor photo of SUBJECT, pink floral bikini top and sarong, patio background, tropical plants, palm trees, bright daylight.",
  "Wide shot, wide-angle perspective. The model is relaxing by a stream in the woods. SUBJECT wearing a pastel two-piece bikini with a wet look, achieving an elegant and natural pose. (Full-body portrait, head to toe, uncropped: 1.4), (Panoramic vertical composition: 1.3), (Full head visible with hair: 1.2). Ground and feet visible, distant camera, 8k RAW photo",
  "Candid low-light night photograph of SUBJECT, joyful smile, white graphic t-shirt, silver chain, urban setting, blurred window lights, grainy flash-lit aesthetic",
  "Spontaneous selfie in front of the mirror, SUBJECTif you can see her face, she has an iPhone 16 Pro Max, wavy hair, wearing a casual t-shirt, living room background, realistic fabric folds, unposed snapshot.",
  "Candid shot of SUBJECT sitting in a cozy coffee shop, holding a latte art cup, soft window light hitting her face, wooden table, blurred background with espresso machine and plants, wearing a casual sweater, warm aesthetic, 4k resolution."
];

export async function POST(req: Request) {
  try {
    const { description, gender } = await req.json();

    // 1. TRADUCCIÓN (Tu lógica original)
    let translatedText = description;
    try {
      const res = await translate(description, { to: 'en' });
      translatedText = res.text;
    } catch (err) {
      console.error("⚠️ Fallo traducción:", err);
    }

    // 2. SELECCIÓN DE ESTILO (La Ruleta)
    const lista = gender === 'hombre' ? PROMPTS_HOMBRE : PROMPTS_MUJER;
    const styleTemplate = lista[Math.floor(Math.random() * lista.length)];

    // 3. FUSIÓN: Metemos tu 'description' donde dice 'SUBJECT'
    // Agregamos también tus parámetros de calidad al final del prompt
    const finalPrompt = `${styleTemplate.replace(/SUBJECT/g, translatedText)}. QUALITY: Slightly raw, natural, no beauty filters, mobile camera aesthetic, real life snapshot.`;

 const input = {
      go_fast: false,        // Agregamos este parámetro del ejemplo
      width: 640,            // Formato más cinematográfico
      height: 1280,
      prompt: finalPrompt,
      output_format: "jpg",
      output_quality: 80,    // Bajamos a 80 (a veces demasiada calidad genera ruido)
      guidance_scale: 0,     // CAMBIO VITAL: Volvemos a 0 para naturalidad extrema
      num_inference_steps: 8 // CAMBIO VITAL: Volvemos a 8 pasos
    };

    console.log("🔥 Ejecutando Forja con estilo aleatorio...");
    const output: any = await replicate.run("prunaai/z-image-turbo", { input });

    // 4. EXTRACCIÓN BLINDADA (Tu lógica de seguridad)
    let urlFinal = "";
    if (Array.isArray(output)) {
      urlFinal = String(output[0]);
    } else if (output) {
      urlFinal = String(output);
    }

    if (!urlFinal || !urlFinal.startsWith("http")) {
      throw new Error("No se pudo obtener una URL válida de la imagen.");
    }

    return NextResponse.json({ url: urlFinal });

  } catch (error: any) {
    console.error("❌ Error Crítico:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}