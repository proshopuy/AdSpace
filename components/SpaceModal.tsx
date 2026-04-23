"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Users, Monitor, Loader2 } from "lucide-react";
import { Space, TYPE_LABELS } from "@/lib/spaces";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  space: Space;
  open: boolean;
  onClose: () => void;
}

export default function SpaceModal({ space, open, onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleContratar = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId: space.id,
          title: space.title,
          price: space.price,
        }),
      });

      const { url, error } = await res.json();
      if (error || !url) {
        alert("Error al iniciar el pago. Intentá de nuevo.");
        return;
      }

      window.location.href = url;
    } catch {
      alert("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 bg-zinc-800">
          {space.image && (
            <img
              src={space.image}
              alt={space.title}
              className="w-full h-64 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition"
          >
            <X size={18} />
          </button>
          <span className="absolute top-4 left-4 bg-blue-600 text-xs text-white px-2 py-1 rounded-md">
            {TYPE_LABELS[space.type]}
          </span>
        </div>

        <div className="p-6">
          <h2 className="text-white text-2xl font-bold">{space.title}</h2>

          <div className="flex items-center gap-1 mt-2 text-gray-400 text-sm">
            <MapPin size={14} />
            <span>{space.location}, {space.city}</span>
          </div>

          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            {space.description}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="bg-zinc-800 rounded-xl p-3 text-center">
              <Users size={18} className="mx-auto text-blue-400 mb-1" />
              <p className="text-white font-semibold text-sm">{space.traffic.toLocaleString()}</p>
              <p className="text-gray-500 text-xs">personas/día</p>
            </div>
            <div className="bg-zinc-800 rounded-xl p-3 text-center">
              <Monitor size={18} className="mx-auto text-blue-400 mb-1" />
              <p className="text-white font-semibold text-sm">{space.format}</p>
              <p className="text-gray-500 text-xs">formato</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div>
              <span className="text-blue-500 font-bold text-2xl">
                USD {space.price.toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm">/mes</span>
            </div>

            {space.available ? (
              <button
                onClick={handleContratar}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Redirigiendo..." : "Contratar espacio"}
              </button>
            ) : (
              <span className="text-gray-500 text-sm border border-gray-700 px-6 py-3 rounded-xl">
                No disponible
              </span>
            )}
          </div>

          <p className="mt-3 text-center text-xs text-gray-600">
            Pago seguro con MercadoPago · Cancelá cuando quieras
          </p>
        </div>
      </div>
    </div>
  );
}
