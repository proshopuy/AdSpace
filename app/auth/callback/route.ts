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
    const meta = user.user_metadata ?? {};
    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      name: meta.name ?? null,
      phone: meta.phone ?? null,
      role: meta.role ?? "advertiser",
    }, { onConflict: "id" });
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
