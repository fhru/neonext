'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type ExistingImagesGalleryProps = {
  images: string[];
  onDelete: (imageUrl: string, index: number) => Promise<void>;
  loading: boolean;
};

export function ExistingImagesGallery({ images, onDelete, loading }: ExistingImagesGalleryProps) {
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleDelete = async (imageUrl: string, index: number) => {
    setDeletingIndex(index);
    await onDelete(imageUrl, index);
    setDeletingIndex(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm">Existing Images</h3>
      <div className="flex gap-2 flex-wrap">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative">
            <div className="relative w-40 h-40">
              <Image
                src={imageUrl}
                alt={`Product image ${index}`}
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
              variant="destructive"
              onClick={() => handleDelete(imageUrl, index)}
              className="absolute top-1 right-1"
              disabled={loading || deletingIndex === index}
            >
              {deletingIndex === index ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {images.length} existing images. The first image is used as the main product image.
      </p>
    </div>
  );
}
