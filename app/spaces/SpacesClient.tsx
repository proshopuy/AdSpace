"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import SpaceCard from "@/components/SpaceCard";
import { CITIES, TYPE_LABELS, SpaceType, Space } from "@/lib/spaces";

const TYPES = Object.entries(TYPE_LABELS) as [SpaceType, string][];

export default function SpacesClient({ spaces }: { spaces: Space[] }) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Todas");
  const [type, setType] = useState<SpaceType | "all">("all");
  const [maxPrice, setMaxPrice] = useState(60000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState<"price_asc" | "price_desc" | "traffic">("traffic");

  const filtered = useMemo(() => {
    return spaces.filter((s) => {
      if (search && !s.title.toLowerCase().includes(search.toLowerCase()) &&
          !s.location.toLowerCase().includes(search.toLowerCase())) return false;
      if (city !== "Todas" && s.city !== city) return false;
      if (type !== "all" && s.type !== type) return false;
      if (s.price > maxPrice) return false;
      if (onlyAvailable && !s.available) return false;
      return true;
    }).sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      return b.traffic - a.traffic;
    });
  }, [spaces, search, city, type, maxPrice, onlyAvailable, sort]);

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">Explorar espacios</h1>
          <p className="mt-3 text-gray-400">
            {filtered.length} espacio{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="bg-zinc-900 rounded-2xl p-5 space-y-6 sticky top-24">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <SlidersHorizontal size={16} />
                Filtros
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Ciudad</label>
                <div className="flex flex-col gap-1">
                  {CITIES.map((c) => (
                    <button key={c} onClick={() => setCity(c)}
                      className={`text-sm text-left px-3 py-2 rounded-lg transition ${city === c ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-zinc-800"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Tipo de espacio</label>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setType("all")}
                    className={`text-sm text-left px-3 py-2 rounded-lg transition ${type === "all" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-zinc-800"}`}>
                    Todos
                  </button>
                  {TYPES.map(([key, label]) => (
                    <button key={key} onClick={() => setType(key)}
                      className={`text-sm text-left px-3 py-2 rounded-lg transition ${type === key ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-zinc-800"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                  Precio máximo: <span className="text-white">UYU {maxPrice.toLocaleString()}</span>
                </label>
                <input type="range" min={2000} max={60000} step={1000} value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-500" />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>UYU 2.000</span>
                  <span>UYU 60.000</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">Solo disponibles</label>
                <button onClick={() => setOnlyAvailable(!onlyAvailable)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${onlyAvailable ? "bg-blue-600" : "bg-zinc-700"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${onlyAvailable ? "left-5" : "left-0.5"}`} />
                </button>
              </div>

              <button onClick={() => { setSearch(""); setCity("Todas"); setType("all"); setMaxPrice(60000); setOnlyAvailable(false); }}
                className="text-xs text-gray-500 hover:text-white transition">
                Limpiar filtros
              </button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex justify-end mb-5">
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
                className="bg-zinc-900 border border-zinc-800 text-sm text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                <option value="traffic">Mayor tráfico</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 text-gray-600">
                <p className="text-lg">No encontramos espacios con esos filtros.</p>
                <p className="text-sm mt-2">Probá ajustando los criterios de búsqueda.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((space) => (
                  <SpaceCard key={space.id} space={space} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
