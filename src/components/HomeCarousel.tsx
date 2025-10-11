import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

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

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto-play a cada 5 segundos

    return () => clearInterval(interval);
  }, [slides.length]);

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from('carrossel_home')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (!error && data) {
      setSlides(data);
    }
    setLoading(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading || slides.length === 0) return null;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-card border-4 border-accent shadow-card mb-12">
      <div className="relative h-[400px] md:h-[500px]">
        <img
          src={slides[currentSlide].imagem_url}
          alt={slides[currentSlide].descricao || "Slide"}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay gradient */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary/90 to-transparent p-6">
          {slides[currentSlide].descricao && (
            <p className="text-secondary-foreground text-lg md:text-xl font-medium text-center">
              {slides[currentSlide].descricao}
            </p>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      {slides.length > 1 && (
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
  );
};
