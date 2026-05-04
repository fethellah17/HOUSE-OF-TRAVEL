import { useState, useRef } from "react";
import { Upload, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { processImageToBase64, isHeicFormat } from "@/lib/imageProcessor";
import { LoadingSpinner } from "./LoadingSpinner";

interface MultiImageUploadProps {
  value: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
  label?: string;
}

const ACCEPTED_FORMATS = ["image/jpeg", "image/png", "image/heic", "image/heif"];

export const MultiImageUpload = ({
  value,
  onChange,
  maxFiles = 10,
  label = "Photos du voyage",
}: MultiImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_FORMATS.includes(file.type) && !isHeicFormat(file)) {
      toast.error("Format non accepté. Utilisez JPG, JPEG, PNG ou HEIC.");
      return false;
    }
    return true;
  };

  const handleFiles = async (files: FileList) => {
    if (value.length >= maxFiles) {
      toast.error(`Maximum ${maxFiles} photos autorisées`);
      return;
    }

    const validFiles = Array.from(files).filter(validateFile);
    if (validFiles.length === 0) return;

    const remainingSlots = maxFiles - value.length;
    const filesToProcess = validFiles.slice(0, remainingSlots);

    setIsLoading(true);
    setProcessingMessage(`Traitement de ${filesToProcess.length} image(s)...`);
    
    try {
      const base64Images = await Promise.all(
        filesToProcess.map((file) => processImageToBase64(file))
      );
      onChange([...value, ...base64Images]);
      toast.success(`${base64Images.length} image(s) ajoutée(s) et optimisée(s)`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors du traitement des images");
      console.error(error);
    } finally {
      setIsLoading(false);
      setProcessingMessage("");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      handleFiles(e.currentTarget.files);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    onChange([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium">
          {label}
          <span className="text-muted-foreground ml-1">
            ({value.length}/{maxFiles})
          </span>
        </label>
        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-500 hover:text-red-600 transition-colors"
          >
            Effacer tout
          </button>
        )}
      </div>

      {/* Galerie de prévisualisations */}
      {value.length > 0 && (
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence>
            {value.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-accent/30 bg-white">
                  <img
                    src={image}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Supprimer"
                >
                  <X size={14} />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                  {index + 1}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Zone de dépôt */}
      {value.length < maxFiles && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative w-full p-8 rounded-lg border-2 border-dashed transition-all cursor-pointer
            ${isDragging
              ? "border-accent bg-accent/5"
              : "border-accent/40 bg-white hover:border-accent/60"
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.heic,.heif"
            onChange={handleFileInput}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isLoading}
          />

          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-3 p-3 bg-accent/10 rounded-lg">
              <Upload size={24} className="text-accent" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Cliquer pour uploader
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              ou glisser-déposer des images
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, JPEG, PNG, HEIC • Compression auto
            </p>
            <p className="text-xs text-accent font-medium mt-2">
              {maxFiles - value.length} photo(s) restante(s)
            </p>
          </div>

          {isLoading && (
            <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
              <LoadingSpinner size="md" message={processingMessage} />
            </div>
          )}
        </div>
      )}

      {value.length >= maxFiles && (
        <div className="p-4 bg-accent/10 rounded-lg text-center">
          <p className="text-sm text-accent font-medium">
            ✓ Maximum de photos atteint ({maxFiles})
          </p>
        </div>
      )}
    </div>
  );
};
