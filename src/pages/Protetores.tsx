import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Search, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Protetor {
  id: string;
  nome: string;
  email: string;
  campus: string;
  data_cadastro: string;
  gatos_cadastrados: number;
  gatos_editados: number;
  foto_url: string | null;
}

const Protetores = () => {
  const [protetores, setProtetores] = useState<Protetor[]>([]);
  const [filteredProtetores, setFilteredProtetores] = useState<Protetor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isProtetor } = useAuth();

  useEffect(() => {
    if (!isProtetor) {
      navigate("/auth");
    } else {
      fetchProtetores();
    }
  }, [isProtetor, navigate]);

  const fetchProtetores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('protetores')
      .select('*')
      .order('data_cadastro', { ascending: false });

    if (!error && data) {
      setProtetores(data);
      setFilteredProtetores(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = protetores.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.campus.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProtetores(filtered);
    } else {
      setFilteredProtetores(protetores);
    }
  }, [searchTerm, protetores]);

  return (
    <div className="min-h-screen gradient-purple-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">
            Mostrando {filteredProtetores.length} protetores
          </h1>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProtetores.map((protetor) => (
              <Card
                key={protetor.id}
                className="flex items-center gap-6 p-6 bg-accent rounded-3xl border-4 border-accent"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-primary flex items-center justify-center flex-shrink-0">
                  {protetor.foto_url ? (
                    <img
                      src={protetor.foto_url}
                      alt={protetor.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-16 h-16 text-secondary" />
                  )}
                </div>

                <div className="flex-1 bg-primary rounded-2xl p-4">
                  <h2 className="text-2xl font-bold text-secondary mb-2">
                    {protetor.nome}
                  </h2>

                  <div className="grid md:grid-cols-2 gap-2 text-sm text-secondary/80">
                    <div>
                      <span className="font-bold">Data de cadastro:</span>{" "}
                      {new Date(protetor.data_cadastro).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <span className="font-bold">Campus:</span> {protetor.campus}
                    </div>
                    <div>
                      <span className="font-bold">Email:</span> {protetor.email}
                    </div>
                    <div className="md:col-span-2 flex gap-6">
                      <div>
                        <span className="font-bold">Gatos cadastrados:</span> {protetor.gatos_cadastrados}
                      </div>
                      <div>
                        <span className="font-bold">Gatos editados:</span> {protetor.gatos_editados}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="accent" size="sm">
                    Editar protetor
                  </Button>
                  <Button variant="secondary" size="sm">
                    Ver atividade
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Protetores;
