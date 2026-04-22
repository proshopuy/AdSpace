import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccess() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 text-center">
      <div>
        <CheckCircle size={64} className="text-blue-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-3">¡Pago exitoso!</h1>
        <p className="text-gray-400 mb-2 max-w-sm mx-auto">
          Tu espacio publicitario fue contratado. Ya podés ver el detalle en tu dashboard.
        </p>
        <p className="text-gray-600 text-sm mb-10">
          Recibirás un email de confirmación en breve.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-500 transition text-white px-6 py-3 rounded-xl font-semibold text-sm"
          >
            Ver mi dashboard
          </Link>
          <Link
            href="/spaces"
            className="border border-zinc-700 hover:border-white text-white px-6 py-3 rounded-xl text-sm transition"
          >
            Explorar más espacios
          </Link>
        </div>
      </div>
    </main>
  );
}
