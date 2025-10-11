import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserCircle, Award, Heart, TrendingUp, Calendar, Mail, MapPin } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

interface ProtetorProfileModalProps {
  protetor: Protetor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AtividadeHistorico {
  data_referencia: string;
  gatos_cadastrados_mes: number;
  gatos_editados_mes: number;
}

export const ProtetorProfileModal = ({ protetor, open, onOpenChange }: ProtetorProfileModalProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (protetor) {
      fetchAtividade();
    }
  }, [protetor]);

  const fetchAtividade = async () => {
    if (!protetor) return;

    const { data } = await supabase
      .from('protetor_atividade_historico')
      .select('*')
      .eq('protetor_id', protetor.id)
      .order('data_referencia', { ascending: true });

    if (data) {
      const formattedData = data.map((item: AtividadeHistorico) => ({
        mes: new Date(item.data_referencia).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        cadastros: item.gatos_cadastrados_mes,
        edicoes: item.gatos_editados_mes
      }));
      setChartData(formattedData);
    }
  };

  if (!protetor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-primary border-4 border-accent rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-secondary text-center">
            Perfil do Protetor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with photo */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-yellow-red flex items-center justify-center shadow-card">
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
            <h2 className="text-2xl font-bold text-secondary">{protetor.nome}</h2>
          </div>

          {/* Info cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-4 flex items-center gap-3">
              <Mail className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-bold text-secondary">{protetor.email}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Campus</p>
                <p className="font-bold text-secondary">{protetor.campus}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Membro desde</p>
                <p className="font-bold text-secondary">
                  {new Date(protetor.data_cadastro).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 flex items-center gap-3">
              <Heart className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Gatos cadastrados</p>
                <p className="font-bold text-secondary">{protetor.gatos_cadastrados}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <div className="flex-1 bg-accent rounded-xl px-4 py-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent-foreground" />
              <div>
                <p className="text-2xl font-bold text-accent-foreground">
                  {protetor.gatos_cadastrados}
                </p>
                <p className="text-sm text-accent-foreground/80">cadastrados</p>
              </div>
            </div>
            <div className="flex-1 bg-secondary rounded-xl px-4 py-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary-foreground" />
              <div>
                <p className="text-2xl font-bold text-secondary-foreground">
                  {protetor.gatos_editados}
                </p>
                <p className="text-sm text-secondary-foreground/80">editados</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="bg-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-secondary mb-4">
                📊 Atividade ao Longo do Tempo
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cadastros"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    name="Cadastros"
                  />
                  <Line
                    type="monotone"
                    dataKey="edicoes"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    name="Edições"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
