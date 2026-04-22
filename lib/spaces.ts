export type SpaceType = "gym" | "car" | "vending" | "restaurant" | "billboard" | "office";

export interface Space {
  id: number;
  title: string;
  location: string;
  city: string;
  type: SpaceType;
  traffic: number;
  price: number;
  image: string;
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
};

export const CITIES = ["Todas", "Montevideo", "Punta del Este", "Canelones", "Maldonado"];

export const SPACES: Space[] = [
  {
    id: 1,
    title: "Gimnasio alto tráfico",
    location: "Av. 18 de Julio 1200",
    city: "Montevideo",
    type: "gym",
    traffic: 500,
    price: 10000,
    image: "/images/gym.jpg",
    description: "Pantalla LED en la entrada principal del gimnasio. Máxima visibilidad para personas que ingresan y salen. Ideal para marcas de salud, nutrición, ropa deportiva.",
    format: "Pantalla LED 55\"",
    available: true,
    owner: "Carlos M.",
  },
  {
    id: 2,
    title: "Auto ploteado premium",
    location: "Punta Carretas",
    city: "Montevideo",
    type: "car",
    traffic: 300,
    price: 8000,
    image: "/images/car.jpg",
    description: "Vehículo con ploteo completo que circula por las zonas más activas de Montevideo. Impacto diario en zonas residenciales y comerciales.",
    format: "Ploteo vehicular completo",
    available: true,
    owner: "Diego R.",
  },
  {
    id: 3,
    title: "Máquina en local comercial",
    location: "18 de Julio y Yi",
    city: "Montevideo",
    type: "vending",
    traffic: 200,
    price: 6000,
    image: "/images/machine.jpg",
    description: "Pantalla en máquina expendedora ubicada en local de alto tráfico. El cliente está en un momento de compra activo, máxima receptividad.",
    format: "Pantalla digital 21\"",
    available: true,
    owner: "Laura P.",
  },
  {
    id: 4,
    title: "Restaurante zona gastronómica",
    location: "Pocitos",
    city: "Montevideo",
    type: "restaurant",
    traffic: 400,
    price: 9000,
    image: "/images/gym.jpg",
    description: "Pantalla en restaurante de alta rotación en zona gastronómica de Pocitos. Público con alto poder adquisitivo, perfecto para marcas premium.",
    format: "Pantalla 43\" en barra",
    available: true,
    owner: "Martín S.",
  },
  {
    id: 5,
    title: "Cartelería ruta Interbalnearia",
    location: "Km 42 Ruta 10",
    city: "Canelones",
    type: "billboard",
    traffic: 1500,
    price: 25000,
    image: "/images/car.jpg",
    description: "Cartelería de gran formato sobre ruta Interbalnearia. Impacto masivo en temporada alta. Más de 1500 vehículos diarios en temporada.",
    format: "Cartel 6x3 mts",
    available: true,
    owner: "Roberto A.",
  },
  {
    id: 6,
    title: "Oficinas coworking Torre",
    location: "WTC Montevideo",
    city: "Montevideo",
    type: "office",
    traffic: 350,
    price: 12000,
    image: "/images/machine.jpg",
    description: "Pantallas en el hall de ingreso de edificio corporativo. Audiencia de profesionales y ejecutivos. Ideal para servicios B2B, tecnología y finanzas.",
    format: "Video Wall 2x2",
    available: false,
    owner: "Valeria G.",
  },
  {
    id: 7,
    title: "Gym boutique Punta del Este",
    location: "Av. Roosevelt 200",
    city: "Punta del Este",
    type: "gym",
    traffic: 250,
    price: 15000,
    image: "/images/gym.jpg",
    description: "Espacio exclusivo en gym boutique de Punta del Este. Clientela de alto nivel socioeconómico, temporada alta de diciembre a marzo.",
    format: "Pantalla LED 65\"",
    available: true,
    owner: "Sofía M.",
  },
  {
    id: 8,
    title: "Flota de taxis app",
    location: "Toda la ciudad",
    city: "Montevideo",
    type: "car",
    traffic: 600,
    price: 18000,
    image: "/images/car.jpg",
    description: "Red de 10 vehículos de remise con pantallas en respaldo de asiento. El pasajero está cautivo durante todo el viaje. Datos de impresiones en tiempo real.",
    format: "Pantalla tablet 10\" x10 vehículos",
    available: true,
    owner: "Hernán T.",
  },
];
