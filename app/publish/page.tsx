"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { TYPE_LABELS, SpaceType } from "@/lib/spaces";
import { createClient } from "@/lib/supabase/client";

const STEPS = ["Tipo de espacio", "Ubicación y datos", "Precio y detalles"];

export default function PublishPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    type: "" as SpaceType | "",
    title: "",
    city: "",
    location: "",
    traffic: "",
    format: "",
    price: "",
    description: "",
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth");
      return;
    }

    const { error } = await supabase.from("spaces").insert({
      owner_id: user.id,
      type: form.type,
      title: form.title,
      city: form.city,
      location: form.location,
      traffic: parseInt(form.traffic),
      price: parseInt(form.price),
      format: form.format,
      description: form.description,
      available: true,
      approved: true,
    });

    if (error) {
      setError("Hubo un error al publicar. Intentá de nuevo.");
    } else {
      setSubmitted(true);
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4 text-center">
        <div>
          <CheckCircle size={56} className="text-blue-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">¡Espacio publicado!</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            Tu espacio fue enviado para revisión. Te avisamos en menos de 24hs cuando esté activo.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 transition text-white px-6 py-3 rounded-xl text-sm font-semibold">
              Ver mi dashboard
            </Link>
            <Link href="/" className="border border-zinc-700 hover:border-white text-white px-6 py-3 rounded-xl text-sm transition">
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 px-4">
      <div className="max-w-xl mx-auto">

        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition text-sm mb-8">
          <ArrowLeft size={16} />
          Volver
        </Link>

        <h1 className="text-3xl font-bold mb-2">Publicar mi espacio</h1>
        <p className="text-gray-500 text-sm mb-8">Completá los datos y empezá a recibir anunciantes.</p>

        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition ${
                i < step ? "bg-blue-600 text-white" : i === step ? "bg-blue-600 text-white" : "bg-zinc-800 text-gray-600"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? "text-white" : "text-gray-600"}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 ${i < step ? "bg-blue-600" : "bg-zinc-800"}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <div className="space-y-4">
              <label className="text-sm text-gray-400 block mb-3">¿Qué tipo de espacio tenés?</label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(TYPE_LABELS) as [SpaceType, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => set("type", key)}
                    className={`p-4 rounded-xl border text-sm font-medium text-left transition ${
                      form.type === key
                        ? "border-blue-500 bg-blue-500/10 text-white"
                        : "border-zinc-800 text-gray-500 hover:border-zinc-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={!form.type}
                onClick={() => setStep(1)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition text-white py-3 rounded-xl font-semibold text-sm"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Título del espacio</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Gimnasio en Pocitos"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Ciudad</label>
                <select
                  required
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                >
                  <option value="">Seleccioná una ciudad</option>
                  <option>Montevideo</option>
                  <option>Punta del Este</option>
                  <option>Canelones</option>
                  <option>Maldonado</option>
                  <option>Salto</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Dirección o zona</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Av. 18 de Julio 1200"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Tráfico estimado (personas/día)</label>
                <input
                  type="number"
                  required
                  placeholder="Ej: 500"
                  value={form.traffic}
                  onChange={(e) => set("traffic", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(0)} className="flex-1 border border-zinc-700 hover:border-white transition text-white py-3 rounded-xl text-sm">
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!form.title || !form.city || !form.location || !form.traffic}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition text-white py-3 rounded-xl font-semibold text-sm"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Formato publicitario</label>
                <input
                  type="text"
                  required
                  placeholder='Ej: Pantalla LED 55", Ploteo vehicular'
                  value={form.format}
                  onChange={(e) => set("format", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Precio mensual (USD)</label>
                <input
                  type="number"
                  required
                  placeholder="Ej: 250"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Descripción</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Contá más sobre tu espacio: características, horarios, tipo de público..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm resize-none"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-zinc-700 hover:border-white transition text-white py-3 rounded-xl text-sm">
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  Publicar espacio
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
