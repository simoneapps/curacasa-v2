import { FormEvent, useMemo, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { addLog, dayKey, loadData, monthKey, saveData } from "../lib/store";

export function Calendar() {
  const [data, setData] = useState(loadData);
  const [month, setMonth] = useState(monthKey());
  const [selectedDay, setSelectedDay] = useState(dayKey(new Date()));

  const cells = useMemo(() => {
    const [year, monthNumber] = month.split("-").map(Number);
    const first = new Date(year, monthNumber - 1, 1);
    const last = new Date(year, monthNumber, 0);
    const startOffset = (first.getDay() + 6) % 7;
    const days: (Date | null)[] = Array.from({ length: startOffset }, () => null);
    for (let day = 1; day <= last.getDate(); day += 1) days.push(new Date(year, monthNumber - 1, day));
    return days;
  }, [month]);

  const selectedLogs = data.logs.filter((log) => dayKey(log.completedAt) === selectedDay);

  function shift(offset: number) {
    const [year, monthNumber] = month.split("-").map(Number);
    setMonth(monthKey(new Date(year, monthNumber - 1 + offset, 1)));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const choreId = String(form.get("choreId") || "");
    if (!choreId) return;
    const next = addLog(data, choreId, {
      completedAt: `${selectedDay}T12:00:00`,
      durationMinutes: Number(form.get("durationMinutes") || 0),
      note: String(form.get("note") || ""),
    });
    saveData(next);
    setData(next);
    event.currentTarget.reset();
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <p className="eyebrow">Calendario globale</p>
        <div>
          <h1>
            {new Date(`${month}-01T12:00:00`).toLocaleDateString("it-IT", {
              month: "long",
              year: "numeric",
            })}
          </h1>
          <div className="calendar-actions">
            <button type="button" onClick={() => shift(-1)}>
              Indietro
            </button>
            <button type="button" onClick={() => setMonth(monthKey())}>
              Oggi
            </button>
            <button type="button" onClick={() => shift(1)}>
              Avanti
            </button>
          </div>
        </div>
      </section>

      <section className="calendar-panel">
        <div className="weekdays">
          {["L", "M", "M", "G", "V", "S", "D"].map((day) => (
            <strong key={day}>{day}</strong>
          ))}
        </div>
        <div className="calendar-grid">
          {cells.map((date, index) => {
            if (!date) return <span className="calendar-day muted" key={`empty-${index}`} />;
            const key = dayKey(date);
            const count = data.logs.filter((log) => dayKey(log.completedAt) === key).length;
            return (
              <button
                className={`calendar-day ${selectedDay === key ? "active" : ""} ${count ? "has-log" : ""}`}
                key={key}
                type="button"
                onClick={() => setSelectedDay(key)}
              >
                <strong>{date.getDate()}</strong>
                {count ? <span>{count}</span> : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-title">
          <h2>{new Date(`${selectedDay}T12:00:00`).toLocaleDateString("it-IT")}</h2>
          <span>{selectedLogs.length} registrazioni</span>
        </div>
        <div className="mini-list">
          {selectedLogs.length ? (
            selectedLogs.map((log) => {
              const chore = data.chores.find((item) => item.id === log.choreId);
              return (
                <article className="mini-row" key={log.id}>
                  <strong>{chore?.title || "Faccenda"}</strong>
                  <span>{log.durationMinutes ? `${log.durationMinutes} min` : "durata non segnata"}</span>
                </article>
              );
            })
          ) : (
            <div className="soft-note">Nessuna faccenda registrata in questo giorno.</div>
          )}
        </div>
      </section>

      <form className="form-card compact" onSubmit={submit}>
        <div className="form-title">
          <CalendarPlus size={18} />
          <h2>Aggiungi a questa giornata</h2>
        </div>
        <label>
          Faccenda
          <select name="choreId" required>
            <option value="">Scegli</option>
            {data.chores.map((chore) => (
              <option key={chore.id} value={chore.id}>
                {chore.title}
              </option>
            ))}
          </select>
        </label>
        <div className="form-grid">
          <label>
            Minuti
            <input name="durationMinutes" type="number" min="0" inputMode="numeric" />
          </label>
          <label>
            Nota
            <input name="note" placeholder="Dettagli" />
          </label>
        </div>
        <button className="primary-action" type="submit">
          Aggiungi registrazione
        </button>
      </form>
    </div>
  );
}
