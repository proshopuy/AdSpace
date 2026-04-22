"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Space } from "@/lib/spaces";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  spaces: Space[];
}

export default function SpacesGrid({ spaces }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            end: "top 55%",
            scrub: 1,
          },
        }
      );

      if (gridRef.current?.children) {
        gsap.fromTo(
          Array.from(gridRef.current.children),
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black text-white py-28 px-6" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto">

        <div ref={titleRef} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-blue-500 text-sm font-medium tracking-widest uppercase mb-3">Espacios destacados</p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Elegí dónde estar
            </h2>
            <p className="mt-3 text-gray-400">
              Los espacios más buscados de la plataforma
            </p>
          </div>
          <Link
            href="/spaces"
            className="text-sm border border-zinc-700 hover:border-blue-500 hover:text-blue-400 text-gray-400 px-5 py-2.5 rounded-xl transition shrink-0"
          >
            Ver todos →
          </Link>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden group cursor-pointer hover:ring-1 hover:ring-blue-500/40 transition"
            >
              <div className="overflow-hidden relative">
                <img
                  src={space.image}
                  alt={space.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
              </div>

              <div className="p-5">
                <h3 className="text-white text-xl font-semibold">{space.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{space.location}</p>
                <p className="text-gray-600 text-sm mt-2">{space.traffic.toLocaleString()} personas/día</p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-blue-400 font-bold text-lg">
                    USD {space.price.toLocaleString()}
                    <span className="text-gray-600 font-normal text-sm">/mes</span>
                  </span>
                  <Link
                    href="/spaces"
                    className="text-sm border border-zinc-700 hover:border-blue-500 hover:text-blue-400 text-gray-500 px-3 py-1.5 rounded-lg transition"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
