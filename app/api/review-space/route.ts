import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { spaceId } = await request.json();

  const { data: space } = await supabase
    .from("spaces")
    .select("*")
    .eq("id", spaceId)
    .eq("owner_id", user.id)
    .single();

  if (!space) return NextResponse.json({ error: "Espacio no encontrado" }, { status: 404 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ approved: false, reason: "Revisión manual pendiente" });
  }

  const prompt = `Sos un moderador de AdSpots, un marketplace de espacios publicitarios físicos en Uruguay.
Revisá si esta publicación es válida y coherente:
- Tipo: ${space.type}
- Título: ${space.title}
- Ciudad: ${space.city}
- Ubicación: ${space.location}
- Tráfico estimado: ${space.traffic} personas/día
- Formato publicitario: ${space.format}
- Precio: ${space.price} UYU/mes
- Descripción: ${space.description}

Respondé SOLO con un JSON válido (sin markdown): { "approved": true, "reason": "..." } o { "approved": false, "reason": "..." }
Aprobá si los datos son coherentes y realistas para un espacio publicitario físico en Uruguay.
Rechazá únicamente si hay: contenido inapropiado, datos claramente absurdos (tráfico de millones de personas), precio irreal, o descripción que no tiene ningún sentido.
En caso de duda, aprobá.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 150, temperature: 0 },
        }),
      }
    );

    const aiData = await res.json();
    const text = (aiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}").trim();
    const result = JSON.parse(text);

    if (result.approved === true) {
      await supabase.from("spaces").update({ approved: true }).eq("id", spaceId);
    }

    return NextResponse.json({ approved: result.approved === true, reason: result.reason ?? "" });
  } catch {
    return NextResponse.json({ approved: false, reason: "Revisión manual pendiente" });
  }
}
