import { createClient } from "@/lib/supabase/server";
import { SPACES, TYPE_LABELS, Space } from "@/lib/spaces";
import { redirect } from "next/navigation";
import { MapPin, Users, Shield, CheckCircle, Headphones, Clock, Layers, Zap } from "lucide-react";
import BackButton from "@/components/BackButton";
import CampaignConfigurator from "@/components/CampaignConfigurator";

function getLoopInfo(type: string): { frequency: string; loopDuration: string; impressionsRatio: number } {
  if (type === "totem") return { frequency: "1 de cada 6", loopDuration: "60 segundos", impressionsRatio: 1 / 6 };
  if (type === "billboard" || type === "car") return { frequency: "Exclusiva", loopDuration: "Continua", impressionsRatio: 1 };
  return { frequency: "1 de cada 4", loopDuration: "40 segundos", impressionsRatio: 1 / 4 };
}

function getResolution(format: string): string {
  if (format.toLowerCase().includes("4k") || format.toLowerCase().includes("tótem")) return "3840×2160 px o 1080×1920 px";
  if (format.toLowerCase().includes("video wall")) return "3840×2160 px";
  if (format.toLowerCase().includes("tablet")) return "1920×1200 px";
  if (format.toLowerCase().includes("cartel") || format.toLowerCase().includes("6x3")) return "Vectorial o 6000×3000 px";
  if (format.toLowerCase().includes("ploteo")) return "Vectorial o alta resolución (PDF)";
  return "1920×1080 px";
}

export default async function SpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id);

  let space: Space | null = null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("spaces")
    .select("*")
    .eq("id", numId)
    .eq("approved", true)
    .single();

  if (data) {
    space = data as Space;
  } else {
    space = SPACES.find((s) => s.id === numId) ?? null;
  }

  if (!space) redirect("/spaces");

  const primaryImage = space.images?.[0] ?? space.image;
  const pricePerDay = Math.round(space.price / 30);
  const loopInfo = getLoopInfo(space.type);
  const impressionsPerDay = Math.round(space.traffic * loopInfo.impressionsRatio);
  const impressionsMonthly = impressionsPerDay * 30;
  const cpm = space.traffic > 0 ? Math.round((space.price / impressionsMonthly) * 1000) : 0;
  const resolution = getResolution(space.format);

  return (
    <main className="bg-black min-h-screen pb-32">
      <div className="max-w-5xl mx-auto px-4 py-8">

        <BackButton />

        {/* HERO */}
        <div className="grid md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-3 relative rounded-2xl overflow-hidden bg-zinc-900 h-72 md:h-96">
            {primaryImage ? (
              <img src={primaryImage} alt={space.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">📺</div>
            )}
            <span className="absolute top-4 left-4 bg-blue-600 text-xs text-white px-3 py-1 rounded-md font-medium">
              {TYPE_LABELS[space.type]}
            </span>
            {!space.available && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-zinc-800 text-white text-sm px-4 py-2 rounded-full">No disponible</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col justify-center">
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Campaña publicitaria</p>
            <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-3">
              {space.title}
            </h1>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-4">
              <MapPin size={14} />
              {space.location}, {space.city}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{space.description}</p>
            <div className="bg-zinc-900 rounded-xl p-4 flex items-baseline gap-2">
              <span className="text-blue-500 text-2xl font-bold">desde UYU {space.price.toLocaleString()}</span>
              <span className="text-gray-500 text-sm">/ 30 días</span>
            </div>
          </div>
        </div>

        {/* QUÉ ESTÁS COMPRANDO */}
        <section className="mb-8">
          <h2 className="text-white text-xl font-bold mb-4">¿Qué estás comprando?</h2>
          <div className="bg-zinc-900 rounded-2xl p-6 grid sm:grid-cols-2 gap-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/15 flex items-center justify-center shrink-0">
                <Clock size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Duración mínima</p>
                <p className="text-white font-semibold">30 días</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/15 flex items-center justify-center shrink-0">
                <Layers size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Frecuencia en el loop</p>
                <p className="text-white font-semibold">{loopInfo.frequency} anunciantes</p>
                <p className="text-gray-500 text-xs">Loop de {loopInfo.loopDuration}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/15 flex items-center justify-center shrink-0">
                <Zap size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Impresiones estimadas / día</p>
                <p className="text-white font-semibold">{impressionsPerDay.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/15 flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Ubicación</p>
                <p className="text-white font-semibold">{space.location}</p>
                <p className="text-gray-500 text-xs">{space.city}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONFIGURADOR */}
        <section id="configurador" className="mb-8">
          <h2 className="text-white text-xl font-bold mb-4">Configurá tu campaña</h2>
          <CampaignConfigurator space={space} pricePerDay={pricePerDay} />
        </section>

        {/* MÉTRICAS */}
        <section className="mb-8">
          <h2 className="text-white text-xl font-bold mb-4">Métricas estimadas</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-900 rounded-2xl p-5 text-center">
              <Users size={22} className="mx-auto text-blue-400 mb-2" />
              <p className="text-white font-bold text-xl">{space.traffic.toLocaleString()}</p>
              <p className="text-gray-500 text-xs mt-1">personas / día</p>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-5 text-center">
              <Zap size={22} className="mx-auto text-blue-400 mb-2" />
              <p className="text-white font-bold text-xl">{impressionsMonthly.toLocaleString()}</p>
              <p className="text-gray-500 text-xs mt-1">impresiones / mes</p>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-5 text-center">
              <Layers size={22} className="mx-auto text-blue-400 mb-2" />
              <p className="text-white font-bold text-xl">UYU {cpm.toLocaleString()}</p>
              <p className="text-gray-500 text-xs mt-1">CPM estimado</p>
            </div>
          </div>
        </section>

        {/* REQUISITOS */}
        <section className="mb-8">
          <h2 className="text-white text-xl font-bold mb-4">Requisitos del creativo</h2>
          <div className="bg-zinc-900 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <p className="text-gray-400 text-sm">Formato del soporte</p>
              <p className="text-white text-sm font-medium">{space.format}</p>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <p className="text-gray-400 text-sm">Resolución recomendada</p>
              <p className="text-white text-sm font-medium">{resolution}</p>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <p className="text-gray-400 text-sm">Duración del clip (si aplica)</p>
              <p className="text-white text-sm font-medium">10–15 segundos</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Formatos aceptados</p>
              <p className="text-white text-sm font-medium">MP4, JPG, PNG, PDF</p>
            </div>
          </div>
        </section>

        {/* CONFIANZA */}
        <section className="mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-900 rounded-2xl p-5 text-center">
              <Shield size={22} className="mx-auto text-green-400 mb-2" />
              <p className="text-white text-sm font-semibold">Pago seguro</p>
              <p className="text-gray-500 text-xs mt-1">Procesado por MercadoPago</p>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-5 text-center">
              <CheckCircle size={22} className="mx-auto text-blue-400 mb-2" />
              <p className="text-white text-sm font-semibold">Espacio verificado</p>
              <p className="text-gray-500 text-xs mt-1">Revisado por el equipo AdSpots</p>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-5 text-center">
              <Headphones size={22} className="mx-auto text-purple-400 mb-2" />
              <p className="text-white text-sm font-semibold">Soporte incluido</p>
              <p className="text-gray-500 text-xs mt-1">Te acompañamos en el proceso</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
