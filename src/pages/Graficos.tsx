import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase, CatStatus, CatSex } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";

interface Cat {
  sexo: CatSex;
  status: CatStatus;
  castrado: boolean;
  vacinado: boolean;
  created_at: string;
}

const COLORS = {
  primary: '#FFCC00',
  accent: '#E93105',
  secondary: '#360D45',
  success: '#10B981',
  info: '#3B82F6',
};

const Graficos = () => {
  const [cats, setCats] = useState<Cat[]>([]);
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
      .select('sexo, status, castrado, vacinado, created_at')
      .neq('status', 'falecido')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setCats(data);
    }
    setLoading(false);
  };

  // Sexo data
  const sexoData = [
    { name: 'Macho', value: cats.filter(c => c.sexo === 'macho').length, color: COLORS.accent },
    { name: 'Fêmea', value: cats.filter(c => c.sexo === 'femea').length, color: COLORS.primary },
    { name: 'Desconhecido', value: cats.filter(c => c.sexo === 'desconhecido').length, color: COLORS.secondary },
  ].filter(d => d.value > 0);

  // Status data (excluding deceased)
  const statusData = [
    { name: 'No campus', value: cats.filter(c => c.status === 'no_campus').length, color: COLORS.success },
    { name: 'Em tratamento', value: cats.filter(c => c.status === 'em_tratamento').length, color: COLORS.primary },
    { name: 'Adotado', value: cats.filter(c => c.status === 'adotado').length, color: COLORS.accent },
    { name: 'Desconhecido', value: cats.filter(c => c.status === 'desconhecido').length, color: COLORS.secondary },
  ].filter(d => d.value > 0);

  // Timeline data (cats added over time)
  const timelineData = cats.reduce((acc: any[], cat) => {
    const month = new Date(cat.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.total += 1;
    } else {
      acc.push({ month, total: 1 });
    }
    return acc;
  }, []);

  // Vaccination and neutering stats
  const healthData = [
    { name: 'Castrados', Sim: cats.filter(c => c.castrado).length, Não: cats.filter(c => !c.castrado).length },
    { name: 'Vacinados', Sim: cats.filter(c => c.vacinado).length, Não: cats.filter(c => !c.vacinado).length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen gradient-purple-dark">
        <Navbar />
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-purple-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary text-center mb-8">
          Estatísticas dos Gatos
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sexo Chart */}
          <Card className="p-6 bg-secondary rounded-3xl border-4 border-accent">
            <h2 className="text-2xl font-bold text-primary text-center mb-4">Sexo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sexoData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {sexoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Status Chart */}
          <Card className="p-6 bg-secondary rounded-3xl border-4 border-accent">
            <h2 className="text-2xl font-bold text-primary text-center mb-4">Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Health Stats */}
          <Card className="p-6 bg-secondary rounded-3xl border-4 border-accent">
            <h2 className="text-2xl font-bold text-primary text-center mb-4">Saúde</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={healthData}>
                <XAxis dataKey="name" stroke="#FFCC00" />
                <YAxis stroke="#FFCC00" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Sim" fill={COLORS.success} />
                <Bar dataKey="Não" fill={COLORS.accent} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Timeline */}
          <Card className="p-6 bg-secondary rounded-3xl border-4 border-accent">
            <h2 className="text-2xl font-bold text-primary text-center mb-4">
              Gatos Cadastrados ao Longo do Tempo
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <XAxis dataKey="month" stroke="#FFCC00" />
                <YAxis stroke="#FFCC00" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke={COLORS.primary} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card className="p-6 bg-primary rounded-3xl border-4 border-accent text-center">
            <p className="text-5xl font-bold text-secondary">{cats.length}</p>
            <p className="text-secondary/80 mt-2">Total de Gatos</p>
          </Card>
          <Card className="p-6 bg-primary rounded-3xl border-4 border-accent text-center">
            <p className="text-5xl font-bold text-secondary">
              {cats.filter(c => c.castrado).length}
            </p>
            <p className="text-secondary/80 mt-2">Castrados</p>
          </Card>
          <Card className="p-6 bg-primary rounded-3xl border-4 border-accent text-center">
            <p className="text-5xl font-bold text-secondary">
              {cats.filter(c => c.vacinado).length}
            </p>
            <p className="text-secondary/80 mt-2">Vacinados</p>
          </Card>
          <Card className="p-6 bg-primary rounded-3xl border-4 border-accent text-center">
            <p className="text-5xl font-bold text-secondary">
              {cats.filter(c => c.status === 'no_campus').length}
            </p>
            <p className="text-secondary/80 mt-2">No Campus</p>
          </Card>
        </div>
      </main>

      <Footer variant="inverted" />
    </div>
  );
};

export default Graficos;
