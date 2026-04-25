"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, LogOut, ShieldCheck, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchRole(user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
      else setRole(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
    setRole(data?.role ?? null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const displayName = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "Usuario";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-xl tracking-tight">
          Ad<span className="text-blue-500">Spots</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="/spaces" className={`hover:text-white transition ${pathname === "/spaces" ? "text-white" : ""}`}>
            Explorar espacios
          </Link>
          <Link href="/#como-funciona" className="hover:text-white transition">
            Cómo funciona
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition px-3 py-2 rounded-xl text-sm text-white"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <span className="max-w-[120px] truncate">{displayName}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-white text-sm font-medium truncate">{displayName}</p>
                    <p className="text-gray-500 text-xs truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition"
                    >
                      <LayoutDashboard size={15} />
                      Mi dashboard
                    </Link>
                    {role === "owner" && (
                      <Link
                        href="/publish"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition"
                      >
                        <span className="text-base leading-none">+</span>
                        Publicar espacio
                      </Link>
                    )}
                    {role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-zinc-800 transition"
                      >
                        <ShieldCheck size={15} />
                        Panel admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-red-400 hover:bg-zinc-800 transition"
                    >
                      <LogOut size={15} />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm text-gray-400 hover:text-white transition px-4 py-2"
              >
                Ingresar
              </Link>
              <Link
                href="/publish"
                className="text-sm bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded-lg"
              >
                Publicar espacio
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/spaces" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            Explorar espacios
          </Link>
          <Link href="/#como-funciona" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            Cómo funciona
          </Link>

          {user ? (
            <>
              <div className="border-t border-zinc-800 pt-4">
                <p className="text-gray-500 text-xs mb-3">{user.email}</p>
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white mb-3" onClick={() => setMenuOpen(false)}>
                  <LayoutDashboard size={15} />
                  Mi dashboard
                </Link>
                {role === "admin" && (
                  <Link href="/admin" className="flex items-center gap-2 text-yellow-400 mb-3" onClick={() => setMenuOpen(false)}>
                    <ShieldCheck size={15} />
                    Panel admin
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="flex items-center gap-2 text-red-400"
                >
                  <LogOut size={15} />
                  Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>
                Ingresar
              </Link>
              <Link
                href="/publish"
                className="bg-blue-600 text-white text-center px-4 py-2 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Publicar espacio
              </Link>
            </>
          )}
        </div>
      )}

      {/* Cerrar user menu al hacer click afuera */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setUserMenuOpen(false)} />
      )}
    </nav>
  );
}
