export interface ScentNote {
  id: string;
  name: string;
  description: string;
  icon: "bergamot" | "iris" | "cedar" | "amber";
}

export interface Fragrance {
  id: string;
  code: string;
  name: string;
  description: string;
  price: string;
  tone: "smoke" | "iris" | "cedar";
}

export interface NavLink {
  label: string;
  href: string;
}
