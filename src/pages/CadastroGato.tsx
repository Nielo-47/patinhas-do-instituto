import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase, uploadCatPhoto, CatStatus, CatSex } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Upload, X, Cat, Award, Star } from "lucide-react";

const CadastroGato = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user, isProtetor } = useAuth();

  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (!isProtetor) {
      navigate("/auth");
      return;
    }

    if (isEditing) {
      fetchCat();
    }
  }, [isProtetor, isEditing, id]);

  const fetchCat = async () => {
    if (!id) return;
    
    const { data, error } = await supabase
      .from('gatos')
      .select('*')
      .eq('id', id)
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
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const tempId = id || 'temp-' + Date.now();
    const { data, error } = await uploadCatPhoto(file, tempId);

    if (error) {
      toast.error("Erro ao fazer upload da foto");
    } else if (data) {
      setFotos([...fotos, data]);
      toast.success("Foto adicionada!");
    }
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const catData = {
        nome,
        sexo,
        status,
        castrado: castrado === "true",
        vacinado: vacinado === "true",
        data_ultima_vacinacao: dataVacinacao || null,
        local_encontrado: localEncontrado || null,
        caracteristicas: caracteristicas || null,
        fotos: fotos.length > 0 ? fotos : null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('gatos')
          .update(catData)
          .eq('id', id);

        if (error) throw error;
        toast.success("Gato atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from('gatos')
          .insert([catData]);

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
              Preencha as informações com carinho para manter nosso censo atualizado!
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
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as CatStatus)}>
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
                <Select value={sexo} onValueChange={(value) => setSexo(value as CatSex)}>
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
                <Select value={castrado} onValueChange={setCastrado}>
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
                <Select value={vacinado} onValueChange={setVacinado}>
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
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="localEncontrado">Local onde costuma ser encontrado</Label>
                <Input
                  id="localEncontrado"
                  value={localEncontrado}
                  onChange={(e) => setLocalEncontrado(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="caracteristicas">Características marcantes</Label>
                <Textarea
                  id="caracteristicas"
                  value={caracteristicas}
                  onChange={(e) => setCaracteristicas(e.target.value)}
                  className="rounded-xl"
                  rows={3}
                />
              </div>
            </div>

            {/* Photos */}
            <div>
              <Label>Fotos</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {fotos.map((foto, index) => (
                  <div key={index} className="relative">
                    <img
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <label className="w-32 h-32 border-2 border-dashed border-accent rounded-xl flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  ) : (
                    <Upload className="w-8 h-8 text-accent" />
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-4">
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
                    <Award className="w-5 h-5" />
                    {isEditing ? "💾 Atualizar Informações" : "✨ Cadastrar Gatinho"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate("/censo")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CadastroGato;
