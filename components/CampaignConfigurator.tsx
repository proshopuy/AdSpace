"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Space } from "@/lib/spaces";
import { Loader2, Calendar, Paintbrush, ChevronRight } from "lucide-react";

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function diffDays(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / 86400000));
}

interface Props {
  space: Space;
  pricePerDay: number;
}

export default function CampaignConfigurator({ space, pricePerDay }: Props) {
  const router = useRouter();
  const defaultStart = addDays(today(), 7);
  const defaultEnd = addDays(defaultStart, 30);

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [loading, setLoading] = useState(false);

  const days = useMemo(() => diffDays(startDate, endDate), [startDate, endDate]);
  const isValid = days >= 30 && space.available;
  const campaignPrice = Math.round((days * space.price) / 30);
  const totalPrice = campaignPrice;

  const handleStartChange = (val: string) => {
    setStartDate(val);
    if (diffDays(val, endDate) < 30) {
      setEndDate(addDays(val, 30));
    }
  };

  const handleLaunch = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId: space.id,
          title: space.title,
          startDate,
          endDate,
          days,
          totalPrice,
        }),
      });
      const { url, error } = await res.json();
      if (error || !url) { alert("Error al iniciar el pago. Intentá de nuevo."); return; }
      window.location.href = url;
    } catch {
      alert("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition text-sm";

  return (
    <>
      <div className="bg-zinc-900 rounded-2xl p-6 space-y-6">
        {/* Selector de fechas */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-xs mb-2 block flex items-center gap-1">
              <Calendar size={12} /> Fecha de inicio
            </label>
            <input
              type="date"
              value={startDate}
              min={addDays(today(), 1)}
              onChange={(e) => handleStartChange(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-2 block flex items-center gap-1">
              <Calendar size={12} /> Fecha de fin
            </label>
            <input
              type="date"
              value={endDate}
              min={addDays(startDate, 30)}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Badge duración */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
            days >= 30
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "bg-red-600/20 text-red-400 border border-red-500/30"
          }`}>
            {days} días
          </span>
          {days < 30 && (
            <p className="text-red-400 text-xs">La duración mínima es de 30 días.</p>
          )}
        </div>

        {/* Diseño */}
        <div className="flex items-start gap-3 bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
          <div className="w-9 h-9 rounded-lg bg-purple-600/15 flex items-center justify-center shrink-0 mt-0.5">
            <Paintbrush size={16} className="text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">¿No tenés el diseño?</p>
            <p className="text-gray-500 text-xs mt-0.5 mb-3">Pedí una cotización a nuestro equipo y te ayudamos a crear el creativo.</p>
            <a
              href={`mailto:admin.Adspace@gmail.com?subject=Cotización%20de%20creativo%20—%20${encodeURIComponent(space.title)}&body=Hola%2C%20me%20interesa%20cotizar%20el%20diseño%20del%20creativo%20para%20el%20espacio%20"${encodeURIComponent(space.title)}".%0A%0AGracias.`}
              className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition text-xs font-medium border border-purple-500/30 hover:border-purple-400/50 rounded-lg px-3 py-1.5"
            >
              <Paintbrush size={12} />
              Pedir cotización de creativo
            </a>
          </div>
        </div>

        {/* Desglose de precio */}
        <div className="border-t border-zinc-800 pt-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Campaña ({days} días × UYU {pricePerDay.toLocaleString()}/día)</span>
            <span className="text-white">UYU {campaignPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-zinc-800">
            <span className="text-white">Total</span>
            <span className="text-blue-400">UYU {totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 py-4 px-6 flex items-center justify-between z-40">
        <div>
          <p className="text-gray-400 text-xs">{days >= 30 ? `${days} días · ${startDate} → ${endDate}` : "Seleccioná al menos 30 días"}</p>
          <p className="text-white font-bold text-lg">UYU {totalPrice.toLocaleString()}</p>
        </div>
        <button
          onClick={handleLaunch}
          disabled={!isValid || loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Redirigiendo...</>
          ) : (
            <>Lanzar campaña <ChevronRight size={16} /></>
          )}
        </button>
      </div>
    </>
  );
}
