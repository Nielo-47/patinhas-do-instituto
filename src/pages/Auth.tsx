import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { signIn, resetPassword } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});

const resetSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/censo");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isReset) {
        const validated = resetSchema.parse({ email });
        const { error } = await resetPassword(validated.email);
        if (error) {
          toast.error("Erro ao enviar email de redefinição");
          return;
        }
        toast.success(
          "Email de redefinição enviado! Verifique sua caixa de entrada."
        );
      } else {
        const validated = loginSchema.parse({ email, password });
        const { error } = await signIn(validated.email, validated.password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Email ou senha incorretos");
          } else {
            toast.error("Erro ao fazer login");
          }
          return;
        }
        toast.success("Bem-vindo de volta!");
        navigate("/censo");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-purple-dark">
      <Card className="w-full max-w-md p-8 bg-card border-4 border-accent rounded-3xl shadow-card">
        <div className="flex flex-col items-center mb-6">
          <Logo />
          <h1 className="text-2xl font-bold text-secondary mt-4">
            {isReset ? "Redefinir Senha" : "Entrar como Protetor"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {!isReset && (
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Carregando..."
              : isReset
              ? "Enviar email de redefinição"
              : "Entrar"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsReset(!isReset)}
            className="text-sm text-secondary hover:underline"
          >
            {isReset ? "Voltar para login" : "Esqueceu a senha?"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
