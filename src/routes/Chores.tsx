import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Pencil, Search, X } from "lucide-react";
import { ChoreIcon, choreIconOptions, type ChoreIconName } from "../lib/icons";
import { addLog, daysAgo, lastLog, loadData, relativeDays, saveData, statusFor, type ChoreType } from "../lib/store";

export function Chores() {
  const [data, setData] = useState(loadData);
  const [room, setRoom] = useState("");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<ChoreIconName>("casa");
  const [iconMenuOpen, setIconMenuOpen] = useState(false);

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

  function startEdit(choreId: string, icon: string) {
    setEditingId(choreId);
    setSelectedIcon((choreIconOptions.some((option) => option.value === icon) ? icon : "casa") as ChoreIconName);
    setIconMenuOpen(false);
  }

  function submitEdit(event: FormEvent<HTMLFormElement>, choreId: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    if (!title) return;

    const next = {
      ...data,
      chores: data.chores.map((chore) =>
        chore.id === choreId
          ? {
              ...chore,
              title,
              description: String(form.get("description") || "").trim(),
              icon: selectedIcon,
              type: String(form.get("type") || "ordinaria") as ChoreType,
              room: String(form.get("room") || "").trim(),
              frequency: Number(form.get("frequency") || 0),
              estimatedMinutes: Number(form.get("estimatedMinutes") || 0),
              notes: String(form.get("notes") || "").trim(),
              updatedAt: new Date().toISOString(),
            }
          : chore,
      ),
    };
    saveData(next);
    setData(next);
    setEditingId(null);
    setIconMenuOpen(false);
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
              <div className="task-edit-group" key={chore.id}>
                <article className={`task-row ${statusFor(chore, data.logs)}`}>
                  <span className="icon-tile">
                    <ChoreIcon name={chore.icon} size={40} />
                  </span>
                  <div>
                    <strong>{chore.title}</strong>
                    <span>
                      {chore.room || "Tutta casa"} - {relativeDays(daysAgo(last?.completedAt))}
                    </span>
                  </div>
                  <div className="task-actions">
                    <button type="button" onClick={() => startEdit(chore.id, chore.icon)} aria-label={`Modifica ${chore.title}`}>
                      <Pencil size={16} />
                    </button>
                    <button type="button" onClick={() => markDone(chore.id)} aria-label={`Completa ${chore.title}`}>
                      <Check size={17} />
                    </button>
                  </div>
                </article>
                {editingId === chore.id ? (
                  <form className="task-edit-card" onSubmit={(event) => submitEdit(event, chore.id)}>
                    <div className="form-title">
                      <Pencil size={18} />
                      <h2>Modifica attività</h2>
                      <button
                        aria-label="Chiudi modifica"
                        className="icon-only-button"
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setIconMenuOpen(false);
                        }}
                      >
                        <X size={17} />
                      </button>
                    </div>
                    <label>
                      Titolo
                      <input name="title" required defaultValue={chore.title} />
                    </label>
                    <label>
                      Descrizione
                      <textarea name="description" rows={3} defaultValue={chore.description} />
                    </label>
                    <div className="form-grid">
                      <label>
                        Tipo
                        <select name="type" defaultValue={chore.type}>
                          <option value="ordinaria">Ordinaria</option>
                          <option value="straordinaria">Straordinaria</option>
                        </select>
                      </label>
                      <div className="icon-picker-field">
                        <span>Icona</span>
                        <input name="icon" type="hidden" value={selectedIcon} />
                        <button
                          aria-expanded={iconMenuOpen}
                          className="icon-picker-trigger"
                          type="button"
                          onClick={() => setIconMenuOpen((open) => !open)}
                        >
                          <span className="icon-tile">
                            <ChoreIcon name={selectedIcon} size={42} />
                          </span>
                          <strong>
                            {choreIconOptions.find((icon) => icon.value === selectedIcon)?.label || "Icona"}
                          </strong>
                        </button>
                        {iconMenuOpen ? (
                          <div className="icon-picker-menu" role="listbox">
                            {choreIconOptions.map((icon) => (
                              <button
                                aria-selected={icon.value === selectedIcon}
                                className={`icon-picker-option ${icon.value === selectedIcon ? "active" : ""}`}
                                key={icon.value}
                                role="option"
                                type="button"
                                onClick={() => {
                                  setSelectedIcon(icon.value);
                                  setIconMenuOpen(false);
                                }}
                              >
                                <span className="icon-tile">
                                  <ChoreIcon name={icon.value} size={40} />
                                </span>
                                <span>{icon.label}</span>
                                {icon.value === selectedIcon ? <Check aria-hidden="true" size={16} /> : null}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="form-grid">
                      <label>
                        Stanza o zona
                        <input name="room" list="edit-rooms" defaultValue={chore.room} />
                        <datalist id="edit-rooms">
                          {data.rooms.map((room) => (
                            <option key={room} value={room} />
                          ))}
                        </datalist>
                      </label>
                      <label>
                        Scadenza opzionale
                        <input name="frequency" type="number" min="0" inputMode="numeric" defaultValue={chore.frequency || ""} />
                      </label>
                    </div>
                    <label>
                      Minuti stimati
                      <input
                        name="estimatedMinutes"
                        type="number"
                        min="0"
                        inputMode="numeric"
                        defaultValue={chore.estimatedMinutes || ""}
                      />
                    </label>
                    <label>
                      Note
                      <textarea name="notes" rows={3} defaultValue={chore.notes} />
                    </label>
                    <button className="primary-action" type="submit">
                      Salva modifiche
                    </button>
                  </form>
                ) : null}
              </div>
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
