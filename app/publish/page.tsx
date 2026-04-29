"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Loader2, Search } from "lucide-react";
import { TYPE_LABELS } from "@/lib/spaces";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/ImageUploader";

const STEPS = ["Tipo de espacio", "Ubicación y datos", "Precio y detalles"];
const MAX_IMAGES = 5;

export default function PublishPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [autoApproved, setAutoApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [typeSearch, setTypeSearch] = useState("");
  const [customType, setCustomType] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [form, setForm] = useState({
    type: "",
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

  const handleAddFiles = (files: FileList) => {
    const arr = Array.from(files);
    const remaining = MAX_IMAGES - newFiles.length;
    const toAdd = arr.slice(0, remaining);
    setNewFiles((prev) => [...prev, ...toAdd]);
    setNewPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
  };

  const handleRemoveNew = (i: number) => {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }

    const uploadedUrls: string[] = [];

    for (const file of newFiles) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("space-images")
        .upload(path, file, { upsert: true });
      if (uploadError) {
        setError("Error subiendo una imagen. Intentá de nuevo.");
        setLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("space-images").getPublicUrl(path);
      uploadedUrls.push(publicUrl);
    }

    const { error: insertError } = await supabase.from("spaces").insert({
      owner_id: user.id,
      type: form.type,
      title: form.title,
      city: form.city,
      location: form.location,
      traffic: parseInt(form.traffic),
      price: parseInt(form.price),
      format: form.format,
      description: form.description,
      image: uploadedUrls[0] ?? null,
      images: uploadedUrls.length > 0 ? uploadedUrls : null,
      available: true,
      approved: false,
    });

    if (insertError) {
      setError(insertError.message || "Hubo un error al publicar. Intentá de nuevo.");
    } else {
      const { data: latest } = await supabase
        .from("spaces")
        .select("id")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (latest?.id) {
        const review = await fetch("/api/review-space", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ spaceId: latest.id }),
        }).then((r) => r.json()).catch(() => ({ approved: false }));
        setAutoApproved(review.approved === true);
      }
      setSubmitted(true);
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4 text-center">
        <div>
          <CheckCircle size={56} className={`mx-auto mb-4 ${autoApproved ? "text-green-500" : "text-blue-500"}`} />
          <h2 className="text-3xl font-bold text-white mb-3">
            {autoApproved ? "¡Espacio activo!" : "¡Espacio publicado!"}
          </h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            {autoApproved
              ? "Tu espacio fue revisado y aprobado automáticamente. Ya es visible para los anunciantes."
              : "Tu espacio fue enviado para revisión. Te avisamos en menos de 24hs cuando esté activo."}
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
                i <= step ? "bg-blue-600 text-white" : "bg-zinc-800 text-gray-600"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? "text-white" : "text-gray-600"}`}>{label}</span>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-blue-600" : "bg-zinc-800"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <div className="space-y-4">
              <label className="text-sm text-gray-400 block mb-1">¿Qué tipo de espacio tenés?</label>

              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar tipo de espacio..."
                  value={typeSearch}
                  onChange={(e) => setTypeSearch(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(TYPE_LABELS)
                  .filter(([, label]) =>
                    !typeSearch || label.toLowerCase().includes(typeSearch.toLowerCase())
                  )
                  .map(([key, label]) => (
                    <button key={key} type="button" onClick={() => { set("type", key); setCustomType(""); setShowCustomInput(false); }}
                      className={`p-4 rounded-xl border text-sm font-medium text-left transition ${
                        form.type === key && !customType ? "border-blue-500 bg-blue-500/10 text-white" : "border-zinc-800 text-gray-500 hover:border-zinc-600"
                      }`}>
                      {label}
                    </button>
                  ))}

                <button
                  type="button"
                  onClick={() => { setShowCustomInput(true); set("type", customType); }}
                  className={`p-4 rounded-xl border text-sm font-medium text-left transition col-span-2 ${
                    showCustomInput ? "border-blue-500 bg-blue-500/10 text-white" : "border-dashed border-zinc-700 text-gray-500 hover:border-zinc-500"
                  }`}
                >
                  + Crear tipo nuevo
                </button>
              </div>

              {showCustomInput && (
                <input
                  type="text"
                  placeholder="Nombre del tipo de espacio..."
                  value={customType}
                  onChange={(e) => { setCustomType(e.target.value); set("type", e.target.value); }}
                  autoFocus
                  className="w-full bg-zinc-900 border border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition text-sm"
                />
              )}

              <button type="button" disabled={!form.type} onClick={() => setStep(1)}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition text-white py-3 rounded-xl font-semibold text-sm">
                Continuar
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Título del espacio</label>
                <input type="text" required placeholder="Ej: Gimnasio en Pocitos" value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Ciudad</label>
                <select required value={form.city} onChange={(e) => set("city", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition text-sm">
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
                <input type="text" required placeholder="Ej: Av. 18 de Julio 1200" value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Tráfico estimado (personas/día)</label>
                <input type="number" required placeholder="Ej: 500" value={form.traffic}
                  onChange={(e) => set("traffic", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(0)} className="flex-1 border border-zinc-700 hover:border-white transition text-white py-3 rounded-xl text-sm">Atrás</button>
                <button type="button" onClick={() => setStep(2)}
                  disabled={!form.title || !form.city || !form.location || !form.traffic}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition text-white py-3 rounded-xl font-semibold text-sm">
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Fotos del espacio (opcional, hasta {MAX_IMAGES})</label>
                <ImageUploader
                  keptUrls={[]}
                  newPreviews={newPreviews}
                  onAdd={handleAddFiles}
                  onRemoveKept={() => {}}
                  onRemoveNew={handleRemoveNew}
                  max={MAX_IMAGES}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Formato publicitario</label>
                <input type="text" required placeholder='Ej: Pantalla LED 55", Ploteo vehicular' value={form.format}
                  onChange={(e) => set("format", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Precio mensual (UYU)</label>
                <input type="number" required placeholder="Ej: 10000" value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Descripción</label>
                <textarea required rows={4} placeholder="Contá más sobre tu espacio..." value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm resize-none" />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-zinc-700 hover:border-white transition text-white py-3 rounded-xl text-sm">Atrás</button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
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
