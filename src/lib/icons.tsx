import {
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  CookingPot,
  Home,
  LampFloor,
  Leaf,
  NotebookText,
  Plus,
  Settings,
  Sparkles,
  SprayCan,
  Trash2,
  WashingMachine,
} from "lucide-react";

export const choreIcons = {
  home: Home,
  bath: Bath,
  kitchen: CookingPot,
  bed: BedDouble,
  living: LampFloor,
  plant: Leaf,
  window: Sparkles,
  vacuum: SprayCan,
  laundry: WashingMachine,
  trash: Trash2,
};

export const navIcons = {
  home: Home,
  chores: NotebookText,
  add: Plus,
  calendar: CalendarDays,
  settings: Settings,
  check: Check,
};

export type ChoreIconName = keyof typeof choreIcons;
