import { Home, Dog, User, Briefcase } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({
  children
}: LayoutProps) => {
  const {
    isAuthenticated,
    isProfessional,
    isGuardian
  } = useAuth();
  return <div className="min-h-screen pb-20 bg-red-100">
      <main className="max-w-md mx-auto">{children}</main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <NavLink to="/" className={({
          isActive
        }) => cn("flex flex-col items-center gap-1 px-4 py-2 transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
            <Home className="h-6 w-6" />
            <span className="text-xs">Accueil</span>
          </NavLink>
          
          {isAuthenticated && isGuardian && <NavLink to="/guardian/dashboard" className={({
          isActive
        }) => cn("flex flex-col items-center gap-1 px-4 py-2 transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
              <Dog className="h-6 w-6" />
              <span className="text-xs">Mes chiens</span>
            </NavLink>}

          {isAuthenticated && isProfessional && <NavLink to="/professional/clients" className={({
          isActive
        }) => cn("flex flex-col items-center gap-1 px-4 py-2 transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
              <Briefcase className="h-6 w-6" />
              <span className="text-xs">Mes patients</span>
            </NavLink>}
          
          <NavLink to={isAuthenticated ? "/profile" : "/choose-account-type"} className={({
          isActive
        }) => cn("flex flex-col items-center gap-1 px-4 py-2 transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
            <User className="h-6 w-6" />
            <span className="text-xs">Profil</span>
          </NavLink>
        </div>
      </nav>
    </div>;
};
export default Layout;