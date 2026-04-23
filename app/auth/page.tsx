"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Megaphone, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Role = "advertiser" | "owner";
type Mode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("advertiser");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/dashboard");
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) {
        setError("Email o contraseña incorrectos.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name, role },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Insert profile
        await supabase.from("profiles").insert({
          id: data.user.id,
          name: form.name,
          role,
        });
        router.push("/dashboard");
        router.refresh();
      }
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition text-sm mb-8">
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Ad<span className="text-blue-500">Space</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {mode === "login" ? "Ingresá a tu cuenta" : "Creá tu cuenta gratis"}
          </p>
        </div>

        {mode === "register" && (
          <div className="mb-6">
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">
              Soy un...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("advertiser")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${
                  role === "advertiser"
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-zinc-800 text-gray-500 hover:border-zinc-600"
                }`}
              >
                <Megaphone size={22} />
                <span className="text-sm font-medium">Anunciante</span>
                <span className="text-xs text-gray-600 text-center">Quiero publicitar mi marca</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("owner")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${
                  role === "owner"
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-zinc-800 text-gray-500 hover:border-zinc-600"
                }`}
              >
                <Building2 size={22} />
                <span className="text-sm font-medium">Dueño de espacio</span>
                <span className="text-xs text-gray-600 text-center">Tengo un espacio para ofrecer</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Nombre completo</label>
              <input
                type="text"
                required
                placeholder="Juan García"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
              />
            </div>
          )}

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Contraseña</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition text-white py-3 rounded-xl font-semibold text-sm mt-2 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === "login" ? "Ingresar" : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-blue-400 hover:text-blue-300 transition"
          >
            {mode === "login" ? "Registrate gratis" : "Ingresá"}
          </button>
        </p>
      </div>
    </main>
  );
}
