export type SpaceType = "gym" | "car" | "vending" | "restaurant" | "billboard" | "office" | "totem";

export interface Space {
  id: number;
  title: string;
  location: string;
  city: string;
  type: string;
  traffic: number;
  price: number;
  image?: string;
  images?: string[];
  description: string;
  format: string;
  available: boolean;
  owner: string;
}

export const TYPE_LABELS: Record<SpaceType, string> = {
  gym: "Gimnasio",
  car: "Auto ploteado",
  vending: "Máquina expendedora",
  restaurant: "Restaurante",
  billboard: "Cartelería",
  office: "Oficina",
  totem: "Tótem digital",
};

export const CITIES = ["Todas", "Montevideo", "Punta del Este", "Canelones", "Maldonado"];
