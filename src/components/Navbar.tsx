import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle, LogOut, Menu, X } from "lucide-react";
import { signOut } from "@/lib/supabase";
import { toast } from "sonner";
import { useState } from "react";

export const Navbar = () => {
  const { isProtetor } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Erro ao sair");
    } else {
      toast.success("Até logo!");
      window.location.href = "/";
    }
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="w-full bg-primary py-4 px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 bg-accent rounded-full px-4 py-2">
              <Link to="/censo">
                <Button
                  variant={isActive("/censo") ? "secondary" : "ghost"}
                  size="sm"
                  className={
                    isActive("/censo")
                      ? ""
                      : "text-accent-foreground hover:bg-yellow/10"
                  }
                >
                  Censo
                </Button>
              </Link>
              <Link to="/graficos">
                <Button
                  variant={isActive("/graficos") ? "secondary" : "ghost"}
                  size="sm"
                  className={
                    isActive("/graficos")
                      ? ""
                      : "text-accent-foreground hover:bg-accent-foreground/10"
                  }
                >
                  Gráficos
                </Button>
              </Link>
              {isProtetor && (
                <Link to="/protetores">
                  <Button
                    variant={isActive("/protetores") ? "secondary" : "ghost"}
                    size="sm"
                    className={
                      isActive("/protetores")
                        ? ""
                        : "text-accent-foreground hover:bg-accent-foreground/10"
                    }
                  >
                    Protetores
                  </Button>
                </Link>
              )}
              <Link to="/adotados">
                <Button
                  variant={isActive("/adotados") ? "secondary" : "ghost"}
                  size="sm"
                  className={
                    isActive("/adotados")
                      ? ""
                      : "text-accent-foreground hover:bg-accent-foreground/10"
                  }
                >
                  Adotados
                </Button>
              </Link>
              <Link to="/memorial">
                <Button
                  variant={isActive("/memorial") ? "secondary" : "ghost"}
                  size="sm"
                  className={
                    isActive("/memorial")
                      ? ""
                      : "text-accent-foreground hover:bg-accent-foreground/10"
                  }
                >
                  Memorial
                </Button>
              </Link>
              <Link to="/como-ajudar">
                <Button
                  variant={isActive("/como-ajudar") ? "secondary" : "ghost"}
                  size="sm"
                  className={
                    isActive("/como-ajudar")
                      ? ""
                      : "text-accent-foreground hover:bg-accent-primary/10"
                  }
                >
                  Como Ajudar
                </Button>
              </Link>
              {isProtetor && (
                <Link to="/pedidos-adocao">
                  <Button
                    variant={
                      isActive("/pedidos-adocao") ? "secondary" : "ghost"
                    }
                    size="sm"
                    className={
                      isActive("/pedidos-adocao")
                        ? ""
                        : "text-accent-foreground hover:bg-accent-foreground/10"
                    }
                  >
                    Pedidos
                  </Button>
                </Link>
              )}
            </div>

            {/* Desktop Auth Button */}
            <div className="hidden md:block">
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

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden bg-secondary border-secondary hover:bg-secondary/80"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-secondary-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-secondary-foreground" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Side Panel */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMobileMenu}
          />

          {/* Side Panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-primary shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col p-6 gap-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary-foreground">
                  Menu
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileMenu}
                  className="text-primary-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <Link to="/censo" onClick={closeMobileMenu}>
                <Button
                  variant={isActive("/censo") ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  Censo
                </Button>
              </Link>

              <Link to="/graficos" onClick={closeMobileMenu}>
                <Button
                  variant={isActive("/graficos") ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  Gráficos
                </Button>
              </Link>

              {isProtetor && (
                <Link to="/protetores" onClick={closeMobileMenu}>
                  <Button
                    variant={isActive("/protetores") ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                  >
                    Protetores
                  </Button>
                </Link>
              )}

              <Link to="/memorial" onClick={closeMobileMenu}>
                <Button
                  variant={isActive("/memorial") ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  Memorial
                </Button>
              </Link>

              <Link to="/como-ajudar" onClick={closeMobileMenu}>
                <Button
                  variant={isActive("/como-ajudar") ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  Como Ajudar
                </Button>
              </Link>

              {isProtetor && (
                <Link to="/pedidos-adocao" onClick={closeMobileMenu}>
                  <Button
                    variant={
                      isActive("/pedidos-adocao") ? "secondary" : "ghost"
                    }
                    size="sm"
                    className="w-full justify-start"
                  >
                    Pedidos
                  </Button>
                </Link>
              )}

              <div className="border-t border-primary-foreground/20 mt-4 pt-4">
                {isProtetor ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full justify-start gap-2 bg-secondary border-secondary hover:bg-secondary/80 text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </Button>
                ) : (
                  <Link to="/auth" onClick={closeMobileMenu}>
                    <Button
                      variant="accent"
                      size="sm"
                      className="w-full justify-start gap-2"
                    >
                      <UserCircle className="w-4 h-4" />
                      Entrar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
