import { Stage } from "@/types";
import { MapPin, Clock, Map } from "lucide-react";
import { motion } from "framer-motion";

interface StageDisplayProps {
  stages: Stage[];
  isOmrah?: boolean;
}

const getStageIcon = (stageName: string, isOmrah: boolean) => {
  if (!isOmrah) return null;
  
  const lowerName = stageName.toLowerCase();
  if (lowerName.includes("mecque") || lowerName.includes("makkah") || lowerName.includes("mecca")) {
    return "🕋"; // Kaaba
  }
  if (lowerName.includes("medine") || lowerName.includes("madinah") || lowerName.includes("medina")) {
    return "🕌"; // Dome
  }
  return null;
};

const StageDisplay = ({ stages, isOmrah = false }: StageDisplayProps) => {
  if (!stages || stages.length === 0) return null;

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const icon = getStageIcon(stage.name, isOmrah);
        
        return (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-r from-primary/5 to-accent/5 border-l-4 border-accent rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {icon && <span className="text-2xl">{icon}</span>}
                  <h4 className="text-lg font-semibold text-primary">
                    {stage.name}
                  </h4>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={16} className="text-accent flex-shrink-0" />
                    <span>{stage.hotelName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={16} className="text-accent flex-shrink-0" />
                    <span>{stage.days} jour{stage.days > 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>

              {stage.googleMapsUrl && (
                <a
                  href={stage.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 hover:shadow-md transition-all text-sm font-medium flex-shrink-0"
                  title="Voir l'emplacement de l'hôtel sur Google Maps"
                >
                  <Map size={16} className="flex-shrink-0" />
                  <span className="hidden sm:inline">Voir l'emplacement de l'hôtel</span>
                  <span className="sm:hidden">Localisation</span>
                </a>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StageDisplay;
