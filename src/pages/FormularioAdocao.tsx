import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export default function FormularioAdocao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_candidato: "",
    contato_candidato: "",
    termo_aceito: false,
  });

  const { data: gato } = useQuery({
    queryKey: ["gato", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gatos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termo_aceito) {
      toast({
        title: "Termo não aceito",
        description: "Você precisa aceitar os termos de adoção responsável.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Inserir pedido de adoção
      const { error: insertError } = await supabase
        .from("pedidos_adocao")
        .insert({
          id: id,
          nome_candidato: formData.nome_candidato,
          contato_candidato: formData.contato_candidato,
          termo_compromisso_aceito: formData.termo_aceito,
        });

      if (insertError) throw insertError;

      // Enviar email de notificação
      await supabase.functions.invoke("notificar-adocao", {
        body: {
          id: id,
          nome_gato: gato?.nome || "Gato",
          nome_candidato: formData.nome_candidato,
          contato_candidato: formData.contato_candidato,
        },
      });

      toast({
        title: "Pedido enviado com sucesso!",
        description: "Em breve entraremos em contato com você.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Erro ao enviar pedido:", error);
      toast({
        title: "Erro ao enviar pedido",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="max-w-2xl mx-auto bg-card rounded-3xl border-4 border-accent p-8 shadow-card">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Pedido de Adoção
          </h1>
          {gato && (
            <p className="text-lg text-muted-foreground mb-6">
              Você está se candidatando para adotar <strong>{gato.nome}</strong>
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                type="text"
                required
                value={formData.nome_candidato}
                onChange={(e) =>
                  setFormData({ ...formData, nome_candidato: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="contato">Email ou Telefone *</Label>
              <Input
                id="contato"
                type="text"
                required
                value={formData.contato_candidato}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contato_candidato: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>

            <div className="bg-muted p-4 rounded-xl">
              <h3 className="font-bold text-lg mb-3">
                Termo de Adoção Responsável
              </h3>
              <p className="text-sm mb-2">Ao adotar, eu me comprometo a:</p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>
                  Prover um ambiente seguro, com telas de proteção em janelas e
                  varandas.
                </li>
                <li>
                  Garantir alimentação de qualidade, água fresca e cuidados
                  veterinários sempre que necessário.
                </li>
                <li>
                  Não abandonar o animal em nenhuma circunstância, tratando-o
                  como um membro da família por toda a sua vida.
                </li>
                <li>Manter as vacinas e a vermifugação em dia.</li>
              </ul>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="termo"
                checked={formData.termo_aceito}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, termo_aceito: checked as boolean })
                }
              />
              <label
                htmlFor="termo"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Li e aceito os termos de compromisso e responsabilidade com o
                animal. *
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !formData.termo_aceito}
            >
              {loading ? "Enviando..." : "Enviar Pedido de Adoção"}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
