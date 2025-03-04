export async function uploadImagesToCloudinary(files: File[]): Promise<string[]> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const uploadedImageUrls: string[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        uploadedImageUrls.push(data.secure_url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  console.log({ uploadedImageUrls });
  return uploadedImageUrls;
}
