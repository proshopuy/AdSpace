import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Conocé cómo AdSpots recopila, usa y protege tu información personal.",
  alternates: { canonical: "https://adspots.com.uy/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-500 hover:text-white transition text-sm mb-8 inline-block">
          ← Volver al inicio
        </Link>

        <h1 className="text-4xl font-bold mb-2">Política de privacidad</h1>
        <p className="text-gray-500 text-sm mb-10">Última actualización: abril 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">1. Información que recopilamos</h2>
            <p className="mb-3">Al usar AdSpots, podemos recopilar:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Datos de cuenta:</strong> nombre, email y rol (anunciante u propietario).</li>
              <li><strong className="text-white">Datos de espacios:</strong> ubicación, fotos, descripción y precios de los espacios publicados.</li>
              <li><strong className="text-white">Datos de contratos:</strong> fechas, duración y estado de las campañas.</li>
              <li><strong className="text-white">Datos de pago:</strong> procesados por MercadoPago. AdSpots no almacena datos de tarjetas.</li>
              <li><strong className="text-white">Datos técnicos:</strong> dirección IP, tipo de navegador, páginas visitadas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">2. Cómo usamos tu información</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Para brindarte acceso y gestionar tu cuenta.</li>
              <li>Para procesar pagos y gestionar contratos de campañas.</li>
              <li>Para enviarte notificaciones por email relacionadas a tu actividad (nuevos contratos, cancelaciones, aprobaciones).</li>
              <li>Para mejorar la plataforma y detectar usos fraudulentos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">3. Compartir información con terceros</h2>
            <p className="mb-3">AdSpots puede compartir tu información con:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">MercadoPago:</strong> para procesar pagos de forma segura.</li>
              <li><strong className="text-white">Resend:</strong> para el envío de emails transaccionales.</li>
              <li><strong className="text-white">Supabase:</strong> proveedor de base de datos y autenticación.</li>
            </ul>
            <p className="mt-3">No vendemos ni compartimos tu información personal con fines comerciales.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">4. Almacenamiento y seguridad</h2>
            <p>
              Tu información se almacena en servidores seguros a través de Supabase. Implementamos medidas técnicas y
              organizativas para proteger tus datos contra accesos no autorizados, pérdida o alteración.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">5. Cookies</h2>
            <p>
              Usamos cookies de sesión para mantener tu estado de autenticación. No usamos cookies de rastreo publicitario
              de terceros. Podés configurar tu navegador para rechazar cookies, aunque esto puede afectar el funcionamiento
              de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">6. Tus derechos</h2>
            <p className="mb-3">Tenés derecho a:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Acceder a los datos personales que tenemos sobre vos.</li>
              <li>Solicitar la corrección de datos inexactos.</li>
              <li>Solicitar la eliminación de tu cuenta y datos asociados.</li>
              <li>Oponerte al tratamiento de tus datos en determinadas circunstancias.</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, escribinos a{" "}
              <a href="mailto:hola@adspots.com.uy" className="text-blue-400 hover:text-blue-300 transition">
                hola@adspots.com.uy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">7. Retención de datos</h2>
            <p>
              Conservamos tu información mientras tu cuenta esté activa o sea necesaria para prestar el servicio.
              Al eliminar tu cuenta, tus datos personales serán eliminados en un plazo máximo de 30 días, excepto
              los datos que debamos conservar por obligaciones legales.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">8. Menores de edad</h2>
            <p>
              AdSpots no está dirigido a menores de 18 años. No recopilamos intencionalmente información de menores.
              Si detectamos que un menor se ha registrado, eliminaremos su cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">9. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política en cualquier momento. Te notificaremos por email o dentro de la plataforma
              ante cambios importantes.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">10. Contacto</h2>
            <p>
              Para consultas sobre privacidad o protección de datos, contactanos en{" "}
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
