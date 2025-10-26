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
  data_adocao_falecimento: string | null;
  mensagem: string | null;
}

const Adotados = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const { isProtetor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdoptedCats();
  }, []);

  const fetchAdoptedCats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gatos")
      .select("id, nome, fotos, data_adocao_falecimento, mensagem")
      .eq("status", "adotado")
      .order("data_adocao_falecimento", { ascending: false });

    console.log("Fetch Adopted Cats - Data:", data);

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
        // Gradiente alegre e quente
        background:
          "linear-gradient(180deg, hsl(51, 100%, 95%), hsl(51, 100%, 85%))",
      }}
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            // Cor principal escura para contraste
            style={{ color: "hsl(283 72% 16%)" }}
          >
            🎉 Finais Felizes: Nossos Adotados!
          </h1>
          <p
            className="text-lg opacity-80"
            style={{ color: "hsl(283 72% 16%)" }}
          >
            Celebre conosco as histórias de amor e os novos lares que nossos
            gatinhos encontraram!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2
              className="w-12 h-12 animate-spin"
              style={{ color: "hsl(283 72% 16%)" }}
            />
          </div>
        ) : cats.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl" style={{ color: "hsl(283 72% 16% / 0.7)" }}>
              Ainda nenhum final feliz registrado. Seja o próximo a adotar!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {cats.map((cat) => (
              <div key={cat.id}>
                {/* Desktop Card View */}
                <div
                  onClick={() => setSelectedCat(cat)}
                  className="hidden sm:block cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{
                    background: "hsl(0 0% 100%)",
                    borderRadius: "1.5rem",
                    padding: "1rem",
                    // Borda com cor de destaque vibrante
                    border: "2px solid hsl(13 95% 54%)",
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
                        // Filtro grayscale removido para imagens coloridas
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">🐱</span>
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
                      Adotado em{" "}
                      {cat.data_adocao_falecimento
                        ? new Date(cat.data_adocao_falecimento).getFullYear()
                        : 2025}
                    </p>
                  </div>
                </div>

                {/* Mobile List View */}
                <div
                  onClick={() => setSelectedCat(cat)}
                  className="sm:hidden cursor-pointer transition-all duration-200 active:scale-95"
                  style={{
                    background: "hsl(0 0% 100%)",
                    borderRadius: "1rem",
                    padding: "0.75rem",
                    border: "2px solid hsl(13 95% 54%)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden"
                      style={{ background: "hsl(0 0% 85%)" }}
                    >
                      {cat.fotos?.[0] ? (
                        <img
                          src={cat.fotos[0]}
                          alt={cat.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-3xl">🐱</span>
                        </div>
                      )}
                    </div>

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
                        Encontrou um lar em{" "}
                        {new Date(cat.data_adocao_falecimento).getFullYear()}
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
            border: "4px solid hsl(13 95% 54%)",
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
                <div
                  className={`grid gap-4 justify-items-center ${
                    // prefer responsive columns: 1 on very small, then depending on count
                    !selectedCat.fotos || selectedCat.fotos.length === 0
                      ? "grid-cols-1"
                      : selectedCat.fotos.length === 1
                      ? "grid-cols-1"
                      : selectedCat.fotos.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-3 md:grid-cols-3"
                  }`}
                >
                  {/* If no photos, show a subtle placeholder */}
                  {(!selectedCat.fotos || selectedCat.fotos.length === 0) && (
                    <div className="w-full max-w-md p-8 bg-muted/50 rounded-2xl text-center">
                      <p className="text-sm text-muted-foreground">
                        Sem fotos disponíveis
                      </p>
                    </div>
                  )}

                  {selectedCat.fotos?.map((foto, index) => (
                    <img
                      key={index}
                      src={foto}
                      alt={`${selectedCat.nome} foto ${index + 1}`}
                      // width behavior:
                      // - object-cover fills the square area
                      // - max-w limits width for single-photo case
                      className="w-full aspect-square object-cover rounded-2xl max-w-64"
                    />
                  ))}
                </div>

                <div className="text-center py-4 space-y-2">
                  <p
                    className="font-semibold"
                    style={{ color: "hsl(283 72% 16%)" }}
                  >
                    Lar doce lar desde{" "}
                    {new Date(
                      selectedCat.data_adocao_falecimento
                    ).getFullYear()}
                    !
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "hsl(283 72% 16% / 0.7)" }}
                  >
                    {selectedCat.mensagem || "Obrigado por fazer a diferença!"}
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

export default Adotados;
