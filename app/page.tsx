import Background from "@/components/Background";
import Hero from "@/components/Hero";
import SceneGym from "@/components/SceneGym";
import SceneCar from "@/components/SceneCar";
import SceneMachine from "@/components/SceneMachine";
import Transition from "@/components/Transition";
import SpacesGrid from "@/components/SpacesGrid";
import HowItWorks from "@/components/HowItWorks";
import FinalCTA from "@/components/FinalCTA";
import { Space } from "@/lib/spaces";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("spaces")
    .select("*")
    .eq("approved", true)
    .eq("available", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const featured: Space[] = data ?? [];

  return (
    <main className="bg-black min-h-screen relative">
      <Background />
      <Hero />
      <SceneGym />
      <SceneCar />
      <SceneMachine />
      <Transition />
      {featured.length > 0 && <SpacesGrid spaces={featured} />}
      <HowItWorks />
      <FinalCTA />
    </main>
  );
}
