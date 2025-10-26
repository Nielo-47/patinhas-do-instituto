import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog } from "@/components/ui/dialog";
import { supabase, uploadCatPhoto } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Upload, X, Cat, Award, Star, Trash2 } from "lucide-react";
import { CatSex, CatStatus } from "@/lib/models";
import { compressImage, isImageFile, isFileSizeValid } from "@/lib/utils";

const CadastroGato = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user, isProtetor, isProtetorAdmin } = useAuth();

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [nome, setNome] = useState("");
  const [sexo, setSexo] = useState<CatSex>("desconhecido");
  const [status, setStatus] = useState<CatStatus>("no_campus");
  const [castrado, setCastrado] = useState<string>("false");
  const [vacinado, setVacinado] = useState<string>("false");
  const [dataVacinacao, setDataVacinacao] = useState("");
  const [localEncontrado, setLocalEncontrado] = useState("");
  const [caracteristicas, setCaracteristicas] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);

  // Novos campos
  const [dataAdocaoFalecimento, setDataAdocaoFalecimento] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (isEditing) {
      fetchCat();
    }
  }, [isEditing, id]);

  const fetchCat = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("gatos")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setNome(data.nome);
      setSexo(data.sexo);
      setStatus(data.status);
      setCastrado(data.castrado.toString());
      setVacinado(data.vacinado.toString());
      setDataVacinacao(data.data_ultima_vacinacao || "");
      setLocalEncontrado(data.local_encontrado || "");
      setCaracteristicas(data.caracteristicas || "");
      setFotos(data.fotos || []);

      if (data.data_adocao_falecimento) {
        const dateStr =
          typeof data.data_adocao_falecimento === "string"
            ? data.data_adocao_falecimento.split("T")[0]
            : null;
        if (dateStr) setDataAdocaoFalecimento(dateStr);
      } else {
        setDataAdocaoFalecimento("");
      }

      setMensagem(data.mensagem || "");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validações
    if (fotos.length >= 5) {
      toast.error("Limite de 5 fotos por gato atingido");
      return;
    }

    if (!isImageFile(file)) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    if (!isFileSizeValid(file, 10)) {
      toast.error("Arquivo muito grande. Tamanho máximo: 10MB");
      return;
    }

    setUploading(true);

    try {
      // Mostrar toast de progresso
      toast.loading("Otimizando imagem...", { id: "compress" });

      // Comprimir imagem
      const compressedFile = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
        outputFormat: "webp",
      });

      toast.success("Imagem otimizada!", { id: "compress" });
      toast.loading("Fazendo upload...", { id: "upload" });

      // Upload da imagem comprimida
      const tempId = id || "temp-" + Date.now();
      const { data, error } = await uploadCatPhoto(compressedFile, tempId);

      if (error) {
        toast.error("Erro ao fazer upload da foto", { id: "upload" });
        console.error(error);
      } else if (data) {
        setFotos([...fotos, data]);
        toast.success("Foto adicionada com sucesso!", { id: "upload" });
      }
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      toast.error("Erro ao processar imagem");
    } finally {
      setUploading(false);
    }

    // Limpar input para permitir upload da mesma imagem novamente se necessário
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  const handleDelete = async () => {
    if (!id || !isProtetorAdmin) return;

    setDeleting(true);

    try {
      const { error } = await supabase.from("gatos").delete().eq("id", id);

      if (error) throw error;

      toast.success("Gato excluído com sucesso!");
      navigate("/censo");
    } catch (error) {
      toast.error("Erro ao excluir gato");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isProtetor) {
      toast.error("Você precisa estar logado para cadastrar/editar gatos");
      return;
    }

    const requiresDate = status === "adotado" || status === "falecido";
    if (requiresDate && !dataAdocaoFalecimento) {
      toast.error(
        "Por favor, preencha a data de adoção/falecimento para o status selecionado."
      );
      return;
    }

    setLoading(true);

    try {
      const catData: any = {
        nome,
        sexo,
        status,
        castrado: castrado === "true",
        vacinado: vacinado === "true",
        data_ultima_vacinacao: dataVacinacao || null,
        local_encontrado: localEncontrado || null,
        caracteristicas: caracteristicas || null,
        fotos: fotos.length > 0 ? fotos : null,
        data_adocao_falecimento:
          requiresDate && dataAdocaoFalecimento ? dataAdocaoFalecimento : null,
        mensagem: mensagem ? mensagem : null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("gatos")
          .update(catData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Gato atualizado com sucesso!");
      } else {
        const { error } = await supabase.from("gatos").insert([catData]);

        if (error) throw error;
        toast.success("Gato cadastrado com sucesso!");
      }

      navigate("/censo");
    } catch (error) {
      toast.error("Erro ao salvar gato");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-purple-dark">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-primary rounded-3xl p-8 border-4 border-accent shadow-card animate-scale-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-accent/10 rounded-full px-6 py-3 mb-4 animate-bounce-subtle">
              <Cat className="w-6 h-6 text-accent" />
              <span className="font-bold text-accent">
                {isEditing ? "Modo Edição" : "Novo Cadastro"}
              </span>
              <Star className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
              {isEditing ? "✏️ Editar Gatinho" : "🎉 Cadastrar Novo Gatinho"}
            </h1>
            <p className="text-secondary/70">
              Preencha as informações com carinho para manter nosso censo
              atualizado!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="rounded-xl"
                  readOnly={!isProtetor}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as CatStatus)}
                  disabled={!isProtetor}
                >
                  <SelectTrigger className="rounded-xl">
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

              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <Select
                  value={sexo}
                  onValueChange={(value) => setSexo(value as CatSex)}
                  disabled={!isProtetor}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="macho">Macho</SelectItem>
                    <SelectItem value="femea">Fêmea</SelectItem>
                    <SelectItem value="desconhecido">Desconhecido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="castrado">Castrado</Label>
                <Select
                  value={castrado}
                  onValueChange={setCastrado}
                  disabled={!isProtetor}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sim</SelectItem>
                    <SelectItem value="false">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vacinado">Vacinado</Label>
                <Select
                  value={vacinado}
                  onValueChange={setVacinado}
                  disabled={!isProtetor}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sim</SelectItem>
                    <SelectItem value="false">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dataVacinacao">Data da última vacinação</Label>
                <Input
                  id="dataVacinacao"
                  type="date"
                  value={dataVacinacao}
                  onChange={(e) => setDataVacinacao(e.target.value)}
                  className="rounded-xl"
                  readOnly={!isProtetor}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="localEncontrado">
                  Local onde costuma ser encontrado
                </Label>
                <Input
                  id="localEncontrado"
                  value={localEncontrado}
                  onChange={(e) => setLocalEncontrado(e.target.value)}
                  className="rounded-xl"
                  readOnly={!isProtetor}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="caracteristicas">
                  Características marcantes
                </Label>
                <Textarea
                  id="caracteristicas"
                  value={caracteristicas}
                  onChange={(e) => setCaracteristicas(e.target.value)}
                  className="rounded-xl"
                  rows={3}
                  readOnly={!isProtetor}
                />
              </div>

              {(status === "adotado" || status === "falecido") && (
                <>
                  <div>
                    <Label htmlFor="dataAdocaoFalecimento">
                      Data de {status === "adotado" ? "adoção" : "falecimento"}{" "}
                      <span className="text-accent">*</span>
                    </Label>
                    <Input
                      id="dataAdocaoFalecimento"
                      type="date"
                      value={dataAdocaoFalecimento}
                      onChange={(e) => setDataAdocaoFalecimento(e.target.value)}
                      className="rounded-xl"
                      disabled={!isProtetor}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="mensagem">
                      Mensagem{" "}
                      {status === "falecido" ? "póstuma" : "comemorativa"}{" "}
                      (opcional)
                    </Label>
                    <Textarea
                      id="mensagem"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      className="rounded-xl"
                      rows={3}
                      readOnly={!isProtetor}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Photos */}
            <div>
              <Label>Fotos</Label>
              <p className="text-sm text-muted-foreground mb-2">
                As imagens serão automaticamente otimizadas para melhor
                desempenho
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                {fotos.map((foto, index) => (
                  <div key={index} className="relative">
                    <img
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-xl"
                    />
                    {isProtetor && (
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full p-1 hover:bg-accent/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {isProtetor && fotos.length < 5 && (
                  <label className="w-32 h-32 border-2 border-dashed border-accent rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin text-accent mb-2" />
                        <span className="text-xs text-accent">
                          Processando...
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-accent mb-2" />
                        <span className="text-xs text-accent text-center px-2">
                          Adicionar foto
                        </span>
                      </>
                    )}
                  </label>
                )}
              </div>
              {fotos.length >= 5 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Limite de 5 fotos atingido
                </p>
              )}
            </div>

            <div className="flex gap-4">
              {isProtetor && (
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      {isEditing
                        ? "💾 Atualizar Informações"
                        : "✨ Cadastrar Gatinho"}
                    </>
                  )}
                </Button>
              )}

              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate("/censo")}
                className={!isProtetor ? "flex-1" : ""}
              >
                {isProtetor ? "Cancelar" : "Voltar"}
              </Button>

              {/* Botão de Excluir - Apenas Admin e apenas em modo edição */}
              {isEditing && isProtetorAdmin && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size="lg"
                      disabled={deleting}
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Excluindo...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o gato{" "}
                        <strong>{nome}</strong>? Esta ação não pode ser desfeita
                        e todos os dados serão permanentemente removidos do
                        sistema.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Sim, excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CadastroGato;
