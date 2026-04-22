import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const spaceId = session.metadata?.space_id;
    const userId = session.metadata?.user_id;

    if (spaceId && userId) {
      const supabase = await createClient();
      await supabase.from("contracts").insert({
        space_id: parseInt(spaceId),
        advertiser_id: userId,
        status: "active",
        start_date: new Date().toISOString().split("T")[0],
      });
    }
  }

  return NextResponse.json({ received: true });
}
