import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  Upload,
  X,
  UserCircle,
  Award,
  Star,
  Shield,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const EditarProtetor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, protetorId, loading: authLoading, isProtetorAdmin } = useAuth();

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false); // novo estado de exclusão
  const [uploading, setUploading] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [campus, setCampus] = useState("");
  const [formaContato, setFormaContato] = useState("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // novo estado

  useEffect(() => {
    checkAccess();
    fetchProtetor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const checkAccess = async () => {
    // Wait for auth to load
    if (authLoading) return;

    if (!user) {
      toast.error("Você precisa estar logado");
      navigate("/auth");
      return;
    }

    if (!isProtetorAdmin && protetorId !== id) {
      toast.error("Você não tem permissão para editar este protetor");
      navigate("/protetores");
    }
  };

  const fetchProtetor = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("protetores")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setNome(data.nome);
      setEmail(data.email);
      setCampus(data.campus);
      setFormaContato(data.forma_de_contato || "");
      setFotoUrl(data.foto_url);
      setIsAdmin(!!data.is_admin);
    } else if (error) {
      console.error("Erro ao buscar protetor:", error);
      toast.error("Erro ao carregar dados do protetor");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("protetor-photos")
      .upload(fileName, file);

    if (uploadError) {
      toast.error("Erro ao fazer upload da foto");
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("protetor-photos").getPublicUrl(fileName);

    setFotoUrl(publicUrl);
    toast.success("Foto adicionada!");
    setUploading(false);
  };

  const removePhoto = () => {
    setFotoUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    setLoading(true);

    try {
      const updatePayload: any = {
        nome,
        email,
        campus,
        forma_de_contato: formaContato || null,
        foto_url: fotoUrl,
      };

      // só inclua is_admin se o usuário atual for admin (para evitar autoset por usuários comuns)
      if (isProtetorAdmin) {
        updatePayload.is_admin = isAdmin;
      }

      const { error } = await supabase
        .from("protetores")
        .update(updatePayload)
        .eq("id", id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
      navigate("/protetores");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // NOVA FUNÇÃO: deletar protetor
  const handleDelete = async () => {
    if (!id) return;
    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    // confirmação simples
    const confirmed = window.confirm(
      "Tem certeza de que deseja deletar este protetor? Esta ação é irreversível."
    );
    if (!confirmed) return;

    setDeleting(true);

    try {
      const { error } = await supabase.from("protetores").delete().eq("id", id);

      if (error) throw error;

      toast.success("Protetor deletado com sucesso!");

      // se o usuário deletou o próprio perfil, deslogue / redirecione para auth
      if (protetorId === id) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          // ignore signout errors
        }
        navigate("/");
        return;
      }

      navigate("/protetores");
    } catch (error: any) {
      console.error("Erro ao deletar protetor:", error);
      // se for 403/forbidden provável problema de RLS/permissão
      if (error?.status === 403 || error?.code === "42501") {
        toast.error(
          "Permissão negada ao tentar deletar. Apenas administradores ou o dono da conta podem deletar."
        );
      } else {
        toast.error("Erro ao deletar protetor");
      }
    } finally {
      setDeleting(false);
    }
  };

  const canDelete = isProtetorAdmin || protetorId === id;

  return (
    <div className="min-h-screen gradient-purple-dark">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-primary rounded-3xl p-8 border-4 border-accent shadow-card animate-scale-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-accent/10 rounded-full px-6 py-3 mb-4 animate-bounce-subtle">
              <UserCircle className="w-6 h-6 text-accent" />
              <span className="font-bold text-accent">Modo Edição</span>
              <Star className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
              ✏️ Editar Perfil do Protetor
            </h1>
            <p className="text-secondary/70">
              Atualize suas informações de protetor
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto */}
            <div className="flex flex-col items-center gap-4">
              <Label>Foto de Perfil</Label>
              {fotoUrl ? (
                <div className="relative">
                  <img
                    src={fotoUrl}
                    alt="Foto do protetor"
                    className="w-32 h-32 object-cover rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-32 h-32 border-2 border-dashed border-accent rounded-2xl flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
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
              )}
            </div>

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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="campus">Campus</Label>
                <Input
                  id="campus"
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="formaContato">Forma de Contato</Label>
                <Input
                  id="formaContato"
                  value={formaContato}
                  onChange={(e) => setFormaContato(e.target.value)}
                  placeholder="WhatsApp, Telegram, etc."
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Novo campo: conceder privilégios de administrador (visível apenas para admins) */}
            {isProtetorAdmin && (
              <div className="flex items-center space-x-2 bg-card rounded-xl p-4">
                <Checkbox
                  id="isAdmin"
                  checked={isAdmin}
                  onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
                />
                <label
                  htmlFor="isAdmin"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-secondary">
                    Conceder privilégios de administrador
                  </span>
                </label>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 gap-2"
                size="lg"
                disabled={loading || deleting}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    💾 Atualizar Perfil
                  </>
                )}
              </Button>
              {canDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="lg"
                  onClick={handleDelete}
                  disabled={deleting || loading}
                  className="flex items-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deletando...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Deletar
                    </>
                  )}
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate("/protetores")}
                disabled={deleting || loading}
              >
                Cancelar
              </Button>

              {/* Botão de deletar — visível apenas para admins ou dono do perfil */}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditarProtetor;
