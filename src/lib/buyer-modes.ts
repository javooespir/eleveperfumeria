import {
  Truck,
  MessageCircle,
  CreditCard,
  Package,
  Users,
  Tag,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { WHOLESALE_MIN_UNITS } from "@/lib/types";

// Datos de las dos formas de compra. Viven aparte del componente porque los
// usa la tarjeta del hero; antes estaban dentro de la seccion que se quito.

type Feature = { label: string; icon: LucideIcon };

export type Mode = "retail" | "wholesale";

export type ModeData = {
  id: Mode;
  label: string;
  title: string;
  description: string;
  image: string;
  colors: { gradient: string; glow: string; ring: string };
  badge: string;
  stat: { label: string; icon: LucideIcon };
  features: Feature[];
};

export const MODE_DATA: Record<Mode, ModeData> = {
  retail: {
    id: "retail",
    label: "Minorista",
    title: "Comprá a tu ritmo",
    description:
      "Elegí cualquier fragancia del catálogo, sin cantidad mínima. Ideal para uso personal o para regalar.",
    image: "/images/perfume-minorista.png",
    colors: {
      gradient: "from-zinc-500 to-zinc-950",
      glow: "bg-white",
      ring: "border-white/30",
    },
    badge: "Sin mínimo de compra",
    stat: { label: "Envío a domicilio", icon: Truck },
    features: [
      { label: "Todas las categorías", icon: Package },
      { label: "3 y 6 cuotas sin interés", icon: CreditCard },
      { label: "Coordinación por WhatsApp", icon: MessageCircle },
    ],
  },
  wholesale: {
    id: "wholesale",
    label: "Mayorista",
    title: "Comprá para revender",
    description: `Con ${WHOLESALE_MIN_UNITS} unidades o más accedés a precios preferenciales en todo el catálogo — ideal para comercios y revendedores.`,
    image: "/images/perfume-mayorista.png",
    colors: {
      gradient: "from-champagne to-[#1a1611]",
      glow: "bg-champagne",
      ring: "border-champagne/40",
    },
    badge: "Precio preferencial",
    stat: { label: `Mínimo ${WHOLESALE_MIN_UNITS} unidades`, icon: Users },
    features: [
      { label: "Precios especiales por volumen", icon: Tag },
      { label: "Sin mínimo por artículo", icon: CheckCircle2 },
      { label: "Coordinación por WhatsApp", icon: MessageCircle },
    ],
  },
};

