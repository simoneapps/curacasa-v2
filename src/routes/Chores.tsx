import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Search } from "lucide-react";
import { ChoreIcon } from "../lib/icons";
import { addLog, daysAgo, lastLog, loadData, relativeDays, saveData, statusFor } from "../lib/store";

export function Chores() {
  const [data, setData] = useState(loadData);
  const [room, setRoom] = useState("");
  const [query, setQuery] = useState("");

  const rooms = useMemo(() => ["", ...data.rooms], [data.rooms]);
  const chores = data.chores.filter((chore) => {
    const roomOk = !room || chore.room === room;
    const queryOk = !query || chore.title.toLowerCase().includes(query.toLowerCase());
    return roomOk && queryOk;
  });

  function markDone(choreId: string) {
    const next = addLog(data, choreId);
    saveData(next);
    setData(next);
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <p className="eyebrow">Tutte le faccende</p>
        <div>
          <h1>Le faccende di casa</h1>
          <Link className="round-link" to="/app/aggiungi" aria-label="Aggiungi faccenda">
            +
          </Link>
        </div>
      </section>

      <label className="search-box">
        <Search size={17} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca faccenda" />
      </label>

      <div className="chip-row">
        {rooms.map((item) => (
          <button
            className={`chip ${room === item ? "active" : ""}`}
            key={item || "all"}
            type="button"
            onClick={() => setRoom(item)}
          >
            {item || "Tutte"}
          </button>
        ))}
      </div>

      {chores.length ? (
        <section className="task-list">
          {chores.map((chore) => {
            const last = lastLog(chore, data.logs);
            return (
              <article className={`task-row ${statusFor(chore, data.logs)}`} key={chore.id}>
                <span className="icon-tile">
                  <ChoreIcon name={chore.icon} size={40} />
                </span>
                <div>
                  <strong>{chore.title}</strong>
                  <span>
                    {chore.room || "Tutta casa"} - {relativeDays(daysAgo(last?.completedAt))}
                  </span>
                </div>
                <button type="button" onClick={() => markDone(chore.id)} aria-label={`Completa ${chore.title}`}>
                  <Check size={17} />
                </button>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="empty-state">
          <Search size={24} />
          <h2>Nessuna faccenda trovata</h2>
          <p>Aggiungi una faccenda manualmente o scegli un set dallo Shop.</p>
          <div className="empty-actions">
            <Link className="pill-button" to="/app/aggiungi">
              Aggiungi faccenda
            </Link>
            <Link className="secondary-action" to="/app/shop">
              Apri Shop
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
