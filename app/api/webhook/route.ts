import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.RESEND_FROM!;

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
    const session = event.data.object as Stripe.Checkout.Session;
    const spaceId = session.metadata?.space_id;
    const userId = session.metadata?.user_id;
    const advertiserEmail = session.metadata?.advertiser_email;

    if (spaceId && userId) {
      const supabase = await createClient();

      const { data: space } = await supabase
        .from("spaces")
        .select("title, city, price, owner_id, profiles(email, name)")
        .eq("id", parseInt(spaceId))
        .single();

      await supabase.from("contracts").insert({
        space_id: parseInt(spaceId),
        advertiser_id: userId,
        status: "active",
        start_date: new Date().toISOString().split("T")[0],
      });

      const spaceName = space?.title ?? "tu espacio";
      const spaceCity = space?.city ?? "";
      const spacePrice = space?.price ?? 0;
      const ownerEmail = (space?.profiles as any)?.email;
      const ownerName = (space?.profiles as any)?.name ?? "Hola";

      // Email al advertiser
      if (advertiserEmail) {
        await resend.emails.send({
          from: FROM,
          to: advertiserEmail,
          subject: `¡Tu contrato en AdSpace está activo!`,
          html: emailAdvertiser(spaceName, spaceCity, spacePrice),
        });
      }

      // Email al owner
      if (ownerEmail) {
        await resend.emails.send({
          from: FROM,
          to: ownerEmail,
          subject: `Alguien contrató tu espacio en AdSpace`,
          html: emailOwner(ownerName, spaceName, spacePrice),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}

function emailAdvertiser(space: string, city: string, price: number) {
  return `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#09090b;padding:40px 32px;border-radius:16px;">
  <h1 style="color:#fff;font-size:22px;margin:0 0 24px;">Ad<span style="color:#3b82f6;">Space</span></h1>
  <h2 style="color:#fff;font-size:20px;font-weight:600;margin:0 0 12px;">¡Tu contrato está activo!</h2>
  <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0 0 20px;">
    Contrataste exitosamente el espacio <strong style="color:#fff;">${space}</strong>${city ? ` en ${city}` : ""}. Tu publicidad ya está en marcha.
  </p>
  <div style="background:#18181b;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
    <p style="color:#71717a;font-size:12px;margin:0 0 4px;">Monto mensual</p>
    <p style="color:#3b82f6;font-size:22px;font-weight:700;margin:0;">USD ${price.toLocaleString()}</p>
  </div>
  <a href="https://ad-space-rouge.vercel.app/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:14px;">
    Ver mi dashboard
  </a>
  <p style="color:#52525b;font-size:12px;margin:28px 0 0;">AdSpace · Publicidad física en Uruguay</p>
</div>`;
}

function emailOwner(ownerName: string, space: string, price: number) {
  return `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#09090b;padding:40px 32px;border-radius:16px;">
  <h1 style="color:#fff;font-size:22px;margin:0 0 24px;">Ad<span style="color:#3b82f6;">Space</span></h1>
  <h2 style="color:#fff;font-size:20px;font-weight:600;margin:0 0 12px;">¡Nuevo contrato!</h2>
  <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0 0 20px;">
    Hola ${ownerName}, alguien acaba de contratar tu espacio <strong style="color:#fff;">${space}</strong>.
  </p>
  <div style="background:#18181b;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
    <p style="color:#71717a;font-size:12px;margin:0 0 4px;">Ingreso mensual</p>
    <p style="color:#22c55e;font-size:22px;font-weight:700;margin:0;">USD ${price.toLocaleString()}</p>
  </div>
  <a href="https://ad-space-rouge.vercel.app/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:14px;">
    Ver mi dashboard
  </a>
  <p style="color:#52525b;font-size:12px;margin:28px 0 0;">AdSpace · Publicidad física en Uruguay</p>
</div>`;
}
