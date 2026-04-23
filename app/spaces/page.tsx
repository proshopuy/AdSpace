import { createClient } from "@/lib/supabase/server";
import { SPACES } from "@/lib/spaces";
import SpacesClient from "./SpacesClient";

export default async function SpacesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("spaces")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  // Real approved spaces first, then mock demo spaces (excluding conflicting IDs)
  const realIds = new Set((data ?? []).map((s: any) => s.id));
  const mockSpaces = SPACES.filter((s) => !realIds.has(s.id));
  const spaces = [...(data ?? []), ...mockSpaces];

  return <SpacesClient spaces={spaces} />;
}
