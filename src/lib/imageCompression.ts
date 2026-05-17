/**
 * imageCompression.ts
 * Client-side image compression utility using native Canvas API
 * Targets images to be under 2MB while maintaining good visual quality
 */

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  initialQuality?: number;
  useWebWorker?: boolean;
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxSizeMB: 2,
  maxWidthOrHeight: 1920,
  initialQuality: 0.85,
  useWebWorker: false,
};

/**
 * Compresses an image file to reduce its size while maintaining quality
 * @param file - The original image file
 * @param options - Compression options
 * @returns Promise resolving to the compressed File object
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const maxSizeBytes = opts.maxSizeMB * 1024 * 1024;

  // If file is already small enough, return it as-is
  if (file.size <= maxSizeBytes) {
    console.log(`[imageCompression] File "${file.name}" is already under ${opts.maxSizeMB}MB, skipping compression`);
    return file;
  }

  try {
    // Load the image
    const img = await loadImage(file);
    
    // Calculate new dimensions while maintaining aspect ratio
    const { width, height } = calculateDimensions(
      img.width,
      img.height,
      opts.maxWidthOrHeight
    );

    // Create canvas and draw resized image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Use better image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    // Try to compress with decreasing quality until size is acceptable
    let quality = opts.initialQuality;
    let blob: Blob | null = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      blob = await canvasToBlob(canvas, file.type, quality);
      
      if (blob.size <= maxSizeBytes || quality <= 0.1) {
        break;
      }

      // Reduce quality for next attempt
      quality -= 0.1;
      attempts++;
    }

    if (!blob) {
      throw new Error('Failed to compress image');
    }

    console.log(
      `[imageCompression] Compressed "${file.name}" from ${formatBytes(file.size)} to ${formatBytes(blob.size)} ` +
      `(${Math.round((1 - blob.size / file.size) * 100)}% reduction, quality: ${Math.round(quality * 100)}%)`
    );

    // Create a new File object from the compressed blob
    const compressedFile = new File([blob], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });

    return compressedFile;
  } catch (error) {
    console.error(`[imageCompression] Error compressing "${file.name}":`, error);
    throw error;
  }
}

/**
 * Compresses multiple images in parallel
 * @param files - Array of image files to compress
 * @param options - Compression options
 * @returns Promise resolving to array of compressed files
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<File[]> {
  return Promise.all(files.map(file => compressImage(file, options)));
}

/**
 * Loads an image file and returns an HTMLImageElement
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
}

/**
 * Calculates new dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  width: number,
  height: number,
  maxWidthOrHeight: number
): { width: number; height: number } {
  if (width <= maxWidthOrHeight && height <= maxWidthOrHeight) {
    return { width, height };
  }

  const aspectRatio = width / height;

  if (width > height) {
    return {
      width: maxWidthOrHeight,
      height: Math.round(maxWidthOrHeight / aspectRatio),
    };
  } else {
    return {
      width: Math.round(maxWidthOrHeight * aspectRatio),
      height: maxWidthOrHeight,
    };
  }
}

/**
 * Converts canvas to blob with specified quality
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob failed'));
        }
      },
      type,
      quality
    );
  });
}

/**
 * Formats bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
