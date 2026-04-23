import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { spaceId, title, price } = await request.json();
    const origin = request.headers.get("origin") ?? "http://localhost:3000";

    const body = {
      items: [
        {
          id: String(spaceId),
          title: title,
          description: "Publicidad mensual — AdSpace",
          quantity: 1,
          unit_price: Number(price),
          currency_id: "UYU",
        },
      ],
      back_urls: {
        success: `${origin}/checkout/success?space_id=${spaceId}`,
        failure: `${origin}/spaces`,
        pending: `${origin}/checkout/success?space_id=${spaceId}`,
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_URL ?? origin}/api/webhook`,
      external_reference: `${spaceId}|${user.id}|${user.email ?? ""}`,
    };

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("MP error:", JSON.stringify(data));
      return NextResponse.json({ error: data.message ?? "Error de MercadoPago" }, { status: 500 });
    }

    return NextResponse.json({ url: data.init_point });
  } catch (err: any) {
    console.error("MP checkout error:", err?.message ?? err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
