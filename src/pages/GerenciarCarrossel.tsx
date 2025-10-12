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
import { Loader2, Upload, X, Plus, Edit2, Trash2, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CarouselSlide {
  id: number;
  imagem_url: string;
  descricao: string | null;
  ordem: number;
  ativo: boolean;
}

const GerenciarCarrossel = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isProtetorAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    imagem_url: "",
    descricao: "",
    ordem: 0,
    ativo: true,
  });

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  useEffect(() => {
    if (isUserAdmin) {
      fetchSlides();
    }
  }, [isUserAdmin]);

  const checkAdminAccess = async () => {
    // Wait for auth to load
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
      .from('carrossel_home')
      .select('*')
      .order('ordem', { ascending: true });

    if (!error && data) {
      setSlides(data);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `carousel-${Date.now()}.${fileExt}`;
    const filePath = `carousel/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('cat-photos')
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Erro ao fazer upload da imagem");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('cat-photos')
      .getPublicUrl(filePath);

    setFormData({ ...formData, imagem_url: publicUrl });
    toast.success("Imagem adicionada!");
    setUploading(false);
  };

  const openModal = (slide?: CarouselSlide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        imagem_url: slide.imagem_url,
        descricao: slide.descricao || "",
        ordem: slide.ordem,
        ativo: slide.ativo,
      });
    } else {
      setEditingSlide(null);
      setFormData({
        imagem_url: "",
        descricao: "",
        ordem: slides.length,
        ativo: true,
      });
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
          .from('carrossel_home')
          .update(formData)
          .eq('id', editingSlide.id);

        if (error) throw error;
        toast.success("Slide atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from('carrossel_home')
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

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este slide?")) return;

    try {
      const { error } = await supabase
        .from('carrossel_home')
        .delete()
        .eq('id', id);

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
      const { error } = await supabase
        .from('carrossel_home')
        .update({ ativo: !slide.ativo })
        .eq('id', slide.id);

      if (error) throw error;

      toast.success(`Slide ${!slide.ativo ? 'ativado' : 'desativado'} com sucesso!`);
      fetchSlides();
    } catch (error) {
      toast.error("Erro ao atualizar status");
      console.error(error);
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
                    !slide.ativo ? 'opacity-50' : ''
                  }`}
                >
                  <img
                    src={slide.imagem_url}
                    alt={slide.descricao || "Slide"}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-secondary">Ordem: {slide.ordem}</p>
                    <p className="text-sm text-muted-foreground">
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
                    Nenhum slide cadastrado. Clique em "Novo Slide" para adicionar.
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
              {formData.imagem_url ? (
                <div className="relative mt-2">
                  <img
                    src={formData.imagem_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imagem_url: "" })}
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
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
                      <p className="text-secondary/70">Clique para fazer upload</p>
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
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="rounded-xl"
                rows={3}
                placeholder="Descrição que aparecerá no slide"
              />
            </div>

            <div>
              <Label htmlFor="ordem">Ordem de Exibição</Label>
              <Input
                id="ordem"
                type="number"
                value={formData.ordem}
                onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) })}
                className="rounded-xl"
                min={0}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={uploading || !formData.imagem_url}>
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
