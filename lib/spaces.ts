export type SpaceType = "gym" | "car" | "vending" | "restaurant" | "billboard" | "office" | "totem";

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
  totem: "Tótem digital",
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
    price: 250,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
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
    price: 200,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
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
    price: 150,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80",
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
    price: 225,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
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
    price: 600,
    image: "https://images.unsplash.com/photo-1617802690658-1173a812650d?w=800&q=80",
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
    price: 300,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
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
    price: 350,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
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
    price: 450,
    image: "https://images.unsplash.com/photo-1511527844068-006b95d162c2?w=800&q=80",
    description: "Red de 10 vehículos de remise con pantallas en respaldo de asiento. El pasajero está cautivo durante todo el viaje. Datos de impresiones en tiempo real.",
    format: "Pantalla tablet 10\" x10 vehículos",
    available: true,
    owner: "Hernán T.",
  },
  {
    id: 9,
    title: "Tótem digital Shopping",
    location: "Montevideo Shopping",
    city: "Montevideo",
    type: "totem",
    traffic: 8000,
    price: 800,
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    description: "Tótem digital de alta resolución en el pasillo central del shopping. Pantalla 4K de doble cara, 2 metros de altura. El anuncio se reproduce cada 10 segundos en rotación. Máxima exposición en el punto de mayor tráfico del centro comercial.",
    format: "Tótem LED 4K doble cara",
    available: true,
    owner: "AdSpace Media",
  },
  {
    id: 10,
    title: "Tótem exterior Punta del Este",
    location: "Av. Gorlero y 29",
    city: "Punta del Este",
    type: "totem",
    traffic: 5000,
    price: 1200,
    image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=800&q=80",
    description: "Tótem digital exterior en la esquina más transitada de Punta del Este. Resistente a la intemperie, iluminación adaptativa según horario. Ideal para marcas de lujo, inmobiliarias, gastronomía y turismo. Temporada alta: diciembre a marzo.",
    format: "Tótem outdoor 75\" impermeable",
    available: true,
    owner: "AdSpace Media",
  },
];
