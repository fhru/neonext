/**
 * Service for handling Cloudinary image uploads
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to upload ${file.name}`);
  }

  const data = await response.json();
  return data.secure_url;
}

export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(uploadToCloudinary);
  return Promise.all(uploadPromises);
}
