"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, MapPin, Users, TrendingUp,
  Plus, LogOut, CheckCircle, Clock, XCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TYPE_LABELS, SpaceType } from "@/lib/spaces";

interface Props {
  user: { name: string; email: string };
  role: "advertiser" | "owner";
  spaces: any[];
  contracts: any[];
}

const STATUS_MAP: Record<string, { label: string; icon: any; color: string }> = {
  pending:   { label: "Pendiente",  icon: Clock,        color: "text-yellow-400" },
  active:    { label: "Activo",     icon: CheckCircle,  color: "text-green-400" },
  cancelled: { label: "Cancelado",  icon: XCircle,      color: "text-red-400" },
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

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <LayoutDashboard size={14} />
              Dashboard
            </div>
            <h1 className="text-3xl font-bold">Hola, {user.name.split(" ")[0]} 👋</h1>
            <p className="text-gray-500 text-sm mt-1">
              {isOwner ? "Dueño de espacios" : "Anunciante"} · {user.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isOwner && (
              <Link
                href="/publish"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded-xl text-sm font-medium"
              >
                <Plus size={15} />
                Nuevo espacio
              </Link>
            )}
            {!isOwner && (
              <Link
                href="/spaces"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded-xl text-sm font-medium"
              >
                <Plus size={15} />
                Explorar espacios
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-white border border-zinc-800 hover:border-zinc-600 transition px-4 py-2 rounded-xl text-sm"
            >
              <LogOut size={15} />
              Salir
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {isOwner ? (
            <>
              <StatCard label="Espacios publicados" value={spaces.length} icon={MapPin} />
              <StatCard label="Espacios activos" value={spaces.filter((s) => s.available).length} icon={CheckCircle} />
              <StatCard
                label="Tráfico total/día"
                value={spaces.reduce((acc: number, s: any) => acc + (s.traffic || 0), 0).toLocaleString()}
                icon={Users}
              />
              <StatCard
                label="Ingresos estimados"
                value={`USD ${spaces.reduce((acc: number, s: any) => acc + (s.price || 0), 0).toLocaleString()}`}
                icon={TrendingUp}
              />
            </>
          ) : (
            <>
              <StatCard label="Contratos activos" value={contracts.filter((c) => c.status === "active").length} icon={CheckCircle} />
              <StatCard label="Contratos totales" value={contracts.length} icon={MapPin} />
              <StatCard label="Pendientes" value={contracts.filter((c) => c.status === "pending").length} icon={Clock} />
              <StatCard label="Espacios vistos" value="—" icon={TrendingUp} />
            </>
          )}
        </div>

        {/* Content */}
        {isOwner ? (
          <OwnerSpaces spaces={spaces} />
        ) : (
          <AdvertiserContracts contracts={contracts} />
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

function OwnerSpaces({ spaces }: { spaces: any[] }) {
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
              {space.image_url && (
                <img src={space.image_url} className="w-14 h-14 rounded-xl object-cover shrink-0" alt="" />
              )}
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{space.title}</p>
                <p className="text-gray-500 text-sm">{space.city} · {TYPE_LABELS[space.type as SpaceType] ?? space.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0 text-sm">
              <div className="text-center hidden md:block">
                <p className="text-white font-semibold">{space.traffic?.toLocaleString() ?? "—"}</p>
                <p className="text-gray-500 text-xs">personas/día</p>
              </div>
              <div className="text-center">
                <p className="text-blue-400 font-bold">USD {space.price?.toLocaleString() ?? "—"}</p>
                <p className="text-gray-500 text-xs">/mes</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${
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
    </div>
  );
}

function AdvertiserContracts({ contracts }: { contracts: any[] }) {
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
          return (
            <div key={c.id} className="bg-zinc-900 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-medium">{c.spaces?.title ?? "Espacio"}</p>
                <p className="text-gray-500 text-sm">{c.spaces?.city}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 text-sm">
                <p className="text-blue-400 font-bold">USD {c.spaces?.price?.toLocaleString() ?? "—"}<span className="text-gray-600">/mes</span></p>
                <span className={`flex items-center gap-1 text-xs ${status.color}`}>
                  <StatusIcon size={13} />
                  {status.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ title, description, cta }: {
  title: string;
  description: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-12 text-center">
      <p className="text-white font-semibold text-lg mb-2">{title}</p>
      <p className="text-gray-500 text-sm mb-6">{description}</p>
      <Link
        href={cta.href}
        className="inline-block bg-blue-600 hover:bg-blue-500 transition text-white px-6 py-3 rounded-xl text-sm font-medium"
      >
        {cta.label}
      </Link>
    </div>
  );
}
