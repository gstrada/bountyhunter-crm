'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Esquema esperado del LLM
const BountySchema = z.object({
  title: z.string(),
  reward: z.number(),
  planeta_name: z.string(),
  danger_level: z.number().min(1).max(10),
  description: z.string(),
});

export async function processBountyText(formData: FormData) {
  const rawText = formData.get("rawText") as string;
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    return { error: "API Key de IA no configurada en el servidor." };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
    Actúa como un analista del Gremio de Caza-Recompensas. 
    Analiza el siguiente mensaje de un cliente y extrae la información para un contrato formal.
    
    MENSAJE DEL CLIENTE:
    "${rawText}"
    
    REGLAS:
    1. El título debe ser corto y táctico.
    2. La recompensa debe ser un número (créditos galácticos).
    3. Identifica el planeta mencionado.
    4. Estima un nivel de peligro del 1 al 10.
    5. La descripción debe ser un resumen profesional.

    RESPONDE ÚNICAMENTE EN FORMATO JSON PURO CON ESTA ESTRUCTURA:
    {
      "title": "título",
      "reward": 0,
      "planeta_name": "nombre",
      "danger_level": 5,
      "description": "resumen"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Limpiar posible formato markdown del JSON
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const bountyData = BountySchema.parse(JSON.parse(jsonStr));

    // Persistencia en Supabase
    const supabase = await createClient();

    // 1. Asegurar que el planeta existe
    let { data: planeta, error: pError } = await supabase
      .from("planetas")
      .select("id")
      .eq("name", bountyData.planeta_name)
      .maybeSingle();

    if (pError && pError.code !== 'PGRST116') throw pError;

    if (!planeta) {
      const { data: newPlaneta, error: insPError } = await supabase
        .from("planetas")
        .insert({ 
          name: bountyData.planeta_name, 
          sector: "Sector Desconocido", 
          danger_level: bountyData.danger_level 
        })
        .select()
        .single();
      
      if (insPError) {
        if (insPError.code === '42501') return { error: "No tienes permisos de Administrador para crear planetas." };
        throw insPError;
      }
      planeta = newPlaneta;
    }

    // 2. Insertar el contrato
    const { error: insBError } = await supabase.from("bounties").insert({
      title: bountyData.title,
      reward: bountyData.reward,
      raw_description: bountyData.description,
      planeta_id: planeta?.id,
      status: "Disponible",
      metadata_ia: { original_text: rawText, processed_at: new Date().toISOString() }
    });

    if (insBError) {
      if (insBError.code === '42501') return { error: "No tienes permisos de Administrador para publicar contratos." };
      throw insBError;
    }

    revalidatePath("/dashboard");
    return { success: true, data: bountyData };

  } catch (err) {
    console.error("AI Pipeline Error:", err);
    return { error: "Error en el procesamiento galáctico. Verifique su rol de acceso." };
  }
}
