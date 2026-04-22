"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, MapPin, Users, DollarSign, Clock, ShieldCheck } from "lucide-react";
import { TYPE_LABELS, SpaceType } from "@/lib/spaces";

interface Space {
  id: number;
  title: string;
  city: string;
  type: string;
  price: number;
  traffic?: number;
  description?: string;
  image?: string;
  available?: boolean;
  created_at: string;
}

interface Props {
  pending: Space[];
  approved: Space[];
}

export default function AdminClient({ pending, approved }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [done, setDone] = useState<number[]>([]);

  const handle = async (spaceId: number, action: "approve" | "reject") => {
    setLoadingId(spaceId);
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spaceId, action }),
    });
    setDone((prev) => [...prev, spaceId]);
    setLoadingId(null);
    router.refresh();
  };

  const visible = pending.filter((s) => !done.includes(s.id));

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck size={20} className="text-blue-400" />
          <h1 className="text-2xl font-bold">Panel de administración</h1>
        </div>
        <p className="text-gray-500 text-sm mb-10">
          Revisá y aprobá los espacios antes de que aparezcan en el marketplace.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-900 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-yellow-400">{pending.length}</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Aprobados</p>
            <p className="text-3xl font-bold text-green-400">{approved.length}</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1">Total</p>
            <p className="text-3xl font-bold text-white">{pending.length + approved.length}</p>
          </div>
        </div>

        {/* Pendientes */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock size={16} className="text-yellow-400" />
            Pendientes de revisión ({visible.length})
          </h2>

          {visible.length === 0 ? (
            <div className="bg-zinc-900 rounded-2xl p-10 text-center text-gray-500">
              No hay espacios pendientes. Todo al día.
            </div>
          ) : (
            <div className="space-y-4">
              {visible.map((space) => (
                <div key={space.id} className="bg-zinc-900 rounded-2xl overflow-hidden">
                  <div className="flex gap-4 p-5">
                    {space.image ? (
                      <img
                        src={space.image}
                        alt={space.title}
                        className="w-24 h-24 rounded-xl object-cover shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-zinc-800 shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-white font-semibold text-lg">{space.title}</p>
                          <p className="text-gray-400 text-sm">
                            {TYPE_LABELS[space.type as SpaceType] ?? space.type} · {space.city}
                          </p>
                        </div>
                        <span className="text-xs text-gray-600 shrink-0">
                          {new Date(space.created_at).toLocaleDateString("es-UY")}
                        </span>
                      </div>

                      {space.description && (
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{space.description}</p>
                      )}

                      <div className="flex items-center gap-5 mt-3 text-sm text-gray-400">
                        {space.traffic && (
                          <span className="flex items-center gap-1">
                            <Users size={13} />
                            {space.traffic.toLocaleString()} personas/día
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-blue-400 font-semibold">
                          <DollarSign size={13} />
                          USD {space.price?.toLocaleString()}/mes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 px-5 py-3 flex justify-end gap-3">
                    <button
                      onClick={() => handle(space.id, "reject")}
                      disabled={loadingId === space.id}
                      className="flex items-center gap-1.5 text-sm border border-red-500/30 text-red-400 hover:bg-red-400/10 px-4 py-2 rounded-xl transition disabled:opacity-50"
                    >
                      <XCircle size={15} />
                      Rechazar
                    </button>
                    <button
                      onClick={() => handle(space.id, "approve")}
                      disabled={loadingId === space.id}
                      className="flex items-center gap-1.5 text-sm bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl transition disabled:opacity-50"
                    >
                      <CheckCircle size={15} />
                      Aprobar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Aprobados recientes */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400" />
            Aprobados recientes
          </h2>
          <div className="space-y-2">
            {approved.map((space) => (
              <div key={space.id} className="bg-zinc-900 rounded-xl px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{space.title}</p>
                  <p className="text-gray-500 text-xs">{TYPE_LABELS[space.type as SpaceType] ?? space.type} · {space.city}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-400 font-semibold">USD {space.price?.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    space.available
                      ? "border-green-500/30 text-green-400 bg-green-400/10"
                      : "border-zinc-700 text-gray-500"
                  }`}>
                    {space.available ? "Disponible" : "Ocupado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-white transition">
            ← Volver al dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
