import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AdSpace — Publicidad física real",
  description: "Marketplace para publicidad en espacios físicos: gimnasios, autos, máquinas y más.",
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
