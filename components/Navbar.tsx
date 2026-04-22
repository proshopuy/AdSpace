"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-xl tracking-tight">
          Ad<span className="text-blue-500">Space</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="/spaces" className="hover:text-white transition">
            Explorar espacios
          </Link>
          <Link href="/#como-funciona" className="hover:text-white transition">
            Cómo funciona
          </Link>
          <Link href="/#precios" className="hover:text-white transition">
            Precios
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
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
        </div>
      )}
    </nav>
  );
}
