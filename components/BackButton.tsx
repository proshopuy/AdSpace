"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/spaces")}
      className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition text-sm mb-8"
    >
      <ArrowLeft size={15} />
      Explorar espacios
    </button>
  );
}
