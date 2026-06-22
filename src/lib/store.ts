export type ChoreType = "ordinaria" | "straordinaria";

export type Chore = {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: ChoreType;
  room: string;
  frequency: number;
  estimatedMinutes: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type ChoreLog = {
  id: string;
  choreId: string;
  completedAt: string;
  durationMinutes: number;
  note: string;
  rooms: string[];
};

export type AppData = {
  rooms: string[];
  chores: Chore[];
  logs: ChoreLog[];
};

const STORE_KEY = "curacasa_v2_data";

const now = () => new Date().toISOString();

export function dayKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

export function monthKey(value: Date = new Date()) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
}

export function daysAgo(value?: string | null) {
  if (!value) return null;
  const start = new Date(dayKey(value)).getTime();
  const today = new Date(dayKey(new Date())).getTime();
  return Math.round((today - start) / 86400000);
}

export function relativeDays(days: number | null) {
  if (days === null) return "mai fatta";
  if (days === 0) return "oggi";
  if (days === 1) return "ieri";
  if (days < 0) return `tra ${Math.abs(days)} giorni`;
  return `${days} giorni fa`;
}

function id(prefix: string) {
  return `${prefix}_${crypto.getRandomValues(new Uint32Array(3)).join("")}`;
}

export const DEFAULT_ROOMS = ["Bagno", "Cucina", "Camera", "Soggiorno", "Balcone"];

const DEFAULT_CHORES: Omit<Chore, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Aspirapolvere",
    description: "Passare l'aspirapolvere nelle zone vissute.",
    icon: "vacuum",
    type: "ordinaria",
    room: "",
    frequency: 2,
    estimatedMinutes: 20,
    notes: "",
  },
  {
    title: "Bagni",
    description: "Pulizia sanitari, specchi e superfici del bagno.",
    icon: "bath",
    type: "ordinaria",
    room: "Bagno",
    frequency: 3,
    estimatedMinutes: 20,
    notes: "",
  },
  {
    title: "Cucina",
    description: "Pulizia piano cottura, lavello e superfici della cucina.",
    icon: "kitchen",
    type: "ordinaria",
    room: "Cucina",
    frequency: 2,
    estimatedMinutes: 20,
    notes: "",
  },
  {
    title: "Cambio letto",
    description: "Cambiare lenzuola e sistemare il letto.",
    icon: "bed",
    type: "ordinaria",
    room: "Camera",
    frequency: 7,
    estimatedMinutes: 15,
    notes: "",
  },
  {
    title: "Balcone",
    description: "Spazzare e sistemare il balcone.",
    icon: "plant",
    type: "straordinaria",
    room: "Balcone",
    frequency: 7,
    estimatedMinutes: 20,
    notes: "",
  },
  {
    title: "Vetri",
    description: "Pulire vetri, specchi o finestre.",
    icon: "window",
    type: "straordinaria",
    room: "",
    frequency: 15,
    estimatedMinutes: 30,
    notes: "",
  },
];

export function createDefaultData(): AppData {
  const stamp = now();
  return {
    rooms: DEFAULT_ROOMS,
    chores: DEFAULT_CHORES.map((chore) => ({
      ...chore,
      id: id("chore"),
      createdAt: stamp,
      updatedAt: stamp,
    })),
    logs: [],
  };
}

export function loadData(): AppData {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    const data = createDefaultData();
    saveData(data);
    return data;
  }
  try {
    const parsed = JSON.parse(raw) as AppData;
    return {
      rooms: Array.isArray(parsed.rooms) ? parsed.rooms : DEFAULT_ROOMS,
      chores: Array.isArray(parsed.chores) ? parsed.chores : [],
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
    };
  } catch {
    const data = createDefaultData();
    saveData(data);
    return data;
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export function lastLog(chore: Chore, logs: ChoreLog[]) {
  return logs
    .filter((log) => log.choreId === chore.id)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
}

export function statusFor(chore: Chore, logs: ChoreLog[]) {
  const last = lastLog(chore, logs);
  const days = daysAgo(last?.completedAt);
  if (!chore.frequency || days === null) return "normal";
  const ratio = days / chore.frequency;
  if (ratio > 1.2) return "overdue";
  if (ratio > 1) return "warning";
  if (ratio > 0.7) return "soon";
  return "normal";
}

export function addLog(data: AppData, choreId: string, payload?: Partial<ChoreLog>): AppData {
  const log: ChoreLog = {
    id: id("log"),
    choreId,
    completedAt: payload?.completedAt || now(),
    durationMinutes: Number(payload?.durationMinutes || 0),
    note: payload?.note || "",
    rooms: payload?.rooms || [],
  };
  return { ...data, logs: [log, ...data.logs] };
}

export function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
