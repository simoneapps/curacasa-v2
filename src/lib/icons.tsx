import { CalendarDays, Check, Home, NotebookText, Plus, Settings } from "lucide-react";

export const choreIconImages = {
  casa: "/chore-icons/casa.jpg",
  cucina: "/chore-icons/cucina.jpg",
  bagno: "/chore-icons/vasca.jpg",
  letto: "/chore-icons/letto.jpg",
  soggiorno: "/chore-icons/soggiorno.jpg",
  balcone: "/chore-icons/balcone.jpg",
  vetri: "/chore-icons/vetri.jpg",
  tapparelle: "/chore-icons/tapparelle.jpg",
  tende: "/chore-icons/tende.jpg",
  lavandino: "/chore-icons/lavandino.jpg",
  piante: "/chore-icons/piante.jpg",
  pattumiera: "/chore-icons/pattumiera.jpg",
  forno: "/chore-icons/forno.jpg",
  frigorifero: "/chore-icons/frigorifero.jpg",
  doccia: "/chore-icons/doccia.jpg",
  wc: "/chore-icons/wc.jpg",
  "biancheria-letto": "/chore-icons/biancheria-letto.jpg",
  lavatrice: "/chore-icons/lavatrice.jpg",
  specchio: "/chore-icons/specchio.jpg",
  "finestra-tende": "/chore-icons/finestra-tende.jpg",
  scopa: "/chore-icons/scopa.jpg",
  aspirapolvere: "/chore-icons/aspirapolvere.jpg",
  asciugamani: "/chore-icons/asciugamani.jpg",
  "mocio-secchio": "/chore-icons/mocio-secchio.jpg",
  termosifone: "/chore-icons/termosifone.jpg",
  pavimento: "/chore-icons/pavimento.jpg",
  armadio: "/chore-icons/armadio.jpg",
  tavolo: "/chore-icons/tavolo.jpg",
  spolverino: "/chore-icons/spolverino.jpg",
  paletta: "/chore-icons/paletta.jpg",
} as const;

export type ChoreIconName = keyof typeof choreIconImages;

export const choreIconOptions: Array<{ value: ChoreIconName; label: string }> = [
  { value: "casa", label: "Casa" },
  { value: "cucina", label: "Cucina" },
  { value: "bagno", label: "Bagno" },
  { value: "letto", label: "Letto" },
  { value: "soggiorno", label: "Soggiorno" },
  { value: "balcone", label: "Balcone" },
  { value: "vetri", label: "Vetri" },
  { value: "tapparelle", label: "Tapparelle" },
  { value: "tende", label: "Tende" },
  { value: "lavandino", label: "Lavandino" },
  { value: "piante", label: "Piante" },
  { value: "pattumiera", label: "Pattumiera" },
  { value: "forno", label: "Forno" },
  { value: "frigorifero", label: "Frigorifero" },
  { value: "doccia", label: "Doccia" },
  { value: "wc", label: "WC" },
  { value: "biancheria-letto", label: "Biancheria letto" },
  { value: "lavatrice", label: "Lavatrice" },
  { value: "specchio", label: "Specchio" },
  { value: "finestra-tende", label: "Finestra" },
  { value: "scopa", label: "Scopa" },
  { value: "aspirapolvere", label: "Aspirapolvere" },
  { value: "asciugamani", label: "Asciugamani" },
  { value: "mocio-secchio", label: "Mocio e secchio" },
  { value: "termosifone", label: "Termosifone" },
  { value: "pavimento", label: "Pavimento" },
  { value: "armadio", label: "Armadio" },
  { value: "tavolo", label: "Tavolo" },
  { value: "spolverino", label: "Spolverino" },
  { value: "paletta", label: "Paletta" },
];

export function ChoreIcon({ name, size = 38 }: { name?: string; size?: number }) {
  const src = choreIconImages[name as ChoreIconName];

  if (!src) {
    return <Home aria-hidden="true" size={Math.max(18, Math.round(size * 0.56))} />;
  }

  return (
    <img
      aria-hidden="true"
      className="chore-icon-img"
      loading="lazy"
      src={src}
      style={{ height: size, width: size }}
    />
  );
}

export const navIcons = {
  home: Home,
  chores: NotebookText,
  add: Plus,
  calendar: CalendarDays,
  settings: Settings,
  check: Check,
};
