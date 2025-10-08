import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CatCard } from "@/components/CatCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase, CatStatus } from "@/lib/supabase";
import { Loader2, Instagram, Heart, Sparkles, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroCats from "@/assets/hero-cats.jpg";

interface Cat {
  id: string;
  nome: string;
  sexo: string;
  status: CatStatus;
  castrado: boolean;
  vacinado: boolean;
  data_ultima_vacinacao: string | null;
  local_encontrado: string | null;
  caracteristicas: string | null;
  fotos: string[] | null;
}

const Index = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gatos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCats(data);
    }
    setLoading(false);
  };

  const displayedCats = cats.slice(0, 8);
  const totalCats = cats.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl mb-12 bg-gradient-yellow-red p-8 md:p-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left z-10 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-5 h-5 text-secondary" />
                <span className="text-sm font-semibold text-secondary">Bem-vindo ao Instituto Patinhas!</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-4 leading-tight">
                Conheça nossas<br />
                <span className="text-accent">patinhas</span> especiais!
              </h1>
              <p className="text-lg text-secondary/80 mb-6 max-w-lg">
                Ajude a cuidar dos gatos do campus. Conheça cada um deles e saiba como contribuir para o bem-estar de todos! 🐾
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link to="/censo">
                  <Button size="lg" className="gap-2">
                    <Heart className="w-5 h-5" />
                    Ver todos os gatinhos
                  </Button>
                </Link>
                <a href="https://instagram.com/patinhasdoinstituto" target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <Instagram className="w-5 h-5" />
                    Siga no Instagram
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <img 
                src={heroCats} 
                alt="Gatinhos do campus" 
                className="rounded-2xl shadow-vibrant w-full h-auto animate-float"
              />
              <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground rounded-full p-4 shadow-card animate-bounce-subtle">
                <Award className="w-8 h-8" />
              </div>
            </div>
          </div>
        </section>

        {/* Cats Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="bg-primary rounded-3xl p-6 md:p-8 border-4 border-accent shadow-card">
              <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6 text-center">
                🐱 Nossos Gatinhos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {displayedCats.map((cat, index) => (
                  <div 
                    key={cat.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CatCard
                      id={cat.id}
                      nome={cat.nome}
                      foto={cat.fotos?.[0]}
                      castrado={cat.castrado}
                      vacinado={cat.vacinado}
                      onClick={() => setSelectedCat(cat)}
                    />
                  </div>
                ))}
              </div>

              {totalCats > 8 && (
                <div className="flex justify-center mt-6">
                  <Link to="/censo">
                    <Button variant="secondary" size="lg">
                      Ver todos!
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Stats Section */}
            <section className="mt-12 bg-secondary rounded-3xl p-8 text-center border-4 border-accent">
              <h2 className="text-3xl font-bold text-secondary-foreground mb-4">
                Patinhas em números
              </h2>
              <p className="text-5xl font-bold text-primary">{totalCats}</p>
              <p className="text-xl text-secondary-foreground/80 mt-2">
                gatos cadastrados
              </p>
            </section>

            {/* Footer */}
            <footer className="mt-12 bg-accent rounded-3xl p-8 border-4 border-accent text-center">
              <h3 className="text-2xl font-bold text-accent-foreground mb-4">
                Visite nosso insta!
              </h3>
              <a
                href="https://instagram.com/patinhasdoinstituto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent-foreground hover:underline"
              >
                <Instagram className="w-6 h-6" />
                @patinhasdoinstituto
              </a>
            </footer>
          </>
        )}
      </main>

      {/* Cat Detail Dialog */}
      <Dialog open={!!selectedCat} onOpenChange={() => setSelectedCat(null)}>
        <DialogContent className="max-w-2xl bg-card border-4 border-accent rounded-3xl">
          {selectedCat && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-secondary">
                  {selectedCat.nome}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {selectedCat.fotos?.[0] && (
                  <img
                    src={selectedCat.fotos[0]}
                    alt={selectedCat.nome}
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-bold text-secondary">Sexo:</p>
                    <p className="text-muted-foreground capitalize">{selectedCat.sexo}</p>
                  </div>
                  <div>
                    <p className="font-bold text-secondary">Status:</p>
                    <p className="text-muted-foreground capitalize">
                      {selectedCat.status.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-secondary">Castrado:</p>
                    <p className="text-muted-foreground">{selectedCat.castrado ? 'Sim' : 'Não'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-secondary">Vacinado:</p>
                    <p className="text-muted-foreground">{selectedCat.vacinado ? 'Sim' : 'Não'}</p>
                  </div>
                </div>

                {selectedCat.caracteristicas && (
                  <div>
                    <p className="font-bold text-secondary mb-1">Características:</p>
                    <p className="text-muted-foreground">{selectedCat.caracteristicas}</p>
                  </div>
                )}

                {selectedCat.local_encontrado && (
                  <div>
                    <p className="font-bold text-secondary mb-1">Local onde costuma ser encontrado:</p>
                    <p className="text-muted-foreground">{selectedCat.local_encontrado}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
