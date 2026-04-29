import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BASE_URL = "https://adspots.com.uy";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AdSpots — Publicidad física real en Uruguay",
    template: "%s | AdSpots",
  },
  description:
    "Marketplace de publicidad en espacios físicos de alto impacto en Uruguay. Anunciá en gimnasios, autos ploteados, tótems digitales, restaurantes y más.",
  keywords: [
    "publicidad fisica uruguay",
    "publicidad montevideo",
    "alquiler espacios publicitarios",
    "marketing exterior uruguay",
    "publicidad gimnasios",
    "totems digitales",
    "publicidad punta del este",
    "OOH uruguay",
    "out of home advertising",
  ],
  authors: [{ name: "AdSpots", url: BASE_URL }],
  creator: "AdSpots",
  publisher: "AdSpots",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: BASE_URL,
    siteName: "AdSpots",
    title: "AdSpots — Publicidad física real en Uruguay",
    description:
      "Conectamos marcas con espacios físicos de alto impacto en Uruguay. Explorá gimnasios, autos, tótems y más.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AdSpots — Marketplace de publicidad física en Uruguay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AdSpots — Publicidad física real en Uruguay",
    description:
      "Marketplace de publicidad en espacios físicos de alto impacto en Uruguay.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
