export interface ScentNote {
  id: string;
  name: string;
  description: string;
  icon: "bergamot" | "iris" | "cedar" | "amber";
}

export type BottleTone = "smoke" | "iris" | "cedar";

export interface Fragrance {
  id: string;
  code: string;
  name: string;
  description: string;
  price: string;
  tone: BottleTone;
}

export interface NavLink {
  label: string;
  href: string;
}
