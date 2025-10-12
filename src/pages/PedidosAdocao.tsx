import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function PedidosAdocao() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: pedidos, refetch } = useQuery({
    queryKey: ["pedidos_adocao"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pedidos_adocao")
        .select(`
          *,
          gatos (
            nome,
            fotos
          )
        `)
        .order("data_pedido", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleStatusChange = async (pedidoId: string, novoStatus: string) => {
    try {
      const { error } = await supabase
        .from("pedidos_adocao")
        .update({ status: novoStatus })
        .eq("id", pedidoId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "O status do pedido foi atualizado com sucesso.",
      });

      refetch();
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-secondary mb-8">
          Pedidos de Adoção
        </h1>

        <div className="bg-card rounded-3xl border-4 border-accent p-6 shadow-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Gato</TableHead>
                <TableHead>Candidato</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Termo Aceito</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos?.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell>
                    {new Date(pedido.data_pedido).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{pedido.gatos?.nome || "N/A"}</TableCell>
                  <TableCell>{pedido.nome_candidato}</TableCell>
                  <TableCell>{pedido.contato_candidato}</TableCell>
                  <TableCell>
                    {pedido.termo_compromisso_aceito ? (
                      <Badge variant="default">Sim</Badge>
                    ) : (
                      <Badge variant="destructive">Não</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pedido.status === "Aprovado"
                          ? "default"
                          : pedido.status === "Rejeitado"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {pedido.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={pedido.status}
                      onValueChange={(value) =>
                        handleStatusChange(pedido.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Aprovado">Aprovado</SelectItem>
                        <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!pedidos || pedidos.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhum pedido de adoção encontrado.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
