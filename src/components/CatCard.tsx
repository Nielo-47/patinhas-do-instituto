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
      className="bg-primary rounded-3xl border-4 border-accent p-4 cursor-pointer hover:scale-105 transition-transform shadow-card"
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
        <h3 className="text-center font-bold text-secondary mb-2 truncate">{nome}</h3>
        
        <div className="flex justify-center gap-3">
          <Scissors
            className={`w-5 h-5 ${castrado ? 'text-secondary' : 'text-accent'}`}
          />
          <Syringe
            className={`w-5 h-5 ${vacinado ? 'text-secondary' : 'text-accent'}`}
          />
        </div>
      </div>
    </div>
  );
};
