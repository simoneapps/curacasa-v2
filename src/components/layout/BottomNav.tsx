import { NavLink } from "react-router-dom";
import { navIcons } from "../../lib/icons";

const items = [
  { to: "/app", label: "Home", icon: navIcons.home, end: true },
  { to: "/app/faccende", label: "Faccende", icon: navIcons.chores },
  { to: "/app/aggiungi", label: "Aggiungi", icon: navIcons.add, add: true },
  { to: "/app/calendario", label: "Calendario", icon: navIcons.calendar },
  { to: "/app/shop", label: "Shop", icon: navIcons.shop },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigazione app">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `bottom-nav-item${isActive ? " active" : ""}${item.add ? " add" : ""}`
            }
          >
            <Icon size={item.add ? 22 : 18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
