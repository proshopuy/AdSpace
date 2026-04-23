import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const MP_BASE = "https://api.mercadopago.com";

async function mpFetch(path: string) {
  const res = await fetch(`${MP_BASE}${path}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`MP fetch failed: ${path}`);
  return res.json();
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.data?.id) return NextResponse.json({ received: true });

  // Suscripción: pago autorizado
  if (body.type === "subscription_authorized_payment") {
    const authorizedPayment = await mpFetch(`/authorized_payments/${body.data.id}`).catch(() => null);
    if (!authorizedPayment || authorizedPayment.status !== "processed") {
      return NextResponse.json({ received: true });
    }

    const preapproval = await mpFetch(`/preapproval/${authorizedPayment.preapproval_id}`).catch(() => null);
    if (!preapproval) return NextResponse.json({ received: true });

    const [spaceId, userId, advertiserEmail] = (preapproval.external_reference ?? "").split("|");
    if (!spaceId || !userId) return NextResponse.json({ received: true });

    await handleContract(spaceId, userId, advertiserEmail, String(body.data.id));
  }

  // Pago único (fallback por si acaso)
  if (body.type === "payment") {
    const payment = await mpFetch(`/v1/payments/${body.data.id}`).catch(() => null);
    if (!payment || payment.status !== "approved") return NextResponse.json({ received: true });

    const [spaceId, userId, advertiserEmail] = (payment.external_reference ?? "").split("|");
    if (!spaceId || !userId) return NextResponse.json({ received: true });

    await handleContract(spaceId, userId, advertiserEmail, String(body.data.id));
  }

  return NextResponse.json({ received: true });
}

async function handleContract(spaceId: string, userId: string, advertiserEmail: string, paymentId: string) {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const supabase = await createClient();

  const { data: space } = await supabase
    .from("spaces")
    .select("title, city, price, profiles(email, name)")
    .eq("id", parseInt(spaceId))
    .single();

  await supabase.from("contracts").upsert(
    {
      space_id: parseInt(spaceId),
      advertiser_id: userId,
      status: "active",
      start_date: new Date().toISOString().split("T")[0],
      payment_id: paymentId,
    },
    { onConflict: "payment_id" }
  );

  const spaceName = space?.title ?? "tu espacio";
  const spaceCity = space?.city ?? "";
  const spacePrice = space?.price ?? 0;
  const ownerEmail = (space?.profiles as any)?.email;
  const ownerName = (space?.profiles as any)?.name ?? "Hola";
  const appUrl = process.env.NEXT_PUBLIC_URL ?? "https://adspace.uy";

  if (advertiserEmail) {
    await resend.emails.send({
      from: FROM,
      to: advertiserEmail,
      subject: `¡Tu contrato en AdSpace está activo!`,
      html: emailAdvertiser(spaceName, spaceCity, spacePrice, appUrl),
    });
  }

  if (ownerEmail) {
    await resend.emails.send({
      from: FROM,
      to: ownerEmail,
      subject: `Alguien contrató tu espacio en AdSpace`,
      html: emailOwner(ownerName, spaceName, spacePrice, appUrl),
    });
  }
}

function emailAdvertiser(space: string, city: string, price: number, appUrl: string) {
  return `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#09090b;padding:40px 32px;border-radius:16px;">
  <h1 style="color:#fff;font-size:22px;margin:0 0 24px;">Ad<span style="color:#3b82f6;">Space</span></h1>
  <h2 style="color:#fff;font-size:20px;font-weight:600;margin:0 0 12px;">¡Tu suscripción está activa!</h2>
  <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0 0 20px;">
    Contrataste exitosamente el espacio <strong style="color:#fff;">${space}</strong>${city ? ` en ${city}` : ""}. Se renovará automáticamente cada mes.
  </p>
  <div style="background:#18181b;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
    <p style="color:#71717a;font-size:12px;margin:0 0 4px;">Monto mensual</p>
    <p style="color:#3b82f6;font-size:22px;font-weight:700;margin:0;">UYU ${price.toLocaleString()}</p>
  </div>
  <a href="${appUrl}/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:14px;">
    Ver mi dashboard
  </a>
  <p style="color:#52525b;font-size:12px;margin:28px 0 0;">AdSpace · Publicidad física en Uruguay</p>
</div>`;
}

function emailOwner(ownerName: string, space: string, price: number, appUrl: string) {
  return `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#09090b;padding:40px 32px;border-radius:16px;">
  <h1 style="color:#fff;font-size:22px;margin:0 0 24px;">Ad<span style="color:#3b82f6;">Space</span></h1>
  <h2 style="color:#fff;font-size:20px;font-weight:600;margin:0 0 12px;">¡Nuevo contrato!</h2>
  <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0 0 20px;">
    Hola ${ownerName}, alguien acaba de suscribirse a tu espacio <strong style="color:#fff;">${space}</strong>.
  </p>
  <div style="background:#18181b;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
    <p style="color:#71717a;font-size:12px;margin:0 0 4px;">Ingreso mensual</p>
    <p style="color:#22c55e;font-size:22px;font-weight:700;margin:0;">UYU ${price.toLocaleString()}</p>
  </div>
  <a href="${appUrl}/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:14px;">
    Ver mi dashboard
  </a>
  <p style="color:#52525b;font-size:12px;margin:28px 0 0;">AdSpace · Publicidad física en Uruguay</p>
</div>`;
}
