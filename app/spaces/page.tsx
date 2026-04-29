import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SpacesClient from "./SpacesClient";

export const metadata: Metadata = {
  title: "Explorar espacios publicitarios",
  description:
    "Encontrá espacios publicitarios físicos en Uruguay: gimnasios, autos ploteados, tótems digitales, restaurantes, cartelería y más. Filtrá por ciudad, tipo y precio.",
  alternates: { canonical: "https://adspots.com.uy/spaces" },
  openGraph: {
    title: "Explorar espacios publicitarios | AdSpots",
    description:
      "Más de 10 tipos de espacios físicos en Montevideo, Punta del Este y todo Uruguay.",
    url: "https://adspots.com.uy/spaces",
  },
};

export default async function SpacesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("spaces")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  return <SpacesClient spaces={data ?? []} />;
}
