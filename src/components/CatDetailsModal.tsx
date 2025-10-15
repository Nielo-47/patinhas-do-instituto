import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Scissors,
  Syringe,
  MapPin,
  Calendar,
  Heart,
  Pencil,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

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

export const CatDetailsModal = ({
  cat,
  isOpen,
  onClose,
}: CatDetailsModalProps) => {
  const navigate = useNavigate();
  const { isProtetor } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    navigate(`/adotar-gato/${cat.id}`);
  };

  const handleEdit = () => {
    onClose();
    navigate(`/editar-gato/${cat.id}`);
  };

  return (
    <>
      {/* Main modal */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-secondary">
              {cat.nome}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Photo grid */}
            {cat.fotos && cat.fotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {cat.fotos.map((foto, index) => (
                  <img
                    key={index}
                    src={foto}
                    alt={`${cat.nome} - foto ${index + 1}`}
                    className="rounded-lg w-full aspect-ratio object-cover cursor-pointer hover:opacity-90 transition"
                    onClick={() => setSelectedImage(foto)}
                  />
                ))}
              </div>
            )}

            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {cat.sexo === "macho"
                  ? "Macho"
                  : cat.sexo === "femea"
                  ? "Fêmea"
                  : "Desconhecido"}
              </Badge>
              <Badge>{statusLabels[cat.status] || cat.status}</Badge>
            </div>

            {/* Castration & vaccination */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Scissors
                  className={cat.castrado ? "text-secondary" : "text-accent"}
                />
                <span>{cat.castrado ? "Castrado" : "Não Castrado"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Syringe
                  className={cat.vacinado ? "text-secondary" : "text-accent"}
                />
                <span>{cat.vacinado ? "Vacinado" : "Não Vacinado"}</span>
              </div>
            </div>

            {/* Extra info */}
            {cat.data_ultima_vacinacao && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  Última vacinação:{" "}
                  {new Date(cat.data_ultima_vacinacao).toLocaleDateString(
                    "pt-BR"
                  )}
                </span>
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

            {/* Action buttons */}
            {canAdopt && (
              <Button
                onClick={handleAdopt}
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 text-lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                Me Adota!
              </Button>
            )}

            {isProtetor && (
              <Button
                onClick={handleEdit}
                className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold text-lg"
              >
                <Pencil className="mr-2 h-5 w-5" />
                Editar
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-resolution photo viewer */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-5xl p-0 bg-transparent border-none shadow-none">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 bg-black/60 rounded-full p-2 hover:bg-black/80"
          >
            <X className="text-white h-5 w-5" />
          </button>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Gato em alta resolução"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
