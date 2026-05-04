import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);

  useEffect(() => {
    const prepareRecoverySession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");
      const code = searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          toast({
            title: "Link inválido",
            description:
              "Não foi possível validar o link de redefinição de senha.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        setCheckingLink(false);
        return;
      }

      if (accessToken && refreshToken && type === "recovery") {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          toast({
            title: "Link inválido",
            description:
              "Não foi possível validar o link de redefinição de senha.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        setCheckingLink(false);
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setCheckingLink(false);
        return;
      }

      toast({
        title: "Link inválido",
        description: "O link de redefinição de senha é inválido ou expirou.",
        variant: "destructive",
      });
      navigate("/auth");
    };

    void prepareRecoverySession();
  }, [searchParams, navigate, toast]);

  const handleRedefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senha || !confirmSenha) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    if (senha !== confirmSenha) {
      toast({ title: "As senhas não coincidem", variant: "destructive" });
      return;
    }
    if (checkingLink) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: senha });

      if (error) throw error;

      toast({ title: "Senha redefinida com sucesso!" });
      navigate("/auth");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Não foi possível redefinir a senha";

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 gradient-purple-dark">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-primary rounded-3xl border-4 border-accent p-8 max-w-md w-full shadow-card animate-scale-in">
          <h1 className="text-3xl font-bold text-secondary mb-4 text-center">
            🔐 Redefinir Senha
          </h1>
          <p className="text-secondary/70 mb-6 text-center">
            Insira sua nova senha para concluir o processo de redefinição.
          </p>

          <form onSubmit={handleRedefinirSenha} className="space-y-6">
            <div>
              <Label htmlFor="senha">Nova Senha</Label>
              <PasswordInput
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="rounded-xl"
                disabled={checkingLink}
              />
            </div>

            <div>
              <Label htmlFor="confirmSenha">Confirmar Senha</Label>
              <PasswordInput
                id="confirmSenha"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                required
                className="rounded-xl"
                disabled={checkingLink}
              />
            </div>

            <Button
              type="submit"
              className="w-full flex justify-center gap-2"
              disabled={loading || checkingLink}
            >
              {checkingLink ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Validando link...
                </>
              ) : loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                "Redefinir Senha"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Lembrou sua senha?{" "}
            <button
              className="text-accent font-semibold hover:underline"
              onClick={() => navigate("/auth")}
            >
              Voltar para login
            </button>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
