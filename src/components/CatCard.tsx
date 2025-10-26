import { useState } from "react";
import { Cat as CatIcon, Scissors, Syringe } from "lucide-react";

interface CatCardProps {
  id: string;
  nome: string;
  foto?: string;
  castrado: boolean;
  vacinado: boolean;
  onClick?: () => void;
}

export const CatCard = ({
  nome,
  foto,
  castrado,
  vacinado,
  onClick,
}: CatCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const showPlaceholder = !foto || imageError || !imageLoaded;

  return (
    <>
      {/* Desktop Card View - hidden on mobile */}
      <div
        onClick={onClick}
        className="hidden sm:block bg-primary rounded-3xl border-4 border-accent p-4 cursor-pointer hover:scale-110 hover:-rotate-1 transition-all duration-300 shadow-card hover:shadow-vibrant group"
      >
        <div className="aspect-square rounded-2xl overflow-hidden bg-card mb-3 relative">
          {/* Placeholder - mostrado enquanto carrega ou se não houver foto */}
          {showPlaceholder && (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted">
              <CatIcon className="w-16 h-16 text-muted-foreground animate-pulse" />
            </div>
          )}

          {/* Imagem real */}
          {foto && !imageError && (
            <img
              src={foto}
              alt={nome}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
        </div>
        <div className="bg-card rounded-xl p-2">
          <h3 className="text-center font-bold text-secondary mb-2 truncate group-hover:text-accent transition-colors">
            {nome}
          </h3>
          <div className="flex justify-center gap-3">
            <div
              className={`p-2 rounded-full transition-all ${
                castrado ? "bg-secondary/10" : "bg-accent/10"
              }`}
            >
              <Scissors
                className={`w-4 h-4 ${
                  castrado ? "text-secondary" : "text-accent"
                }`}
              />
            </div>
            <div
              className={`p-2 rounded-full transition-all ${
                vacinado ? "bg-secondary/10" : "bg-accent/10"
              }`}
            >
              <Syringe
                className={`w-4 h-4 ${
                  vacinado ? "text-secondary" : "text-accent"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile List View - visible only on mobile */}
      <div
        onClick={onClick}
        className="sm:hidden bg-primary rounded-2xl border-2 border-accent p-3 cursor-pointer active:scale-95 transition-all duration-200 shadow-card"
      >
        <div className="flex items-center gap-3">
          {/* Photo thumbnail */}
          <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-card relative">
            {/* Placeholder - mostrado enquanto carrega ou se não houver foto */}
            {showPlaceholder && (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted">
                <CatIcon className="w-8 h-8 text-muted-foreground animate-pulse" />
              </div>
            )}

            {/* Imagem real */}
            {foto && !imageError && (
              <img
                src={foto}
                alt={nome}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-secondary text-lg truncate mb-1">
              {nome}
            </h3>
            <div className="flex gap-2">
              <div
                className={`px-2 py-1 rounded-full flex items-center gap-1 ${
                  castrado ? "bg-secondary/10" : "bg-accent/10"
                }`}
              >
                <Scissors
                  className={`w-3 h-3 ${
                    castrado ? "text-accent" : "text-secondary"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    castrado ? "text-accent" : "text-secondary"
                  }`}
                >
                  {castrado ? "Castrado" : "Não castrado"}
                </span>
              </div>
              <div
                className={`px-2 py-1 rounded-full flex items-center gap-1 ${
                  vacinado ? "bg-secondary/10" : "bg-accent/10"
                }`}
              >
                <Syringe
                  className={`w-3 h-3 ${
                    vacinado ? "text-accent" : "text-secondary"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    vacinado ? "text-accent" : "text-secondary"
                  }`}
                >
                  {vacinado ? "Vacinado" : "Não vacinado"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
