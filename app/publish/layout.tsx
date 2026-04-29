import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publicar mi espacio",
  description:
    "Publicá tu espacio publicitario en AdSpots y empezá a recibir anunciantes. Gimnasios, autos, restaurantes, tótems y más.",
  alternates: { canonical: "https://adspots.com.uy/publish" },
  robots: { index: false, follow: false },
};

export default function PublishLayout({ children }: { children: React.ReactNode }) {
  return children;
}
