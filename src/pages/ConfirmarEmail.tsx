import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ConfirmarEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-purple-dark">
      <Card className="w-full max-w-md p-8 bg-card border-4 border-accent rounded-3xl shadow-card">
        <div className="flex flex-col items-center mb-6">
          <Logo />
          <h1 className="text-2xl font-bold text-secondary mt-4">
            Confirme seu email
          </h1>
          <p className="text-center text-secondary mt-2">
            Um email de confirmação foi enviado para sua caixa de entrada.
            Clique no link do email para ativar sua conta e depois faça login.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={() => navigate("/")} className="w-full">
            Voltar para login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmarEmail;
