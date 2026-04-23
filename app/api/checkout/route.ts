import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
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

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: String(spaceId),
            title: title,
            description: "Publicidad mensual — AdSpace",
            quantity: 1,
            unit_price: price,
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
      },
    });

    if (!result.init_point) {
      return NextResponse.json({ error: "No se pudo crear el pago" }, { status: 500 });
    }

    return NextResponse.json({ url: result.init_point });
  } catch (err: any) {
    console.error("MP checkout error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
