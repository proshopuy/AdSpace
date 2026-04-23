"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/ImageUploader";

const MAX_IMAGES = 5;

export default function EditSpacePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [keptUrls, setKeptUrls] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "", city: "", location: "", traffic: "", format: "", price: "", description: "",
  });

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }

      const { data: space } = await supabase.from("spaces").select("*").eq("id", id).single();
      if (!space || space.owner_id !== user.id) { router.push("/dashboard"); return; }

      setForm({
        title: space.title ?? "",
        city: space.city ?? "",
        location: space.location ?? "",
        traffic: String(space.traffic ?? ""),
        format: space.format ?? "",
        price: String(space.price ?? ""),
        description: space.description ?? "",
      });

      // Cargar imágenes existentes
      const existing: string[] = space.images ?? (space.image ? [space.image] : []);
      setKeptUrls(existing);

      setLoading(false);
    };
    load();
  }, [id]);

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleAddFiles = (files: FileList) => {
    const arr = Array.from(files);
    const remaining = MAX_IMAGES - keptUrls.length - newFiles.length;
    const toAdd = arr.slice(0, remaining);
    setNewFiles((prev) => [...prev, ...toAdd]);
    setNewPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
  };

  const handleRemoveKept = (i: number) => setKeptUrls((prev) => prev.filter((_, idx) => idx !== i));
  const handleRemoveNew = (i: number) => {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }

    // Subir nuevas imágenes
    const newUrls: string[] = [];
    for (const file of newFiles) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("space-images")
        .upload(path, file, { upsert: true });
      if (uploadError) {
        setError("Error subiendo una imagen. Intentá de nuevo.");
        setSaving(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("space-images").getPublicUrl(path);
      newUrls.push(publicUrl);
    }

    const allImages = [...keptUrls, ...newUrls];

    const res = await fetch(`/api/spaces/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        image: allImages[0] ?? null,
        images: allImages.length > 0 ? allImages : null,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Error al guardar");
    } else {
      setSaved(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={24} className="text-blue-500 animate-spin" />
      </main>
    );
  }

  if (saved) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-center">
        <div>
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">¡Cambios guardados!</p>
          <p className="text-gray-500 text-sm mt-2">Redirigiendo al dashboard...</p>
        </div>
      </main>
    );
  }

  const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm";

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition text-sm mb-8">
          <ArrowLeft size={16} />
          Volver al dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-2">Editar espacio</h1>
        <p className="text-gray-500 text-sm mb-8">Solo podés editar si no hay contrato activo.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Fotos (hasta {MAX_IMAGES})</label>
            <ImageUploader
              keptUrls={keptUrls}
              newPreviews={newPreviews}
              onAdd={handleAddFiles}
              onRemoveKept={handleRemoveKept}
              onRemoveNew={handleRemoveNew}
              max={MAX_IMAGES}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Título</label>
            <input type="text" required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Ciudad</label>
            <select required value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass}>
              <option value="">Seleccioná</option>
              <option>Montevideo</option>
              <option>Punta del Este</option>
              <option>Canelones</option>
              <option>Maldonado</option>
              <option>Salto</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Dirección o zona</label>
            <input type="text" required value={form.location} onChange={(e) => set("location", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Tráfico estimado (personas/día)</label>
            <input type="number" required value={form.traffic} onChange={(e) => set("traffic", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Formato publicitario</label>
            <input type="text" required value={form.format} onChange={(e) => set("format", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Precio mensual (UYU)</label>
            <input type="number" required value={form.price} onChange={(e) => set("price", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Descripción</label>
            <textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)}
              className={`${inputClass} resize-none`} />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Link href="/dashboard" className="flex-1 border border-zinc-700 hover:border-white transition text-white py-3 rounded-xl text-sm text-center">
              Cancelar
            </Link>
            <button type="submit" disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
              {saving && <Loader2 size={15} className="animate-spin" />}
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
