import { useAuth } from "@clerk/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { AddChore } from "./routes/AddChore";
import { Calendar } from "./routes/Calendar";
import { Chores } from "./routes/Chores";
import { Home } from "./routes/Home";
import { Landing } from "./routes/Landing";
import { Settings } from "./routes/Settings";

function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) return <div className="page-loader">Caricamento account...</div>;
  if (!isSignedIn) return <Navigate to="/" replace state={{ from: location.pathname }} />;

  return <AppShell />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="faccende" element={<Chores />} />
        <Route path="aggiungi" element={<AddChore />} />
        <Route path="calendario" element={<Calendar />} />
        <Route path="opzioni" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
