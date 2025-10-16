import { Home, User, MessageSquare } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { Badge } from "@/components/ui/badge";

export const BottomNavigation = () => {
  const { isAuthenticated, isProfessional, isGuardian } = useAuth();
  const unreadCount = useUnreadMessages();

  const messagesPath = isProfessional ? "/professional/messages" : "/guardian/messages";

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

        {isAuthenticated && (isGuardian || isProfessional) && (
          <NavLink
            to={messagesPath}
            className="flex flex-col items-center gap-2 transition-all"
          >
            {({ isActive }) => (
              <>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                }`}>
                  <MessageSquare className="h-6 w-6" strokeWidth={1.5} />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </div>
                <span className={`text-xs font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  Messages
                </span>
              </>
            )}
          </NavLink>
        )}

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
