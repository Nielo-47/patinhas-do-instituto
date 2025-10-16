import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  Upload,
  X,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { randomUUID } from "crypto";

interface CarouselSlide {
  id?: string;
  imagem_url: string;
  descricao: string | null;
  ordem: number;
  ativo: boolean;
}

const DESCRIPTION_MAX = 300; // change as desired

const GerenciarCarrossel = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isProtetorAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [uploading, setUploading] = useState(false);

  // for preview + load tracking
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [formData, setFormData] = useState({
    imagem_url: "",
    descricao: "",
    ordem: 0,
    ativo: true,
  });

  useEffect(() => {
    checkAdminAccess();
  }, [user, authLoading, isProtetorAdmin]);

  useEffect(() => {
    if (isUserAdmin) {
      fetchSlides();
    }
  }, [isUserAdmin]);

  // cleanup object URL when modal closes
  useEffect(() => {
    if (!modalOpen && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setImageLoaded(false);
    }
  }, [modalOpen, previewUrl]);

  const checkAdminAccess = async () => {
    if (authLoading) return;

    if (!user) {
      toast.error("Você precisa estar logado");
      navigate("/auth");
      return;
    }

    if (!isProtetorAdmin) {
      toast.error("Apenas administradores podem acessar esta página");
      navigate("/");
      return;
    }

    setIsUserAdmin(true);
  };

  const fetchSlides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("carrossel_home")
      .select("*")
      .order("ordem", { ascending: true });

    if (!error && data) {
      setSlides(data);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // create local preview immediately and mark as not loaded yet
    const localUrl = URL.createObjectURL(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(localUrl);
    setImageLoaded(false);
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `carousel-${Date.now()}.${fileExt}`;
      const filePath = `carousel/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("cat-photos")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // getPublicUrl returns an object; adapt to your supabase client shape
      const { data } = supabase.storage
        .from("cat-photos")
        .getPublicUrl(filePath);

      // prefer data.publicUrl or data.public_url depending on version
      const publicUrl =
        (data && ((data as any).publicUrl || (data as any).public_url)) || "";

      setFormData((prev) => ({ ...prev, imagem_url: publicUrl || localUrl }));
      // keep the spinner until the <img onLoad> sets imageLoaded = true
      toast.success("Imagem adicionada!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao fazer upload da imagem");
      // clean up preview if upload failed
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setFormData((prev) => ({ ...prev, imagem_url: "" }));
    } finally {
      setUploading(false);
    }
  };

  const openModal = (slide?: CarouselSlide) => {
    setImageLoaded(false);
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        imagem_url: slide.imagem_url,
        descricao: slide.descricao || "",
        ordem: slide.ordem,
        ativo: slide.ativo,
      });
      // don't set previewUrl here; we'll show the remote url and wait for onLoad
      setPreviewUrl(null);
    } else {
      setEditingSlide(null);
      setFormData({
        imagem_url: "",
        descricao: "",
        ordem: slides.length,
        ativo: true,
      });
      setPreviewUrl(null);
      setImageLoaded(false);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSlide(null);
    setFormData({
      imagem_url: "",
      descricao: "",
      ordem: 0,
      ativo: true,
    });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setImageLoaded(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imagem_url) {
      toast.error("Por favor, adicione uma imagem");
      return;
    }

    try {
      if (editingSlide) {
        const { error } = await supabase
          .from("carrossel_home")
          .update(formData)
          .eq("id", editingSlide.id);

        if (error) throw error;
        toast.success("Slide atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("carrossel_home")
          .insert([formData]);

        if (error) throw error;
        toast.success("Slide criado com sucesso!");
      }

      closeModal();
      fetchSlides();
    } catch (error) {
      toast.error("Erro ao salvar slide");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este slide?")) return;

    try {
      const { error } = await supabase
        .from("carrossel_home")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Slide deletado com sucesso!");
      fetchSlides();
    } catch (error) {
      toast.error("Erro ao deletar slide");
      console.error(error);
    }
  };

  const toggleAtivo = async (slide: CarouselSlide) => {
    try {
      const { data, error, status } = await supabase
        .from("carrossel_home")
        .update({ ativo: !slide.ativo })
        .eq("id", slide.id)
        .select(); // .select() will return the updated row(s) and sometimes surface RLS errors better

      if (error) {
        console.error("Supabase update error:", error, { status, data });
        toast.error(`Erro ao atualizar status: ${error.message}`);
        return;
      }

      toast.success(
        `Slide ${!slide.ativo ? "ativado" : "desativado"} com sucesso!`
      );
      fetchSlides();
    } catch (err) {
      console.error("Unexpected toggle error:", err);
      toast.error("Erro inesperado ao atualizar status");
    }
  };

  if (!isUserAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-purple-dark">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-primary rounded-3xl p-8 border-4 border-accent shadow-card">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                🎨 Gerenciar Carrossel
              </h1>
              <p className="text-secondary/70">
                Adicione, edite ou remova slides do carrossel da página inicial
              </p>
            </div>
            <Button onClick={() => openModal()} className="gap-2">
              <Plus className="w-5 h-5" />
              Novo Slide
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="w-12 h-12 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid gap-4">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className={`bg-card rounded-xl p-4 flex gap-4 items-center ${
                    !slide.ativo ? "opacity-50" : ""
                  }`}
                >
                  <img
                    src={slide.imagem_url}
                    alt={slide.descricao ? slide.descricao : "Slide"}
                    className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  {/* ensure text area can shrink and wrap instead of causing overflow */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-secondary">
                      Ordem: {slide.ordem}
                    </p>

                    {/* clamp description to 3 lines with ellipsis and allow wrapping */}
                    <p
                      className="text-sm text-muted-foreground break-words whitespace-normal overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {slide.descricao || "Sem descrição"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => toggleAtivo(slide)}
                      title={slide.ativo ? "Desativar" : "Ativar"}
                    >
                      {slide.ativo ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => openModal(slide)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(slide.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {slides.length === 0 && (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-secondary/70">
                    Nenhum slide cadastrado. Clique em "Novo Slide" para
                    adicionar.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Edição/Criação */}
      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl bg-primary border-4 border-accent rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-secondary">
              {editingSlide ? "✏️ Editar Slide" : "➕ Novo Slide"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Imagem</Label>

              {/* Image preview block */}
              {formData.imagem_url || previewUrl ? (
                <div className="relative mt-2">
                  <img
                    // prefer previewUrl (local) while it's present, otherwise use formData.imagem_url
                    src={previewUrl || formData.imagem_url}
                    // while the image is not loaded avoid showing "Preview" text; keep alt descriptive for accessibility
                    alt={imageLoaded ? formData.descricao || "Preview" : ""}
                    className="w-full aspect-square object-cover rounded-xl"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)} // avoid infinite spinner on broken images
                    aria-busy={uploading || !imageLoaded}
                  />

                  {/* overlay spinner while uploading OR while image hasn't finished loading */}
                  {(uploading || !imageLoaded) && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl"
                      aria-hidden="true"
                    >
                      <Loader2 className="w-12 h-12 animate-spin text-accent" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      // remove image and preview
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }
                      setFormData({ ...formData, imagem_url: "" });
                      setImageLoaded(false);
                    }}
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full p-1"
                    title="Remover imagem"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* small "Trocar" control positioned over image (disabled while uploading) */}
                  <label className="absolute bottom-3 left-3 bg-muted/60 text-muted-foreground px-3 py-1 rounded-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Trocar
                    </span>
                  </label>
                </div>
              ) : (
                <label className="mt-2 w-full h-48 border-2 border-dashed border-accent rounded-xl flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="w-12 h-12 animate-spin text-accent" />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-accent mx-auto mb-2" />
                      <p className="text-secondary/70">
                        Clique para fazer upload
                      </p>
                    </div>
                  )}
                </label>
              )}
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descricao: e.target.value.slice(0, DESCRIPTION_MAX),
                  })
                }
                className="rounded-xl"
                rows={3}
                placeholder="Descrição que aparecerá no slide"
                maxLength={DESCRIPTION_MAX}
              />
              <div className="flex justify-between mt-2 items-center">
                <p className="text-xs text-muted-foreground">
                  Use uma descrição curta para melhores resultados.
                </p>
                <p
                  className={`text-xs ${
                    formData.descricao.length >= DESCRIPTION_MAX
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {formData.descricao.length}/{DESCRIPTION_MAX}
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="ordem">Ordem de Exibição</Label>
              <Input
                id="ordem"
                type="number"
                value={formData.ordem}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ordem: parseInt(e.target.value || "0"),
                  })
                }
                className="rounded-xl"
                min={0}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={uploading || !formData.imagem_url}
              >
                {editingSlide ? "💾 Atualizar" : "✨ Criar Slide"}
              </Button>
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default GerenciarCarrossel;
