import Background from "@/components/Background";
import Hero from "@/components/Hero";
import SceneGym from "@/components/SceneGym";
import SceneCar from "@/components/SceneCar";
import SceneMachine from "@/components/SceneMachine";
import Transition from "@/components/Transition";
import SpacesGrid from "@/components/SpacesGrid";
import HowItWorks from "@/components/HowItWorks";
import FinalCTA from "@/components/FinalCTA";
import { SPACES } from "@/lib/spaces";

export default function Home() {
  return (
    <main className="bg-black min-h-screen relative">
      <Background />
      <Hero />
      <SceneGym />
      <SceneCar />
      <SceneMachine />
      <Transition />
      <SpacesGrid spaces={SPACES.slice(0, 3)} />
      <HowItWorks />
      <FinalCTA />
    </main>
  );
}
