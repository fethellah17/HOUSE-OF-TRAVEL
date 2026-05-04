import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { processImageToBase64, isHeicFormat, formatFileSize } from "@/lib/imageProcessor";
import { LoadingSpinner } from "./LoadingSpinner";

interface ImageUploadProps {
  value: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  required?: boolean;
}

const ACCEPTED_FORMATS = ["image/jpeg", "image/png", "image/heic", "image/heif"];

export const ImageUpload = ({ value, onChange, label = "Image du voyage", required = false }: ImageUploadProps) => {
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

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;
    
    setIsLoading(true);
    setProcessingMessage(isHeicFormat(file) ? "Conversion HEIC en cours..." : "Compression de l'image...");
    
    try {
      const base64 = await processImageToBase64(file);
      onChange(base64);
      toast.success("Image uploadée et optimisée avec succès");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors du traitement de l'image");
      console.error(error);
    } finally {
      setIsLoading(false);
      setProcessingMessage("");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {value ? (
        <div className="relative inline-block w-full">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-accent/30 bg-white">
            <img
              src={value}
              alt="Prévisualisation"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
              aria-label="Supprimer l'image"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Cliquez sur le bouton rouge pour changer d'image
          </p>
        </div>
      ) : (
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
              ou glisser-déposer une image
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, JPEG, PNG, HEIC • Compression auto
            </p>
          </div>

          {isLoading && (
            <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
              <LoadingSpinner size="md" message={processingMessage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
