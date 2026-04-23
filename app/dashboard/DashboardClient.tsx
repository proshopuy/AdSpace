"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, MapPin, Users, TrendingUp,
  Plus, LogOut, CheckCircle, Clock, XCircle, Calendar, DollarSign,
  Pencil, Trash2, AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TYPE_LABELS, SpaceType } from "@/lib/spaces";
import { useState } from "react";

interface Props {
  user: { name: string; email: string; id: string };
  role: "advertiser" | "owner";
  spaces: any[];
  contracts: any[];
}

const STATUS_MAP: Record<string, { label: string; icon: any; color: string }> = {
  pending:        { label: "Pendiente",            icon: Clock,        color: "text-yellow-400" },
  active:         { label: "Activo",               icon: CheckCircle,  color: "text-green-400" },
  cancel_pending: { label: "Cancelación pendiente", icon: AlertCircle,  color: "text-orange-400" },
  cancelled:      { label: "Cancelado",            icon: XCircle,      color: "text-red-400" },
};

export default function DashboardClient({ user, role, spaces, contracts }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const isOwner = role === "owner";

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <LayoutDashboard size={14} />
              Dashboard
            </div>
            <h1 className="text-3xl font-bold">Hola, {user.name.split(" ")[0]}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {isOwner ? "Dueño de espacios" : "Anunciante"} · {user.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isOwner && (
              <Link href="/publish"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded-xl text-sm font-medium">
                <Plus size={15} />
                Nuevo espacio
              </Link>
            )}
            {!isOwner && (
              <Link href="/spaces"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded-xl text-sm font-medium">
                <Plus size={15} />
                Explorar espacios
              </Link>
            )}
            <button onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-white border border-zinc-800 hover:border-zinc-600 transition px-4 py-2 rounded-xl text-sm">
              <LogOut size={15} />
              Salir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {isOwner ? (
            <>
              <StatCard label="Espacios publicados" value={spaces.length} icon={MapPin} />
              <StatCard label="Espacios activos" value={spaces.filter((s) => s.available).length} icon={CheckCircle} />
              <StatCard label="Tráfico total/día" value={spaces.reduce((acc: number, s: any) => acc + (s.traffic || 0), 0).toLocaleString()} icon={Users} />
              <StatCard label="Ingresos estimados" value={`UYU ${spaces.reduce((acc: number, s: any) => acc + (s.price || 0), 0).toLocaleString()}`} icon={TrendingUp} />
            </>
          ) : (
            <>
              <StatCard label="Contratos activos" value={contracts.filter((c) => c.status === "active").length} icon={CheckCircle} />
              <StatCard label="Contratos totales" value={contracts.length} icon={MapPin} />
              <StatCard label="Gasto mensual" value={`UYU ${contracts.filter((c) => c.status === "active").reduce((acc: number, c: any) => acc + (c.spaces?.price || 0), 0).toLocaleString()}`} icon={DollarSign} />
              <StatCard label="Pendientes" value={contracts.filter((c) => c.status === "pending").length} icon={Clock} />
            </>
          )}
        </div>

        {isOwner ? (
          <div className="space-y-10">
            <OwnerSpaces spaces={spaces} onRefresh={() => router.refresh()} />
            {contracts && contracts.length > 0 && (
              <OwnerContracts contracts={contracts} userId={user.id} onRefresh={() => router.refresh()} />
            )}
          </div>
        ) : (
          <AdvertiserContracts contracts={contracts} userId={user.id} onRefresh={() => router.refresh()} />
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 text-xs">{label}</span>
        <Icon size={16} className="text-blue-400" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function OwnerSpaces({ spaces, onRefresh }: { spaces: any[]; onRefresh: () => void }) {
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que querés eliminar este espacio? Esta acción no se puede deshacer.")) return;
    setDeleting(id);
    const res = await fetch(`/api/spaces/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error ?? "Error al eliminar");
    } else {
      onRefresh();
    }
    setDeleting(null);
  };

  if (spaces.length === 0) {
    return (
      <EmptyState
        title="Todavía no publicaste ningún espacio"
        description="Publicá tu primer espacio y empezá a recibir anunciantes."
        cta={{ label: "Publicar espacio", href: "/publish" }}
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-5">Mis espacios</h2>
      <div className="space-y-3">
        {spaces.map((space: any) => (
          <div key={space.id} className="bg-zinc-900 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {(space.images?.[0] ?? space.image) ? (
                <img src={space.images?.[0] ?? space.image} className="w-14 h-14 rounded-xl object-cover shrink-0" alt=""
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-zinc-800 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{space.title}</p>
                <p className="text-gray-500 text-sm">{space.city} · {TYPE_LABELS[space.type as SpaceType] ?? space.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center hidden md:block">
                <p className="text-blue-400 font-bold text-sm">UYU {space.price?.toLocaleString() ?? "—"}</p>
                <p className="text-gray-500 text-xs">/mes</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border hidden sm:block ${
                !space.approved
                  ? "border-yellow-500/30 text-yellow-400 bg-yellow-400/10"
                  : space.available
                  ? "border-green-500/30 text-green-400 bg-green-400/10"
                  : "border-zinc-700 text-gray-500"
              }`}>
                {!space.approved ? "En revisión" : space.available ? "Disponible" : "Ocupado"}
              </span>

              <div className="flex items-center gap-2">
                <Link href={`/dashboard/spaces/${space.id}/edit`}
                  className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                  title="Editar">
                  <Pencil size={15} />
                </Link>
                {space.available && (
                  <button
                    onClick={() => handleDelete(space.id)}
                    disabled={deleting === space.id}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition disabled:opacity-50"
                    title="Eliminar">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OwnerContracts({ contracts, userId, onRefresh }: { contracts: any[]; userId: string; onRefresh: () => void }) {
  const [loading, setLoading] = useState<number | null>(null);

  const handleAction = async (contractId: number, action: "approve" | "reject") => {
    setLoading(contractId);
    const res = await fetch(`/api/contracts/${contractId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error ?? "Error");
    else onRefresh();
    setLoading(null);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-5">Contratos activos</h2>
      <div className="space-y-3">
        {contracts.map((c: any) => {
          const status = STATUS_MAP[c.status] ?? STATUS_MAP.pending;
          const StatusIcon = status.icon;
          const advertiserName = c.profiles?.name ?? c.profiles?.email ?? "Anunciante";
          const isCancelPending = c.status === "cancel_pending";
          const canAct = isCancelPending && c.cancel_requested_by !== userId;

          return (
            <div key={c.id} className="bg-zinc-900 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{c.spaces?.title}</p>
                  <p className="text-gray-500 text-sm">Anunciante: {advertiserName}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                    c.status === "active" ? "border-green-500/30 bg-green-400/10 text-green-400" :
                    c.status === "cancel_pending" ? "border-orange-500/30 bg-orange-400/10 text-orange-400" :
                    "border-zinc-700 text-gray-500"
                  }`}>
                    <StatusIcon size={11} />
                    {status.label}
                  </span>
                </div>
              </div>

              {canAct && (
                <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-3">
                  <p className="text-orange-400 text-sm flex-1">El anunciante solicitó cancelar este contrato.</p>
                  <button onClick={() => handleAction(c.id, "reject")} disabled={loading === c.id}
                    className="text-sm px-4 py-2 border border-zinc-700 hover:border-white text-gray-300 hover:text-white rounded-lg transition disabled:opacity-50">
                    Rechazar
                  </button>
                  <button onClick={() => handleAction(c.id, "approve")} disabled={loading === c.id}
                    className="text-sm px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition disabled:opacity-50">
                    Aprobar cancelación
                  </button>
                </div>
              )}

              {isCancelPending && c.cancel_requested_by === userId && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-orange-400 text-sm">Solicitaste cancelar este contrato. Esperando aprobación del anunciante.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdvertiserContracts({ contracts, userId, onRefresh }: { contracts: any[]; userId: string; onRefresh: () => void }) {
  const [loading, setLoading] = useState<number | null>(null);

  const handleCancel = async (contractId: number, action: "request" | "approve" | "reject") => {
    setLoading(contractId);
    const res = await fetch(`/api/contracts/${contractId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error ?? "Error");
    else onRefresh();
    setLoading(null);
  };

  if (contracts.length === 0) {
    return (
      <EmptyState
        title="Todavía no contrataste ningún espacio"
        description="Explorá los espacios disponibles y empezá a impactar donde importa."
        cta={{ label: "Explorar espacios", href: "/spaces" }}
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-5">Mis contratos</h2>
      <div className="space-y-3">
        {contracts.map((c: any) => {
          const status = STATUS_MAP[c.status] ?? STATUS_MAP.pending;
          const StatusIcon = status.icon;
          const startDate = c.start_date
            ? new Date(c.start_date).toLocaleDateString("es-UY", { day: "2-digit", month: "short", year: "numeric" })
            : null;
          const isCancelPending = c.status === "cancel_pending";
          const myRequest = isCancelPending && c.cancel_requested_by === userId;
          const canAct = isCancelPending && !myRequest;

          return (
            <div key={c.id} className="bg-zinc-900 rounded-2xl p-5">
              <div className="flex items-center gap-4">
                {c.spaces?.image ? (
                  <img src={c.spaces.image} alt={c.spaces.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-zinc-800 shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{c.spaces?.title ?? "Espacio"}</p>
                  <p className="text-gray-500 text-sm">{c.spaces?.city} · {TYPE_LABELS[c.spaces?.type as SpaceType] ?? c.spaces?.type}</p>
                  {startDate && (
                    <p className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                      <Calendar size={11} />
                      Inicio: {startDate}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-blue-400 font-bold text-sm">
                    UYU {c.spaces?.price?.toLocaleString() ?? "—"}<span className="text-gray-600 font-normal">/mes</span>
                  </p>
                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                    c.status === "active" ? "border-green-500/30 bg-green-400/10 text-green-400" :
                    c.status === "cancel_pending" ? "border-orange-500/30 bg-orange-400/10 text-orange-400" :
                    c.status === "cancelled" ? "border-red-500/30 bg-red-400/10 text-red-400" :
                    "border-yellow-500/30 bg-yellow-400/10 text-yellow-400"
                  }`}>
                    <StatusIcon size={11} />
                    {status.label}
                  </span>
                </div>
              </div>

              {c.status === "active" && (
                <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end">
                  <button onClick={() => {
                    if (confirm("¿Solicitás cancelar este contrato? El dueño del espacio deberá aprobarlo.")) {
                      handleCancel(c.id, "request");
                    }
                  }} disabled={loading === c.id}
                    className="text-sm px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-400/10 rounded-lg transition disabled:opacity-50">
                    Solicitar cancelación
                  </button>
                </div>
              )}

              {myRequest && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-orange-400 text-sm">Solicitaste cancelar. Esperando aprobación del dueño.</p>
                </div>
              )}

              {canAct && (
                <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-3">
                  <p className="text-orange-400 text-sm flex-1">El dueño solicitó cancelar este contrato.</p>
                  <button onClick={() => handleCancel(c.id, "reject")} disabled={loading === c.id}
                    className="text-sm px-4 py-2 border border-zinc-700 hover:border-white text-gray-300 rounded-lg transition disabled:opacity-50">
                    Rechazar
                  </button>
                  <button onClick={() => handleCancel(c.id, "approve")} disabled={loading === c.id}
                    className="text-sm px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition disabled:opacity-50">
                    Aprobar cancelación
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ title, description, cta }: {
  title: string; description: string; cta: { label: string; href: string };
}) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-12 text-center">
      <p className="text-white font-semibold text-lg mb-2">{title}</p>
      <p className="text-gray-500 text-sm mb-6">{description}</p>
      <Link href={cta.href}
        className="inline-block bg-blue-600 hover:bg-blue-500 transition text-white px-6 py-3 rounded-xl text-sm font-medium">
        {cta.label}
      </Link>
    </div>
  );
}
