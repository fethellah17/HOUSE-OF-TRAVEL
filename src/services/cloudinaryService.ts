/**
 * cloudinaryService.ts
 * Isolated service for uploading images to Cloudinary.
 * Cloud Name  : dmq3kujox
 * Upload Preset: houseoftravel
 */

const CLOUDINARY_CLOUD_NAME = "dmq3kujox";
const CLOUDINARY_UPLOAD_PRESET = "houseoftravel";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Uploads an array of File objects to Cloudinary and returns their secure URLs.
 *
 * @param files - Array of File objects selected by the user.
 * @returns     - Promise resolving to an array of secure_url strings.
 */
export async function uploadImagesToCloudinary(files: File[]): Promise<string[]> {
  const secureUrls: string[] = [];

  for (const file of files) {
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
