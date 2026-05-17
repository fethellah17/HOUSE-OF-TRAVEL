/**
 * cloudinaryService.ts
 * Isolated service for uploading images to Cloudinary.
 * Cloud Name  : dmq3kujox
 * Upload Preset: houseoftravel
 */

import { compressImages } from "@/lib/imageCompression";
import { toast } from "sonner";

const CLOUDINARY_CLOUD_NAME = "dmq3kujox";
const CLOUDINARY_UPLOAD_PRESET = "houseoftravel";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB Cloudinary free tier limit

/**
 * Uploads an array of File objects to Cloudinary and returns their secure URLs.
 * Automatically compresses images before upload to stay under Cloudinary's 10MB limit.
 *
 * @param files - Array of File objects selected by the user.
 * @returns     - Promise resolving to an array of secure_url strings.
 */
export async function uploadImagesToCloudinary(files: File[]): Promise<string[]> {
  const secureUrls: string[] = [];

  // Step 1: Compress all images before uploading
  let compressedFiles: File[];
  try {
    console.log("[cloudinaryService] Compressing images before upload...");
    compressedFiles = await compressImages(files, {
      maxSizeMB: 2, // Target 2MB to have safety margin under 10MB limit
      maxWidthOrHeight: 1920,
      initialQuality: 0.85,
    });
  } catch (error) {
    console.error("[cloudinaryService] Compression failed:", error);
    toast.error("Erreur lors de la compression des images");
    return [];
  }

  // Step 2: Validate compressed files are still under 10MB
  const oversizedFiles = compressedFiles.filter(file => file.size > MAX_FILE_SIZE);
  if (oversizedFiles.length > 0) {
    const fileNames = oversizedFiles.map(f => f.name).join(", ");
    toast.error(
      `La taille de l'image est trop grande. Maximum 10 Mo après compression automatique. Fichiers: ${fileNames}`
    );
    console.error(
      `[cloudinaryService] Files still exceed 10MB after compression:`,
      oversizedFiles.map(f => ({ name: f.name, size: f.size }))
    );
    // Filter out oversized files and continue with valid ones
    compressedFiles = compressedFiles.filter(file => file.size <= MAX_FILE_SIZE);
    if (compressedFiles.length === 0) {
      return [];
    }
  }

  // Step 3: Upload compressed files to Cloudinary
  for (const file of compressedFiles) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `[cloudinaryService] Upload failed for file "${file.name}". ` +
            `Status: ${response.status} ${response.statusText}. ` +
            `Response: ${errorBody}`
        );
        continue; // skip this file and proceed with the rest
      }

      const data: { secure_url: string } = await response.json();

      if (!data.secure_url) {
        console.error(
          `[cloudinaryService] No secure_url in response for file "${file.name}".`,
          data
        );
        continue;
      }

      secureUrls.push(data.secure_url);
    } catch (error) {
      console.error(
        `[cloudinaryService] Network/connection error while uploading "${file.name}":`,
        error
      );
    }
  }

  return secureUrls;
}
