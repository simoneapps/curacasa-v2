import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, ListChecks, Sparkles } from "lucide-react";
import { choreIcons, type ChoreIconName } from "../lib/icons";
import { addLog, daysAgo, lastLog, loadData, relativeDays, saveData, statusFor } from "../lib/store";

export function Home() {
  const [data, setData] = useState(loadData);
  const todayKey = new Date().toDateString();
  const doneToday = data.logs.filter((log) => new Date(log.completedAt).toDateString() === todayKey).length;
  const due = data.chores.filter((chore) => statusFor(chore, data.logs) !== "normal");
  const recommended = due[0] || data.chores[0];
  const doneThisWeek = data.logs.filter((log) => daysAgo(log.completedAt)! <= 7).length;

  const progress = useMemo(() => {
    if (!data.chores.length) return 0;
    return Math.round((doneToday / data.chores.length) * 100);
  }, [data.chores.length, doneToday]);

  function markDone(choreId: string) {
    const next = addLog(data, choreId);
    saveData(next);
    setData(next);
  }

  const RecommendedIcon = choreIcons[(recommended?.icon || "home") as ChoreIconName] || Sparkles;
  const recommendedLast = recommended ? lastLog(recommended, data.logs) : null;

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Riepilogo semplice</p>
          <h1>Casa sotto controllo, con calma.</h1>
          <p>Qui trovi cosa e stato fatto, cosa torna in scadenza e il prossimo gesto utile.</p>
          <Link className="pill-button" to="/app/faccende">
            Gestisci stanze
          </Link>
        </div>
        <div className="progress-jewel" aria-label={`${progress}% fatto oggi`}>
          <svg viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="35" />
            <circle
              className="progress-ring"
              cx="48"
              cy="48"
              r="35"
              style={{ strokeDashoffset: 220 - (220 * Math.max(progress, 20)) / 100 }}
            />
          </svg>
          <strong>{progress || 20}%</strong>
          <small>oggi</small>
        </div>
      </section>

      <section className="stats-grid">
        <Link to="/app/faccende" className="stat-card">
          <ListChecks size={19} />
          <strong>{data.chores.length}</strong>
          <span>Faccende registrate</span>
        </Link>
        <Link to="/app/calendario" className="stat-card">
          <CalendarDays size={19} />
          <strong>{doneToday}</strong>
          <span>Gia fatte oggi</span>
        </Link>
        <Link to="/app/calendario" className="stat-card">
          <Clock size={19} />
          <strong>{doneThisWeek}</strong>
          <span>Fatte questa settimana</span>
        </Link>
        <Link to="/app/faccende" className="stat-card urgent">
          <Sparkles size={19} />
          <strong>{due.length}</strong>
          <span>Da guardare</span>
        </Link>
      </section>

      <section className="section-block">
        <div className="section-title">
          <h2>Stanze rapide</h2>
          <Link to="/app/opzioni">Modifica</Link>
        </div>
        <div className="chip-row">
          <span className="chip active">Tutta casa</span>
          {data.rooms.map((room) => (
            <span className="chip" key={room}>
              {room}
            </span>
          ))}
        </div>
      </section>

      {recommended ? (
        <section className="recommend-card">
          <span className="icon-tile">
            <RecommendedIcon size={21} />
          </span>
          <div>
            <p className="eyebrow">Attivita consigliata</p>
            <h2>{recommended.title}</h2>
            <span>
              {recommended.room || "Tutta casa"} - {relativeDays(daysAgo(recommendedLast?.completedAt))}
            </span>
          </div>
          <button type="button" onClick={() => markDone(recommended.id)} aria-label="Segna fatta">
            <Sparkles size={18} />
          </button>
        </section>
      ) : null}
    </div>
  );
}
