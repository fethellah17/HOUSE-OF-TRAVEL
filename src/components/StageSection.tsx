import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertCircle } from "lucide-react";

interface Stage {
  id: string;
  name: string;
  hotelName: string;
  googleMapsUrl: string;
  days: number;
}

interface StageSectionProps {
  stages: Stage[];
  onStagesChange: (stages: Stage[]) => void;
  totalDays: number;
  onDaysMismatch?: (mismatch: boolean) => void;
}

const StageSection = ({
  stages,
  onStagesChange,
  totalDays,
  onDaysMismatch,
}: StageSectionProps) => {
  const [daysMismatch, setDaysMismatch] = useState(false);

  useEffect(() => {
    const stageDaysTotal = stages.reduce((sum, stage) => sum + stage.days, 0);
    const mismatch = stageDaysTotal !== totalDays && totalDays > 0;
    setDaysMismatch(mismatch);
    onDaysMismatch?.(mismatch);
  }, [stages, totalDays, onDaysMismatch]);

  const updateStage = (id: string, field: keyof Stage, value: any) => {
    const updated = stages.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    onStagesChange(updated);
  };

  const removeStage = (id: string) => {
    onStagesChange(stages.filter((s) => s.id !== id));
  };

  const stageDaysTotal = stages.reduce((sum, stage) => sum + stage.days, 0);

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-br from-blue-50 to-white border-2 border-accent/20 rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">
                Étape {index + 1}
              </h3>
              {stages.length > 1 && (
                <button
                  onClick={() => removeStage(stage.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Supprimer cette étape"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nom de la ville/étape *
                </label>
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => updateStage(stage.id, "name", e.target.value)}
                  className="devis-input"
                  placeholder="Ex: مكة المكرمة (La Mecque)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre de jours *
                </label>
                <input
                  type="number"
                  min="1"
                  value={stage.days === 0 ? "" : stage.days}
                  onChange={(e) =>
                    updateStage(stage.id, "days", parseInt(e.target.value) || 0)
                  }
                  onFocus={(e) => {
                    if (e.target.value === "0") {
                      e.target.value = "";
                    }
                  }}
                  className="devis-input"
                  placeholder="Ex: 5"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nom de l'hôtel *
                </label>
                <input
                  type="text"
                  value={stage.hotelName}
                  onChange={(e) =>
                    updateStage(stage.id, "hotelName", e.target.value)
                  }
                  className="devis-input"
                  placeholder="Ex: Hilton Makkah"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Lien Google Maps *
                </label>
                <input
                  type="url"
                  value={stage.googleMapsUrl}
                  onChange={(e) =>
                    updateStage(stage.id, "googleMapsUrl", e.target.value)
                  }
                  className="devis-input"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {daysMismatch && totalDays > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
        >
          <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">Attention</p>
            <p className="text-sm text-yellow-700">
              La somme des jours ({stageDaysTotal}) ne correspond pas à la durée
              totale ({totalDays} jours). Veuillez ajuster.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StageSection;
