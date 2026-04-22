"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 35%",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 0.25,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white py-40 px-6 text-center overflow-hidden"
      style={{ zIndex: 1 }}
    >
      <div ref={glowRef} className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-0">
        <div className="w-[600px] h-[600px] bg-blue-600 blur-[180px] rounded-full" />
      </div>

      <div ref={contentRef} className="relative z-10 max-w-3xl mx-auto opacity-0">
        <p className="text-blue-400 text-sm tracking-widest uppercase mb-5">Empezá ahora</p>
        <h2 className="text-5xl md:text-7xl font-bold leading-tight">
          Tu marca merece<br />más que invisible
        </h2>

        <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto">
          Empezá hoy a estar presente donde realmente importa
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/spaces"
            className="bg-blue-600 hover:bg-blue-500 transition px-8 py-4 rounded-xl text-lg font-semibold"
          >
            Explorar espacios
          </Link>
          <Link
            href="/publish"
            className="border border-zinc-700 hover:border-white transition px-8 py-4 rounded-xl text-lg font-semibold"
          >
            Publicar mi espacio
          </Link>
        </div>
      </div>
    </section>
  );
}
