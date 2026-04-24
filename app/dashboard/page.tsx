import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? user.user_metadata?.role ?? "advertiser";
  const name = profile?.name ?? user.user_metadata?.name ?? user.email;

  let spaces = null;
  if (role === "owner") {
    const { data } = await supabase
      .from("spaces")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    spaces = data;
  }

  let contracts = null;

  if (role === "advertiser") {
    const { data: contractsData } = await supabase
      .from("contracts")
      .select("*, spaces(title, city, price, image, type, owner_id)")
      .eq("advertiser_id", user.id)
      .order("created_at", { ascending: false });

    // Traer perfil del dueño de cada espacio contratado
    const ownerIds = [...new Set((contractsData ?? []).map((c: any) => c.spaces?.owner_id).filter(Boolean))];
    let ownerProfileMap: Record<string, any> = {};
    if (ownerIds.length > 0) {
      const { data: ownerProfiles } = await supabase
        .from("profiles")
        .select("id, name, email, phone")
        .in("id", ownerIds);
      ownerProfileMap = Object.fromEntries((ownerProfiles ?? []).map((p: any) => [p.id, p]));
    }

    contracts = (contractsData ?? []).map((c: any) => ({
      ...c,
      owner_profile: c.spaces?.owner_id ? (ownerProfileMap[c.spaces.owner_id] ?? null) : null,
    }));
  }

  if (role === "owner") {
    const spaceIds = (spaces ?? []).map((s: any) => s.id);
    if (spaceIds.length > 0) {
      const { data } = await supabase
        .from("contracts")
        .select("*, spaces(title, city, price, image, type, owner_id), profiles!contracts_advertiser_id_fkey(name, email, phone)")
        .in("space_id", spaceIds)
        .in("status", ["active", "cancel_pending"])
        .order("created_at", { ascending: false });
      contracts = data;
    }
  }

  return (
    <DashboardClient
      user={{ name, email: user.email!, id: user.id }}
      role={role}
      spaces={spaces ?? []}
      contracts={contracts ?? []}
    />
  );
}
