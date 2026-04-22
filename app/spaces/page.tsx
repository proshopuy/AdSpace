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

  // Use Supabase data if available, fallback to mock data
  const spaces = (data && data.length > 0) ? data : SPACES;

  return <SpacesClient spaces={spaces} />;
}
