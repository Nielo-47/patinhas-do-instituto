import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  Search,
  UserCircle,
  Heart,
  TrendingUp,
  Award,
  UserPlus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProtetorProfileModal } from "@/components/ProtetorProfileModal";
import { Protetor } from "@/lib/models";

const Protetores = () => {
  const [protetores, setProtetores] = useState<Protetor[]>([]);
  const [filteredProtetores, setFilteredProtetores] = useState<Protetor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProtetor, setSelectedProtetor] = useState<Protetor | null>(
    null
  );
  const navigate = useNavigate();
  const {
    user,
    loading: authLoading,
    isProtetor,
    protetorId,
    isProtetorAdmin,
  } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchProtetores();
  }, []);

  const fetchProtetores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("protetores")
      .select("*")
      .order("data_cadastro", { ascending: false });

    if (!error && data) {
      setProtetores(data);
      setFilteredProtetores(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = protetores.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.campus.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProtetores(filtered);
    } else {
      setFilteredProtetores(protetores);
    }
  }, [searchTerm, protetores]);

  if (authLoading) {
    return (
      <div className="min-h-screen gradient-purple-dark flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-purple-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-3 mb-4">
            <Heart className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-bold text-primary">Nossos Heróis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            💛 Equipe de Protetores
          </h1>
          <p className="text-primary/80 text-lg">
            Conheça as pessoas incríveis que cuidam das nossas patinhas
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="bg-primary rounded-2xl px-6 py-3 border-2 border-accent">
            <span className="text-2xl font-bold text-secondary">
              {filteredProtetores.length}
            </span>
            <span className="text-secondary/70 ml-2">protetores ativos</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {isProtetorAdmin && (
              <Button
                variant="accent"
                size="lg"
                className="gap-2 w-full md:w-auto"
                onClick={() => navigate("/cadastro-protetor")}
              >
                <UserPlus className="w-5 h-5" />
                Cadastrar Novo Protetor
              </Button>
            )}

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/50" />
              <Input
                placeholder="Buscar protetor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-xl border-2 border-accent bg-card text-secondary font-medium"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredProtetores.map((protetor, index) => (
              <Card
                key={protetor.id}
                className="bg-primary rounded-3xl p-6 border-4 border-accent shadow-card hover:shadow-vibrant transition-all hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-yellow-red flex items-center justify-center flex-shrink-0 shadow-card">
                      {protetor.foto_url ? (
                        <img
                          src={protetor.foto_url}
                          alt={protetor.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircle className="w-20 h-20 text-secondary" />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full p-2 shadow-card">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-secondary mb-3">
                      {protetor.nome}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-card rounded-xl p-3">
                        <span className="text-secondary/70">📅 Cadastro:</span>
                        <p className="font-bold text-secondary">
                          {new Date(protetor.data_cadastro).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      </div>
                      <div className="bg-card rounded-xl p-3">
                        <span className="text-secondary/70">🏫 Campus:</span>
                        <p className="font-bold text-secondary">
                          {protetor.campus}
                        </p>
                      </div>
                      <div className="bg-card rounded-xl p-3 md:col-span-2">
                        <span className="text-secondary/70">📧 Email:</span>
                        <p className="font-bold text-secondary">
                          {protetor.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                      <div className="bg-accent rounded-xl px-4 py-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-accent-foreground" />
                        <span className="font-bold text-accent-foreground">
                          {protetor.gatos_cadastrados} cadastrados
                        </span>
                      </div>
                      <div className="bg-secondary rounded-xl px-4 py-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-secondary-foreground" />
                        <span className="font-bold text-secondary-foreground">
                          {protetor.gatos_editados} editados
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-2"
                      onClick={() => setSelectedProtetor(protetor)}
                    >
                      📊 Ver Atividade
                    </Button>
                    {(isProtetorAdmin || protetorId === protetor.id) && (
                      <Button
                        variant="accent"
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                          navigate(`/protetores/${protetor.id}/editar`)
                        }
                      >
                        ✏️ Editar Protetor
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <ProtetorProfileModal
        protetor={selectedProtetor}
        open={!!selectedProtetor}
        onOpenChange={(open) => !open && setSelectedProtetor(null)}
      />

      <Footer />
    </div>
  );
};

export default Protetores;
