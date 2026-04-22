"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "500+", label: "espacios activos" },
  { value: "1M+", label: "personas alcanzadas/mes" },
  { value: "3x", label: "más impacto que digital" },
];

export default function Transition() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60, filter: "blur(12px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );

      // Stats entran en stagger
      gsap.fromTo(
        statsRef.current?.children ?? [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center text-center text-white px-6 py-24"
      style={{ zIndex: 1, background: "#000" }}
    >
      <div className="max-w-4xl w-full">
        <h2
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold leading-tight"
        >
          No es publicidad digital
        </h2>

        <p ref={subtitleRef} className="mt-6 text-xl text-gray-400 max-w-xl mx-auto">
          Es presencia real, frente a personas reales.<br />
          Ahora podés elegir exactamente dónde estar.
        </p>

        <div
          ref={statsRef}
          className="mt-20 grid grid-cols-3 gap-8 border-t border-zinc-800 pt-16"
        >
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl md:text-5xl font-bold text-blue-400">{value}</p>
              <p className="mt-2 text-gray-500 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
