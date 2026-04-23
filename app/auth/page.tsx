"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Megaphone, Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Role = "advertiser" | "owner";
type Mode = "login" | "register";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AuthForm />
    </Suspense>
  );
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("advertiser");
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/dashboard");
    });
    if (searchParams.get("error") === "link_invalido") {
      setError("El link de confirmación es inválido o expiró. Intentá registrarte de nuevo.");
    }
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
          data: { name: form.name, phone: form.phone, role },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        if (data.session) {
          await supabase.from("profiles").upsert({ id: data.user.id, email: form.email, name: form.name, phone: form.phone, role });
          router.push("/dashboard");
          router.refresh();
        } else {
          setSentTo(form.email);
          setEmailSent(true);
        }
      }
    }

    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError("");
    document.cookie = `pending_role=${role}; path=/; max-age=300; SameSite=Lax`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  if (emailSent) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4 text-center">
        <div className="max-w-sm w-full">
          <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail size={28} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Revisá tu email</h2>
          <p className="text-gray-400 text-sm mb-1">Te mandamos un link de confirmación a:</p>
          <p className="text-white font-medium mb-6">{sentTo}</p>
          <p className="text-gray-500 text-sm mb-8">
            Hacé click en el link del email para activar tu cuenta. Si no lo ves, revisá la carpeta de spam.
          </p>
          <Link href="/" className="inline-block border border-zinc-700 hover:border-white text-white text-sm px-6 py-3 rounded-xl transition">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-sm";

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition text-sm mb-8">
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Ad<span className="text-blue-500">Space</span></h1>
          <p className="text-gray-500 mt-1 text-sm">
            {mode === "login" ? "Ingresá a tu cuenta" : "Creá tu cuenta gratis"}
          </p>
        </div>

        {/* Role selector — siempre visible para el flujo de Google */}
        <div className="mb-6">
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">
            {mode === "login" ? "Si es tu primera vez, elegí tu rol" : "Soy un..."}
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

        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-60 transition text-gray-800 font-semibold py-3 rounded-xl text-sm mb-6"
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin text-gray-600" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
          )}
          Continuar con Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-gray-600">o con email</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Nombre completo</label>
                <input type="text" required placeholder="Juan García" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Teléfono</label>
                <input type="tel" required placeholder="+598 09X XXX XXX" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
              </div>
            </>
          )}

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input type="email" required placeholder="tu@email.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Contraseña</label>
            <input type="password" required placeholder="••••••••" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition text-white py-3 rounded-xl font-semibold text-sm mt-2 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === "login" ? "Ingresar" : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-blue-400 hover:text-blue-300 transition">
            {mode === "login" ? "Registrate gratis" : "Ingresá"}
          </button>
        </p>
      </div>
    </main>
  );
}
