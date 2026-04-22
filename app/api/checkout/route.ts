import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { spaceId, title, price } = await request.json();
  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: title,
            description: "Publicidad mensual — AdSpace",
          },
          unit_amount: price * 100,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&space_id=${spaceId}`,
    cancel_url: `${origin}/spaces`,
    metadata: {
      space_id: spaceId,
      user_id: user.id,
    },
  });

  return NextResponse.json({ url: session.url });
}
