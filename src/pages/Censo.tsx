import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CatCard } from "@/components/CatCard";
import { CatDetailsModal } from "@/components/CatDetailsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    fetchCats();
  }, []);

  const fetchCats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gatos')
      .select('*')
      .neq('status', 'falecido')
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
            {isProtetor && (
              <Button 
                onClick={() => navigate("/cadastro-gato")} 
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Cadastrar
              </Button>
            )}
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

      <CatDetailsModal
        cat={selectedCat}
        isOpen={!!selectedCat}
        onClose={() => setSelectedCat(null)}
      />

      <Footer />
    </div>
  );
};

export default Censo;
