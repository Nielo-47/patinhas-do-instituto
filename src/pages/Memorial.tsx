import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Loader2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Cat {
  id: string;
  nome: string;
  fotos: string[] | null;
  created_at: string;
}

const Memorial = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const { isProtetor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeceasedCats();
  }, []);

  const fetchDeceasedCats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gatos")
      .select("id, nome, fotos, created_at")
      .eq("status", "falecido")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCats(data);
    }
    setLoading(false);
  };

  const handleEdit = () => {
    navigate(`/editar-gato/${selectedCat.id}`);
    setSelectedCat(null);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, hsl(283 20% 25%), hsl(283 20% 18%))",
      }}
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "hsl(51 100% 50%)" }}
          >
            💙 Memorial: Sempre em Nossos Corações
          </h1>
          <p
            className="text-lg opacity-80"
            style={{ color: "hsl(51 100% 50%)" }}
          >
            Homenagem aos amigos que partiram mas nunca serão esquecidos
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2
              className="w-12 h-12 animate-spin"
              style={{ color: "hsl(51 100% 50%)" }}
            />
          </div>
        ) : cats.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl" style={{ color: "hsl(51 100% 50% / 0.7)" }}>
              Nenhum registro no memorial
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {cats.map((cat) => (
              <div key={cat.id}>
                {/* Desktop Card View - hidden on mobile */}
                <div
                  onClick={() => setSelectedCat(cat)}
                  className="hidden sm:block cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{
                    background: "hsl(0 0% 98%)",
                    borderRadius: "1.5rem",
                    padding: "1rem",
                    border: "2px solid hsl(283 20% 40%)",
                  }}
                >
                  <div
                    className="aspect-square rounded-xl overflow-hidden mb-3"
                    style={{ background: "hsl(0 0% 85%)" }}
                  >
                    {cat.fotos?.[0] ? (
                      <img
                        src={cat.fotos[0]}
                        alt={cat.nome}
                        className="w-full h-full object-cover"
                        style={{ filter: "grayscale(100%)" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span
                          className="text-6xl"
                          style={{ filter: "grayscale(100%)" }}
                        >
                          🐱
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <h3
                      className="font-bold text-lg mb-1"
                      style={{ color: "hsl(283 72% 16%)" }}
                    >
                      {cat.nome}
                    </h3>
                    <p
                      className="text-sm opacity-60"
                      style={{ color: "hsl(283 72% 16%)" }}
                    >
                      {new Date(cat.created_at).getFullYear()}
                    </p>
                  </div>
                </div>

                {/* Mobile List View - visible only on mobile */}
                <div
                  onClick={() => setSelectedCat(cat)}
                  className="sm:hidden cursor-pointer transition-all duration-200 active:scale-95"
                  style={{
                    background: "hsl(0 0% 98%)",
                    borderRadius: "1rem",
                    padding: "0.75rem",
                    border: "2px solid hsl(283 20% 40%)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Photo thumbnail */}
                    <div
                      className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden"
                      style={{ background: "hsl(0 0% 85%)" }}
                    >
                      {cat.fotos?.[0] ? (
                        <img
                          src={cat.fotos[0]}
                          alt={cat.nome}
                          className="w-full h-full object-cover"
                          style={{ filter: "grayscale(100%)" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span
                            className="text-3xl"
                            style={{ filter: "grayscale(100%)" }}
                          >
                            🐱
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-lg truncate"
                        style={{ color: "hsl(283 72% 16%)" }}
                      >
                        {cat.nome}
                      </h3>
                      <p
                        className="text-sm opacity-60"
                        style={{ color: "hsl(283 72% 16%)" }}
                      >
                        Em memória desde{" "}
                        {new Date(cat.created_at).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cat Detail Dialog */}
      <Dialog open={!!selectedCat} onOpenChange={() => setSelectedCat(null)}>
        <DialogContent
          className="max-w-2xl"
          style={{
            background: "hsl(0 0% 100%)",
            border: "4px solid hsl(283 20% 40%)",
            borderRadius: "1.5rem",
          }}
        >
          {selectedCat && (
            <>
              <DialogHeader>
                <DialogTitle
                  className="text-2xl font-bold"
                  style={{ color: "hsl(283 72% 16%)" }}
                >
                  {selectedCat.nome}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {selectedCat.fotos?.[0] && (
                  <img
                    src={selectedCat.fotos[0]}
                    alt={selectedCat.nome}
                    className="w-full h-64 object-cover rounded-2xl"
                    style={{ filter: "grayscale(100%)" }}
                  />
                )}

                <div className="text-center py-4">
                  <p style={{ color: "hsl(283 72% 16% / 0.7)" }}>
                    Em memória desde{" "}
                    {new Date(selectedCat.created_at).getFullYear()}
                  </p>
                </div>
                {isProtetor && (
                  <Button
                    onClick={handleEdit}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold text-lg"
                  >
                    <Pencil className="mr-2 h-5 w-5" />
                    Editar
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Memorial;
