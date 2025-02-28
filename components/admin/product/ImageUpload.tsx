'use client';

import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

type ImageUploadProps = {
  imageFiles: File[];
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imagePreviews: string[];
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
};

export function ImageUpload({
  imageFiles,
  setImageFiles,
  imagePreviews,
  setImagePreviews,
  loading,
}: ImageUploadProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      const validFiles = newFiles.filter((file) => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB limit

        if (!isValidType) {
          toast.error(`${file.name} is not a valid image file`);
        }

        if (!isValidSize) {
          toast.error(`${file.name} exceeds the 2MB size limit`);
        }

        return isValidType && isValidSize;
      });

      if (validFiles.length > 0) {
        // Store file objects for later upload
        setImageFiles((prev) => [...prev, ...validFiles]);

        // Create preview URLs
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
      }

      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    // Remove from arrays
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm">Gambar Product</h3>
      <div className="border-2 border-dashed border-input rounded-md">
        <label className="flex flex-col items-center justify-center cursor-pointer p-4">
          <Upload className="w-8 h-8 text-muted-foreground" />
          <span className="mt-2 text-sm text-muted-foreground">
            Pilih gambar untuk diunggah (gambar pertama akan menjadi gambar utama)
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
            disabled={loading}
          />
        </label>
      </div>

      {imageFiles.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {imageFiles.length} images selected (will be uploaded when you submit the form)
        </p>
      )}

      <div className="flex gap-2 flex-wrap">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative">
            <div className="relative w-40 h-40">
              <Image
                src={preview}
                alt={`Preview ${index}`}
                fill
                className="object-cover rounded-lg border"
              />
              {index === 0 && (
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-br rounded-tl">
                  Main
                </div>
              )}
            </div>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1"
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
