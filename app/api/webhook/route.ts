import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

  if (body.type === "subscription_authorized_payment") {
    const authorizedPayment = await mpFetch(`/authorized_payments/${body.data.id}`).catch(() => null);
    if (!authorizedPayment || authorizedPayment.status !== "processed") {
      return NextResponse.json({ received: true });
    }
    const preapproval = await mpFetch(`/preapproval/${authorizedPayment.preapproval_id}`).catch(() => null);
    if (!preapproval) return NextResponse.json({ received: true });

    const parts = (preapproval.external_reference ?? "").split("|");
    const [spaceId, userId, , startDate, endDate, days] = parts;
    if (!spaceId || !userId) return NextResponse.json({ received: true });

    await handleContract(spaceId, userId, String(body.data.id), { startDate, endDate, days: parseInt(days ?? "30") });
  }

  if (body.type === "payment") {
    const payment = await mpFetch(`/v1/payments/${body.data.id}`).catch(() => null);
    if (!payment || payment.status !== "approved") return NextResponse.json({ received: true });

    const parts = (payment.external_reference ?? "").split("|");
    const [spaceId, userId, , startDate, endDate, days] = parts;
    if (!spaceId || !userId) return NextResponse.json({ received: true });

    await handleContract(spaceId, userId, String(body.data.id), { startDate, endDate, days: parseInt(days ?? "30") });
  }

  return NextResponse.json({ received: true });
}

interface CampaignMeta { startDate?: string; endDate?: string; days?: number; }

async function handleContract(spaceId: string, userId: string, paymentId: string, campaign: CampaignMeta = {}) {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const admin = createAdminClient();

  const { data: space } = await admin
    .from("spaces")
    .select("title, city, price, owner_id")
    .eq("id", parseInt(spaceId))
    .single();

  const { data: ownerProfile } = space?.owner_id
    ? await admin.from("profiles").select("name, email, phone").eq("id", space.owner_id).single()
    : { data: null };

  const { data: advertiserProfile } = await admin
    .from("profiles")
    .select("name, email, phone")
    .eq("id", userId)
    .single();

  const contractStart = campaign.startDate ?? new Date().toISOString().split("T")[0];
  await admin.from("contracts").upsert(
    {
      space_id: parseInt(spaceId),
      advertiser_id: userId,
      status: "active",
      start_date: contractStart,
      end_date: campaign.endDate ?? null,
      duration_days: campaign.days ?? null,
      payment_id: paymentId,
    },
    { onConflict: "payment_id" }
  );

  const appUrl = process.env.NEXT_PUBLIC_URL ?? "https://adspace.uy";
  const spaceName = space?.title ?? "tu espacio";
  const spaceCity = space?.city ?? "";
  const spacePrice = space?.price ?? 0;

  if (advertiserProfile?.email) {
    await resend.emails.send({
      from: FROM,
      to: advertiserProfile.email,
      subject: `¡Tu campaña en AdSpace está activa!`,
      html: emailAdvertiser({
        spaceName, spaceCity, spacePrice, appUrl,
        startDate: campaign.startDate, endDate: campaign.endDate, days: campaign.days,
        ownerName: ownerProfile?.name ?? null,
        ownerEmail: ownerProfile?.email ?? null,
        ownerPhone: ownerProfile?.phone ?? null,
      }),
    });
  }

  if (ownerProfile?.email) {
    await resend.emails.send({
      from: FROM,
      to: ownerProfile.email,
      subject: `Nueva campaña en tu espacio — AdSpace`,
      html: emailOwner({
        spaceName, spacePrice, appUrl,
        ownerName: ownerProfile?.name ?? "Hola",
        advertiserName: advertiserProfile?.name ?? null,
        advertiserEmail: advertiserProfile?.email ?? null,
        advertiserPhone: advertiserProfile?.phone ?? null,
        startDate: campaign.startDate, endDate: campaign.endDate, days: campaign.days,
      }),
    });
  }
}

interface AdvertiserEmailParams {
  spaceName: string; spaceCity: string; spacePrice: number; appUrl: string;
  startDate?: string; endDate?: string; days?: number;
  ownerName: string | null; ownerEmail: string | null; ownerPhone: string | null;
}

function emailAdvertiser(p: AdvertiserEmailParams) {
  const dateRange = p.startDate && p.endDate
    ? `<p style="color:#a1a1aa;font-size:13px;margin:4px 0 0;">${p.startDate} → ${p.endDate}${p.days ? ` · ${p.days} días` : ""}</p>`
    : "";
  const contactRows = [
    p.ownerName  ? `<tr><td style="color:#71717a;font-size:12px;padding:4px 0;">Nombre</td><td style="color:#fff;font-size:13px;padding:4px 0 4px 12px;">${p.ownerName}</td></tr>` : "",
    p.ownerEmail ? `<tr><td style="color:#71717a;font-size:12px;padding:4px 0;">Email</td><td style="padding:4px 0 4px 12px;"><a href="mailto:${p.ownerEmail}" style="color:#3b82f6;font-size:13px;">${p.ownerEmail}</a></td></tr>` : "",
    p.ownerPhone ? `<tr><td style="color:#71717a;font-size:12px;padding:4px 0;">Teléfono</td><td style="color:#fff;font-size:13px;padding:4px 0 4px 12px;">${p.ownerPhone}</td></tr>` : "",
  ].join("");

  return `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#09090b;padding:40px 32px;border-radius:16px;">
  <h1 style="color:#fff;font-size:22px;margin:0 0 24px;">Ad<span style="color:#3b82f6;">Space</span></h1>
  <h2 style="color:#fff;font-size:20px;font-weight:600;margin:0 0 12px;">¡Tu campaña está activa!</h2>
  <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0 0 20px;">
    Contrataste el espacio <strong style="color:#fff;">${p.spaceName}</strong>${p.spaceCity ? ` en ${p.spaceCity}` : ""}.
  </p>
  <div style="background:#18181b;border-radius:12px;padding:16px 20px;margin:0 0 20px;">
    <p style="color:#71717a;font-size:12px;margin:0 0 4px;">Total pagado</p>
    <p style="color:#3b82f6;font-size:22px;font-weight:700;margin:0;">UYU ${p.spacePrice.toLocaleString()}</p>
    ${dateRange}
  </div>
  ${contactRows ? `
  <div style="background:#18181b;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
    <p style="color:#71717a;font-size:12px;margin:0 0 10px;">Contacto del dueño del espacio</p>
    <table style="border-collapse:collapse;width:100%;">${contactRows}</table>
  </div>` : ""}
  <a href="${p.appUrl}/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:14px;">
    Ver mi dashboard
  </a>
  <p style="color:#52525b;font-size:12px;margin:28px 0 0;">AdSpace · Publicidad física en Uruguay</p>
</div>`;
}

interface OwnerEmailParams {
  spaceName: string; spacePrice: number; appUrl: string; ownerName: string;
  advertiserName: string | null; advertiserEmail: string | null; advertiserPhone: string | null;
  startDate?: string; endDate?: string; days?: number;
}

function emailOwner(p: OwnerEmailParams) {
  const dateRange = p.startDate && p.endDate
    ? `<p style="color:#a1a1aa;font-size:13px;margin:4px 0 0;">${p.startDate} → ${p.endDate}${p.days ? ` · ${p.days} días` : ""}</p>`
    : "";
  const contactRows = [
    p.advertiserName  ? `<tr><td style="color:#71717a;font-size:12px;padding:4px 0;">Nombre</td><td style="color:#fff;font-size:13px;padding:4px 0 4px 12px;">${p.advertiserName}</td></tr>` : "",
    p.advertiserEmail ? `<tr><td style="color:#71717a;font-size:12px;padding:4px 0;">Email</td><td style="padding:4px 0 4px 12px;"><a href="mailto:${p.advertiserEmail}" style="color:#3b82f6;font-size:13px;">${p.advertiserEmail}</a></td></tr>` : "",
    p.advertiserPhone ? `<tr><td style="color:#71717a;font-size:12px;padding:4px 0;">Teléfono</td><td style="color:#fff;font-size:13px;padding:4px 0 4px 12px;">${p.advertiserPhone}</td></tr>` : "",
  ].join("");

  return `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#09090b;padding:40px 32px;border-radius:16px;">
  <h1 style="color:#fff;font-size:22px;margin:0 0 24px;">Ad<span style="color:#3b82f6;">Space</span></h1>
  <h2 style="color:#fff;font-size:20px;font-weight:600;margin:0 0 12px;">¡Nueva campaña en tu espacio!</h2>
  <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0 0 20px;">
    Hola ${p.ownerName}, alguien acaba de reservar <strong style="color:#fff;">${p.spaceName}</strong>.
  </p>
  <div style="background:#18181b;border-radius:12px;padding:16px 20px;margin:0 0 20px;">
    <p style="color:#71717a;font-size:12px;margin:0 0 4px;">Ingreso</p>
    <p style="color:#22c55e;font-size:22px;font-weight:700;margin:0;">UYU ${p.spacePrice.toLocaleString()}</p>
    ${dateRange}
  </div>
  ${contactRows ? `
  <div style="background:#18181b;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
    <p style="color:#71717a;font-size:12px;margin:0 0 10px;">Datos del anunciante</p>
    <table style="border-collapse:collapse;width:100%;">${contactRows}</table>
  </div>` : ""}
  <a href="${p.appUrl}/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:14px;">
    Ver mi dashboard
  </a>
  <p style="color:#52525b;font-size:12px;margin:28px 0 0;">AdSpace · Publicidad física en Uruguay</p>
</div>`;
}
