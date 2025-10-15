import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Definindo o tipo para um pedido para melhor type safety
interface Pedido {
  id: string;
  data_pedido: string;
  nome_candidato: string;
  contato_candidato: string;
  status: "Pendente" | "Aprovado" | "Rejeitado";
  gatos: {
    id: string;
    nome: string | null;
    fotos: string[] | null;
  } | null;
}

export default function PedidosAdocao() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [pedidoParaAprovar, setPedidoParaAprovar] = useState<Pedido | null>(
    null
  );
  const [mensagemComemorativa, setMensagemComemorativa] = useState("");

  // Novos estados para o fluxo de reassignment de status do gato
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [reassignPedido, setReassignPedido] = useState<{
    pedido: Pedido;
    novoPedidoStatus: string;
  } | null>(null);
  const [novoStatusGato, setNovoStatusGato] = useState<string>("no_campus");
  const [reassignLoading, setReassignLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: pedidos } = useQuery({
    queryKey: ["pedidos_adocao"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pedidos_adocao")
        .select(
          `
          id, data_pedido, nome_candidato, contato_candidato, status,
          gatos ( id, nome, fotos )
        `
        )
        .order("data_pedido", { ascending: false });

      if (error) throw error;
      // Cast status to the correct union type
      return data?.map((pedido: any) => ({
        ...pedido,
        status: pedido.status as "Pendente" | "Aprovado" | "Rejeitado",
      })) as Pedido[];
    },
    enabled: !!user,
  });

  const updatePedidoStatus = useMutation({
    mutationFn: async ({
      pedidoId,
      novoStatus,
    }: {
      pedidoId: string;
      novoStatus: string;
    }) => {
      const { error } = await supabase
        .from("pedidos_adocao")
        .update({ status: novoStatus })
        .eq("id", pedidoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos_adocao"] });
      toast({ title: "Status do pedido atualizado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar status do pedido",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const approveAdoptionMutation = useMutation({
    mutationFn: async ({
      pedido,
      mensagem,
    }: {
      pedido: Pedido;
      mensagem: string;
    }) => {
      // 1. Atualizar status do gato e data de adoção
      const { error: gatoError } = await supabase
        .from("gatos")
        .update({
          status: "adotado",
          data_adocao_falecimento: new Date().toISOString(),
          mensagem: mensagem, // Adiciona a mensagem comemorativa
        })
        .eq("id", pedido.gatos!.id);

      if (gatoError)
        throw new Error(`Erro ao atualizar gato: ${gatoError.message}`);

      // 2. Atualizar status do pedido
      const { error: pedidoError } = await supabase
        .from("pedidos_adocao")
        .update({ status: "Aprovado" })
        .eq("id", pedido.id);

      if (pedidoError)
        throw new Error(`Erro ao atualizar pedido: ${pedidoError.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos_adocao"] });
      toast({ title: "Adoção aprovada e registrada com sucesso!" });
      setPedidoParaAprovar(null);
      setMensagemComemorativa("");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao aprovar adoção",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Função que fará o update do gato quando for necessário reassignment
  const updateGatoStatus = async (
    gatoId: string,
    statusToSet: string
  ): Promise<void> => {
    // Se estiver setando algo diferente de 'adotado', limpar data_adocao_falecimento
    const updatePayload: any =
      statusToSet === "adotado"
        ? {
            status: statusToSet,
            data_adocao_falecimento: new Date().toISOString(),
          }
        : { status: statusToSet, data_adocao_falecimento: null };

    const { error } = await supabase
      .from("gatos")
      .update(updatePayload)
      .eq("id", gatoId);

    if (error) throw error;
  };

  const handleStatusChange = async (pedido: Pedido, novoStatus: string) => {
    // nada a fazer se não mudou
    if (novoStatus === pedido.status) return;

    // 1) Se o novo status do pedido é "Aprovado", preservamos o fluxo original:
    //    abrir o modal que coleta mensagem comemorativa e confirma a aprovação.
    if (novoStatus === "Aprovado") {
      setPedidoParaAprovar(pedido);
      return;
    }

    // 2) Se não é aprovação, e o pedido não tem gato associado, apenas atualize o pedido.
    if (!pedido.gatos || !pedido.gatos.id) {
      updatePedidoStatus.mutate({ pedidoId: pedido.id, novoStatus });
      return;
    }

    try {
      // 3) Buscar status atual do gato para decidir se precisamos reassign
      const { data: gatoRow, error: gatoError } = await supabase
        .from("gatos")
        .select("status")
        .eq("id", pedido.gatos.id)
        .single();

      if (gatoError) throw gatoError;

      const gatoStatusAtual: string = gatoRow?.status;

      // 4) Se o gato já está 'adotado' e estamos mudando o pedido para algo diferente de "Aprovado"
      //    (já tratamos "Aprovado" acima), perguntamos ao usuário qual novo status aplicar ao gato.
      if (gatoStatusAtual === "adotado") {
        setReassignPedido({ pedido, novoPedidoStatus: novoStatus });
        setNovoStatusGato("no_campus"); // valor default no select do dialog
        setReassignDialogOpen(true);
        return;
      }

      // 5) Caso padrão: apenas atualize o pedido
      updatePedidoStatus.mutate({ pedidoId: pedido.id, novoStatus });
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Erro ao verificar status do gato",
        variant: "destructive",
      });
    }
  };

  // Confirmar o reassign: atualiza o gato e depois o pedido
  const handleConfirmReassign = async () => {
    if (!reassignPedido) return;
    const { pedido, novoPedidoStatus } = reassignPedido;

    if (!pedido.gatos?.id) {
      toast({ title: "Gato não encontrado" });
      setReassignDialogOpen(false);
      setReassignPedido(null);
      return;
    }

    setReassignLoading(true);

    try {
      // 1) atualizar o gato com o novo status escolhido pelo usuário
      await updateGatoStatus(pedido.gatos.id, novoStatusGato);

      // 2) atualizar o pedido com o status desejado
      await supabase
        .from("pedidos_adocao")
        .update({ status: novoPedidoStatus })
        .eq("id", pedido.id);

      // sucesso
      queryClient.invalidateQueries({ queryKey: ["pedidos_adocao"] });
      toast({ title: "Status do gato e do pedido atualizados com sucesso!" });
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar",
        description: err.message || "Erro ao atualizar gato/pedido",
        variant: "destructive",
      });
    } finally {
      setReassignLoading(false);
      setReassignDialogOpen(false);
      setReassignPedido(null);
    }
  };

  const handleCancelReassign = () => {
    setReassignDialogOpen(false);
    setReassignPedido(null);
  };

  const handleConfirmarAprovacao = () => {
    if (pedidoParaAprovar) {
      approveAdoptionMutation.mutate({
        pedido: pedidoParaAprovar,
        mensagem: mensagemComemorativa,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800 border-green-300";
      case "Rejeitado":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  if (!user) return null;

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
                <TableHead className="text-center">Gerenciar Status</TableHead>
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
                  <TableCell className="text-center">
                    <Select
                      value={pedido.status}
                      onValueChange={(value) =>
                        handleStatusChange(pedido, value)
                      }
                    >
                      <SelectTrigger
                        className={`w-36 mx-auto ${getStatusColor(
                          pedido.status
                        )}`}
                      >
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

          {!pedidos ||
            (pedidos.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhum pedido de adoção encontrado.
              </p>
            ))}
        </div>
      </main>

      {/* Modal de Confirmação de Adoção */}
      <Dialog
        open={!!pedidoParaAprovar}
        onOpenChange={() => setPedidoParaAprovar(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirmar Adoção de {pedidoParaAprovar?.gatos?.nome}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p>
              Ao aprovar, o status do gato será alterado para "Adotado" e a data
              de hoje será registrada.
            </p>
            <Textarea
              placeholder="Escreva uma mensagem comemorativa (opcional)"
              value={mensagemComemorativa}
              onChange={(e) => setMensagemComemorativa(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPedidoParaAprovar(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarAprovacao}
              disabled={approveAdoptionMutation.isPending}
            >
              {approveAdoptionMutation.isPending
                ? "Salvando..."
                : "Confirmar Aprovação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para reassignment de status do gato quando ele já está adotado */}
      <Dialog open={reassignDialogOpen} onOpenChange={handleCancelReassign}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Gato já está marcado como "Adotado" — qual é o novo status?
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <p>
              O gato vinculado a este pedido está com status{" "}
              <strong>adotado</strong>. Você está alterando o status do pedido;
              por favor escolha qual status deveremos aplicar ao gato agora.
            </p>

            <div>
              <label className="block mb-2 font-medium">
                Novo status do gato
              </label>
              <Select
                value={novoStatusGato}
                onValueChange={(v) => setNovoStatusGato(v)}
              >
                <SelectTrigger className="rounded-xl w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_campus">No Campus</SelectItem>
                  <SelectItem value="em_tratamento">Em Tratamento</SelectItem>
                  <SelectItem value="adotado">Adotado</SelectItem>
                  <SelectItem value="falecido">Falecido</SelectItem>
                  <SelectItem value="desconhecido">Desconhecido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              Observação: se você escolher um status diferente de "adotado", a
              data de adoção/falecimento será removida do registro do gato.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleCancelReassign}
              disabled={reassignLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmReassign} disabled={reassignLoading}>
              {reassignLoading ? "Atualizando..." : "Confirmar e Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
