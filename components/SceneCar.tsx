"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SceneCar() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(videoRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            end: "top 25%",
            scrub: 1.2,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-start text-white overflow-hidden"
      style={{ zIndex: 1 }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-[120%] object-cover"
        style={{ top: "-10%" }}
      >
        <source src="/videos/car.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      <div ref={textRef} className="relative z-10 px-10 md:px-20 max-w-lg">
        <p className="text-blue-400 text-sm tracking-widest uppercase mb-4">Movilidad</p>
        <h2 className="text-5xl md:text-7xl font-bold leading-none">
          Tu marca<br />en movimiento
        </h2>
        <p className="mt-5 text-lg text-gray-300">
          Impacto constante, todos los días
        </p>
      </div>
    </section>
  );
}
