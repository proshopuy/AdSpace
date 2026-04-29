import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ingresar o registrarse",
  description:
    "Accedé a AdSpots para publicar tu espacio o gestionar tus campañas publicitarias en Uruguay.",
  alternates: { canonical: "https://adspots.com.uy/auth" },
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
