"use client";

import { useState } from "react";
import { MapPin, Users, Monitor } from "lucide-react";
import { Space, TYPE_LABELS } from "@/lib/spaces";
import SpaceModal from "./SpaceModal";

const TYPE_GRADIENTS: Record<string, string> = {
  gym:        "from-blue-900 to-zinc-900",
  car:        "from-purple-900 to-zinc-900",
  vending:    "from-green-900 to-zinc-900",
  restaurant: "from-orange-900 to-zinc-900",
  billboard:  "from-red-900 to-zinc-900",
  office:     "from-cyan-900 to-zinc-900",
};

export default function SpaceCard({ space }: { space: Space }) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const gradient = TYPE_GRADIENTS[space.type] ?? "from-zinc-800 to-zinc-900";

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-zinc-900 rounded-2xl overflow-hidden group cursor-pointer transition hover:ring-1 hover:ring-blue-500/50"
      >
        <div className="overflow-hidden relative h-52">
          {!imgError && space.image ? (
            <img
              src={space.image}
              alt={space.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <span className="text-4xl opacity-30">
                {space.type === "gym" ? "🏋️" :
                 space.type === "car" ? "🚗" :
                 space.type === "vending" ? "🤖" :
                 space.type === "restaurant" ? "🍽️" :
                 space.type === "billboard" ? "📋" : "🏢"}
              </span>
            </div>
          )}

          <span className="absolute top-3 left-3 bg-black/70 text-xs text-gray-300 px-2 py-1 rounded-md">
            {TYPE_LABELS[space.type]}
          </span>

          {!space.available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-zinc-800 px-3 py-1 rounded-full">
                Ocupado
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-white text-lg font-semibold leading-snug">
            {space.title}
          </h3>

          <div className="flex items-center gap-1 mt-2 text-gray-400 text-sm">
            <MapPin size={13} />
            <span>{space.location}, {space.city}</span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users size={13} />
              {space.traffic.toLocaleString()} personas/día
            </span>
            <span className="flex items-center gap-1">
              <Monitor size={13} />
              {space.format}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-blue-500 font-bold text-lg">
              ${space.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/mes</span>
            </span>
            <button className="text-sm border border-gray-700 hover:border-blue-500 hover:text-blue-400 text-gray-400 px-3 py-1.5 rounded-lg transition">
              Ver más
            </button>
          </div>
        </div>
      </div>

      <SpaceModal space={space} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
