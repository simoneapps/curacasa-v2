import { useEffect, useState } from "react";
import { PackagePlus } from "lucide-react";
import { ChoreIcon } from "../lib/icons";
import { loadData, saveData, type Chore, type ChoreType } from "../lib/store";

type PackChore = {
  title: string;
  description: string;
  icon: string;
  type: ChoreType;
  room: string;
  frequency: number;
  estimatedMinutes: number;
  notes?: string;
};

type ChorePack = {
  id: string;
  title: string;
  description: string;
  chores: PackChore[];
};

type PackFile = {
  packs: ChorePack[];
};

function makeId(prefix: string) {
  return `${prefix}_${crypto.getRandomValues(new Uint32Array(3)).join("")}`;
}

export function Shop() {
  const [packs, setPacks] = useState<ChorePack[]>([]);
  const [status, setStatus] = useState("Caricamento set...");

  useEffect(() => {
    fetch("/chore-packs.json")
      .then((response) => {
        if (!response.ok) throw new Error("packs");
        return response.json() as Promise<PackFile>;
      })
      .then((file) => {
        setPacks(Array.isArray(file.packs) ? file.packs : []);
        setStatus("");
      })
      .catch(() => setStatus("Set non disponibili."));
  }, []);

  function addPack(pack: ChorePack) {
    const data = loadData();
    const stamp = new Date().toISOString();
    const chores: Chore[] = pack.chores.map((chore) => ({
      ...chore,
      id: makeId("chore"),
      notes: chore.notes || "",
      createdAt: stamp,
      updatedAt: stamp,
    }));
    saveData({ ...data, chores: [...data.chores, ...chores] });
    setStatus(`${pack.title} aggiunto.`);
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <p className="eyebrow">Shop faccende</p>
        <div>
          <h1>Set pronti da aggiungere</h1>
        </div>
      </section>

      {packs.length ? (
        <section className="pack-list">
          {packs.map((pack) => (
            <article className="pack-card" key={pack.id}>
              <div>
                <p className="eyebrow">{pack.chores.length} faccende</p>
                <h2>{pack.title}</h2>
                <span>{pack.description}</span>
              </div>
              <div className="pack-preview" aria-hidden="true">
                {pack.chores.slice(0, 4).map((chore) => (
                  <span className="icon-tile" key={`${pack.id}-${chore.title}`}>
                    <ChoreIcon name={chore.icon} size={40} />
                  </span>
                ))}
              </div>
              <button type="button" onClick={() => addPack(pack)}>
                <PackagePlus size={17} />
                Aggiungi set
              </button>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <PackagePlus size={24} />
          <h2>Nessun set disponibile</h2>
          <p>Qui compariranno i pacchetti di faccende precaricate.</p>
        </section>
      )}

      {status ? <p className="status-note">{status}</p> : null}
    </div>
  );
}
