"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import SpaceCard from "@/components/SpaceCard";
import { CITIES, TYPE_LABELS, Space } from "@/lib/spaces";

const PAGE_SIZE = 9;

export default function SpacesClient({ spaces }: { spaces: Space[] }) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Todas");
  const [type, setType] = useState("all");
  const [typeSearch, setTypeSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState<"price_asc" | "price_desc" | "traffic">("traffic");
  const [page, setPage] = useState(1);

  const availableTypes = useMemo(() => {
    const fromSpaces = Array.from(new Set(spaces.map((s) => s.type)));
    const known = Object.keys(TYPE_LABELS);
    const all = Array.from(new Set([...known, ...fromSpaces]));
    return all.map((key) => ({
      key,
      label: TYPE_LABELS[key as keyof typeof TYPE_LABELS] ?? key,
    }));
  }, [spaces]);

  const visibleTypes = useMemo(
    () =>
      typeSearch
        ? availableTypes.filter((t) =>
            t.label.toLowerCase().includes(typeSearch.toLowerCase())
          )
        : availableTypes,
    [availableTypes, typeSearch]
  );

  const filtered = useMemo(() => {
    setPage(1);
    const min = minPrice !== "" ? Number(minPrice) : 0;
    const max = maxPrice !== "" ? Number(maxPrice) : Infinity;
    return spaces.filter((s) => {
      if (search && !s.title.toLowerCase().includes(search.toLowerCase()) &&
          !s.location.toLowerCase().includes(search.toLowerCase())) return false;
      if (city !== "Todas" && s.city !== city) return false;
      if (type !== "all" && s.type !== type) return false;
      if (s.price < min || s.price > max) return false;
      if (onlyAvailable && !s.available) return false;
      return true;
    }).sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      return b.traffic - a.traffic;
    });
  }, [spaces, search, city, type, minPrice, maxPrice, onlyAvailable, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
                <div className="relative mb-2">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar tipo..."
                    value={typeSearch}
                    onChange={(e) => setTypeSearch(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-7 pr-3 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                  {!typeSearch && (
                    <button onClick={() => setType("all")}
                      className={`text-sm text-left px-3 py-2 rounded-lg transition ${type === "all" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-zinc-800"}`}>
                      Todos
                    </button>
                  )}
                  {visibleTypes.map(({ key, label }) => (
                    <button key={key} onClick={() => setType(key)}
                      className={`text-sm text-left px-3 py-2 rounded-lg transition ${type === key ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-zinc-800"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Precio (UYU/mes)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">Solo disponibles</label>
                <button onClick={() => setOnlyAvailable(!onlyAvailable)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${onlyAvailable ? "bg-blue-600" : "bg-zinc-700"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${onlyAvailable ? "left-5" : "left-0.5"}`} />
                </button>
              </div>

              <button onClick={() => { setSearch(""); setCity("Todas"); setType("all"); setTypeSearch(""); setMinPrice(""); setMaxPrice(""); setOnlyAvailable(false); }}
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
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginated.map((space) => (
                    <SpaceCard key={space.id} space={space} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => { setPage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={page === 1}
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                          p === page
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-900 border border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-600"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
