"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SceneGym() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax en el video
      gsap.to(videoRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Texto entra desde abajo
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      // Overlay se aclara al entrar
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0.85 },
        {
          opacity: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center text-white overflow-hidden"
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
        <source src="/videos/gym.mp4" type="video/mp4" />
      </video>

      <div ref={overlayRef} className="absolute inset-0 bg-black" />

      <div ref={textRef} className="relative z-10 text-center px-4">
        <p className="text-blue-400 text-sm tracking-widest uppercase mb-4">Gimnasios</p>
        <h2 className="text-5xl md:text-7xl font-bold">
          500+ personas<br />por día
        </h2>
        <p className="mt-5 text-lg text-gray-300 max-w-md mx-auto">
          Frente a tu marca, todos los días
        </p>
      </div>
    </section>
  );
}
