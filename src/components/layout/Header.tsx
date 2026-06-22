import { UserButton } from "@clerk/react";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="app-header">
      <Link className="brand-mark" to="/app" aria-label="CuraCasa Home">
        <span className="brand-icon">
          <Home size={18} />
        </span>
        <span>CuraCasa</span>
      </Link>
      <UserButton />
    </header>
  );
}
