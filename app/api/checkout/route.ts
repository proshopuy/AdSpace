import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { spaceId, title, startDate, endDate, days, totalPrice, wantsDesign } = await request.json();
    const origin = request.headers.get("origin") ?? "http://localhost:3000";
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? origin;

    const body = {
      items: [
        {
          id: String(spaceId),
          title: `Campaña publicitaria en ${title}`,
          description: `Campaña ${days} días — AdSpots`,
          quantity: 1,
          unit_price: Number(totalPrice),
          currency_id: "UYU",
        },
      ],
      back_urls: {
        success: `${baseUrl}/checkout/success?space_id=${spaceId}`,
        failure: `${baseUrl}/spaces/${spaceId}`,
        pending: `${baseUrl}/checkout/success?space_id=${spaceId}`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/webhook`,
      external_reference: `${spaceId}|${user.id}|${user.email ?? ""}|${startDate}|${endDate}|${days}|${wantsDesign ? "1" : "0"}`,
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
      return NextResponse.json({ error: data.message ?? "Error de MercadoPago", detail: data }, { status: 500 });
    }

    if (!data.init_point) {
      console.error("MP no init_point:", JSON.stringify(data));
      return NextResponse.json({ error: "MP no devolvió URL", detail: data }, { status: 500 });
    }

    return NextResponse.json({ url: data.init_point });
  } catch (err: any) {
    console.error("MP checkout error:", err?.message ?? err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
