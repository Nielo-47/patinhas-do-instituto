import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Heart, AlertTriangle, Shield, Home } from "lucide-react";

const ComoAjudar = () => {
  return (
    <div className="min-h-screen gradient-purple-dark flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-3 mb-4">
            <Heart className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-bold text-primary">Faça a Diferença</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            🐾 Como Você Pode Ajudar?
          </h1>
          <p className="text-primary/80 text-xl max-w-2xl mx-auto">
            Cada ação conta! Descubra como fazer a diferença na vida dos nossos gatinhos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Doações */}
          <Card className="bg-primary rounded-3xl p-8 border-4 border-accent shadow-vibrant hover:scale-105 transition-all">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-yellow-red rounded-full flex items-center justify-center shadow-card">
                <Heart className="w-12 h-12 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-secondary mb-2">💛 Doações</h2>
            </div>
            
            <div className="space-y-4 text-secondary/80">
              <p className="text-lg">
                Suas doações ajudam a custear:
              </p>
              <ul className="space-y-2 pl-6">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Alimentação diária dos gatinhos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Tratamentos veterinários e medicamentos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Castrações e vacinas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>Abrigo temporário para casos de emergência</span>
                </li>
              </ul>
              <div className="bg-accent/20 rounded-xl p-4 mt-6">
                <p className="font-bold text-secondary text-center">
                  Veja como doar na seção de rodapé abaixo! ⬇️
                </p>
              </div>
            </div>
          </Card>

          {/* Gato Ferido */}
          <Card className="bg-primary rounded-3xl p-8 border-4 border-accent shadow-vibrant hover:scale-105 transition-all">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-yellow-red rounded-full flex items-center justify-center shadow-card">
                <AlertTriangle className="w-12 h-12 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-secondary mb-2">🚑 Gato Ferido?</h2>
            </div>
            
            <div className="space-y-4 text-secondary/80">
              <p className="text-lg font-medium text-secondary">
                Passos Importantes:
              </p>
              <ol className="space-y-3 pl-6 list-decimal">
                <li>
                  <strong className="text-secondary">Mantenha a Calma:</strong> Não assuste o animal, aproxime-se devagar
                </li>
                <li>
                  <strong className="text-secondary">Avalie a Situação:</strong> O gato está consciente? Consegue se mover?
                </li>
                <li>
                  <strong className="text-secondary">Entre em Contato:</strong> Use o formulário no rodapé para reportar
                </li>
                <li>
                  <strong className="text-secondary">Não Medique:</strong> Deixe os primeiros socorros com profissionais
                </li>
                <li>
                  <strong className="text-secondary">Ofereça Água:</strong> Mas nunca force o animal
                </li>
              </ol>
              <div className="bg-red-500/20 rounded-xl p-4 mt-6 border-2 border-red-500/50">
                <p className="font-bold text-secondary text-center">
                  ⚠️ Em emergências, ligue para o veterinário mais próximo!
                </p>
              </div>
            </div>
          </Card>

          {/* Maus Tratos */}
          <Card className="bg-primary rounded-3xl p-8 border-4 border-accent shadow-vibrant hover:scale-105 transition-all">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-yellow-red rounded-full flex items-center justify-center shadow-card">
                <Shield className="w-12 h-12 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-secondary mb-2">🛡️ Denuncie Maus Tratos</h2>
            </div>
            
            <div className="space-y-4 text-secondary/80">
              <p className="text-lg">
                Maus tratos a animais é <strong className="text-red-500">CRIME</strong> (Lei 9.605/98)
              </p>
              
              <div className="bg-card rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-secondary">Onde Denunciar:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">📞</span>
                    <span><strong>190:</strong> Polícia Militar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">📞</span>
                    <span><strong>181:</strong> Disque Denúncia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">🏛️</span>
                    <span>Delegacia mais próxima</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">📧</span>
                    <span>Ministério Público do seu estado</span>
                  </li>
                </ul>
              </div>

              <div className="bg-accent/20 rounded-xl p-4">
                <p className="font-medium text-secondary">
                  💡 <strong>Dica:</strong> Se possível, reúna provas (fotos, vídeos, testemunhas) para fortalecer a denúncia.
                </p>
              </div>
            </div>
          </Card>

          {/* Adoção */}
          <Card className="bg-primary rounded-3xl p-8 border-4 border-accent shadow-vibrant hover:scale-105 transition-all">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-yellow-red rounded-full flex items-center justify-center shadow-card">
                <Home className="w-12 h-12 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-secondary mb-2">🏠 Adote com Responsabilidade</h2>
            </div>
            
            <div className="space-y-4 text-secondary/80">
              <p className="text-lg">
                Adotar é um ato de amor, mas requer compromisso!
              </p>
              
              <div className="space-y-3">
                <h3 className="font-bold text-secondary">Antes de Adotar, Pense:</h3>
                <ul className="space-y-2 pl-6">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">?</span>
                    <span>Você tem tempo para cuidar do gatinho?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">?</span>
                    <span>Pode arcar com gastos veterinários?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">?</span>
                    <span>Sua casa é segura para um gato?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">?</span>
                    <span>Todos em casa concordam com a adoção?</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-secondary">Como Adotar:</h3>
                <p>
                  1️⃣ Visite a página do <strong>Censo</strong> e veja os gatinhos disponíveis
                </p>
                <p>
                  2️⃣ Entre em contato conosco pelo formulário no rodapé
                </p>
                <p>
                  3️⃣ Conheça o gatinho pessoalmente
                </p>
                <p>
                  4️⃣ Assine o termo de adoção responsável
                </p>
              </div>

              <div className="bg-accent/20 rounded-xl p-4">
                <p className="font-bold text-secondary text-center">
                  💛 Adotar salva vidas e traz amor para sua casa!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComoAjudar;
