"use client";

import { Search, Handshake, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Encontrá tu espacio",
    description: "Explorá cientos de ubicaciones reales: gimnasios, autos, máquinas, locales y más. Filtrá por ciudad, tráfico y presupuesto.",
    step: "01",
  },
  {
    icon: Handshake,
    title: "Conectamos los dos lados",
    description: "Te conectamos directamente con el dueño del espacio. Sin intermediarios innecesarios. Acordás los detalles y listo.",
    step: "02",
  },
  {
    icon: TrendingUp,
    title: "Tu marca en el mundo real",
    description: "Tu publicidad llega a personas reales, en lugares reales. Medimos el impacto con datos de tráfico verificados.",
    step: "03",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-black text-white py-28 px-6 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <p className="text-blue-500 text-sm font-medium tracking-widest uppercase mb-3">Cómo funciona</p>
          <h2 className="text-4xl md:text-5xl font-bold">Simple y directo</h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            En tres pasos conectamos tu marca con el lugar perfecto
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Línea conectora */}
          <div className="hidden md:block absolute top-8 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          {steps.map(({ icon: Icon, title, description, step }) => (
            <div key={step} className="relative flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                  <Icon size={26} className="text-blue-400" />
                </div>
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {step[1]}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
