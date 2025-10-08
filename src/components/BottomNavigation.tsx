import { Home, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-border rounded-t-[2rem] shadow-2xl z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-20 px-8">
        <NavLink
          to="/"
          end
          className="flex flex-col items-center gap-2 transition-all"
        >
          {({ isActive }) => (
            <>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              }`}>
                <Home className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <span className={`text-xs font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                Accueil
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/profile"
          className="flex flex-col items-center gap-2 transition-all"
        >
          {({ isActive }) => (
            <>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              }`}>
                <User className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <span className={`text-xs font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                Profil
              </span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};
