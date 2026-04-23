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
    await syncProfileEmail(supabase);
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (error) return NextResponse.redirect(`${origin}/auth?error=link_invalido`);
    await syncProfileEmail(supabase);
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  return NextResponse.redirect(`${origin}/auth?error=link_invalido`);
}

async function syncProfileEmail(supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").upsert({ id: user.id, email: user.email }, { onConflict: "id" });
}
