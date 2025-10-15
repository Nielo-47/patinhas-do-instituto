import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  ArrowLeft,
  TrendingUp,
  Heart,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Protetor, Atividade } from "@/lib/models";

const AtividadeProtetor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [protetor, setProtetor] = useState<Protetor | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProtetor();
      fetchAtividades();
    }
  }, [id]);

  const fetchProtetor = async () => {
    const { data, error } = await supabase
      .from("protetores")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setProtetor(data);
    }
  };

  const fetchAtividades = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("protetor_atividade_historico")
      .select("*")
      .eq("protetor_id", id)
      .order("data_referencia", { ascending: true });

    if (!error && data) {
      setAtividades(data);
    }
    setLoading(false);
  };

  const chartData = atividades.map((a) => ({
    mes: format(new Date(a.data_referencia), "MMM/yy", { locale: ptBR }),
    cadastrados: a.gatos_cadastrados_mes,
    editados: a.gatos_editados_mes,
  }));

  const totalCadastrados = atividades.reduce(
    (sum, a) => sum + a.gatos_cadastrados_mes,
    0
  );
  const totalEditados = atividades.reduce(
    (sum, a) => sum + a.gatos_editados_mes,
    0
  );

  if (!protetor) {
    return (
      <div className="min-h-screen gradient-purple-dark flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-purple-dark flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <Button
          variant="ghost"
          onClick={() => navigate("/protetores")}
          className="mb-6 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            📊 Atividade de: {protetor.nome}
          </h1>
        </div>

        {/* Perfil do Protetor */}
        <Card className="bg-primary rounded-3xl p-6 border-4 border-accent shadow-card mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-yellow-red flex items-center justify-center shadow-card">
              {protetor.foto_url ? (
                <img
                  src={protetor.foto_url}
                  alt={protetor.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">👤</span>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <h2 className="text-3xl font-bold text-secondary">
                {protetor.nome}
              </h2>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-secondary/80">
                  <Mail className="w-4 h-4" />
                  {protetor.email}
                </div>
                <div className="flex items-center gap-2 text-secondary/80">
                  <MapPin className="w-4 h-4" />
                  {protetor.campus}
                </div>
              </div>

              {protetor.forma_de_contato && (
                <div className="flex items-center gap-2 text-accent font-medium justify-center md:justify-start">
                  <Phone className="w-4 h-4" />
                  {protetor.forma_de_contato}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Cards de Totais */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-accent rounded-3xl p-6 border-4 border-accent shadow-card">
            <div className="flex items-center gap-4">
              <Heart className="w-12 h-12 text-accent-foreground" />
              <div>
                <p className="text-accent-foreground/70 text-sm font-medium">
                  Total de Gatos
                </p>
                <p className="text-4xl font-bold text-accent-foreground">
                  {totalCadastrados}
                </p>
                <p className="text-accent-foreground/70 text-xs">cadastrados</p>
              </div>
            </div>
          </Card>

          <Card className="bg-secondary rounded-3xl p-6 border-4 border-accent shadow-card">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-12 h-12 text-secondary-foreground" />
              <div>
                <p className="text-secondary-foreground/70 text-sm font-medium">
                  Total de Edições
                </p>
                <p className="text-4xl font-bold text-secondary-foreground">
                  {totalEditados}
                </p>
                <p className="text-secondary-foreground/70 text-xs">
                  realizadas
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Gráfico de Série Temporal */}
        <Card className="bg-primary rounded-3xl p-6 border-4 border-accent shadow-card">
          <h3 className="text-2xl font-bold text-secondary mb-6 text-center">
            Evolução Mensal da Atividade
          </h3>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 204, 0, 0.2)"
                />
                <XAxis
                  dataKey="mes"
                  stroke="hsl(var(--secondary))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="hsl(var(--secondary))"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "2px solid hsl(var(--accent))",
                    borderRadius: "12px",
                    color: "hsl(var(--secondary))",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cadastrados"
                  name="Gatos Cadastrados"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--accent))", r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="editados"
                  name="Gatos Editados"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--secondary))", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-secondary/70">
              <p className="text-lg">
                Ainda não há dados de atividade para este protetor.
              </p>
            </div>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default AtividadeProtetor;
