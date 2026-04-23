"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrada inicial
      const tl = gsap.timeline();
      tl.fromTo(titleRef.current, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" })
        .fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.7")
        .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2");

      // Fade out al scrollear
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "200px top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden" style={{ zIndex: 1 }}>
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      {/* Overlay oscuro para legibilidad del texto */}
      <div className="absolute inset-0 bg-black/60" style={{ zIndex: 1 }} />
      <div ref={contentRef} className="flex flex-col items-center px-6 relative" style={{ zIndex: 2 }}>
        <div className="mb-5 inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs px-4 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Plataforma de publicidad física en Uruguay
        </div>

        <h1
          ref={titleRef}
          className="text-5xl md:text-8xl font-bold tracking-tight leading-none opacity-0"
        >
          Espacios reales.<br />
          <span className="text-blue-500">Impacto real.</span>
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 text-lg md:text-xl text-gray-400 max-w-md opacity-0"
        >
          Publicidad donde realmente pasa la gente
        </p>

        <div ref={ctaRef} className="mt-10 flex gap-4 opacity-0">
          <Link
            href="/spaces"
            className="bg-blue-600 hover:bg-blue-500 transition px-7 py-3.5 rounded-xl font-semibold text-sm"
          >
            Explorar espacios
          </Link>
          <Link
            href="/publish"
            className="border border-zinc-700 hover:border-white transition px-7 py-3.5 rounded-xl font-semibold text-sm"
          >
            Ofrecer espacio
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-gray-600 text-xs opacity-0"
        style={{ zIndex: 2 }}
      >
        <span>Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
