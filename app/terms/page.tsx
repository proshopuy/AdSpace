import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Leé los términos y condiciones de uso de AdSpots, la plataforma de publicidad física en Uruguay.",
  alternates: { canonical: "https://adspots.com.uy/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-500 hover:text-white transition text-sm mb-8 inline-block">
          ← Volver al inicio
        </Link>

        <h1 className="text-4xl font-bold mb-2">Términos y condiciones</h1>
        <p className="text-gray-500 text-sm mb-10">Última actualización: abril 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar AdSpots (<strong className="text-white">adspots.com.uy</strong>), aceptás los presentes
              Términos y Condiciones de uso. Si no estás de acuerdo con alguno de estos términos, no debés usar la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">2. Descripción del servicio</h2>
            <p>
              AdSpots es un marketplace que conecta propietarios de espacios físicos (gimnasios, autos, restaurantes,
              tótems digitales, entre otros) con anunciantes que buscan publicitar sus marcas en dichos espacios. AdSpots
              actúa como intermediario y no es responsable del contenido publicitario ni de los espacios en sí mismos.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">3. Registro y cuentas</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Para usar la plataforma debés registrarte con información veraz y actualizada.</li>
              <li>Sos responsable de mantener la confidencialidad de tu contraseña.</li>
              <li>Solo se permite una cuenta por persona o empresa.</li>
              <li>AdSpots se reserva el derecho de suspender o eliminar cuentas que incumplan estos términos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">4. Propietarios de espacios</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Al publicar un espacio, garantizás que tenés el derecho legal de ofrecerlo.</li>
              <li>La información proporcionada (ubicación, tráfico, fotos) debe ser veraz y representativa.</li>
              <li>AdSpots puede revisar y aprobar o rechazar cualquier publicación sin dar explicaciones.</li>
              <li>El precio publicado es en pesos uruguayos (UYU) por período mensual.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">5. Anunciantes</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>El pago de las campañas se procesa a través de MercadoPago con sus propios términos y condiciones.</li>
              <li>Una vez confirmado el pago, el contrato queda activo y el espacio se reserva para la campaña.</li>
              <li>Las cancelaciones están sujetas al acuerdo entre ambas partes dentro de la plataforma.</li>
              <li>AdSpots no garantiza resultados publicitarios específicos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">6. Pagos y comisiones</h2>
            <p>
              AdSpots puede aplicar una comisión sobre las transacciones realizadas a través de la plataforma. Las
              condiciones exactas serán informadas en el momento de la transacción. Los precios pueden cambiar sin previo
              aviso.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">7. Cancelaciones</h2>
            <p>
              Las cancelaciones de contratos deben ser solicitadas dentro de la plataforma. El proceso requiere el acuerdo
              de ambas partes (propietario y anunciante). AdSpots no se hace responsable por disputas entre las partes.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">8. Limitación de responsabilidad</h2>
            <p>
              AdSpots no se hace responsable por daños directos, indirectos o consecuentes derivados del uso de la
              plataforma, la calidad de los espacios publicitarios, o la efectividad de las campañas.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">9. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados
              a través de la plataforma y entrarán en vigor a partir de su publicación.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">10. Contacto</h2>
            <p>
              Para consultas sobre estos términos, escribinos a{" "}
              <a href="mailto:hola@adspots.com.uy" className="text-blue-400 hover:text-blue-300 transition">
                hola@adspots.com.uy
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
