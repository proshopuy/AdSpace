import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const { action } = await request.json(); // "request" | "approve" | "reject"

  const { data: contract } = await supabase
    .from("contracts")
    .select("*, spaces(title, owner_id, profiles(email, name)), profiles!contracts_advertiser_id_fkey(email, name)")
    .eq("id", id)
    .single();

  if (!contract) return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 });

  const isAdvertiser = contract.advertiser_id === user.id;
  const isOwner = contract.spaces?.owner_id === user.id;
  if (!isAdvertiser && !isOwner) return NextResponse.json({ error: "Sin permisos" }, { status: 403 });

  const resend = new Resend(process.env.RESEND_API_KEY!);
  const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const appUrl = process.env.NEXT_PUBLIC_URL ?? "https://adspace.uy";

  const spaceName = contract.spaces?.title ?? "el espacio";
  const advertiserEmail = (contract.profiles as any)?.email;
  const advertiserName = (contract.profiles as any)?.name ?? "Anunciante";
  const ownerEmail = (contract.spaces?.profiles as any)?.email;
  const ownerName = (contract.spaces?.profiles as any)?.name ?? "Dueño";

  if (action === "request") {
    if (contract.status !== "active") {
      return NextResponse.json({ error: "Solo podés cancelar contratos activos" }, { status: 400 });
    }

    await supabase.from("contracts").update({
      status: "cancel_pending",
      cancel_requested_by: user.id,
      cancel_request_at: new Date().toISOString(),
    }).eq("id", id);

    // Notificar a la otra parte
    const recipientEmail = isAdvertiser ? ownerEmail : advertiserEmail;
    const recipientName = isAdvertiser ? ownerName : advertiserName;
    const requesterRole = isAdvertiser ? "el anunciante" : "el dueño del espacio";

    if (recipientEmail) {
      await resend.emails.send({
        from: FROM,
        to: recipientEmail,
        subject: `Solicitud de cancelación de contrato — AdSpace`,
        html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#09090b;padding:40px 32px;border-radius:16px;">
  <h1 style="color:#fff;font-size:22px;margin:0 0 24px;">Ad<span style="color:#3b82f6;">Space</span></h1>
  <h2 style="color:#fff;font-size:18px;font-weight:600;margin:0 0 12px;">Solicitud de cancelación</h2>
  <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0 0 20px;">
    Hola ${recipientName}, ${requesterRole} solicitó cancelar el contrato del espacio <strong style="color:#fff;">${spaceName}</strong>.
  </p>
  <p style="color:#a1a1aa;font-size:14px;margin:0 0 24px;">
    Ingresá a tu dashboard para aprobar o rechazar la solicitud.
  </p>
  <a href="${appUrl}/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:14px;">
    Ver en dashboard
  </a>
  <p style="color:#52525b;font-size:12px;margin:28px 0 0;">AdSpace · Publicidad física en Uruguay</p>
</div>`,
      });
    }

    return NextResponse.json({ ok: true });
  }

  if (action === "approve") {
    if (contract.status !== "cancel_pending") {
      return NextResponse.json({ error: "No hay cancelación pendiente" }, { status: 400 });
    }
    if (contract.cancel_requested_by === user.id) {
      return NextResponse.json({ error: "No podés aprobar tu propia solicitud" }, { status: 400 });
    }

    await supabase.from("contracts").update({ status: "cancelled" }).eq("id", id);
    await supabase.from("spaces").update({ available: true }).eq("id", contract.space_id);

    // Notificar a quien solicitó
    const requesterEmail = contract.cancel_requested_by === contract.advertiser_id ? advertiserEmail : ownerEmail;
    if (requesterEmail) {
      await resend.emails.send({
        from: FROM,
        to: requesterEmail,
        subject: `Cancelación aprobada — AdSpace`,
        html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#09090b;padding:40px 32px;border-radius:16px;">
  <h1 style="color:#fff;font-size:22px;margin:0 0 24px;">Ad<span style="color:#3b82f6;">Space</span></h1>
  <h2 style="color:#fff;font-size:18px;font-weight:600;margin:0 0 12px;">Cancelación aprobada</h2>
  <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0 0 24px;">
    Tu solicitud de cancelación del contrato para <strong style="color:#fff;">${spaceName}</strong> fue aprobada. El contrato está cancelado.
  </p>
  <a href="${appUrl}/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:14px;">
    Ver dashboard
  </a>
  <p style="color:#52525b;font-size:12px;margin:28px 0 0;">AdSpace · Publicidad física en Uruguay</p>
</div>`,
      });
    }

    return NextResponse.json({ ok: true });
  }

  if (action === "reject") {
    if (contract.status !== "cancel_pending") {
      return NextResponse.json({ error: "No hay cancelación pendiente" }, { status: 400 });
    }
    if (contract.cancel_requested_by === user.id) {
      return NextResponse.json({ error: "No podés rechazar tu propia solicitud" }, { status: 400 });
    }

    await supabase.from("contracts").update({
      status: "active",
      cancel_requested_by: null,
      cancel_request_at: null,
    }).eq("id", id);

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}
