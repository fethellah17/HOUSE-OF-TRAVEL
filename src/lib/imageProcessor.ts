import heic2any from "heic2any";

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const JPEG_QUALITY = 0.85;

/**
 * Détecte si le fichier est au format HEIC/HEIF
 */
export const isHeicFormat = (file: File): boolean => {
  const heicMimes = ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"];
  return heicMimes.includes(file.type) || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif");
};

/**
 * Convertit une image HEIC en JPEG
 */
export const convertHeicToJpeg = async (file: File): Promise<Blob> => {
  try {
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: JPEG_QUALITY,
    });
    return convertedBlob as Blob;
  } catch (error) {
    console.error("Erreur lors de la conversion HEIC:", error);
    throw new Error("Impossible de convertir l'image HEIC. Veuillez réessayer.");
  }
};

/**
 * Compresse une image en redimensionnant et en réduisant la qualité
 */
export const compressImage = (
  canvas: HTMLCanvasElement,
  quality: number = JPEG_QUALITY
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Impossible de compresser l'image"));
        }
      },
      "image/jpeg",
      quality
    );
  });
};

/**
 * Redimensionne une image si elle dépasse les dimensions max
 */
export const resizeImage = (
  img: HTMLImageElement,
  maxWidth: number = MAX_WIDTH,
  maxHeight: number = MAX_HEIGHT
): HTMLCanvasElement => {
  let width = img.width;
  let height = img.height;

  // Calculer les nouvelles dimensions en gardant le ratio
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossible d'obtenir le contexte canvas");

  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
};

/**
 * Traite une image : conversion HEIC + compression + redimensionnement
 */
export const processImage = async (file: File): Promise<{ blob: Blob; size: number }> => {
  let blob: Blob = file;

  // Étape 1: Convertir HEIC en JPEG si nécessaire
  if (isHeicFormat(file)) {
    blob = await convertHeicToJpeg(file);
  }

  // Étape 2: Charger l'image et redimensionner si nécessaire
  const url = URL.createObjectURL(blob);
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = async () => {
      try {
        const canvas = resizeImage(img);
        URL.revokeObjectURL(url);

        // Étape 3: Compresser l'image
        let quality = JPEG_QUALITY;
        let compressedBlob = await compressImage(canvas, quality);

        // Étape 4: Réduire la qualité si le fichier est encore trop volumineux
        while (compressedBlob.size > MAX_FILE_SIZE && quality > 0.5) {
          quality -= 0.1;
          compressedBlob = await compressImage(canvas, quality);
        }

        resolve({
          blob: compressedBlob,
          size: compressedBlob.size,
        });
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossible de charger l'image"));
    };

    img.src = url;
  });
};

/**
 * Convertit un Blob en base64
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Traite une image et retourne une chaîne base64
 */
export const processImageToBase64 = async (file: File): Promise<string> => {
  const { blob } = await processImage(file);
  return blobToBase64(blob);
};

/**
 * Formate la taille du fichier en unité lisible
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
