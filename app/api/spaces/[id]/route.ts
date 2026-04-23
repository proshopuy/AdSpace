import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const { data: space } = await supabase.from("spaces").select("owner_id").eq("id", id).single();
  if (!space || space.owner_id !== user.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const { data: activeContract } = await supabase
    .from("contracts").select("id").eq("space_id", id).eq("status", "active").maybeSingle();
  if (activeContract) {
    return NextResponse.json({ error: "No podés editar un espacio con contrato activo" }, { status: 400 });
  }

  const { error } = await supabase.from("spaces").update({
    title: body.title,
    city: body.city,
    location: body.location,
    traffic: parseInt(body.traffic),
    price: parseInt(body.price),
    format: body.format,
    description: body.description,
    image: body.image ?? null,
    images: body.images ?? null,
  }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;

  const { data: space } = await supabase.from("spaces").select("owner_id").eq("id", id).single();
  if (!space || space.owner_id !== user.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const { data: activeContract } = await supabase
    .from("contracts").select("id").eq("space_id", id).eq("status", "active").maybeSingle();
  if (activeContract) {
    return NextResponse.json({ error: "No podés eliminar un espacio con contrato activo" }, { status: 400 });
  }

  const { error } = await supabase.from("spaces").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
