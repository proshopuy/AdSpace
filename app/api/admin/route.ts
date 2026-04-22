import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const { spaceId, action } = await request.json();

  if (!spaceId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  if (action === "approve") {
    await supabase.from("spaces").update({ approved: true }).eq("id", spaceId);
  } else {
    await supabase.from("spaces").delete().eq("id", spaceId);
  }

  return NextResponse.json({ ok: true });
}
