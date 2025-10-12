import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Scissors, Syringe, MapPin, Calendar, Heart } from "lucide-react";

interface CatDetailsModalProps {
  cat: {
    id: string;
    nome: string;
    sexo: string;
    status: string;
    castrado: boolean;
    vacinado: boolean;
    data_ultima_vacinacao?: string;
    local_encontrado?: string;
    caracteristicas?: string;
    fotos?: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CatDetailsModal = ({ cat, isOpen, onClose }: CatDetailsModalProps) => {
  const navigate = useNavigate();

  if (!cat) return null;

  const statusLabels: Record<string, string> = {
    no_campus: "No Campus",
    em_tratamento: "Em Tratamento",
    adotado: "Adotado",
    falecido: "Falecido",
    desconhecido: "Desconhecido",
  };

  const canAdopt = cat.status === "no_campus" || cat.status === "desconhecido";

  const handleAdopt = () => {
    onClose();
    navigate(`/gatos/${cat.id}/adotar`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-secondary">
            {cat.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {cat.fotos && cat.fotos.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {cat.fotos.map((foto, index) => (
                <img
                  key={index}
                  src={foto}
                  alt={`${cat.nome} - foto ${index + 1}`}
                  className="rounded-lg w-full h-48 object-cover"
                />
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{cat.sexo === "macho" ? "Macho" : cat.sexo === "femea" ? "Fêmea" : "Desconhecido"}</Badge>
            <Badge>{statusLabels[cat.status] || cat.status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Scissors className={cat.castrado ? "text-secondary" : "text-accent"} />
              <span>{cat.castrado ? "Castrado" : "Não Castrado"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Syringe className={cat.vacinado ? "text-secondary" : "text-accent"} />
              <span>{cat.vacinado ? "Vacinado" : "Não Vacinado"}</span>
            </div>
          </div>

          {cat.data_ultima_vacinacao && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Última vacinação: {new Date(cat.data_ultima_vacinacao).toLocaleDateString("pt-BR")}</span>
            </div>
          )}

          {cat.local_encontrado && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Encontrado em: {cat.local_encontrado}</span>
            </div>
          )}

          {cat.caracteristicas && (
            <div className="bg-muted p-4 rounded-xl">
              <h4 className="font-semibold mb-2">Características:</h4>
              <p className="text-sm">{cat.caracteristicas}</p>
            </div>
          )}

          {canAdopt && (
            <Button
              onClick={handleAdopt}
              className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 text-lg"
            >
              <Heart className="mr-2 h-5 w-5" />
              Me Adota!
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
