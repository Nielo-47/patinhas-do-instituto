import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  primary: "#FFCC00",
  accent: "#E93105",
  secondary: "#360D45",
  success: "#10B981",
  info: "#3B82F6",
};

interface CensoMensal {
  id: string;
  mes_ano: string;
  total_gatos: number;
  por_sexo: Record<string, number>;
  por_status: Record<string, number>;
  total_castrados: number;
  total_vacinados: number;
  criado_em: string;
}

const formatLabel = (str: string) => {
  if (!str) return "";
  return str
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const Graficos = () => {
  const [censos, setCensos] = useState<CensoMensal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCensos();
  }, []);

  const fetchCensos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("censo_mensal")
      .select("*")
      .order("mes_ano", { ascending: true });

    if (!error && data) setCensos(data);
    setLoading(false);
  };

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

  const ultimoCenso = censos[censos.length - 1];

  // Sexo - Dados atuais
  const sexoData = Object.entries(ultimoCenso.por_sexo || {})
    .map(([name, value]) => ({
      name: formatLabel(name),
      value,
      color:
        name === "macho"
          ? COLORS.accent
          : name === "femea"
          ? COLORS.primary
          : COLORS.secondary,
    }))
    .filter((d) => d.value > 0);

  // Sexo - Evolução temporal em %
  const sexoTimeline = censos.map((c) => {
    const total = c.total_gatos || 1;
    const result: any = {
      month: new Date(c.mes_ano).toLocaleDateString("pt-BR", {
        month: "short",
        year: "2-digit",
      }),
    };
    Object.entries(c.por_sexo || {}).forEach(([key, value]) => {
      result[formatLabel(key)] = ((value / total) * 100).toFixed(1);
    });
    return result;
  });

  // Status - Dados atuais
  const statusData = Object.entries(ultimoCenso.por_status || {})
    .map(([name, value]) => ({
      name: formatLabel(name),
      value,
      color:
        name === "no_campus"
          ? COLORS.success
          : name === "em_tratamento"
          ? COLORS.primary
          : name === "adotado"
          ? COLORS.accent
          : COLORS.secondary,
    }))
    .filter((d) => d.value > 0);

  // Status - Evolução temporal em %
  const statusTimeline = censos.map((c) => {
    const total = c.total_gatos || 1;
    const result: any = {
      month: new Date(c.mes_ano).toLocaleDateString("pt-BR", {
        month: "short",
        year: "2-digit",
      }),
    };
    Object.entries(c.por_status || {}).forEach(([key, value]) => {
      result[formatLabel(key)] = ((value / total) * 100).toFixed(1);
    });
    return result;
  });

  // Castrados - Dados atuais
  const healthDataCastrados = [
    {
      name: "Castrados",
      value: ultimoCenso.total_castrados,
      color: COLORS.success,
    },
    {
      name: "Não Castrados",
      value: ultimoCenso.total_gatos - ultimoCenso.total_castrados,
      color: COLORS.accent,
    },
  ];

  // Castrados - Evolução temporal em %
  const castradosTimeline = censos.map((c) => ({
    month: new Date(c.mes_ano).toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
    }),
    Castrados: ((c.total_castrados / (c.total_gatos || 1)) * 100).toFixed(1),
    "Não Castrados": (
      ((c.total_gatos - c.total_castrados) / (c.total_gatos || 1)) *
      100
    ).toFixed(1),
  }));

  // Vacinados - Dados atuais
  const healthDataVacinados = [
    {
      name: "Vacinados",
      value: ultimoCenso.total_vacinados,
      color: COLORS.success,
    },
    {
      name: "Não Vacinados",
      value: ultimoCenso.total_gatos - ultimoCenso.total_vacinados,
      color: COLORS.accent,
    },
  ];

  // Vacinados - Evolução temporal em %
  const vacinadosTimeline = censos.map((c) => ({
    month: new Date(c.mes_ano).toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
    }),
    Vacinados: ((c.total_vacinados / (c.total_gatos || 1)) * 100).toFixed(1),
    "Não Vacinados": (
      ((c.total_gatos - c.total_vacinados) / (c.total_gatos || 1)) *
      100
    ).toFixed(1),
  }));

  // Timeline total
  const timelineData = censos.map((c) => ({
    month: new Date(c.mes_ano).toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    }),
    total: c.total_gatos,
  }));

  return (
    <div className="min-h-screen gradient-purple-dark">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary text-center mb-8">
          Estatísticas dos Gatos
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Timeline */}
          <Card className="p-6 bg-secondary rounded-3xl border-4 border-accent md:col-span-2">
            <h2 className="text-2xl font-bold text-primary text-center mb-4">
              Gatos Cadastrados ao Longo do Tempo
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <XAxis dataKey="month" stroke="#FFCC00" />
                <YAxis stroke="#FFCC00" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          {/* Sexo */}
          <Card className="p-6 bg-secondary rounded-3xl border-4 border-accent">
            <h2 className="text-2xl font-bold text-primary text-center mb-4">
              Sexo
            </h2>
            <div className="flex flex-col lg:flex-row gap-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sexoData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.value}`}
                  >
                    {sexoData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={sexoTimeline}>
                  <XAxis
                    dataKey="month"
                    stroke="#FFCC00"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#FFCC00"
                    tick={{ fontSize: 10 }}
                    label={{
                      value: "%",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#FFCC00", fontSize: 12 },
                    }}
                  />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line
                    type="monotone"
                    dataKey="Macho"
                    stroke={COLORS.accent}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Fêmea"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Desconhecido"
                    stroke={COLORS.secondary}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Status */}
          <Card className="p-6 bg-secondary rounded-3xl border-4 border-accent">
            <h2 className="text-2xl font-bold text-primary text-center mb-4">
              Status
            </h2>
            <div className="flex flex-col lg:flex-row gap-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.value}`}
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={statusTimeline}>
                  <XAxis
                    dataKey="month"
                    stroke="#FFCC00"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#FFCC00"
                    tick={{ fontSize: 10 }}
                    label={{
                      value: "%",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#FFCC00", fontSize: 12 },
                    }}
                  />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line
                    type="monotone"
                    dataKey="No Campus"
                    stroke={COLORS.success}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Em Tratamento"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Adotado"
                    stroke={COLORS.accent}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Desconhecido"
                    stroke={COLORS.secondary}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Castrados */}
          <Card className="p-6 bg-secondary rounded-3xl border-4 border-accent">
            <h2 className="text-2xl font-bold text-primary text-center mb-4">
              Castrados
            </h2>
            <div className="flex flex-col lg:flex-row gap-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={healthDataCastrados}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.value}`}
                  >
                    {healthDataCastrados.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={castradosTimeline}>
                  <XAxis
                    dataKey="month"
                    stroke="#FFCC00"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#FFCC00"
                    tick={{ fontSize: 10 }}
                    label={{
                      value: "%",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#FFCC00", fontSize: 12 },
                    }}
                  />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line
                    type="monotone"
                    dataKey="Castrados"
                    stroke={COLORS.success}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Não Castrados"
                    stroke={COLORS.accent}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Vacinados */}
          <Card className="p-6 bg-secondary rounded-3xl border-4 border-accent">
            <h2 className="text-2xl font-bold text-primary text-center mb-4">
              Vacinados
            </h2>
            <div className="flex flex-col lg:flex-row gap-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={healthDataVacinados}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.value}`}
                  >
                    {healthDataVacinados.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={vacinadosTimeline}>
                  <XAxis
                    dataKey="month"
                    stroke="#FFCC00"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#FFCC00"
                    tick={{ fontSize: 10 }}
                    label={{
                      value: "%",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#FFCC00", fontSize: 12 },
                    }}
                  />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line
                    type="monotone"
                    dataKey="Vacinados"
                    stroke={COLORS.success}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Não Vacinados"
                    stroke={COLORS.accent}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Graficos;
