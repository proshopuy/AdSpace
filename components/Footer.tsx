import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 text-gray-500 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="text-white font-bold text-xl tracking-tight">
              Ad<span className="text-blue-500">Spots</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed max-w-xs">
              La plataforma que conecta marcas con espacios físicos de alto impacto en Uruguay.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-white text-sm font-medium mb-4">Plataforma</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/spaces" className="hover:text-white transition">Explorar espacios</Link></li>
              <li><Link href="/publish" className="hover:text-white transition">Publicar espacio</Link></li>
              <li><Link href="/#como-funciona" className="hover:text-white transition">Cómo funciona</Link></li>
              <li><Link href="/auth" className="hover:text-white transition">Ingresar</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-4">Contacto</p>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:hola@adspots.com.uy" className="hover:text-white transition">hola@adspots.com.uy</a></li>
              <li><span>Montevideo, Uruguay</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <p>© {new Date().getFullYear()} AdSpots. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition">Términos</Link>
            <Link href="#" className="hover:text-white transition">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
