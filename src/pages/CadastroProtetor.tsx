import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, UserPlus, Award, Star, Shield } from "lucide-react";

const CadastroProtetor = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isProtetorAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [campus, setCampus] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUserAdmin) {
      toast.error("Você não tem permissão para cadastrar protetores");
      return;
    }

    setLoading(true);

    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome,
            campus,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: insertError } = await supabase
          .from("protetores")
          .insert({
            id: authData.user.id,
            nome,
            email,
            campus,
            is_admin: isAdmin,
          });

        if (insertError) throw insertError;

        toast.success("Protetor cadastrado com sucesso!");
        navigate("/protetores");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar protetor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isUserAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-purple-dark">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-primary rounded-3xl p-8 border-4 border-accent shadow-card animate-scale-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-accent/10 rounded-full px-6 py-3 mb-4 animate-bounce-subtle">
              <UserPlus className="w-6 h-6 text-accent" />
              <span className="font-bold text-accent">Novo Protetor</span>
              <Star className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
              🎉 Cadastrar Novo Protetor
            </h1>
            <p className="text-secondary/70">
              Adicione um novo membro à equipe de protetores
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
                  placeholder="Nome completo"
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
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="rounded-xl"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
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
                  placeholder="Nome do campus"
                />
              </div>
            </div>

            {/* Admin checkbox */}
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
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5" />✨ Cadastrar Protetor
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate("/protetores")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CadastroProtetor;
