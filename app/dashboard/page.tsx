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
    const { data } = await supabase
      .from("contracts")
      .select("*, spaces(title, city, price, image, type)")
      .eq("advertiser_id", user.id)
      .order("created_at", { ascending: false });
    contracts = data;
  }

  return (
    <DashboardClient
      user={{ name, email: user.email! }}
      role={role}
      spaces={spaces ?? []}
      contracts={contracts ?? []}
    />
  );
}
