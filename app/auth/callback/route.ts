import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "email" | "recovery" | "invite" | null;

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(`${origin}/auth?error=link_invalido`);
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (error) return NextResponse.redirect(`${origin}/auth?error=link_invalido`);
  } else {
    return NextResponse.redirect(`${origin}/auth?error=link_invalido`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existing) {
      // Usuario nuevo — leer rol del cookie
      const cookieHeader = request.headers.get("cookie") ?? "";
      const pendingRole = cookieHeader.match(/pending_role=([^;]+)/)?.[1] ?? "advertiser";
      const meta = user.user_metadata ?? {};

      await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        name: meta.full_name ?? meta.name ?? null,
        phone: meta.phone ?? null,
        role: meta.role ?? pendingRole,
      });
    } else {
      // Usuario existente — solo actualizar email por si cambió
      await supabase.from("profiles").update({ email: user.email }).eq("id", user.id);
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
