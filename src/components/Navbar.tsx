import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle, LogOut } from "lucide-react";
import { signOut } from "@/lib/supabase";
import { toast } from "sonner";

export const Navbar = () => {
  const { isProtetor } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Erro ao sair");
    } else {
      toast.success("Até logo!");
      window.location.href = "/";
    }
  };

  return (
    <nav className="w-full bg-primary py-4 px-6 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-accent rounded-full px-4 py-2">
            <Link to="/censo">
              <Button
                variant={isActive("/censo") ? "secondary" : "ghost"}
                size="sm"
                className={isActive("/censo") ? "" : "text-accent-foreground hover:bg-accent-foreground/10"}
              >
                Censo
              </Button>
            </Link>
            <Link to="/graficos">
              <Button
                variant={isActive("/graficos") ? "secondary" : "ghost"}
                size="sm"
                className={isActive("/graficos") ? "" : "text-accent-foreground hover:bg-accent-foreground/10"}
              >
                Gráficos
              </Button>
            </Link>
            <Link to="/protetores">
              <Button
                variant={isActive("/protetores") ? "secondary" : "ghost"}
                size="sm"
                className={isActive("/protetores") ? "" : "text-accent-foreground hover:bg-accent-foreground/10"}
              >
                Protetores
              </Button>
            </Link>
            <Link to="/memorial">
              <Button
                variant={isActive("/memorial") ? "secondary" : "ghost"}
                size="sm"
                className={isActive("/memorial") ? "" : "text-accent-foreground hover:bg-accent-foreground/10"}
              >
                Memorial
              </Button>
            </Link>
            <Link to="/como-ajudar">
              <Button
                variant={isActive("/como-ajudar") ? "secondary" : "ghost"}
                size="sm"
                className={isActive("/como-ajudar") ? "" : "text-accent-foreground hover:bg-accent-foreground/10"}
              >
                Como Ajudar
              </Button>
            </Link>
          </div>
          
          {isProtetor ? (
            <Button
              variant="outline"
              size="icon"
              onClick={handleSignOut}
              className="bg-secondary border-secondary hover:bg-secondary/80"
            >
              <LogOut className="w-5 h-5 text-secondary-foreground" />
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="accent" size="sm" className="gap-2">
                <UserCircle className="w-4 h-4" />
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
