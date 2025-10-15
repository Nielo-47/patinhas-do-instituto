import { Mail, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useState } from "react";

export const Footer = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !mensagem) {
      toast.error("Preencha todos os campos!");
      return;
    }

    // Here you would send the data to an API or email service
    toast.success("Mensagem enviada! Entraremos em contato em breve.");
    setNome("");
    setEmail("");
    setMensagem("");
  };

  return (
    <footer className="bg-accent text-accent-foreground py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contato */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-accent-foreground" />
              Entre em Contato
            </h3>
            <p className="mb-4 text-accent-foreground/80">
              Tem dúvidas ou quer reportar uma ocorrência?
            </p>
            <p className="mb-6 text-accent-foreground font-medium">
              📧 patinhasdoinstituto@gmail.com
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-primary text-secondary border-accent-foreground"
              />
              <Input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary text-secondary border-accent-foreground"
              />
              <Textarea
                placeholder="Sua mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="bg-primary text-secondary border-accent-foreground min-h-[100px]"
              />
              <Button
                type="submit"
                variant="default"
                className="w-full bg-primary text-secondary hover:bg-primary/90"
              >
                Enviar Mensagem
              </Button>
            </form>
          </div>

          {/* Doações */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-accent-foreground" />
              Apoie Nosso Trabalho
            </h3>
            <p className="mb-6 text-accent-foreground/80">
              Sua doação ajuda a cuidar das nossas patinhas! 💛
            </p>

            <div className="bg-primary rounded-2xl p-6 text-center">
              <p className="text-secondary font-bold mb-4">
                Faça sua doação via PIX:
              </p>
              <div className="bg-secondary/10 rounded-xl p-2 mb-4">
                <img
                  src="pix_patinhas.jpg"
                  alt="QR Code PIX"
                  className="mx-auto w-[50%] aspect-ratio"
                />
              </div>
              <p className="text-sm text-secondary/70">
                Escaneie o QR Code acima ou use a chave PIX:
              </p>
              <p className="text-secondary font-bold mt-2">
                patinhasdoinstituto@gmail.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-accent-foreground/20 text-center text-accent-foreground/70">
          <p>
            © 2025 Patinhas do Instituto | Feito com 💛 para nossos amigos
            felinos
          </p>
        </div>
      </div>
    </footer>
  );
};
