"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Users, Monitor, ChevronLeft, ChevronRight } from "lucide-react";
import { Space, TYPE_LABELS } from "@/lib/spaces";
import { useRouter } from "next/navigation";

interface Props {
  space: Space;
  open: boolean;
  onClose: () => void;
}

export default function SpaceModal({ space, open, onClose }: Props) {
  const router = useRouter();
  const [imgIndex, setImgIndex] = useState(0);

  const images = space.images && space.images.length > 0
    ? space.images
    : space.image ? [space.image] : [];

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; setImgIndex(0); }
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Galería */}
        <div className="relative h-64 bg-zinc-800">
          {images.length > 0 ? (
            <>
              <img
                src={images[imgIndex]}
                alt={space.title}
                className="w-full h-64 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIndex(i)}
                        className={`w-1.5 h-1.5 rounded-full transition ${i === imgIndex ? "bg-white" : "bg-white/40"}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : null}
          <button onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition">
            <X size={18} />
          </button>
          <span className="absolute top-4 left-4 bg-blue-600 text-xs text-white px-2 py-1 rounded-md">
            {TYPE_LABELS[space.type as keyof typeof TYPE_LABELS] ?? space.type}
          </span>
        </div>

        <div className="p-6">
          <h2 className="text-white text-2xl font-bold">{space.title}</h2>
          <div className="flex items-center gap-1 mt-2 text-gray-400 text-sm">
            <MapPin size={14} />
            <span>{space.location}, {space.city}</span>
          </div>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">{space.description}</p>

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
              <span className="text-blue-500 font-bold text-2xl">UYU {space.price.toLocaleString()}</span>
              <span className="text-gray-500 text-sm">/mes</span>
            </div>
            {space.available ? (
              <button onClick={() => router.push(`/spaces/${space.id}`)}
                className="bg-blue-600 hover:bg-blue-500 transition text-white px-6 py-3 rounded-xl font-semibold">
                Planificar campaña
              </button>
            ) : (
              <span className="text-gray-500 text-sm border border-gray-700 px-6 py-3 rounded-xl">No disponible</span>
            )}
          </div>
          <p className="mt-3 text-center text-xs text-gray-600">Pago seguro con MercadoPago · Cancelá cuando quieras</p>
        </div>
      </div>
    </div>
  );
}
