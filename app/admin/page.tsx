import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: pending } = await supabase
    .from("spaces")
    .select("*")
    .eq("approved", false)
    .order("created_at", { ascending: false });

  const { data: approved } = await supabase
    .from("spaces")
    .select("id, title, city, type, price, available, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return <AdminClient pending={pending ?? []} approved={approved ?? []} />;
}
