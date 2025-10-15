import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CatCard } from "@/components/CatCard";
import { HomeCarousel } from "@/components/HomeCarousel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Loader2, Instagram, Heart, Sparkles, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Cat } from "@/lib/models";

const Index = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isProtetorAdmin } = useAuth();

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gatos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCats(data);
    }
    setLoading(false);
  };

  const displayedCats = cats.slice(0, 8);
  const totalCats = cats.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl mb-12 bg-gradient-yellow-red p-8 md:p-16">
          <div className="grid md:grid-cols-2 gap-8 items-start md:items-start">
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
            <div className="relative animate-scale-in">
              <HomeCarousel />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
