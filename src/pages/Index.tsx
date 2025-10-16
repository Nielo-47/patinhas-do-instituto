import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HomeCarousel } from "@/components/HomeCarousel";
import { Button } from "@/components/ui/button";
import { Instagram, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="relative overflow-hidden rounded-3xl mb-12 bg-gradient-yellow-red p-8 md:p-16">
          <div className="grid md:grid-cols-2 gap-8 items-start md:items-start">
            <div className="relative animate-scale-in">
              <HomeCarousel />
            </div>
            <div className="text-center md:text-left z-10 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-5 h-5 text-secondary" />
                <span className="text-sm font-semibold text-secondary">
                  Bem-vindo ao portal Patinhas do Instituto!
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-4 leading-tight">
                Conheça nossas
                <br />
                <span className="text-accent">patinhas!</span>
              </h1>
              <p className="text-lg text-secondary/80 mb-6 max-w-lg">
                Somos um grupo de estudantes, professores e funcionarios
                comprometidos com a causa animal. Nosso objetivo é resgatar,
                alimentar e encontrar lares amorosos para os gatos do IFCE
                campus Fortaleza.
              </p>
              <p className="text-lg text-secondary/80 mb-6 max-w-lg">
                Ajude-nos a cuidar de bichinhos desamparados. Conheça cada um
                deles e saiba como contribuir para o bem-estar de todos! 🐾
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link to="/censo">
                  <Button size="lg" className="gap-2">
                    <Heart className="w-5 h-5" />
                    Veja nossos gatinhos!
                  </Button>
                </Link>
                <a
                  href="https://instagram.com/patinhasdoinstituto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="lg" className="gap-2">
                    <Instagram className="w-5 h-5" />
                    Siga nosso Insta!
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
