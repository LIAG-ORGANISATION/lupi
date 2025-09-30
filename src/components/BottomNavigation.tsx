import { Home, Dog, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border rounded-t-[2rem] shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-8">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <Home className="h-6 w-6" strokeWidth={1.5} />
          <span className="text-xs font-medium">Accueil</span>
        </NavLink>

        <NavLink
          to="/dogs"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <Dog className="h-6 w-6" strokeWidth={1.5} />
          <span className="text-xs font-medium">Chiens</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <User className="h-6 w-6" strokeWidth={1.5} />
          <span className="text-xs font-medium">Profil</span>
        </NavLink>
      </div>
    </nav>
  );
};
