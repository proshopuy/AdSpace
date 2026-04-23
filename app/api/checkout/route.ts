import { NextResponse } from "next/server";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { spaceId, title, price } = await request.json();
  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
  const preApproval = new PreApproval(client);

  const result = await preApproval.create({
    body: {
      reason: `${title} — AdSpace`,
      external_reference: `${spaceId}|${user.id}|${user.email ?? ""}`,
      payer_email: user.email!,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: price,
        currency_id: "UYU",
      },
      back_url: `${origin}/checkout/success?space_id=${spaceId}`,
      status: "pending",
    },
  });

  return NextResponse.json({ url: result.init_point });
}
