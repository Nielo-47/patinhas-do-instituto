import { Cat as CatIcon, Scissors, Syringe } from "lucide-react";

interface CatCardProps {
  id: string;
  nome: string;
  foto?: string;
  castrado: boolean;
  vacinado: boolean;
  onClick?: () => void;
}

export const CatCard = ({ nome, foto, castrado, vacinado, onClick }: CatCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-primary rounded-3xl border-4 border-accent p-4 cursor-pointer hover:scale-110 hover:-rotate-1 transition-all duration-300 shadow-card hover:shadow-vibrant group"
    >
      <div className="aspect-square rounded-2xl overflow-hidden bg-card mb-3">
        {foto ? (
          <img
            src={foto}
            alt={nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <CatIcon className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="bg-card rounded-xl p-2">
        <h3 className="text-center font-bold text-secondary mb-2 truncate group-hover:text-accent transition-colors">{nome}</h3>
        
        <div className="flex justify-center gap-3">
          <div className={`p-2 rounded-full transition-all ${castrado ? 'bg-secondary/10' : 'bg-accent/10'}`}>
            <Scissors
              className={`w-4 h-4 ${castrado ? 'text-secondary' : 'text-accent'}`}
            />
          </div>
          <div className={`p-2 rounded-full transition-all ${vacinado ? 'bg-secondary/10' : 'bg-accent/10'}`}>
            <Syringe
              className={`w-4 h-4 ${vacinado ? 'text-secondary' : 'text-accent'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
