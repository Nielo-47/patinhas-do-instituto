import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface CarouselSlide {
  id: number;
  imagem_url: string;
  descricao: string | null;
  ordem: number;
}

export const HomeCarousel = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isProtetorAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from("carrossel_home")
      .select("*")
      .eq("ativo", true)
      .order("ordem", { ascending: true });
    if (!error && data) {
      setSlides(data);
    }
    setLoading(false);
  };

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // while loading, return null (optional: replace with spinner)
  if (loading) return null;

  const hasSlides = slides.length > 0;
  const current = hasSlides ? slides[currentSlide] : null;

  return (
    <div className="w-[90%] mx-auto">
      <div className="relative w-full rounded-3xl overflow-hidden bg-card border-4 border-accent shadow-card">
        {/* Manage Carousel Button - Admin Only */}
        {isProtetorAdmin && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 z-10 gap-1 text-xs"
            onClick={() => navigate("/gerenciar-carrossel")}
          >
            <Settings className="w-3 h-3" />
            Gerenciar
          </Button>
        )}

        <div className="relative w-full aspect-square">
          {hasSlides ? (
            <img
              src={current!.imagem_url}
              alt={current!.descricao || "Slide"}
              className="w-full h-full object-cover"
            />
          ) : (
            // Placeholder when there are no slides
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center p-6">
              <div className="w-28 h-28 flex items-center justify-center rounded-lg bg-muted/30">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <p className="text-secondary font-semibold">
                  Nenhum slide disponível
                </p>
                <p className="text-sm text-secondary/70 mt-1">
                  Adicione slides para aparecerem aqui.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        {hasSlides && slides.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
              onClick={nextSlide}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-primary w-8"
                      : "bg-secondary-foreground/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Description below image */}
      {hasSlides && current?.descricao && (
        <p className="text-secondary/80 text-center mt-3 text-sm md:text-base break-words whitespace-normal">
          {current.descricao}
        </p>
      )}
    </div>
  );
};
