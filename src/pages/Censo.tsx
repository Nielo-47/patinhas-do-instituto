import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CatCard } from "@/components/CatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase, CatStatus } from "@/lib/supabase";
import { Loader2, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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

const statusOptions: { value: CatStatus; label: string }[] = [
  { value: 'no_campus', label: 'No Campus' },
  { value: 'em_tratamento', label: 'Em Tratamento' },
  { value: 'adotado', label: 'Adotado' },
  { value: 'falecido', label: 'Falecido' },
  { value: 'desconhecido', label: 'Desconhecido' },
];

const Censo = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [filteredCats, setFilteredCats] = useState<Cat[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<CatStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isProtetor } = useAuth();

  useEffect(() => {
    if (!isProtetor) {
      navigate("/auth");
    } else {
      fetchCats();
    }
  }, [isProtetor, navigate]);

  const fetchCats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gatos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCats(data);
      setFilteredCats(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    let filtered = cats;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(cat => cat.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(cat =>
        cat.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCats(filtered);
  }, [selectedStatus, searchTerm, cats]);

  return (
    <div className="min-h-screen gradient-purple-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 flex-wrap justify-center">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'accent'}
              onClick={() => setSelectedStatus('all')}
            >
              Todos
            </Button>
            {statusOptions.map(option => (
              <Button
                key={option.value}
                variant={selectedStatus === option.value ? 'default' : 'accent'}
                onClick={() => setSelectedStatus(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full"
              />
            </div>
            <Button onClick={() => navigate("/cadastro-gato")} className="gap-2">
              <Plus className="w-4 h-4" />
              Cadastrar
            </Button>
          </div>
        </div>

        <p className="text-center text-primary mb-6 text-lg font-bold">
          Mostrando {filteredCats.length} de {cats.length} gatos
        </p>

        {/* Cats Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredCats.map((cat) => (
              <CatCard
                key={cat.id}
                id={cat.id}
                nome={cat.nome}
                foto={cat.fotos?.[0]}
                castrado={cat.castrado}
                vacinado={cat.vacinado}
                onClick={() => setSelectedCat(cat)}
              />
            ))}
          </div>
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
                    <p className="font-bold text-secondary mb-1">Local:</p>
                    <p className="text-muted-foreground">{selectedCat.local_encontrado}</p>
                  </div>
                )}

                <Button
                  variant="accent"
                  className="w-full"
                  onClick={() => navigate(`/editar-gato/${selectedCat.id}`)}
                >
                  Editar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Censo;
